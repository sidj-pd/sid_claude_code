#!/usr/bin/env node
/**
 * Cutout art generation — prompt sheet in, source JPG out.
 *
 * The sheet (public/cutouts/README.md) is already the single place every
 * prompt in this project lives, and `~/bin/prompt` already reads it to put one
 * on the clipboard for hand-generation. This does the other half: takes the
 * same entries and renders them, so a thirteen-piece shot is one command
 * instead of thirteen round trips through a browser.
 *
 * WHAT THIS TALKS TO
 *
 * Gemini Flash Image on the public generativelanguage endpoint, with an API
 * key — NOT Imagen, and not Vertex. The two are easy to confuse and work
 * nothing alike: Imagen wants a GCP service account, takes typed reference
 * objects and a real aspectRatio parameter, and prefers keywords. This
 * endpoint takes a key in the query string, takes references as plain inline
 * images that you have to LABEL in prose, has no aspect ratio parameter at
 * all, and responds to being talked to in sentences. Our prompts are
 * paragraphs of art direction, so this is the right one.
 *
 * THE PARTS THAT ARE NOT OBVIOUS
 *
 *   - responseModalities must be ["TEXT","IMAGE"]. Ask for IMAGE alone and the
 *     request is rejected outright.
 *   - There is no aspectRatio parameter. Shape is asked for in prose, and you
 *     get approximately what you asked for — our prompts each state their own
 *     ("a tall narrow portrait shape about twice as tall as it is wide"), and
 *     the keyer trims to the art's real bounds afterwards, so approximate is
 *     fine here in a way it would not be for footage.
 *   - A reference image with no label is used as vague inspiration; a labelled
 *     one is used as an instruction. The label has to be a sentence saying what
 *     the picture is FOR and what to ignore about it — a bare filename reads as
 *     a filename and gets dropped on the floor.
 *   - References go first, the prompt goes LAST. The end of the sequence
 *     carries the most weight.
 *   - finishReason MAX_TOKENS is a SUCCESS. The image is complete; it is the
 *     trailing text part that got cut.
 *
 * Usage:
 *   node scripts/imggen.mjs bank-employee            one entry, by name
 *   node scripts/imggen.mjs bank- token- ledger-     several, by prefix
 *   node scripts/imggen.mjs --missing                every sheet entry with no art yet
 *   node scripts/imggen.mjs --missing --dry-run      list what it would do
 *
 * Existing art is never overwritten without --force: the sheet holds every
 * prompt in the series, and a careless --missing should not be able to redraw
 * Episode 01.
 */

import {Buffer} from 'node:buffer';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import sharp from 'sharp';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SHEET = path.join(ROOT, 'public', 'cutouts', 'README.md');
const OUT_DIR = path.join(ROOT, 'public', 'cutouts');

/**
 * Cheapest first. Each is tried twice before falling through, because a
 * failure here is usually transient and a fall-through costs real money at
 * the next tier up.
 */
const MODELS = [
	'gemini-3.1-flash-lite-image',
	'gemini-3.1-flash-image',
	'gemini-2.5-flash-image',
];

const RATE_USD = (model) => (model.includes('lite') ? 0.0336 : model.includes('pro') ? 0.15 : 0.0672);

const TIMEOUT_MS = 35_000;

/**
 * Attached to every generation, after the entry's own text.
 *
 * The reference implementation this is adapted from pins 16:9 here, because
 * it renders film shots. Ours must NOT: every entry on the sheet states its
 * own shape, and a blanket 16:9 would turn every portrait cutout — the
 * landlord, the file tower, the queue post — on its side.
 *
 * Rule 3 is here rather than in the sheet because it is about text the
 * MODEL adds unasked. Episode 03 lost a newspaper clipping to a misspelt
 * headline the prompt never requested; every entry already bans text, and
 * this bans it again at the position that carries the most weight.
 */
const TAIL = `

CRITICAL INSTRUCTIONS:
1. Render the output image in exactly the shape and proportions described above. Do not letterbox it, do not pad it to a square, and do not add any border, frame or mount.
2. DO NOT enhance, rewrite, or alter this prompt. Render EXACTLY what is described, no more, no less.
3. There must be NO writing anywhere in the image — no words, no letters, no numerals, no labels, no signage, no logos, no watermark, not even on an object that would normally carry them.`;

/**
 * Existing series art, attached to every call so a new piece is cut from the
 * same paper as the old ones. Two, deliberately: an object and a person, since
 * the treatment differs between them and one of each stops the model reading
 * "collage" as "collage of objects".
 *
 * The disclaimer half of each label is the load-bearing half. Without an
 * explicit "do not copy the subject", a style reference gets treated as a
 * composition to imitate and every piece comes back as a variation on a
 * bundle of banknotes.
 */
const STYLE_REFS = [
	[
		'Series Style Reference 1 — an existing piece of art from this same series. Match its MEDIUM AND TREATMENT exactly: the same hand-cut layered construction and craft paper, the same matte slightly desaturated palette, the same visible scissor-cut and torn edges, the same fine halftone grain over the whole piece, the same flat even top lighting with no gloss or gradient, and the same plain flat cream backdrop with clear empty margin on all four sides. DO NOT copy its subject, its pose, its silhouette or its proportions — the subject of this image is described in the prompt text below and is a completely different thing',
		'cash-stack.jpg',
	],
	[
		'Series Style Reference 2 — another existing piece from the same series, included to show how PEOPLE are cut in this style: the same paper, grain, flat lighting and cream backdrop, with faces and hands built from flat shapes rather than shaded. DO NOT copy this person, their clothing, their pose or their build — if the prompt below describes a person, that person is described there and is somebody else',
		'landlord-offer.jpg',
	],
];

/** Longest edge for a reference. Bigger buys nothing here and costs payload. */
const REF_MAX_EDGE = 768;

/**
 * Parse the sheet. A prompt is a level-2 or -3 heading naming a file in
 * backticks, followed by the prompt as a blockquote — the same grammar
 * ~/bin/prompt reads, so the two can never drift.
 */
const parseSheet = () => {
	const out = [];
	let cur = null;
	for (const raw of fs.readFileSync(SHEET, 'utf8').split('\n')) {
		const h = raw.match(/^#{2,3}\s+`([^`]+)`/);
		if (h) {
			cur = {name: h[1], lines: []};
			out.push(cur);
			continue;
		}
		if (!cur) continue;
		if (/^#{1,3}\s/.test(raw)) {
			cur = null;
			continue;
		}
		if (/^>\s?/.test(raw)) cur.lines.push(raw.replace(/^>\s?/, ''));
	}
	return out
		.filter((p) => p.lines.length)
		.map((p) => ({name: p.name, text: p.lines.join('\n').replace(/\n{3,}/g, '\n\n').trim()}));
};

const shrink = async (file) => {
	const buf = await sharp(path.join(OUT_DIR, file))
		.resize({width: REF_MAX_EDGE, height: REF_MAX_EDGE, fit: 'inside', withoutEnlargement: true})
		.jpeg({quality: 80})
		.toBuffer();
	return buf.toString('base64');
};

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const generate = async (entry, key, refParts) => {
	const parts = [...refParts, {text: entry.text + TAIL}];
	const payload = {
		contents: [{parts}],
		generationConfig: {responseModalities: ['TEXT', 'IMAGE']},
	};
	const body = JSON.stringify(payload);
	let last = 'no attempt made';

	for (const model of MODELS) {
		for (const attempt of [1, 2]) {
			const ac = new AbortController();
			const timer = setTimeout(() => ac.abort(), TIMEOUT_MS);
			let data;
			try {
				const res = await fetch(
					`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`,
					{
						method: 'POST',
						headers: {'Content-Type': 'application/json', Connection: 'close'},
						body,
						signal: ac.signal,
					},
				);
				data = await res.json();
			} catch (e) {
				last = `${model}: ${e.message}`;
				await sleep(500);
				continue;
			} finally {
				clearTimeout(timer);
			}

			// Four failure shapes, and all four happen in practice.
			if (data.error) {
				last = `${model}: ${String(data.error.message).slice(0, 140)}`;
				break; // a rejected payload will be rejected again — next model
			}
			const cand = data.candidates?.[0];
			if (!cand) {
				last = `${model}: no candidates`;
				await sleep(500);
				continue;
			}
			// MAX_TOKENS is a SUCCESS: the picture is whole, the text part isn't.
			if (cand.finishReason && !['STOP', 'MAX_TOKENS'].includes(cand.finishReason)) {
				last = `${model}: finishReason ${cand.finishReason}`;
				break; // a safety block is not transient
			}
			for (const part of cand.content?.parts ?? []) {
				if (part.inlineData?.data) {
					const img = Buffer.from(part.inlineData.data, 'base64');
					const meta = await sharp(img).metadata();
					return {img, model, meta, tokens: data.usageMetadata?.totalTokenCount ?? 0};
				}
			}
			last = `${model}: no inlineData in parts`;
			await sleep(500);
		}
	}
	throw new Error(last);
};

const main = async () => {
	const args = process.argv.slice(2);
	const force = args.includes('--force');
	const dry = args.includes('--dry-run');
	const missing = args.includes('--missing');
	const selectors = args.filter((a) => !a.startsWith('--'));

	const key = (process.env.GEMINI_API_KEY ?? '').trim();
	if (!key && !dry) {
		console.error('GEMINI_API_KEY is not set. `set -a && . .env && set +a` first.');
		process.exit(1);
	}

	const sheet = parseSheet();
	let picked = missing
		? sheet.filter((e) => !fs.existsSync(path.join(OUT_DIR, e.name)))
		: sheet.filter((e) => selectors.some((s) => e.name.includes(s)));

	if (!picked.length) {
		console.error(
			selectors.length || missing
				? 'nothing matched'
				: 'usage: node scripts/imggen.mjs <name-or-prefix>... | --missing [--force] [--dry-run]',
		);
		process.exit(1);
	}
	if (!force) {
		const skipped = picked.filter((e) => fs.existsSync(path.join(OUT_DIR, e.name)));
		for (const e of skipped) console.log(`skip  ${e.name} — already drawn (--force to redraw)`);
		picked = picked.filter((e) => !fs.existsSync(path.join(OUT_DIR, e.name)));
	}
	if (!picked.length) return;

	console.log(`${picked.length} to draw:\n${picked.map((e) => '  ' + e.name).join('\n')}\n`);
	if (dry) return;

	const refParts = [];
	for (const [label, file] of STYLE_REFS) {
		if (!fs.existsSync(path.join(OUT_DIR, file))) {
			console.log(`  (style reference ${file} missing — going without it)`);
			continue;
		}
		refParts.push({text: `Attached Reference Image (${label}):`});
		refParts.push({inlineData: {mimeType: 'image/jpeg', data: await shrink(file)}});
	}

	let spend = 0;
	const failed = [];
	for (const entry of picked) {
		process.stdout.write(`${entry.name} … `);
		try {
			const {img, model, meta, tokens} = await generate(entry, key, refParts);
			fs.writeFileSync(path.join(OUT_DIR, entry.name), img);
			spend += RATE_USD(model);
			console.log(
				`${meta.width}x${meta.height}  ${(img.length / 1024).toFixed(0)}kB  ${tokens} tok  (${model})`,
			);
		} catch (e) {
			console.log(`FAILED — ${e.message}`);
			failed.push(entry.name);
		}
	}
	console.log(`\n~$${spend.toFixed(2)}${failed.length ? `, failed: ${failed.join(', ')}` : ''}`);
	if (failed.length) process.exit(1);
};

main();

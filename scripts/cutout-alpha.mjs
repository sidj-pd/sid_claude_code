/**
 * Turns the generated cutout art (flat JPGs on a cream backdrop) into real
 * transparent PNGs, so a CSS drop-shadow hugs the artwork's actual
 * silhouette instead of tracing a rectangular card edge.
 *
 * Uses a flood fill seeded from the image border rather than a global
 * "remove everything light" threshold: the artwork itself contains plenty of
 * cream (the Vidhana Soudha dome, the MG ROAD lettering, the metro doors),
 * and a global threshold punches holes straight through it. Only background
 * that is actually connected to the edge gets removed.
 *
 * Usage: node scripts/cutout-alpha.mjs
 */
import {readdir} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import sharp from 'sharp';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const SRC_DIR = path.join(HERE, '..', 'public', 'cutouts');
const OUT_DIR = path.join(HERE, '..', 'public', 'cutouts-alpha');

/** How far a pixel may drift from the sampled background colour and still
 * count as background. Generous enough to swallow the paper grain and the
 * soft baked-in shadow, tight enough to stop at the artwork's edge. */
const TOLERANCE = 38;
/**
 * Enclosed regions (the auto's cabin, gaps between columns) are the same
 * backdrop showing through, but a border-seeded fill can never reach them.
 * A second pass clears them — at a much tighter tolerance, because genuinely
 * cream *artwork* (the Vidhana Soudha dome, the MG ROAD lettering, the metro
 * doors) is only a few values off the backdrop and must survive.
 */
const INTERIOR_TOLERANCE = 10;
/** Ignore tiny interior matches so we punch holes, not speckle. */
const MIN_HOLE_AREA = 400;
/** Pixels of alpha falloff at the boundary, so edges don't look stair-stepped. */
const FEATHER = 1.5;

/**
 * Per-asset overrides. `inset` (a fraction of the shorter side) ignores a
 * border region and seeds the fill from inside it instead — needed when the
 * source art sits on a deckle-edged paper *sheet* that fills the canvas, so
 * the true backdrop at the very corners is the sheet's edge rather than the
 * colour surrounding the subject.
 */
const OVERRIDES = {
	'traffic-signal': {inset: 0.1},
};

const removeBackground = async (srcPath, outPath, options = {}) => {
	const image = sharp(srcPath).ensureAlpha();
	const {width, height} = await image.metadata();
	const raw = await image.raw().toBuffer();

	// Everything outside this rectangle is treated as background outright,
	// and the colour sample + flood seeds come from its border.
	const margin = Math.round(Math.min(width, height) * (options.inset ?? 0));
	const x0 = margin;
	const y0 = margin;
	const x1 = width - 1 - margin;
	const y1 = height - 1 - margin;

	// Sample the background colour from the four corners of that rectangle
	// (reliably backdrop, never artwork) and average them.
	const corners = [
		[x0, y0],
		[x1, y0],
		[x0, y1],
		[x1, y1],
	];
	let br = 0;
	let bg = 0;
	let bb = 0;
	for (const [cx, cy] of corners) {
		const i = (cy * width + cx) * 4;
		br += raw[i];
		bg += raw[i + 1];
		bb += raw[i + 2];
	}
	br /= corners.length;
	bg /= corners.length;
	bb /= corners.length;

	const isBackground = (i) => {
		const dr = raw[i] - br;
		const dg = raw[i + 1] - bg;
		const db = raw[i + 2] - bb;
		return Math.sqrt(dr * dr + dg * dg + db * db) <= TOLERANCE;
	};

	// Iterative flood fill (an explicit stack, not recursion — these images
	// are ~4.3M pixels and would blow the call stack).
	const visited = new Uint8Array(width * height);
	const stack = [];
	// Anything outside the inset rectangle is background by definition.
	if (margin > 0) {
		for (let y = 0; y < height; y++) {
			for (let x = 0; x < width; x++) {
				if (x < x0 || x > x1 || y < y0 || y > y1) {
					visited[y * width + x] = 1;
				}
			}
		}
	}
	for (let x = x0; x <= x1; x++) {
		stack.push([x, y0], [x, y1]);
	}
	for (let y = y0; y <= y1; y++) {
		stack.push([x0, y], [x1, y]);
	}

	while (stack.length > 0) {
		const [x, y] = stack.pop();
		if (x < 0 || y < 0 || x >= width || y >= height) continue;
		const p = y * width + x;
		if (visited[p]) continue;
		if (!isBackground(p * 4)) continue;
		visited[p] = 1;
		stack.push([x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]);
	}

	// Second pass: enclosed holes the border fill could not reach.
	const nearBackground = (i) => {
		const dr = raw[i] - br;
		const dg = raw[i + 1] - bg;
		const db = raw[i + 2] - bb;
		return Math.sqrt(dr * dr + dg * dg + db * db) <= INTERIOR_TOLERANCE;
	};

	const considered = new Uint8Array(width * height);
	for (let seed = 0; seed < width * height; seed++) {
		if (visited[seed] || considered[seed] || !nearBackground(seed * 4)) continue;

		// Collect this connected component before deciding whether to clear it.
		const component = [];
		const queue = [seed];
		considered[seed] = 1;
		while (queue.length > 0) {
			const p = queue.pop();
			component.push(p);
			const x = p % width;
			const y = (p - x) / width;
			const neighbours = [
				x + 1 < width ? p + 1 : -1,
				x - 1 >= 0 ? p - 1 : -1,
				y + 1 < height ? p + width : -1,
				y - 1 >= 0 ? p - width : -1,
			];
			for (const n of neighbours) {
				if (n < 0 || considered[n] || visited[n]) continue;
				if (!nearBackground(n * 4)) continue;
				considered[n] = 1;
				queue.push(n);
			}
		}

		if (component.length >= MIN_HOLE_AREA) {
			for (const p of component) {
				visited[p] = 1;
			}
		}
	}

	// Write alpha, feathering the boundary by looking at how many neighbours
	// are also background.
	for (let y = 0; y < height; y++) {
		for (let x = 0; x < width; x++) {
			const p = y * width + x;
			if (!visited[p]) continue;
			let neighbours = 0;
			let bgNeighbours = 0;
			for (let dy = -1; dy <= 1; dy++) {
				for (let dx = -1; dx <= 1; dx++) {
					const nx = x + dx;
					const ny = y + dy;
					if (nx < 0 || ny < 0 || nx >= width || ny >= height) continue;
					neighbours++;
					if (visited[ny * width + nx]) bgNeighbours++;
				}
			}
			const ratio = bgNeighbours / neighbours;
			raw[p * 4 + 3] = ratio >= 1 ? 0 : Math.round(255 * (1 - ratio) * FEATHER * 0.5);
		}
	}

	await sharp(raw, {raw: {width, height, channels: 4}})
		.png({compressionLevel: 9})
		.toFile(outPath);

	const kept = visited.reduce((acc, v) => acc + (v ? 0 : 1), 0);
	return {width, height, keptRatio: kept / (width * height)};
};

const main = async () => {
	const files = (await readdir(SRC_DIR)).filter((f) => /\.(jpe?g|png)$/i.test(f));
	for (const file of files) {
		const base = file.replace(/\.[^.]+$/, '');
		const outPath = path.join(OUT_DIR, `${base}.png`);
		const {width, height, keptRatio} = await removeBackground(
			path.join(SRC_DIR, file),
			outPath,
			OVERRIDES[base] ?? {},
		);
		console.log(`${base}: ${width}x${height}, kept ${(keptRatio * 100).toFixed(1)}% opaque`);
	}
};

main();

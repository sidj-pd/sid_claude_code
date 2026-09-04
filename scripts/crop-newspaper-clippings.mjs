/**
 * Crops the keyed newspaper clippings down to just their photo, plus a
 * little of the surrounding torn paper and body text.
 *
 * The generated clippings are photographed as full torn-off article
 * fragments — photo, headline-shaped scribble, and a full column of greeked
 * body text — which runs nearly the height of a 9:16 frame on its own. Two
 * headlines sharing that frame need a compact crop, not the full clipping,
 * so this runs after cutout-alpha.mjs and overwrites its output for these
 * three assets specifically. Re-run after re-keying them.
 *
 * Usage: node scripts/crop-newspaper-clippings.mjs
 */
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import sharp from 'sharp';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const DIR = path.join(HERE, '..', 'public', 'cutouts-alpha');
const SRC_DIR = path.join(HERE, '..', 'public', 'cutouts');

/** Source pixel crop box per clipping, found by eye off the keyed PNG. */
const CROPS = {
	'newspaper-clip-autounion': {top: 440, height: 660},
	'newspaper-clip-victim': {top: 0, height: 780},
	'newspaper-clip-committee': {top: 0, height: 680},
	/*
	 * Episode 02, and these crop from the SOURCE jpg rather than the keyed PNG.
	 *
	 * A clipping never needs alpha: NewsHeadline shows it in a box with
	 * overflow: hidden and object-fit: cover, so the outline is the box, not the
	 * silhouette. Episode 01's clippings still key first because they were
	 * photographed on wood and the alpha is what removes it. Episode 02's were
	 * shot on cream, which the keyer cannot separate from cream paper at all —
	 * measured 4-10 values apart against a tolerance of 38 — so keying them
	 * only punches holes through the paper. Cropping the source skips the
	 * problem entirely, and cream around a clipping is invisible on a cream page.
	 *
	 * Photo bands located by scanning for rows that are mid-grey heavy: paper
	 * sits near 225-240 and body text is thin strokes on paper, so only a press
	 * photo fills a row with mid tones.
	 */
	'newspaper-clip-managers': {top: 600, height: 430, fromSource: true},
	'newspaper-clip-ownclaim': {top: 431, height: 549, fromSource: true},
	'newspaper-clip-hrcommittee': {top: 403, height: 611, fromSource: true},
	/*
	 * Episode 03. Both cropped tight to the photo band and nothing else, which
	 * is what keeps the code-set headline visibly separate from the picture:
	 * a crop that also carries the clipping's own empty top third puts a band
	 * of blank newsprint between the headline and the photo, and one that
	 * reaches the body text puts small print under it. Bands found by
	 * rendering candidate crops and looking at them — the row-scan heuristics
	 * this file's notes describe kept locking onto the grey backdrop instead.
	 *
	 * The generator's watermark sits low-right in both sources, well below
	 * these bands, so the crop excludes it for free.
	 */
	'newspaper-clip-landlords': {top: 510, height: 380, fromSource: true},
	'newspaper-clip-tenantclaim': {top: 515, height: 375, fromSource: true},
};

const main = async () => {
	for (const [name, {top, height, fromSource}] of Object.entries(CROPS)) {
		const out = path.join(DIR, `${name}.png`);
		const src = fromSource ? path.join(SRC_DIR, `${name}.jpg`) : out;
		const {width} = await sharp(src).metadata();
		const cropped = await sharp(src)
			.extract({left: 0, top, width, height})
			.png({compressionLevel: 9})
			.toBuffer();
		await sharp(cropped).toFile(out);
		console.log(
			`${name}: cropped to ${width}x${height} from y=${top}${fromSource ? ' (from source)' : ''}`,
		);
	}
};

main();

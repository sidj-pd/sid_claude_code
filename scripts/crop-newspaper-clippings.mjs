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
	 * Episode 03. These start below the clipping's own empty top third — that
	 * blank band is what the code-set headline replaces, and carrying it into
	 * the box would put a strip of empty newsprint between the headline and
	 * the picture — and run down through the photo, its caption line, and a
	 * good depth of the body-text columns.
	 *
	 * Cropping to the photo ALONE was the first attempt and was wrong: with
	 * no caption and no columns under it the clipping stopped reading as
	 * newsprint at all and just looked like a photograph with a headline
	 * above it. The body text is the thing that says "newspaper", so it is
	 * in the crop even though it costs height — which is why Shot 6's
	 * headline blocks are narrower than Episode 02's, to fit two tall
	 * clippings in one 9:16 page.
	 *
	 * Bands found by rendering candidate crops and looking at them — the
	 * row-scan heuristics this file's notes describe kept locking onto the
	 * grey backdrop instead.
	 *
	 * The generator's watermark sits low-right in both sources, well below
	 * these bands, so the crop excludes it for free.
	 */
	'newspaper-clip-landlords': {left: 60, top: 500, width: 635, height: 560, fromSource: true},
	'newspaper-clip-tenantclaim': {left: 110, top: 505, width: 605, height: 545, fromSource: true},
};

const main = async () => {
	for (const [name, {left, top, width: cropW, height, fromSource}] of Object.entries(CROPS)) {
		const out = path.join(DIR, `${name}.png`);
		const src = fromSource ? path.join(SRC_DIR, `${name}.jpg`) : out;
		const meta = await sharp(src).metadata();
		// Episode 03's two crop horizontally as well. Cropping only vertically
		// leaves the surface the clipping was photographed ON inside the box —
		// it rendered as grey bands down both sides of the newsprint, since
		// NewsHeadline's object-fit: cover has nothing to trim when the box
		// matches the crop's aspect.
		const width = cropW ?? meta.width;
		const cropped = await sharp(src)
			.extract({left: left ?? 0, top, width, height})
			.png({compressionLevel: 9})
			.toBuffer();
		await sharp(cropped).toFile(out);
		console.log(
			`${name}: cropped to ${width}x${height} from y=${top}${fromSource ? ' (from source)' : ''}`,
		);
	}
};

main();

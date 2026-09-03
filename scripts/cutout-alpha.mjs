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
import {mkdir, readdir} from 'node:fs/promises';
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
/** Alpha above which a pixel counts as artwork when trimming. */
const TRIM_ALPHA = 24;
/** A couple of pixels of margin, so the feathered edge is not clipped. */
const TRIM_PAD = 2;
/**
 * Fraction of a row (or column) that must be opaque for it to count as
 * artwork. A plain bounding box is too eager: flat-wall had roughly 200
 * scattered opaque pixels in a sparse strip below its skirting, which stretched
 * the box 150px past the wall and left the piece rendering at 1.18 wide when
 * the layout had been told 0.94. Requiring real coverage ignores debris while
 * still keeping the crack's detached flakes, which are dense where they exist.
 */
const TRIM_COVERAGE = 0.02;
/** ...but never demand more than a few pixels, for genuinely thin pieces. */
const TRIM_MIN_PIXELS = 3;

const OVERRIDES = {
	// Episode 03's flat. Trimmed so each piece can be positioned by its own
	// artwork: the wall is a base layer and the other three are overlays laid
	// on top of it in code, which only works if a box places the art itself.
	'flat-wall': {trim: true},
	'wall-crack': {trim: true},
	'poster-patch': {trim: true},
	'wall-stain': {trim: true},
	'flat-floor': {trim: true},
	'floor-tile-cracked': {trim: true},
	/*
	 * His key-ring is drawn as cream shapes with dark outlines, measured at
	 * delta 7 from the backdrop — the bodies are the same tone as the ground
	 * they sit on. The enclosed-hole pass punched them out and left an outline
	 * skeleton with the wall showing through, which read as a ragged pale blob
	 * in his hand.
	 *
	 * interior:false keeps the keys but fills the enclosed gaps between his arm
	 * and torso and between his legs with cream, which reads as a keying error.
	 * Neither tolerance nor hole area separates the two cases: measured, the
	 * keys and the leg gap are both cream at delta 3-20, and the keys' area is
	 * the larger of the two. So the pass runs everywhere except the box his
	 * hand occupies. Tolerance 60 also clears the cream fringe along his arm;
	 * his nearest real tone is skin at 122.
	 */
	'tenant-tense': {
		trim: true,
		tolerance: 60,
		interiorExclude: [0.17, 0.52, 0.32, 0.66],
	},
	// A putty kurta on a cream backdrop looked like the Episode 02 clipping
	// problem, so this started at tolerance 22 out of caution. Measured, the
	// kurta's lightest tone is 54 off the backdrop, so the default 38 was never
	// a risk and 22 was too tight: it left a ring of un-keyed cream edge pixels
	// which was invisible on the field but showed as white speckle once the
	// figure stood on the grey floor. 42 clears the fringe and stays clear of
	// the garment.
	'landlord-offer': {trim: true, tolerance: 42},
	'cash-stack': {trim: true},
	'traffic-signal': {inset: 0.1},
	// Its windscreen is a large enclosed cream area that IS artwork (glass),
	// not backdrop showing through, so the enclosed-hole pass must be off or
	// it punches the screen out of the vehicle.
	'auto-driver-34': {interior: false},
	// Carries a soft grey drop shadow baked onto the cream; the default
	// tolerance stops at the shadow's edge and leaves it as a halo.
	'hailing-hand': {tolerance: 72},
	// Sits on a paper sheet whose edges leave thin vertical seams, and has a
	// soft ground shadow under the feet. Both are only just darker than the
	// backdrop, so a wider tolerance takes them; the figure's own tones
	// (mustard bag, skin) are far enough off cream to survive it.
	'passenger-leaning': {tolerance: 60},
	// Photographed on a wood table rather than a flat backdrop: real grain
	// and a soft vignette mean the corners are noisier than a studio shot,
	// so this needs a wider tolerance than the plain-grey clippings.
	'newspaper-clip-autounion': {tolerance: 46},
	// Episode 02. Arrived mounted on a paper sheet with a visible edge about
	// 20px in from the frame, so a border-seeded fill starts in the outer
	// margin and stops at that line, leaving a speckled frame of surviving
	// paper all round. Seeding inside the sheet skips it.
	'laptop-screen': {inset: 0.06},
};

const removeBackground = async (srcPath, outPath, options = {}) => {
	const image = sharp(srcPath).ensureAlpha();
	const {width, height} = await image.metadata();
	const raw = await image.raw().toBuffer();

	/*
	 * A region of the canvas the enclosed-hole pass must leave alone, given as
	 * [x0, y0, x1, y1] fractions of the source.
	 */
	const exclude = options.interiorExclude
		? {
				x0: Math.round(options.interiorExclude[0] * width),
				y0: Math.round(options.interiorExclude[1] * height),
				x1: Math.round(options.interiorExclude[2] * width),
				y1: Math.round(options.interiorExclude[3] * height),
			}
		: null;

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

	const tolerance = options.tolerance ?? TOLERANCE;
	const isBackground = (i) => {
		const dr = raw[i] - br;
		const dg = raw[i + 1] - bg;
		const db = raw[i + 2] - bb;
		return Math.sqrt(dr * dr + dg * dg + db * db) <= tolerance;
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
	const skipInterior = options.interior === false;
	const nearBackground = (i) => {
		const dr = raw[i] - br;
		const dg = raw[i + 1] - bg;
		const db = raw[i + 2] - bb;
		return Math.sqrt(dr * dr + dg * dg + db * db) <= INTERIOR_TOLERANCE;
	};

	const considered = new Uint8Array(width * height);
	for (let seed = 0; seed < width * height; seed++) {
		if (skipInterior) break;
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

		// An enclosed region inside an excluded box is cream *artwork*, not
		// backdrop showing through, and must survive the pass. See the
		// interiorExclude note in OVERRIDES.
		const excluded =
			exclude !== null &&
			component.some((q) => {
				const qx = q % width;
				const qy = (q - qx) / width;
				return qx >= exclude.x0 && qx <= exclude.x1 && qy >= exclude.y0 && qy <= exclude.y1;
			});

		if (!excluded && component.length >= MIN_HOLE_AREA) {
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

	let out = sharp(raw, {raw: {width, height, channels: 4}});
	let outW = width;
	let outH = height;

	/*
	 * Optionally crop the transparent margin away, so the PNG's own bounds ARE
	 * the artwork's bounds.
	 *
	 * Without this, a keyed cutout is the artwork floating in whatever canvas
	 * the generator produced — typically 768x1376 around a subject half that
	 * size. The renderer draws it with objectFit:contain, which fits the padded
	 * canvas rather than the art, so a box positioned in code places the
	 * padding and the artwork lands somewhere inside it at an unpredictable
	 * size. Episode 03's wall came out 540px wide in a 1000px box, with its
	 * three overlays sitting off the wall entirely. PaperCutout's texture
	 * overlay also paints the whole div, so the padding showed as a pale
	 * rectangle around every piece.
	 *
	 * It is opt-in rather than the default because Episodes 01 and 02 have
	 * every position tuned against the padded canvases; trimming those now
	 * would silently move and resize art in shots that are already finished.
	 */
	if (options.trim) {
		const rows = new Int32Array(height);
		const cols = new Int32Array(width);
		for (let y = 0; y < height; y++) {
			for (let x = 0; x < width; x++) {
				if (raw[(y * width + x) * 4 + 3] > TRIM_ALPHA) {
					rows[y]++;
					cols[x]++;
				}
			}
		}
		const rowMin = Math.max(TRIM_MIN_PIXELS, Math.round(width * TRIM_COVERAGE));
		const colMin = Math.max(TRIM_MIN_PIXELS, Math.round(height * TRIM_COVERAGE));
		const span = (counts, min) => {
			let lo = -1;
			let hi = -1;
			for (let i = 0; i < counts.length; i++) {
				if (counts[i] >= min) {
					if (lo < 0) lo = i;
					hi = i;
				}
			}
			return [lo, hi];
		};
		const [ty0, ty1] = span(rows, rowMin);
		const [tx0, tx1] = span(cols, colMin);
		if (tx1 >= tx0 && ty1 >= ty0) {
			const left = Math.max(0, tx0 - TRIM_PAD);
			const top = Math.max(0, ty0 - TRIM_PAD);
			outW = Math.min(width - left, tx1 - tx0 + 1 + TRIM_PAD * 2);
			outH = Math.min(height - top, ty1 - ty0 + 1 + TRIM_PAD * 2);
			out = out.extract({left, top, width: outW, height: outH});
		}
	}

	await out.png({compressionLevel: 9}).toFile(outPath);

	const kept = visited.reduce((acc, v) => acc + (v ? 0 : 1), 0);
	return {width: outW, height: outH, keptRatio: kept / (width * height)};
};

const main = async () => {
	// cutouts-alpha/ is gitignored, so it is absent on a fresh clone and vips
	// then fails with an opaque 'wbuffer_write: write failed' rather than ENOENT.
	await mkdir(OUT_DIR, {recursive: true});

	const only = process.argv.slice(2);
	const files = (await readdir(SRC_DIR))
		.filter((f) => /\.(jpe?g|png)$/i.test(f))
		.filter((f) => only.length === 0 || only.includes(f.replace(/\.[^.]+$/, '')));
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

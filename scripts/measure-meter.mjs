/**
 * Measures the fare meter's display panel and its four digit tiles, and
 * prints them as fractions of the image.
 *
 * The numbers it prints live in src/compositions/episode01/meter.ts.
 * They are measured rather than eyeballed because the fare overlay has to
 * land exactly on the art's own digit tiles: a few pixels out and it reads as
 * a number stuck on top of a picture of a meter rather than as the meter's
 * reading changing.
 *
 * Method: the panel is the largest connected BRIGHT region in the image (the
 * cream display), and the digits are the large connected DARK regions inside
 * it. Connected components rather than thresholded bounding boxes, because a
 * plain threshold also catches the cream paper elsewhere in the housing.
 *
 * Usage: node scripts/measure-meter.mjs
 */
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import sharp from 'sharp';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const SRC = path.join(HERE, '..', 'public', 'cutouts-alpha', 'auto-meter-body.png');

const BRIGHT = 200;
const DARK = 120;
/** Ignore specks: the digits are thousands of pixels, dirt and grain are not. */
const MIN_BLOB = 2500;

const luma = (raw, i) => raw[i * 4] * 0.3 + raw[i * 4 + 1] * 0.59 + raw[i * 4 + 2] * 0.11;

/** Flood-fills `mask` into connected components, largest first. */
const components = (mask, W, H, minArea) => {
	const seen = new Uint8Array(W * H);
	const found = [];
	for (let i = 0; i < W * H; i++) {
		if (!mask[i] || seen[i]) continue;
		const stack = [i];
		seen[i] = 1;
		let area = 0;
		let x0 = W;
		let y0 = H;
		let x1 = 0;
		let y1 = 0;
		while (stack.length) {
			const c = stack.pop();
			const cx = c % W;
			const cy = (c - cx) / W;
			area++;
			if (cx < x0) x0 = cx;
			if (cx > x1) x1 = cx;
			if (cy < y0) y0 = cy;
			if (cy > y1) y1 = cy;
			for (const n of [c - 1, c + 1, c - W, c + W]) {
				// The ±1 guard stops the fill wrapping around a row's end.
				if (n < 0 || n >= W * H || Math.abs((n % W) - cx) > 1) continue;
				if (!mask[n] || seen[n]) continue;
				seen[n] = 1;
				stack.push(n);
			}
		}
		if (area >= minArea) found.push({area, x0, y0, x1, y1});
	}
	return found.sort((a, b) => b.area - a.area);
};

const main = async () => {
	const img = sharp(SRC);
	const {width: W, height: H} = await img.metadata();
	const raw = await img.raw().toBuffer();

	const bright = new Uint8Array(W * H);
	for (let i = 0; i < W * H; i++) {
		if (raw[i * 4 + 3] >= 200 && luma(raw, i) >= BRIGHT) bright[i] = 1;
	}
	const panel = components(bright, W, H, MIN_BLOB)[0];
	if (!panel) throw new Error('no display panel found');

	const dark = new Uint8Array(W * H);
	for (let y = panel.y0; y <= panel.y1; y++) {
		for (let x = panel.x0; x <= panel.x1; x++) {
			const i = y * W + x;
			if (luma(raw, i) < DARK) dark[i] = 1;
		}
	}
	// Digit tiles are tall: taller than wide, and a good fraction of the panel.
	// That drops the decimal point and the counters inside each zero. The 0.30
	// height gate is what separates the tiles (0.34-0.38 of the panel) from the
	// rupee glyph (0.27), which is otherwise the same shape and darkness.
	const tiles = components(dark, W, H, MIN_BLOB)
		.filter((b) => {
			const w = b.x1 - b.x0 + 1;
			const h = b.y1 - b.y0 + 1;
			return h > w * 1.4 && h > (panel.y1 - panel.y0) * 0.3;
		})
		.sort((a, b) => a.x0 - b.x0);

	const f = (n) => n.toFixed(4);
	console.log(`image ${W}x${H}`);
	console.log(
		`PANEL_CENTRE  {x: ${f((panel.x0 + panel.x1) / 2 / W)}, y: ${f((panel.y0 + panel.y1) / 2 / H)}}`,
	);
	console.log(`FARE_TILES  (${tiles.length} found)`);
	for (const t of tiles) {
		console.log(
			`\t{left: ${f(t.x0 / W)}, top: ${f(t.y0 / H)}, ` +
				`width: ${f((t.x1 - t.x0 + 1) / W)}, height: ${f((t.y1 - t.y0 + 1) / H)}},`,
		);
	}
};

main();

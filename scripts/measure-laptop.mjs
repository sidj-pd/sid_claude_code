/**
 * Finds the laptop's dark screen panel in the keyed cutout and prints its box
 * as fractions, so a shot can place code-rendered content on the screen from
 * measured numbers instead of eyeballed ones.
 *
 * Same job scripts/measure-meter.mjs does for the fare meter's digit tiles:
 * every geometric constant in this project that was guessed had to be
 * corrected, and every one derived by connected-component analysis held.
 *
 * Usage: node scripts/measure-laptop.mjs
 */
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import sharp from 'sharp';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const SRC = path.join(HERE, '..', 'public', 'cutouts-alpha', 'laptop-screen.png');

/** Anything this dark is screen, not chassis. The body is mid slate. */
const DARK = 88;

const {data, info} = await sharp(SRC).raw().toBuffer({resolveWithObject: true});
const {width: W, height: H, channels: C} = info;

const isScreen = (i) => {
	const o = i * C;
	if (data[o + 3] < 128) return false;
	return (data[o] * 0.299 + data[o + 1] * 0.587 + data[o + 2] * 0.114) < DARK;
};

// Largest connected dark region — the panel. Anything smaller is a key legend
// or the gap under the hinge.
const seen = new Uint8Array(W * H);
let best = null;
for (let i = 0; i < W * H; i++) {
	if (!isScreen(i) || seen[i]) continue;
	let count = 0;
	let minX = W, maxX = 0, minY = H, maxY = 0;
	const stack = [i];
	seen[i] = 1;
	while (stack.length) {
		const p = stack.pop();
		count++;
		const x = p % W;
		const y = (p - x) / W;
		if (x < minX) minX = x;
		if (x > maxX) maxX = x;
		if (y < minY) minY = y;
		if (y > maxY) maxY = y;
		for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
			const nx = x + dx, ny = y + dy;
			if (nx < 0 || ny < 0 || nx >= W || ny >= H) continue;
			const q = ny * W + nx;
			if (!seen[q] && isScreen(q)) { seen[q] = 1; stack.push(q); }
		}
	}
	if (!best || count > best.count) best = {count, minX, maxX, minY, maxY};
}

if (!best) {
	console.error('no dark panel found — is the screen actually dark in the source?');
	process.exit(1);
}

const f = (v, d) => (v / d).toFixed(4);
console.log(`image            ${W}x${H}`);
console.log(`screen pixels    ${best.count}  (${((100 * best.count) / (W * H)).toFixed(1)}% of frame)`);
console.log(`screen box       ${best.minX},${best.minY} -> ${best.maxX},${best.maxY}`);
console.log('');
console.log('As fractions of the cutout, for the shot to consume verbatim:');
console.log(`  SCREEN_LEFT   = ${f(best.minX, W)}`);
console.log(`  SCREEN_TOP    = ${f(best.minY, H)}`);
console.log(`  SCREEN_WIDTH  = ${f(best.maxX - best.minX, W)}`);
console.log(`  SCREEN_HEIGHT = ${f(best.maxY - best.minY, H)}`);
console.log(`  SCREEN_CENTRE = ${f((best.minX + best.maxX) / 2, W)}, ${f((best.minY + best.maxY) / 2, H)}`);

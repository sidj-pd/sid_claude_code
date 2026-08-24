/**
 * Splits the fare-meter cutout into two layers so the flag lever can rotate
 * independently of the housing.
 *
 * The source art has the lever attached and raised. Simply erasing it leaves
 * a hole, because between y≈0.40 and 0.50 the arm passes IN FRONT of the
 * meter's right shoulder. So erased pixels that were body get patched by
 * copying from a vertical strip further left — that side of the housing is a
 * near-uniform grey/olive column, so the copy is invisible.
 *
 * Outputs:
 *   auto-meter-body.png   the housing, lever removed and patched
 *   auto-meter-lever.png  the arm and flag alone, cropped
 * and prints the pivot's position inside the lever crop, which the shot needs
 * as its transform-origin.
 *
 * Usage: node scripts/split-meter.mjs
 */
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import sharp from 'sharp';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const DIR = path.join(HERE, '..', 'public', 'cutouts-alpha');

// Read off the grid overlay of the keyed image, in normalised coordinates.
const PIVOT = {x: 0.632, y: 0.505}; // where the arm enters the housing slot
const ARM_END = {x: 0.80, y: 0.235}; // run the band up into the flag itself
const ARM_HALF_WIDTH = 0.043;
const FLAG_BOX = {x0: 0.705, y0: 0.12, x1: 0.99, y1: 0.38};
/** How far left the patch may search for intact housing to copy from. */
const PATCH_SEARCH = 0.3;
/**
 * Anything opaque above the housing's top edge and right of centre can only
 * be leftover arm — the band misses a sliver of it where the arm tapers, and
 * a stray spike pointing up while the lever reads "down" is very visible.
 */
const CLEANUP = {yBelow: 0.318, xBeyond: 0.55};

const main = async () => {
	const src = sharp(path.join(DIR, 'auto-meter.png'));
	const {width: W, height: H} = await src.metadata();
	const raw = await src.raw().toBuffer();

	const px = {x: PIVOT.x * W, y: PIVOT.y * H};
	const ax = {x: ARM_END.x * W, y: ARM_END.y * H};
	const halfW = ARM_HALF_WIDTH * W;

	// Distance from a point to the arm's centre line, treated as a segment.
	const vx = ax.x - px.x;
	const vy = ax.y - px.y;
	const vLen2 = vx * vx + vy * vy;
	const onArm = (x, y) => {
		const t = Math.max(0, Math.min(1, ((x - px.x) * vx + (y - px.y) * vy) / vLen2));
		const dx = x - (px.x + t * vx);
		const dy = y - (px.y + t * vy);
		return Math.sqrt(dx * dx + dy * dy) <= halfW;
	};
	const onFlag = (x, y) =>
		x >= FLAG_BOX.x0 * W && x <= FLAG_BOX.x1 * W && y >= FLAG_BOX.y0 * H && y <= FLAG_BOX.y1 * H;

	// Mark every pixel belonging to the lever.
	const isLever = new Uint8Array(W * H);
	for (let y = 0; y < H; y++) {
		for (let x = 0; x < W; x++) {
			const p = y * W + x;
			if (raw[p * 4 + 3] < 8) continue; // background, nothing to move
			if (onArm(x, y) || onFlag(x, y)) isLever[p] = 1;
		}
	}

	const body = Buffer.from(raw);
	const lever = Buffer.alloc(W * H * 4, 0);
	const maxSearch = Math.round(PATCH_SEARCH * W);
	let minX = W;
	let minY = H;
	let maxX = 0;
	let maxY = 0;

	for (let y = 0; y < H; y++) {
		for (let x = 0; x < W; x++) {
			const p = y * W + x;
			if (!isLever[p]) continue;

			// Move the pixel to the lever layer.
			for (let c = 0; c < 4; c++) lever[p * 4 + c] = raw[p * 4 + c];
			if (x < minX) minX = x;
			if (y < minY) minY = y;
			if (x > maxX) maxX = x;
			if (y > maxY) maxY = y;

			// Patch the hole it leaves — but only where the arm actually crossed
			// the housing, not where it was floating in open air. The test is
			// whether intact body exists on BOTH sides of this pixel on its row:
			// searching only leftward finds distant housing for arm pixels high
			// above the meter and smears it across empty space.
			let left = -1;
			for (let d = 1; d <= maxSearch && x - d >= 0; d++) {
				const sp = y * W + (x - d);
				if (!isLever[sp] && raw[sp * 4 + 3] > 200) {
					left = x - d;
					break;
				}
			}
			let right = -1;
			for (let d = 1; d <= maxSearch && x + d < W; d++) {
				const sp = y * W + (x + d);
				if (!isLever[sp] && raw[sp * 4 + 3] > 200) {
					right = x + d;
					break;
				}
			}
			if (left >= 0 && right >= 0) {
				// Inside the housing, so patch. Source the pixel from directly
				// ABOVE rather than from the side: this part of the housing is a
				// vertically uniform grey/olive column, whereas the nearest pixel
				// to the left is often the cream display panel, which patches a
				// bright smear into dark metal.
				let src = -1;
				for (let d = 1; d <= maxSearch && y - d >= 0; d++) {
					const sp = (y - d) * W + x;
					if (!isLever[sp] && raw[sp * 4 + 3] > 200) {
						src = sp;
						break;
					}
				}
				if (src < 0) src = y * W + left;
				for (let c = 0; c < 4; c++) body[p * 4 + c] = raw[src * 4 + c];
			} else {
				body[p * 4 + 3] = 0;
			}
		}
	}

	for (let y = 0; y < Math.round(CLEANUP.yBelow * H); y++) {
		for (let x = Math.round(CLEANUP.xBeyond * W); x < W; x++) {
			body[(y * W + x) * 4 + 3] = 0;
		}
	}

	await sharp(body, {raw: {width: W, height: H, channels: 4}})
		.png({compressionLevel: 9})
		.toFile(path.join(DIR, 'auto-meter-body.png'));

	const lw = maxX - minX + 1;
	const lh = maxY - minY + 1;
	await sharp(lever, {raw: {width: W, height: H, channels: 4}})
		.extract({left: minX, top: minY, width: lw, height: lh})
		.png({compressionLevel: 9})
		.toFile(path.join(DIR, 'auto-meter-lever.png'));

	console.log(`body   ${W}x${H}`);
	console.log(`lever  ${lw}x${lh}  crop at (${minX}, ${minY})`);
	console.log(
		`pivot inside lever crop: ${(((px.x - minX) / lw) * 100).toFixed(1)}% ` +
			`${(((px.y - minY) / lh) * 100).toFixed(1)}%`,
	);
	console.log(
		`lever box within meter:  left ${((minX / W) * 100).toFixed(1)}%  top ${((minY / H) * 100).toFixed(1)}%  ` +
			`w ${((lw / W) * 100).toFixed(1)}%  h ${((lh / H) * 100).toFixed(1)}%`,
	);
};

main();

/**
 * Splits the fare-meter cutout into two layers so the flag lever can rotate
 * independently of the housing.
 *
 * The source art has the lever attached and raised. Simply erasing it leaves
 * a hole, because between y≈0.30 and 0.55 the arm passes IN FRONT of the
 * meter's right shoulder — so those pixels have to be painted back in.
 *
 * Outputs:
 *   auto-meter-body.png   the housing, lever removed and the hole filled
 *   auto-meter-lever.png  the arm and flag alone, cropped
 * and prints the lever's box and pivot, which the shots need as their
 * position and transform-origin (see src/compositions/episode01/meter.ts).
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
/**
 * The lever is two parallel diagonal parts, not one: a grey shaft with the
 * red flag arm lying to its right. A band centred on the red arm alone leaves
 * the shaft behind on the housing, pointing up while the flag reads "down".
 * So the centre line runs between the two and the band is wide enough to take
 * both — measured at y=0.35, where the pair spans x 0.65 to 0.76.
 */
const ARM_END = {x: 0.757, y: 0.235};
const ARM_HALF_WIDTH = 0.056;
const FLAG_BOX = {x0: 0.705, y0: 0.12, x1: 0.99, y1: 0.38};
/** How far the fill may search for intact housing to draw on. */
const PATCH_SEARCH = 0.3;
/**
 * Anything opaque above the housing's top edge and right of centre can only
 * be leftover arm — the band misses a sliver of it where the arm tapers, and
 * a stray spike pointing up while the lever reads "down" is very visible.
 */
const CLEANUP = {yBelow: 0.318, xBeyond: 0.55};
/** Side of the clean square of housing whose grain is reused to fill holes. */
const GRAIN = 180;
/** How far below a hole to sample for the colour its column should be. */
const COLUMN_SAMPLE = 64;

const lumaOf = (buf, p) => buf[p] * 0.3 + buf[p + 1] * 0.59 + buf[p + 2] * 0.11;

/**
 * Finds the flattest square of fully opaque artwork in the image.
 *
 * The hole gets filled with this square's grain, so what matters is that it
 * contains texture and nothing else: no rivet, no torn edge, no seam, and
 * nothing that belongs to the lever. Lowest luminance variance is a good
 * enough proxy for that, and picking it by measurement rather than by hand
 * means the fill still works if the art is ever redrawn.
 */
const findGrainPatch = (raw, isLever, W, H) => {
	let best = null;
	for (let y = 0; y + GRAIN < H; y += 12) {
		for (let x = 0; x + GRAIN < W; x += 12) {
			let n = 0;
			let sum = 0;
			let sumSq = 0;
			let opaque = true;
			for (let dy = 0; dy < GRAIN && opaque; dy += 4) {
				for (let dx = 0; dx < GRAIN; dx += 4) {
					const i = (y + dy) * W + (x + dx);
					const p = i * 4;
					// Opaque housing only: the flag's flat red is the lowest-
					// variance square in the image, and it is the one part of the
					// art that is about to be cut out and moved.
					if (raw[p + 3] < 250 || isLever[i]) {
						opaque = false;
						break;
					}
					const l = lumaOf(raw, p);
					n++;
					sum += l;
					sumSq += l * l;
				}
			}
			if (!opaque || n === 0) continue;
			const variance = sumSq / n - (sum / n) ** 2;
			if (!best || variance < best.variance) best = {x, y, variance};
		}
	}
	if (!best) throw new Error('no clean grain patch found');
	return best;
};

const median = (values) => {
	const sorted = [...values].sort((a, b) => a - b);
	return sorted[sorted.length >> 1];
};

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

	// --- 1. Mark every pixel belonging to the lever, and cut it out.
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
	const hole = new Uint8Array(W * H);
	const maxSearch = Math.round(PATCH_SEARCH * W);
	let minX = W;
	let minY = H;
	let maxX = 0;
	let maxY = 0;

	for (let y = 0; y < H; y++) {
		for (let x = 0; x < W; x++) {
			const p = y * W + x;
			if (!isLever[p]) continue;

			for (let c = 0; c < 4; c++) lever[p * 4 + c] = raw[p * 4 + c];
			if (x < minX) minX = x;
			if (y < minY) minY = y;
			if (x > maxX) maxX = x;
			if (y > maxY) maxY = y;

			// Was this pixel part of the housing, or was the arm floating over
			// open air here? The test is whether intact body exists on BOTH
			// sides of it on its row: searching only leftward finds distant
			// housing for arm pixels high above the meter and fills empty space.
			let inside = false;
			for (let d = 1; d <= maxSearch && x - d >= 0 && !inside; d++) {
				const sp = y * W + (x - d);
				if (isLever[sp] || raw[sp * 4 + 3] <= 200) continue;
				for (let e = 1; e <= maxSearch && x + e < W; e++) {
					const rp = y * W + (x + e);
					if (!isLever[rp] && raw[rp * 4 + 3] > 200) {
						inside = true;
						break;
					}
				}
				break;
			}
			if (inside) {
				hole[p] = 1;
			} else {
				body[p * 4 + 3] = 0;
			}
		}
	}

	// --- 2. Work out what colour each column of the hole should be.
	//
	// Everything the arm crosses is vertically striped — the housing's grey
	// shoulder, then the olive canopy behind it, then its edge — so a column
	// is the one direction along which the colour does not change. Filling
	// across the row instead had to blend grey into olive and turned the
	// boundary between them to mush, which is a smear the eye finds instantly.
	//
	// The colour is a median rather than a mean so that a rivet or a scratch
	// in the sample does not drag the whole column towards it.
	const columnBottom = new Int32Array(W).fill(-1);
	for (let x = 0; x < W; x++) {
		for (let y = H - 1; y >= 0; y--) {
			if (hole[y * W + x]) {
				columnBottom[x] = y;
				break;
			}
		}
	}
	const columnColour = new Map();
	for (let x = 0; x < W; x++) {
		if (columnBottom[x] < 0) continue;
		const samples = [[], [], []];
		for (let y = columnBottom[x] + 2; y < H && samples[0].length < COLUMN_SAMPLE; y++) {
			const p = y * W + x;
			if (isLever[p] || hole[p] || raw[p * 4 + 3] <= 200) continue;
			for (let c = 0; c < 3; c++) samples[c].push(raw[p * 4 + c]);
		}
		if (samples[0].length) columnColour.set(x, samples.map(median));
	}

	// --- 3. Fill the hole: that colour, wearing the grain of real housing.
	//
	// Reusing the pixels immediately below each hole was the previous attempt
	// and it tiled whatever was down there — a rivet at the hole's edge came
	// out as a ladder of rivets climbing the housing. Taking the texture from
	// one deliberately featureless square instead means there is no feature
	// left to repeat, and re-levelling it to each column's own colour keeps
	// the stripes the fill is sitting between.
	const grain = findGrainPatch(raw, isLever, W, H);
	const grainMean = [0, 0, 0];
	for (let dy = 0; dy < GRAIN; dy++) {
		for (let dx = 0; dx < GRAIN; dx++) {
			const p = ((grain.y + dy) * W + (grain.x + dx)) * 4;
			for (let c = 0; c < 3; c++) grainMean[c] += raw[p + c];
		}
	}
	for (let c = 0; c < 3; c++) grainMean[c] /= GRAIN * GRAIN;

	let unfilled = 0;
	for (let y = 0; y < H; y++) {
		for (let x = 0; x < W; x++) {
			const p = y * W + x;
			if (!hole[p]) continue;
			const colour = columnColour.get(x);
			if (!colour) {
				body[p * 4 + 3] = 0;
				unfilled++;
				continue;
			}
			const gp = ((grain.y + (y % GRAIN)) * W + (grain.x + (x % GRAIN))) * 4;
			for (let c = 0; c < 3; c++) {
				const detail = raw[gp + c] - grainMean[c];
				body[p * 4 + c] = Math.max(0, Math.min(255, Math.round(colour[c] + detail)));
			}
			body[p * 4 + 3] = 255;
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
	console.log(`grain  ${GRAIN}px square at (${grain.x}, ${grain.y})`);
	if (unfilled) console.log(`WARNING ${unfilled} hole px had no column to colour from`);
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

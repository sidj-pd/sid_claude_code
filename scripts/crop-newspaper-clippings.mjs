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

/** Source pixel crop box per clipping, found by eye off the keyed PNG. */
const CROPS = {
	'newspaper-clip-autounion': {top: 440, height: 660},
	'newspaper-clip-victim': {top: 0, height: 780},
	'newspaper-clip-committee': {top: 0, height: 680},
};

const main = async () => {
	for (const [name, {top, height}] of Object.entries(CROPS)) {
		const file = path.join(DIR, `${name}.png`);
		const {width} = await sharp(file).metadata();
		const cropped = await sharp(file).extract({left: 0, top, width, height}).png({compressionLevel: 9}).toBuffer();
		await sharp(cropped).toFile(file);
		console.log(`${name}: cropped to ${width}x${height} from y=${top}`);
	}
};

main();

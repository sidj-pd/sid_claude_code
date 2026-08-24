import {continueRender, delayRender, staticFile} from 'remotion';

/**
 * The ransom-note face set.
 *
 * These are loaded from public/fonts/ rather than named as CSS families,
 * because the render container has almost no fonts installed — no Georgia,
 * Impact, Courier New, Times New Roman or Arial Black. Naming them in CSS
 * silently fell back to the same DejaVu/Liberation face for every letter,
 * which killed the effect: a ransom note is nothing *but* mismatched type.
 *
 * The set is chosen to clash — condensed sans against high-contrast serif
 * against distressed typewriter — the way letters cut from different
 * magazines would.
 */
export const RANSOM_FONTS = [
	'RansomAnton', // heavy condensed sans
	'RansomArchivoBlack', // heavy grotesque
	'RansomPlayfair', // high-contrast serif
	'RansomSpecialElite', // distressed typewriter
	'RansomAbrilFatface', // fat didone
	'RansomBitter', // slab serif
] as const;

const FILES: Record<string, string> = {
	RansomAnton: 'fonts/Anton.woff2',
	RansomArchivoBlack: 'fonts/ArchivoBlack.woff2',
	RansomPlayfair: 'fonts/PlayfairDisplay.woff2',
	RansomSpecialElite: 'fonts/SpecialElite.woff2',
	RansomAbrilFatface: 'fonts/AbrilFatface.woff2',
	RansomBitter: 'fonts/Bitter.woff2',
};

let started = false;

/**
 * Registers the faces and blocks rendering until they are actually ready.
 * Without the delayRender handle, frames render against the fallback face
 * and the first frames of a headline come out in the wrong type.
 */
export const loadRansomFonts = (): void => {
	if (started || typeof document === 'undefined') {
		return;
	}
	started = true;

	const handle = delayRender('Loading ransom-note fonts');
	Promise.all(
		Object.entries(FILES).map(([family, file]) => {
			const face = new FontFace(family, `url(${staticFile(file)}) format('woff2')`);
			return face.load().then((loaded) => {
				document.fonts.add(loaded);
			});
		}),
	)
		.then(() => continueRender(handle))
		.catch(() => continueRender(handle));
};

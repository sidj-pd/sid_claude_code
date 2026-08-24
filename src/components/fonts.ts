import {continueRender, delayRender, staticFile} from 'remotion';

/**
 * All custom faces used anywhere in the project, registered once at module
 * load rather than from inside a component.
 *
 * Registering from a component body was unreliable: a bubble that only
 * mounts partway through a shot registers its fonts partway through the
 * render, and frames before that point — or rendered in a worker that took
 * a different code path — paint against the fallback face. Doing it here
 * means the work starts as the bundle initialises, before any frame exists.
 *
 * The container itself ships almost no fonts (59 total: DejaVu, Liberation,
 * FreeSans and CJK). Nothing may be named in CSS and assumed present.
 */

/** Deliberately clashing faces, for ransom-note TITLING only. */
export const RANSOM_FONTS = [
	'RansomAnton',
	'RansomArchivoBlack',
	'RansomPlayfair',
	'RansomSpecialElite',
	'RansomAbrilFatface',
	'RansomBitter',
] as const;

/**
 * Dialogue face. Speech is not titling, so bubbles use one clean face
 * throughout instead of cut-and-pasted letters. Swap this for
 * 'BubblePatrickHand' (casual hand lettering) or 'BubbleArchivo' (plain
 * editorial bold) to change every bubble in the series.
 */
export const SPEECH_FONT = 'BubbleBangers';

const FILES: Record<string, string> = {
	RansomAnton: 'fonts/Anton.woff2',
	RansomArchivoBlack: 'fonts/ArchivoBlack.woff2',
	RansomPlayfair: 'fonts/PlayfairDisplay.woff2',
	RansomSpecialElite: 'fonts/SpecialElite.woff2',
	RansomAbrilFatface: 'fonts/AbrilFatface.woff2',
	RansomBitter: 'fonts/Bitter.woff2',
	BubbleBangers: 'fonts/Bangers.woff2',
	BubblePatrickHand: 'fonts/PatrickHand.woff2',
	BubbleArchivo: 'fonts/ArchivoBold.woff2',
};

if (typeof document !== 'undefined') {
	const handle = delayRender('Loading project fonts');

	// A <style> rule rather than the FontFace constructor: the rule is part
	// of the document from the start, so anything that paints picks it up,
	// and document.fonts.load() below still gives an awaitable signal.
	const style = document.createElement('style');
	style.textContent = Object.entries(FILES)
		.map(
			([family, file]) =>
				`@font-face{font-family:'${family}';src:url('${staticFile(file)}') format('woff2');font-display:block;}`,
		)
		.join('\n');
	document.head.appendChild(style);

	Promise.all(Object.keys(FILES).map((family) => document.fonts.load(`96px '${family}'`)))
		.then(() => document.fonts.ready)
		.then(() => continueRender(handle))
		.catch(() => continueRender(handle));
}

import {continueRender, delayRender, staticFile} from 'remotion';

/**
 * Faces for the Double Rinse miniseries title cards, registered at module load
 * like fonts.ts and kannadaFonts.ts.
 *
 * The user builds these cards in CapCut with its in-app "Starry" and "Crayon"
 * fonts, whose files CapCut does not ship. These are the open lookalikes that
 * won a side-by-side against the user's Episode 5 card: Poppins Black for the
 * title, Gloria Hallelujah (thickened with a stroke in DoubleRinseCard) for
 * the handwritten lines. Both OFL; texts in fonts/double-rinse/licenses.
 */

const FACES = [
	{family: 'DrPoppins', file: 'fonts/double-rinse/Poppins-Black.ttf', weight: '900'},
	{family: 'DrGloria', file: 'fonts/double-rinse/GloriaHallelujah.ttf', weight: '400'},
];

if (typeof document !== 'undefined') {
	const handle = delayRender('Loading Double Rinse fonts');

	const style = document.createElement('style');
	style.textContent = FACES.map(
		({family, file, weight}) =>
			`@font-face{font-family:'${family}';src:url('${staticFile(file)}') format('truetype');font-weight:${weight};font-display:block;}`,
	).join('\n');
	document.head.appendChild(style);

	Promise.all(FACES.map(({family, weight}) => document.fonts.load(`${weight} 96px '${family}'`, 'DOUBLE Episode')))
		.then(() => document.fonts.ready)
		.then(() => continueRender(handle))
		.catch(() => continueRender(handle));
}

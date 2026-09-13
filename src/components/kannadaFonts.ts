import {continueRender, delayRender, staticFile} from 'remotion';

/**
 * Kannada faces for the Kannada miniseries titling, registered at module load
 * for the same reason fonts.ts is: a face registered from a component body can
 * miss the first frames.
 *
 * Kept apart from fonts.ts so Bizzaro Bangalore renders do not pay for four
 * extra font files. The render container has no Kannada face of its own, so
 * without these every glyph would be tofu.
 *
 * All four are OFL, from github.com/google/fonts. Three are variable fonts, so
 * each rule declares its axis range — without it Chrome synthesises bold from
 * the default instance instead of using the real heavy masters.
 */

type Face = {
	family: string;
	file: string;
	weight: string;
	stretch?: string;
};

const FACES: Face[] = [
	// Rounded, heavy, friendly — the look of a Kannada TV serial title.
	{family: 'KnBalooTamma', file: 'fonts/kannada/BalooTamma2.ttf', weight: '400 800'},
	// Literary serif with calligraphic contrast — cinema poster.
	{family: 'KnTiro', file: 'fonts/kannada/TiroKannada-Regular.ttf', weight: '400'},
	{family: 'KnNotoSerif', file: 'fonts/kannada/NotoSerifKannada.ttf', weight: '100 900'},
	// Has a width axis: condensed black for a modern OTT key-art title.
	{family: 'KnAnek', file: 'fonts/kannada/AnekKannada.ttf', weight: '100 800', stretch: '75% 125%'},
];

if (typeof document !== 'undefined') {
	const handle = delayRender('Loading Kannada fonts');

	const style = document.createElement('style');
	style.textContent = FACES.map(
		({family, file, weight, stretch}) =>
			`@font-face{font-family:'${family}';src:url('${staticFile(file)}') format('truetype');font-weight:${weight};${stretch ? `font-stretch:${stretch};` : ''}font-display:block;}`,
	).join('\n');
	document.head.appendChild(style);

	// Sample text in Kannada so the load resolves against the glyphs that are
	// actually painted, not just the Latin subset.
	Promise.all(FACES.map(({family}) => document.fonts.load(`96px '${family}'`, 'ಖರೆ ಹೇಳ್ಯೋ EPISODE')))
		.then(() => document.fonts.ready)
		.then(() => continueRender(handle))
		.catch(() => continueRender(handle));
}

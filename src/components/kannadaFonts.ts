import {continueRender, delayRender, staticFile} from 'remotion';

/**
 * Kannada faces for the Kannada miniseries titling, registered at module load
 * for the same reason fonts.ts is: a face registered from a component body can
 * miss the first frames.
 *
 * Kept apart from fonts.ts so Bizzaro Bangalore renders do not pay for these
 * files. The render container has no Kannada face of its own, so without them
 * every glyph would be tofu.
 *
 * This repo is PUBLIC, so only faces that may be redistributed live here —
 * every one is OFL except Lohit (GPL). The source, licence and reason for each,
 * and the list of faces deliberately left out, are in
 * public/fonts/kannada/licenses/README.md. Check there before adding a face.
 *
 * Variable fonts declare their axis ranges — without them Chrome synthesises
 * bold from the default instance instead of using the real heavy masters.
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
	{family: 'KnNotoSans', file: 'fonts/kannada/NotoSansKannada.ttf', weight: '100 900', stretch: '62.5% 100%'},

	// From the user's own font collection, 2026-09-13. Static single weights.
	{family: 'KnBalooTammaOne', file: 'fonts/kannada/BalooTamma-Regular.ttf', weight: '400'},
	{family: 'KnHindMysuru', file: 'fonts/kannada/HindMysuru-Bold.ttf', weight: '700'},
	{family: 'KnHubballi', file: 'fonts/kannada/Hubballi-Regular.ttf', weight: '400'},
	{family: 'KnAkaya', file: 'fonts/kannada/AkayaKanadaka-Regular.ttf', weight: '400'},
	{family: 'KnPadyakke', file: 'fonts/kannada/PadyakkeExpandedOne-Regular.ttf', weight: '400'},
	{family: 'KnNanni', file: 'fonts/kannada/Nanni-Regular.ttf', weight: '400'},
	{family: 'KnKanishka', file: 'fonts/kannada/Kanishka.ttf', weight: '400'},
	{family: 'KnKittel', file: 'fonts/kannada/KarnataFKittel.otf', weight: '400'},
	{family: 'KnDesigniga', file: 'fonts/kannada/DesignigaHandwritting-Regular.ttf', weight: '400'},
	{family: 'KnNavilu', file: 'fonts/kannada/Navilu.ttf', weight: '400'},
	{family: 'KnBenne', file: 'fonts/kannada/Benne-Regular.otf', weight: '400'},
	{family: 'KnAmbarisha', file: 'fonts/kannada/Ambarisha2.ttf', weight: '400'},
	{family: 'KnLohit', file: 'fonts/kannada/LohitKannada.ttf', weight: '400'},
];

if (typeof document !== 'undefined') {
	const handle = delayRender('Loading Kannada fonts');

	const style = document.createElement('style');
	style.textContent = FACES.map(
		({family, file, weight, stretch}) =>
			`@font-face{font-family:'${family}';src:url('${staticFile(file)}') format('${file.endsWith('.otf') ? 'opentype' : 'truetype'}');font-weight:${weight};${stretch ? `font-stretch:${stretch};` : ''}font-display:block;}`,
	).join('\n');
	document.head.appendChild(style);

	// Sample text in Kannada so the load resolves against the glyphs that are
	// actually painted, not just the Latin subset.
	Promise.all(FACES.map(({family}) => document.fonts.load(`96px '${family}'`, 'ಖರೆ ಹೇಳ್ಯೋ EPISODE')))
		.then(() => document.fonts.ready)
		.then(() => continueRender(handle))
		.catch(() => continueRender(handle));
}

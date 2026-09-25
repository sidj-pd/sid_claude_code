import {continueRender, delayRender, staticFile} from 'remotion';

/**
 * Display faces tried for the "Typist Ramanna" title card, all Google Fonts
 * under the OFL (see public/fonts/typist-ramanna/licenses/README.md), picked
 * for the fat, friendly, heavily-shadowed lettering of a 90s sitcom card.
 */

const FACES = [
	{family: 'TrLuckiestGuy', file: 'fonts/typist-ramanna/LuckiestGuy.woff2'},
	{family: 'TrTitanOne', file: 'fonts/typist-ramanna/TitanOne.woff2'},
	{family: 'TrChewy', file: 'fonts/typist-ramanna/Chewy.woff2'},
	{family: 'TrBungee', file: 'fonts/typist-ramanna/Bungee.woff2'},
	{family: 'TrLilitaOne', file: 'fonts/typist-ramanna/LilitaOne.woff2'},
	// Episode titles: worn typewriter face, matching the "DD ARCHIVE" strip.
	// Already in the repo for Bizzaro Bangalore (Apache 2.0).
	{family: 'TrSpecialElite', file: 'fonts/SpecialElite.woff2'},
];

if (typeof document !== 'undefined') {
	const handle = delayRender('Loading Typist Ramanna fonts');

	const style = document.createElement('style');
	style.textContent = FACES.map(
		({family, file}) =>
			`@font-face{font-family:'${family}';src:url('${staticFile(file)}') format('woff2');font-display:block;}`,
	).join('\n');
	document.head.appendChild(style);

	Promise.all(FACES.map(({family}) => document.fonts.load(`400 200px '${family}'`, 'TYPIST RAMANNA EP 02')))
		.then(() => document.fonts.ready)
		.then(() => continueRender(handle))
		.catch(() => continueRender(handle));
}

import React from 'react';
import {useCurrentFrame} from 'remotion';
import {TitleOverlay, Treatment} from './KhareHelyoTitle';

/**
 * Every cleared Kannada face, one per frame, in the real title layout — so
 * the choice is made by looking at ಖರೆ ಹೇಳ್ಯೋ ಸುಳ್ಳ ಹೇಳ್ಯೋ over the
 * footage rather than at a font's own sample sentence.
 *
 * Frame N is FONT_SPECIMENS[N]. Each still is itself a usable transparent
 * overlay. Only the Kannada title and episode name change face; the English
 * tag and badge stay in Anek, because several of these faces have no Latin
 * glyphs at all (Navilu, Lohit).
 *
 * Weights are the heaviest the family actually ships. Regular-only faces stay
 * at 400 — asking for bold would get a smeared synthetic bold, not the design.
 */

type Specimen = {
	name: string;
	/** File-name friendly, for naming the rendered stills. */
	slug: string;
	family: string;
	weight?: number;
	stretch?: string;
};

export const FONT_SPECIMENS: Specimen[] = [
	{name: 'Anek Kannada Condensed ExtraBold', slug: 'AnekCondensed', family: 'KnAnek', weight: 800, stretch: '75%'},
	{name: 'Baloo Tamma 2 ExtraBold', slug: 'BalooTamma2', family: 'KnBalooTamma', weight: 800},
	{name: 'Tiro Kannada', slug: 'TiroKannada', family: 'KnTiro'},
	{name: 'Noto Serif Kannada Black', slug: 'NotoSerifBlack', family: 'KnNotoSerif', weight: 900},
	{name: 'Noto Sans Kannada Black', slug: 'NotoSansBlack', family: 'KnNotoSans', weight: 900},
	{
		name: 'Noto Sans Kannada ExtraCondensed Black',
		slug: 'NotoSansExtraCondensed',
		family: 'KnNotoSans',
		weight: 900,
		stretch: '62.5%',
	},
	{name: 'Baloo Tamma', slug: 'BalooTamma', family: 'KnBalooTammaOne'},
	{name: 'Hind Mysuru Bold', slug: 'HindMysuruBold', family: 'KnHindMysuru', weight: 700},
	{name: 'Hubballi', slug: 'Hubballi', family: 'KnHubballi'},
	{name: 'Akaya Kanadaka', slug: 'AkayaKanadaka', family: 'KnAkaya'},
	{name: 'Padyakke Expanded One', slug: 'Padyakke', family: 'KnPadyakke'},
	{name: 'Nanni', slug: 'Nanni', family: 'KnNanni'},
	{name: 'Kanishka', slug: 'Kanishka', family: 'KnKanishka'},
	{name: 'Karnata F Kittel', slug: 'KarnataFKittel', family: 'KnKittel'},
	{name: 'Designiga Handwritting', slug: 'Designiga', family: 'KnDesigniga'},
	{name: 'Navilu', slug: 'Navilu', family: 'KnNavilu'},
	{name: 'Benne', slug: 'Benne', family: 'KnBenne'},
	{name: 'Ambarisha', slug: 'Ambarisha', family: 'KnAmbarisha'},
	{name: 'Lohit Kannada', slug: 'Lohit', family: 'KnLohit'},
];

const LABEL: React.CSSProperties = {
	fontFamily: 'KnAnek',
	fontWeight: 600,
	fontStretch: '125%',
	fontSize: 34,
	letterSpacing: 8,
};

const treatment = ({family, weight = 400, stretch}: Specimen): Treatment => ({
	title: {fontFamily: family, fontWeight: weight, fontStretch: stretch, fontSize: 180, lineHeight: 1.25},
	episodeName: {fontFamily: family, fontWeight: weight, fontStretch: stretch, fontSize: 90},
	label: LABEL,
});

export const KhareHelyoFontSpecimen: React.FC = () => {
	const frame = useCurrentFrame();
	return <TitleOverlay t={treatment(FONT_SPECIMENS[Math.min(frame, FONT_SPECIMENS.length - 1)])} />;
};

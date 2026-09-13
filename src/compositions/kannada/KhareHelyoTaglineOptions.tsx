import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {SHADOW} from './KhareHelyoTitle';

/**
 * Alternatives for the "A ಜಾನಪದ Rom-com" tagline, one per frame, each alone
 * on a transparent frame.
 *
 * Why: over Ep01 the first tagline (Akaya Kanadaka, coral) failed twice once
 * the user placed it — coral vanished over the lit coach, and Akaya's
 * ornamental Kannada turned to mush at tagline size. Clear handwriting-style
 * Kannada faces with a redistributable licence are rare; Navilu and Designiga
 * are the two cleared ones. So half the options pair a Latin handwriting face
 * (Kalam, Caveat Brush) with a clear Kannada face through the font stack:
 * the Latin face has no Kannada glyphs, so ಜಾನಪದ falls through to the second.
 *
 * fontSynthesis 'none' matters in those stacks: the stack asks for 700 for
 * Kalam, and without it Chrome would smear a fake bold onto a Kannada face
 * that only ships a regular.
 *
 * Frame order is FACES x LOOKS, faces outer.
 */

const TAGLINE = 'A ಜಾನಪದ Rom-com';

const FACES: {name: string; style: React.CSSProperties}[] = [
	{name: 'Kalam + Navilu', style: {fontFamily: 'KnTagKalam, KnNavilu', fontWeight: 700, fontSize: 104}},
	{name: 'Kalam + Baloo Tamma 2', style: {fontFamily: 'KnTagKalam, KnBalooTamma', fontWeight: 700, fontSize: 104}},
	{
		name: 'Caveat Brush + Baloo Tamma 2',
		style: {fontFamily: 'KnTagCaveatBrush, KnBalooTamma', fontWeight: 700, fontSize: 120},
	},
	{name: 'Designiga Handwritting', style: {fontFamily: 'KnDesigniga', fontWeight: 400, fontSize: 112}},
];

const LOOKS: {name: string; style: React.CSSProperties}[] = [
	// Cool against the warm title, and bright on both navy sky and blue coach.
	{name: 'Mint', style: {color: '#9DF3D6', textShadow: SHADOW}},
	// Keeps the romance read of coral, with far more luminance.
	{name: 'Rose', style: {color: '#FF86C0', textShadow: SHADOW}},
	// A plate carries its own contrast, so it reads over anything.
	{
		name: 'Ribbon',
		style: {
			color: '#FFF3D6',
			backgroundColor: '#C93A26',
			padding: '4px 36px 12px',
			borderRadius: 16,
			boxShadow: '0 8px 24px rgba(0, 0, 0, 0.5)',
			textShadow: '0 2px 0 rgba(60, 10, 0, 0.35)',
		},
	},
];

export const TAGLINE_OPTIONS = FACES.flatMap((face) =>
	LOOKS.map((look) => ({name: `${face.name} — ${look.name}`, style: {...face.style, ...look.style}})),
);

export const KhareHelyoTaglineOptions: React.FC = () => {
	const frame = useCurrentFrame();
	const option = TAGLINE_OPTIONS[Math.min(frame, TAGLINE_OPTIONS.length - 1)];

	return (
		<AbsoluteFill style={{justifyContent: 'center', alignItems: 'center'}}>
			<div
				style={{
					...option.style,
					lineHeight: 1.3,
					whiteSpace: 'nowrap',
					fontSynthesis: 'none',
					rotate: '-3deg',
				}}
			>
				{TAGLINE}
			</div>
		</AbsoluteFill>
	);
};

import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {BaselineLine} from '../double-rinse/DoubleRinseCard';
import type {LineSpec} from '../double-rinse/DoubleRinseCard';
import '../../components/typistFonts';

/**
 * "Typist Ramanna" title card for a new show, one candidate face per frame.
 *
 * The brief was "90s sitcom font", which is a look rather than a typeface:
 * fat friendly letters, set big, stacked on two lines, with a hard offset
 * shadow behind them. These five faces cover that range from comic-marker
 * (Luckiest Guy, Chewy) to fat rounded poster (Titan One, Lilita One) to
 * blocky signage (Bungee), so the user can pick from renders rather than names.
 *
 * Drawn with DoubleRinseCard's BaselineLine, so a line sits on its baseline
 * and shrinks to the frame's measure if it runs wide — the same machinery
 * behind the Double Rinse cards.
 */

const CREAM = '#FFF1D0';
/** The hard 90s drop shadow: a black copy, offset down-right, barely blurred. */
const CAST = {x: 14, y: 16, blur: 2};
const HALO = '0 0 26px rgba(0, 0, 0, 0.55), 0 0 60px rgba(0, 0, 0, 0.3)';

/** Titan One is the LOCKED face (user, 2026-09-22); the rest stay for reference. */
export const TR_LOCKED_FACE = 'TrTitanOne';

export const TR_FACES = [
	{family: 'TrLuckiestGuy', label: 'Luckiest Guy'},
	{family: 'TrTitanOne', label: 'Titan One (locked)'},
	{family: 'TrChewy', label: 'Chewy'},
	{family: 'TrBungee', label: 'Bungee'},
	{family: 'TrLilitaOne', label: 'Lilita One'},
];

const line = (text: string, family: string, size: number, baseline: number): LineSpec => ({
	text,
	family,
	weight: 400,
	size,
	baseline,
	color: CREAM,
	letterSpacing: 0,
	cast: CAST,
	shadow: HALO,
});

export const TypistRamannaTitle: React.FC = () => {
	const frame = useCurrentFrame();
	const {family} = TR_FACES[Math.min(frame, TR_FACES.length - 1)];

	return (
		<AbsoluteFill>
			<BaselineLine key={`${family}-1`} spec={line('TYPIST', family, 230, 880)} hidden={false} />
			<BaselineLine key={`${family}-2`} spec={line('RAMANNA', family, 230, 1140)} hidden={false} />
		</AbsoluteFill>
	);
};

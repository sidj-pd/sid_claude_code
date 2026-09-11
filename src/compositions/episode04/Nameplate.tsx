import React from 'react';
import {Chyron} from '../../components/Chyron';
import {SAFE_BOTTOM_Y} from '../../components/safeArea';
import {BUTTER, GANACHE} from '../../components/palette';

/**
 * Every lower third in Episode 04, in one place.
 *
 * The three of them — witness, expert, correspondent — were separate Chyron
 * calls carrying the series' cream-and-brown defaults, which is the one thing
 * in the episode that had not moved to the new palette. Routing them through
 * here means the card cannot drift between speakers, and the episode's colours
 * live in exactly one file.
 *
 * The paper is a light Butter tint rather than Butter itself: full Butter
 * behind Ganache type is a yellow card with brown writing on it, which reads
 * as a warning label. A tint of it reads as paper that happens to be in this
 * episode's palette, and the accent rule along the top edge does the work of
 * saying which palette that is.
 */
const CARD = '#F6E7CB';

/**
 * The lowest a card may sit. Its own height is roughly 150px for two lines,
 * so this is SAFE_BOTTOM_Y less that plus a little air — the bottom of the
 * legal band, not a number that looked about right.
 */
export const NAMEPLATE_TOP = SAFE_BOTTOM_Y - 160;

export const Nameplate: React.FC<{
	name: string;
	title: string;
	footnote?: string;
	frame: number;
	in: number;
	out?: number;
	seed: number;
	top?: number;
}> = ({name, title, footnote, frame, in: fadeIn, out, seed, top = NAMEPLATE_TOP}) => (
	<Chyron
		name={name}
		title={title}
		footnote={footnote}
		frame={frame}
		in={fadeIn}
		out={out}
		top={top}
		seed={seed}
		paper={CARD}
		ink={GANACHE}
		accent={BUTTER}
	/>
);

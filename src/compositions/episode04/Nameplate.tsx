import React from 'react';
import {Chyron} from '../../components/Chyron';
import {SAFE_BOTTOM_Y} from '../../components/safeArea';
import {BUTTER, BUTTER_DEEP, GANACHE} from '../../components/palette';

/**
 * Every lower third in Episode 04, in one place.
 *
 * The three of them — witness, expert, correspondent — were separate Chyron
 * calls carrying the series' cream-and-brown defaults, which is the one thing
 * in the episode that had not moved to the new palette. Routing them through
 * here means the card cannot drift between speakers, and the episode's colours
 * live in exactly one file.
 *
 */
/**
 * OPTION C, chosen from Ep04NameplateOptions: a Ganache plate with Butter
 * type and a brass rule around it -- the FUCO BANK counter sign at
 * lower-third size, so the one piece of set dressing already carrying the
 * palette now sets the house style for every caption in the episode.
 *
 * The first attempt at "on palette" was a Butter TINT at #F6E7CB, and it read
 * as no change at all -- fairly, since it lands within a few points of the
 * cream Episodes 01-03 use. The ink had moved and the paper had not.
 *
 * The torn edge goes with it. On a dark plate a ragged edge stops reading as
 * paper and starts reading as a rendering fault: there is no page for it to
 * have been torn out of.
 */
const CARD = GANACHE;
const TYPE = BUTTER;

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
		ink={TYPE}
		border={BUTTER_DEEP}
		torn={false}
	/>
);

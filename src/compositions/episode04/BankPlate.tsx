import React from 'react';
import {NewsprintTexture} from '../../components/NewsprintTexture';
import {BUTTER, BUTTER_DEEP, GANACHE, GANACHE_DEEP} from '../../components/palette';

/**
 * The counter's nameplate, mounted on the wall above him.
 *
 * A real bank counter plate rather than a logo: a screwed-down board with the
 * institution on it and, smaller and subordinate, which counter this is. The
 * counter number is not decoration — the closing narration says "still at
 * Counter 3", and a line that names a counter plays better if the audience has
 * been looking at that counter's number for the whole episode.
 *
 * It is SET, not drawn. Every word in this episode is typed in Remotion
 * because the generator cannot spell: one of this episode's newspaper
 * clippings came back with a headline in Malayalam.
 *
 * The plate is the one place Butter does real work at size. On Aruba it reads
 * as brass, which is what a bank nameplate is made of, without anyone having
 * to paint a gradient on it.
 */

export const PLATE_W = 780;
export const PLATE_H = 172;
/** Centred, and high enough to clear his head (his art starts at y 449). */
export const PLATE_X = 540 - PLATE_W / 2;
export const PLATE_Y = 214;

const Screw: React.FC<{left: number}> = ({left}) => (
	<div
		style={{
			position: 'absolute',
			left,
			top: PLATE_H / 2 - 11,
			width: 22,
			height: 22,
			borderRadius: '50%',
			background: BUTTER_DEEP,
			boxShadow: `inset 0 2px 0 rgba(255,255,255,0.35), inset 0 -2px 0 rgba(36,24,18,0.4)`,
		}}
	/>
);

export const BankPlate: React.FC = () => (
	<div
		style={{
			position: 'absolute',
			left: PLATE_X,
			top: PLATE_Y,
			width: PLATE_W,
			height: PLATE_H,
			background: GANACHE,
			border: `5px solid ${BUTTER_DEEP}`,
			boxShadow: `0 3px 4px rgba(36,24,18,0.35), 0 14px 26px rgba(36,24,18,0.3)`,
			transform: 'rotate(-0.8deg)',
			display: 'flex',
			flexDirection: 'column',
			alignItems: 'center',
			justifyContent: 'center',
		}}
	>
		<Screw left={24} />
		<Screw left={PLATE_W - 56} />

		<div
			style={{
				fontFamily: 'RansomArchivoBlack, sans-serif',
				fontSize: 78,
				lineHeight: 1,
				letterSpacing: 9,
				color: BUTTER,
				/* The letterspacing pushes the whole word right by one gap;
				   this pulls it back so it is optically centred rather than
				   metrically centred. */
				textIndent: 9,
			}}
		>
			FUCO BANK
		</div>
		<div
			style={{
				marginTop: 8,
				fontFamily: 'RansomSpecialElite, monospace',
				fontSize: 27,
				letterSpacing: 5,
				color: 'rgba(238,202,143,0.82)',
				textIndent: 5,
			}}
		>
			COUNTER No. 3
		</div>

		{/* A hairline of shadow along the top edge, so the plate reads as
		    standing off the wall rather than printed on it. */}
		<div
			style={{
				position: 'absolute',
				inset: 0,
				boxShadow: `inset 0 4px 8px rgba(0,0,0,0.28)`,
				pointerEvents: 'none',
			}}
		/>
		<NewsprintTexture opacity={0.14} blendMode="overlay" />
	</div>
);

export const PLATE_RECT = {
	left: PLATE_X,
	top: PLATE_Y,
	width: PLATE_W,
	height: PLATE_H,
	/** Ganache, for the coverage check's benefit. */
	fill: GANACHE_DEEP,
};

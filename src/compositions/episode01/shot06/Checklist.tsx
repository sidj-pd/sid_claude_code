import React from 'react';
import {interpolate} from 'remotion';
import {NewsprintTexture} from '../../../components/NewsprintTexture';
import {tornPolygon} from '../../../components/tornEdge';

const CLAMP = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const INK = '#241d15';
const MARK = '#8f3626';
/** The chit's own stock, and the default when a caller does not pass one. */
const CARD_PAPER = '#efe4c8';

export type ChecklistItemProps = {
	text: string;
	/** Frames since the line was written. Negative means it has not been. */
	age: number;
	/** Frames since it was ticked. Negative means it has not been. */
	tickAge: number;
	width: number;
	height: number;
	seed: number;
	/**
	 * Palette overrides, same contract as StatBar and Chyron: optional, so a
	 * new palette cannot silently restyle three delivered episodes. Episode 04
	 * passes Ganache, a Butter-tinted paper, and Butter for the tick.
	 */
	ink?: string;
	paper?: string;
	mark?: string;
	/**
	 * Torn edge. On by default, which is how Episodes 01-03 are cut. Episode
	 * 04 turns it off: its chits sit over live action rather than on a collage
	 * page, and a ragged edge on a caption has no sheet to have been torn from.
	 */
	torn?: boolean;
};

/**
 * One line of the evidence checklist: a newsprint chit with an empty box,
 * which is later ticked.
 *
 * The box arrives empty and stays empty while he is still talking about that
 * item, and is ticked as he finishes it. Writing the line and ticking it on
 * the same frame would make the graphic a caption; the gap between them is
 * what makes it a record being kept.
 */
export const ChecklistItem: React.FC<ChecklistItemProps> = ({
	text,
	age,
	tickAge,
	width,
	height,
	seed,
	ink = INK,
	paper = CARD_PAPER,
	mark = MARK,
	torn = true,
}) => {
	if (age < 0) return null;

	const box = height * 0.56;
	return (
		<div
			style={{
				position: 'relative',
				width,
				height,
				display: 'flex',
				alignItems: 'center',
				gap: height * 0.28,
				padding: `0 ${height * 0.3}px`,
				boxSizing: 'border-box',
				background: paper,
				clipPath: torn ? tornPolygon({seed, depth: 7, teeth: 11}) : undefined,
				border: torn ? undefined : `3px solid ${ink}`,
				boxShadow: '0 6px 14px rgba(24,16,8,0.4)',
				// Slammed on, not faded: one frame proud of the page, then down.
				transform: `scale(${age < 2 ? 1.04 : 1}) translateX(${interpolate(age, [0, 3], [-26, 0], CLAMP)}px)`,
				opacity: interpolate(age, [0, 2], [0, 1], CLAMP),
			}}
		>
			<div
				style={{
					position: 'relative',
					width: box,
					height: box,
					border: `4px solid ${ink}`,
					flexShrink: 0,
				}}
			>
				{tickAge >= 0 ? (
					<svg
						viewBox="0 0 100 100"
						style={{
							position: 'absolute',
							left: '-18%',
							top: '-26%',
							width: '150%',
							height: '150%',
							// The tick is stamped: over-scaled on the frame it lands.
							transform: `scale(${tickAge < 2 ? 1.25 : 1}) rotate(-6deg)`,
						}}
					>
						<path
							d="M 18 52 L 42 76 L 86 20"
							stroke={mark}
							strokeWidth={14}
							strokeLinecap="round"
							strokeLinejoin="round"
							fill="none"
						/>
					</svg>
				) : null}
			</div>

			<div
				style={{
					fontFamily: 'RansomAnton, sans-serif',
					fontSize: height * 0.44,
					letterSpacing: 1.2,
					color: ink,
					whiteSpace: 'nowrap',
				}}
			>
				{text}
			</div>
			<NewsprintTexture opacity={0.18} />
		</div>
	);
};

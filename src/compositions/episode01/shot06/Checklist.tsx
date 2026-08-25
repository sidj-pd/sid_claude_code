import React from 'react';
import {interpolate} from 'remotion';
import {NewsprintTexture} from '../../../components/NewsprintTexture';
import {tornPolygon} from '../../../components/tornEdge';

const CLAMP = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const INK = '#241d15';
const MARK = '#8f3626';

export type ChecklistItemProps = {
	text: string;
	/** Frames since the line was written. Negative means it has not been. */
	age: number;
	/** Frames since it was ticked. Negative means it has not been. */
	tickAge: number;
	width: number;
	height: number;
	seed: number;
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
				background: '#efe4c8',
				clipPath: tornPolygon({seed, depth: 7, teeth: 11}),
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
					border: `4px solid ${INK}`,
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
							stroke={MARK}
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
					color: INK,
					whiteSpace: 'nowrap',
				}}
			>
				{text}
			</div>
			<NewsprintTexture opacity={0.18} />
		</div>
	);
};

import React from 'react';
import {NewsprintTexture} from '../../../components/NewsprintTexture';
import {tornPolygon} from '../../../components/tornEdge';

export const INK = '#241d15';
export const PAPER = '#f2e9d3';
export const MARK = '#8f3626';

export type StatBarProps = {
	width: number;
	height: number;
	/** 0-1, how much of the bar is inked. */
	fill: number;
	/** Knocked out of the ink, right-aligned: '91%'. */
	label?: string;
	/** Frames since the label landed; it stamps rather than fading. */
	labelAge?: number;
	/** Shown inside the leftover part, e.g. '9%'. */
	remainderLabel?: string;
	remainderAge?: number;
	/** Draws the leftover as an empty outline — it has been taken elsewhere. */
	remainderTaken?: boolean;
	seed?: number;
};

/**
 * One proportional bar: a strip of pale paper with a strip of newsprint ink
 * measured across it.
 *
 * The percentage is knocked out of the ink rather than set beside the bar,
 * the same way the fare is knocked out of the meter's digit tiles. It keeps
 * the number and the quantity as one object — you cannot read the figure
 * without also seeing how much of the bar it takes up.
 *
 * The LEFTOVER is a drawn object in its own right, outlined and labelled,
 * not just the part of the strip the ink failed to reach. This shot's whole
 * argument is that the leftover of the first bar becomes the whole of the
 * second one, and a piece of negative space cannot be picked up and moved.
 * For the same reason the ink's right edge is cut straight while the outer
 * edges are torn: a ragged boundary between the two quantities makes the
 * division between them unreadable, which is exactly the wrong place in this
 * graphic to be vague.
 */
export const StatBar: React.FC<StatBarProps> = ({
	width,
	height,
	fill,
	label,
	labelAge = 0,
	remainderLabel,
	remainderAge = 0,
	remainderTaken = false,
	seed = 1,
}) => {
	const clamped = Math.max(0, Math.min(1, fill));
	const inkWidth = clamped * width;
	const remainderWidth = width - inkWidth;
	const labelSize = height * 0.72;

	return (
		<div
			style={{
				position: 'relative',
				width,
				height,
				clipPath: tornPolygon({seed, depth: 5.5, teeth: 13}),
			}}
		>
			{/* the whole quantity */}
			<div style={{position: 'absolute', inset: 0, background: PAPER}}>
				<NewsprintTexture opacity={0.2} />
			</div>

			{/* the measured part */}
			<div
				style={{
					position: 'absolute',
					left: 0,
					top: 0,
					width: inkWidth,
					height: '100%',
					background: INK,
					overflow: 'hidden',
				}}
			>
				<NewsprintTexture opacity={0.28} blendMode="screen" />
				{label && labelAge >= 0 ? (
					<div
						style={{
							position: 'absolute',
							right: height * 0.2,
							top: '50%',
							fontFamily: 'RansomArchivoBlack, sans-serif',
							fontSize: labelSize,
							lineHeight: 1,
							color: PAPER,
							// Stamped: a frame proud of the surface, then down.
							transform: `translateY(-50%) scale(${labelAge < 2 ? 1.14 : 1})`,
							opacity: labelAge < 1 ? 0.8 : 1,
						}}
					>
						{label}
					</div>
				) : null}
			</div>

			{/* the leftover, called out as its own object */}
			{remainderLabel && remainderAge >= 0 && remainderWidth > 4 ? (
				<div
					style={{
						position: 'absolute',
						left: inkWidth,
						top: 0,
						width: remainderWidth,
						height: '100%',
						// Dashed once it has been taken: the block is not gone, it has
						// been lifted out and enlarged below, and the outline it left
						// behind is what says so.
						border: `5px ${remainderTaken ? 'dashed' : 'solid'} ${MARK}`,
						boxSizing: 'border-box',
						background: remainderTaken ? 'transparent' : 'rgba(143,54,38,0.14)',
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						opacity: remainderAge < 1 ? 0.5 : 1,
					}}
				>
					{remainderWidth > height * 0.5 ? (
						<span
							style={{
								fontFamily: 'RansomArchivoBlack, sans-serif',
								fontSize: Math.min(height * 0.42, remainderWidth * 0.62),
								color: MARK,
								lineHeight: 1,
							}}
						>
							{remainderLabel}
						</span>
					) : null}
				</div>
			) : null}

			{/* outline last, so it sits over both parts */}
			<div
				style={{
					position: 'absolute',
					inset: 0,
					border: `3px solid ${INK}`,
					boxSizing: 'border-box',
					pointerEvents: 'none',
				}}
			/>
		</div>
	);
};

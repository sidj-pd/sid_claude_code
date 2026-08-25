import React from 'react';
import {NewsprintTexture} from '../../../components/NewsprintTexture';
import {tornPolygon} from '../../../components/tornEdge';

const INK = '#241d15';
const PAPER = '#f2e9d3';

export type StatBarProps = {
	width: number;
	height: number;
	/** 0-1, how much of the bar is inked. */
	fill: number;
	/** Knocked out of the ink, right-aligned: '91%'. */
	label?: string;
	/** Frames since the label landed; it stamps rather than fading. */
	labelAge?: number;
	seed?: number;
};

/**
 * One proportional bar: a strip of pale paper with a strip of newsprint ink
 * torn to length across it.
 *
 * The percentage is knocked out of the ink rather than set beside the bar,
 * the same way the fare is knocked out of the meter's digit tiles. It keeps
 * the number and the quantity as one object — you cannot read the figure
 * without also seeing how much of the bar it takes up.
 */
export const StatBar: React.FC<StatBarProps> = ({
	width,
	height,
	fill,
	label,
	labelAge = 0,
	seed = 1,
}) => {
	const inkWidth = Math.max(0, Math.min(1, fill)) * width;
	const labelSize = height * 0.72;

	return (
		<div style={{position: 'relative', width, height}}>
			{/* the whole quantity: pale paper, outlined so an empty bar still
			    reads as a bar rather than as nothing */}
			<div
				style={{
					position: 'absolute',
					inset: 0,
					background: PAPER,
					border: `3px solid ${INK}`,
					clipPath: tornPolygon({seed, depth: 5.5, teeth: 13}),
					boxShadow: '0 4px 10px rgba(48,34,18,0.28)',
				}}
			>
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
					clipPath: tornPolygon({
						seed: seed + 40,
						edges: {top: true, bottom: true, right: true},
						depth: 6,
						teeth: 12,
					}),
					overflow: 'hidden',
				}}
			>
				<NewsprintTexture opacity={0.28} blendMode="screen" />
				{label && labelAge >= 0 ? (
					<div
						style={{
							position: 'absolute',
							right: height * 0.22,
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
		</div>
	);
};

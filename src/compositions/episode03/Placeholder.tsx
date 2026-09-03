import React from 'react';
import {NewsprintTexture} from '../../components/NewsprintTexture';
import {tornPolygon} from '../../components/tornEdge';

/**
 * A cutout that has not been generated yet, drawn loudly.
 *
 * `Footage.tsx` does this for video and the reasoning applies just as much to
 * art: a shot has to be buildable, previewable and reviewable before its assets
 * land, and the one genuinely dangerous placeholder is the one mistakable for a
 * design decision.
 *
 * The first version of this was all one cream, close in value to the field, and
 * eight overlapping placeholders became a single unreadable mass — the layout
 * could not be checked at all, which is the only thing a placeholder exists
 * for. So each gets its own tone from a deliberately un-series-like palette
 * plus a dashed border. It should be obvious at a glance that none of this is
 * the design.
 */

/** Cool greys and blues: nothing in the series' warm-paper range. */
const TONES = ['#9fb0c2', '#b6c3cf', '#8c9db0', '#c3ccd6', '#a8b6a9', '#bfb4c4', '#9aa8b8', '#cdc6b8'];

export const Placeholder: React.FC<{
	label: string;
	file: string;
	width: number;
	height: number;
	seed?: number;
}> = ({label, file, width, height, seed = 7}) => {
	const tone = TONES[seed % TONES.length];
	// Sized to fit rather than assumed: a label wider than its box was being
	// clipped by the torn edge, which is how BARE WALL rendered as BARE WI.
	const labelSize = Math.max(13, Math.min(width / (label.length * 0.62), height * 0.16));

	return (
		<div
			style={{
				position: 'relative',
				width,
				height,
				background: tone,
				border: '3px dashed rgba(20,26,34,0.75)',
				boxSizing: 'border-box',
				clipPath: tornPolygon({seed, depth: 4, teeth: 13}),
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
				justifyContent: 'center',
				textAlign: 'center',
				padding: 10,
				overflow: 'hidden',
			}}
		>
			<div
				style={{
					position: 'absolute',
					inset: 0,
					backgroundImage:
						'repeating-linear-gradient(45deg, rgba(20,26,34,0.14) 0 3px, transparent 3px 16px)',
				}}
			/>
			<div
				style={{
					fontFamily: 'RansomAnton, sans-serif',
					fontSize: labelSize,
					letterSpacing: 0.5,
					color: '#141a22',
					lineHeight: 1.02,
					zIndex: 2,
					wordBreak: 'break-word',
				}}
			>
				{label}
			</div>
			<div
				style={{
					marginTop: 4,
					fontFamily: 'RansomSpecialElite, monospace',
					fontSize: Math.max(10, labelSize * 0.42),
					color: 'rgba(20,26,34,0.66)',
					zIndex: 2,
					wordBreak: 'break-all',
				}}
			>
				{file}
			</div>
			<NewsprintTexture opacity={0.14} />
		</div>
	);
};

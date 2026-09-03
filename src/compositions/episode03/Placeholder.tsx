import React from 'react';
import {NewsprintTexture} from '../../components/NewsprintTexture';
import {tornPolygon} from '../../components/tornEdge';

/**
 * A cutout that has not been generated yet, drawn loudly.
 *
 * `Footage.tsx` does this for video and the reason applies just as much to art:
 * a shot has to be buildable, previewable and reviewable before its assets
 * land, and the one genuinely dangerous placeholder is the one that could be
 * mistaken for a design decision. So these say what they are, name the file
 * they are waiting for, and are hatched.
 */
export const Placeholder: React.FC<{
	label: string;
	file: string;
	width: number;
	height: number;
	seed?: number;
}> = ({label, file, width, height, seed = 7}) => (
	<div
		style={{
			position: 'relative',
			width,
			height,
			background: '#d8cdb2',
			clipPath: tornPolygon({seed, depth: 5, teeth: 13}),
			display: 'flex',
			flexDirection: 'column',
			alignItems: 'center',
			justifyContent: 'center',
			textAlign: 'center',
			padding: 12,
			boxSizing: 'border-box',
			overflow: 'hidden',
		}}
	>
		<div
			style={{
				position: 'absolute',
				inset: 0,
				backgroundImage:
					'repeating-linear-gradient(45deg, rgba(36,29,21,0.16) 0 3px, transparent 3px 15px)',
			}}
		/>
		<div
			style={{
				fontFamily: 'RansomAnton, sans-serif',
				fontSize: Math.max(16, Math.min(width, height) * 0.13),
				letterSpacing: 1,
				color: '#241d15',
				lineHeight: 1.05,
				zIndex: 2,
			}}
		>
			{label}
		</div>
		<div
			style={{
				marginTop: 6,
				fontFamily: 'RansomSpecialElite, monospace',
				fontSize: Math.max(11, Math.min(width, height) * 0.06),
				color: 'rgba(36,29,21,0.7)',
				zIndex: 2,
			}}
		>
			{file}
		</div>
		<NewsprintTexture opacity={0.2} />
	</div>
);

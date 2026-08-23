import React from 'react';
import {AbsoluteFill} from 'remotion';

export type NewsprintTextureProps = {
	/** 0-1 overall opacity of the texture layer */
	opacity?: number;
	/** CSS contrast() multiplier applied to the grain, e.g. 1.2 = punchier */
	contrast?: number;
	grayscale?: boolean;
	/** size in px of one halftone dot repeat */
	halftoneSize?: number;
	blendMode?: React.CSSProperties['mixBlendMode'];
};

/**
 * Procedural paper-grain + halftone-dot overlay. Built from an SVG
 * feTurbulence filter and a repeating radial-gradient so no binary texture
 * asset is required — swap in a scanned grain PNG later by replacing the
 * `grainDataUri` with a real asset if a more authentic look is needed.
 */
export const NewsprintTexture: React.FC<NewsprintTextureProps> = ({
	opacity = 0.3,
	contrast = 1,
	grayscale = false,
	halftoneSize = 6,
	blendMode = 'multiply',
}) => {
	return (
		<AbsoluteFill
			style={{
				pointerEvents: 'none',
				opacity,
				filter: `contrast(${contrast}) ${grayscale ? 'grayscale(1)' : ''}`,
				mixBlendMode: blendMode,
			}}
		>
			{/* halftone dot layer */}
			<AbsoluteFill
				style={{
					backgroundImage:
						'radial-gradient(circle, rgba(20,20,15,0.6) 0.6px, transparent 0.7px)',
					backgroundSize: `${halftoneSize}px ${halftoneSize}px`,
				}}
			/>
			{/* fibrous paper grain layer via SVG turbulence */}
			<svg width="0" height="0">
				<filter id="paper-grain-filter">
					<feTurbulence
						type="fractalNoise"
						baseFrequency="0.9"
						numOctaves="2"
						seed="7"
						stitchTiles="stitch"
						result="noise"
					/>
					<feColorMatrix
						in="noise"
						type="matrix"
						values="0 0 0 0 0.1
						        0 0 0 0 0.09
						        0 0 0 0 0.08
						        0 0 0 0.5 0"
					/>
				</filter>
			</svg>
			<AbsoluteFill
				style={{
					filter: 'url(#paper-grain-filter)',
				}}
			/>
		</AbsoluteFill>
	);
};

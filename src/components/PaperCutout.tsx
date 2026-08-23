import React from 'react';
import {useCurrentFrame} from 'remotion';
import {CUTOUT_REGISTRY, CutoutAsset} from '../assets/cutouts';
import {NewsprintTexture} from './NewsprintTexture';
import {useStopMotionStep} from './useStopMotionStep';

export type PaperCutoutProps = {
	asset: CutoutAsset;
	style?: React.CSSProperties;
	/** overlay grain/halftone opacity on top of this cutout, 0 to disable */
	textureOpacity?: number;
	grayscale?: boolean;
	/**
	 * Optional stop-motion wiggle: re-quantizes the local frame into
	 * `stepSize`-frame chunks and applies a tiny alternating rotation so the
	 * cutout hops/jitters like an animator nudged it between shots.
	 */
	jitter?: {stepSize: number; amplitudeDeg?: number};
	/**
	 * Relative shadow strength, used to sell depth when a cutout is layered
	 * against others — a receded background piece should cast a tighter,
	 * fainter shadow than one currently in the foreground. 1 = default.
	 */
	elevation?: number;
};

/**
 * Base wrapper for any landmark/character cutout. Looks the illustration up
 * from CUTOUT_REGISTRY by `asset` key and layers a NewsprintTexture overlay
 * (via mix-blend-mode) on top to sell the paper-collage look.
 */
export const PaperCutout: React.FC<PaperCutoutProps> = ({
	asset,
	style,
	textureOpacity = 0.35,
	grayscale = false,
	jitter,
	elevation = 1,
}) => {
	const frame = useCurrentFrame();
	const Illustration = CUTOUT_REGISTRY[asset];

	// Hook is always called (rules of hooks) even when unused, with a safe
	// fallback step size; its result is only applied when `jitter` is set.
	const {stepIndex} = useStopMotionStep(frame, jitter?.stepSize ?? 1);
	const amplitude = jitter?.amplitudeDeg ?? 1.5;
	const jitterRotation = jitter
		? stepIndex % 2 === 0
			? -amplitude
			: amplitude
		: 0;

	return (
		<div
			style={{
				position: 'relative',
				transform: jitter ? `rotate(${jitterRotation}deg)` : undefined,
				filter: `drop-shadow(0 ${6 * elevation}px ${12 * elevation}px rgba(0,0,0,${Math.min(0.45, 0.22 * elevation)}))`,
				...style,
			}}
		>
			<Illustration />
			{textureOpacity > 0 ? (
				<NewsprintTexture opacity={textureOpacity} grayscale={grayscale} />
			) : null}
		</div>
	);
};

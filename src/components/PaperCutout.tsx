import React from 'react';
import {Img, staticFile, useCurrentFrame} from 'remotion';
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
	/**
	 * A solid white (by default) ring traced around the artwork's own
	 * silhouette — a sticker-style outline, for pulling a character forward
	 * off a busy field. `width` only; colour is fixed at build time (see
	 * scripts/cutout-alpha.mjs) since the ring is a pre-baked second PNG,
	 * not a runtime effect — two things were tried and both failed before
	 * landing here. Sixteen chained CSS drop-shadow()s (one offset copy per
	 * direction) worked visually but hung the render: each drop-shadow in a
	 * filter chain re-composites the ENTIRE result of the ones before it, so
	 * 16 of them is 16 full-image composites a frame, and Chromium timed out
	 * on the first frame that needed it. An SVG feMorphology dilate filter
	 * replaced it — one filter operation instead of sixteen — but produced
	 * visible tiling seams in headless Chromium's software rasteriser.
	 * `<asset>-outline.png`, generated once at build time by dilating the
	 * art's own binarized alpha mask, has no per-frame cost at all: it is
	 * just an <img>, stacked directly beneath the original art so only the
	 * grown ring shows past the art's own edge. Present only for assets
	 * whose OVERRIDES entry set `outline`; anything else renders unchanged.
	 */
	outline?: boolean;
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
	outline,
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
				// Two stacked shadows read as real paper lifted off the backdrop:
				// a tight, darker contact shadow anchoring it to the surface, plus
				// a wider, softer cast shadow for the height. Both scale with
				// elevation, so a receded background cutout sits nearly flat while
				// a foreground one floats well clear of the page.
				filter: [
					`drop-shadow(0 ${1.5 * elevation}px ${2 * elevation}px rgba(48,34,18,${Math.min(0.5, 0.3 * elevation)}))`,
					`drop-shadow(0 ${9 * elevation}px ${16 * elevation}px rgba(48,34,18,${Math.min(0.4, 0.24 * elevation)}))`,
				].join(' '),
				...style,
			}}
		>
			{outline ? (
				// The registry's asset key equals its file's basename
				// throughout (checked before relying on this), so the
				// pre-baked outline sits at "<asset>-outline.png" with no
				// extra lookup table needed.
				<Img
					src={staticFile(`cutouts-alpha/${asset}-outline.png`)}
					style={{position: 'absolute', inset: 0, width: '100%', height: '100%'}}
				/>
			) : null}
			<Illustration />
			{textureOpacity > 0 ? (
				<NewsprintTexture opacity={textureOpacity} grayscale={grayscale} />
			) : null}
		</div>
	);
};

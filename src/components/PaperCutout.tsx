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
	/**
	 * A solid outline traced around the artwork's own alpha silhouette — a
	 * sticker-style ring, for pulling a character forward off a busy field.
	 * Applied to the illustration only, underneath the elevation shadow, so
	 * the shadow is cast from the (slightly larger) outlined shape rather
	 * than outlining the shadow itself.
	 */
	outline?: {color?: string; width?: number};
};

/**
 * A true single-pass outline via an SVG filter, not a CSS approximation.
 *
 * The first version stacked 16 chained drop-shadow() filters — one offset
 * copy per direction around a circle — to fake an outline without SVG. It
 * rendered fine locally but hung the render workflow: each drop-shadow in a
 * chain re-composites the ENTIRE accumulated result of the ones before it,
 * so 16 of them is 16 sequential full-image composites per frame, not a
 * fixed cost. Chromium timed out waiting for the first frame that used it
 * (30s+ on a single frame, headless).
 *
 * feMorphology dilates the source's alpha mask directly — one operation,
 * not sixteen — then feFlood + feComposite recolour just the dilated ring,
 * and feMerge stacks it under the original art so only the ring shows past
 * the art's own edge. Same visual result, a fraction of the cost.
 */
const outlineFilterId = (asset: string, color: string, width: number): string =>
	`outline-${asset}-${color.replace('#', '')}-${width}`;

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
			<div
				style={{
					width: '100%',
					height: '100%',
					filter: outline
						? `url(#${outlineFilterId(asset, outline.color ?? '#ffffff', outline.width ?? 6)})`
						: undefined,
				}}
			>
				{outline ? (
					<svg width={0} height={0} style={{position: 'absolute'}}>
						<filter id={outlineFilterId(asset, outline.color ?? '#ffffff', outline.width ?? 6)}>
							<feMorphology
								operator="dilate"
								radius={outline.width ?? 6}
								in="SourceAlpha"
								result="dilated"
							/>
							<feFlood floodColor={outline.color ?? '#ffffff'} result="flood" />
							<feComposite in="flood" in2="dilated" operator="in" result="ring" />
							<feMerge>
								<feMergeNode in="ring" />
								<feMergeNode in="SourceGraphic" />
							</feMerge>
						</filter>
					</svg>
				) : null}
				<Illustration />
			</div>
			{textureOpacity > 0 ? (
				<NewsprintTexture opacity={textureOpacity} grayscale={grayscale} />
			) : null}
		</div>
	);
};

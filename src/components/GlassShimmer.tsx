import React from 'react';
import {AbsoluteFill, interpolate} from 'remotion';

export type GlassShimmerProps = {
	frame: number;
	/** frame the shimmer sweep starts */
	startFrame: number;
	durationInFrames?: number;
};

/**
 * A soft diagonal highlight band that sweeps once across glass-fronted
 * cutouts (IT park, Lalbagh glasshouse) to give them a "moment" during
 * their hold — a cheap stand-in for a light-on-glass glint.
 */
export const GlassShimmer: React.FC<GlassShimmerProps> = ({
	frame,
	startFrame,
	durationInFrames = 18,
}) => {
	const progress = interpolate(frame, [startFrame, startFrame + durationInFrames], [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});
	const bandPosition = interpolate(progress, [0, 1], [-60, 160]);

	return (
		<AbsoluteFill
			style={{
				pointerEvents: 'none',
				opacity: interpolate(progress, [0, 0.1, 0.9, 1], [0, 0.55, 0.55, 0]),
				background: `linear-gradient(115deg, transparent ${bandPosition - 18}%, rgba(255,255,255,0.75) ${bandPosition}%, transparent ${bandPosition + 18}%)`,
				mixBlendMode: 'overlay',
			}}
		/>
	);
};

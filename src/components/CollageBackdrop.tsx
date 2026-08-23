import React from 'react';
import {AbsoluteFill, interpolate, interpolateColors} from 'remotion';
import {NewsprintTexture} from './NewsprintTexture';

export type CollageBackdropProps = {
	/**
	 * 0 = calm opening (warm, bright, orderly), 1 = peak overload (dimmer,
	 * cooler, closing in). Drives the whole surface so the backdrop escalates
	 * along with the montage instead of sitting inert behind it.
	 */
	chaos: number;
	/** 0 = paper backdrop, 1 = the newsprint-black title card. */
	blackout?: number;
};

/**
 * The physical surface every cutout is pinned to — a sheet of warm craft
 * paper, lit from above, with a horizon band so the city has ground to stand
 * on and a vignette so the frame has depth rather than reading as flat fill.
 */
export const CollageBackdrop: React.FC<CollageBackdropProps> = ({chaos, blackout = 0}) => {
	const paperTop = interpolateColors(chaos, [0, 1], ['#f7f2e4', '#e8dcc4']);
	const paperBottom = interpolateColors(chaos, [0, 1], ['#e9dfc9', '#d3c3a4']);
	const groundColor = interpolateColors(chaos, [0, 1], ['#dccfb0', '#c0ad8a']);

	// The vignette tightens as things get more crowded — the frame literally
	// closes in on the pile-up.
	const vignetteStrength = interpolate(chaos, [0, 1], [0.24, 0.46]);
	const vignetteRadius = interpolate(chaos, [0, 1], [78, 58]);

	return (
		<AbsoluteFill>
			{/* base sheet, lit top-down */}
			<AbsoluteFill
				style={{background: `linear-gradient(180deg, ${paperTop} 0%, ${paperBottom} 100%)`}}
			/>

			{/* ground haze — a soft tonal shift low in the frame so cutouts feel
			    like they are standing on something, without a hard horizon seam
			    (the camera moves, so a crisp line would visibly fail to track) */}
			<AbsoluteFill
				style={{
					top: '58%',
					background: `linear-gradient(180deg, transparent 0%, ${groundColor} 55%, ${paperBottom} 100%)`,
					opacity: 0.5,
				}}
			/>

			<NewsprintTexture opacity={interpolate(chaos, [0, 1], [0.1, 0.16])} />

			{/* vignette for depth */}
			<AbsoluteFill
				style={{
					background: `radial-gradient(ellipse at 50% 46%, transparent ${vignetteRadius}%, rgba(60,44,24,${vignetteStrength}) 130%)`,
				}}
			/>

			{/* title-card blackout, laid over everything */}
			{blackout > 0 ? (
				<AbsoluteFill style={{backgroundColor: '#0b0906', opacity: blackout}} />
			) : null}
		</AbsoluteFill>
	);
};

import React from 'react';
import {Img, interpolate, staticFile} from 'remotion';
import {CutoutAsset} from '../assets/cutouts';

const CLAMP = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const INK = '#241d15';

export type NewsHeadlineProps = {
	/** Big kinetic headline, slammed in above the clipping. */
	headline: string;
	/** The quoted line under it — a union demand, a victim's own words. */
	quote: string;
	/** A generated newspaper-clipping cutout, registered in assets/cutouts. */
	clipping: CutoutAsset;
	/** Frames since this headline landed. Negative means it hasn't yet. */
	age: number;
	width: number;
	/**
	 * Height of the clipping's display box. The registered clippings are
	 * pre-cropped to their photo by scripts/crop-newspaper-clippings.mjs, so
	 * this only needs to be close to that crop's own aspect ratio — it is a
	 * fixed number rather than "however tall the source is" because two
	 * headlines have to fit a 9:16 frame together, and object-fit: cover
	 * still needs an explicit box to fit into.
	 */
	clipHeight: number;
	rotate?: number;
	/** Wraps the quote line in curly quotes. Off for a status line that is
	 * being reported rather than quoted, like "committee yet to meet". */
	quoted?: boolean;
};

/**
 * One newspaper headline: kinetic type slammed above a real torn clipping.
 *
 * The clipping supplies the photo and the greeked body-text texture — the
 * things a generator can render better than CSS can fake — and the actual
 * story, which has to stay art-directable and exactly on the script's
 * wording, is set in code the same way every other headline in the series
 * is: RansomAnton for the shout, a monospace line for the quote underneath.
 *
 * Lands as a single stamp — a frame over-scaled and skewed, then settled —
 * rather than fading up, matching the "kinetic type slams in" the script
 * asks for at every headline beat.
 */
export const NewsHeadline: React.FC<NewsHeadlineProps> = ({
	headline,
	quote,
	clipping,
	age,
	width,
	clipHeight,
	rotate = -1.5,
	quoted = true,
}) => {
	if (age < 0) return null;
	const punch = age < 3 ? 1.08 : 1;
	const opacity = interpolate(age, [0, 2], [0, 1], CLAMP);
	const settle = interpolate(age, [0, 4], [10, 0], CLAMP);

	return (
		<div
			style={{
				width,
				opacity,
				transform: `translateY(${settle}px) scale(${punch}) rotate(${rotate}deg)`,
			}}
		>
			<div
				style={{
					fontFamily: 'RansomAnton, sans-serif',
					fontSize: width * 0.1,
					lineHeight: 0.98,
					letterSpacing: 0.5,
					color: INK,
					textShadow: '2px 3px 0 rgba(0,0,0,0.15)',
					whiteSpace: 'pre-line',
				}}
			>
				{headline}
			</div>
			<div
				style={{
					marginTop: width * 0.02,
					fontFamily: 'RansomSpecialElite, monospace',
					fontSize: width * 0.042,
					lineHeight: 1.25,
					color: 'rgba(36,29,21,0.82)',
				}}
			>
				{quoted ? `“${quote}”` : quote}
			</div>
			<div
				style={{
					position: 'relative',
					marginTop: width * 0.04,
					width: width * 0.86,
					height: clipHeight,
					overflow: 'hidden',
					// The same two-layer drop shadow every cutout in the series
					// uses, applied by hand here rather than through PaperCutout —
					// that component's Img is hardcoded to object-fit: contain,
					// right for a full illustration but wrong for a crop like
					// this one, which needs cover instead.
					filter: [
						'drop-shadow(0 1.5px 2px rgba(48,34,18,0.4))',
						'drop-shadow(0 9px 16px rgba(48,34,18,0.32))',
					].join(' '),
				}}
			>
				<Img
					src={staticFile(`cutouts-alpha/${clipping}.png`)}
					style={{width: '100%', height: '100%', objectFit: 'cover'}}
				/>
			</div>
		</div>
	);
};

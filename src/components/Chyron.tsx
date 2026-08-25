import React from 'react';
import {interpolate} from 'remotion';
import {NewsprintTexture} from './NewsprintTexture';
import {tornPolygon} from './tornEdge';

const CLAMP = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const INK = '#241d15';

export type ChyronProps = {
	name: string;
	title: string;
	/**
	 * A third, much smaller line — for a credential that wants undercutting
	 * rather than stating straight, the way an asterisked footnote works on a
	 * printed nameplate. Deliberately hard to read at normal viewing size:
	 * that is the joke, not a bug.
	 */
	footnote?: string;
	frame: number;
	in: number;
	/** Omit to hold to the end of the shot rather than fading back out. */
	out?: number;
	left?: number;
	top: number;
	width?: number;
	seed: number;
};

/**
 * A broadcast-style lower third, newsprint rather than a real TV chyron —
 * the same rule as everywhere else in this episode: the caption stays paper
 * even where the picture behind it has stopped being paper.
 *
 * Reusable because Scene 2 needs several of these, and they should all move
 * and read identically: fade in on a beat before the speaker starts, and
 * either hold to the end of their shot or fade back out ahead of a caption
 * that belongs to somebody else, so the frame never claims two names at once.
 */
export const Chyron: React.FC<ChyronProps> = ({
	name,
	title,
	footnote,
	frame,
	in: fadeIn,
	out: fadeOut,
	left = 84,
	top,
	width = 880,
	seed,
}) => {
	if (frame < fadeIn) return null;
	const opacity =
		fadeOut !== undefined
			? interpolate(frame, [fadeIn, fadeIn + 3, fadeOut - 4, fadeOut], [0, 1, 1, 0], CLAMP)
			: interpolate(frame, [fadeIn, fadeIn + 3], [0, 1], CLAMP);
	if (opacity <= 0) return null;

	return (
		<div
			style={{
				position: 'absolute',
				left,
				top,
				width,
				background: '#efe4c8',
				padding: '20px 32px 24px',
				clipPath: tornPolygon({seed, depth: 5, teeth: 16}),
				boxShadow: '0 10px 22px rgba(12,10,8,0.5)',
				opacity,
			}}
		>
			<div
				style={{
					fontFamily: 'RansomAnton, sans-serif',
					fontSize: 52,
					letterSpacing: 1.5,
					color: INK,
				}}
			>
				{name}
			</div>
			<div
				style={{
					marginTop: 6,
					fontFamily: 'RansomSpecialElite, monospace',
					fontSize: 27,
					lineHeight: 1.3,
					color: 'rgba(36,29,21,0.75)',
					// A caller passing two credentials on one card (a title and an
					// institution) splits them with "\n" rather than getting a
					// second prop — it is still one line of text, just a long one.
					whiteSpace: 'pre-line',
				}}
			>
				{title}
			</div>
			{footnote ? (
				<div
					style={{
						marginTop: 3,
						fontFamily: 'RansomSpecialElite, monospace',
						fontSize: 15,
						color: 'rgba(36,29,21,0.42)',
					}}
				>
					{footnote}
				</div>
			) : null}
			<NewsprintTexture opacity={0.16} />
		</div>
	);
};

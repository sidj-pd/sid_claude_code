import React from 'react';
import {AbsoluteFill, Audio, Easing, Sequence, interpolate, useCurrentFrame} from 'remotion';
import {NewsprintTexture} from './NewsprintTexture';

export type PageFlipTransitionProps = {
	children: React.ReactNode;
	/** total length (in frames) of the parent Sequence this transition lives in */
	totalDurationInFrames: number;
	/** how many frames, at the end of the sequence, the flip itself takes */
	durationInFrames: number;
	direction?: 'left' | 'right';
	/** optional SFX cue, e.g. a paper-riffle whoosh, played as the flip starts */
	sfxSrc?: string;
	sfxPlaybackRate?: number;
	sfxVolume?: number;
};

/**
 * Reusable wipe: rotates its content away on a CSS 3D Y axis like a page
 * turning, briefly revealing a blank newsprint "backface" as it passes 90°,
 * with an optional timed SFX cue at the start of the flip.
 */
export const PageFlipTransition: React.FC<PageFlipTransitionProps> = ({
	children,
	totalDurationInFrames,
	durationInFrames,
	direction = 'left',
	sfxSrc,
	sfxPlaybackRate = 1,
	sfxVolume = 1,
}) => {
	const frame = useCurrentFrame();
	const flipStart = Math.max(0, totalDurationInFrames - durationInFrames);

	const progress = interpolate(frame, [flipStart, totalDurationInFrames], [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
		easing: Easing.in(Easing.cubic),
	});

	const sign = direction === 'left' ? -1 : 1;
	const rotateY = sign * progress * 100;
	const opacity = interpolate(progress, [0, 0.85, 1], [1, 1, 0], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});

	return (
		<AbsoluteFill style={{perspective: 1600}}>
			<AbsoluteFill
				style={{
					transformStyle: 'preserve-3d',
					transform: `rotateY(${rotateY}deg)`,
					transformOrigin: direction === 'left' ? 'right center' : 'left center',
					opacity,
				}}
			>
				<AbsoluteFill style={{backfaceVisibility: 'hidden'}}>{children}</AbsoluteFill>
				<AbsoluteFill
					style={{
						backfaceVisibility: 'hidden',
						transform: 'rotateY(180deg)',
						backgroundColor: '#efe4c8',
					}}
				>
					<NewsprintTexture opacity={0.5} contrast={1.1} />
				</AbsoluteFill>
			</AbsoluteFill>
			{sfxSrc ? (
				<Sequence from={flipStart} durationInFrames={durationInFrames}>
					<Audio src={sfxSrc} playbackRate={sfxPlaybackRate} volume={sfxVolume} />
				</Sequence>
			) : null}
		</AbsoluteFill>
	);
};

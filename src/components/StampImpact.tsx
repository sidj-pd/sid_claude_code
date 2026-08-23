import React from 'react';
import {AbsoluteFill, Audio, Sequence, interpolate, useCurrentFrame} from 'remotion';

export type StampImpactProps = {
	children: React.ReactNode;
	/** local frame (within the parent Sequence) the stamp lands on */
	triggerFrame: number;
	/** how many frames the punch takes to settle from 1.1x to 1.0x */
	punchDurationInFrames?: number;
	rotationDeg?: number;
	sfxSrc?: string;
	sfxVolume?: number;
};

/**
 * Title-drop stamp effect. Children render normally (untouched) up to
 * `triggerFrame` — e.g. while a headline is still animating in — then get
 * hit with a scale punch (1.1 -> 1.0) and an optional synced thud SFX, as if
 * a seal just slammed down on the finished layout. Intended for a single
 * use per flip/beat, not a looping animation.
 */
export const StampImpact: React.FC<StampImpactProps> = ({
	children,
	triggerFrame,
	punchDurationInFrames = 4,
	rotationDeg = -3,
	sfxSrc,
	sfxVolume = 1,
}) => {
	const frame = useCurrentFrame();
	const local = frame - triggerFrame;

	const scale =
		local < 0
			? 1
			: interpolate(local, [0, punchDurationInFrames], [1.1, 1], {
					extrapolateLeft: 'clamp',
					extrapolateRight: 'clamp',
				});

	return (
		<AbsoluteFill
			style={{
				justifyContent: 'center',
				alignItems: 'center',
				transform: `scale(${scale}) rotate(${local < 0 ? 0 : rotationDeg}deg)`,
			}}
		>
			{children}
			{sfxSrc ? (
				<Sequence from={triggerFrame}>
					<Audio src={sfxSrc} volume={sfxVolume} />
				</Sequence>
			) : null}
		</AbsoluteFill>
	);
};

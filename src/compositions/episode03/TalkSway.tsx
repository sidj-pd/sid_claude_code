import React from 'react';
import {useCurrentFrame} from 'remotion';
import {useStopMotionStep} from '../../components/useStopMotionStep';

export type TalkSwayProps = {
	/** first frame of the line this sway conveys */
	from: number;
	/** length of the line, in frames — sway runs for exactly this long and
	 *  is otherwise off, so a paused figure doesn't idle-wobble */
	frames: number;
	/** pixels of horizontal travel each way */
	amplitude?: number;
	/**
	 * Frames per discrete step. A sine wave reads as motion graphics in this
	 * series — every other move is stop-motion quantised — so this hops
	 * between fixed positions rather than easing between them, the same rule
	 * Arrive and the cash travel already follow.
	 */
	stepSize?: number;
	children: React.ReactNode;
};

/**
 * A small side-to-side weight shift while a line plays, standing in for a
 * talking cutout's mouth movement when the art has none. Ramps in and out on
 * its first and last step rather than snapping straight to full amplitude,
 * and renders children completely untouched outside [from, from+frames) —
 * including before mount, so a figure sits still until it actually speaks.
 */
export const TalkSway: React.FC<TalkSwayProps> = ({
	from,
	frames,
	amplitude = 6,
	stepSize = 6,
	children,
}) => {
	const frame = useCurrentFrame();
	const age = frame - from;

	// Hook always called (rules of hooks); its result is only used in range.
	const {stepIndex} = useStopMotionStep(Math.max(0, age), stepSize);

	if (age < 0 || age >= frames) {
		return <>{children}</>;
	}

	const totalSteps = Math.ceil(frames / stepSize);
	const isEdgeStep = stepIndex === 0 || stepIndex >= totalSteps - 1;
	const ramp = isEdgeStep ? 0.5 : 1;
	const sign = stepIndex % 2 === 0 ? -1 : 1;
	const dx = sign * amplitude * ramp;
	const rotate = sign * 0.8 * ramp;

	return <div style={{transform: `translateX(${dx}px) rotate(${rotate}deg)`}}>{children}</div>;
};

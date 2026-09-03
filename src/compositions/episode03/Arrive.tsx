import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {useStopMotionStep} from '../../components/useStopMotionStep';

const CLAMP = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

export type ArriveProps = {
	/** Frame this element lands on. Before it, nothing is drawn at all. */
	at: number;
	children: React.ReactNode;
	/**
	 * Which edge it comes from, as a short stepped slide. `none` means it simply
	 * appears where it belongs, which is right for anything that reads as being
	 * placed rather than moved.
	 */
	from?: 'left' | 'right' | 'top' | 'bottom' | 'none';
	/** How far it travels, in px. Kept small — this is a placement, not a fly-in. */
	distance?: number;
	/** Degrees it settles through. Paper lands slightly crooked and stays. */
	tilt?: number;
	/** Its resting rotation, which the tilt settles onto. */
	rotate?: number;
	style?: React.CSSProperties;
};

/**
 * One element arriving into the frame.
 *
 * The reference style's whole signature is that the frame assembles itself —
 * it opens empty and builds, piece by piece, rather than existing and being
 * panned across. This is that, and it is the opposite of how Episodes 01 and
 * 02 stage a shot, where everything is already placed and a camera finds it.
 *
 * It lands rather than fades. One frame over-scaled and over-tilted, then
 * settled by the third — the same arrival `EvidenceStamp` and `StampImpact`
 * use, because a cutout being put down should behave like every other piece of
 * paper in the series. Nothing eases in over twenty frames; at this pace an
 * ease reads as a drift and the assembly stops being legible.
 *
 * The slide is deliberately short and quantised to the stop-motion grid. A long
 * smooth entrance would look like motion graphics; two chunky steps look like a
 * hand putting a thing down.
 */
export const Arrive: React.FC<ArriveProps> = ({
	at,
	children,
	from = 'none',
	distance = 44,
	tilt = 3,
	rotate = 0,
	style,
}) => {
	const frame = useCurrentFrame();
	const age = frame - at;
	if (age < 0) return null;

	// Two stepped positions on the way in, then rest.
	const {stepIndex} = useStopMotionStep(age, 2);
	const settled = Math.min(stepIndex, 2) / 2;

	const travel = interpolate(settled, [0, 1], [distance, 0]);
	const dx = from === 'left' ? -travel : from === 'right' ? travel : 0;
	const dy = from === 'top' ? -travel : from === 'bottom' ? travel : 0;

	const scale = age < 2 ? 1.09 : age < 4 ? 1.02 : 1;
	const spin = interpolate(settled, [0, 1], [rotate + tilt, rotate]);

	return (
		<div
			style={{
				transform: `translate(${dx}px, ${dy}px) scale(${scale}) rotate(${spin}deg)`,
				opacity: age < 1 ? 0.85 : 1,
				...style,
			}}
		>
			{children}
		</div>
	);
};

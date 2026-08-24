import React from 'react';
import {AbsoluteFill, Easing, interpolate, useCurrentFrame} from 'remotion';
import {CollageBackdrop} from '../../../components/CollageBackdrop';
import {PaperCutout} from '../../../components/PaperCutout';
import {RansomSpeechBubble} from '../../../components/RansomSpeechBubble';
import {usePopIn} from '../../../components/usePopIn';
import {BUBBLE_IN, HOLD_BEGINS, LEAN_SETTLES} from './beats';

/**
 * Shot 2 — the destination.
 *
 * Staging reverses Shot 1: the passenger is now on the right in the
 * foreground with the auto at the left, so the geography of who is standing
 * where holds across the cut. He leans in toward it, and instead of a mouth
 * moving, a torn-paper bubble carries the word.
 *
 * Nothing moves after HOLD_BEGINS. The dead air is the shot.
 */
export const Shot02Destination: React.FC = () => {
	const frame = useCurrentFrame();

	// The lean settles in over the first half-second, then locks.
	const lean = interpolate(frame, [0, LEAN_SETTLES], [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
		easing: Easing.out(Easing.cubic),
	});
	const leanRotate = interpolate(lean, [0, 1], [0, -6]);
	const leanShift = interpolate(lean, [0, 1], [40, 0]);

	// The bubble tears on with a springy overshoot rather than fading in —
	// paper arrives, it doesn't dissolve.
	const bubblePop = usePopIn(frame, {delay: BUBBLE_IN, damping: 10, stiffness: 210});

	// A very slow creep inward through the hold. Almost subliminal, but a
	// completely frozen frame reads as a still rather than as tension.
	const creep = interpolate(frame, [HOLD_BEGINS, 120], [1, 1.035], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});

	return (
		<AbsoluteFill>
			<CollageBackdrop chaos={0.22} />

			<AbsoluteFill style={{transform: `scale(${creep})`}}>
				{/* street surface */}
				<div
					style={{
						position: 'absolute',
						left: '50%',
						top: '50%',
						width: 2200,
						height: 1642,
						marginLeft: -1100,
						marginTop: -821,
						transform: 'translateY(600px)',
						zIndex: 10,
					}}
				>
					<PaperCutout asset="pothole-road" textureOpacity={0} elevation={0.9} />
				</div>

				{/* the auto, waiting at the left — mostly out of frame, because
				    this shot belongs to the passenger */}
				<div
					style={{
						position: 'absolute',
						left: '50%',
						top: '50%',
						width: 1180,
						height: 881,
						marginLeft: -590,
						marginTop: -440,
						transform: 'translate(-520px, -165px)',
						zIndex: 20,
					}}
				>
					<PaperCutout asset="auto-driver-34" textureOpacity={0} elevation={1.2} />
				</div>

				{/* the passenger, foreground right, leaning in toward the auto */}
				<div
					style={{
						position: 'absolute',
						left: '50%',
						top: '50%',
						width: 1500,
						height: 1120,
						marginLeft: -750,
						marginTop: -560,
						transform: `translate(${250 + leanShift}px, 235px) rotate(${leanRotate}deg)`,
						transformOrigin: 'bottom center',
						zIndex: 40,
					}}
				>
					<PaperCutout asset="passenger-leaning" textureOpacity={0} elevation={1.4} />
				</div>

				{/* the destination, in clipped newsprint */}
				{frame >= BUBBLE_IN ? (
					<div
						style={{
							position: 'absolute',
							left: '50%',
							top: '50%',
							marginLeft: -430,
							transform: `translate(150px, -650px) scale(${bubblePop})`,
							transformOrigin: 'bottom left',
							zIndex: 60,
						}}
					>
						<RansomSpeechBubble text="WHITEFIELD" frame={frame - BUBBLE_IN} fontSize={78} tailAt={0.62} />
					</div>
				) : null}
			</AbsoluteFill>
		</AbsoluteFill>
	);
};

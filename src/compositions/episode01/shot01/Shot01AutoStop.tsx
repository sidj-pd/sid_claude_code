import React from 'react';
import {AbsoluteFill, Easing, interpolate, useCurrentFrame} from 'remotion';
import {CollageBackdrop} from '../../../components/CollageBackdrop';
import {PaperCutout} from '../../../components/PaperCutout';
import {useStopMotionStep} from '../../../components/useStopMotionStep';
import {shakeAt} from '../../montage/camera';
import {
	AUTO_ENTERS,
	AUTO_STOPS,
	HOP_STEP,
	SCREECH_PUFF,
	WAVE_ENDS,
	WAVE_STEP,
} from './beats';
import {PlaceholderHand} from './PlaceholderHand';

/** Three discrete wave poses. The hand snaps between them; it never eases. */
const WAVE_POSES = [
	{rotate: -7, dx: -14},
	{rotate: 2, dx: 4},
	{rotate: 9, dx: 16},
];

const AUTO_START_X = -1500;
const AUTO_REST_X = 150; // pulls up just past the hand, not level with it
const HAND_X = 275;

/**
 * Shot 1 — the hail and the stop.
 *
 * Staging: the hand sits large in the right foreground with the arm running
 * off the bottom edge, and the auto comes in from the left behind it and
 * overshoots slightly, so the hand ends up in front of the auto's cabin the
 * way it would if you were actually standing at the kerb. The driver is
 * never in frame — the cabin stays behind the hand and the near bodywork,
 * so the face stays withheld for the later reveal.
 */
export const Shot01AutoStop: React.FC = () => {
	const frame = useCurrentFrame();

	// --- The wave. Quantised hard so it reads as posed frames, not easing.
	const waving = frame < WAVE_ENDS;
	const {stepIndex: waveStep} = useStopMotionStep(frame, WAVE_STEP);
	const pose = WAVE_POSES[waveStep % WAVE_POSES.length];
	// Once the auto has stopped the hand simply drops out of the gesture and
	// holds still — the small "it worked" beat.
	const settle = interpolate(frame, [WAVE_ENDS, WAVE_ENDS + 8], [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
		easing: Easing.out(Easing.cubic),
	});
	const handRotate = waving ? pose.rotate : interpolate(settle, [0, 1], [pose.rotate, 0]);
	const handDx = waving ? pose.dx : interpolate(settle, [0, 1], [pose.dx, 0]);

	// --- The auto's arrival, in stepped hops rather than a smooth glide.
	const rideT = interpolate(frame, [AUTO_ENTERS, AUTO_STOPS], [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});
	const {stepIndex: hopStep} = useStopMotionStep(
		Math.max(0, frame - AUTO_ENTERS),
		HOP_STEP,
	);
	// Quantise progress to the hop grid, then ease it, so the auto covers big
	// chunks early and inches the last few — a vehicle actually braking.
	const steppedT = Math.min(1, (hopStep * HOP_STEP) / (AUTO_STOPS - AUTO_ENTERS));
	const eased = Easing.out(Easing.quad)(steppedT);
	const autoX = interpolate(
		frame < AUTO_STOPS ? eased : 1,
		[0, 1],
		[AUTO_START_X, AUTO_REST_X],
	);

	const rolling = frame >= AUTO_ENTERS && frame < AUTO_STOPS;
	const chassis = rolling ? (hopStep % 2 === 0 ? -1.3 : 1.3) : 0;
	// A nose-dip on the brakes, then a small rock back to level.
	const brakeDip = shakeAt(frame, AUTO_STOPS, 3.4);

	// --- Screech dust at the rear wheel as it pulls up.
	const puffAge = frame - SCREECH_PUFF;
	const puffLive = puffAge >= 0 && puffAge < 30;
	const puffOpacity = puffLive
		? interpolate(puffAge, [0, 5, 30], [0, 0.62, 0], {
				extrapolateLeft: 'clamp',
				extrapolateRight: 'clamp',
			})
		: 0;

	const jolt = shakeAt(frame, AUTO_STOPS, 4);

	return (
		<AbsoluteFill>
			<CollageBackdrop chaos={0.25} />

			<AbsoluteFill style={{transform: `translateY(${jolt}px)`}}>
				{/* street surface */}
				<div
					style={{
						position: 'absolute',
						left: '50%',
						top: '50%',
						width: 2100,
						height: 1568,
						marginLeft: -1050,
						marginTop: -784,
						transform: 'translateY(400px)',
						zIndex: 10,
					}}
				>
					<PaperCutout asset="pothole-road" textureOpacity={0} elevation={0.9} />
				</div>

				{/* screech dust, kicked up at the rear wheel */}
				{puffLive ? (
					<div
						style={{
							position: 'absolute',
							left: '50%',
							top: '50%',
							width: 420,
							height: 315,
							marginLeft: -210,
							marginTop: -157,
							transform: `translate(${autoX - 400}px, ${
								-30 + interpolate(puffAge, [0, 30], [0, -60], {extrapolateRight: 'clamp'})
							}px) scale(${interpolate(puffAge, [0, 30], [0.45, 1.55], {extrapolateRight: 'clamp'})})`,
							opacity: puffOpacity,
							zIndex: 18,
						}}
					>
						<PaperCutout asset="exhaust-puff" textureOpacity={0} elevation={0.5} />
					</div>
				) : null}

				{/* the auto */}
				<div
					style={{
						position: 'absolute',
						left: '50%',
						top: '50%',
						width: 1500,
						height: 1125,
						marginLeft: -750,
						marginTop: -562,
						transform: `translate(${autoX}px, -260px) rotate(${chassis + brakeDip}deg)`,
						zIndex: 20,
					}}
				>
					<PaperCutout asset="auto-rickshaw" textureOpacity={0} elevation={1.3} />
				</div>

				{/* the hand, foreground, arm running off the bottom edge */}
				<div
					style={{
						position: 'absolute',
						left: '50%',
						bottom: -40,
						width: 780,
						height: 1400,
						marginLeft: -390,
						transform: `translateX(${HAND_X + handDx}px) rotate(${handRotate}deg)`,
						transformOrigin: 'bottom center',
						filter: 'drop-shadow(0 8px 18px rgba(48,34,18,0.35))',
						zIndex: 40,
					}}
				>
					<PlaceholderHand />
				</div>
			</AbsoluteFill>
		</AbsoluteFill>
	);
};

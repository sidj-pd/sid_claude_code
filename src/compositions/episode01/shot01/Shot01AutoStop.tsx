import React from 'react';
import {AbsoluteFill, Audio, Easing, Sequence, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {CollageBackdrop} from '../../../components/CollageBackdrop';
import {PaperCutout} from '../../../components/PaperCutout';
import {useStopMotionStep} from '../../../components/useStopMotionStep';
import {shakeAt} from '../../montage/camera';
import {AUTO_ENTERS, AUTO_STOPS, HOP_STEP, SCREECH_PUFF, VO_STARTS, WAVE_ENDS, WAVE_STEP} from './beats';

/**
 * Three discrete wave poses, rotated about the elbow at the frame's right
 * edge. The hand snaps between them; it never eases.
 */
const WAVE_POSES = [-7, 1.5, 8.5];

/**
 * The auto's art faces left, so it drives right-to-left — which puts its
 * entrance on the same side as the hand. That's the better shot: it slides
 * in *behind* the waving arm rather than arriving into empty frame.
 */
const AUTO_START_X = 2200;
const AUTO_REST_X = -70;

export const Shot01AutoStop: React.FC = () => {
	const frame = useCurrentFrame();

	// --- The wave, quantised hard so it reads as posed frames, not easing.
	const waving = frame < WAVE_ENDS;
	const {stepIndex: waveStep} = useStopMotionStep(frame, WAVE_STEP);
	const pose = WAVE_POSES[waveStep % WAVE_POSES.length];
	// Once the auto has stopped the arm drops out of the gesture and holds
	// still — the small "it worked" beat, landing a few frames late on purpose.
	const settle = interpolate(frame, [WAVE_ENDS, WAVE_ENDS + 9], [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
		easing: Easing.out(Easing.cubic),
	});
	const armRotate = waving ? pose : interpolate(settle, [0, 1], [pose, 1]);

	// --- The auto's arrival, in stepped hops rather than a smooth glide.
	const {stepIndex: hopStep} = useStopMotionStep(Math.max(0, frame - AUTO_ENTERS), HOP_STEP);
	// Quantise progress to the hop grid *before* easing, so it covers big
	// chunks early and inches the last few — a vehicle actually braking.
	const steppedT = Math.min(1, (hopStep * HOP_STEP) / (AUTO_STOPS - AUTO_ENTERS));
	const eased = Easing.out(Easing.quad)(steppedT);
	const autoX = interpolate(frame < AUTO_STOPS ? eased : 1, [0, 1], [AUTO_START_X, AUTO_REST_X]);

	const rolling = frame >= AUTO_ENTERS && frame < AUTO_STOPS;
	const chassis = rolling ? (hopStep % 2 === 0 ? -1.2 : 1.2) : 0;
	const brakeDip = shakeAt(frame, AUTO_STOPS, 3.2);

	// --- Screech dust, thrown off the near wheel as it pulls up. It trails
	// to the right because the auto is travelling left.
	const puffAge = frame - SCREECH_PUFF;
	const puffLive = puffAge >= 0 && puffAge < 30;
	const clampRight = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

	const jolt = shakeAt(frame, AUTO_STOPS, 4);

	return (
		<AbsoluteFill>
			<CollageBackdrop chaos={0.22} />

			<AbsoluteFill style={{transform: `translateY(${jolt}px)`}}>
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

				{/* screech dust off the near wheel */}
				{puffLive ? (
					<div
						style={{
							position: 'absolute',
							left: '50%',
							top: '50%',
							width: 460,
							height: 345,
							marginLeft: -230,
							marginTop: -172,
							transform: `translate(${
								autoX + 380 + interpolate(puffAge, [0, 30], [0, 90], clampRight)
							}px, ${-60 + interpolate(puffAge, [0, 30], [0, -70], clampRight)}px) scale(${interpolate(
								puffAge,
								[0, 30],
								[0.4, 1.6],
								clampRight,
							)})`,
							opacity: interpolate(puffAge, [0, 5, 30], [0, 0.6, 0], clampRight),
							zIndex: 18,
						}}
					>
						<PaperCutout asset="exhaust-puff" textureOpacity={0} elevation={0.5} />
					</div>
				) : null}

				{/* the auto, with the driver */}
				<div
					style={{
						position: 'absolute',
						left: '50%',
						top: '50%',
						width: 1180,
						height: 881,
						marginLeft: -590,
						marginTop: -440,
						transform: `translate(${autoX}px, -165px) rotate(${chassis + brakeDip}deg)`,
						zIndex: 20,
					}}
				>
					<PaperCutout asset="auto-driver-34" textureOpacity={0} elevation={1.3} />
				</div>

				{/* the hailing arm, foreground, entering from the right edge and
				    pivoting about the elbow just outside frame */}
				<div
					style={{
						position: 'absolute',
						left: '50%',
						top: '50%',
						width: 1240,
						height: 926,
						marginLeft: -620,
						marginTop: -463,
						transform: `translate(470px, 95px) rotate(${armRotate}deg)`,
						transformOrigin: 'right center',
						zIndex: 40,
					}}
				>
					<PaperCutout asset="hailing-hand" textureOpacity={0} elevation={1.5} />
				</div>
			</AbsoluteFill>

			{/* Cued to the exact frame the auto comes to rest. The line is 7.9s
			    against a 4s shot, so it deliberately runs past the end of this
			    composition and on into Shot 2. */}
			<Sequence from={VO_STARTS}>
				<Audio src={staticFile('vo/ep01-shot01.wav')} />
			</Sequence>
		</AbsoluteFill>
	);
};

import React from 'react';
import {AbsoluteFill, Audio, Easing, Sequence, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {CollageBackdrop} from '../../../components/CollageBackdrop';
import {PaperCutout} from '../../../components/PaperCutout';
import {SPEECH_FONT} from '../../../components/fonts';
import {useStopMotionStep} from '../../../components/useStopMotionStep';
import {shakeAt} from '../../montage/camera';
import {
	FARE_APPEARS,
	FLIP_FRAME,
	HAND_LEAVES,
	REACH_STARTS,
	REACH_STEP,
	SHOT_03_DURATION,
	VO_STARTS,
} from './beats';
import {PlaceholderDriverHand, PlaceholderLever, PlaceholderMeter} from './placeholders';

const CLAMP = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

/**
 * Shot 3 — the instant yes.
 *
 * Tighter than Shots 1 and 2: we are in at the dashboard now, close enough
 * that the meter is the subject. The hand comes in from the left, on the
 * driver's side of the geography the previous shots established.
 *
 * Nothing here is allowed to look deliberated. The reach is three stepped
 * poses and the lever goes over in two — no easing into contact, no
 * anticipation, no settle. It is done before the audience has finished
 * expecting an argument.
 */
export const Shot03InstantYes: React.FC = () => {
	const frame = useCurrentFrame();

	// --- The reach: stepped, and quick enough to feel unconsidered.
	const {stepIndex: reachStep} = useStopMotionStep(Math.max(0, frame - REACH_STARTS), REACH_STEP);
	const reachIn = interpolate(
		Math.min(reachStep * REACH_STEP, FLIP_FRAME - REACH_STARTS),
		[0, FLIP_FRAME - REACH_STARTS],
		[0, 1],
		CLAMP,
	);
	// After the flip the hand simply goes back the way it came.
	const withdraw = interpolate(frame, [HAND_LEAVES, HAND_LEAVES + 14], [0, 1], {
		...CLAMP,
		easing: Easing.in(Easing.quad),
	});
	const handX = interpolate(reachIn, [0, 1], [-780, 0]) - withdraw * 820;
	const handVisible = frame >= REACH_STARTS && withdraw < 1;

	// --- The lever: two positions, up then over. Never in between.
	const leverDown = frame >= FLIP_FRAME;
	const leverAngle = leverDown ? 78 : 0;
	// A tiny recoil on the housing as the lever hits its stop.
	const meterKnock = shakeAt(frame, FLIP_FRAME, 2.6);

	// --- The fare appears in one jump, not a count-up. A meter that rolls
	// up to a number implies elapsed time; this one was simply started.
	const fareVisible = frame >= FARE_APPEARS;

	// --- Barely any camera. The joke is that nothing dramatic happens.
	const push = interpolate(frame, [0, SHOT_03_DURATION], [1, 1.06], CLAMP);
	const jolt = shakeAt(frame, FLIP_FRAME, 3);

	return (
		<AbsoluteFill>
			<CollageBackdrop chaos={0.3} />

			<AbsoluteFill
				style={{transform: `translateY(${jolt}px) scale(${push})`, transformOrigin: '52% 46%'}}
			>
				{/* The auto itself, blown up so its bodywork fills the frame — we
				    are in close at the dashboard, not looking at a meter floating
				    on paper. Same cutout as the wider shots, so the yellow and the
				    canopy carry across the cut. */}
				<div
					style={{
						position: 'absolute',
						left: '50%',
						top: '50%',
						width: 4400,
						height: 3285,
						marginLeft: -2200,
						marginTop: -1642,
						transform: 'translate(880px, 300px)',
						zIndex: 10,
					}}
				>
					<PaperCutout asset="auto-driver-34" textureOpacity={0} elevation={0.5} />
				</div>

				{/* the meter housing */}
				<div
					style={{
						position: 'absolute',
						left: '50%',
						top: '50%',
						width: 720,
						height: 583,
						marginLeft: -360,
						marginTop: -291,
						transform: `translate(60px, -40px) rotate(${meterKnock}deg)`,
						transformOrigin: '50% 90%',
						filter: 'drop-shadow(0 6px 12px rgba(48,34,18,0.4))',
						zIndex: 20,
					}}
				>
					<PlaceholderMeter />

					{/* the fare, snapping straight to a base reading */}
					{fareVisible ? (
						<div
							style={{
								position: 'absolute',
								left: '26.5%',
								top: '33%',
								width: '47%',
								height: '28%',
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
								fontFamily: SPEECH_FONT,
								fontSize: 92,
								color: '#22201b',
								letterSpacing: 2,
							}}
						>
							30
						</div>
					) : null}

					{/* the flag lever, pivoting about its mount */}
					<div
						style={{
							position: 'absolute',
							left: '76%',
							top: '20%',
							width: 300,
							height: 75,
							transform: `rotate(${-42 + leverAngle}deg)`,
							transformOrigin: '5% 50%',
						}}
					>
						<PlaceholderLever />
					</div>
				</div>

				{/* the driver's hand, in from the left */}
				{handVisible ? (
					<div
						style={{
							position: 'absolute',
							left: '50%',
							top: '50%',
							width: 940,
							height: 455,
							marginLeft: -470,
							marginTop: -227,
							transform: `translate(${handX - 300}px, -150px)`,
							filter: 'drop-shadow(0 8px 16px rgba(48,34,18,0.4))',
							zIndex: 40,
						}}
					>
						<PlaceholderDriverHand />
					</div>
				) : null}
			</AbsoluteFill>

			<Sequence from={VO_STARTS}>
				<Audio src={staticFile('vo/ep01-shot03.wav')} />
			</Sequence>
		</AbsoluteFill>
	);
};

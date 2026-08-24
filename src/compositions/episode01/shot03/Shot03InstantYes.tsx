import React from 'react';
import {AbsoluteFill, Audio, Easing, Sequence, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {CollageBackdrop} from '../../../components/CollageBackdrop';
import {PaperCutout} from '../../../components/PaperCutout';
import {useStopMotionStep} from '../../../components/useStopMotionStep';
import {shakeAt} from '../../montage/camera';
import {
	FLIP_FRAME,
	HAND_LEAVES,
	REACH_STARTS,
	REACH_STEP,
	SHOT_03_DURATION,
	VO_STARTS,
} from './beats';

const CLAMP = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

/**
 * Where the lever sits inside the meter cutout, and where its pivot sits
 * inside the lever crop. Both are reported by scripts/split-meter.mjs when it
 * cuts the two layers, so if the source art is ever re-keyed these come
 * straight from its output rather than being re-guessed by eye.
 */
const LEVER_BOX = {left: '58.9%', top: '17.6%', width: '38.0%', height: '35.3%'};
const LEVER_PIVOT = '11.3% 93.2%';
/**
 * The arm is drawn pointing up-right at about 71° above horizontal. Swinging
 * it 95° clockwise brings it to roughly 24° BELOW horizontal — a flag that has
 * gone properly over its stop, not one merely nudged to level.
 */
const LEVER_THROW = 95;

/**
 * Shot 3 — the instant yes.
 *
 * Tighter than Shots 1 and 2: we are in at the dashboard now, close enough
 * that the meter is the subject. The hand comes in from the left, on the
 * driver's side of the geography the previous shots established.
 *
 * Nothing here is allowed to look deliberated. The reach is stepped and the
 * lever goes over in two positions — no easing into contact, no anticipation,
 * no settle. It is done before the audience has finished expecting an
 * argument, and the rest of the shot is the narrator catching up.
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
	const withdraw = interpolate(frame, [HAND_LEAVES, HAND_LEAVES + 16], [0, 1], {
		...CLAMP,
		easing: Easing.in(Easing.quad),
	});
	const handX = interpolate(reachIn, [0, 1], [1000, 0]) + withdraw * 1050;
	const handVisible = frame >= REACH_STARTS && withdraw < 1;

	// --- The lever: two positions, up then over. Never in between.
	const leverAngle = frame >= FLIP_FRAME ? LEVER_THROW : 0;
	// A small recoil on the housing as the flag hits its stop.
	const meterKnock = shakeAt(frame, FLIP_FRAME, 2.2);

	// --- Barely any camera. The joke is that nothing dramatic happens.
	const push = interpolate(frame, [0, SHOT_03_DURATION], [1, 1.07], CLAMP);
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

				{/* the meter, housing and lever as separate layers */}
				<div
					style={{
						position: 'absolute',
						left: '50%',
						top: '50%',
						width: 760,
						height: 1362,
						marginLeft: -380,
						marginTop: -681,
						transform: `translate(-120px, 40px) rotate(${meterKnock}deg)`,
						transformOrigin: '50% 85%',
						zIndex: 20,
					}}
				>
					<PaperCutout asset="auto-meter-body" textureOpacity={0} elevation={1.1} />

					<div
						style={{
							position: 'absolute',
							...LEVER_BOX,
							transform: `rotate(${leverAngle}deg)`,
							transformOrigin: LEVER_PIVOT,
						}}
					>
						<PaperCutout asset="auto-meter-lever" textureOpacity={0} elevation={1.2} />
					</div>
				</div>

				{/* The driver's hand, in from the RIGHT and mirrored. The flag sits
				    on the meter's right side, so a hand entering from the left has
				    to cross the whole housing to reach it and covers the readout on
				    the way — the one thing the shot exists to show. Coming from the
				    flag's own side reaches it directly, and matches where a driver
				    actually sits relative to the meter. */}
				{handVisible ? (
					<div
						style={{
							position: 'absolute',
							left: '50%',
							top: '50%',
							width: 1320,
							height: 986,
							marginLeft: -660,
							marginTop: -493,
								transform: `translate(${handX + 560}px, -280px) scaleX(-1)`,
								zIndex: 40,
						}}
					>
						<PaperCutout asset="driver-hand-reach" textureOpacity={0} elevation={1.5} />
					</div>
				) : null}
			</AbsoluteFill>

			{/* The click lands exactly on contact — synthesised rather than
			    recorded, see scripts/sfx.py. */}
			<Sequence from={FLIP_FRAME}>
				<Audio src={staticFile('sfx/meter-click.wav')} volume={0.85} />
			</Sequence>

			<Sequence from={VO_STARTS}>
				<Audio src={staticFile('vo/ep01-shot03.wav')} />
			</Sequence>
		</AbsoluteFill>
	);
};

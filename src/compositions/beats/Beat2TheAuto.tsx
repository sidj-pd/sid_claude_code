import React from 'react';
import {AbsoluteFill, Easing, interpolate, useCurrentFrame} from 'remotion';
import {PageFlipTransition} from '../../components/PageFlipTransition';
import {PaperCutout} from '../../components/PaperCutout';
import {useStopMotionStep} from '../../components/useStopMotionStep';

const DURATION = 60;
const FLIP_DURATION = 6;
const STEP_SIZE = 8;
const ENTRY_STEPS = 4;
const ENTRY_FRAMES = STEP_SIZE * ENTRY_STEPS; // 32 — hop in from the left
const RIDE_START = 40; // brief idle beat after the hop lands, then...
const RIDE_END = 54; // ...revs up and rides off to the right

const START_X = -420;
const REST_X = 0;
const RIDE_X = 620;

const PUFF_SPAWNS = [40, 46, 51];
const PUFF_LIFE = 16;

// useStopMotionStep does no hooks of its own (pure quantization), so it's
// safe to call from a plain helper — used here to sample the auto's x
// position at arbitrary frames (e.g. a puff's spawn time in the past).
const autoX = (f: number): number => {
	if (f < ENTRY_FRAMES) {
		const entryFrame = Math.min(f, ENTRY_FRAMES - 1);
		const {stepIndex} = useStopMotionStep(entryFrame, STEP_SIZE);
		return interpolate(stepIndex, [0, ENTRY_STEPS - 1], [START_X, REST_X], {
			extrapolateLeft: 'clamp',
			extrapolateRight: 'clamp',
		});
	}
	if (f < RIDE_START) {
		return REST_X;
	}
	return interpolate(f, [RIDE_START, RIDE_END], [REST_X, RIDE_X], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
		easing: Easing.in(Easing.quad),
	});
};

/**
 * Beat 2 — The Auto, frames 60-120. Hops in from the left in stop-motion
 * steps, idles a beat, then revs up and rides off to the right, leaving a
 * trail of fading exhaust puffs behind it.
 */
export const Beat2TheAuto: React.FC = () => {
	const frame = useCurrentFrame();
	const x = autoX(frame);

	return (
		<PageFlipTransition totalDurationInFrames={DURATION} durationInFrames={FLIP_DURATION}>
			<AbsoluteFill style={{backgroundColor: '#f6f1e6', justifyContent: 'center', alignItems: 'center'}}>
				<div style={{width: 520, height: 390, transform: `translateX(${x}px)`}}>
					<PaperCutout asset="auto-rickshaw" jitter={{stepSize: STEP_SIZE}} textureOpacity={0} />
				</div>
				{PUFF_SPAWNS.map((spawn, i) => {
					const age = frame - spawn;
					if (age < 0 || age > PUFF_LIFE) {
						return null;
					}
					const puffX = autoX(spawn) - 110;
					const opacity = interpolate(age, [0, PUFF_LIFE], [0.75, 0], {
						extrapolateLeft: 'clamp',
						extrapolateRight: 'clamp',
					});
					const scale = interpolate(age, [0, PUFF_LIFE], [0.6, 1.5], {
						extrapolateLeft: 'clamp',
						extrapolateRight: 'clamp',
					});
					const drift = interpolate(age, [0, PUFF_LIFE], [0, -35], {
						extrapolateLeft: 'clamp',
						extrapolateRight: 'clamp',
					});
					return (
						<div
							key={spawn}
							style={{
								position: 'absolute',
								left: '50%',
								top: '50%',
								width: 130,
								height: 130,
								transform: `translate(calc(-50% + ${puffX}px), calc(-50% + ${drift}px)) scale(${scale})`,
								opacity,
							}}
						>
							<PaperCutout
								asset="exhaust-puff"
								textureOpacity={0}
								style={{
									maskImage: 'radial-gradient(circle, black 42%, transparent 70%)',
									WebkitMaskImage: 'radial-gradient(circle, black 42%, transparent 70%)',
								}}
							/>
						</div>
					);
				})}
			</AbsoluteFill>
		</PageFlipTransition>
	);
};

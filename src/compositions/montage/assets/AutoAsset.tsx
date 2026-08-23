import React from 'react';
import {Easing, interpolate, useCurrentFrame} from 'remotion';
import {PaperCutout} from '../../../components/PaperCutout';
import {useStopMotionStep} from '../../../components/useStopMotionStep';
import {Transform, elevationFromScale, transformToCss, useLifecycleTransform} from '../lifecycle';
import {AUTO_ENTRANCE_START, lifecycleFor} from '../timeline';

const STEP_SIZE = 8;
const ENTRY_STEPS = 4;
const ENTRY_DURATION = STEP_SIZE * ENTRY_STEPS; // 32 — hop in from the left
const RIDE_DURATION = 14; // then revs up and rides across, leaving smoke
const RECEDE_DURATION = 14;
const HERO_HOLD_END = AUTO_ENTRANCE_START + ENTRY_DURATION + RIDE_DURATION; // 106
const CONFIG = lifecycleFor('auto-rickshaw', HERO_HOLD_END, RECEDE_DURATION, 1);
const BOX = {width: 520, height: 390};

const START_X = -420;
const STAGE_X = 0;
const RIDE_X = 320;
const STAGE_Y = 150;

const PUFF_OFFSETS = [0, 6, 11]; // frames after ride starts

// useStopMotionStep does no hooks of its own, so it's safe to sample it at
// arbitrary frames (e.g. a puff's spawn time in the past).
const autoLocalX = (localFrame: number): number => {
	if (localFrame < ENTRY_DURATION) {
		const entryFrame = Math.min(localFrame, ENTRY_DURATION - 1);
		const {stepIndex} = useStopMotionStep(entryFrame, STEP_SIZE);
		return interpolate(stepIndex, [0, ENTRY_STEPS - 1], [START_X, STAGE_X], {
			extrapolateLeft: 'clamp',
			extrapolateRight: 'clamp',
		});
	}
	return interpolate(localFrame, [ENTRY_DURATION, ENTRY_DURATION + RIDE_DURATION], [STAGE_X, RIDE_X], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
		easing: Easing.in(Easing.quad),
	});
};

/**
 * The auto — hops in from off-screen left in stop-motion steps while
 * Vidhana Soudha is still settling into the background, then revs up and
 * rides across the stage leaving a trail of fading exhaust puffs before
 * hopping up into its own skyline slot.
 */
export const AutoAsset: React.FC = () => {
	const frame = useCurrentFrame();
	if (frame < AUTO_ENTRANCE_START) {
		return null;
	}
	const localFrame = frame - AUTO_ENTRANCE_START;

	const {stepIndex} = useStopMotionStep(Math.max(0, localFrame), STEP_SIZE);
	const jitter = localFrame >= 0 && localFrame < HERO_HOLD_END - AUTO_ENTRANCE_START ? (stepIndex % 2 === 0 ? -1.5 : 1.5) : 0;

	const heroTransform: Transform = {
		x: autoLocalX(Math.max(0, localFrame)),
		y: STAGE_Y,
		scale: 1,
		rotate: jitter,
		opacity: interpolate(localFrame, [0, 4], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}),
	};

	const transform = useLifecycleTransform(frame, heroTransform, CONFIG);
	const isActive = frame < HERO_HOLD_END + RECEDE_DURATION;

	return (
		<>
			<div
				style={{
					...transformToCss(transform),
					zIndex: isActive ? 51 : frame < 322 ? 11 : 21,
				}}
			>
				<div style={BOX}>
					<PaperCutout asset="auto-rickshaw" textureOpacity={0} elevation={elevationFromScale(transform.scale)} />
				</div>
			</div>
			{localFrame >= ENTRY_DURATION &&
				PUFF_OFFSETS.map((offset) => {
					const spawn = ENTRY_DURATION + offset;
					const age = localFrame - spawn;
					if (age < 0 || age > 16) {
						return null;
					}
					const puffLocalX = autoLocalX(spawn) - 110;
					const opacity = interpolate(age, [0, 16], [0.75, 0], {
						extrapolateLeft: 'clamp',
						extrapolateRight: 'clamp',
					});
					const scale = interpolate(age, [0, 16], [0.5, 1.3], {
						extrapolateLeft: 'clamp',
						extrapolateRight: 'clamp',
					});
					const drift = interpolate(age, [0, 16], [0, -35], {
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
								transform: `translate(calc(-50% + ${puffLocalX}px), calc(-50% + ${STAGE_Y + drift}px)) scale(${scale})`,
								opacity,
								zIndex: 51,
							}}
						>
							<PaperCutout
								asset="exhaust-puff"
								textureOpacity={0}
								elevation={0.6}
								style={{
									maskImage: 'radial-gradient(circle, black 42%, transparent 70%)',
									WebkitMaskImage: 'radial-gradient(circle, black 42%, transparent 70%)',
								}}
							/>
						</div>
					);
				})}
		</>
	);
};

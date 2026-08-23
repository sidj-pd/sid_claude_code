import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {PageFlipTransition} from '../../components/PageFlipTransition';
import {PaperCutout} from '../../components/PaperCutout';
import {useStopMotionStep} from '../../components/useStopMotionStep';

const DURATION = 60;
const FLIP_DURATION = 6;
const STEP_SIZE = 8;
const ENTRY_STEPS = 4;
const ENTRY_FRAMES = STEP_SIZE * ENTRY_STEPS; // 32

const START_X = -420;
const REST_X = 0;

/** Beat 2 — The Auto: stop-motion hop entry from left, frames 60-120. */
export const Beat2TheAuto: React.FC = () => {
	const frame = useCurrentFrame();
	const entryFrame = Math.min(frame, ENTRY_FRAMES - 1);
	const {stepIndex} = useStopMotionStep(entryFrame, STEP_SIZE);

	const x = interpolate(stepIndex, [0, ENTRY_STEPS - 1], [START_X, REST_X], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});

	// exhaust puff kicks in only during hop step 2 (index 1), quick fade
	const inStepTwo = frame >= STEP_SIZE * 1 && frame < STEP_SIZE * 2 && frame < ENTRY_FRAMES;
	const stepLocalFrame = frame - STEP_SIZE * 1;
	const puffOpacity = inStepTwo
		? interpolate(stepLocalFrame, [0, STEP_SIZE], [0.8, 0], {
				extrapolateLeft: 'clamp',
				extrapolateRight: 'clamp',
			})
		: 0;

	return (
		<PageFlipTransition totalDurationInFrames={DURATION} durationInFrames={FLIP_DURATION}>
			<AbsoluteFill style={{backgroundColor: '#f6f1e6', justifyContent: 'center', alignItems: 'center'}}>
				<div style={{position: 'relative', width: 520, height: 390, transform: `translateX(${x}px)`}}>
					<PaperCutout asset="auto-rickshaw" jitter={{stepSize: STEP_SIZE}} textureOpacity={0} />
					<div
						style={{
							position: 'absolute',
							left: -80,
							bottom: 50,
							width: 130,
							height: 130,
							opacity: puffOpacity,
						}}
					>
						<PaperCutout asset="exhaust-puff" textureOpacity={0} />
					</div>
				</div>
			</AbsoluteFill>
		</PageFlipTransition>
	);
};

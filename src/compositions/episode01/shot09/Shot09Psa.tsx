import React from 'react';
import {AbsoluteFill, Audio, Freeze, Sequence, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {Footage} from '../../../components/Footage';
import {PaperTear} from '../../../components/PaperTear';
import {useStopMotionStep} from '../../../components/useStopMotionStep';
import {NewsPage} from '../shot08/Shot08Fallout';
import {SHOT_08_DURATION} from '../shot08/beats';
import {PSA_FRAMES, TEAR_DONE, TEAR_FRAMES, TEAR_STARTS} from './beats';

const CLAMP = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

const PSA_DESCRIPTION =
	'Correspondent on a video call, delivering a PSA sign-off.\nVertical, photoreal, with its own dialogue.';

/**
 * Shot 9 — Correspondent PSA.
 *
 * The tear opens on exactly where Shot 8 left off — both headlines, still
 * sitting on the same page — rather than a blank sheet, so the paper world
 * reads as one continuous place the episode keeps cutting back to rather
 * than a fresh graphic invented per shot.
 *
 * Nothing else happens here. No caption, no checklist, no cutaway: after two
 * shots of evidence being assembled around him, the joke is that the
 * correspondent's own contribution is delivered with the same total
 * sincerity as everyone else's, uninterrupted, straight to camera.
 */
export const Shot09Psa: React.FC = () => {
	const frame = useCurrentFrame();

	const tear = interpolate(frame, [TEAR_STARTS, TEAR_STARTS + TEAR_FRAMES], [0, 1], CLAMP);
	const {stepIndex: tearStep} = useStopMotionStep(Math.max(0, frame - TEAR_STARTS), 2);
	const tearProgress = interpolate(
		Math.min(tearStep * 2, TEAR_FRAMES),
		[0, TEAR_FRAMES],
		[0, 1],
		CLAMP,
	);

	return (
		<AbsoluteFill style={{backgroundColor: '#0c0e11'}}>
			<Sequence from={0} durationInFrames={TEAR_DONE}>
				<Freeze frame={0}>
					<Footage id="ep01-correspondent-psa" description={PSA_DESCRIPTION} muted />
				</Freeze>
			</Sequence>
			<Sequence from={TEAR_DONE} durationInFrames={PSA_FRAMES}>
				<Footage id="ep01-correspondent-psa" description={PSA_DESCRIPTION} />
			</Sequence>

			{tear < 1 ? (
				<PaperTear progress={tearProgress} at={52} lean={18} seed={31}>
					<NewsPage frame={SHOT_08_DURATION - 1} />
				</PaperTear>
			) : null}

			<Sequence from={TEAR_STARTS}>
				<Audio src={staticFile('sfx/paper-rip.wav')} volume={0.95} />
			</Sequence>
		</AbsoluteFill>
	);
};

import React from 'react';
import {AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame} from 'remotion';
import {CollageBackdrop} from '../../../components/CollageBackdrop';
import {StampImpact} from '../../../components/StampImpact';
import {useStopMotionStep} from '../../../components/useStopMotionStep';
import {DeskWide} from '../DeskWide';
import {LaptopMessage, sendChitBox} from '../LaptopMessage';
import {BREATH_STEP} from '../shot01/beats';
import {
	CLOCK_START_TICK,
	CUT_TO_WIDE,
	PING,
	REPLY_IN,
	SMILE_IN,
	VO_TRIM_BEFORE,
} from './beats';

const CUTOUT_W = 1500;

export const Shot02InstantReply: React.FC = () => {
	const frame = useCurrentFrame();
	const onScreen = frame < CUT_TO_WIDE;

	const {stepIndex: breath} = useStopMotionStep(frame, BREATH_STEP);
	const breathRot = breath % 3 === 0 ? -0.18 : 0.14;

	const screen = sendChitBox(CUTOUT_W);

	return (
		<AbsoluteFill>
			<CollageBackdrop chaos={0.52} />

			{onScreen ? (
				<AbsoluteFill>
					<LaptopMessage cutoutW={CUTOUT_W} rotationDeg={breathRot}>
						{/* The manager's reply, as a chit landing on the record — the
						    same object the notification language established, not
						    software chrome. It is written text rather than speech, so
						    it takes the typewriter face and not the bubble face: a
						    message is a document.

						    "Don't check Teams" is the payoff for him volunteering to
						    watch Teams in Shot 1, which is why that clause is in the
						    email at all. */}
						{frame >= REPLY_IN ? (
							<StampImpact triggerFrame={REPLY_IN} rotationDeg={1.6}>
								<div
									style={{
										position: 'absolute',
										left: screen.screenX + screen.screenW * 0.05,
										top: screen.screenY + screen.screenH * 0.52,
										width: screen.screenW * 0.9,
										background: '#e4d9bd',
										border: '3px solid #1b1e24',
										padding: screen.screenH * 0.05,
										boxSizing: 'border-box',
										fontFamily: 'RansomSpecialElite, monospace',
										fontSize: screen.screenH * 0.078,
										lineHeight: 1.35,
										color: '#1b1e24',
										boxShadow: '0 10px 20px rgba(30,24,14,0.4)',
									}}
								>
									Approved. Don&apos;t check Teams while you&apos;re gone.
								</div>
							</StampImpact>
						) : null}
					</LaptopMessage>
				</AbsoluteFill>
			) : (
				// Back to the room for the punchline, and he holds still through it —
				// the smile comes after the line, not under it.
				<DeskWide startTick={CLOCK_START_TICK} happy={frame >= SMILE_IN} />
			)}

			<Audio src={staticFile('sfx/room-hum.wav')} volume={0.16} />

			<Sequence from={PING}>
				<Audio src={staticFile('sfx/notification-ping.wav')} volume={0.8} />
			</Sequence>

			{/* Sentence two. Shot 1 carried sentence one; the cut between them sits
			    inside the 1.22s gap the envelope found, so neither end clips. */}
			<Audio src={staticFile('vo/ep02-shot02.wav')} trimBefore={VO_TRIM_BEFORE} />
		</AbsoluteFill>
	);
};

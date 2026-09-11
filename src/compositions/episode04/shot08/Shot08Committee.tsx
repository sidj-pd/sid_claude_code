import React from 'react';
import {AbsoluteFill, Audio, Freeze, Sequence, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {Footage} from '../../../components/Footage';
import {NewsHeadline} from '../../../components/NewsHeadline';
import {PaperTear} from '../../../components/PaperTear';
import {useStopMotionStep} from '../../../components/useStopMotionStep';
import {VoiceOver} from '../../../components/VoiceOver';
import {GANACHE_DEEP} from '../../../components/palette';
import {Ground} from '../Ground';
import {BLOCK, HEADLINE_LAND, REV_DONE, REV_FRAMES, REV_STARTS, VO_STARTS} from './beats';

const CLAMP = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

export const Shot08Committee: React.FC = () => {
	const frame = useCurrentFrame();

	const {stepIndex: tearStep} = useStopMotionStep(Math.max(0, frame - REV_STARTS), 2);
	const opening = interpolate(Math.min(tearStep * 2, REV_FRAMES), [0, REV_FRAMES], [0, 1], CLAMP);
	const progress = frame < REV_STARTS ? 1 : frame < REV_DONE ? 1 - opening : 0;

	return (
		<AbsoluteFill style={{backgroundColor: GANACHE_DEEP}}>
			{/* The sign-off, held, until the paper closes over it. */}
			<Sequence from={0} durationInFrames={REV_STARTS + REV_FRAMES}>
				<Freeze frame={0}>
					<Footage
						id="ep04-correspondent-psa"
						description={'The sign-off, on a video call.\nVertical, photoreal, with its own dialogue.'}
						muted
						cropBottom={1.2}
					/>
				</Freeze>
			</Sequence>

			<PaperTear progress={progress} at={38} lean={24} seed={53}>
				<AbsoluteFill>
					<Ground grain={0.16} />
					<div style={{position: 'absolute', left: BLOCK.left, top: BLOCK.top}}>
						<NewsHeadline
							headline={'RBI FORMS COMMITTEE\nTO STUDY\nK.Y.C. SYNDROME'}
							quote="MEETING RESCHEDULED — COMMITTEE MEMBERS WERE AT LUNCH"
							quoted={false}
							clipping="newspaper-clip-rbicommittee"
							age={frame - HEADLINE_LAND}
							width={BLOCK.width}
							clipHeight={BLOCK.clipHeight}
							rotate={BLOCK.rotate}
						/>
					</div>
				</AbsoluteFill>
			</PaperTear>

			<Sequence from={REV_STARTS}>
				<Audio src={staticFile('sfx/paper-rip.wav')} volume={0.85} />
			</Sequence>
			<Sequence from={HEADLINE_LAND}>
				<Audio src={staticFile('sfx/stamp-thud.wav')} volume={0.7} />
			</Sequence>
			<Sequence from={HEADLINE_LAND + 3}>
				<Audio src={staticFile('sfx/paper-riffle.wav')} volume={0.42} />
			</Sequence>

			<VoiceOver id="ep04-shot08-committee-cut" from={VO_STARTS} />
		</AbsoluteFill>
	);
};

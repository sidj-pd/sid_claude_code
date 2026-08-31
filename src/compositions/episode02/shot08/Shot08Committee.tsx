import React from 'react';
import {
	AbsoluteFill,
	Audio,
	Freeze,
	Sequence,
	interpolate,
	staticFile,
	useCurrentFrame,
} from 'remotion';
import {CollageBackdrop} from '../../../components/CollageBackdrop';
import {Footage} from '../../../components/Footage';
import {NewsHeadline} from '../../../components/NewsHeadline';
import {PaperTear} from '../../../components/PaperTear';
import {useStopMotionStep} from '../../../components/useStopMotionStep';
import {VoiceOver} from '../../../components/VoiceOver';
import {HEADLINE_LAND, REV_DONE, REV_FRAMES, REV_STARTS, VO_STARTS} from './beats';

const CLAMP = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

/**
 * Shot 8 — The Committee.
 *
 * The last laugh of the fallout, and it works by being brief: the institution's
 * response to a manager behaving decently is to form a committee, and the
 * committee cannot meet because of a rangoli competition. Neither the narration
 * nor the picture comments on that. Stating it and leaving is the joke.
 *
 * The quote line is set unquoted, because it is a status being reported rather
 * than anyone's words — the same call Episode 01 made for COMMITTEE YET TO MEET.
 */
export const Shot08Committee: React.FC = () => {
	const frame = useCurrentFrame();

	const {stepIndex: tearStep} = useStopMotionStep(Math.max(0, frame - REV_STARTS), 2);
	const opening = interpolate(Math.min(tearStep * 2, REV_FRAMES), [0, REV_FRAMES], [0, 1], CLAMP);
	const progress = frame < REV_STARTS ? 1 : frame < REV_DONE ? 1 - opening : 0;

	return (
		<AbsoluteFill style={{backgroundColor: '#0c0e11'}}>
			{/* The sign-off, held, until the paper closes over it. */}
			<Sequence from={0} durationInFrames={REV_STARTS + REV_FRAMES}>
				<Freeze frame={0}>
					<Footage
						id="ep02-correspondent-psa"
						description={'The sign-off, on a video call.\nVertical, photoreal, with its own dialogue.'}
						muted
					/>
				</Freeze>
			</Sequence>

			<PaperTear progress={progress} at={38} lean={24} seed={53}>
				<AbsoluteFill>
					<CollageBackdrop chaos={0.16} />
					{/* Sits at 520 rather than Episode 01's 560 so the clipping's foot
					    clears y 1536 and the platform chrome (§15). */}
					<div style={{position: 'absolute', left: 130, top: 520}}>
						<NewsHeadline
							headline={'HR FORMS COMMITTEE\nTO STUDY\nS.T.F.U. SYNDROME'}
							quote="MEETING RESCHEDULED DUE TO OFFICE RANGOLI COMPETITION"
							quoted={false}
							clipping="newspaper-clip-hrcommittee"
							age={frame - HEADLINE_LAND}
							width={780}
							clipHeight={500}
							rotate={-1}
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
			{/* The quick rustle the script asks for, under the headline. */}
			<Sequence from={HEADLINE_LAND + 3}>
				<Audio src={staticFile('sfx/paper-riffle.wav')} volume={0.42} />
			</Sequence>

			<VoiceOver id="ep02-shot08-committee" from={VO_STARTS} />
		</AbsoluteFill>
	);
};

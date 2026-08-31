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
import {Chyron} from '../../../components/Chyron';
import {CollageBackdrop} from '../../../components/CollageBackdrop';
import {Footage} from '../../../components/Footage';
import {NewsHeadline} from '../../../components/NewsHeadline';
import {PaperTear} from '../../../components/PaperTear';
import {SAFE_BOTTOM_Y} from '../../../components/safeArea';
import {useStopMotionStep} from '../../../components/useStopMotionStep';
import {VoiceOver} from '../../../components/VoiceOver';
import {A4_FRAMES, A4_SRC_IN} from '../shot05/beats';
import {
	FWD_TEAR_DONE,
	FWD_TEAR_FRAMES,
	FWD_TEAR_STARTS,
	HEADLINE1_LAND,
	HEADLINE2_STAMP,
	MANAGER_CHYRON_IN,
	MANAGER_FRAMES,
	MANAGER_SRC_IN,
	REV1_DONE,
	REV1_FRAMES,
	REV1_STARTS,
	REV2_DONE,
	REV2_FRAMES,
	REV2_STARTS,
	VO_ASSOC_STARTS,
} from './beats';

const CLAMP = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

const MANAGER_DESCRIPTION =
	'The manager on a video call from home, aggrieved.\nVertical, photoreal, with its own dialogue.';
const EXPERT_DESCRIPTION =
	'Dr. Ramamurthy at his office desk.\nVertical, photoreal, with its own dialogue.';

/**
 * The tear's opening progress (0 = closed/paper, 1 = open/torn-apart),
 * quantised to a stepped grid so it hops apart in bites like every other piece
 * of paper in the series rather than gliding.
 */
const stepOpen = (framesSinceStart: number, totalFrames: number): number => {
	const {stepIndex} = useStopMotionStep(Math.max(0, framesSinceStart), 2);
	return interpolate(Math.min(stepIndex * 2, totalFrames), [0, totalFrames], [0, 1], CLAMP);
};

/**
 * The page itself: one persistent sheet carrying both headlines, mounted for the
 * whole shot and torn open and closed twice around it — so headline one is still
 * sitting there, untouched, when headline two lands.
 *
 * Laid out tighter than Episode 01's equivalent. That one puts its second
 * headline at y 1010 with a 480px clipping, which runs past y 1536 and under the
 * platform chrome (§15). Both headlines here finish by 1390.
 */
export const NewsPage: React.FC<{frame: number}> = ({frame}) => (
	<AbsoluteFill>
		<CollageBackdrop chaos={0.16} />
		<div style={{position: 'absolute', left: 104, top: 110}}>
			<NewsHeadline
				headline={"MANAGERS' ASSOCIATION\nWRITES TO HR"}
				quote="COMPENSATE THOSE SUFFERING FROM S.T.F.U. SYNDROME"
				clipping="newspaper-clip-managers"
				age={frame - HEADLINE1_LAND}
				width={800}
				clipHeight={370}
				rotate={-1.5}
			/>
		</div>
		<div style={{position: 'absolute', left: 168, top: 852}}>
			<NewsHeadline
				headline={'MANAGER FILES\nOWN CLAIM'}
				quote="I DON'T EVEN KNOW WHO I AM ANYMORE"
				clipping="newspaper-clip-ownclaim"
				age={frame - HEADLINE2_STAMP}
				width={600}
				clipHeight={320}
				rotate={2}
			/>
		</div>
	</AbsoluteFill>
);

/**
 * Shot 6 — Institutional Fallout.
 *
 * Every change of world is a tear, twice, around one piece of video. The
 * manager is on camera for the first and only time, and he believes he is the
 * injured party — which is why his own words become a headline without anyone
 * needing to comment on them.
 */
export const Shot06Fallout: React.FC = () => {
	const frame = useCurrentFrame();

	let progress: number;
	if (frame < REV1_STARTS) {
		progress = 1;
	} else if (frame < REV1_DONE) {
		progress = 1 - stepOpen(frame - REV1_STARTS, REV1_FRAMES);
	} else if (frame < FWD_TEAR_STARTS) {
		progress = 0;
	} else if (frame < FWD_TEAR_DONE) {
		progress = stepOpen(frame - FWD_TEAR_STARTS, FWD_TEAR_FRAMES);
	} else if (frame < REV2_STARTS) {
		progress = 1;
	} else if (frame < REV2_DONE) {
		progress = 1 - stepOpen(frame - REV2_STARTS, REV2_FRAMES);
	} else {
		progress = 0;
	}

	const managerLiveFrom = FWD_TEAR_DONE;
	const managerLiveTo = FWD_TEAR_DONE + MANAGER_FRAMES;

	return (
		<AbsoluteFill style={{backgroundColor: '#0c0e11'}}>
			{/* Underneath the paper: Shot 5's ending, held, until the forward tear
			    opens onto the manager instead. */}
			<Sequence from={0} durationInFrames={FWD_TEAR_STARTS}>
				<Freeze frame={A4_FRAMES + A4_SRC_IN - 6}>
					<Footage id="ep02-expert-4" description={EXPERT_DESCRIPTION} muted />
				</Freeze>
			</Sequence>

			{/* Held on his first frame while the paper is still coming off him. */}
			<Sequence
				from={FWD_TEAR_STARTS}
				durationInFrames={managerLiveFrom - FWD_TEAR_STARTS}
			>
				<Freeze frame={MANAGER_SRC_IN}>
					<Footage id="ep02-manager-1" description={MANAGER_DESCRIPTION} muted />
				</Freeze>
			</Sequence>
			<Sequence from={managerLiveFrom} durationInFrames={MANAGER_FRAMES}>
				<Footage
					id="ep02-manager-1"
					description={MANAGER_DESCRIPTION}
					trimBeforeInFrames={MANAGER_SRC_IN}
				/>
			</Sequence>
			{/* Held again while the paper closes back over him. */}
			<Sequence from={managerLiveTo} durationInFrames={REV2_DONE - managerLiveTo}>
				<Freeze frame={MANAGER_SRC_IN + MANAGER_FRAMES - 6}>
					<Footage id="ep02-manager-1" description={MANAGER_DESCRIPTION} muted />
				</Freeze>
			</Sequence>

			{/* His caption, up only while he is actually on screen. Kept clear of
			    the platform chrome, unlike Episode 01's. */}
			<Chyron
				name="WITNESS — MANAGER, NAME WITHHELD"
				title="NOW SEEKING COMPENSATION"
				frame={frame}
				in={MANAGER_CHYRON_IN}
				out={REV2_STARTS}
				top={SAFE_BOTTOM_Y - 196}
				seed={91}
			/>

			{/* The page, torn open and closed around the video by the same PaperTear
			    every other reality crossing in the series uses. */}
			<PaperTear progress={progress} at={44} lean={-20} seed={17}>
				<NewsPage frame={frame} />
			</PaperTear>

			<VoiceOver id="ep02-shot06-assoc" from={VO_ASSOC_STARTS} />

			{/* Every crossing gets the rip. */}
			<Sequence from={REV1_STARTS}>
				<Audio src={staticFile('sfx/paper-rip.wav')} volume={0.9} />
			</Sequence>
			<Sequence from={FWD_TEAR_STARTS}>
				<Audio src={staticFile('sfx/paper-rip.wav')} volume={0.95} />
			</Sequence>
			<Sequence from={REV2_STARTS}>
				<Audio src={staticFile('sfx/paper-rip.wav')} volume={0.9} />
			</Sequence>

			{/* Each headline gets its own thud, and the newsprint rustle the script
			    asks for rides under the first one. */}
			<Sequence from={HEADLINE1_LAND}>
				<Audio src={staticFile('sfx/stamp-thud.wav')} volume={0.7} />
			</Sequence>
			<Sequence from={HEADLINE1_LAND + 4}>
				<Audio src={staticFile('sfx/paper-riffle.wav')} volume={0.4} />
			</Sequence>
			<Sequence from={HEADLINE2_STAMP}>
				<Audio src={staticFile('sfx/stamp-thud.wav')} volume={0.7} />
			</Sequence>
		</AbsoluteFill>
	);
};

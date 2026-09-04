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
import {A6_FRAMES} from '../shot05/beats';
import {
	BLOCK1,
	BLOCK2,
	FWD_TEAR_DONE,
	FWD_TEAR_FRAMES,
	FWD_TEAR_STARTS,
	HEADLINE1_LAND,
	HEADLINE2_STAMP,
	REV1_DONE,
	REV1_FRAMES,
	REV1_STARTS,
	REV2_DONE,
	REV2_FRAMES,
	REV2_STARTS,
	VO_ASSOC_STARTS,
	W4_FRAMES,
	W4_SRC_IN,
	W5_FRAMES,
	W5_IN,
	W5_SRC_IN,
	WITNESS_CHYRON_IN,
} from './beats';

const CLAMP = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

const WITNESS_4_DESCRIPTION =
	'The tenant on a video call, more shaken — the outburst.\n"He gets compensation for being nice?… Rehearsed. Ready."\nVertical, photoreal, with its own dialogue.';
const WITNESS_5_DESCRIPTION =
	'Same tenant, same setup — the question.\n"I never got to use it. Do you know what that does to a person?"\nVertical, photoreal, with its own dialogue.';
const EXPERT_DESCRIPTION =
	'The expert at his office desk.\nVertical, photoreal, with its own dialogue.';

/**
 * The tear's opening progress (0 = closed/paper, 1 = torn apart and clear),
 * quantised to a stepped grid so it comes apart in bites like every other
 * piece of paper in the series rather than gliding.
 */
const stepOpen = (framesSinceStart: number, totalFrames: number): number => {
	const {stepIndex} = useStopMotionStep(Math.max(0, framesSinceStart), 2);
	return interpolate(Math.min(stepIndex * 2, totalFrames), [0, totalFrames], [0, 1], CLAMP);
};

/**
 * The page: one persistent sheet carrying both headlines, mounted for the
 * whole shot and torn open and closed around the video — so headline one is
 * still sitting there, untouched, when headline two lands beneath it.
 *
 * Geometry comes from beats.ts, where it is derived rather than chosen: the
 * one thing this page must not do is put a headline on top of a photograph.
 */
export const NewsPage: React.FC<{frame: number}> = ({frame}) => (
	<AbsoluteFill>
		<CollageBackdrop chaos={0.16} />
		<div style={{position: 'absolute', left: BLOCK1.left, top: BLOCK1.top}}>
			<NewsHeadline
				headline={"LANDLORDS' ASSOCIATION\nWRITES TO GOVERNMENT"}
				quote="COMPENSATE THOSE SUFFERING FROM F.A.Q. SYNDROME"
				clipping="newspaper-clip-landlords"
				age={frame - HEADLINE1_LAND}
				width={BLOCK1.width}
				clipHeight={BLOCK1.clipHeight}
				rotate={BLOCK1.rotate}
			/>
		</div>
		<div style={{position: 'absolute', left: BLOCK2.left, top: BLOCK2.top}}>
			<NewsHeadline
				headline={'VICTIM FILES\nOWN CLAIM'}
				quote="I NEVER GOT TO USE MY SPEECH"
				clipping="newspaper-clip-tenantclaim"
				age={frame - HEADLINE2_STAMP}
				width={BLOCK2.width}
				clipHeight={BLOCK2.clipHeight}
				rotate={BLOCK2.rotate}
			/>
		</div>
	</AbsoluteFill>
);

/**
 * Shot 6 — Institutional Fallout.
 *
 * The association petitions a ministry for compensation on behalf of people
 * who were treated well, and the man who was treated well files his own
 * claim for having rehearsed a speech he never got to give. Neither headline
 * comments on the other; the page just prints both.
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

	return (
		<AbsoluteFill style={{backgroundColor: '#0c0e11'}}>
			{/* Underneath the paper at the top: Shot 5's last frame, held, while
			    the page closes back over it. Shot 5's punch-in has already zoomed
			    out by then, so this is continuous with what was just on screen. */}
			<Sequence from={0} durationInFrames={FWD_TEAR_STARTS}>
				<Freeze frame={A6_FRAMES - 6}>
					<Footage id="ep03-expert-6" description={EXPERT_DESCRIPTION} muted />
				</Freeze>
			</Sequence>

			{/* Held on his first frame while the paper is still coming off him. */}
			<Sequence from={FWD_TEAR_STARTS} durationInFrames={FWD_TEAR_DONE - FWD_TEAR_STARTS}>
				<Freeze frame={W4_SRC_IN}>
					<Footage id="ep03-witness-4" description={WITNESS_4_DESCRIPTION} muted />
				</Freeze>
			</Sequence>
			<Sequence from={FWD_TEAR_DONE} durationInFrames={W4_FRAMES}>
				<Footage
					id="ep03-witness-4"
					description={WITNESS_4_DESCRIPTION}
					trimBeforeInFrames={W4_SRC_IN}
				/>
			</Sequence>
			{/* A hard jump cut to the second take, the grammar this episode's
			    testimony already uses. */}
			<Sequence from={W5_IN} durationInFrames={W5_FRAMES}>
				<Footage
					id="ep03-witness-5"
					description={WITNESS_5_DESCRIPTION}
					trimBeforeInFrames={W5_SRC_IN}
				/>
			</Sequence>
			{/* Held again while the paper closes back over him. */}
			<Sequence from={W5_IN + W5_FRAMES} durationInFrames={REV2_DONE - (W5_IN + W5_FRAMES)}>
				<Freeze frame={W5_SRC_IN + W5_FRAMES - 6}>
					<Footage id="ep03-witness-5" description={WITNESS_5_DESCRIPTION} muted />
				</Freeze>
			</Sequence>

			{/* Same watermark cover as Shots 4 and 5 — the generator's mark sits
			    in the same corner of these two clips too. Under the paper, so it
			    only ever affects the video. */}
			<AbsoluteFill
				style={{
					background:
						'radial-gradient(circle at 84% 91%, rgba(8,6,4,0.85) 0%, rgba(8,6,4,0.5) 45%, transparent 75%)',
					pointerEvents: 'none',
				}}
			/>

			{/* His caption, up only while he is actually on screen. */}
			<Chyron
				name="WITNESS — NAME WITHHELD"
				title="NOW SEEKING COMPENSATION"
				frame={frame}
				in={WITNESS_CHYRON_IN}
				out={REV2_STARTS}
				top={SAFE_BOTTOM_Y - 196}
				seed={91}
			/>

			{/* The page, torn open and closed around the video by the same
			    PaperTear every reality crossing in the series uses. */}
			<PaperTear progress={progress} at={44} lean={-20} seed={17}>
				<NewsPage frame={frame} />
			</PaperTear>

			<VoiceOver id="ep03-shot06-assoc" from={VO_ASSOC_STARTS} />

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

			{/* Each headline gets its own thud, and the newsprint rustle the
			    script asks for rides under the first one. */}
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

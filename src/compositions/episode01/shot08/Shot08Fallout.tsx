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
import {VoiceOver} from '../../../components/VoiceOver';
import {useStopMotionStep} from '../../../components/useStopMotionStep';
import {
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
	VO_UNION_STARTS,
	WITNESS2_CHYRON_IN,
	WITNESS2_FRAMES,
} from './beats';

const CLAMP = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

const WITNESS_DESCRIPTION =
	'Passenger on a video call at home, more haggard than before.\nVertical, photoreal, with its own dialogue.';

/**
 * The tear's opening progress (0 = closed/paper, 1 = open/torn-apart),
 * quantised to a stepped grid so it hops apart in bites like every other
 * piece of paper in the series rather than gliding.
 */
const stepOpen = (framesSinceStart: number, totalFrames: number): number => {
	const {stepIndex} = useStopMotionStep(Math.max(0, framesSinceStart), 2);
	return interpolate(Math.min(stepIndex * 2, totalFrames), [0, totalFrames], [0, 1], CLAMP);
};

/**
 * The page itself: one persistent sheet carrying both headlines. It is
 * mounted for the whole shot, torn open and closed twice around it — so
 * headline 1 is still sitting on it, untouched, when headline 2 lands.
 */
export const NewsPage: React.FC<{frame: number}> = ({frame}) => (
	<AbsoluteFill>
		<CollageBackdrop chaos={0.16} />
		<div style={{position: 'absolute', left: 110, top: 170}}>
			<NewsHeadline
				headline={'AUTO UNION WRITES\nTO GOVERNMENT'}
				quote="COMPENSATE DRIVERS SUFFERING FROM W.T.F. SYNDROME"
				clipping="newspaper-clip-autounion"
				age={frame - HEADLINE1_LAND}
				width={820}
				clipHeight={560}
				rotate={-1.5}
			/>
		</div>
		<div style={{position: 'absolute', left: 150, top: 1010}}>
			<NewsHeadline
				headline={'VICTIM FILES\nOWN CLAIM'}
				quote="WHY SHOULD I SUFFER ALONE?"
				clipping="newspaper-clip-victim"
				age={frame - HEADLINE2_STAMP}
				width={600}
				clipHeight={480}
				rotate={2}
			/>
		</div>
	</AbsoluteFill>
);

/**
 * Shot 8 — Institutional Fallout.
 *
 * The busiest transition beat in the episode, and the one that puts the
 * series' own rule to work in both directions inside a single shot: paper
 * closes over Shot 7's ending (reality receding), a headline holds under
 * narration, the same paper tears back open onto the witness a second time
 * (reality intruding again), and once he finishes it closes once more —
 * revealing the SAME page, now with a second headline landed beside the
 * first. Nothing here is a fresh cut; every change of world is a tear.
 *
 * The joke closes a loop rather than escalating one: the institution's
 * response to a driver following the rules becomes a headline, the
 * witness's private grievance about it becomes his own headline a few
 * seconds later, and the two sit on the same page because they are, in the
 * story the show is telling, the same story.
 */
export const Shot08Fallout: React.FC = () => {
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

	const witnessLiveFrom = FWD_TEAR_DONE;
	const witnessLiveTo = FWD_TEAR_DONE + WITNESS2_FRAMES;

	return (
		<AbsoluteFill style={{backgroundColor: '#0c0e11'}}>
			{/* Backdrop, underneath the paper: Shot 7's ending until the forward
			    tear opens, then the witness — held frozen and muted while the
			    tear is mid-open or mid-close, playing live only in between. */}
			<Sequence from={0} durationInFrames={FWD_TEAR_STARTS}>
				<Freeze frame={244}>
					<Footage
						id="ep01-expert-2"
						description={'Dr. Ramamurthy at his office desk.\nVertical, photoreal, with its own dialogue.'}
						muted
					/>
				</Freeze>
			</Sequence>

			<Sequence from={FWD_TEAR_STARTS} durationInFrames={witnessLiveFrom - FWD_TEAR_STARTS}>
				<Freeze frame={0}>
					<Footage id="ep01-witness-2" description={WITNESS_DESCRIPTION} muted />
				</Freeze>
			</Sequence>
			<Sequence from={witnessLiveFrom} durationInFrames={WITNESS2_FRAMES}>
				<Footage id="ep01-witness-2" description={WITNESS_DESCRIPTION} />
			</Sequence>
			<Sequence from={witnessLiveTo} durationInFrames={REV2_DONE - witnessLiveTo}>
				<Freeze frame={WITNESS2_FRAMES - 6}>
					<Footage id="ep01-witness-2" description={WITNESS_DESCRIPTION} muted />
				</Freeze>
			</Sequence>

			{/* His updated caption, up only while he is actually on screen. */}
			<Chyron
				name="WITNESS — NAME WITHHELD"
				title="NOW SEEKING COMPENSATION"
				frame={frame}
				in={WITNESS2_CHYRON_IN}
				out={REV2_STARTS}
				top={1668}
				seed={94}
			/>

			{/* The page, torn open and closed around the video by the same
			    PaperTear every other reality crossing in the series uses. */}
			<PaperTear progress={progress} at={44} lean={-20} seed={17}>
				<NewsPage frame={frame} />
			</PaperTear>

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
			{/* And each headline gets its own thud as it lands. */}
			<Sequence from={HEADLINE1_LAND}>
				<Audio src={staticFile('sfx/stamp-thud.wav')} volume={0.7} />
			</Sequence>
			<Sequence from={HEADLINE2_STAMP}>
				<Audio src={staticFile('sfx/stamp-thud.wav')} volume={0.7} />
			</Sequence>

			<VoiceOver id="ep01-shot08-union" from={VO_UNION_STARTS} />
		</AbsoluteFill>
	);
};

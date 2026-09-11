import React from 'react';
import {AbsoluteFill, Audio, Freeze, Sequence, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {NAMEPLATE_TOP, Nameplate} from '../Nameplate';
import {Footage} from '../../../components/Footage';
import {NewsHeadline} from '../../../components/NewsHeadline';
import {PaperTear} from '../../../components/PaperTear';
import {useStopMotionStep} from '../../../components/useStopMotionStep';
import {VoiceOver} from '../../../components/VoiceOver';
import {GANACHE_DEEP} from '../../../components/palette';
import {Ground} from '../Ground';
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
	VO_UNION_STARTS,
	WITNESS_CHYRON_IN,
	WITNESS_FRAMES,
	WITNESS_TRIM,
} from './beats';

const CLAMP = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

/** Every delivered clip has the generator's mark burnt into the bottom-right. */
const WATERMARK_CROP = 1.14;

const WITNESS_DESCRIPTION =
	'The customer on a video call, same setup as Beat 4, more haggard.\n' +
	'"He gets compensation? I lost an afternoon. I lost a marriage.\n' +
	'All I wanted was a demand draft."\nVertical, photoreal, with its own dialogue.';

/**
 * The tear's opening progress, quantised so the paper comes apart in bites
 * like every other piece of paper in the series rather than gliding.
 */
const stepOpen = (framesSince: number, total: number): number => {
	const {stepIndex} = useStopMotionStep(Math.max(0, framesSince), 2);
	return interpolate(Math.min(stepIndex * 2, total), [0, total], [0, 1], CLAMP);
};

/**
 * One persistent sheet carrying BOTH headlines, mounted for the whole shot and
 * torn open and closed around the video. That is the point: headline one is
 * still sitting there, untouched, when the witness's own sentence lands
 * beneath it as headline two.
 */
const NewsPage: React.FC<{frame: number}> = ({frame}) => (
	<AbsoluteFill>
		<Ground grain={0.16} />
		<div style={{position: 'absolute', left: BLOCK1.left, top: BLOCK1.top}}>
			<NewsHeadline
				headline={"BANK EMPLOYEES' UNION\nWRITES TO RBI"}
				quote="COMPENSATE THOSE SUFFERING FROM K.Y.C. SYNDROME"
				clipping="newspaper-clip-bankunion"
				age={frame - HEADLINE1_LAND}
				width={BLOCK1.width}
				clipHeight={BLOCK1.clipHeight}
				rotate={BLOCK1.rotate}
			/>
		</div>
		<div style={{position: 'absolute', left: BLOCK2.left, top: BLOCK2.top}}>
			<NewsHeadline
				headline={'VICTIM FILES\nOWN CLAIM'}
				quote="ALL I WANTED WAS A DEMAND DRAFT"
				clipping="newspaper-clip-victimclaim"
				age={frame - HEADLINE2_STAMP}
				width={BLOCK2.width}
				clipHeight={BLOCK2.clipHeight}
				rotate={BLOCK2.rotate}
			/>
		</div>
	</AbsoluteFill>
);

export const Shot06Fallout: React.FC = () => {
	const frame = useCurrentFrame();

	// Closed (1) = paper covering the frame. Open (0) = video showing through.
	const rev1 = 1 - stepOpen(frame - REV1_STARTS, REV1_FRAMES);
	const fwd = stepOpen(frame - FWD_TEAR_STARTS, FWD_TEAR_FRAMES);
	const rev2 = 1 - stepOpen(frame - REV2_STARTS, REV2_FRAMES);

	const progress =
		frame < REV1_STARTS
			? 1
			: frame < REV1_DONE
				? rev1
				: frame < FWD_TEAR_STARTS
					? 0
					: frame < FWD_TEAR_DONE
						? fwd
						: frame < REV2_STARTS
							? 1
							: frame < REV2_DONE
								? rev2
								: 0;

	return (
		<AbsoluteFill style={{backgroundColor: GANACHE_DEEP}}>
			{/* The expert's last frame, held, until the paper closes over it. */}
			<Sequence from={0} durationInFrames={REV1_STARTS + REV1_FRAMES}>
				<Freeze frame={0}>
					{/* The expert's own last take, held on its final frame -- the
					    shot before this one ends on him, so the paper closes over
					    the picture the audience is already looking at rather than
					    over a new one. */}
					<Footage
						id="ep04-expert-kicker"
						description="The expert, held."
						muted
						cropBottom={WATERMARK_CROP}
					/>
				</Freeze>
			</Sequence>

			{/* The witness, between the two tears. */}
			<Sequence from={FWD_TEAR_DONE} durationInFrames={WITNESS_FRAMES}>
				<Footage
					id="ep04-witness-claim"
					description={WITNESS_DESCRIPTION}
					trimBeforeInFrames={WITNESS_TRIM}
					cropBottom={WATERMARK_CROP}
				/>
			</Sequence>
			{/* A soft corner darkener under the caption. Laid over the video
			    only, never the paper, so the type has something to sit on
			    without dulling the page either side of it. */}
			{frame >= FWD_TEAR_DONE && frame < REV2_STARTS ? (
				<AbsoluteFill
					style={{
						background:
							'radial-gradient(circle at 84% 91%, rgba(20,13,9,0.85) 0%, rgba(20,13,9,0.5) 45%, transparent 75%)',
						pointerEvents: 'none',
					}}
				/>
			) : null}

			{/* His caption, up only while he is actually on screen. */}
			<Nameplate
				name="WITNESS — NAME WITHHELD"
				title="NOW SEEKING COMPENSATION"
				frame={frame}
				in={WITNESS_CHYRON_IN}
				out={REV2_STARTS}
				seed={91}
			/>

			{/* Note the inversion: the page is BELOW the video in the stack for
			    the middle section and above it either side, which is what
			    PaperTear's progress is doing — one sheet, opened and closed,
			    never two sheets swapped. */}
			<PaperTear progress={progress} at={44} lean={20} seed={31}>
				<NewsPage frame={frame} />
			</PaperTear>

			<Sequence from={REV1_STARTS}>
				<Audio src={staticFile('sfx/paper-rip.wav')} volume={0.85} />
			</Sequence>
			<Sequence from={HEADLINE1_LAND}>
				<Audio src={staticFile('sfx/stamp-thud.wav')} volume={0.7} />
			</Sequence>
			<Sequence from={FWD_TEAR_STARTS}>
				<Audio src={staticFile('sfx/paper-rip.wav')} volume={0.85} />
			</Sequence>
			<Sequence from={REV2_STARTS}>
				<Audio src={staticFile('sfx/paper-rip.wav')} volume={0.85} />
			</Sequence>
			<Sequence from={HEADLINE2_STAMP}>
				<Audio src={staticFile('sfx/stamp-thud.wav')} volume={0.7} />
			</Sequence>

			<VoiceOver id="ep04-shot06-union-cut" from={VO_UNION_STARTS} />
		</AbsoluteFill>
	);
};

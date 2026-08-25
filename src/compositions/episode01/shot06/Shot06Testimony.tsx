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
import {EvidenceStamp} from '../../../components/EvidenceStamp';
import {Footage} from '../../../components/Footage';
import {PaperTear} from '../../../components/PaperTear';
import {useStopMotionStep} from '../../../components/useStopMotionStep';
import {SHOT_05_DURATION} from '../shot05/beats';
import {Shot05Graphic} from '../shot05/Shot05Graphic';
import {ChecklistItem} from './Checklist';
import {
	CORR_IN,
	CORR_LOWER_THIRD_IN,
	CORR_LOWER_THIRD_OUT,
	ITEMS,
	SLATE_IN,
	SLATE_OUT,
	TEAR_FRAMES,
	TEAR_STARTS,
	WITNESS_IN,
	WITNESS_LOWER_THIRD_IN,
} from './beats';

const CLAMP = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

const LIST_X = 84;
const LIST_W = 820;
/** Well clear of his chin (~41% down the frame) and of the lower third. */
const LIST_TOP = 1010;
const ITEM_H = 80;
const ITEM_GAP = 10;

const WITNESS_DESCRIPTION =
	'Passenger on a video call at home.\nVertical, photoreal, with its own dialogue.';
const CORR_DESCRIPTION =
	'Correspondent on the other end of the call.\nVertical, photoreal, with its own dialogue.';

/**
 * Shot 6 — Webcam Interview.
 *
 * The first photoreal shot in the series, and the transition into it is the
 * point: the survey page from Shot 5 does not cut away, it gets torn in half
 * and pulled off the frame. Per the script's rule, a tear is reality
 * intruding on the reenactment — it is only ever used for cuts to real
 * footage, so by the time the audience sees what is underneath they have
 * already been told what kind of thing it is.
 *
 * What the tear reveals is the correspondent's question. The witness's
 * answer is cut in straight after, no transition device — two windows of one
 * call, the way any two-camera interview is edited. Both clips speak for
 * themselves: this shot adds no audio beyond the rip, and every graphic is
 * cut to the delivery rather than the other way round.
 *
 * What survives the change of register is the paper: the caption and the
 * evidence checklist stay newsprint chits over photoreal video, which is what
 * ties the two halves of the episode into one piece rather than two. The
 * checklist is the joke — every item on it is something an auto driver is
 * simply supposed to do, and each one gets written down and ticked like a
 * finding. Nothing he describes is remarkable. The list is damning anyway.
 */
export const Shot06Testimony: React.FC = () => {
	const frame = useCurrentFrame();

	const tear = interpolate(frame, [TEAR_STARTS, TEAR_STARTS + TEAR_FRAMES], [0, 1], CLAMP);
	// Stepped, so the sheet comes apart in bites the way the puppets move.
	const {stepIndex: tearStep} = useStopMotionStep(Math.max(0, frame - TEAR_STARTS), 2);
	const tearProgress = interpolate(
		Math.min(tearStep * 2, TEAR_FRAMES),
		[0, TEAR_FRAMES],
		[0, 1],
		CLAMP,
	);

	return (
		<AbsoluteFill style={{backgroundColor: '#0c0e11'}}>
			{/* The correspondent, held on his first frame — silent — while the
			    paper is still coming off him. Playing him from the start would
			    have him mid-question behind a sheet that hasn't cleared yet. */}
			<Sequence from={0} durationInFrames={CORR_IN}>
				<Freeze frame={0}>
					<Footage id="ep01-correspondent-q" description={CORR_DESCRIPTION} muted />
				</Freeze>
			</Sequence>
			{/* Runs from his own frame zero once revealed, and is cut off shortly
			    after his question lands — the clip has several seconds of him
			    just sitting after it that this shot has no use for. */}
			<Sequence from={CORR_IN} durationInFrames={WITNESS_IN - CORR_IN}>
				<Footage id="ep01-correspondent-q" description={CORR_DESCRIPTION} />
			</Sequence>

			{/* The witness. A hard cut, not a reveal — there is no paper left to
			    clear by this point, so he plays from his own frame zero the
			    moment he is on screen. */}
			<Sequence from={WITNESS_IN}>
				<Footage id="ep01-witness" description={WITNESS_DESCRIPTION} />
			</Sequence>

			{/* The page from Shot 5, frozen on its last frame and torn apart. */}
			{tear < 1 ? (
				<PaperTear progress={tearProgress} at={46} lean={26} seed={9}>
					<Freeze frame={SHOT_05_DURATION - 6}>
						<Shot05Graphic silent />
					</Freeze>
				</PaperTear>
			) : null}

			{/* The rip is the one sound this shot adds, and it belongs to the
			    paper rather than to either clip. */}
			<Sequence from={TEAR_STARTS}>
				<Audio src={staticFile('sfx/paper-rip.wav')} volume={0.95} />
			</Sequence>

			{/* The stamp beat, over the reveal. Half a second, then gone. */}
			{frame >= SLATE_IN && frame < SLATE_OUT ? (
				<AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}>
					<EvidenceStamp
						text={'FOOTAGE:\nWITNESS TESTIMONY'}
						age={frame - SLATE_IN}
						fontSize={56}
						rotate={-5}
						color="#d8563a"
						style={{background: 'rgba(12,10,8,0.62)'}}
					/>
				</AbsoluteFill>
			) : null}

			{/* The evidence checklist, on paper, over the witness's answer —
			    pulled well clear of his chin so his face reads throughout. */}
			{ITEMS.map((item, i) => (
				<div
					key={item.text}
					style={{position: 'absolute', left: LIST_X, top: LIST_TOP + i * (ITEM_H + ITEM_GAP)}}
				>
					<ChecklistItem
						text={item.text}
						age={frame - item.in}
						tickAge={frame - item.tick}
						width={LIST_W}
						height={ITEM_H}
						seed={30 + i * 4}
					/>
				</div>
			))}

			{/* The correspondent's chyron — his name and outlet, gone again before
			    the witness's own caption arrives. Bangalore Vox gets the same
			    treatment the series gives every credential: stated with total
			    confidence and quietly undercut, the way Dr. Ramamurthy's
			    "institute unaccredited" footnote works in Shot 7. */}
			<Chyron
				name="KARTHIK MENON"
				title="CORRESPONDENT, BANGALORE VOX"
				frame={frame}
				in={CORR_LOWER_THIRD_IN}
				out={CORR_LOWER_THIRD_OUT}
				top={1700}
				seed={61}
			/>

			{/* The witness's — newsprint, despite the photoreal footage. Keeping
			    the caption in the paper world is what stops Scene 2 reading as a
			    different film. */}
			<Chyron
				name="WITNESS — NAME WITHHELD"
				title="SURVIVOR, INCIDENT #0001"
				frame={frame}
				in={WITNESS_LOWER_THIRD_IN}
				top={1668}
				seed={77}
			/>
		</AbsoluteFill>
	);
};

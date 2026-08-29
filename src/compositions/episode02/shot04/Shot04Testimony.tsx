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
import {SAFE_BOTTOM_Y} from '../../../components/safeArea';
import {useStopMotionStep} from '../../../components/useStopMotionStep';
import {VoiceOver} from '../../../components/VoiceOver';
import {ChecklistItem} from '../../episode01/shot06/Checklist';
import {SHOT_03_DURATION} from '../shot03/beats';
import {Shot03Graphic} from '../shot03/Shot03Graphic';
import {
	CORR_Q_IN,
	DROPOUT_IN,
	DROPOUT_OUT,
	ITEMS,
	SLATE_IN,
	SLATE_OUT,
	TEAR_FRAMES,
	TEAR_STARTS,
	WITNESS_2_IN,
	WITNESS_ANSWERS,
	WITNESS_LOWER_THIRD_IN,
} from './beats';

const CLAMP = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

const LIST_X = 84;
const LIST_W = 830;
/** Clear of his chin, and clear of the chyron below. */
const LIST_TOP = 940;
const ITEM_H = 80;
const ITEM_GAP = 10;

/** Chyron is ~140 tall; this keeps its foot off the platform chrome. */
const CHYRON_TOP = SAFE_BOTTOM_Y - 196;

const WITNESS_1_DESCRIPTION =
	'Employee on a video call at home — the list.\n"I sent the request at 11:47 PM… Just… approved."\nVertical, photoreal, with its own dialogue.';
const WITNESS_2_DESCRIPTION =
	'Same employee, same setup — the Teams beat.\n"He even said don\'t check Teams… what to do with myself."\nVertical, photoreal, with its own dialogue.';

/**
 * Shot 4 — Tear Reveal + Witness Testimony.
 *
 * The stat card from Shot 3 does not cut away; it is torn in half and pulled
 * off the frame. A tear means reality intruding on the reenactment and is
 * reserved for cuts to real footage, so the audience knows what kind of thing
 * is coming before their eye resolves it.
 *
 * The correspondent asks his one question from off screen — this episode never
 * shows him here, unlike Episode 01 — so the witness is already sitting there,
 * listening, while it is asked. That is a better shot than cutting to a man to
 * hear a question, and it costs one clip instead of two.
 *
 * What survives the change of register is the paper: the caption and the
 * evidence checklist stay newsprint chits over photoreal video, which is what
 * ties the two halves of the episode into one piece rather than two.
 */
export const Shot04Testimony: React.FC = () => {
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
			{/* Held on his first frame — silent — while the paper is still coming
			    off him, then playing from his own frame zero once revealed and the
			    question has been asked. */}
			<Sequence from={0} durationInFrames={WITNESS_ANSWERS}>
				<Freeze frame={0}>
					<Footage id="ep02-witness-1" description={WITNESS_1_DESCRIPTION} muted />
				</Freeze>
			</Sequence>
			<Sequence from={WITNESS_ANSWERS} durationInFrames={WITNESS_2_IN - WITNESS_ANSWERS}>
				<Footage id="ep02-witness-1" description={WITNESS_1_DESCRIPTION} />
			</Sequence>

			{/* Clip two: a hard jump cut, no transition device. Two takes of one
			    call, edited the way cut testimony always is. */}
			<Sequence from={WITNESS_2_IN}>
				{/*
				 * The dropout the script asks for, on "I didn't know what to do with
				 * myself". Production notes §13 lists this mechanism as written but
				 * never shot — Episode 01 had no line to land it on. The window is
				 * provisional until the clip exists and can be measured.
				 */}
				<Footage
					id="ep02-witness-2"
					description={WITNESS_2_DESCRIPTION}
					volume={(f) => (f >= DROPOUT_IN && f < DROPOUT_OUT ? 0 : 1)}
				/>
			</Sequence>

			{/* The page from Shot 3, frozen on its last frame and torn apart. */}
			{tear < 1 ? (
				<PaperTear progress={tearProgress} at={46} lean={26} seed={9}>
					<Freeze frame={SHOT_03_DURATION - 6}>
						<Shot03Graphic silent />
					</Freeze>
				</PaperTear>
			) : null}

			{/* The rip is the one sound this shot adds, and it belongs to the paper
			    rather than to the clip. */}
			<Sequence from={TEAR_STARTS}>
				<Audio src={staticFile('sfx/paper-rip.wav')} volume={0.95} />
			</Sequence>

			{/* Off screen, over him listening. */}
			<VoiceOver id="ep02-shot04-q" from={CORR_Q_IN} />

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

			{/* The evidence checklist, on paper, over his answer — pulled well clear
			    of his chin so his face reads throughout, and clear of the bottom
			    fifth the platforms cover. */}
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

			{/* Newsprint, despite the photoreal footage. Keeping the caption in the
			    paper world is what stops Scene 2 reading as a different film.
			    Incident #0002 — a second case file, same apparatus. */}
			<Chyron
				name="WITNESS — NAME WITHHELD"
				title="SURVIVOR, INCIDENT #0002"
				frame={frame}
				in={WITNESS_LOWER_THIRD_IN}
				top={CHYRON_TOP}
				seed={77}
			/>
		</AbsoluteFill>
	);
};

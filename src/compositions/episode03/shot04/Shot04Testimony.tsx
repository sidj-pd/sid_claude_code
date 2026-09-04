import React from 'react';
import {AbsoluteFill, Audio, Freeze, Sequence, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {Chyron} from '../../../components/Chyron';
import {EvidenceStamp} from '../../../components/EvidenceStamp';
import {Footage} from '../../../components/Footage';
import {PaperTear} from '../../../components/PaperTear';
import {SAFE_BOTTOM_Y} from '../../../components/safeArea';
import {useStopMotionStep} from '../../../components/useStopMotionStep';
import {ChecklistItem} from '../../episode01/shot06/Checklist';
import {SHOT_02_DURATION} from '../shot02/beats';
import {Shot02Graphic} from '../shot02/Shot02Graphic';
import {
	DROPOUT_IN,
	DROPOUT_OUT,
	ITEMS,
	SLATE_IN,
	SLATE_OUT,
	TEAR_FRAMES,
	TEAR_STARTS,
	WITNESS_1_FRAMES,
	WITNESS_1_IN,
	WITNESS_2_FRAMES,
	WITNESS_2_IN,
	WITNESS_3_IN,
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
	'Tenant on a video call at home — the rehearsed defense.\n"I had my whole defense ready… before I moved in."\nVertical, photoreal, with its own dialogue.';
const WITNESS_2_DESCRIPTION =
	'Same tenant, same setup — the checklist.\n"No inspection… He just handed it over. Full amount."\nVertical, photoreal, with its own dialogue.';
const WITNESS_3_DESCRIPTION =
	'Same tenant, same setup — the notes app beat.\n"I still have the speech saved… what to do with it now."\nVertical, photoreal, with its own dialogue.';

/**
 * Shots 3-4 — Tear Reveal + Witness Testimony.
 *
 * The stat card from Shot 2 is torn in half and pulled off the frame rather
 * than cut away from — see beats.ts for why that page was held frozen
 * instead of cutting to the black the script asks for. What survives the
 * change of register is the paper: the caption and the evidence checklist
 * stay newsprint chits over photoreal video, same as both previous episodes,
 * which is what keeps this reading as one piece rather than two different
 * films sharing a runtime.
 *
 * Three clips, not the two Episode 02 used, because this witness's line is
 * longer and has one more real beat in it: the rehearsed defense, the
 * checklist itself, and — after his eyes drift, replaying the memory — the
 * notes-app line the audio dropout lands on.
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
			    off him, then playing from his own frame zero once revealed. No
			    correspondent question to wait on this time; he is already
			    mid-testimony as soon as the page clears. Freeze matters here:
			    without it this segment plays the clip (muted, mostly hidden
			    behind the tear) and then the next Sequence restarts it from its
			    own frame zero anyway — a visible jump the instant the tear
			    clears, since the tear finishes ten frames before this one does. */}
			<Sequence from={0} durationInFrames={WITNESS_1_IN}>
				<Freeze frame={0}>
					<Footage id="ep03-witness-1" description={WITNESS_1_DESCRIPTION} muted />
				</Freeze>
			</Sequence>
			<Sequence from={WITNESS_1_IN} durationInFrames={WITNESS_1_FRAMES}>
				<Footage id="ep03-witness-1" description={WITNESS_1_DESCRIPTION} />
			</Sequence>

			{/* Clip two: a hard jump cut, no transition device. Two takes of one
			    call, edited the way cut testimony always is. */}
			<Sequence from={WITNESS_2_IN} durationInFrames={WITNESS_2_FRAMES}>
				<Footage id="ep03-witness-2" description={WITNESS_2_DESCRIPTION} />
			</Sequence>

			{/* Clip three: another hard jump cut. The dropout the script asks for,
			    on "I don't know what to do with it now". */}
			<Sequence from={WITNESS_3_IN}>
				<Footage
					id="ep03-witness-3"
					description={WITNESS_3_DESCRIPTION}
					volume={(f) => (f >= DROPOUT_IN && f < DROPOUT_OUT ? 0 : 1)}
				/>
			</Sequence>

			{/* The page from Shot 2, frozen on its last frame and torn apart. */}
			{tear < 1 ? (
				<PaperTear progress={tearProgress} at={46} lean={26} seed={9}>
					<Sequence from={0} durationInFrames={SHOT_02_DURATION}>
						<Shot02Graphic silent />
					</Sequence>
				</PaperTear>
			) : null}

			{/* The rip is the one sound this shot adds, and it belongs to the
			    paper rather than to the clip. */}
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

			{/* The evidence checklist, on paper, over his answer — pulled well
			    clear of his chin so his face reads throughout, and clear of the
			    bottom fifth the platforms cover. */}
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

			{/* Newsprint, despite the photoreal footage — same rule as both
			    previous episodes. Incident #0003. */}
			<Chyron
				name="WITNESS — NAME WITHHELD"
				title="SURVIVOR, INCIDENT #0003"
				frame={frame}
				in={WITNESS_LOWER_THIRD_IN}
				top={CHYRON_TOP}
				seed={77}
			/>
		</AbsoluteFill>
	);
};

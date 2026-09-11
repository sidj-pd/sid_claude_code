import React from 'react';
import {AbsoluteFill, Freeze, Sequence, interpolate, useCurrentFrame} from 'remotion';
import {NAMEPLATE_TOP, Nameplate} from '../Nameplate';
import {EvidenceStamp} from '../../../components/EvidenceStamp';
import {Footage} from '../../../components/Footage';
import {PaperTear} from '../../../components/PaperTear';
import {useStopMotionStep} from '../../../components/useStopMotionStep';
import {BUTTER, GANACHE, GANACHE_DEEP} from '../../../components/palette';
import {ChecklistItem} from '../../episode01/shot06/Checklist';
import {Shot02Graphic} from '../shot02/Shot02Graphic';
import {BLACKOUT as EP04_BLACKOUT} from '../shot02/beats';
import {
	CHYRON_IN,
	DROPOUT_AT,
	DROPOUT_FRAMES,
	LIST_AT,
	STAMP_FRAMES,
	STAMP_IN,
	TEAR_FRAMES,
	TEAR_STARTS,
	TICK_AFTER,
	WITNESS_1_FRAMES,
	WITNESS_1_IN,
	WITNESS_2_FRAMES,
	WITNESS_2_IN,
	WITNESS_2_TRIM,
} from './beats';

const CLAMP = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

const W1 =
	'MISSING TAKE — ep04-witness-1.\n' +
	'"I saw the sign. I was already turning around. That\'s what you do.\n' +
	'He called me back. Pushed his lunch aside. No token.\n' +
	'No \'come after 3:30.\' No \'sir, go to counter 2.\' Done in four minutes."';
const W2 = 'The customer, second take — the afternoon he got back.';

/** The three things that did not happen, which is what the case rests on. */
const ITEMS = ['NO TOKEN', 'NO "COME AFTER 3:30"', 'NO "GO TO COUNTER 2"'];

/** Every delivered clip has the generator's mark burnt into the bottom-right. */
const WATERMARK_CROP = 1.14;

/**
 * The inverse of the nameplate: Butter card, Ganache ink and tick. With the
 * plate below them gone dark, matching it would stack four dark slabs down a
 * man's chest; inverting keeps the pair related and keeps the evidence
 * reading as paper.
 */
const CARD = BUTTER;

/** Below his chin, above the nameplate. See the note at the render site. */
const LIST_TOP = 1060;
const LIST_PITCH = 96;
const LIST_H = 82;

/** The dropout, as an offset into clip two rather than into the shot. */
const DROPOUT_LOCAL = DROPOUT_AT - WITNESS_2_IN;

export const Shot04Testimony: React.FC = () => {
	const frame = useCurrentFrame();

	// Stepped, so the sheet comes apart in bites the way the puppets move.
	const {stepIndex: tearStep} = useStopMotionStep(Math.max(0, frame - TEAR_STARTS), 2);
	const tearProgress = interpolate(
		Math.min(tearStep * 2, TEAR_FRAMES),
		[0, TEAR_FRAMES],
		[0, 1],
		CLAMP,
	);


	return (
		<AbsoluteFill style={{backgroundColor: GANACHE_DEEP}}>
			{/* Held on his first frame, silent, while the paper is still coming
			    off him. Without the Freeze this segment plays the clip mostly
			    hidden behind the tear and the next Sequence restarts it from
			    frame zero — a visible jump the instant the page clears. */}
			<Sequence from={0} durationInFrames={WITNESS_1_IN}>
				<Freeze frame={0}>
					<Footage id="ep04-witness-1" description={W1} muted cropBottom={WATERMARK_CROP} />
				</Freeze>
			</Sequence>
			<Sequence from={WITNESS_1_IN} durationInFrames={WITNESS_1_FRAMES}>
				<Footage id="ep04-witness-1" description={W1} cropBottom={WATERMARK_CROP} />
			</Sequence>

			{/* Clip two: a hard jump cut, no transition device. */}
			<Sequence from={WITNESS_2_IN} durationInFrames={WITNESS_2_FRAMES}>
				<Footage
					id="ep04-witness-2"
					description={W2}
					trimBeforeInFrames={WITNESS_2_TRIM}
					cropBottom={WATERMARK_CROP}
					/* The dropout the script asks for, on the last line. Footage's
					   volume takes a function of the frame WITHIN the clip, which
					   is exactly what this is for -- and it means the gate stays
					   put if the clip's start ever moves. A hard gate, not a fade:
					   a call drops, it does not duck. */
					volume={(f) => (f >= DROPOUT_LOCAL && f < DROPOUT_LOCAL + DROPOUT_FRAMES ? 0 : 1)}
				/>
			</Sequence>

			{/* The stat card, frozen and torn away.
			    NOT its last frame: Shot 2 ends on eighteen frames of black, so
			    freezing at the end tears away a black rectangle and the reveal
			    has nothing to reveal FROM. Frozen four frames before the
			    blackout instead, which is the last frame the clock card is
			    actually on screen.
			    It renders itself silent here: a frozen page still holding audio
			    would fight the shot it is being pulled out of. */}
			{/* progress 1 is TORN OPEN and 0 is the paper closed over the frame --
			    the opposite of what it reads like. The first cut passed
			    `1 - tearProgress`, which runs 1 to 0, so the page closed instead
			    of opening and the stat card sat over the testimony for the whole
			    shot. Shots 6 and 8 tear the other way and had it right, which is
			    what made this one easy to get backwards. */}
			<PaperTear progress={tearProgress} at={40} lean={-22} seed={19}>
				<Freeze frame={EP04_BLACKOUT - 4}>
					<Shot02Graphic silent />
				</Freeze>
			</PaperTear>

			{/* Flashed, then gone, before the lower third settles in. */}
			{frame >= STAMP_IN && frame < STAMP_IN + STAMP_FRAMES ? (
				<div style={{position: 'absolute', left: 0, right: 0, top: 300, textAlign: 'center'}}>
					<div style={{display: 'inline-block'}}>
						<EvidenceStamp
							text="FOOTAGE: WITNESS TESTIMONY"
							age={frame - STAMP_IN}
							fontSize={46}
							rotate={-3}
							color={GANACHE}
						/>
					</div>
				</div>
			) : null}

			{/* The evidence checklist, in the band between his chin and the
			    nameplate. It used to start at y380, which put all three chits
			    straight across his eyes and mouth -- measured on the delivered
			    take, his face runs from about y160 to y1040, and the clear space
			    is below that. Three chits of 82 on a 96 pitch run 1060-1334,
			    which leaves 42px under the lowest one before the card at
			    NAMEPLATE_TOP. */}
			{ITEMS.map((text, i) => {
				const at = LIST_AT[i];
				if (frame < at) return null;
				return (
					<div key={text} style={{position: 'absolute', left: 84, top: LIST_TOP + i * LIST_PITCH}}>
						<ChecklistItem
							text={text}
							age={frame - at}
							tickAge={frame - at - TICK_AFTER}
							width={620}
							height={LIST_H}
							seed={13 + i * 7}
							ink={GANACHE}
							paper={CARD}
							mark={GANACHE}
							torn={false}
						/>
					</div>
				);
			})}

			<Nameplate
				name="WITNESS — NAME WITHHELD"
				title="SURVIVOR, INCIDENT #0004"
				frame={frame}
				in={CHYRON_IN}
				seed={29}
			/>
		</AbsoluteFill>
	);
};

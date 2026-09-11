import React from 'react';
import {AbsoluteFill, Freeze, Sequence, interpolate, useCurrentFrame} from 'remotion';
import {Chyron} from '../../../components/Chyron';
import {EvidenceStamp} from '../../../components/EvidenceStamp';
import {Footage} from '../../../components/Footage';
import {PaperTear} from '../../../components/PaperTear';
import {SAFE_BOTTOM_Y} from '../../../components/safeArea';
import {useStopMotionStep} from '../../../components/useStopMotionStep';
import {GANACHE, GANACHE_DEEP} from '../../../components/palette';
import {ChecklistItem} from '../../episode01/shot06/Checklist';
import {Shot02Graphic} from '../shot02/Shot02Graphic';
import {BLACKOUT as EP04_BLACKOUT} from '../shot02/beats';
import {
	CHYRON_IN,
	DROPOUT_AT,
	DROPOUT_FRAMES,
	LIST_EVERY,
	LIST_IN,
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
					<Footage id="ep04-witness-1" description={W1} muted />
				</Freeze>
			</Sequence>
			<Sequence from={WITNESS_1_IN} durationInFrames={WITNESS_1_FRAMES}>
				<Footage id="ep04-witness-1" description={W1} />
			</Sequence>

			{/* Clip two: a hard jump cut, no transition device. */}
			<Sequence from={WITNESS_2_IN} durationInFrames={WITNESS_2_FRAMES}>
				<Footage
					id="ep04-witness-2"
					description={W2}
					trimBeforeInFrames={WITNESS_2_TRIM}
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
			<PaperTear progress={1 - tearProgress} at={40} lean={-22} seed={19}>
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

			{/* The evidence checklist, over the middle of his list. */}
			{ITEMS.map((text, i) => {
				const at = LIST_IN + i * LIST_EVERY;
				if (frame < at) return null;
				return (
					<div key={text} style={{position: 'absolute', left: 84, top: 380 + i * 150}}>
						<ChecklistItem
							text={text}
							age={frame - at}
							tickAge={frame - at - TICK_AFTER}
							width={640}
							height={112}
							seed={13 + i * 7}
						/>
					</div>
				);
			})}

			<Chyron
				name="WITNESS — NAME WITHHELD"
				title="SURVIVOR, INCIDENT #0004"
				frame={frame}
				in={CHYRON_IN}
				top={SAFE_BOTTOM_Y - 196}
				seed={29}
			/>
		</AbsoluteFill>
	);
};

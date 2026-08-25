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
import {EvidenceStamp} from '../../../components/EvidenceStamp';
import {Footage} from '../../../components/Footage';
import {NewsprintTexture} from '../../../components/NewsprintTexture';
import {PaperTear} from '../../../components/PaperTear';
import {tornPolygon} from '../../../components/tornEdge';
import {useStopMotionStep} from '../../../components/useStopMotionStep';
import {SHOT_05_DURATION} from '../shot05/beats';
import {Shot05Graphic} from '../shot05/Shot05Graphic';
import {ChecklistItem} from './Checklist';
import {
	FOOTAGE_IN,
	ITEMS,
	LOWER_THIRD_IN,
	SLATE_IN,
	SLATE_OUT,
	TEAR_FRAMES,
	TEAR_STARTS,
	VERDICT_STAMP,
} from './beats';

const CLAMP = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const INK = '#241d15';

const LIST_X = 84;
const LIST_W = 820;
const LIST_TOP = 900;
const ITEM_H = 92;
const ITEM_GAP = 14;

const FOOTAGE_DESCRIPTION =
	'Passenger on a video call at home.\nVertical, photoreal, with its own dialogue.';

/**
 * Shot 6 — Witness Testimony.
 *
 * The first photoreal shot in the series, and the transition into it is the
 * point: the survey page from Shot 5 does not cut away, it gets torn in half
 * and pulled off the frame. Per the script's rule, a tear is reality
 * intruding on the reenactment — it is only ever used for cuts to real
 * footage, so by the time the audience sees what is underneath they have
 * already been told what kind of thing it is.
 *
 * The clip speaks for itself. It was generated with its dialogue, so this
 * shot adds no audio of any kind and the graphics are cut to the delivery
 * rather than the delivery to the graphics — every checklist beat in
 * beats.ts is measured off the clip's own envelope.
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
			{/* The clip is held on its first frame while the paper comes off, and
			    silent while it is held — the reveal should uncover him about to
			    speak, not catch him mid-sentence behind a sheet. */}
			<Sequence from={0} durationInFrames={FOOTAGE_IN}>
				<Freeze frame={0}>
					<Footage id="ep01-witness" description={FOOTAGE_DESCRIPTION} muted />
				</Freeze>
			</Sequence>
			<Sequence from={FOOTAGE_IN}>
				<Footage id="ep01-witness" description={FOOTAGE_DESCRIPTION} />
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
			    paper rather than to the footage. */}
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

			{/* The evidence checklist, on paper, over the video. */}
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

			{/* The verdict, stamped across the finished list — over the chits
			    rather than after them, the way a form gets stamped once every
			    line on it has been filled in. */}
			{frame >= VERDICT_STAMP ? (
				<AbsoluteFill style={{alignItems: 'center', justifyContent: 'flex-start'}}>
					<div style={{marginTop: LIST_TOP + 1.15 * (ITEM_H + ITEM_GAP)}}>
						{/* Stacked on two lines: typewriter is a wide face, and on one
						    line the stamp runs off both edges of a 1080 frame. */}
						<EvidenceStamp
							text={'FOLLOWED\nEVERY RULE'}
							age={frame - VERDICT_STAMP}
							fontSize={62}
							rotate={-8}
							color="#a8331c"
						/>
					</div>
				</AbsoluteFill>
			) : null}

			{/* Lower third — newsprint, despite the photoreal footage. Keeping the
			    caption in the paper world is what stops Scene 2 reading as a
			    different film. */}
			{frame >= LOWER_THIRD_IN ? (
				<div
					style={{
						position: 'absolute',
						left: LIST_X,
						top: 1618,
						width: 880,
						background: '#efe4c8',
						padding: '22px 32px 26px',
						clipPath: tornPolygon({seed: 77, depth: 5, teeth: 16}),
						boxShadow: '0 10px 22px rgba(12,10,8,0.5)',
						opacity: interpolate(frame - LOWER_THIRD_IN, [0, 3], [0, 1], CLAMP),
					}}
				>
					<div
						style={{
							fontFamily: 'RansomAnton, sans-serif',
							fontSize: 58,
							letterSpacing: 1.5,
							color: INK,
						}}
					>
						WITNESS — NAME WITHHELD
					</div>
					<div
						style={{
							marginTop: 8,
							fontFamily: 'RansomSpecialElite, monospace',
							fontSize: 30,
							color: 'rgba(36,29,21,0.75)',
						}}
					>
						SURVIVOR, INCIDENT #0001
					</div>
					<NewsprintTexture opacity={0.16} />
				</div>
			) : null}
		</AbsoluteFill>
	);
};

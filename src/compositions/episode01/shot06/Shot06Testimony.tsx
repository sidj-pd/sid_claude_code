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
import {VoiceOver} from '../../../components/VoiceOver';
import {tornPolygon} from '../../../components/tornEdge';
import {useStopMotionStep} from '../../../components/useStopMotionStep';
import {SHOT_05_DURATION} from '../shot05/beats';
import {Shot05Graphic} from '../shot05/Shot05Graphic';
import {ChecklistItem} from './Checklist';
import {
	GLITCHES,
	ITEMS,
	LOWER_THIRD_IN,
	SLATE_IN,
	SLATE_OUT,
	TEAR_FRAMES,
	TEAR_STARTS,
	VO_A_STARTS,
	VO_B_STARTS,
	VO_Q_STARTS,
} from './beats';

const CLAMP = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const INK = '#241d15';

const LIST_X = 84;
const LIST_W = 800;
const LIST_TOP = 880;
const ITEM_H = 92;
const ITEM_GAP = 14;

/** Frames on which the picture breaks up along with the sound. */
const glitchAt = (frame: number): number => {
	const hit = GLITCHES.find((g) => frame >= g.at && frame < g.at + g.frames);
	return hit ? 1 : 0;
};

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
 * What survives the change of register is the paper: the caption and the
 * evidence checklist stay newsprint chits over photoreal video, which is what
 * ties the two halves of the episode into one piece rather than two.
 *
 * The joke is in the checklist. Every item on it is something an auto driver
 * is simply supposed to do, and each one gets written down and ticked like a
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

	const broken = glitchAt(frame);

	return (
		<AbsoluteFill style={{backgroundColor: '#0c0e11'}}>
			{/* The footage runs from frame zero, behind the paper — it is being
			    uncovered, not switched on. */}
			<AbsoluteFill
				style={{
					transform: broken ? 'translateX(-14px) scaleY(1.012)' : undefined,
					filter: broken ? 'saturate(1.5) contrast(1.2)' : undefined,
				}}
			>
				<Footage
					id="ep01-witness"
					description={`Passenger on a video call at home.\nVertical, photoreal, low-bitrate webcam look.`}
				/>
				{/* Low-bitrate video-call texture: a faint macroblock grid and a
				    cool cast, so the photoreal material reads as a compressed call
				    rather than as cinema. */}
				<AbsoluteFill
					style={{
						backgroundImage:
							'repeating-linear-gradient(0deg, rgba(0,0,0,0.05) 0 1px, transparent 1px 8px),' +
							'repeating-linear-gradient(90deg, rgba(0,0,0,0.05) 0 1px, transparent 1px 8px)',
						mixBlendMode: 'multiply',
						opacity: 0.55,
					}}
				/>
				{broken ? (
					<AbsoluteFill
						style={{
							background:
								'repeating-linear-gradient(0deg, rgba(120,190,255,0.16) 0 6px, rgba(255,90,60,0.14) 6px 14px)',
							mixBlendMode: 'screen',
						}}
					/>
				) : null}
			</AbsoluteFill>

			{/* The page from Shot 5, frozen on its last frame and torn apart. */}
			{tear < 1 ? (
				<PaperTear progress={tearProgress} at={46} lean={26} seed={9}>
					<Freeze frame={SHOT_05_DURATION - 6}>
						<Shot05Graphic silent />
					</Freeze>
				</PaperTear>
			) : null}

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
						color="#c04a34"
						style={{background: 'rgba(12,10,8,0.55)'}}
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

			{/* Lower third — newsprint, despite the photoreal footage. Keeping the
			    caption in the paper world is what stops Scene 2 reading as a
			    different film. */}
			{frame >= LOWER_THIRD_IN ? (
				<div
					style={{
						position: 'absolute',
						left: LIST_X,
						top: 1610,
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

			<VoiceOver id="ep01-shot06-q" from={VO_Q_STARTS} />
			<VoiceOver id="ep01-shot06-a" from={VO_A_STARTS} />
			{/* The dropout the script asks for: the sound goes with the picture on
			    the same frames, so it reads as the call failing rather than as an
			    effect applied to one of them. */}
			<VoiceOver id="ep01-shot06-b" from={VO_B_STARTS} volume={(f) => (glitchAt(f + VO_B_STARTS) ? 0 : 1)} />
		</AbsoluteFill>
	);
};

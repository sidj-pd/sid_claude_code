import React from 'react';
import {AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {Chyron} from '../../../components/Chyron';
import {EvidenceStamp} from '../../../components/EvidenceStamp';
import {Footage} from '../../../components/Footage';
import {NewsprintTexture} from '../../../components/NewsprintTexture';
import {SAFE_BOTTOM_Y} from '../../../components/safeArea';
import {ChecklistItem} from '../../episode01/shot06/Checklist';
import {tornPolygon} from '../../../components/tornEdge';
import {
	A1_FRAMES,
	A1_SRC_IN,
	A1_STARTS,
	A2_FRAMES,
	A2_SRC_IN,
	A2_STARTS,
	A3_FRAMES,
	A3_SRC_IN,
	A3_STARTS,
	A4_FRAMES,
	A4_SRC_IN,
	A4_STARTS,
	A5_FRAMES,
	A5_SRC_IN,
	A5_STARTS,
	A6_FRAMES,
	A6_SRC_IN,
	A6_STARTS,
	CHYRON_IN,
	CHYRON_OUT,
	FINDINGS,
	FINDINGS_HEADER_IN,
	FINDINGS_OUT,
	KICKER_IN,
	KICKER_OUT,
	KICKER_STAGGER,
	TERM_EXPANSION_IN,
	TERM_IN,
	TERM_OUT,
	WHITEBOARD_IN,
	WHITEBOARD_OUT,
} from './beats';

const CLAMP = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

const EXPERT_DESCRIPTION =
	'The expert at his office desk.\nVertical, photoreal, with its own dialogue.';

/**
 * Where the whiteboard sits in THIS footage, as a fraction of frame — not
 * Episodes 01 and 02's numbers, and not a guess: found with a grid overlay
 * on ep03-expert-6.mp4's own first frame, then five trial crops rendered at
 * full composition size and looked at.
 *
 * Two constraints fight here and 2.2x is where they balance. The source is
 * 360x640, so the composition already upscales it 3x before any push-in: at
 * 2.8x (tried first, and rendered) the board became unreadable mush, which
 * defeats the entire point of a punch-in whose job is to show that his
 * arrows connect nothing. But a gentler 1.7x leaves him centre-frame, where
 * the kicker type — right-aligned, and deliberately large — lands across his
 * face. At 2.2x about x=0.88 the board reads, and he sits far enough left
 * that only his ear is under the type.
 */
const WHITEBOARD_CROP = {x: 0.88, y: 0.26, zoom: 2.2};

/**
 * The term, named on screen the moment he names it. Sits in the clear strip
 * of ceiling and wall above his head, the one part of the frame with nothing
 * else happening in it.
 *
 * The expansion is the joke and arrives a beat after the acronym, so the
 * audience reads the initials, wonders, and is then told — rather than being
 * handed both at once.
 */
const TermCard: React.FC<{frame: number}> = ({frame}) => {
	if (frame < TERM_IN || frame >= TERM_OUT) return null;
	const termAge = frame - TERM_IN;
	const expansionAge = frame - TERM_EXPANSION_IN;
	const fadeOut = interpolate(frame, [TERM_OUT - 8, TERM_OUT], [1, 0], CLAMP);

	return (
		<div style={{position: 'absolute', left: 84, top: 96, opacity: fadeOut}}>
			<div
				style={{
					display: 'inline-block',
					background: '#efe4c8',
					padding: '18px 30px 20px',
					clipPath: tornPolygon({seed: 42, depth: 5, teeth: 14}),
					boxShadow: '0 10px 22px rgba(12,10,8,0.5)',
					position: 'relative',
					transform: `scale(${termAge < 2 ? 1.1 : 1}) rotate(-1.5deg)`,
				}}
			>
				<div
					style={{
						fontFamily: 'RansomAnton, sans-serif',
						fontSize: 58,
						letterSpacing: 1.5,
						color: '#241d15',
						whiteSpace: 'nowrap',
					}}
				>
					F.A.Q. SYNDROME
				</div>
				{expansionAge >= 0 ? (
					<div
						style={{
							marginTop: 6,
							fontFamily: 'RansomSpecialElite, monospace',
							fontSize: 24,
							color: 'rgba(36,29,21,0.75)',
							whiteSpace: 'nowrap',
							opacity: interpolate(expansionAge, [0, 3], [0, 1], CLAMP),
						}}
					>
						FULL AMOUNT, QUESTIONS-FREE
					</div>
				) : null}
				<NewsprintTexture opacity={0.16} />
			</div>
		</div>
	);
};

/** The kicker, broken into short phrases so each can take its own line. */
const KICKER_LINES = ['FRANKLY,', "WE'RE LUCKY", "HE DIDN'T OFFER", 'TO REPAINT IT', 'HIMSELF'];

/**
 * The kicker, as type rather than a caption card — the same device both
 * previous episodes' expert shots used. Sized noticeably larger than
 * Episode 02's (92/116): asked for explicitly, and this monologue's own
 * kicker clause is the shot's whole punchline after six clips of build-up,
 * so it can afford to be the biggest text in the episode.
 */
const Kicker: React.FC<{frame: number}> = ({frame}) => {
	if (frame < KICKER_IN || frame >= KICKER_OUT) return null;
	const fadeOut = interpolate(frame, [KICKER_OUT - 8, KICKER_OUT], [1, 0], CLAMP);

	return (
		<div
			style={{
				position: 'absolute',
				right: 56,
				top: 380,
				bottom: 1920 - SAFE_BOTTOM_Y + 60,
				display: 'flex',
				flexDirection: 'column',
				justifyContent: 'space-between',
				alignItems: 'flex-end',
				opacity: fadeOut,
			}}
		>
			{KICKER_LINES.map((line, i) => {
				const age = frame - (KICKER_IN + i * KICKER_STAGGER);
				if (age < 0) return <div key={line} />;
				const last = i === KICKER_LINES.length - 1;

				return (
					<div
						key={line}
						style={{
							fontFamily: 'RansomAnton, sans-serif',
							// HIMSELF lands hardest, so it is set largest.
							fontSize: last ? 148 : 112,
							lineHeight: 1,
							letterSpacing: 1,
							textAlign: 'right',
							color: '#f2e9d3',
							textShadow: [
								'0 0 10px rgba(20,14,8,0.9)',
								'2px 2px 0 #1b140d',
								'-2px 2px 0 #1b140d',
								'2px -2px 0 #1b140d',
								'-2px -2px 0 #1b140d',
							].join(', '),
							opacity: interpolate(age, [0, 3], [0, 1], CLAMP),
							transform: `translateX(${interpolate(age, [0, 4], [30, 0], CLAMP)}px)`,
						}}
					>
						{line}
					</div>
				);
			})}
		</div>
	);
};

/**
 * Shot 5 — The Expert.
 *
 * The joke is entirely in the gap between his confidence and what is true.
 * Nothing here editorialises against him — no ironic cue, no cutaway that
 * mocks him — because the confidence is funnier played straight. What
 * undercuts him is the room: the punch-in on his own whiteboard during the
 * kicker, where the arrows connecting his exhibits demonstrably connect to
 * nothing.
 */
export const Shot05Expert: React.FC = () => {
	const frame = useCurrentFrame();

	const push = interpolate(
		frame,
		[WHITEBOARD_IN, WHITEBOARD_IN + 14, WHITEBOARD_OUT - 10, WHITEBOARD_OUT],
		[0, 1, 1, 0],
		CLAMP,
	);
	const scale = interpolate(push, [0, 1], [1, WHITEBOARD_CROP.zoom]);

	// The findings list. Left column, below his face and clear of both the
	// chyron's band and the platform chrome.
	const LIST_X = 84;
	const LIST_W = 840;
	const LIST_TOP = 1010;
	const ITEM_H = 74;
	const ITEM_GAP = 8;
	const listLive = frame >= FINDINGS_HEADER_IN && frame < FINDINGS_OUT;
	const listFade = interpolate(frame, [FINDINGS_OUT - 10, FINDINGS_OUT], [1, 0], CLAMP);

	return (
		<AbsoluteFill style={{backgroundColor: '#0c0e11'}}>
			<Sequence from={A1_STARTS} durationInFrames={A1_FRAMES}>
				<Footage id="ep03-expert-1" description={EXPERT_DESCRIPTION} trimBeforeInFrames={A1_SRC_IN} />
			</Sequence>

			<Sequence from={A2_STARTS} durationInFrames={A2_FRAMES}>
				<Footage id="ep03-expert-2" description={EXPERT_DESCRIPTION} trimBeforeInFrames={A2_SRC_IN} />
			</Sequence>

			<Sequence from={A3_STARTS} durationInFrames={A3_FRAMES}>
				<Footage id="ep03-expert-3" description={EXPERT_DESCRIPTION} trimBeforeInFrames={A3_SRC_IN} />
			</Sequence>

			<Sequence from={A4_STARTS} durationInFrames={A4_FRAMES}>
				<Footage id="ep03-expert-4" description={EXPERT_DESCRIPTION} trimBeforeInFrames={A4_SRC_IN} />
			</Sequence>

			<Sequence from={A5_STARTS} durationInFrames={A5_FRAMES}>
				<Footage id="ep03-expert-5" description={EXPERT_DESCRIPTION} trimBeforeInFrames={A5_SRC_IN} />
			</Sequence>

			{/* Clip 6, with the punch-in scaled about the whiteboard rather than
			    the frame centre — otherwise the zoom would push the board off
			    the edge it sits against. */}
			<Sequence from={A6_STARTS} durationInFrames={A6_FRAMES}>
				<AbsoluteFill
					style={{
						transform: `scale(${scale})`,
						transformOrigin: `${WHITEBOARD_CROP.x * 100}% ${WHITEBOARD_CROP.y * 100}%`,
					}}
				>
					<Footage id="ep03-expert-6" description={EXPERT_DESCRIPTION} trimBeforeInFrames={A6_SRC_IN} />
				</AbsoluteFill>
			</Sequence>

			{/*
			 * All six clips carry the generator's own watermark in the same
			 * bottom-right corner as the witness footage did (Shot 4) — same
			 * fix: a soft dark fade, since that corner reads as background
			 * office wall/shadow throughout, not a hard patch. Harmless during
			 * the clip 6 punch-in too, since that crop doesn't reach this corner.
			 */}
			<AbsoluteFill
				style={{
					background:
						'radial-gradient(circle at 84% 91%, rgba(8,6,4,0.85) 0%, rgba(8,6,4,0.5) 45%, transparent 75%)',
					pointerEvents: 'none',
				}}
			/>

			{/* His claims, entered into the record as he makes them — the same
			    chit the witness's checklist uses in Shot 4, and Episode 02's
			    answer to this identical hole: nineteen seconds of talking head
			    with nothing over it. */}
			{listLive ? (
				<AbsoluteFill style={{opacity: listFade}}>
					<div style={{position: 'absolute', left: LIST_X, top: LIST_TOP - 66}}>
						<EvidenceStamp
							text="CLINICAL FINDINGS"
							age={frame - FINDINGS_HEADER_IN}
							fontSize={30}
							rotate={-1.5}
						/>
					</div>
					{FINDINGS.map((f, i) => (
						<div
							key={f.text}
							style={{position: 'absolute', left: LIST_X, top: LIST_TOP + i * (ITEM_H + ITEM_GAP)}}
						>
							<ChecklistItem
								text={f.text}
								age={frame - f.in}
								tickAge={frame - f.tick}
								width={LIST_W}
								height={ITEM_H}
								seed={70 + i * 5}
							/>
						</div>
					))}
				</AbsoluteFill>
			) : null}

			<TermCard frame={frame} />
			<Kicker frame={frame} />

			{/* A thud on each line as it lands, building to HIMSELF. */}
			{KICKER_LINES.map((line, i) => (
				<Sequence key={line} from={KICKER_IN + i * KICKER_STAGGER}>
					<Audio
						src={staticFile('sfx/stamp-thud.wav')}
						volume={i === KICKER_LINES.length - 1 ? 0.95 : 0.55}
					/>
				</Sequence>
			))}

			{/* Name, title and institution, plus the footnote that undoes them.
			    The institute is HOUSING here rather than the script's TRANSIT —
			    Episode 01 already used Transit Studies for the auto case, and a
			    housing case wants the housing branch. What survives across all
			    three episodes is the footnote, which is the part doing the work. */}
			<Chyron
				name="DR. NAGESH RAMAMURTHY"
				title={'RESIDENTIAL BEHAVIOURIST\nBANGALORE INSTITUTE OF HOUSING STUDIES*'}
				footnote="*institute unaccredited"
				frame={frame}
				in={CHYRON_IN}
				out={CHYRON_OUT}
				top={SAFE_BOTTOM_Y - 230}
				seed={53}
			/>
		</AbsoluteFill>
	);
};

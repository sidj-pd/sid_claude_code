import React from 'react';
import {
	AbsoluteFill,
	Audio,
	Sequence,
	interpolate,
	staticFile,
	useCurrentFrame,
} from 'remotion';
import {Chyron} from '../../../components/Chyron';
import {Footage} from '../../../components/Footage';
import {NewsprintTexture} from '../../../components/NewsprintTexture';
import {SAFE_BOTTOM_Y} from '../../../components/safeArea';
import {tornPolygon} from '../../../components/tornEdge';
import {
	A1_FRAMES,
	A1_STARTS,
	A2_FRAMES,
	A2_STARTS,
	A3_FRAMES,
	A3_STARTS,
	CHYRON_IN,
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
	'Dr. Ramamurthy at his office desk.\nVertical, photoreal, with its own dialogue.';

/**
 * Where the whiteboard sits in frame, as a fraction of it. Carried over from
 * Episode 01, where it was measured off the delivered clip — the Episode 02
 * prompts ask for the board in the same place for exactly this reason. Re-measure
 * against ep02-expert-3.mp4 when it lands rather than assuming it held.
 */
const WHITEBOARD_CROP = {x: 0.82, y: 0.38, zoom: 2.1};

/**
 * The term, named on screen the moment he names it. Sits in the clear strip of
 * ceiling and wall above his head, the one part of the frame with nothing else
 * happening in it.
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
					// A stamp pop rather than a fade-up.
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
					S.T.F.U. SYNDROME
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
						SUDDENLY TRANSPARENT, FAIR &amp; UNDERSTANDING
					</div>
				) : null}
				<NewsprintTexture opacity={0.16} />
			</div>
		</div>
	);
};

/** The kicker, broken into short phrases so each can take its own line. */
const KICKER_LINES = ['IF ANYTHING,', "HE'S THE ONE", 'WHO NEEDS', 'THE LEAVE', 'NOW'];

/**
 * The kicker, as type rather than a caption card.
 *
 * No newsprint chit: the line is spoken by a man on camera and fully audible,
 * not a piece of evidence being entered into the record, so it does not need
 * the paper-world packaging a caption or a term card does. Set as bold type
 * straight over the picture and kept legible by a stroke rather than a backing
 * panel, so it never dims the whiteboard beside it.
 *
 * Run down the right edge, one phrase per line, because the whole point of the
 * punch-in is the whiteboard on that side of frame — a dense block of type
 * would sit directly over the thing the shot exists to show.
 */
const Kicker: React.FC<{frame: number}> = ({frame}) => {
	if (frame < KICKER_IN || frame >= KICKER_OUT) return null;
	const fadeOut = interpolate(frame, [KICKER_OUT - 8, KICKER_OUT], [1, 0], CLAMP);

	return (
		<div
			style={{
				position: 'absolute',
				right: 56,
				top: 430,
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
							// NOW lands hardest, so it is set largest.
							fontSize: last ? 116 : 92,
							lineHeight: 1,
							letterSpacing: 1,
							textAlign: 'right',
							color: '#f2e9d3',
							// A stroke rather than a card: legible over the pale
							// whiteboard and the dark shelf alike, where one fill
							// colour could not be.
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
 * Nothing here editorialises against him — no ironic cue, no cutaway that mocks
 * him — because the confidence is funnier played straight. What undercuts him
 * is the room: the punch-in on his own whiteboard during the kicker, where the
 * arrows connecting his exhibits demonstrably connect to nothing.
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

	return (
		<AbsoluteFill style={{backgroundColor: '#0c0e11'}}>
			<Sequence from={A1_STARTS} durationInFrames={A1_FRAMES}>
				<Footage id="ep02-expert-1" description={EXPERT_DESCRIPTION} />
			</Sequence>

			<Sequence from={A2_STARTS} durationInFrames={A2_FRAMES}>
				<Footage id="ep02-expert-2" description={EXPERT_DESCRIPTION} />
			</Sequence>

			{/* Clip 3, with the punch-in scaled about the whiteboard rather than
			    about the frame centre — otherwise the zoom would push the board
			    off the edge it sits against. */}
			<Sequence from={A3_STARTS} durationInFrames={A3_FRAMES}>
				<AbsoluteFill
					style={{
						transform: `scale(${scale})`,
						transformOrigin: `${WHITEBOARD_CROP.x * 100}% ${WHITEBOARD_CROP.y * 100}%`,
					}}
				>
					<Footage id="ep02-expert-3" description={EXPERT_DESCRIPTION} />
				</AbsoluteFill>
			</Sequence>

			<TermCard frame={frame} />
			<Kicker frame={frame} />

			{/* A thud on each line as it lands, building to NOW. The script asks
			    for it, and it is the one place in this shot where the cutting has
			    a voice of its own. */}
			{KICKER_LINES.map((line, i) => (
				<Sequence key={line} from={KICKER_IN + i * KICKER_STAGGER}>
					<Audio
						src={staticFile('sfx/stamp-thud.wav')}
						volume={i === KICKER_LINES.length - 1 ? 0.95 : 0.55}
					/>
				</Sequence>
			))}

			{/* Name, title and institution, plus the footnote that undoes them.
			    He is promoted from Episode 01's URBAN MOBILITY BEHAVIOURIST to
			    ORGANIZATIONAL — same man, same unaccredited institute,
			    credentialed to whatever the week requires. */}
			<Chyron
				name="DR. NAGESH RAMAMURTHY"
				title={'ORGANIZATIONAL BEHAVIOURIST\nBANGALORE INSTITUTE OF TRANSIT STUDIES*'}
				footnote="*institute unaccredited"
				frame={frame}
				in={CHYRON_IN}
				top={SAFE_BOTTOM_Y - 230}
				seed={53}
			/>
		</AbsoluteFill>
	);
};

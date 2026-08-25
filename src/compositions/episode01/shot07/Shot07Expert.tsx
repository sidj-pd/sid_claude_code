import React from 'react';
import {
	AbsoluteFill,
	Easing,
	Freeze,
	Sequence,
	interpolate,
	useCurrentFrame,
} from 'remotion';
import {Chyron} from '../../../components/Chyron';
import {Footage} from '../../../components/Footage';
import {NewsprintTexture} from '../../../components/NewsprintTexture';
import {VoiceOver} from '../../../components/VoiceOver';
import {tornPolygon} from '../../../components/tornEdge';
import {
	A1_FRAMES,
	A1_STARTS,
	A2_FRAMES,
	A2_STARTS,
	CHYRON_IN,
	CORR_CUTAWAY_FRAMES,
	CORR_CUTAWAY_SRC_IN,
	CORR_CUTAWAY_STARTS,
	KICKER_QUOTE_IN,
	KICKER_QUOTE_OUT,
	Q_STARTS,
	WHITEBOARD_IN,
	WHITEBOARD_OUT,
	WTF_EXPANSION_IN,
	WTF_OUT,
	WTF_TERM_IN,
} from './beats';

const CLAMP = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

const EXPERT_DESCRIPTION =
	'Dr. Ramamurthy at his office desk.\nVertical, photoreal, with its own dialogue.';
const CORR_DESCRIPTION =
	'Correspondent on the other end of the call.\nVertical, photoreal, with its own dialogue.';

/**
 * Where the background whiteboard sits in frame, as a fraction of it —
 * measured directly off the delivered clip rather than guessed: the board
 * sits upper-right, roughly 70-100% across and 20-58% down, so the crop
 * centres a little inside that box to keep it from pushing past the frame's
 * right edge once scaled up.
 */
const WHITEBOARD_CROP = {x: 0.82, y: 0.38, zoom: 2.1};

/**
 * The term itself, named on screen the moment he names it — the audience
 * gets the acronym and its (nonsense) expansion at the same time he delivers
 * them, rather than having to hold the joke in their head from audio alone.
 * Sits in the clear strip of ceiling and wall above his head, the one part
 * of the frame with nothing else happening in it.
 */
const WtfCard: React.FC<{frame: number}> = ({frame}) => {
	if (frame < WTF_TERM_IN || frame >= WTF_OUT) return null;
	const termAge = frame - WTF_TERM_IN;
	const expansionAge = frame - WTF_EXPANSION_IN;
	const fadeOut = interpolate(frame, [WTF_OUT - 8, WTF_OUT], [1, 0], CLAMP);

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
					// A stamp pop rather than a fade-up: proud of the surface on
					// its first couple of frames, then settled.
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
					W.T.F. SYNDROME
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
						WILLFUL TRAFFIC-RULE FOLLOWING
					</div>
				) : null}
				<NewsprintTexture opacity={0.16} />
			</div>
		</div>
	);
};

/** The kicker, broken into short phrases so each can take its own line. */
const KICKER_LINES = ['FRANKLY,', "WE'RE LUCKY", 'HE REMEMBERED', 'HOW TO DRIVE', 'AT ALL.'];
/** Frames between one line arriving and the next — a read-down, not a pop. */
const KICKER_STAGGER = 6;

/**
 * The kicker, as text rather than a caption card — arriving once the
 * whiteboard punch-in has settled, over the one line in the shot that most
 * wants to be read as well as heard.
 *
 * No newsprint chit this time: the line is spoken by a man who is on camera
 * and fully audible, not a piece of evidence being entered into the record,
 * so it does not need the show's paper-world packaging the way a caption or
 * a term card does. Set instead as bold type straight over the picture, kept
 * legible by a stroke rather than a backing panel so it never dims the
 * whiteboard it is sitting beside.
 *
 * Run down the right edge, one phrase per line with real space between them,
 * because the whole point of the punch-in is the whiteboard on that side of
 * frame — cramming five phrases into one dense block would put a wall of
 * type directly over the thing the shot is trying to show.
 */
const KickerQuote: React.FC<{frame: number}> = ({frame}) => {
	if (frame < KICKER_QUOTE_IN || frame >= KICKER_QUOTE_OUT) return null;
	const fadeOut = interpolate(frame, [KICKER_QUOTE_OUT - 8, KICKER_QUOTE_OUT], [1, 0], CLAMP);

	return (
		<div
			style={{
				position: 'absolute',
				right: 56,
				top: 430,
				bottom: 560,
				display: 'flex',
				flexDirection: 'column',
				justifyContent: 'space-between',
				alignItems: 'flex-end',
				opacity: fadeOut,
			}}
		>
			{KICKER_LINES.map((line, i) => {
				const lineIn = KICKER_QUOTE_IN + i * KICKER_STAGGER;
				const age = frame - lineIn;
				if (age < 0) return <div key={line} />;

				return (
					<div
						key={line}
						style={{
							fontFamily: 'RansomAnton, sans-serif',
							fontSize: 66,
							lineHeight: 1,
							letterSpacing: 1,
							textAlign: 'right',
							color: '#f2e9d3',
							// A stroke rather than a card: legible over the pale
							// whiteboard and the dark shelf behind it alike, where a
							// single fill colour could not be.
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
 * Shot 7 — The Expert.
 *
 * Straight cut in from Shot 6, no transition device — the script is explicit
 * that this stays in the photoreal register, so nothing needs to re-announce
 * a change we already made once.
 *
 * The joke is entirely in the gap between his confidence and what is true.
 * Nothing here editorialises against him — no ironic music cue, no cutaway
 * that mocks him — because the confidence is funnier played straight. Two
 * things quietly undercut him instead: the correspondent's cutaway (a
 * professional just listening, no reaction either way) breaks up what would
 * otherwise be one long take of a man convincing himself, and the punch-in on
 * his own whiteboard mid-kicker, where the arrows connecting his exhibits
 * demonstrably do not connect to anything.
 */
export const Shot07Expert: React.FC = () => {
	const frame = useCurrentFrame();

	const whiteboardPush = interpolate(
		frame,
		[WHITEBOARD_IN, WHITEBOARD_IN + 14, WHITEBOARD_OUT - 10, WHITEBOARD_OUT],
		[0, 1, 1, 0],
		{...CLAMP, easing: Easing.inOut(Easing.cubic)},
	);
	const scale = interpolate(whiteboardPush, [0, 1], [1, WHITEBOARD_CROP.zoom]);

	return (
		<AbsoluteFill style={{backgroundColor: '#0c0e11'}}>
			{/* Held on him, silent, while the correspondent's question plays
			    off-screen — exactly the script's staging, so no video for that
			    line, only audio under a frame of Dr. Ramamurthy about to answer. */}
			<Sequence from={0} durationInFrames={A1_STARTS}>
				<Freeze frame={0}>
					<Footage id="ep01-expert-1" description={EXPERT_DESCRIPTION} muted />
				</Freeze>
			</Sequence>

			{/* Clip 1 — both of his first two lines, one continuous take. */}
			<Sequence from={A1_STARTS} durationInFrames={A1_FRAMES}>
				<Footage id="ep01-expert-1" description={EXPERT_DESCRIPTION} />
			</Sequence>

			{/* The correspondent, cut away to mid-answer — a few seconds reused
			    out of the middle of his own Shot 6 clip, where he is simply
			    listening rather than speaking. A real second camera on him would
			    say the same thing at ten times the cost. */}
			<Sequence from={CORR_CUTAWAY_STARTS} durationInFrames={CORR_CUTAWAY_FRAMES}>
				<Footage
					id="ep01-correspondent-q"
					description={CORR_DESCRIPTION}
					trimBeforeInFrames={CORR_CUTAWAY_SRC_IN}
				/>
			</Sequence>

			{/* Clip 2 — the last two lines, including the kicker. The whiteboard
			    punch-in is scoped to this Sequence alone. */}
			<Sequence from={A2_STARTS} durationInFrames={A2_FRAMES}>
				<AbsoluteFill
					style={{
						transform: `scale(${scale})`,
						transformOrigin: `${WHITEBOARD_CROP.x * 100}% ${WHITEBOARD_CROP.y * 100}%`,
					}}
				>
					<Footage id="ep01-expert-2" description={EXPERT_DESCRIPTION} />
				</AbsoluteFill>
			</Sequence>

			<WtfCard frame={frame} />
			<KickerQuote frame={frame} />

			<VoiceOver id="ep01-shot07-q" from={Q_STARTS} />

			{/* Name, title and institution, plus the footnote that undoes them —
			    the same device Bangalore Vox is being set up for in Shot 6, run
			    here at full strength since the script asks for it explicitly. */}
			<Chyron
				name="DR. NAGESH RAMAMURTHY"
				title={'URBAN MOBILITY BEHAVIOURIST\nBANGALORE INSTITUTE OF TRANSIT STUDIES*'}
				footnote="*institute unaccredited"
				frame={frame}
				in={CHYRON_IN}
				out={CORR_CUTAWAY_STARTS}
				top={1668}
				width={900}
				seed={88}
			/>
		</AbsoluteFill>
	);
};

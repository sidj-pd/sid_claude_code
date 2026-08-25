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
import {VoiceOver} from '../../../components/VoiceOver';
import {
	A1_FRAMES,
	A1_STARTS,
	A2_FRAMES,
	A2_STARTS,
	CHYRON_IN,
	CORR_CUTAWAY_FRAMES,
	CORR_CUTAWAY_SRC_IN,
	CORR_CUTAWAY_STARTS,
	Q_STARTS,
	WHITEBOARD_IN,
	WHITEBOARD_OUT,
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

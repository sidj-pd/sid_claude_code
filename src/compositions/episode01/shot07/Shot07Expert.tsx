import React from 'react';
import {
	AbsoluteFill,
	Easing,
	Freeze,
	Sequence,
	interpolate,
	staticFile,
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
	A3_FRAMES,
	A3_STARTS,
	A4_FRAMES,
	A4_STARTS,
	CHYRON_IN,
	Q_STARTS,
	WHITEBOARD_IN,
	WHITEBOARD_OUT,
} from './beats';

const CLAMP = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

const EXPERT_DESCRIPTION =
	'Dr. Ramamurthy at his office desk.\nVertical, photoreal, with its own dialogue.';

/**
 * Where the background whiteboard sits in frame, as a fraction of it — a
 * GUESS, because the clips do not exist yet. The visual prompt asks the
 * generated footage to include "a whiteboard with a few hand-drawn arrows"
 * behind him, so the cutaway on the kicker line is a punch-in on that
 * existing set dressing rather than a fifth clip. Once a real clip lands,
 * eyeball where the whiteboard actually is and correct this — it is the only
 * number in this shot that cannot be measured off audio.
 */
const WHITEBOARD_CROP = {x: 0.72, y: 0.28, zoom: 2.3};

/**
 * Shot 7 — The Expert.
 *
 * Straight cut in from Shot 6, no transition device — the script is explicit
 * that this stays in the photoreal register, so nothing needs to re-announce
 * a change we already made once.
 *
 * The joke is entirely in the gap between his confidence and what is true.
 * Nothing here editorialises against him — no reaction shot, no ironic
 * music cue — because the confidence is funnier played straight. The one
 * thing that undercuts him is diegetic: the punch-in on his own whiteboard
 * mid-kicker, where the arrows connecting his three exhibits demonstrably do
 * not connect to anything.
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
	const originX = WHITEBOARD_CROP.x * 100;
	const originY = WHITEBOARD_CROP.y * 100;

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

			{/* Four lines, four clips, cut together like a real interview rather
			    than held as one continuous take. The whiteboard punch-in lives
			    inside the fourth Sequence, scoped to the kicker alone. */}
			<Sequence from={A1_STARTS} durationInFrames={A1_FRAMES}>
				<Footage id="ep01-expert-1" description={EXPERT_DESCRIPTION} />
			</Sequence>
			<Sequence from={A2_STARTS} durationInFrames={A2_FRAMES}>
				<Footage id="ep01-expert-2" description={EXPERT_DESCRIPTION} />
			</Sequence>
			<Sequence from={A3_STARTS} durationInFrames={A3_FRAMES}>
				<Footage id="ep01-expert-3" description={EXPERT_DESCRIPTION} />
			</Sequence>
			<Sequence from={A4_STARTS} durationInFrames={A4_FRAMES}>
				<AbsoluteFill
					style={{
						transform: `scale(${scale})`,
						transformOrigin: `${originX}% ${originY}%`,
					}}
				>
					<Footage id="ep01-expert-4" description={EXPERT_DESCRIPTION} />
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
				top={1668}
				width={900}
				seed={88}
			/>
		</AbsoluteFill>
	);
};

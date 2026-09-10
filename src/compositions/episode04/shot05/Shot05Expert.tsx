import React from 'react';
import {AbsoluteFill, Sequence, useCurrentFrame} from 'remotion';
import {Chyron} from '../../../components/Chyron';
import {Footage} from '../../../components/Footage';
import {SAFE_BOTTOM_Y} from '../../../components/safeArea';
import {GANACHE_DEEP} from '../../../components/palette';
import {Ground} from '../Ground';
import {ChainDiagram} from './ChainDiagram';
import {
	CHYRON_IN,
	CHYRON_OUT,
	DIAGRAM_BOX_EVERY,
	DIAGRAM_FRAMES,
	DIAGRAM_IN,
	KICKER,
	KICKER_FRAMES,
	TAKE_1,
	TAKE_1_FRAMES,
	TAKE_2,
	TAKE_2_FRAMES,
	TAKE_3,
	TAKE_3_FRAMES,
	TAKE_4,
	TAKE_4_FRAMES,
} from './beats';

const TAKES: [string, number, number, string][] = [
	[
		'ep04-expert-1',
		TAKE_1,
		TAKE_1_FRAMES,
		'Dr. Ramamurthy, mid-sentence, total confidence.\n"—K.Y.C. Syndrome. Kept Your Counter open. And I want to be very\nclear: this is no longer a behavioural matter. This is chaos theory."',
	],
	[
		'ep04-expert-2',
		TAKE_2,
		TAKE_2_FRAMES,
		'The butterfly effect.\n"...Except the butterfly is a man skipping his lunch, and the\ntyphoon is a marriage in Rajajinagar."',
	],
	[
		'ep04-expert-3',
		TAKE_3,
		TAKE_3_FRAMES,
		'The system is calibrated.\n"...ninety minutes is where things are discovered."',
	],
	[
		'ep04-expert-4',
		TAKE_4,
		TAKE_4_FRAMES,
		'Deadly serious.\n"He didn\'t just serve a customer. He rearranged that man\'s life."',
	],
];

/**
 * Shot 5 — Expert Commentary.
 *
 * Four photoreal takes, then the frame goes to paper for the chain diagram,
 * then back to him for the kicker. The diagram TAKES the frame rather than
 * sitting over him: it is the argument, not an illustration of the argument,
 * and a collage diagram laid on top of a talking head reads as the latter.
 *
 * The footage does not exist yet. Footage renders a labelled placeholder in
 * its place, so this cuts and times now and the clips drop in later without
 * anything moving.
 */
export const Shot05Expert: React.FC = () => {
	const frame = useCurrentFrame();
	const onDiagram = frame >= DIAGRAM_IN && frame < DIAGRAM_IN + DIAGRAM_FRAMES;

	return (
		<AbsoluteFill style={{backgroundColor: GANACHE_DEEP}}>
			{!onDiagram
				? TAKES.map(([id, from, frames, description]) => (
						<Sequence key={id} from={from} durationInFrames={frames}>
							<Footage id={id} description={description} />
						</Sequence>
					))
				: null}

			<Sequence from={KICKER} durationInFrames={KICKER_FRAMES}>
				<Footage
					id="ep04-expert-kicker"
					description={
						'The kicker.\n"We estimate three more counters like this and the city\nstops functioning entirely."'
					}
				/>
			</Sequence>

			{onDiagram ? (
				<AbsoluteFill>
					<Ground grain={0.16} />
					<ChainDiagram from={DIAGRAM_IN} every={DIAGRAM_BOX_EVERY} />
				</AbsoluteFill>
			) : null}

			{/* His nameplate, and the footnote that undercuts it. The institute
			    is unaccredited and the line saying so is deliberately set too
			    small to read comfortably -- that is the joke, not a bug. */}
			<Chyron
				name="DR. NAGESH RAMAMURTHY, INSTITUTIONAL BEHAVIOURIST"
				title="BANGALORE INSTITUTE OF BANKING AND RELATIONSHIP MANAGEMENT (BIBRM)*"
				footnote="*institute unaccredited"
				frame={frame}
				in={CHYRON_IN}
				out={CHYRON_OUT}
				top={SAFE_BOTTOM_Y - 240}
				seed={57}
			/>
		</AbsoluteFill>
	);
};

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
	TRIM_1,
	TRIM_2,
	TRIM_3,
	TRIM_K,
} from './beats';

/** Every delivered clip has the generator's mark burnt into the bottom-right. */
const WATERMARK_CROP = 1.14;

const TAKES: {id: string; from: number; frames: number; trim: number; description: string}[] = [
	{
		id: 'ep04-expert-1',
		from: TAKE_1,
		frames: TAKE_1_FRAMES,
		trim: TRIM_1,
		description: 'K.Y.C. Syndrome. This is chaos theory.',
	},
	{
		id: 'ep04-expert-2',
		from: TAKE_2,
		frames: TAKE_2_FRAMES,
		trim: TRIM_2,
		description: 'The butterfly effect. Two segments, stitched.',
	},
	{
		id: 'ep04-expert-3',
		from: TAKE_3,
		frames: TAKE_3_FRAMES,
		trim: TRIM_3,
		description: 'Ninety minutes is where things are discovered.',
	},
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
				? TAKES.map((t) => (
						<Sequence key={t.id} from={t.from} durationInFrames={t.frames}>
							<Footage
								id={t.id}
								description={t.description}
								trimBeforeInFrames={t.trim}
								cropBottom={WATERMARK_CROP}
							/>
						</Sequence>
					))
				: null}

			<Sequence from={KICKER} durationInFrames={KICKER_FRAMES}>
				<Footage
					id="ep04-expert-kicker"
					trimBeforeInFrames={TRIM_K}
					cropBottom={WATERMARK_CROP}
					description="Three more counters like this."
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

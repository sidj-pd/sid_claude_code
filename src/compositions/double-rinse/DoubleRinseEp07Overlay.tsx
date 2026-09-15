import React from 'react';
import {AbsoluteFill, Sequence} from 'remotion';
import type {Caption} from '@remotion/captions';
import {BaselineLine, SERIES, TITLE_BOTTOM, TITLE_TOP, WHITE, YELLOW, episodeLine} from './DoubleRinseCard';
import type {LineSpec} from './DoubleRinseCard';
import data from './ep07/overlay.json';

/**
 * Double Rinse Episode 7 ("Uturn") text as a TRANSPARENT layer: the title
 * card, the dialogue captions, and the share and follow prompts over the
 * closing zoom — all in the approved series lettering from DoubleRinseCard.
 *
 * Rendered on its own (ProRes 4444 with alpha, see render.yml) and laid over
 * the episode on the phone with ffmpeg. The episode is unreleased and this
 * repo is public, so only these words come in here, never the footage.
 *
 * The episode arrived as a 720x720 square with the picture letterboxed across
 * the middle, y 158-570 (measured with cropdetect; the iron zoom ends at 562).
 * This layer is 1080x1080 — the card's own 1080-wide coordinates — and the
 * phone scales it to 720. Captions and prompts sit in the black bar under the
 * picture, y 855-1080 here, so they never cover a face or the iron and need
 * no backing to read.
 *
 * Every time lives in ep07/overlay.json, in Remotion's Caption format, measured
 * from the episode's real audio: a voice-band RMS envelope for where speech
 * starts and stops, and a transcript for the words and who says them.
 */

type SpokenCaption = Caption & {speaker: 'sid' | 'pooja'};

export type OverlayData = {
	status?: string;
	durationMs: number;
	title: {text: string; startMs: number; endMs: number};
	/**
	 * Row baselines by number of rows, in BaselineLine's coordinates (it adds
	 * its 11px Y_OFFSET). One row is centred in the bar; two share it.
	 */
	rowBaselines: {'1': number[]; '2': number[]};
	/** "\n" in a caption's text starts its second row. */
	captions: SpokenCaption[];
	prompts: {lines: string[]; startMs: number; endMs: number}[];
};

export const EP07 = data as OverlayData;

export const EP07_SIZE = 1080;
const FPS = 30;
export const EP07_OVERLAY_FRAMES = Math.ceil((EP07.durationMs / 1000) * FPS);

/** Two people in one car: each speaker keeps a colour from the series palette. */
const SPEAKER_COLOR = {sid: YELLOW, pooja: WHITE};

/** Two rows at this size, with the cast shadow, fit the 225px bar under the picture. */
const ROW_SIZE = 66;

/** Rows in the episode line's treatment: Gloria, same-colour stroke, black cast shadow. */
const rows = (text: string, color: string): LineSpec[] => {
	const lines = text.split('\n');
	const baselines = lines.length === 1 ? EP07.rowBaselines['1'] : EP07.rowBaselines['2'];
	return lines.map((line, i) => ({
		...episodeLine(line),
		size: ROW_SIZE,
		baseline: baselines[i],
		color,
	}));
};

/**
 * The title card is laid out for a 1080x1920 frame, spanning y 690-1324 of it.
 * Scaled to 85% about its own centre (1007) and moved up 461px, it lands on
 * the picture's centre (546) at 539px tall, inside the 618px picture band.
 */
const TITLE_FIT: React.CSSProperties = {
	transformOrigin: '540px 1007px',
	transform: 'translateY(-461px) scale(0.85)',
};

const toFrame = (ms: number) => Math.round((ms / 1000) * FPS);

/** Shows its children from startMs to endMs. */
const Timed: React.FC<{startMs: number; endMs: number; children: React.ReactNode}> = ({
	startMs,
	endMs,
	children,
}) => {
	const from = toFrame(startMs);
	const durationInFrames = toFrame(endMs) - from;
	if (durationInFrames <= 0) {
		return null;
	}
	return (
		<Sequence from={from} durationInFrames={durationInFrames} layout="none">
			{children}
		</Sequence>
	);
};

export const DoubleRinseEp07Overlay: React.FC = () => {
	return (
		<AbsoluteFill>
			<Timed startMs={EP07.title.startMs} endMs={EP07.title.endMs}>
				<AbsoluteFill style={TITLE_FIT}>
					<BaselineLine spec={SERIES} hidden={false} />
					<BaselineLine spec={TITLE_TOP} hidden={false} />
					<BaselineLine spec={TITLE_BOTTOM} hidden={false} />
					<BaselineLine spec={episodeLine(EP07.title.text)} hidden={false} />
				</AbsoluteFill>
			</Timed>

			{/* BaselineLine measures its text once per mount, so every row is keyed by its text */}
			{EP07.captions.map((caption) => (
				<Timed key={`${caption.startMs}-${caption.text}`} startMs={caption.startMs} endMs={caption.endMs}>
					{rows(caption.text, SPEAKER_COLOR[caption.speaker]).map((spec) => (
						<BaselineLine key={spec.text} spec={spec} hidden={false} />
					))}
				</Timed>
			))}

			{EP07.prompts.map((prompt) => (
				<Timed key={prompt.lines.join('|')} startMs={prompt.startMs} endMs={prompt.endMs}>
					{rows(prompt.lines.join('\n'), WHITE).map((spec) => (
						<BaselineLine key={spec.text} spec={spec} hidden={false} />
					))}
				</Timed>
			))}
		</AbsoluteFill>
	);
};

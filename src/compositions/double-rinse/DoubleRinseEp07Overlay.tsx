import React from 'react';
import {AbsoluteFill, Sequence} from 'remotion';
import type {Caption} from '@remotion/captions';
import {BaselineLine, WHITE, YELLOW, episodeLine} from './DoubleRinseCard';
import type {LineSpec} from './DoubleRinseCard';
import data from './ep07/overlay.json';

/**
 * Double Rinse Episode 7 ("Uturn") dialogue captions as a TRANSPARENT layer,
 * in the approved series lettering from DoubleRinseCard.
 *
 * Captions only. The title card and the share and follow prompts are
 * rendered as separate elements by DoubleRinseCard, the way Episode 6's were,
 * and the user places them in the edit.
 *
 * Rendered on its own (ProRes 4444 with alpha, see render.yml) and laid over
 * the episode on the phone with ffmpeg. The episode is unreleased and this
 * repo is public, so only these words come in here, never the footage.
 *
 * The episode arrived as a 720x720 square with the picture letterboxed across
 * the middle, y 158-570 (measured with cropdetect). This layer is 1080x1080 —
 * the card's own 1080-wide coordinates — and the phone scales it to 720.
 * Captions sit in the black bar under the picture, y 855-1080 here, so they
 * never cover a face and need no backing to read.
 *
 * Every time lives in ep07/overlay.json, in Remotion's Caption format, measured
 * from the episode's real audio: a voice-band RMS envelope for where speech
 * starts and stops, and a transcript for the words and who says them.
 */

type SpokenCaption = Caption & {speaker: 'sid' | 'pooja'};

export type OverlayData = {
	status?: string;
	durationMs: number;
	/**
	 * Row baselines by number of rows, in BaselineLine's coordinates (it adds
	 * its 11px Y_OFFSET). One row is centred in the bar; two share it.
	 */
	rowBaselines: {'1': number[]; '2': number[]};
	/** "\n" in a caption's text starts its second row. */
	captions: SpokenCaption[];
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
const rows = (caption: SpokenCaption): LineSpec[] => {
	const lines = caption.text.split('\n');
	const baselines = lines.length === 1 ? EP07.rowBaselines['1'] : EP07.rowBaselines['2'];
	return lines.map((line, i) => ({
		...episodeLine(line),
		size: ROW_SIZE,
		baseline: baselines[i],
		color: SPEAKER_COLOR[caption.speaker],
	}));
};

const toFrame = (ms: number) => Math.round((ms / 1000) * FPS);

export const DoubleRinseEp07Overlay: React.FC = () => {
	return (
		<AbsoluteFill>
			{EP07.captions.map((caption) => {
				const from = toFrame(caption.startMs);
				const durationInFrames = toFrame(caption.endMs) - from;
				if (durationInFrames <= 0) {
					return null;
				}
				return (
					<Sequence
						key={`${caption.startMs}-${caption.text}`}
						from={from}
						durationInFrames={durationInFrames}
						layout="none"
					>
						{/* BaselineLine measures its text once per mount, so every row is keyed by its text */}
						{rows(caption).map((spec) => (
							<BaselineLine key={spec.text} spec={spec} hidden={false} />
						))}
					</Sequence>
				);
			})}
		</AbsoluteFill>
	);
};

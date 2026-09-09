import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {CollageBackdrop} from '../../../components/CollageBackdrop';
import {NewsprintTexture} from '../../../components/NewsprintTexture';
import {useStopMotionStep} from '../../../components/useStopMotionStep';
import {INK, PAPER} from '../../episode01/shot05/StatBar';
import {ClutterFlatLay} from './ClutterFlatLay';
import {
	CAPTION_OUT,
	CARD_CUT,
	COUNT_LAND,
	COUNT_START,
	STEP,
	SUB_FULL,
	SUB_IN,
} from './beats';

/**
 * ---------------------------------------------------------------------------
 * THE ONLY THING TO EDIT WHEN THE EPISODE 04 SCRIPT ARRIVES.
 *
 * The mechanic is finished and timed; the words are not. Three strings and a
 * number. Everything else in this file is the reference's rhythm and should
 * not move.
 *
 * `figure` must be the number the voice actually says at the payoff, and the
 * VO take has to be cut so its stressed syllable lands on COUNT_LAND (f76).
 * That is beat rule 3 and it is the difference between this reading as a
 * designed reveal and as a caption that happens to be on screen.
 * ---------------------------------------------------------------------------
 */
const COPY = {
	/** Two lines. Up from frame 0, gone at CAPTION_OUT. */
	caption: ['CARE FOR', 'A STATISTIC?'],
	/** Counts 0 -> this. Placeholder until the script lands. */
	figure: 94,
	/** Revealed a step at a time under the figure, trailing the voice. */
	subline: ['of', 'of every'],
} as const;

/**
 * Geometry lifted from the reference as fractions of its frame and multiplied
 * up to 1080x1920, so the figure occupies the same share of the screen it
 * does there rather than a share that merely looked similar.
 *
 *   figure  width 0.80 of frame, cap-height 0.166, centre y 0.512
 *   disc    diameter 0.86 of frame width, centre (0.495, 0.520)
 *   caption centre y 0.733  -> 1408, which clears SAFE_BOTTOM_Y (1536)
 */
const FIGURE_CY = 983;
/** ArchivoBlack's caps are ~0.73 of its em, so 440 gives the 319px cap. */
const FIGURE_SIZE = 440;
const DISC_D = 929;
const DISC_CX = 535;
const DISC_CY = 998;
const CAPTION_CY = 1408;
const SUB_Y = 1240;

/**
 * Ease-out quadratic, quantised to the stop-motion step BEFORE easing.
 *
 * Quantising after would give a smooth curve sampled at whole numbers, which
 * is a different thing: the figure would sometimes hold for one frame and
 * sometimes three. Stepping the input makes every value hold for exactly
 * STEP frames, which is what makes it read as mechanical.
 */
const useCount = (frame: number, target: number): number => {
	const {steppedFrame} = useStopMotionStep(frame, STEP);
	const p = Math.min(1, Math.max(0, (steppedFrame - COUNT_START) / (COUNT_LAND - COUNT_START)));
	return Math.round(target * (1 - (1 - p) * (1 - p)));
};

export const Shot00ColdOpen: React.FC = () => {
	const frame = useCurrentFrame();
	const value = useCount(frame, COPY.figure);
	const onCard = frame >= CARD_CUT;

	return (
		<AbsoluteFill style={{background: onCard ? '#0b0906' : undefined}}>
			{/* Ground. Before the cut it is the series' paper; after, the paper
			    survives only as the disc of light the figure is standing in, so
			    the figure's relationship to its own surface never changes and
			    the cut reads as the lights going out around it. */}
			{onCard ? (
				<AbsoluteFill
					style={{
						background: `radial-gradient(circle ${DISC_D / 2}px at ${DISC_CX}px ${DISC_CY}px, ${PAPER} 0%, ${PAPER} 82%, rgba(242,233,211,0) 100%)`,
					}}
				/>
			) : (
				<CollageBackdrop chaos={0} />
			)}

			{/* The figure is UNDER the clutter: it is revealed mid-flight, not
			    faded in. Nothing about it changes across the cut. */}
			<div
				style={{
					position: 'absolute',
					left: 0,
					right: 0,
					top: FIGURE_CY - FIGURE_SIZE * 0.5,
					textAlign: 'center',
					fontFamily: 'RansomArchivoBlack, sans-serif',
					fontSize: FIGURE_SIZE,
					lineHeight: 1,
					letterSpacing: -8,
					color: INK,
				}}
			>
				{value}%
			</div>

			{frame < CARD_CUT ? <ClutterFlatLay /> : null}

			{/* Over the clutter, not under it. Hard out at CAPTION_OUT — the
			    reference does not fade this and neither do we. */}
			{frame < CAPTION_OUT ? (
				<div
					style={{
						position: 'absolute',
						left: 0,
						right: 0,
						top: CAPTION_CY - 60,
						textAlign: 'center',
						fontFamily: 'RansomBitter, serif',
						fontSize: 52,
						lineHeight: 1.15,
						letterSpacing: 1,
						color: PAPER,
						textShadow: '0 3px 0 rgba(11,9,6,0.55)',
					}}
				>
					{COPY.caption.map((line) => (
						<div key={line}>{line}</div>
					))}
				</div>
			) : null}

			{frame >= SUB_IN ? (
				<div
					style={{
						position: 'absolute',
						left: 0,
						right: 0,
						top: SUB_Y,
						textAlign: 'center',
						fontFamily: 'RansomBitter, serif',
						fontSize: 46,
						letterSpacing: 1,
						color: INK,
					}}
				>
					{frame >= SUB_FULL ? COPY.subline[1] : COPY.subline[0]}
				</div>
			) : null}

			{/* One grain pass over everything, so the figure and the props are
			    printed on the same sheet rather than composited onto it. */}
			<NewsprintTexture opacity={0.22} />
		</AbsoluteFill>
	);
};

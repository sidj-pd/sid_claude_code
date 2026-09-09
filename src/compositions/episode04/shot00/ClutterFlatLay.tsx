import React from 'react';
import {useCurrentFrame} from 'remotion';
import {CutoutAsset} from '../../../assets/cutouts';
import {PaperCutout} from '../../../components/PaperCutout';
import {useStopMotionStep} from '../../../components/useStopMotionStep';
import {CLEAR_START, STEP} from './beats';

/**
 * The city's props, laid edge to edge like a flat-lay photographed from
 * above, then taken away piece by piece.
 *
 * WHERE THIS DIFFERS FROM THE REFERENCE, AND WHY
 *
 * The reference re-lays its entire subject between frames — its props are
 * anonymous, so a wholesale rearrangement every frame reads as energy. Ours
 * are recognisable objects with a right way up, and a wholesale reshuffle of
 * an auto-rickshaw reads as a bug. So the layout is FIXED and only nudged:
 * each piece hops a few pixels and a couple of degrees on every stop-motion
 * step. Same hand-made pulse, no broken props.
 *
 * The removal is the part that is copied exactly. Pieces do not fade — they
 * are simply gone on the step, the way a hand takes something off a table
 * between two exposures.
 */

type Piece = {
	asset: CutoutAsset;
	/** Centre of the piece, in frame pixels. */
	x: number;
	y: number;
	/** Rendered width; height follows the art's own aspect. */
	w: number;
	rot: number;
};

/**
 * Deliberately over-scaled and overlapping: at frame 0 not one pixel of the
 * backdrop should be visible, or the reveal has nothing to reveal.
 */
const PIECES: Piece[] = [
	{asset: 'vidhana-soudha', x: 200, y: 170, w: 560, rot: -8},
	{asset: 'it-park-building', x: 690, y: 120, w: 500, rot: 7},
	{asset: 'wall-clock-face', x: 985, y: 255, w: 360, rot: -14},
	{asset: 'namma-metro', x: 210, y: 470, w: 600, rot: 6},
	{asset: 'newspaper-clip-ministry', x: 640, y: 445, w: 460, rot: -9},
	{asset: 'traffic-signal', x: 985, y: 565, w: 330, rot: 11},
	{asset: 'auto-rickshaw', x: 300, y: 835, w: 640, rot: -5},
	{asset: 'laptop-screen', x: 765, y: 790, w: 470, rot: 8},
	{asset: 'desk-lamp', x: 1010, y: 885, w: 360, rot: -12},
	{asset: 'cash-stack', x: 170, y: 1165, w: 460, rot: 10},
	{asset: 'masala-dosa', x: 560, y: 1185, w: 480, rot: -7},
	{asset: 'lalbagh-glass-house', x: 930, y: 1135, w: 500, rot: 5},
	{asset: 'work-barricade', x: 250, y: 1500, w: 560, rot: -6},
	{asset: 'newspaper-clip-committee', x: 660, y: 1470, w: 460, rot: 9},
	{asset: 'mg-road-signage', x: 1000, y: 1560, w: 430, rot: -11},
	{asset: 'flat-door', x: 210, y: 1810, w: 470, rot: 7},
	{asset: 'newspaper-clip-victim', x: 620, y: 1830, w: 460, rot: -8},
	{asset: 'pothole-road', x: 970, y: 1800, w: 520, rot: 5},
];

/**
 * The figure sits dead centre, so clearing from the centre outwards is what
 * lets it be glimpsed through the gaps before the ground is bare — the
 * reveal starts several steps before it finishes.
 */
const FIGURE_CX = 540;
const FIGURE_CY = 983;

const REMOVAL_ORDER = PIECES.map((p, i) => ({
	i,
	d: Math.hypot(p.x - FIGURE_CX, p.y - FIGURE_CY),
}))
	.sort((a, b) => a.d - b.d)
	.map((e) => e.i);

/** How many stop-motion steps the clearing is spread across. */
const CLEAR_STEPS = 5;

/** The step index at which each piece (by its own array index) disappears. */
const REMOVE_STEP: number[] = [];
REMOVAL_ORDER.forEach((pieceIndex, rank) => {
	REMOVE_STEP[pieceIndex] = Math.floor((rank * CLEAR_STEPS) / PIECES.length);
});

/**
 * A stable pseudo-random in [-1, 1] from two integers. Deterministic so the
 * shuffle is identical on every render pass and every worker — a Math.random
 * here would make each rendered frame disagree with its neighbours.
 */
const wobble = (a: number, b: number): number => {
	const n = Math.sin(a * 127.1 + b * 311.7) * 43758.5453;
	return (n - Math.floor(n)) * 2 - 1;
};

export const ClutterFlatLay: React.FC = () => {
	const frame = useCurrentFrame();
	const {stepIndex} = useStopMotionStep(frame, STEP);
	const clearStepIndex = Math.floor((frame - CLEAR_START) / STEP);

	return (
		<>
			{PIECES.map((p, i) => {
				if (frame >= CLEAR_START && clearStepIndex >= REMOVE_STEP[i]) return null;

				const dx = wobble(i, stepIndex) * 13;
				const dy = wobble(i + 91, stepIndex) * 13;
				const dr = wobble(i + 173, stepIndex) * 2.6;

				return (
					<div
						key={p.asset}
						style={{
							position: 'absolute',
							left: p.x - p.w / 2 + dx,
							top: p.y - p.w / 2 + dy,
							width: p.w,
							transform: `rotate(${p.rot + dr}deg)`,
						}}
					>
						<PaperCutout asset={p.asset} elevation={0.8} />
					</div>
				);
			})}
		</>
	);
};

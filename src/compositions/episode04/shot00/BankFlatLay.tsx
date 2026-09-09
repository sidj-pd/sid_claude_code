import React from 'react';
import {useCurrentFrame} from 'remotion';
import {CutoutAsset} from '../../../assets/cutouts';
import {PaperCutout} from '../../../components/PaperCutout';
import {useStopMotionStep} from '../../../components/useStopMotionStep';
import {CLEAR_EVERY, CLEAR_START, PLACE_EVERY, PLACE_START, STEP} from './beats';

/**
 * The bank, as sixteen flat-lay props laid over the man behind the counter.
 *
 * They arrive in a fixed order — the counter furniture first, then the paper,
 * then the small human debris on top — and they LEAVE from the centre
 * outwards, so the first gaps to open are the ones directly over him. That
 * ordering is the whole reveal: by the time the outer props go he has already
 * been half-visible for six or seven frames, and the last one lifting off
 * confirms something the eye has started to suspect rather than announcing
 * something new.
 *
 * Nothing fades, in either direction. A prop is absent, then it is there;
 * later it is there, then it is gone. That is what a hand does to a table
 * between two exposures, and a cross-fade would give the game away as
 * software.
 *
 * The layout is FIXED and only nudged between steps. The reference re-lays
 * its whole subject every frame, but its props are anonymous produce; ours
 * are recognisable objects with a right way up, and a wholesale reshuffle of
 * a steel almirah reads as a bug rather than as energy. Same hand-made pulse,
 * no broken props.
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
 * Order in this array is PLACEMENT order. It is not arbitrary: the counter
 * and the grille go down first because everything else needs something to sit
 * on, and the chai glass is last because it is the only thing here a person
 * put down themselves.
 *
 * Deliberately over-scaled and overlapping — by PLACE_END not one pixel of
 * the man may be showing, or the clearing has nothing to clear.
 */
const PIECES: Piece[] = [
	{asset: 'bank-grille', x: 540, y: 620, w: 980, rot: -2},
	{asset: 'steel-almirah', x: 175, y: 380, w: 470, rot: 4},
	{asset: 'notice-board', x: 830, y: 250, w: 520, rot: -6},
	{asset: 'token-display', x: 400, y: 130, w: 520, rot: 3},
	{asset: 'queue-post', x: 985, y: 780, w: 300, rot: -5},
	{asset: 'note-counter', x: 195, y: 900, w: 480, rot: -7},
	{asset: 'file-tower', x: 900, y: 1130, w: 420, rot: 6},
	{asset: 'ledger-open', x: 560, y: 1000, w: 620, rot: -4},
	{asset: 'form-pile', x: 250, y: 1290, w: 540, rot: 9},
	{asset: 'passbook-stack', x: 700, y: 1420, w: 500, rot: -8},
	{asset: 'cash-stack', x: 940, y: 1620, w: 460, rot: 5},
	{asset: 'laptop-screen', x: 300, y: 1680, w: 500, rot: -6},
	{asset: 'desk-lamp', x: 990, y: 400, w: 340, rot: 8},
	{asset: 'wall-clock-face', x: 620, y: 1780, w: 380, rot: -10},
	{asset: 'rubber-stamp', x: 480, y: 780, w: 340, rot: 12},
	{asset: 'chai-glass', x: 760, y: 870, w: 280, rot: -9},
];

/**
 * He sits centre frame, a little above the middle so the counter edge has
 * somewhere to be. Clearing radiates from here.
 */
const SUBJECT_CX = 540;
const SUBJECT_CY = 880;

/** Placement index -> rank in the removal order (nearest the subject first). */
const REMOVE_RANK: number[] = [];
PIECES.map((p, i) => ({i, d: Math.hypot(p.x - SUBJECT_CX, p.y - SUBJECT_CY)}))
	.sort((a, b) => a.d - b.d)
	.forEach((e, rank) => {
		REMOVE_RANK[e.i] = rank;
	});

/**
 * A stable pseudo-random in [-1, 1] from two integers. Deterministic so the
 * shuffle is identical on every render pass and every worker — Math.random
 * here would make each rendered frame disagree with its neighbours.
 */
const wobble = (a: number, b: number): number => {
	const n = Math.sin(a * 127.1 + b * 311.7) * 43758.5453;
	return (n - Math.floor(n)) * 2 - 1;
};

export const BankFlatLay: React.FC = () => {
	const frame = useCurrentFrame();
	const {stepIndex} = useStopMotionStep(frame, STEP);

	return (
		<>
			{PIECES.map((p, i) => {
				const placedAt = PLACE_START + i * PLACE_EVERY;
				const removedAt = CLEAR_START + REMOVE_RANK[i] * CLEAR_EVERY;
				if (frame < placedAt || frame >= removedAt) return null;

				const dx = wobble(i, stepIndex) * 11;
				const dy = wobble(i + 91, stepIndex) * 11;
				const dr = wobble(i + 173, stepIndex) * 2.2;

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

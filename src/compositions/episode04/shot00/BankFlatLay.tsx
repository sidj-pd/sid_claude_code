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
	/**
	 * Rendered size. BOTH are given, and `h` is `w` divided by the ratio
	 * MEASURED off the keyed PNG — not the ratio the prompt asked for, which
	 * the generator treats as a suggestion. Setting width alone leaves the
	 * image resolving `height: 100%` against an indefinite parent, which works
	 * until it doesn't; setting both is the pattern Episodes 01-03 use.
	 */
	w: number;
	h: number;
	rot: number;
};

/**
 * Order in this array is PLACEMENT order, and it ALTERNATES BETWEEN THE TOP
 * AND BOTTOM HALVES of the frame. The obvious order — the room, then the
 * furniture, then the paper — was built and rendered, and it fills the frame
 * strictly downwards: for the first second and a half the bottom half is bare
 * paper, which reads as a shot that has not loaded rather than one that is
 * being built. Alternating means the pile closes in on him from both ends.
 * Positions are unchanged, so the built frame is pixel-identical either way;
 * only the order of arrival differs.
 *
 * Within that, the grille and the ledger still go first because they are the
 * biggest, and the chai glass is last because it is the only thing here a
 * person put down themselves.
 *
 * The numbers are not eyeballed. `scripts/flatlay-coverage.mjs` rebuilds this
 * exact composite offline and counts how many of the man's pixels are still
 * exposed; these are the values that got that to zero, out of 393,993, with
 * 94.5% of the frame covered. Change any of them and re-run it — the shot
 * only works if the built frame hides him completely.
 *
 * It took three passes to get there, and the interesting failure was the
 * first: the grille was over his head, and 9% of him showed straight through
 * it, because the gaps between its bars are transparent BY DESIGN. A piece
 * that reads as solid is not necessarily a piece that covers anything.
 *
 * Thirteen pieces, not sixteen. `laptop-screen`, `desk-lamp` and
 * `wall-clock-face` would have been natural additions, but all three are
 * untrimmed Episode 02 art sitting on a 1200x896 canvas, and trimming them
 * now would move them inside Episode 02's shots.
 */
const PIECES: Piece[] = [
	{asset: 'bank-grille', x: 540, y: 250, w: 1160, h: 512, rot: -2},
	{asset: 'ledger-open', x: 540, y: 1200, w: 980, h: 524, rot: -4},
	{asset: 'notice-board', x: 830, y: 330, w: 680, h: 500, rot: 5},
	{asset: 'note-counter', x: 230, y: 1460, w: 580, h: 619, rot: -7},
	{asset: 'steel-almirah', x: 150, y: 700, w: 470, h: 1023, rot: 4},
	{asset: 'passbook-stack', x: 860, y: 1620, w: 650, h: 483, rot: -8},
	{asset: 'token-display', x: 470, y: 640, w: 760, h: 450, rot: 3},
	{asset: 'form-pile', x: 330, y: 1790, w: 740, h: 497, rot: 9},
	{asset: 'file-tower', x: 930, y: 820, w: 450, h: 1054, rot: 6},
	{asset: 'queue-post', x: 200, y: 240, w: 430, h: 701, rot: -5},
	{asset: 'cash-stack', x: 540, y: 935, w: 520, h: 320, rot: 10},
	{asset: 'rubber-stamp', x: 170, y: 1060, w: 460, h: 303, rot: 12},
	{asset: 'chai-glass', x: 770, y: 1085, w: 390, h: 385, rot: -9},
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
							top: p.y - p.h / 2 + dy,
							width: p.w,
							height: p.h,
							transform: `rotate(${p.rot + dr}deg)`,
						}}
					>
						{/* textureOpacity 0: PaperCutout's grain overlay is an
						    AbsoluteFill over the whole div, not the artwork's
						    silhouette, so on thirteen stacked pieces it paints
						    thirteen pale rectangles. The shot lays one grain
						    pass over the finished frame instead. */}
						<PaperCutout
							asset={p.asset}
							elevation={0.8}
							textureOpacity={0}
							style={{width: p.w, height: p.h}}
						/>
					</div>
				);
			})}
		</>
	);
};

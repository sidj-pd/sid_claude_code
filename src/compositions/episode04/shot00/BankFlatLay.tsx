import React from 'react';
import {useCurrentFrame} from 'remotion';
import {CutoutAsset} from '../../../assets/cutouts';
import {PaperCutout} from '../../../components/PaperCutout';
import {SHADOW_RGB} from '../../../components/palette';
import {useStopMotionStep} from '../../../components/useStopMotionStep';
import {
	PULL_ANTICIPATE,
	PULL_EVERY,
	PULL_EXIT,
	PULL_FRAMES,
	PULL_START,
	STEP,
} from './beats';

/**
 * The bank, as thirteen flat-lay props laid over the man behind the counter —
 * all of them present from frame 0 — and then pulled off him one at a time.
 *
 * THE PULL
 *
 * Each prop tugs two frames the WRONG way, then leaves the frame along the
 * line from him outwards, accelerating, spinning slightly as it goes. The
 * back-tug does almost nothing on its own and is the whole reason the move
 * reads as a string rather than as a deletion: something has to take hold
 * before it can haul. The exit is ease-IN, never ease-out — a pulled object
 * is fastest when it leaves, and easing out would make it look thrown and
 * then caught.
 *
 * They go from the CENTRE OUTWARDS, so the first gaps open directly over him
 * and he is half-visible for a second or more before the last prop clears.
 * The reveal confirms something the eye has already started to suspect.
 *
 * The layout is FIXED and barely nudged between steps — enough to say the
 * pile is hand-made, not enough to be a wobble. The reference re-lays its
 * whole subject every frame, but its props are anonymous produce; ours are
 * recognisable objects with a right way up, and a steel almirah that shivers
 * reads as a bug rather than as energy.
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
 * The interesting failures were both the same failure. First the grille was
 * over his head and 9% of him showed straight through it, because the gaps
 * between its bars are transparent BY DESIGN. Then the FUCO BANK nameplate was
 * added above him and 1% of IT showed through, in a 170px band between the
 * almirah's right edge and the notice board's left, where again only the
 * grille was nominally covering. A piece that reads as solid is not
 * necessarily a piece that covers anything, and the top of this frame is where
 * that keeps biting. The board moved left and the almirah widened; the check
 * is back to zero, and frame coverage went up to 96.2% as a side effect.
 *
 * Thirteen pieces, not sixteen. `laptop-screen`, `desk-lamp` and
 * `wall-clock-face` would have been natural additions, but all three are
 * untrimmed Episode 02 art sitting on a 1200x896 canvas, and trimming them
 * now would move them inside Episode 02's shots.
 */
const PIECES: Piece[] = [
	{asset: 'bank-grille', x: 540, y: 250, w: 1160, h: 512, rot: -2},
	{asset: 'ledger-open', x: 540, y: 1200, w: 980, h: 524, rot: -4},
	{asset: 'notice-board', x: 750, y: 320, w: 700, h: 515, rot: 5},
	{asset: 'note-counter', x: 230, y: 1460, w: 580, h: 619, rot: -7},
	{asset: 'steel-almirah', x: 170, y: 700, w: 520, h: 1132, rot: 4},
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

/** Array index -> rank in the pull order (nearest the subject goes first). */
const PULL_RANK: number[] = [];
PIECES.map((p, i) => ({i, d: Math.hypot(p.x - SUBJECT_CX, p.y - SUBJECT_CY)}))
	.sort((a, b) => a.d - b.d)
	.forEach((e, rank) => {
		PULL_RANK[e.i] = rank;
	});

/**
 * How far a prop travels once pulled. The frame's longest diagonal is about
 * 2200px, so this clears even a piece that starts dead centre.
 */
const TRAVEL = 2400;

/**
 * The idle shuffle, per step. This was 11px and 2.2deg and it was too much —
 * thirteen pieces all trembling at 15Hz reads as a video artefact rather than
 * as paper. At these values you can see the pile is hand-laid without being
 * able to point at anything moving.
 */
const IDLE_SHIFT = 4;
const IDLE_ROT = 0.7;

/**
 * Shadow depth, resting and fully hauled. PaperCutout scales both of its
 * stacked shadows off this, so 0.8 is a piece lying almost flat on the sheet
 * and 3.4 is one well clear of it, throwing a wide soft shadow that no longer
 * lines up underneath it. That separation is the point: the props that stay
 * put keep their tight contact shadow, so the one being pulled is the only
 * thing in frame that looks airborne.
 */
const REST_ELEVATION = 0.8;
const PULLED_ELEVATION = 3.4;

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
	const {steppedFrame, stepIndex} = useStopMotionStep(frame, STEP);

	return (
		<>
			{PIECES.map((p, i) => {
				const pullAt = PULL_START + PULL_RANK[i] * PULL_EVERY;
				const age = steppedFrame - pullAt;
				if (age >= PULL_FRAMES) return null;

				// Outward, from him rather than from the geometric centre of
				// the frame — a prop sitting on his head should leave upwards,
				// not sideways. Anything within arm's length of dead centre has
				// no meaningful outward direction of its own, so it is sent up
				// and to alternating sides instead of jittering somewhere.
				let vx = p.x - SUBJECT_CX;
				let vy = p.y - SUBJECT_CY;
				const len = Math.hypot(vx, vy);
				if (len < 140) {
					vx = i % 2 === 0 ? -0.5 : 0.5;
					vy = -1;
				} else {
					vx /= len;
					vy /= len;
				}
				const n = Math.hypot(vx, vy);
				vx /= n;
				vy /= n;

				let px = 0;
				let py = 0;
				let spin = 0;
				// Resting on the sheet. Rises as the prop is hauled off it.
				let lift = 0;

				if (age >= 0) {
					// Two frames of taking hold: the prop moves slightly the
					// wrong way, back towards him, before it goes.
					const tug = Math.min(1, (age + STEP) / PULL_ANTICIPATE);
					px = -vx * 14 * tug;
					py = -vy * 14 * tug;

					const out = (age - PULL_ANTICIPATE) / PULL_EXIT;
					if (out > 0) {
						// Ease IN. A pulled thing is fastest as it leaves.
						const e = Math.pow(out, 1.8);
						px = vx * TRAVEL * e;
						py = vy * TRAVEL * e;
						spin = (i % 2 === 0 ? -1 : 1) * 26 * e;
						// And it climbs off the sheet as it goes. Without this
						// a pulled prop slides across the ground like a decal;
						// the shadow dropping away underneath it is most of
						// what says the string is lifting rather than dragging.
						// Ease the lift LINEARLY while the travel accelerates,
						// so the shadow has opened up before the prop is moving
						// fast enough to blur past it.
						lift = out;
					}
				}

				/**
				 * The lift, sold three ways at once, because the shadow alone
				 * was not readable: the first cut of this had the shadow and
				 * nothing else and it did not survive contact with a frame
				 * containing twelve other pieces of paper.
				 *
				 *   scale   a thing nearer the camera is bigger. This is the
				 *           cue the eye actually reads, and the cheapest.
				 *   shadow   thrown DOWN-RIGHT and away, from a fixed light
				 *           top-left, so it separates from the art instead of
				 *           thickening underneath it. PaperCutout's own
				 *           elevation shadow caps out at 0.5 opacity and stays
				 *           centred, which is right for a piece resting on the
				 *           sheet and useless for one in the air, so the lifted
				 *           shadow is thrown here on the wrapper instead.
				 *   spin    already there, and does nothing on its own.
				 */
				const scale = 1 + lift * 0.22;
				const shadow = lift
					? `drop-shadow(${22 * lift}px ${30 * lift}px ${26 * lift}px rgba(${SHADOW_RGB}, ${0.42 * Math.min(1, lift * 2)}))`
					: undefined;

				const dx = wobble(i, stepIndex) * IDLE_SHIFT;
				const dy = wobble(i + 91, stepIndex) * IDLE_SHIFT;
				const dr = wobble(i + 173, stepIndex) * IDLE_ROT;

				return (
					<div
						key={p.asset}
						style={{
							position: 'absolute',
							left: p.x - p.w / 2 + dx + px,
							top: p.y - p.h / 2 + dy + py,
							width: p.w,
							height: p.h,
							transform: `rotate(${p.rot + dr + spin}deg) scale(${scale})`,
							filter: shadow,
						}}
					>
						{/* textureOpacity 0: PaperCutout's grain overlay is an
						    AbsoluteFill over the whole div, not the artwork's
						    silhouette, so on thirteen stacked pieces it paints
						    thirteen pale rectangles. The shot lays one grain
						    pass over the finished frame instead. */}
						<PaperCutout
							asset={p.asset}
							elevation={REST_ELEVATION + lift * (PULLED_ELEVATION - REST_ELEVATION)}
							textureOpacity={0}
							style={{width: p.w, height: p.h}}
						/>
					</div>
				);
			})}
		</>
	);
};

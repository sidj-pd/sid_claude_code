/**
 * Episode 04 / Beats 3 and 4 — TEAR REVEAL and WITNESS TESTIMONY.
 *
 * The stat card's frozen last frame tears away and the testimony is underneath
 * it. Shot 2 renders itself silent for this, so the frozen page is not still
 * holding audio while it is being pulled apart.
 *
 * ONE TAKE IS MISSING
 *
 * `ep04-witness-1` — "I saw the sign. I was already turning around..." — has
 * not been generated. It is the main testimony and the beat the tick-stamps
 * belong to, so it is budgeted at 13s and Footage draws a placeholder. When
 * the take exists, measure it and change WITNESS_1_FRAMES and WITNESS_1_TRIM;
 * everything after them is derived.
 *
 * `ep04-witness-2` IS delivered: 6.02s, speech 0.72 to 5.72.
 */

const S = 30;

/** The tear. Stepped like every other piece of paper in the series. */
export const TEAR_STARTS = 4;
export const TEAR_FRAMES = 28;
export const TEAR_DONE = TEAR_STARTS + TEAR_FRAMES;

/** `FOOTAGE: WITNESS TESTIMONY`, flashed before it settles into the lower third. */
export const STAMP_IN = TEAR_DONE - 6;
export const STAMP_FRAMES = 22;
export const CHYRON_IN = STAMP_IN + STAMP_FRAMES;

/** Budget — this take does not exist yet. */
export const WITNESS_1_IN = TEAR_DONE - 8;
export const WITNESS_1_TRIM = 0;
export const WITNESS_1_FRAMES = Math.round(13.0 * S);

/**
 * The evidence checklist, over the middle of his list. Each line is written
 * as he starts the item and ticked as he finishes it — writing and ticking on
 * one frame would make it a caption; the gap is what makes it a record being
 * kept. Offsets are into the budgeted take and will need moving with it.
 */
export const LIST_IN = WITNESS_1_IN + Math.round(5.6 * S);
export const LIST_EVERY = Math.round(1.5 * S);
export const TICK_AFTER = Math.round(1.0 * S);

/**
 * Clip two: a hard jump cut, no transition device. Two takes of one call, cut
 * the way testimony always is. Measured: speech 0.72 to 5.72 of 6.02.
 */
export const WITNESS_2_IN = WITNESS_1_IN + WITNESS_1_FRAMES + 4;
export const WITNESS_2_TRIM = Math.round(0.72 * S);
export const WITNESS_2_FRAMES = Math.round((5.72 - 0.72 + 0.4) * S);

/** The dropout the script asks for, on the last line. */
export const DROPOUT_AT = WITNESS_2_IN + Math.round(3.6 * S);
export const DROPOUT_FRAMES = 5;

export const EP04_SHOT_04_DURATION = WITNESS_2_IN + WITNESS_2_FRAMES + 16;

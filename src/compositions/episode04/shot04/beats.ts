/**
 * Episode 04 / Beats 3 and 4 — TEAR REVEAL and WITNESS TESTIMONY.
 *
 * The stat card's frozen last frame tears away and the testimony is underneath
 * it. Shot 2 renders itself silent for this, so the frozen page is not still
 * holding audio while it is being pulled apart.
 *
 * Both takes are delivered and everything below is measured off them.
 *
 * ep04-witness-1  10.01s, speech 0.02-9.81, five phrases:
 *
 *   0.15-2.46  "I saw the sign. I was already turning around."
 *   2.77-3.27  "That's what you do."
 *   4.13-4.68  "He called me back,"
 *   4.96-8.64  "pushed his lunch aside, no token, no come after 3:30,
 *               no sir, go to counter two."
 *   8.99-9.81  "Done in four minutes."
 *
 * ep04-witness-2   6.02s, speech 0.72-5.72.
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

/** He starts talking on frame two of his own clip, so there is nothing to trim. */
export const WITNESS_1_IN = TEAR_DONE - 8;
export const WITNESS_1_TRIM = 0;
export const WITNESS_1_FRAMES = Math.round(10.0 * S);

/**
 * The evidence checklist. Each line is written as he starts that item and
 * ticked as he finishes it — writing and ticking on one frame would make it a
 * caption, and the gap between them is what makes it a record being kept.
 *
 * The three items live inside one 3.7s phrase, so their offsets are NOT evenly
 * spaced and cannot be generated from an interval: "no token" is short, "no
 * sir, go to counter two" is not. These are where they actually fall.
 */
export const LIST_AT = [5.95, 6.55, 7.45].map((t) => WITNESS_1_IN + Math.round(t * S));
export const TICK_AFTER = Math.round(0.45 * S);

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

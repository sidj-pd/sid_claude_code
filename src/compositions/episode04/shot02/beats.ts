/**
 * Episode 04 / Shot 2 — THE STAT CARD.
 *
 * Built to the same page and the same grammar as Episode 03's stat card, beat
 * for beat: the torn header block with its EXHIBIT stamp, the ruled form lines
 * under everything, the first bar measured, the leftover DETACHING and opening
 * out into the whole of the second bar with ruled lines running from its
 * corners, the arrow tag onto what survives, the footnote and the source
 * strip. Only the palette and the copy differ.
 *
 * One thing this card has that Episode 03's does not: a second page. The
 * script's last two lines are about a window of time, and a bar cannot show a
 * window, so the bars wipe and a clock takes the page.
 *
 * Every beat below is measured off the take it belongs to. The word offsets
 * are read from the RMS envelope (scripts/measure-vo.py), not estimated:
 *
 *   ep04-shot02a       5.36s / 161f   "96%" at ~1.75s
 *   ep04-shot02b-cut   6.55s / 197f   "4%" at ~0.5s, "89%" at ~2.06s
 *   ep04-shot02c-cut   5.41s / 162f
 *   ep04-shot02d-cut   5.31s / 159f
 */

const S = 30;

/**
 * The pulse, and the same one Episode 03's card uses. Three frames, not two:
 * a page of type wants a slower step than a scatter of props does.
 */
export const STEP = 3;

export const VO_A = {frames: 161, numberAt: Math.round(1.75 * S)};
export const VO_B = {frames: 197, sliverAt: Math.round(0.5 * S), numberAt: Math.round(2.06 * S)};
export const VO_C = {frames: 162};
export const VO_D = {frames: 159};

export const HEADER_IN = 0;
export const HEADER_STAMP = 6;
export const SUBHEAD_IN = 14;

export const VO_A_STARTS = 12;
/** The bar is measured as the figure is spoken, arriving a beat ahead of it. */
export const BAR1_STARTS = VO_A_STARTS + VO_A.numberAt - 13;
export const BAR_GROW = 27;
export const NUM1_STAMP = BAR1_STARTS + BAR_GROW + 1;
export const CAP1_IN = NUM1_STAMP + 20;
export const REMAINDER1_IN = NUM1_STAMP + 30;

export const VO_B_STARTS = VO_A_STARTS + VO_A.frames - 6;
/** The leftover detaches on "of the 4%". */
export const SLIVER_MOVE = VO_B_STARTS + VO_B.sliverAt;
export const SLIVER_MOVE_FRAMES = 18;
export const CALLOUT_IN = SLIVER_MOVE + SLIVER_MOVE_FRAMES + 4;
export const BAR2_STARTS = VO_B_STARTS + VO_B.numberAt - 6;
export const BAR_2_GROW = 24;
export const NUM2_STAMP = BAR2_STARTS + BAR_2_GROW + 1;
export const CAP2_IN = NUM2_STAMP + 13;
export const REMAINDER2_IN = CAP2_IN + 22;

/** The tag onto what survives, and its footnote. */
export const TAG_STAMP = VO_B_STARTS + VO_B.frames - 34;
export const FOOTNOTE_IN = TAG_STAMP + 24;

/**
 * The page turn. A band of ground sweeps down over the bars and the clock is
 * underneath it — the series has never dissolved between two pieces of
 * evidence and this is not the place to start.
 */
export const WIPE = VO_B_STARTS + VO_B.frames + 16;
export const WIPE_FRAMES = 14;
export const CLOCK_IN = WIPE + WIPE_FRAMES;

export const HANDS_IN = CLOCK_IN + 8;
export const WEDGE_IN = HANDS_IN + 16;
export const WINDOW_STAMP = WEDGE_IN + 10;
export const VO_C_STARTS = CLOCK_IN + 20;

/** The cliffhanger, held on a frozen clock. */
export const VO_D_STARTS = VO_C_STARTS + VO_C.frames + 14;

/** Hard cut to black and silence, into the tear. */
export const BLACKOUT = VO_D_STARTS + VO_D.frames + 14;
export const EP04_SHOT_02_DURATION = BLACKOUT + 18;

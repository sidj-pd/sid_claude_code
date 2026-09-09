/**
 * Episode 04 / Shot 2 — THE STAT CARD.
 *
 * The series' fourth infographic, and the first that has to do two things: two
 * bars, and then a clock. The bars wipe and the clock takes the page, because
 * the script's last two lines are about a window of time and a bar cannot show
 * a window.
 *
 * Timings are pinned to the four measured takes, not guessed:
 *
 *   ep04-shot02a         5.36s   96% turned away
 *   ep04-shot02b-cut     6.55s   of the 4%, 89% told to come back
 *   ep04-shot02c-cut     5.41s   thirty minutes, which is also the queue
 *   ep04-shot02d-cut     5.31s   the cliffhanger, held on the clock
 *
 * Every element lands a beat BEFORE the words that describe it, so the voice
 * is reading something already on screen rather than narrating an animation.
 * That is the register the first three episodes established and it is the only
 * thing keeping the fabricated statistics feeling like a citation.
 */

const S = 30;

/** The episode's pulse. Everything steps on it. */
export const STEP = 2;

export const HEADER_IN = 6;
export const SUBHEAD_IN = 18;

/** Bar one: 96% of lunch-hour visits turned away. */
export const BAR1_STARTS = 40;
export const BAR_GROW = 22;
export const NUM1_STAMP = BAR1_STARTS + BAR_GROW - 4;
export const CAP1_IN = NUM1_STAMP + 4;
export const VO_A = 54;

/** The leftover 4% detaches and becomes the whole of bar two. */
export const SLIVER_MOVE = 208;
export const SLIVER_MOVE_FRAMES = 26;
export const BAR2_STARTS = SLIVER_MOVE + SLIVER_MOVE_FRAMES;
export const BAR_2_GROW = 22;
export const NUM2_STAMP = BAR2_STARTS + BAR_2_GROW - 4;
export const CAP2_IN = NUM2_STAMP + 4;
export const VO_B = 222;

/** The closing time, stamped under both bars as a flat fact. */
export const CLOSES_STAMP = 372;

/**
 * The bars wipe and the clock takes the page. A hard wipe rather than a fade:
 * this is a page being turned in a report, and the series has never dissolved
 * between two pieces of evidence.
 */
export const WIPE = 430;
export const WIPE_FRAMES = 14;
export const CLOCK_IN = WIPE + WIPE_FRAMES;

/** Hands drawn on, then the sliver between them lit and labelled. */
export const HANDS_IN = CLOCK_IN + 8;
export const WEDGE_IN = HANDS_IN + 16;
export const WINDOW_STAMP = WEDGE_IN + 10;
export const VO_C = CLOCK_IN + 22;

/**
 * The cliffhanger, held on a frozen clock. Nothing moves under it — the same
 * treatment ep01-shot05c, ep02-shot03c and ep03-shot02c get.
 */
export const VO_D = 660;
export const VO_D_FRAMES = 159;

/** Hard cut to black and silence, into the tear. */
export const BLACKOUT = VO_D + VO_D_FRAMES + 14;

export const EP04_SHOT_02_DURATION = BLACKOUT + 20;

export const _UNUSED_SECONDS = S;

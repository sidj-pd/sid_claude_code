/**
 * Episode 02 / Beat 2 / Shot 3 — The Stat Card.
 *
 * A hard cut out of the room and into the case file's evidence: a survey page,
 * read out. The register changes completely — no puppets, no depth, everything
 * flat on the page — which is what makes it land as a cutaway rather than as
 * more of the same scene. The twin of Episode 01's Shot 5, deliberately.
 *
 * Every constant here is an offset into an RMS envelope of the real take,
 * measured by scripts/measure-vo.py:
 *
 *   ep02-shot03a  7.08s  speech 0.28-6.50  gaps 1.31-1.70, 4.15-4.35
 *   ep02-shot03b  7.84s  speech 0.29-7.41  gaps 2.70-3.23, 3.60-3.83, 6.08-6.27
 *   ep02-shot03c  8.36s  speech 0.30-7.94  gaps 1.08-1.47, 2.20-3.00, 4.98-5.93
 *
 * The gaps are the sentence furniture, and each one is a cue:
 *   03a 1.31-1.70  after "According to our survey," -> the first bar grows
 *   03a 4.15-4.35  before "for at least 48 hours"   -> its caption lands
 *   03b 2.70-3.23  the em-dash after "approved"     -> the 11% block travels
 *   03c 2.20-3.00  after "statistically..."         -> the cliffhanger tag
 */

const S = 30; // frames per second, for reading the numbers below as seconds

export const VO_A = {frames: 212, speechIn: 8, resumesAt: Math.round(1.7 * S)};
export const VO_B = {frames: 235, speechIn: 9, numberAt: Math.round(3.23 * S)};
export const VO_C = {frames: 251, speechIn: 9, tagAt: Math.round(2.2 * S)};

export const HEADER_IN = 0;
export const HEADER_STAMP = 6;
export const SUBHEAD_IN = 14;

export const VO_A_STARTS = 12;
/** "89%" is spoken from 1.70s; the bar starts a beat under it. */
export const BAR1_STARTS = VO_A_STARTS + VO_A.resumesAt - 13;
export const BAR_GROW = 27;
export const NUM1_STAMP = BAR1_STARTS + BAR_GROW + 1;
export const CAP1_IN = NUM1_STAMP + 20;
export const REMAINDER1_IN = NUM1_STAMP + 30;

export const VO_B_STARTS = VO_A_STARTS + VO_A.frames - 6;
/**
 * The em-dash after "Of the 11% that get approved". The block detaches into
 * that silence, so the travel happens while nobody is talking over it.
 */
export const SLIVER_MOVE = VO_B_STARTS + Math.round(2.7 * S);
export const SLIVER_MOVE_FRAMES = 18;
export const CALLOUT_IN = SLIVER_MOVE + SLIVER_MOVE_FRAMES + 4;
export const BAR2_STARTS = VO_B_STARTS + VO_B.numberAt - 6;
export const BAR_2_GROW = 24;
export const NUM2_STAMP = BAR2_STARTS + BAR_2_GROW + 1;
export const CAP2_IN = NUM2_STAMP + 13;
export const REMAINDER2_IN = CAP2_IN + 22;

export const VO_C_STARTS = VO_B_STARTS + VO_B.frames + 12;
/**
 * The cliffhanger goes up as a picture during the pause after
 * "statistically...", a beat before the narrator states it as a line — the
 * same ordering Episode 01 used for THIS RIDE.
 */
export const TAG_STAMP = VO_C_STARTS + VO_C.tagAt;
export const FOOTNOTE_IN = TAG_STAMP + 24;

export const SHOT_03_DURATION = VO_C_STARTS + VO_C.frames + 22;

/** Every growth and every move quantises to this. Chunky on purpose. */
export const STEP = 3;

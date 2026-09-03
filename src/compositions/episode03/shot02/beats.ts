/**
 * Episode 03 / Shot 2 — The Stat Card.
 *
 * A hard cut out of the empty flat and into the case file's evidence: same
 * device as Episode 01's Shot 5 and Episode 02's Shot 3 — a survey page,
 * read out, no puppets, no depth, everything flat on the page. Deliberately
 * the twin of both.
 *
 * Every constant here is an offset into an RMS envelope of the real take,
 * measured by scripts/measure-vo.py:
 *
 *   ep03-shot02a  7.92s  speech 0.32-7.18  gap 1.44-1.74
 *   ep03-shot02b  6.76s  speech 0.32-6.31  gaps 1.87-2.38, 5.61-5.82
 *   ep03-shot02c  5.72s  speech 0.29-5.38  gaps 1.03-1.21, 2.15-3.21
 *
 * The gaps are the sentence furniture, and each one is a cue:
 *   02a 1.44-1.74  after "According to our survey,"      -> the first bar grows
 *   02b 1.87-2.38  the dash after "the remaining 2%,"     -> the 2% block travels
 *   02c 2.15-3.21  after "statistically..."               -> the cliffhanger tag
 *
 * (This shot's own dialogue-timing pipeline — tighten-vo.py, the attack/
 * release padding, the per-syllable cross-check — is Shot 1's fix for
 * generator dead air hurting a conversation's pace. It doesn't apply here:
 * the pauses in these three takes ARE the graphic's timing cues, exactly as
 * they were in Episodes 01 and 02's stat cards, which never ran through that
 * pipeline either. Trimming them out would remove the cue along with the
 * silence.)
 */

const S = 30; // frames per second, for reading the numbers below as seconds

export const VO_A = {frames: 238, speechIn: 10, resumesAt: Math.round(1.74 * S)};
export const VO_B = {frames: 203, speechIn: 10, numberAt: Math.round(2.38 * S)};
export const VO_C = {frames: 172, speechIn: 9, tagAt: Math.round(3.21 * S)};

export const HEADER_IN = 0;
export const HEADER_STAMP = 6;
export const SUBHEAD_IN = 14;

export const VO_A_STARTS = 12;
/** "98%" is spoken from 1.74s; the bar starts a beat under it. */
export const BAR1_STARTS = VO_A_STARTS + VO_A.resumesAt - 13;
export const BAR_GROW = 27;
export const NUM1_STAMP = BAR1_STARTS + BAR_GROW + 1;
export const CAP1_IN = NUM1_STAMP + 20;
export const REMAINDER1_IN = NUM1_STAMP + 30;

export const VO_B_STARTS = VO_A_STARTS + VO_A.frames - 6;
/**
 * The dash after "Of the remaining 2%,". The block detaches into that
 * silence, so the travel happens while nobody is talking over it.
 */
export const SLIVER_MOVE = VO_B_STARTS + Math.round(1.87 * S);
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
 * same ordering Episodes 01 and 02 used for THIS RIDE / THIS REQUEST.
 */
export const TAG_STAMP = VO_C_STARTS + VO_C.tagAt;
export const FOOTNOTE_IN = TAG_STAMP + 24;

/**
 * The page holds to the end rather than cutting to black, even though the
 * script asks Shot 2 for a hard cut. Episodes 01 and 02 hit the identical
 * conflict: the script also asks the transition after this beat to tear the
 * frozen card apart, and a card that has already been cut away from is not
 * there to be torn. The tear wins both times, and this shot ends the same
 * way — held on the frozen page, not on black.
 */
export const SHOT_02_DURATION = VO_C_STARTS + VO_C.frames + 22;

/** Every growth and every move quantises to this. Chunky on purpose. */
export const STEP = 3;

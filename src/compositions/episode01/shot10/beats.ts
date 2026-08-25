/**
 * Episode 01 / Scene 2 / Shot 10 — The Committee.
 *
 * Back into paper: the same reverse-tear device Shot 8 opened with, closing
 * over Shot 9's ending. Deliberately the shortest beat in the episode — the
 * script calls it "a punchline beat rather than a full scene" — so there is
 * one headline, one line of narration, and nothing else.
 */

const S = 30;

export const REV_STARTS = 4;
export const REV_FRAMES = 26;
export const REV_DONE = REV_STARTS + REV_FRAMES;

/** Lands as the page finishes closing, same as every headline in Shot 8. */
export const HEADLINE_LAND = REV_DONE - 8;

/** 3.88s take; speech runs 0.28-3.46s. */
export const VO_STARTS = REV_DONE + 6;
export const VO_FRAMES = Math.round(3.88 * S);

export const SHOT_10_DURATION = VO_STARTS + VO_FRAMES + 20;

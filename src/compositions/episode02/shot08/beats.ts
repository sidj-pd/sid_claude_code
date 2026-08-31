/**
 * Episode 02 / Beat 8 / Shot 8 — The Committee.
 *
 * The punchline beat, and the shortest shot in the episode. Paper closes over
 * the sign-off, one headline lands, one dry line of narration, out. The twin of
 * Episode 01's Shot 10, which ran 172 frames.
 *
 * Measured: ep02-shot08-committee.wav 3.96s, speech 0.33-3.48, one gap
 * 2.07-2.33. The line is a throwaway and the shot is built to let it be one —
 * nothing here waits for anything.
 */

const S = 30;

export const REV_STARTS = 4;
export const REV_FRAMES = 26;
export const REV_DONE = REV_STARTS + REV_FRAMES;
/** On the page as it closes, not stamped after. */
export const HEADLINE_LAND = REV_DONE - 8;

export const VO_STARTS = REV_DONE + 6;
export const VO_FRAMES = Math.round(3.96 * S);

export const SHOT_08_DURATION = VO_STARTS + VO_FRAMES + 20;

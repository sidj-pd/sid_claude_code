/**
 * Episode 02 / Beat 6 / Shot 6 — Institutional Fallout.
 *
 * The busiest transition beat in the episode, and the one that puts the series'
 * rule to work in both directions inside a single shot: paper closes over Shot
 * 5's ending (reality receding), a headline holds under narration, the same
 * paper tears back open onto the manager (reality intruding again), and once he
 * finishes it closes once more — revealing the SAME page, now with a second
 * headline landed beside the first. Nothing here is a fresh cut; every change of
 * world is a tear.
 *
 * The twin of Episode 01's Shot 8, and the joke closes the same loop: the
 * institution's response becomes a headline, and the aggrieved party's private
 * grievance becomes his own headline seconds later. They sit on one page because
 * in the story the show is telling they are the same story.
 *
 * Measured:
 *   ep02-shot06-assoc.wav  9.64s  speech 0.29-8.98, one gap 4.55-5.10
 *   ep02-manager-1.mp4     8.00s  speech 0.72-7.48
 *     0.72-3.23  This week alone, I said no worries four times.
 *     3.77-4.32  Genuinely.
 *     5.13-5.68  No worries.
 *     6.23-7.48  I don't even know who I am anymore.
 */

const S = 30;

/** Paper closes over Shot 5's last frame. */
export const REV1_STARTS = 4;
export const REV1_FRAMES = 26;
export const REV1_DONE = REV1_STARTS + REV1_FRAMES;
/** The headline is already on the page as it closes, not stamped after. */
export const HEADLINE1_LAND = REV1_DONE - 8;

/** The narration, over the closed page. */
export const VO_ASSOC_STARTS = REV1_DONE + 6;
export const VO_ASSOC_FRAMES = Math.round(9.64 * S);

/** The same sheet tears back open onto the manager. */
export const FWD_TEAR_STARTS = VO_ASSOC_STARTS + VO_ASSOC_FRAMES + 10;
export const FWD_TEAR_FRAMES = 26;
export const FWD_TEAR_DONE = FWD_TEAR_STARTS + FWD_TEAR_FRAMES;

/** His speech runs 0.72-7.48, so the lead is trimmed and the tail cut at 7.8. */
export const MANAGER_SRC_IN = Math.round(0.45 * S);
export const MANAGER_FRAMES = Math.round(7.35 * S);
export const MANAGER_CHYRON_IN = FWD_TEAR_DONE + 8;

/** And closes again, onto the same page with a second headline on it. */
export const REV2_STARTS = FWD_TEAR_DONE + MANAGER_FRAMES + 10;
export const REV2_FRAMES = 26;
export const REV2_DONE = REV2_STARTS + REV2_FRAMES;
export const HEADLINE2_STAMP = REV2_DONE + 6;

export const SHOT_06_DURATION = HEADLINE2_STAMP + 50;

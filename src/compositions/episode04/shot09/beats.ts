/**
 * Episode 04 / Shot 9 — FULL CIRCLE.
 *
 * Back to the counter, same framing as the cold open's reveal, and the one
 * thing that has changed is that he is finally eating. The sign is still
 * propped where it was. The counter is still open.
 *
 * The closing narration is the fourth of its kind and its beats are the ones
 * the take actually has, read off the RMS envelope rather than guessed.
 * ep04-shot09-final-cut runs 9.64s / 289 frames, speech from 0.15 to 9.43,
 * with five pauses of exactly 0.80s at:
 *
 *   1.67-2.47   3.57-4.37   5.64-6.44   6.86-7.66   8.43-9.23
 *
 * He pulls the lunch back inside the FIRST pause and takes the bite inside
 * the THIRD, so both physical actions land in silence and neither steps on a
 * line. Putting a move under a word is the thing that makes a closing shot
 * feel busy, and this one has to feel like nothing much happening.
 */

const S = 30;

/** The pulse. */
export const STEP = 2;

/** Held on the counter as we left it, before anything moves. */
export const HOLD = 10;

export const VO_STARTS = 14;
export const VO_FRAMES = 289;

/** He pulls the tiffin back — inside the first pause, 1.67-2.47s in. */
export const PULL_BACK = VO_STARTS + Math.round(1.8 * S);
export const PULL_BACK_FRAMES = 18;

/** The bite — inside the third pause, 5.64-6.44s in. He does not hurry. */
export const BITE = VO_STARTS + Math.round(5.8 * S);

/**
 * The freeze. Everything stops on the bite and the frame drains to grey with
 * grain coming up through it — the episode's only desaturation, and the only
 * thing in the series that says "this is the end of the file".
 */
export const FREEZE = VO_STARTS + VO_FRAMES + 8;
export const DRAIN_FRAMES = 30;

/** CASE FILE #0004 — CLOSED, then a hard cut to black. */
export const STAMP = FREEZE + 16;
export const BLACKOUT = STAMP + 34;

export const EP04_SHOT_09_DURATION = BLACKOUT + 12;

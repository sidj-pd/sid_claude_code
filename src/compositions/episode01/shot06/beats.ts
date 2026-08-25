/**
 * Episode 01 / Scene 2 / Shot 6 — Witness Testimony.
 *
 * The register changes here and the transition has to carry that. The series
 * rule from the script: a paper TEAR means reality intruding on the
 * reenactment, and is reserved for cuts to real footage; the page-flip stays
 * reserved for reenactment-to-reenactment. So Shot 6 does not cut — it opens
 * on Shot 5's page still standing and rips it apart.
 *
 * The footage carries its own dialogue, because a talking head cut to
 * synthesised speech does not lip sync. Nothing here adds audio: the sound of
 * this shot is the clip's, and the graphics are cut to it.
 */

/** Video frames per second of the composition, for reading seconds below. */
const S = 30;

/** A few frames of the intact page, so the cut into this shot is invisible. */
export const TEAR_STARTS = 4;
export const TEAR_FRAMES = 26;
export const TEAR_DONE = TEAR_STARTS + TEAR_FRAMES;
/** The stamp beat the script marks optional. Half a second, then gone. */
export const SLATE_IN = TEAR_STARTS + 16;
export const SLATE_OUT = SLATE_IN + 15;
export const LOWER_THIRD_IN = TEAR_DONE + 8;

/**
 * The clip is held on its first frame until the paper is off, then runs.
 * Otherwise his opening line plays behind the sheet that is still covering
 * him, and the shot throws away its first sentence.
 */
export const FOOTAGE_IN = TEAR_DONE;
/** 10.01s at 24fps, conformed to the composition's 30. */
export const FOOTAGE_FRAMES = 300;

/**
 * The checklist, cut to the delivery in the clip rather than to a script.
 *
 * These are measured off the clip's own RMS envelope: `in` is where an
 * utterance starts, `tick` is where it ends and the silence begins. Five
 * groups, with the boundaries the audio actually gives —
 *
 *   0.22-0.90   1.56-2.36   2.92-4.17   4.29-5.62   5.71-6.99   7.69-9.53
 *
 * — the last of which gets no tick. Under one reading it is "he followed
 * every rule" and under another it is the parallel-universe line, and a tick
 * landing on the wrong one is worse than a tick landing nowhere. So the
 * summary stamps across the finished list instead, which works either way and
 * is the better graphic regardless: five findings, then the verdict over them.
 */
const AT = (seconds: number) => FOOTAGE_IN + Math.round(seconds * S);
export const ITEMS = [
	{text: 'PUT THE METER DOWN', in: AT(0.22), tick: AT(0.9)},
	{text: 'DID NOT ASK', in: AT(1.56), tick: AT(2.36)},
	{text: 'NO HORN', in: AT(2.92), tick: AT(4.17)},
	{text: 'NOT ON THE PHONE', in: AT(4.29), tick: AT(5.62)},
	{text: 'STOPPED AT EVERY SIGNAL', in: AT(5.71), tick: AT(6.99)},
];
/** Over the whole list, on the last thing he says. */
export const VERDICT_STAMP = AT(7.85);

export const SHOT_06_DURATION = FOOTAGE_IN + FOOTAGE_FRAMES + 24;

/**
 * Episode 04 / Shot 0 — THE COLD OPEN.
 *
 * The bank builds itself on top of the man who works there, and is then taken
 * away again piece by piece until only he is left, sitting exactly where he
 * was the whole time.
 *
 * The one structural trick, and the only thing borrowed from the director's
 * reference: THE SUBJECT IS UNDER EVERYTHING FROM FRAME 0. He is never placed
 * and never fades in. The reference does this with a statistic — it starts
 * its count-up beneath the clutter so that the reveal catches the number
 * already in flight rather than starting it — and the same move on a person
 * is what turns the last prop lifting off into a punchline instead of an
 * entrance. Everything else here is ours: the props are the bank's, the
 * palette is the series', and the build half has no equivalent in the
 * reference at all.
 *
 * Three acts:
 *
 *   PLACE   f0-f78     thirteen bank props arrive one at a time, on the beat,
 *                      until not one pixel of him is showing — verified, not
 *                      assumed: see scripts/flatlay-coverage.mjs.
 *   HOLD    f78-f90    the bank, complete, with nobody visibly in it.
 *   CLEAR   f90-f116   the props leave three times as fast as they arrived,
 *                      from the centre outwards, so he is glimpsed through
 *                      the gaps several steps before the ground is bare.
 *
 * Then the lights go out around him and he is left in a disc of paper light —
 * the reference's hard cut to a spotlit card, repurposed as punctuation for
 * "everything is gone and he is still here".
 *
 * Frames are 30fps.
 */

/**
 * The stop-motion pulse. The reference's flat-lay was authored at ~18.75fps
 * and conformed to 25 — one duplicated frame in every four. At 30fps the
 * nearest honest quantisation is every 2 frames: fifteen hops a second,
 * which reads as hands moving between shutter clicks rather than as a
 * stutter. Everything stepped in this shot uses this one value, and
 * everything quantises BEFORE easing, never after.
 */
export const STEP = 2;

/**
 * A prop arrives every PLACE_EVERY frames. It must be a multiple of STEP, or
 * placements land between the stop-motion hops and the build stops reading as
 * one rhythm — at three steps a piece, thirteen pieces fill the frame in 2.4s.
 */
export const PLACE_START = 0;
export const PLACE_EVERY = 6;
/** Last piece lands on f72; this is the frame the bank is finished. */
export const PLACE_END = 78;

/** The complete bank, held. Nobody in it. */
export const HOLD_END = 90;

/**
 * The clearing. One prop a step — a third of the placing interval, so the
 * bank comes apart in 0.9s having taken 2.4s to build. Things are taken away
 * much faster than they were put down, which is the joke.
 */
export const CLEAR_START = 90;
export const CLEAR_EVERY = 2;
/** Last piece leaves on f114. */
export const CLEAR_END = 116;

/**
 * The lights. Not a fade — a cut, on the frame the last prop leaves, so the
 * two events read as one.
 */
export const SPOTLIGHT = 116;

/** A held beat on him alone before the episode proper starts. */
export const EP04_SHOT_00_DURATION = 150;

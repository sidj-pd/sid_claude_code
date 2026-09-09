/**
 * Episode 04 / Shot 0 — THE COLD OPEN.
 *
 * A new opening grammar for the series, taken from the director's reference
 * (analysed frame by frame in docs/EP04-OPENING-MECHANIC.md). Only the
 * MECHANIC is borrowed: the reference's palette, typeface, copy and subject
 * are its own and none of them appear here.
 *
 * The mechanic, in one line: a stop-motion clutter of paper props fills the
 * frame, a giant statistic is ALREADY COUNTING UP underneath it, the props
 * are removed piece by piece to reveal the count mid-flight, and the shot
 * hard-cuts to a spotlit card the instant the voice says the number.
 *
 * Four things make it work, and all four are timing, not art:
 *
 *   1. The caption is up from frame 0 and survives the silence. It leaves two
 *      frames AFTER the payoff word has started, never during the pause.
 *   2. The count runs while the voice is quiet. The ~0.6s VO gap is not dead
 *      air — the number is the dialogue for that beat.
 *   3. The count lands on the stressed syllable of the spoken figure, not on
 *      the start of the word.
 *   4. The cut lands mid-word, inside the number, not on the pause before it.
 *
 * Frames are 30fps. The reference runs at 25; every beat below is its
 * measured time in seconds x 30, so the rhythm is preserved exactly.
 */

/**
 * The stop-motion pulse. The reference's flat-lay was authored at ~18.75fps
 * and conformed to 25 (one duplicated frame in every four), so its props
 * re-lay roughly every 1.33 frames of its own timeline. At 30fps the nearest
 * honest quantisation is every 2 frames — 15 hops a second, which is also
 * the chunkiest step the series has used and reads as hands moving between
 * shutter clicks rather than as a stutter.
 *
 * Everything stepped in this shot uses this one value. Quantise BEFORE
 * easing, never after (see useStopMotionStep).
 */
export const STEP = 2;

/** The clutter is whole and re-laying in place. */
export const CLEAR_START = 40;
/** Bare ground. Props leave in STEP-sized groups across these 9 frames. */
export const CLEAR_END = 49;

/**
 * The count-up. It begins under the clutter, long before anything can see it,
 * so that the figure the reveal exposes is already most of the way home —
 * that is what makes the reveal feel like catching something in motion
 * instead of starting something.
 *
 * The reference's curve is EASE-OUT QUADRATIC over this exact span. Checked
 * against four of its measured frames and it reproduces every one:
 *
 *   f46 -> 79    f49 -> 82    f63 -> 94    f72 -> 97    f76 -> 98
 *
 * so the shape is not a guess.
 */
export const COUNT_START = 8;
export const COUNT_LAND = 76;

/** First frame at which the figure is legible through the thinning clutter. */
export const COUNT_VISIBLE = 46;

/**
 * The caption's hard out. Two frames after the voice starts the payoff
 * figure — it must not leave during the silence at CLEAR_END..COUNT_LAND,
 * which is the whole point of rule 1 above. No fade: it cuts.
 */
export const CAPTION_OUT = 64;

/**
 * The cut to the spotlit card. Mid-word, under the spoken figure, NOT on the
 * pause. The number does not move, resize or re-time across it; only the
 * ground and the light change, which is why the cut reads as a lighting
 * change rather than as a new shot.
 */
export const CARD_CUT = 72;

/** The subline arrives a word at a time, trailing the voice by ~0.2s. */
export const SUB_IN = 88;
export const SUB_FULL = 92;

/** A held beat on the finished card before the episode proper starts. */
export const EP04_SHOT_00_DURATION = 105;

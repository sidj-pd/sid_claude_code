/**
 * Episode 02 / Beat 1 / Shot 2 — The Instant Reply.
 * 206 frames @ 30fps = 6.87s.
 *
 * The punch-in that pays off Shot 1. He has just sent it; the reply arrives
 * "almost instantly, no dramatic wait", and the narration lands on top of it.
 *
 * Unlike Shot 1, every number here IS measured — off the RMS envelope of
 * public/vo/ep02-shot02.wav, whose second sentence this shot carries:
 *
 *   speech      5.55 - 10.66s in the file
 *   long pause  7.77 -  9.67s   <- 1.90s, before "without a follow-up call"
 *
 * The take put a much bigger beat on the punchline than the delivery note
 * asked for, and it is better than what was written. The shot cuts into that
 * pause rather than fighting it.
 */

const S = 30;
/** Offset into the file, in frames. 5.00s sits inside the gap between the
 *  two sentences, so Shot 1 can end and this can begin without clipping. */
export const VO_TRIM_BEFORE = 150;

/** The ping lands before the narration, not under it. */
export const PING = 6;
/** The reply itself, a beat behind the sound that announced it. */
export const REPLY_IN = 8;

/** 5.55s - "This is the story of the one that got approved..." */
export const SPEECH_IN = Math.round(5.55 * S) - VO_TRIM_BEFORE;
/** 7.77s - he stops talking. */
export const PAUSE_IN = Math.round(7.77 * S) - VO_TRIM_BEFORE;
/**
 * Cut a few frames into the silence rather than on the last word. Cutting
 * exactly as a line ends reads as the edit finishing the sentence for him.
 */
export const CUT_TO_WIDE = PAUSE_IN + 9;
/** 9.67s - "...without a follow-up call." */
export const PAUSE_OUT = Math.round(9.67 * S) - VO_TRIM_BEFORE;
/** 10.66s. */
export const SPEECH_OUT = Math.round(10.66 * S) - VO_TRIM_BEFORE;

/**
 * He breaks into a smile four frames after the narrator stops — not on the
 * punchline and not during it. The delay is the joke: he takes a moment to
 * believe it, and the line is allowed to land before his face agrees with it.
 * A hard swap between two registered poses, the way a paper puppet changes.
 */
export const SMILE_IN = SPEECH_OUT + 4;

/** Long enough after the smile to read it, and no longer. */
export const SHOT_02_DURATION = SPEECH_OUT + 56;

/**
 * Shot 1 runs 261 frames — 8.7 seconds, so nine ticks of its second hand.
 * Carrying that over stops the clock rewinding across the cut.
 */
export const CLOCK_START_TICK = 9;

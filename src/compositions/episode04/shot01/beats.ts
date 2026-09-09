/**
 * Episode 04 / Shot 1 — THE LUNCH HOUR.
 *
 * Picks up on the frame Shot 0 ends on: the banker at his counter, the OUT FOR
 * LUNCH sign propped in front of him, the tiffin open beside it. The customer
 * arrives, reads the sign, and is already turning back when he is called.
 *
 * The joke is entirely in what does NOT happen, so the shot is built around a
 * flinch that never lands. The customer's hesitation is staged and then frozen
 * — he is stopped mid-turn for a full second while the banker's line plays
 * over him, and he never completes the movement in this shot.
 *
 * Timings are pinned to the two takes, measured rather than guessed:
 *
 *   ep04-shot01-banker-cut   2.74s   "Tell me." | "This is more important."
 *   ep04-shot01-vo-cut       7.41s   the series' opening line
 *
 * Frames are 30fps.
 */

/** The same stop-motion pulse the whole episode runs on. */
export const STEP = 2;

/** Held on the reveal — him, the sign, the lunch — before anyone arrives. */
export const ROOM_HOLD = 18;

/**
 * The approach. He comes in from the foreground bottom, back to camera, in
 * stepped hops rather than a slide: six hops, one per three steps, each
 * shorter than the last so he runs out of momentum rather than braking.
 */
export const WALK_IN = 18;
export const WALK_HOPS = 6;
export const WALK_EVERY = 6;
export const WALK_END = WALK_IN + WALK_HOPS * WALK_EVERY;

/**
 * He reads the sign. A hesitation jitter — a small unresolved rock between two
 * positions, which is what a person does when they have stopped walking but
 * have not yet decided to leave.
 */
export const HESITATE = WALK_END;
export const HESITATE_END = HESITATE + 24;

/** Cut in to the banker, closer. The tiffin goes; the hand comes out. */
export const CLOSER_CUT = HESITATE_END;
export const PUSH_START = CLOSER_CUT + 8;
export const PUSH_FRAMES = 12;

/** "Tell me. This is more important." — 2.74s from the start of the push. */
export const BANKER_LINE = PUSH_START + 4;
export const BANKER_LINE_FRAMES = 82;

/** Back to the customer, frozen exactly as we left him. */
export const BACK_CUT = BANKER_LINE + BANKER_LINE_FRAMES + 6;

/**
 * The narration starts as he steps forward, which is the only movement he
 * makes after the freeze — one hop, and the shot ends before he reaches the
 * counter. 7.41s of voice-over over a held frame.
 */
export const STEP_FORWARD = BACK_CUT + 10;
export const VO_IN = STEP_FORWARD;
export const VO_FRAMES = 223;

export const EP04_SHOT_01_DURATION = VO_IN + VO_FRAMES + 18;

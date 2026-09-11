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
 *   ep04-shot01-vo-cut       6.92s   the series' opening line
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

/**
 * He clears his lunch out of the way. No cut and no push-in.
 *
 * The first version cut to a closer framing for this, and it did not read: on
 * a tight frame the tiffin leaves the edge of the shot almost at once, so
 * there is nothing to compare its new position against and the move looks like
 * a prop being removed rather than a man making room. Staying wide keeps the
 * customer, the sign and the whole counter in shot, so the lunch is seen to
 * travel ACROSS the desk and stop — which is the only thing that says he set
 * it aside FOR somebody.
 *
 * It is also slower than it was. Twelve frames read as a swipe; twenty-six
 * read as a decision.
 */
export const PUSH_START = HESITATE_END + 10;
export const PUSH_FRAMES = 26;

/** "Tell me. This is more important." — 2.74s from the start of the push. */
export const BANKER_LINE = PUSH_START + 16;
export const BANKER_LINE_FRAMES = 82;

/**
 * Nothing cuts here any more -- the customer never left frame, so there is
 * nothing to cut back TO. The beat is now the held silence after the line,
 * with him still frozen mid-turn.
 */
export const BACK_CUT = BANKER_LINE + BANKER_LINE_FRAMES + 6;

/**
 * The narration starts as he steps forward, which is the only movement he
 * makes after the freeze — one hop, and the shot ends before he reaches the
 * counter. 7.41s of voice-over over a held frame.
 */
export const STEP_FORWARD = BACK_CUT + 10;
export const VO_IN = STEP_FORWARD;
/**
 * 6.92s. The line went back to Episode 01's exact closing phrase — "the one
 * that went right" — so the series' four openings now end the same way
 * instead of each inventing its own.
 */
export const VO_FRAMES = 208;

export const EP04_SHOT_01_DURATION = VO_IN + VO_FRAMES + 18;

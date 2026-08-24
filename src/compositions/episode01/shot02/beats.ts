/**
 * Episode 01 / Scene 1 / Shot 2 — The Destination.
 * 150 frames @ 30fps (0:08–0:13, since Shot 1 now runs to 0:08).
 *
 * The passenger leans in, a bubble says WHITEFIELD, we hold on it far
 * longer than is comfortable — and then the driver simply says OK.
 *
 * The hold is doing the work. It runs well past natural so the audience
 * has time to arrive at the expected outcome (a refusal, a headshake, a
 * quoted flat fare) before the OK lands and gives them none of it. The
 * OK itself is deliberately fast: the speed is the joke, not the answer.
 */

/** The passenger settles into the lean before anything is said. */
export const LEAN_SETTLES = 14;
/** The destination bubble arrives. */
export const BUBBLE_IN = 22;
/** Dead air begins — nothing moves from here until the driver answers. */
export const HOLD_BEGINS = BUBBLE_IN + 16;
/** The driver's answer, snapping in with no hesitation beat at all. */
export const OK_IN = 95;

export const SHOT_02_DURATION = 150;

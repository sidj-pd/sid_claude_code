/**
 * Episode 01 / Scene 1 / Shot 2 — The Destination.
 * 0:08–0:12 = 120 frames @ 30fps (Shot 1 now runs to 0:08).
 *
 * The passenger leans in, a ransom-note bubble says WHITEFIELD, and then we
 * simply hold on it. No voice-over — the beat is silence and dread.
 *
 * The hold is the whole point of the shot. It runs a good beat past
 * comfortable, so the audience has time to arrive at the expected outcome
 * (a refusal) before Shot 3 undercuts it by not happening at all.
 */

/** The passenger settles into the lean before anything is said. */
export const LEAN_SETTLES = 14;
/** The bubble tears onto the page. */
export const BUBBLE_IN = 22;
/** Letters finish arriving — WHITEFIELD is 10 chars at 2-frame stagger. */
export const BUBBLE_COMPLETE = BUBBLE_IN + 24;
/**
 * Everything stops here and nothing else happens for the rest of the shot.
 * ~2.4 seconds of held frame, which is uncomfortably long on purpose.
 */
export const HOLD_BEGINS = BUBBLE_COMPLETE + 4;

export const SHOT_02_DURATION = 120;

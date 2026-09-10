/**
 * Episode 04 / Shot 7 — CORRESPONDENT PSA.
 *
 * Photoreal, direct address, news-anchor sign-off framing. The pipeline
 * generates images and voices, not video, so the take is a placeholder and its
 * length is a BUDGET — measure the real file and change one number.
 *
 * The script asks for a text overlay on the false-gravity beat, the way
 * Episode 03's PSA carries "YOU ARE NOT ALONE" over a line that does not say
 * it. Same device: the card states the reassurance the correspondent is
 * carefully not offering.
 */

const S = 30;

export const CHYRON_IN = 12;

/** "If a bank counter has served you during the lunch hour..." */
export const TAKE_FRAMES = Math.round(14.0 * S);

/** "Better safe than sorry." — the false-gravity beat, and the card over it. */
export const CARD_IN = TAKE_FRAMES - Math.round(3.2 * S);
export const CARD_FRAMES = Math.round(2.6 * S);

export const EP04_SHOT_07_DURATION = TAKE_FRAMES + 14;

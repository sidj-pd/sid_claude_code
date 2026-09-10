/**
 * Episode 04 / Shot 5 — EXPERT COMMENTARY.
 *
 * Mostly photoreal: Dr. Ramamurthy at his desk, four takes, straight cut in
 * from the witness. This pipeline generates images and voices, not video, so
 * the takes are placeholders and their lengths are BUDGETS — measure the real
 * files and change these four numbers, and everything after them follows.
 *
 * The one thing here that is ours to build is the chain diagram, which plays
 * over the last take: five boxes escalating from a four-minute transaction to
 * civilisational collapse with no logical step in between.
 */

const S = 30;

/** Lower third, up over the first take. */
export const CHYRON_IN = 14;
export const CHYRON_OUT = 190;

/** The four takes. Budgets until the footage exists. */
export const TAKE_1 = 0;
export const TAKE_1_FRAMES = Math.round(9.5 * S);
export const TAKE_2 = TAKE_1 + TAKE_1_FRAMES;
export const TAKE_2_FRAMES = Math.round(11.0 * S);
export const TAKE_3 = TAKE_2 + TAKE_2_FRAMES;
export const TAKE_3_FRAMES = Math.round(13.5 * S);
export const TAKE_4 = TAKE_3 + TAKE_3_FRAMES;
export const TAKE_4_FRAMES = Math.round(5.5 * S);

/**
 * The diagram takes the frame from the last take rather than sitting over it.
 * It is the argument, not an illustration of the argument, and a collage
 * diagram laid on top of a talking head reads as the latter.
 */
export const DIAGRAM_IN = TAKE_4 + TAKE_4_FRAMES;
export const DIAGRAM_BOX_EVERY = 24;
export const DIAGRAM_FRAMES = DIAGRAM_BOX_EVERY * 5 + 40;

/** The kicker, back on him: "three more counters like this". */
export const KICKER = DIAGRAM_IN + DIAGRAM_FRAMES;
export const KICKER_FRAMES = Math.round(6.0 * S);

export const EP04_SHOT_05_DURATION = KICKER + KICKER_FRAMES + 16;

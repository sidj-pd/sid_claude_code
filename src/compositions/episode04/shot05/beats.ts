/**
 * Episode 04 / Shot 5 — EXPERT COMMENTARY.
 *
 * Measured off the delivered takes, not budgeted. Each take trims the
 * generator's lead-in off the front and ends a beat after its last word:
 *
 *   ep04-expert-1        10.01s   speech 1.06 - 8.58
 *   ep04-expert-2        15.72s   speech 0.62 - 15.30   (two segments, stitched)
 *   ep04-expert-3        10.01s   speech 0.16 - 9.38
 *   ep04-expert-kicker    8.00s   speech 1.20 - 5.92
 *
 * TWO THINGS THE TAKES CHANGED, AND NEITHER IS WORTH RE-GENERATING FOR
 *
 * The "He rearranged that man's life" take was not made, so the diagram now
 * follows straight on from the ninety-minutes argument. It loses a beat of
 * gravity before the escalation, and the diagram supplies that gravity itself
 * by escalating — so the beat was doing work the picture already does.
 *
 * And expert-3 drops "The system is calibrated." off the front, opening on
 * "The lunch hour exists for a reason." That is a better opening: it starts
 * on a specific and lets the generalisation be inferred, rather than
 * announcing the thesis and then supporting it.
 *
 * expert-2 arrived as two overlapping segments — the first ran out mid-word
 * on "skipping" and the second restarted at "This is that". They are cut
 * together at 6.70s of the first, after "Texas." ends at 6.23 and before
 * "This" begins at 6.99, so no word is said twice. The join was verified by
 * transcribing the stitched file, not by listening for it.
 */

const S = 30;

/** Lead-in trimmed off each source. */
export const TRIM_1 = Math.round(1.06 * S);
export const TRIM_2 = Math.round(0.62 * S);
export const TRIM_3 = Math.round(0.16 * S);
export const TRIM_K = Math.round(1.2 * S);

export const CHYRON_IN = 14;

export const TAKE_1 = 0;
export const TAKE_1_FRAMES = Math.round((8.58 - 1.06 + 0.35) * S);
export const TAKE_2 = TAKE_1 + TAKE_1_FRAMES;
export const TAKE_2_FRAMES = Math.round((15.3 - 0.62 + 0.35) * S);
export const TAKE_3 = TAKE_2 + TAKE_2_FRAMES;
export const TAKE_3_FRAMES = Math.round((9.38 - 0.16 + 0.35) * S);

/** His nameplate holds over the first take and a little into the second. */
export const CHYRON_OUT = TAKE_1_FRAMES + 40;

/**
 * The diagram TAKES the frame rather than sitting over him. It is the
 * argument, not an illustration of the argument, and a collage diagram laid
 * on top of a talking head reads as the latter.
 */
export const DIAGRAM_IN = TAKE_3 + TAKE_3_FRAMES;
export const DIAGRAM_BOX_EVERY = 24;
export const DIAGRAM_FRAMES = DIAGRAM_BOX_EVERY * 5 + 40;

export const KICKER = DIAGRAM_IN + DIAGRAM_FRAMES;
export const KICKER_FRAMES = Math.round((5.92 - 1.2 + 0.4) * S);

export const EP04_SHOT_05_DURATION = KICKER + KICKER_FRAMES + 16;

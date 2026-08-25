/**
 * Episode 01 / Scene 2 / Shot 9 — Correspondent PSA.
 *
 * A tear opens on Shot 8's page (both headlines, held where that shot left
 * them) to reveal the correspondent, on screen delivering the sign-off
 * direct to camera. His clip carries its own dialogue; nothing here adds
 * narration.
 */

const S = 30;

export const TEAR_STARTS = 4;
export const TEAR_FRAMES = 26;
export const TEAR_DONE = TEAR_STARTS + TEAR_FRAMES;

/**
 * 10.01s take; speech runs 0.08-9.29s across five phrases with real pauses
 * between them (the sentence, "do not tip extra", "this may worsen the
 * condition", the report line, and the "You are not alone" kicker after a
 * beat). Trimmed a little short of the full clip for a natural tail rather
 * than keeping all of the silence past the last word.
 */
export const PSA_FRAMES = Math.round(9.6 * S);

export const SHOT_09_DURATION = TEAR_DONE + PSA_FRAMES + 20;

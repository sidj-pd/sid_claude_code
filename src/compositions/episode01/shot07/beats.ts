/**
 * Episode 01 / Scene 2 / Shot 7 — The Expert.
 *
 * A straight cut, not a tear: the script is explicit that this stays in the
 * photoreal "real interview" register with no transition device. We are
 * already on the other side of the tear from Shot 6, so nothing needs to
 * announce that again.
 *
 * Dr. Ramamurthy's four lines carry his own dialogue, generated with the
 * clips per the pipeline rule established in Shot 6 — a talking head cut to
 * synthesised speech does not lip sync. The correspondent's question ahead of
 * them is the one line that stays off-screen, exactly as the script has it,
 * so it is TTS under a hold on Dr. Ramamurthy rather than its own clip.
 *
 * TIMING BELOW IS ESTIMATED, not measured — the four clips do not exist yet.
 * It is built the same way Shot 5's was before its voice-over existed: from
 * the ~0.17s/syllable rate every clip in this episode has held to so far
 * (measured across the witness's six lines and the correspondent's two).
 * Once the real clips land, re-measure each one's RMS envelope exactly as
 * shot06/beats.ts does, and correct the four DUR_* constants below — nothing
 * else in this file needs to change shape.
 */

const S = 30;
/** The rate every clip in this episode has held to within a few percent. */
const SEC_PER_SYLLABLE = 0.17;
const estimate = (syllables: number, padSec = 0.7) => syllables * SEC_PER_SYLLABLE + padSec;

/** "How do you explain what happened?" — measured, not estimated: 2.20s take. */
export const Q_STARTS = 6;
export const Q_FRAMES = Math.round(2.2 * S);
/** A short hold on Dr. Ramamurthy, silent, before he starts — a real beat
 *  answering the question, not an instant reply. */
export const A1_STARTS = Q_STARTS + Q_FRAMES + Math.round(0.6 * S);

/**
 * Four lines, each its own clip — cut together the way a real interview is,
 * not held as one continuous take. Syllable counts below are a plain count
 * off the transcript in public/footage/README.md.
 */
const DUR_1 = estimate(26); // "...textbook case of W.T.F. Syndrome — Willful Traffic-rule Following."
const DUR_2 = estimate(24); // "Under extreme cognitive load... the brain sometimes overcorrects."
const DUR_3 = estimate(20); // "He didn't choose to follow the rules... forgot how to break them."
const DUR_4 = estimate(14, 0.9); // "Frankly, we're lucky he remembered how to drive at all." — the kicker gets an extra beat to land before the cut.

export const A1_FRAMES = Math.round(DUR_1 * S);
export const A2_STARTS = A1_STARTS + A1_FRAMES;
export const A2_FRAMES = Math.round(DUR_2 * S);
export const A3_STARTS = A2_STARTS + A2_FRAMES;
export const A3_FRAMES = Math.round(DUR_3 * S);
export const A4_STARTS = A3_STARTS + A3_FRAMES;
export const A4_FRAMES = Math.round(DUR_4 * S);

/** His chyron: name, title, and the footnote gag — barely legible on purpose. */
export const CHYRON_IN = A1_STARTS + 10;

/**
 * The whiteboard cutaway, on the kicker line. Rather than a fifth clip, this
 * punches into the whiteboard the visual prompt already asks the generated
 * footage to include as set dressing behind him ("a whiteboard with a few
 * hand-drawn arrows on it") — a camera move on the existing frame, not a new
 * asset. WHITEBOARD_CROP in Shot07Expert.tsx will want adjusting by eye once
 * the real clip shows exactly where that whiteboard sits in frame.
 */
export const WHITEBOARD_IN = A4_STARTS + 6;
export const WHITEBOARD_OUT = A4_STARTS + A4_FRAMES - 10;

export const SHOT_07_DURATION = A4_STARTS + A4_FRAMES + 20;

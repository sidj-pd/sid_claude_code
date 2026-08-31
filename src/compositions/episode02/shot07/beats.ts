/**
 * Episode 02 / Beat 7 / Shot 7 — The Sign-off.
 *
 * The correspondent's only appearance. He has been off screen all episode,
 * asking one question in Shot 4, and the same man from Episode 01's PSA returns
 * to close this one — same jacket, same headphones, same shelf.
 *
 * Straight cut in from Shot 6's closing page, no transition device: the tear is
 * reserved for crossings between the paper world and the real one, and Shot 6
 * already ended on paper. Cutting to him is a cut within Scene 2.
 *
 * Measured: ep02-correspondent-psa.mp4 10.01s, speech 0.54-9.17, four gaps that
 * fall between all five of his sentences:
 *
 *   0.54-4.27  If your manager has approved a request without a follow-up call
 *              or said no worries and meant it,
 *   4.62-5.24  do not panic.
 *   5.61-6.81  This is likely a mild case.
 *   7.00-8.19  Monitor for further symptoms.
 *   8.61-9.17  You are not alone.
 *
 * The first segment holds two conditions with no silence between them, so it is
 * subdivided by syllable count: 27 syllables over 3.73s is 0.138 s/syllable, and
 * the first condition ends 19 syllables in at 3.16s.
 */

const S = 30;

export const CLIP_FRAMES = Math.round(10.01 * S);
/** His lead-in is 0.54s; trimming it would clip the first word. */
export const SRC_IN = Math.round(0.3 * S);

const AT = (seconds: number) => Math.round(seconds * S) - SRC_IN;

/** The advisory notice, cut to the sentence it belongs to. */
export const ADVISORY_IN = AT(0.35);

/**
 * The two conditions, as tick-box chits — the viewer ticking their own
 * experience, which is the same device the witness's checklist and the expert's
 * clinical findings use. Three photoreal shots, one vocabulary.
 */
export const CONDITIONS = [
	{text: 'APPROVED WITHOUT A FOLLOW-UP CALL', in: AT(0.6), tick: AT(3.16)},
	{text: 'SAID "NO WORRIES" AND MEANT IT', in: AT(3.16), tick: AT(4.27)},
];

/**
 * The instructions. Stamped lines rather than chits: a chit is a record of
 * something that happened, and these are being told to you.
 */
export const INSTRUCTIONS = [
	{text: 'DO NOT PANIC', at: AT(4.62)},
	{text: 'LIKELY A MILD CASE', at: AT(5.61)},
	{text: 'MONITOR FOR FURTHER SYMPTOMS', at: AT(7.0)},
];

/** The closer, larger, and the last thing in the beat. */
export const CLOSER_IN = AT(8.61);

export const SHOT_07_DURATION = CLIP_FRAMES - SRC_IN + 24;

/**
 * Episode 03 / Shot 7 — The Sign-off.
 *
 * The correspondent's only appearance in this episode, and the same man who
 * closed the previous two — same jacket, same headphones, same shelf.
 *
 * Straight cut in from Shot 6's closing page, no transition device: the tear
 * is reserved for crossings between the paper world and the real one, and
 * Shot 6 already ended on paper, so cutting to him is a cut within Scene 2.
 *
 * ONE clip, not the two the prompts asked for — the delivered take carries
 * the whole advisory in a single continuous read.
 *
 * Measured: ep03-correspondent-psa.mp4 10.01s, speech 0.04-9.47, five gaps
 * that fall between all six of his clauses:
 *
 *   0.04-2.19  If your landlord has returned your deposit in full,
 *   2.58-3.44  without inspection,
 *   3.91-4.69  without deduction,
 *   5.07-5.72  do not panic.
 *   6.09-7.54  Keep your rehearsed speech somewhere safe.
 *   8.32-9.47  You may need it for the next one.
 *
 * Every cue below is one of those boundaries. No syllable subdivision was
 * needed for once: the take pauses between every clause the script punctuates.
 *
 * "YOU ARE NOT ALONE" is NOT in this take. In Episode 02 he said it; here the
 * generated performance stopped a line short, so it lands as a card in the
 * silence after he finishes instead — which is the better version of that
 * beat anyway. The script marks it as a pause with false gravity, and an
 * unspoken title holding on a man who has stopped talking is exactly that.
 */

const S = 30;

export const CLIP_FRAMES = Math.round(10.01 * S);
/** Speech starts at 0.04s. There is nothing to trim. */
export const SRC_IN = 0;

const AT = (seconds: number) => Math.round(seconds * S) - SRC_IN;

/** The advisory notice, up as he starts. */
export const ADVISORY_IN = AT(0.2);

/**
 * His three conditions, as tick-box chits — the viewer ticking their own
 * experience, the same device the witness's checklist and the expert's
 * clinical findings use. Three photoreal shots, one vocabulary.
 */
export const CONDITIONS = [
	{text: 'RETURNED IN FULL', in: AT(0.15), tick: AT(2.19)},
	{text: 'NO INSPECTION', in: AT(2.58), tick: AT(3.44)},
	{text: 'NO DEDUCTION', in: AT(3.91), tick: AT(4.69)},
];

/**
 * The instructions. Stamped lines rather than chits: a chit is a record of
 * something that happened, and these are being told to you.
 */
export const INSTRUCTIONS = [
	{text: 'DO NOT PANIC', at: AT(5.07)},
	{text: 'KEEP YOUR SPEECH SOMEWHERE SAFE', at: AT(6.09)},
	{text: 'YOU MAY NEED IT FOR THE NEXT ONE', at: AT(8.32)},
];

/** The closer, larger, landing in the silence after his last word at 9.47. */
export const CLOSER_IN = AT(9.7);

/**
 * The clip runs out before the closer has had its beat, so the last frame is
 * held behind it. A card that says YOU ARE NOT ALONE wants to sit.
 */
export const SHOT_07_DURATION = CLOSER_IN + 72;

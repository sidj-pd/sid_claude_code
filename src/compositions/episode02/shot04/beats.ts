/**
 * Episode 02 / Beats 3-4 / Shot 4 — Tear Reveal + Witness Testimony.
 *
 * The stat card does not cut away, it gets torn in half and pulled off the
 * frame. Per the series rule, a tear is reality intruding on the reenactment
 * and is reserved for cuts to real footage, so the audience is told what kind
 * of thing is coming before their eye resolves it.
 *
 * One difference from Episode 01's Shot 6: the correspondent is OFF SCREEN
 * here. The script gives him a single line from off camera, so it is a TTS
 * take (ep02-shot04-q) laid over the witness already sitting there, rather
 * than a second clip of him on a call. One camera, not two.
 *
 * Both clips have landed and both are measured.
 *
 *   ep02-witness-1.mp4  10.01s  speech 0.16-9.62
 *   gaps  2.04-2.47  3.37-3.57  5.18-5.59  8.72-8.90  9.13-9.31
 *
 *   ep02-witness-2.mp4   8.00s  speech 0.86-6.65
 *   gaps  2.22-3.02  4.57-5.52   -> the beats between his three sentences
 *     0.86-2.22  he even said don't check Teams
 *     3.02-4.57  I've never not checked Teams on leave
 *     5.52-6.65  I didn't know what to do with myself
 *
 * The gaps are the sentence boundaries:
 *   0.16-2.04  "I sent the request at 11:47 PM."
 *   2.47-3.37  "Expecting silence."
 *   3.57-5.18  "Maybe a reply Monday, if I was lucky."
 *   5.59-8.72  the three findings, in one breath
 *   8.90-9.62  "Just... approved."  (the ellipsis is gaps 4 and 5)
 *
 * The 5.59-8.72 segment holds all three checklist items with no silence to
 * anchor them to, so it is subdivided by syllable count: 19 syllables over
 * 3.13s is 0.165 s/syllable, and the resulting boundary lands on the measured
 * gap at 8.72 to within a hundredth of a second. That is the same
 * cross-check §8 uses to identify what is being said in a segment you cannot
 * otherwise resolve.
 */

const S = 30;

/** A few frames of the intact page, so the cut into this shot is invisible. */
export const TEAR_STARTS = 4;
export const TEAR_FRAMES = 26;
export const TEAR_DONE = TEAR_STARTS + TEAR_FRAMES;

/** The stamp beat the script marks optional. Half a second, then gone. */
export const SLATE_IN = TEAR_STARTS + 16;
export const SLATE_OUT = SLATE_IN + 15;

/** Measured: ep02-shot04-q runs 2.20s, speech 0.29-1.82, no internal gaps. */
export const CORR_Q_IN = TEAR_DONE;
export const CORR_Q_ENDS = CORR_Q_IN + Math.round(1.82 * S);
/** Half a second after the question, which reads as it landing, not as an edit. */
export const WITNESS_ANSWERS = CORR_Q_ENDS + 15;

/**
 * Two clips, not one. The script gives his answer two beats with a real pause
 * between them — the list, then his eyes drifting before the Teams line — and
 * a jump cut between takes is the native grammar of cut testimony anyway.
 *
 * Clip one measured at 10.01s, not the 6.2s that was guessed for it. The take
 * is slower than the estimate and the shot got longer, which is the rule
 * working: a line that does not fit means a longer shot, never a faster take.
 */
export const WITNESS_1_FRAMES = Math.round(10.01 * S);
export const WITNESS_2_IN = WITNESS_ANSWERS + WITNESS_1_FRAMES;
/**
 * The clip runs 8.00s but he stops at 6.65 and the last tick lands at 6.9,
 * so it is cut at 7.5 - the remaining second of him sitting is the take's
 * tail, not a beat this shot has any use for.
 */
export const WITNESS_2_FRAMES = Math.round(7.5 * S);

/** Offsets into clip one. */
const AT = (seconds: number) => WITNESS_ANSWERS + Math.round(seconds * S);
/** Offsets into clip two. */
const AT2 = (seconds: number) => WITNESS_2_IN + Math.round(seconds * S);

/**
 * The checklist, and the joke. Every item is something a manager is simply
 * supposed to do. Each gets written down and ticked like a finding, and
 * nothing he describes is remarkable — the list is damning anyway.
 *
 * `in` is where the line is written, `tick` where it is ticked. Writing and
 * ticking on the same frame would make the graphic a caption; the gap between
 * them is what makes it a record being kept.
 */
export const ITEMS = [
	// Measured off clip one: each box arrives as he starts the clause and is
	// ticked as he finishes it.
	{text: 'REPLIED IN UNDER 1 MINUTE', in: AT(5.59), tick: AT(7.07)},
	{text: 'NO FOLLOW-UP QUESTIONS', in: AT(7.07), tick: AT(7.57)},
	{text: 'NO "LET’S DISCUSS" DEFLECTION', in: AT(7.57), tick: AT(8.72)},
	/**
	 * The last one belongs to clip two, and the gap between writing it and
	 * ticking it is the joke. The box goes up at 2.3, as he finishes the line
	 * about being told not to check Teams, then sits there empty through two
	 * more sentences and ticks at 6.9 - after he has stopped talking. The
	 * script asks for it slightly delayed for comic timing; four and a half
	 * seconds is more than slightly, and better.
	 */
	{text: 'TOLD ME TO LOG OFF', in: AT2(2.3), tick: AT2(6.9)},
];

/**
 * The audio dropout. Measured: his last line runs 5.52-6.65 in clip two, and
 * the glitch takes a quarter-second out of the middle of it rather than
 * muting the line. The script asks for a small dropout, and a whole missing
 * sentence would read as a fault rather than as a joke.
 *
 * Production notes 13 records this mechanism as written but never shot,
 * because Episode 01 had no line to land it on. This is that line.
 */
export const DROPOUT_IN = Math.round(5.95 * S);
export const DROPOUT_OUT = Math.round(6.2 * S);

export const WITNESS_LOWER_THIRD_IN = WITNESS_ANSWERS + 8;

export const SHOT_04_DURATION = WITNESS_2_IN + WITNESS_2_FRAMES + 24;

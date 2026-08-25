/**
 * Episode 01 / Scene 2 / Shot 6 — Witness Testimony.
 *
 * The register changes here and the transition has to carry that. The series
 * rule from the script: a paper TEAR means reality intruding on the
 * reenactment, and is reserved for cuts to real footage; the page-flip stays
 * reserved for reenactment-to-reenactment. So Shot 6 does not cut — it opens
 * on Shot 5's page still standing and rips it apart.
 *
 * Everything after that is cut to the takes, measured off their RMS envelopes
 * rather than estimated. The passenger's account is six flat sentences with a
 * beat between each, and each one puts a line on an evidence checklist and
 * then ticks it — which is the shot's whole joke: nothing he describes is
 * remarkable, and the list of unremarkable things is damning.
 */

const S = 30; // frames per second, for reading the numbers below as seconds

/** A few frames of the intact page, so the cut into this shot is invisible. */
export const TEAR_STARTS = 4;
export const TEAR_FRAMES = 26;
export const TEAR_DONE = TEAR_STARTS + TEAR_FRAMES;
/** The stamp beat the script marks optional. Half a second, then gone. */
export const SLATE_IN = TEAR_STARTS + 16;
export const SLATE_OUT = SLATE_IN + 15;
export const LOWER_THIRD_IN = TEAR_DONE + 8;

/** Correspondent, off screen. 2.88s; speech from 0.28 to 2.06. */
export const VO_Q_STARTS = 34;
export const VO_Q_FRAMES = 87;

/**
 * The testimony. 15.36s, six sentences, measured start and end of each.
 * The checklist line appears as he begins an item and is ticked as he
 * finishes it, so the frame is always one beat behind him rather than
 * announcing what he is about to say.
 */
export const VO_A_STARTS = VO_Q_STARTS + VO_Q_FRAMES + 12;
export const VO_A_FRAMES = 461;
export const ITEMS = [
	{text: 'PUT THE METER DOWN', start: 0.34, end: 2.32},
	{text: 'DID NOT ASK', start: 3.1, end: 4.3},
	{text: 'NO HORN', start: 5.22, end: 6.74},
	{text: 'NOT ON THE PHONE', start: 7.36, end: 8.94},
	{text: 'STOPPED AT EVERY SIGNAL', start: 9.8, end: 12.34},
	{text: 'FOLLOWED EVERY RULE', start: 13.2, end: 14.8},
].map((item) => ({
	text: item.text,
	in: VO_A_STARTS + Math.round(item.start * S),
	tick: VO_A_STARTS + Math.round(item.end * S),
}));

/**
 * "It almost felt like... I was in a parallel universe." 6.88s, with a real
 * 1.5s pause at the ellipsis — the last phrase runs from 4.06s.
 */
export const VO_B_STARTS = VO_A_STARTS + VO_A_FRAMES + 14;
export const VO_B_FRAMES = 207;
/**
 * The dropout the script asks for, on "parallel universe". Two of them, short
 * and irregular, because a single tidy gap reads as an edit rather than as a
 * connection failing. The picture tears on the same frames.
 */
export const GLITCHES = [
	{at: VO_B_STARTS + Math.round(5.32 * S), frames: 4},
	{at: VO_B_STARTS + Math.round(5.78 * S), frames: 3},
	{at: VO_B_STARTS + Math.round(6.16 * S), frames: 5},
];

export const SHOT_06_DURATION = VO_B_STARTS + VO_B_FRAMES + 30;

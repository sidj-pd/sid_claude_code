/**
 * Episode 01 / Scene 2 / Shot 6 — Webcam Interview.
 *
 * The register changes here and the transition has to carry that. The series
 * rule from the script: a paper TEAR means reality intruding on the
 * reenactment, and is reserved for cuts to real footage; the page-flip stays
 * reserved for reenactment-to-reenactment. So Shot 6 does not cut — it opens
 * on Shot 5's page still standing and rips it apart.
 *
 * What the tear reveals is the correspondent, asking his one question. The
 * witness's answer is a second, separate clip, cut in straight after —
 * two windows of the same call, edited the way any two-camera video
 * interview is. Both clips carry their own dialogue: nothing here adds
 * audio beyond the tear itself, and every beat below is measured off the
 * clips' own envelopes rather than off the script.
 */

/** Video frames per second of the composition, for reading seconds below. */
const S = 30;

/** A few frames of the intact page, so the cut into this shot is invisible. */
export const TEAR_STARTS = 4;
export const TEAR_FRAMES = 26;
export const TEAR_DONE = TEAR_STARTS + TEAR_FRAMES;
/** The stamp beat the script marks optional. Half a second, then gone. */
export const SLATE_IN = TEAR_STARTS + 16;
export const SLATE_OUT = SLATE_IN + 15;

/**
 * The correspondent. Held on his first frame — silent — while the paper is
 * still coming off him, then plays from his own frame zero once revealed.
 * His one line sits at 1.49-2.89s in the clip; the cut to the witness comes
 * half a second after he finishes, which is enough of a beat to read as a
 * question landing rather than an edit.
 */
export const CORR_IN = TEAR_DONE;
export const CORR_SPEECH_ENDS = CORR_IN + Math.round(2.89 * S);
export const WITNESS_IN = CORR_SPEECH_ENDS + Math.round(0.5 * S);

/**
 * His chyron. On a beat before he speaks — a name card that only appeared
 * once someone was already mid-sentence would read as a mistake — and off a
 * few frames before the cut to the witness, so it never overlaps a caption
 * that belongs to someone else.
 */
export const CORR_LOWER_THIRD_IN = CORR_IN + 8;
export const CORR_LOWER_THIRD_OUT = WITNESS_IN - 6;

/** 10.01s at 24fps, conformed to the composition's 30. */
export const WITNESS_FRAMES = 300;

/**
 * The checklist, cut to the delivery in the witness clip rather than to a
 * script. Measured off its own RMS envelope: `in` is where an utterance
 * starts, `tick` is where it ends and the silence begins.
 *
 * The clip runs the full six-sentence list from vo-lines.json's ep01-shot06-a
 * ("He put the meter down... He followed every rule"), and its five gaps of
 * silence land almost exactly on the six sentence boundaries — the third gap
 * is short enough that two short sentences ("wasn't honking" / "wasn't on the
 * phone") share one utterance either side of it. The last segment's duration
 * and syllable count both fit "he followed every rule" at the same rate as
 * every other line in the clip, with no room left in the 10s take for the
 * longer parallel-universe sentence to also be in here — that line is
 * scripted as a distinct beat and wants its own clip.
 */
const AT = (seconds: number) => WITNESS_IN + Math.round(seconds * S);
export const ITEMS = [
	{text: 'PUT THE METER DOWN', in: AT(0.22), tick: AT(0.9)},
	{text: 'DID NOT ASK', in: AT(1.56), tick: AT(2.36)},
	{text: 'NO HORN', in: AT(2.92), tick: AT(4.17)},
	{text: 'NOT ON THE PHONE', in: AT(4.29), tick: AT(5.62)},
	{text: 'STOPPED AT EVERY SIGNAL', in: AT(5.71), tick: AT(6.99)},
	{text: 'FOLLOWED EVERY RULE', in: AT(7.69), tick: AT(9.53)},
];

export const WITNESS_LOWER_THIRD_IN = WITNESS_IN + 8;

export const SHOT_06_DURATION = WITNESS_IN + WITNESS_FRAMES + 24;

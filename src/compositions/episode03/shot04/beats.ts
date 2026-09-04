/**
 * Episode 03 / Shots 3-4 — Tear Reveal + Witness Testimony.
 *
 * The stat card from Shot 2 does not cut away; it is torn in half and pulled
 * off the frame, same device and same reasoning as Episodes 01 and 02: a tear
 * means reality intruding on the reenactment, reserved for cuts into real
 * footage, so the audience is told what kind of thing is coming before their
 * eye resolves it. The script gives this its own beat number; the code does
 * not give it its own file, for the same reason Episode 02 didn't — a shot
 * that exists only to hold a transition has nothing else to do.
 *
 * Unlike Episode 02, there is no correspondent line here — the script gives
 * this witness no off-screen question, so he is already mid-testimony when
 * the paper clears rather than answering something just asked.
 *
 * All three clips have landed and are measured (scripts/measure-vo.py against
 * each clip's extracted audio track):
 *
 *   ep03-witness-1.mp4  8.00s  speech 0.69-6.24
 *     gaps  2.00-2.54  3.65-4.55
 *     0.69-2.00  "I had my whole defense ready."
 *     2.54-3.65  "I rehearsed it in the mirror."
 *     4.55-6.24  "That stain was there before I moved in."
 *
 *   ep03-witness-2.mp4  8.00s  speech 0.49-6.64
 *     gaps  1.21-1.80  2.52-3.09  3.69-4.54  5.40-6.15
 *     0.49-1.21  "No inspection,"
 *     1.80-2.52  "no deduction,"
 *     3.09-3.69  "no lecture."
 *     4.54-5.40  "He just handed it over."
 *     6.15-6.64  "Full amount."
 *
 *   ep03-witness-3.mp4  8.00s  speech 1.64-5.77
 *     gap  3.54-4.57
 *     1.64-3.54  "I still have the speech saved in my notes app."
 *     4.57-5.77  "I don't know what to do with it now."
 *
 * Every checklist item in Episode 02 that landed inside one continuous breath
 * had to be subdivided by syllable count, because that take had no pause
 * between clauses. This take does — three real gaps, one per item — so every
 * item below is timed off a measured silence rather than an estimate.
 *
 * Clip one's lead-in (0.69s) is ordinary settle time. Clip three's (1.64s) is
 * not — it is the "eyes drift, replaying the memory" beat the script asks
 * for, landing as silence before he speaks rather than as a direction that
 * has to be illustrated separately.
 */

const S = 30;

/** A few frames of the intact page, so the cut into this shot is invisible. */
export const TEAR_STARTS = 4;
export const TEAR_FRAMES = 26;
export const TEAR_DONE = TEAR_STARTS + TEAR_FRAMES;

/** The stamp beat the script marks optional. Half a second, then gone. */
export const SLATE_IN = TEAR_STARTS + 16;
export const SLATE_OUT = SLATE_IN + 15;

/**
 * No correspondent question to wait on — he is already talking once the
 * paper clears. A small settle beat, not zero, so the cut into him doesn't
 * land in the same frame the tear finishes on.
 */
export const WITNESS_1_IN = TEAR_DONE + 10;
/**
 * He stops talking at 6.24s; the clip runs 8.00. Cut a little past his last
 * word, not at the end of the take — the remaining second and a half of him
 * sitting there is the take's tail, not a beat this shot has any use for.
 */
export const WITNESS_1_FRAMES = Math.round(6.6 * S);

export const WITNESS_2_IN = WITNESS_1_IN + WITNESS_1_FRAMES;
/** Same rule: he stops at 6.64s, cut at 7.5. */
export const WITNESS_2_FRAMES = Math.round(7.5 * S);

export const WITNESS_3_IN = WITNESS_2_IN + WITNESS_2_FRAMES;
/** He stops at 5.77s, cut at 6.5. */
export const WITNESS_3_FRAMES = Math.round(6.5 * S);

/** Offsets into each clip, named for it rather than numbered — three clips
 *  this time, and AT/AT2/AT3 is clearer at the call site than AT/AT2/AT4. */
const AT1 = (seconds: number) => WITNESS_1_IN + Math.round(seconds * S);
const AT2 = (seconds: number) => WITNESS_2_IN + Math.round(seconds * S);
const AT3 = (seconds: number) => WITNESS_3_IN + Math.round(seconds * S);

/**
 * The checklist, all three items inside clip two. `in` is where the line is
 * written, `tick` where it is ticked — writing and ticking on the same frame
 * would make the graphic a caption, and the gap between them is what makes
 * it read as a record being kept rather than a subtitle.
 *
 * Every in/tick pair below is a real measured pause, not an estimate: `in`
 * is where that clause's own speech starts, `tick` is where it stops and the
 * silence before the next one begins.
 */
export const ITEMS = [
	{text: 'NO INSPECTION', in: AT2(0.49), tick: AT2(1.21)},
	{text: 'NO DEDUCTION', in: AT2(1.8), tick: AT2(2.52)},
	{text: 'NO LECTURE', in: AT2(3.09), tick: AT2(3.69)},
];

/**
 * The audio dropout the script asks for, on "I don't know what to do with it
 * now" — clip three, 4.57-5.77. A quarter-second cut from inside the
 * sentence, the same size Episode 02 used for the mechanism's first real
 * outing, not the whole line: a missing sentence reads as a fault, a quarter
 * second reads as a joke.
 */
export const DROPOUT_IN = AT3(5.05);
export const DROPOUT_OUT = AT3(5.3);

export const WITNESS_LOWER_THIRD_IN = WITNESS_1_IN + 8;

export const SHOT_04_DURATION = WITNESS_3_IN + WITNESS_3_FRAMES + 24;

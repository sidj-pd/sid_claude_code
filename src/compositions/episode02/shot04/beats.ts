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
 * ---------------------------------------------------------------------------
 * WARNING: the witness-side numbers below are PROVISIONAL.
 *
 * Everything up to WITNESS_ANSWERS is measured — the tear is frames, and the
 * question is an envelope of ep02-shot04-q (2.20s, speech 0.29-1.82). But
 * public/footage/ep02-witness-1.mp4 does not exist yet, and §8 is explicit
 * that cues are offsets into a measurement of the real clip. Every ITEM time
 * here is a guess at a performance nobody has recorded.
 *
 * When the clip lands: measure its RMS envelope, replace the AT() values, and
 * delete this warning. Do not tune the picture to these numbers in the
 * meantime — they exist so the shot is previewable against a slate, which is
 * the whole reason Footage.tsx draws one.
 * ---------------------------------------------------------------------------
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
 * a jump cut between takes is the native grammar of cut testimony anyway. It
 * also keeps each clip inside the ~8s the video models manage.
 *
 * PROVISIONAL lengths: 6.2s for the list, 4.5s for the Teams beat.
 */
export const WITNESS_1_FRAMES = Math.round(6.2 * S);
export const WITNESS_2_IN = WITNESS_ANSWERS + WITNESS_1_FRAMES;
export const WITNESS_2_FRAMES = Math.round(4.5 * S);

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
	{text: 'REPLIED IN UNDER 1 MINUTE', in: AT(0.4), tick: AT(1.7)},
	{text: 'NO FOLLOW-UP QUESTIONS', in: AT(2.3), tick: AT(3.5)},
	{text: 'NO "LET’S DISCUSS" DEFLECTION', in: AT(4.1), tick: AT(5.7)},
	/**
	 * The last one belongs to clip two, and lands late on purpose — the script
	 * asks for it "slightly delayed from the others for comic timing". It is
	 * the tick that arrives after the audience has stopped expecting one.
	 */
	{text: 'TOLD ME TO LOG OFF', in: AT2(1.4), tick: AT2(3.3)},
];

/**
 * The audio dropout, on "I didn't know what to do with myself". PROVISIONAL
 * like everything else here — it is a window into a clip that does not exist.
 * Production notes §13 records the mechanism as written but never shot;
 * this is the line it was written for.
 */
export const DROPOUT_IN = Math.round(2.6 * S);
export const DROPOUT_OUT = Math.round(3.4 * S);

export const WITNESS_LOWER_THIRD_IN = WITNESS_ANSWERS + 8;

export const SHOT_04_DURATION = WITNESS_2_IN + WITNESS_2_FRAMES + 24;

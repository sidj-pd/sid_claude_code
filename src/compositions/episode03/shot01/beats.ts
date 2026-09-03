/**
 * Episode 03 / Shot 1 — The Empty Flat.
 *
 * The series' first shot built in the assembly style: the frame opens EMPTY and
 * the flat builds itself, piece by piece, before anyone is in it. That is the
 * reference's signature (docs/EP03-STYLE-NOTES.md) and the opposite of
 * EP03-SHOT01-SPEC.md, which has everything pre-placed and found by a camera
 * drag — Episodes 01 and 02's grammar, and the slowest thing in the series.
 *
 * ---------------------------------------------------------------------------
 * WHY THIS SHOT WAS 23.4s, AND WHY IT IS NOW 15.6s
 *
 * The first cut ran 702 frames and read slow. It was not a pacing fault. The
 * three takes came to 16.96s carrying 11.10s of speech — 35% of the audio was
 * silence, and the landlord's take was 3.72s to say 1.21s of words. That is
 * generator padding, not performance, so scripts/tighten-vo.py cuts it: every
 * cut lands inside measured silence, nothing is sped up, no word is lost.
 * Each cut take transcribes identically to its source (scripts/transcribe.py).
 *
 *   tenant    4.72 -> 4.50s   landlord  3.72 -> 2.60s   vo  8.52 -> 4.36 + 3.27s
 *
 * The bigger saving was structural. The VO used to run at the end, after
 * everything, adding its whole length to the shot. Split at its own mid-line
 * silence, the first half now opens the shot and plays UNDER the assembly —
 * documentary grammar, and how the reference works, since its audio bed runs
 * continuously while pieces arrive. That is 131 frames that cost nothing.
 *
 * What is left is 492 frames (16.4s), of which ~400 carry speech and 30 are a
 * deliberate ten-frame breath before each of the four lines — VO into
 * tenant, tenant into landlord, landlord into the closing VO — so voices
 * don't cut into each other even though nothing in the audio forced that.
 * Below the ~400 frames of speech, words have to go: the floor is the
 * dialogue itself, not the edit.
 * ---------------------------------------------------------------------------
 */

const S = 30;

/**
 * The assembly pulse. The reference runs at 91 BPM — 19.8 frames a beat — so
 * nineteen is its measured tempo, not a guess. It survived the retime because
 * the build now underlays the opening narration almost exactly: the last piece
 * lands at 128, the narration ends at 135. Subdividing to 13 or 10 finished the
 * room early and left it waiting, which is slower to watch, not faster.
 *
 * The reference's own accent shapes (the triangles, circles, squiggles) were
 * dropped from this shot — they read as belonging to the reference video
 * rather than to this series, once seen against real art instead of
 * placeholders.
 */
export const PULSE = 19;
const BEAT = (n: number) => 6 + n * PULSE;

/** The narration opens the shot and the room builds underneath it. */
export const VO_A_AT = 4;
export const VO_A_FRAMES = 131;

export const WALL_AT = BEAT(0);
export const CRACK_AT = BEAT(1);
export const POSTER_AT = BEAT(2);
export const STAIN_AT = BEAT(3);
export const FLOOR_AT = BEAT(4);
export const TILE_AT = BEAT(5);
export const TENANT_AT = BEAT(6);
/**
 * Not an asset any more — the keys are in the tenant's hand in his own artwork,
 * which is one fewer cutout and one fewer thing that can drift out of register.
 */

/**
 * A breath before each voice starts, rather than a hard cut into it. Ten
 * frames — a third of a second — is audible as a pause without reading as a
 * dropped line. Applied going into the tenant's dialogue, going into the
 * landlord's, and going into the closing narration.
 */
const PAUSE = 10;

/** He starts talking once the room exists and the narration has stopped. */
export const TENANT_SPEAKS = VO_A_AT + VO_A_FRAMES + PAUSE;
export const TENANT_FRAMES = 135;

/**
 * The landlord steps in before the tenant has finished — the tenant's line is
 * written to be cut off ("...when I—") and the take delivers it cut off, so the
 * interruption has to be visible before it is audible. His own line still
 * gets its own breath before it starts, once the tenant's has actually ended.
 */
export const LANDLORD_ENTERS = TENANT_SPEAKS + TENANT_FRAMES - 16;
export const LANDLORD_SPEAKS = TENANT_SPEAKS + TENANT_FRAMES + PAUSE;
/**
 * His line changed from three clipped phrases ("Forget it. Full amount.
 * Here.") to one sentence ("Here is the full deposit amount."), so this is
 * the new take's own measured length, not the old one's: 3.00s raw, 2.54s
 * (76 frames) after tighten-vo.py.
 */
export const LANDLORD_FRAMES = 76;

/**
 * The cash used to move on the isolated word "Here." — its own clean gap in
 * the old three-phrase take made that trivial to anchor to. The new line is
 * one continuous phrase with no internal silence (measured: 0 gaps), so
 * there is no gap to anchor to any more. Estimated instead by syllable share,
 * the same cross-check the production notes use for gapless segments:
 * "Here(1) is(1) the(1) full(1) de-pos-it(3) a-mount(2)" is 9 syllables, and
 * 7 of them land before "amount" — 77.8% of the take's 2.18s of measured
 * speech (0.15s-2.33s), landing the cash at the START of the last word, so
 * the two-step hop finishes as "amount" does.
 */
export const CASH_AT = LANDLORD_SPEAKS + 55;

/** And the second narration line closes it, over the handover, with its own
 *  breath after the landlord's line ends rather than overlapping it. */
export const VO_B_AT = LANDLORD_SPEAKS + LANDLORD_FRAMES + PAUSE;
export const VO_B_FRAMES = 98;

export const SHOT_01_DURATION = VO_B_AT + VO_B_FRAMES + 16;


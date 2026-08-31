/**
 * Episode 02 / Beat 9 / Shot 9 — Full Circle.
 *
 * Beat 1 from the other side. The employee sat at a desk at 11:47 with a
 * request he was afraid to send; the manager sits at his own desk on another
 * night with a message he is not going to answer. He closes the laptop instead,
 * which is the only decisive act anyone performs in the episode.
 *
 * The twin of Episode 01's Shot 11: freeze, drain the colour, turn the halftone
 * up, stamp the case closed, cut to black. A photograph going into an archive.
 *
 * Measured: ep02-shot09-final.wav 14.92s, speech 0.35-14.35, six gaps — and the
 * gaps are most of the performance. The take runs 0.226 s/syllable against
 * Episode 01's closing line at 0.225, which is the series' closing register
 * reproducing itself, so the visual beats are placed INSIDE the silences:
 *
 *   0.35-2.06   "As for the manager himself —"
 *   3.09-4.51   "still at his desk most nights."
 *   5.82-7.09   "Still responding fast."
 *   7.09-8.99   1.90s of nothing        <- the phone lights up here
 *   8.99-9.50   "Boundaries..."
 *   9.50-11.35  1.85s of nothing        <- he closes the laptop here
 *   11.35-11.92 "intact."
 *   14.09-14.35 "For now."
 */

const S = 30;

export const VO_STARTS = 14;
export const VO_FRAMES = Math.round(14.92 * S);

const AT = (seconds: number) => VO_STARTS + Math.round(seconds * S);

/**
 * The phone, in the long pause after "still responding fast" — the message
 * arrives while the narrator is saying nothing, so the audience notices it
 * rather than being told about it.
 */
export const PHONE_LIGHTS = AT(7.3);

/**
 * And he closes the laptop inside the pause on "Boundaries...", before the
 * word "intact" lands. The act comes first and the narration catches up, which
 * is what makes "intact" sound like a question.
 */
export const LAPTOP_CLOSES = AT(9.9);

/** Motion stops just after the last word. */
export const FREEZE_AT = AT(14.5);
export const DESAT_FRAMES = 70;

export const STAMP_AT = VO_STARTS + VO_FRAMES + 14;
export const BLACKOUT_STARTS = STAMP_AT + 22;
export const BLACKOUT_FRAMES = 10;

export const SHOT_09_DURATION = BLACKOUT_STARTS + BLACKOUT_FRAMES;

/**
 * Another night, so a different hour on the same clock. Beat 1 read 11:47; this
 * is twelve minutes past midnight and he is still there.
 */
export const CLOCK_HOUR = 0;
export const CLOCK_MINUTE = 12;

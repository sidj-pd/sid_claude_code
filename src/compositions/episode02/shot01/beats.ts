/**
 * Episode 02 / Beat 1 / Shot 1 — The Leave Request.
 * 0:00–8:70 = 261 frames @ 30fps.
 *
 * The only shot in either episode with no voice-over. The narration begins as
 * the manager's reply lands, which is Shot 2 — so this one is carried by the
 * room: a hum, a clock, and a man not pressing a button.
 *
 * That makes its beats AUTHORED, not measured, and it is worth saying so
 * plainly. Every other shot in the series derives its constants from an RMS
 * envelope of a real take (production notes §8); there is no take here to
 * derive from, and the two cues this shot does use are synthesised in
 * scripts/sfx.py to fit the picture rather than the other way round. Nobody
 * reading these numbers later should mistake them for measurements.
 *
 * Two framings, hard-cut, the way Episode 01's Shot 4 cuts the meter: a wide
 * that establishes the room and the hour, then the screen itself for the
 * hesitation and the press. No single framing holds both the man and a
 * legible cursor.
 */

const S = 30;

/** Wide on the desk: the window, the clock, him, not moving. */
export const ESTABLISH_FRAMES = 54;

/** Hard cut to the screen. */
export const SCREEN_CUT = ESTABLISH_FRAMES;

/** The cursor slides into frame and starts closing on the button. */
export const CURSOR_ARRIVES = SCREEN_CUT + 18;
/**
 * It stops moving here. Quantised before easing, so it covers ground early
 * and inches the last stretch — the same ordering that makes Episode 01's
 * auto read as braking rather than gliding.
 */
export const CURSOR_SETTLES = CURSOR_ARRIVES + 66;
/** Then it just sits there. This is the shot. */
export const HOLD_ENDS = CURSOR_SETTLES + 42;

/** Send. */
export const CLICK = HOLD_ENDS;
/** The chit lands a beat after the key, never on it. */
export const CHIT_IN = CLICK + 5;

export const SHOT_01_DURATION = CHIT_IN + 76;

/** Each cursor nudge is held this many frames. Chunky on purpose. */
export const CURSOR_STEP = 4;
/** The paper breathes on a slower grid than the cursor moves. */
export const BREATH_STEP = 9;

/**
 * 11:47 PM — the time the witness gives in Beat 4 ("I sent the request at
 * 11:47 PM"). The clock is generated without hands precisely so this can be
 * set here rather than baked into art that would then contradict the
 * testimony.
 */
export const CLOCK_HOUR = 11;
export const CLOCK_MINUTE = 47;
/** A second hand ticks once a second; it does not sweep. */
export const TICK_FRAMES = S;

/**
 * Measured off the keyed cutouts — the screen by scripts/measure-laptop.mjs,
 * the clock by a connected-component pass over its alpha. Consumed verbatim,
 * never eyeballed. Fractions of each cutout own box.
 */
export const SCREEN_LEFT = 0.2058;
export const SCREEN_TOP = 0.115;
export const SCREEN_WIDTH = 0.5692;
export const SCREEN_HEIGHT = 0.4911;

export const CLOCK_CENTRE_X = 0.5021;
export const CLOCK_CENTRE_Y = 0.5017;
/** Fraction of the clock cutout's width. Hands must not overrun the face. */
export const CLOCK_FACE_RADIUS = 0.2267;

/**
 * The narration, split across Shots 1 and 2.
 *
 * The script starts the line as the notification lands, but the take runs
 * 11.36s and Shot 2 is a punch-in the script itself calls "no dramatic wait" —
 * so the whole line cannot live there without overrunning into the stat card,
 * which has three lines of its own.
 *
 * The envelope settles it. The longest internal gap in ep02-shot02.wav is
 * 1.22s at 4.33-5.55, which is the full stop between the two sentences:
 *
 *   "Every day, thousands of leave requests are submitted in Bangalore."
 *      0.41 - 4.33   -> here, over the hesitation
 *   "This is the story of the one that got approved without a follow-up call."
 *      5.55 - 10.66  -> Shot 2, landing as the reply arrives
 *
 * Both shots play the same file, cut at 5.00s — inside that gap, so neither
 * end clips a word. Episode 01's Shot 1 splits its two sentences the same way
 * across the hail and the arrival.
 */
export const VO_IN = 30;
/** 4.90s. Ends inside the gap, a beat before the click at 180. */
export const VO_TRIM_AFTER = 147;

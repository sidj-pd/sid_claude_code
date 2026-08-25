/**
 * Episode 01 / Scene 1 / Shot 4 — Meter Down.
 * 90 frames @ 30fps (0:10–0:13 in the script).
 *
 * The documentary insert: we cut from the dashboard wide of Shot 3 to a tight
 * angle on the meter itself. The cut overlaps the action rather than following
 * it — we join the flag part-way through its arc, so the snap plays out here
 * even though Shot 3 already showed it happening. That overlap is what makes
 * the cut invisible; starting with the flag already down would leave the shot
 * with nothing to do.
 *
 * There is no voice-over. The script asks for "meter click, then a beat of
 * silence before the cut to the graphic", so almost two thirds of the shot is
 * a held frame with nothing happening in it. That hold is the joke: we are
 * waiting for a catch, and there isn't one.
 */

/** The flag arrives at its stop, overshooting it. */
export const SNAP_FRAME = 3;
/** It bounces back off the stop. Three frames, held, never eased. */
export const REBOUND_FRAME = SNAP_FRAME + 3;
/** And comes to rest on it. */
export const SETTLE_FRAME = REBOUND_FRAME + 3;

/**
 * The punch-in.
 *
 * The flag hangs a long way from the display on this artwork, so a frame tight
 * enough to read the fare cannot also hold the flag's swing. Rather than back
 * off far enough for both — which would leave the shot barely closer than the
 * one before it — the shot is two framings hard-cut together: wide enough for
 * the snap, then in on the readout to see what it says. A punch-in is what a
 * cutting room does to a piece of evidence anyway, and it costs nothing here
 * because the surface is paper, not focus.
 */
export const PUNCH_FRAME = 11;

/**
 * The fare arrives a clear beat after the flag lands, and arrives all at once.
 * A count-up would make it an event; a jump-cut makes it a fact that was
 * already true. The script is explicit about this.
 */
export const FARE_FRAME = 14;

/** Frames per stepped pose in the hold's paper breathing. */
export const BREATH_STEP = 6;

export const SHOT_04_DURATION = 90;

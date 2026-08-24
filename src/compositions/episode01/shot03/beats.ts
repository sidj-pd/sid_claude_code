/**
 * Episode 01 / Scene 1 / Shot 3 — Instant Yes.
 * 110 frames @ 30fps.
 *
 * The script's note is the whole direction: "No held silence — the driver's
 * hand simply reaches over and flips the meter down, almost before the
 * passenger finishes the destination. No hesitation beat, no dramatic
 * pause. The speed itself is the joke."
 *
 * So the flip is over inside the first half-second. Everything after it is
 * the narrator catching up to something that already happened — which is
 * why the hold runs long and the camera barely moves.
 */

/** The hand is already entering as we cut in. No establishing beat. */
export const REACH_STARTS = 4;
/** Contact, and the lever goes over. Two stepped positions, no easing. */
export const FLIP_FRAME = 13;
/** The click lands on contact; the meter reads a fare a beat later. */
export const FARE_APPEARS = FLIP_FRAME + 7;
/**
 * The hand withdraws as unremarkably as it arrived, and soon — once the flag
 * is over, a hand still hovering by a lever it is no longer touching reads as
 * a mistake rather than as a beat.
 */
export const HAND_LEAVES = 22;

/** VO runs from the top and finishes inside the shot. */
export const VO_STARTS = 0;

/**
 * 168 frames = 5.6s. Set by the voice-over, which runs 5.12s: per the TTS
 * pipeline notes, a line that does not fit means lengthening the shot, never
 * time-stretching the take. The flip still happens in the first half-second —
 * everything after it is the narrator catching up to something already done.
 */
export const SHOT_03_DURATION = 168;

/** Frames per stepped pose in the reach. Chunky, matching the series. */
export const REACH_STEP = 4;

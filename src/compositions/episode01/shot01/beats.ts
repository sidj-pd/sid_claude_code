/**
 * Episode 01 / Scene 1 / Shot 1 — Hand + Auto Stop.
 * 0:00–0:08 = 240 frames @ 30fps.
 *
 * Split in half: four seconds of the hail alone, then four seconds of the
 * auto arriving and stopping. That length is set by the voice-over — the
 * line runs 7.9s, and per the TTS pipeline notes the fix for a line that
 * does not fit is to lengthen the shot, never to time-stretch the take.
 *
 * The halves line up with the sentences:
 *   "Every day, thousands of auto rides begin in Bangalore."  → the wave
 *   "This is the story of the one that went right."           → the arrival
 */

/** VO runs from the top, so the first sentence plays over the hail. */
export const VO_STARTS = 0;

/** Four seconds in, the auto appears at the right edge. */
export const AUTO_ENTERS = 120;
/** It comes to rest just as the closing clause lands. */
export const AUTO_STOPS = 210;
/** Dust kicks up a touch before the wheels fully settle. */
export const SCREECH_PUFF = AUTO_STOPS - 3;
/**
 * The hand stops waving a few frames after the auto stops — the beat of
 * "it worked" reads better slightly late than perfectly synced.
 */
export const WAVE_ENDS = AUTO_STOPS + 3;

export const SHOT_01_DURATION = 240;

/** Each stop-motion pose is held this many frames. Chunky on purpose. */
export const WAVE_STEP = 6;
export const HOP_STEP = 5;

/**
 * Four seconds of an unbroken loop would go dead, so the wave takes a short
 * rest every few cycles, the way a real arm hailing a rickshaw does.
 */
export const WAVE_CYCLE = 3; // poses per cycle
export const REST_EVERY = 4; // cycles between rests
export const REST_LENGTH = 2; // cycles' worth of holding still

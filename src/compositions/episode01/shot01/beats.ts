/**
 * Episode 01 / Scene 1 / Shot 1 — Hand + Auto Stop.
 * 0:00–0:04 = 120 frames @ 30fps.
 *
 * Script beats:
 *  - Extreme close-up on a raised hand mid-hail, stop-motion jitter on the
 *    wave (stepped positions, never smooth).
 *  - Auto enters from the side on stepped hop-motion, pulls up and stops
 *    just past the hand.
 *  - Paper "screech" dust puff at the wheel as it stops.
 *  - Driver's face withheld — reserved for a later reveal.
 */

/** The wave runs from frame 0 until the auto has actually stopped. */
export const AUTO_ENTERS = 22;
/** Frame the auto comes to rest. The VO is cued to land exactly here. */
export const AUTO_STOPS = 74;
/** Dust kicks up a touch before the wheels fully settle. */
export const SCREECH_PUFF = AUTO_STOPS - 3;
/**
 * The hand stops waving a couple of frames after the auto stops — the beat
 * of "it worked" reads better slightly late than perfectly synced.
 */
export const WAVE_ENDS = AUTO_STOPS + 3;

export const SHOT_01_DURATION = 120;

/** Each stop-motion pose is held this many frames. Chunky on purpose. */
export const WAVE_STEP = 6;
export const HOP_STEP = 5;

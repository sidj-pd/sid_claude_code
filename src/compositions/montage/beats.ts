/**
 * Beat boundaries for the 360-frame (12s @ 30fps) opening montage.
 *
 * Durations deliberately ACCELERATE from the signal onward — 46, 36, 28, 24,
 * 20 frames — rather than sitting at an even cadence. The escalating cut
 * rate is the joke: the montage is losing control of itself.
 *
 * The one long beat is B3, the auto bouncing down the potholed road. That's
 * the centrepiece physical gag and it needs room to land, so it runs against
 * the acceleration on purpose.
 */

export const B1_SOUDHA = 0; //    prestige shot: the assembly building
export const B2_ROAD = 56; //     the road it actually stands on slams in
export const B3_AUTO = 84; //     auto bounces down it, over every pothole
export const B4_SIGNAL = 150; //  red light + 180s timer; it stops dead
export const B5_TOWER = 196; //   IT tower erupts, camera can't keep up
export const B6_GARDEN = 232; //  Lalbagh crowds in
export const B7_METRO = 260; //   metro slams across the top
export const B8_BARRICADE = 284; // roadworks drop in, everything collides
export const B9_GRIDLOCK = 304; //total freeze
export const B10_DOSA = 316; //   the one thing that works, arriving calmly
export const B11_TITLE = 332; //  title stamps down on the mess
export const END = 360;

/** Frame the auto's brakes bite and it fires a last exhaust puff. */
export const AUTO_STOP_PUFF = B4_SIGNAL + 4;

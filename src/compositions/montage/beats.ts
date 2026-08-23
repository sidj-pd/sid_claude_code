/**
 * Beat boundaries for the 360-frame (12s @ 30fps) opening montage.
 *
 * The durations deliberately ACCELERATE — 75, 65, 55, 45, 35, 25 frames —
 * rather than sitting at an even cadence. The escalating cut rate is the
 * joke: the montage is losing control of itself. An evenly-paced version
 * reads as a slideshow no matter how well each individual beat animates.
 */

export const B1_SETUP = 0; //    prestige shot, Vidhana Soudha
export const B2_TURN = 75; //    auto parks dead centre and blocks it
export const B3_TOWER = 140; //  IT tower erupts upward, camera can't keep up
export const B4_GARDEN = 195; // Lalbagh crowds in
export const B5_METRO = 240; //  metro slams across the top
export const B6_SIGN = 275; //   MG Road drops, everything collides
export const B7_GRIDLOCK = 300; // total freeze
export const B8_TITLE = 318; //  title stamps down on the mess
export const END = 360;

/** Frame the auto comes to rest and stops moving for good. */
export const AUTO_PARKED = 112;
/** Frame the exhaust puff fires, just after it cuts the engine. */
export const AUTO_PUFF = 114;

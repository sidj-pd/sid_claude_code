/**
 * BIZZARO BANGALORE — the Episode 04 palette.
 *
 * Three Pantone colours, named by the director:
 *
 *   Aruba Blue        a light aqua, the ground everything is laid on
 *   Ganache           a deep cocoa brown, the ink
 *   Clarified Butter  a warm golden yellow, the accent
 *
 * THE HEX VALUES ARE MY CONVERSIONS, NOT PANTONE'S. Pantone does not publish
 * exact sRGB for the TCX library, and the swatch books disagree with every
 * online table by a few points. These are the values the episode is built
 * against; if the real book numbers turn up, change them HERE and the whole
 * episode follows, because nothing downstream hardcodes a colour.
 *
 * WHY THIS IS A NEW FILE RATHER THAN AN EDIT
 *
 * Episodes 01-03 import INK/PAPER/MARK from episode01/shot05/StatBar, and
 * those three are cream, warm brown and rust. Repointing them would retheme
 * three delivered episodes as a side effect of styling a fourth. Episode 04
 * imports from here instead; when the series is ready to move over wholesale
 * that is a deliberate, separate change.
 */

/** Pantone 13-5313 TCX Aruba Blue. The surface. */
export const ARUBA = '#7CCDC8';
/** Pantone 19-1116 TCX Ganache. Type, rules, and the dark the light closes to. */
export const GANACHE = '#43302A';
/** Pantone 13-0916 TCX Clarified Butter. Stamps, bars, highlights. */
export const BUTTER = '#EECA8F';

/**
 * Tints and shades, all derived from the three above rather than picked
 * separately, so the episode cannot drift into a fourth and fifth colour.
 */

/** Aruba, lifted — the top of the lit ground. */
export const ARUBA_LIGHT = '#9BDAD5';
/** Aruba, dropped — the bottom of the ground, and the shadow side of it. */
export const ARUBA_DEEP = '#5AB0AB';
/** Ganache at its darkest, for a blackout or the outside of an iris. */
export const GANACHE_DEEP = '#241812';
/** Butter, pushed warmer, for a stamp that has to shout over the rest. */
export const BUTTER_DEEP = '#DCA855';

/**
 * Semantic aliases. Compositions use THESE, never the Pantone names, so a
 * piece of layout says what a colour is for rather than which pot it came
 * from — the same reason Episodes 01-03 say INK rather than "dark brown".
 */
export const GROUND = ARUBA;
export const INK = GANACHE;
export const ACCENT = BUTTER;

/**
 * Cast shadow, in Ganache rather than neutral black. A grey shadow on a
 * saturated aqua ground reads as dirt on the lens; a brown one reads as
 * paper lifted off a coloured sheet, which is what it is.
 */
export const SHADOW_RGB = '36, 24, 18';

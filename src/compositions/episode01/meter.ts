/**
 * Geometry of the fare-meter artwork, in fractions of the source PNG.
 *
 * Everything here was measured off public/cutouts-alpha/auto-meter-body.png
 * rather than eyeballed: the display panel is the largest connected bright
 * region in the image, and the four fare digits are the dark blobs inside it.
 * Measuring them means the overlay lands on the art's own digit tiles instead
 * of near them, which is the whole difference between a meter whose reading
 * changes and a number stuck on top of a picture of a meter.
 *
 * See scripts/measure-meter.mjs and scripts/split-meter.mjs, which print
 * these. Shared across the scene so Shot 3 and Shot 4 put the flag in the
 * same place either side of the cut.
 */

/** Aspect of the source art, so the shot only has to choose a width. */
export const METER_ASPECT = 2752 / 1536;

/** Centre of the cream display panel, as a fraction of the image. */
export const PANEL_CENTRE = {x: 0.3535, y: 0.4448};

/**
 * The four fare digits. Each is a dark tile with a cream numeral knocked out
 * of it — which is lucky, because it means a changed digit can be another
 * tile of the same design laid over the top, exactly the way an animator
 * would change a number on a physical puppet.
 */
export const FARE_TILES = [
	{left: 0.2754, top: 0.4063, width: 0.0469, height: 0.0556},
	{left: 0.3268, top: 0.4095, width: 0.0456, height: 0.0534},
	{left: 0.3939, top: 0.4110, width: 0.0456, height: 0.0494},
	{left: 0.4440, top: 0.4110, width: 0.0469, height: 0.0531},
] as const;

/** Colours sampled from the digit tiles themselves. */
export const TILE_INK = '#544838';
export const TILE_NUMERAL = '#fbedd3';

/**
 * Where the lever sits inside the meter cutout, and where its pivot sits
 * inside the lever crop — both printed by scripts/split-meter.mjs.
 */
export const LEVER_BOX = {left: '57.6%', top: '17.6%', width: '39.3%', height: '36.0%'};
export const LEVER_PIVOT = '14.2% 91.3%';

/**
 * The arm is drawn pointing up-right at about 71° above horizontal, so 95°
 * clockwise puts it roughly 24° BELOW horizontal — properly over its stop
 * rather than merely nudged to level. Shot 3 uses the same number, so the
 * flag is in the same place either side of the cut.
 */
export const LEVER_DOWN = 95;

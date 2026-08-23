import {CutoutAsset} from '../../assets/cutouts';

/**
 * Where each cutout finally sits in world space, and how big it is there.
 * (0,0) is the centre of the frame at camera scale 1; +Y is down.
 *
 * The layout is a stacked city read bottom-to-top. Two placements are
 * load-bearing for the comedy rather than just composition:
 *  - the road runs under everything, so the monument is visibly standing on
 *    broken tarmac;
 *  - the auto sits nearest camera and dead centre, overlapping the monument,
 *    stopped at a red light it will never get through.
 */
export type WorldPlacement = {
	x: number;
	y: number;
	width: number;
	height: number;
	rotate: number;
	/** Painter's-algorithm depth; higher renders in front. */
	z: number;
	/** Shadow strength — nearer things sit further off the page. */
	elevation: number;
};

/** World Y of the road surface the auto's wheels rest on. */
export const ROAD_SURFACE_Y = 363;

export const WORLD: Record<CutoutAsset, WorldPlacement> = {
	// Back layer — the metro glides above everything, ignoring the mess below.
	'namma-metro': {x: -40, y: -880, width: 1500, height: 1125, rotate: -1.5, z: 10, elevation: 0.7},
	// The tower overshoots up and to the right, crowding under the metro.
	'it-park-building': {x: 320, y: -430, width: 1220, height: 915, rotate: 2.5, z: 20, elevation: 0.85},
	// Civic centrepiece.
	'vidhana-soudha': {x: -60, y: -10, width: 1240, height: 930, rotate: 0, z: 30, elevation: 1},
	// Garden City, briefly, shouldering in from the left to balance the
	// tower on the right and fill the void under the metro.
	'lalbagh-glass-house': {x: -400, y: -330, width: 1100, height: 825, rotate: -3.5, z: 25, elevation: 1.0},
	// The ground truth, literally: everything above is standing on this.
	'pothole-road': {x: 0, y: 620, width: 1350, height: 1010, rotate: 0, z: 40, elevation: 0.9},
	// Retired from the montage - it collided with the signal's pole and read
	// as clutter rather than a beat. Kept registered so the slot at roughly
	// (470, 470) can take a replacement cutout.
	'mg-road-signage': {x: 470, y: 470, width: 760, height: 570, rotate: 4, z: 45, elevation: 1.15},
	// Stuck on red, towering over the stopped auto.
	'traffic-signal': {x: 415, y: 76, width: 900, height: 675, rotate: -1, z: 50, elevation: 1.2},
	'exhaust-puff': {x: -430, y: 225, width: 380, height: 285, rotate: 0, z: 55, elevation: 0.5},
	// Nearest to camera, dead centre, blocking the monument. The gag.
	'auto-rickshaw': {x: -110, y: 155, width: 1010, height: 758, rotate: 0, z: 60, elevation: 1.4},
	// The one thing this city gets right, arriving calmly amid the wreckage.
	// Sits low and left, resting on the broken road.
	'masala-dosa': {x: -290, y: 690, width: 820, height: 615, rotate: -2, z: 70, elevation: 1.5},
};

import {CutoutAsset} from '../../assets/cutouts';

/**
 * Where each cutout finally sits in world space, and how big it is there.
 * (0,0) is the centre of the frame at camera scale 1; +Y is down.
 *
 * The layout is a stacked city read bottom-to-top: the auto sits nearest
 * camera and dead centre, deliberately overlapping the assembly building
 * behind it — that occlusion IS the opening joke, so it is a layout
 * decision, not an accident of z-order.
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

export const WORLD: Record<CutoutAsset, WorldPlacement> = {
	// Back layer — the metro glides above everything, ignoring the mess below.
	'namma-metro': {x: -40, y: -880, width: 1500, height: 1125, rotate: -1.5, z: 10, elevation: 0.7},
	// The tower overshoots up and to the right, crowding under the metro.
	'it-park-building': {x: 320, y: -430, width: 1220, height: 915, rotate: 2.5, z: 20, elevation: 0.85},
	// Civic centrepiece.
	'vidhana-soudha': {x: -60, y: -10, width: 1240, height: 930, rotate: 0, z: 30, elevation: 1},
	// Nearest to camera and dead centre, its roofline cutting across the
	// monument's steps. It parks here at beat 2 and is still here at the
	// gridlock freeze — the running gag, so the overlap is deliberate.
	'auto-rickshaw': {x: -30, y: 230, width: 1010, height: 758, rotate: 0, z: 60, elevation: 1.4},
	'exhaust-puff': {x: -420, y: 170, width: 380, height: 285, rotate: 0, z: 55, elevation: 0.5},
	// Garden City, briefly, shouldering in from the lower left.
	'lalbagh-glass-house': {x: -350, y: 620, width: 1100, height: 825, rotate: -3.5, z: 40, elevation: 1.1},
	// Signage crowds the lower right.
	'mg-road-signage': {x: 430, y: 520, width: 760, height: 570, rotate: 4, z: 50, elevation: 1.15},
};

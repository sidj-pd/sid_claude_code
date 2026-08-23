import {LifecycleConfig, Slot} from './lifecycle';

/**
 * Global frame numbers for the whole 360-frame montage. Each asset's hero
 * window overlaps the next asset's entrance by RECEDE_DURATION frames so
 * the previous hero is still visibly settling into the background skyline
 * while the next one is animating into the foreground — that overlap is
 * what makes the montage read as one continuous, blended scene rather than
 * a slideshow of disconnected cards.
 */
export const VIDHANA_HERO_END = 60;
export const AUTO_ENTRANCE_START = 60;
export const AUTO_HERO_END = 120;
export const IT_PARK_ENTRANCE_START = 120;
export const IT_PARK_HERO_END = 180;
export const LALBAGH_ENTRANCE_START = 180;
export const LALBAGH_HERO_END = 225;
export const METRO_ENTRANCE_START = 225;
export const METRO_HERO_END = 255;
export const MG_ROAD_ENTRANCE_START = 255;
export const MG_ROAD_HERO_END = 300;

export const TITLE_START = 300;
export const FINALE_GROW_START = 322;
export const FINALE_GROW_DURATION = 16;
export const FLIP_DOWN_START = 340;
export const FLIP_DOWN_STAGGER = 3;
export const FLIP_DOWN_DURATION = 10;

// Background "skyline" slots — a scattered, overlapping band near the top
// of the frame that each asset settles into once its hero moment ends and
// stays visible in (at reduced scale, with a softer shadow) while later
// assets take the foreground.
export const REST_SLOTS: Record<string, Slot> = {
	'vidhana-soudha': {x: -350, y: -680, scale: 0.32, rotate: -5},
	'auto-rickshaw': {x: -140, y: -640, scale: 0.28, rotate: 6},
	'it-park-building': {x: 90, y: -700, scale: 0.26, rotate: -4},
	'lalbagh-glass-house': {x: 300, y: -650, scale: 0.3, rotate: 5},
	'namma-metro': {x: 60, y: -560, scale: 0.32, rotate: -3},
	'mg-road-signage': {x: -300, y: -540, scale: 0.24, rotate: 4},
};

// Large finale poster-collage slots — every asset grows back up and
// scatters across most of the frame around the title for the curtain-call
// finish, before flipping downward and away.
export const FINALE_SLOTS: Record<string, Slot> = {
	'vidhana-soudha': {x: -240, y: -540, scale: 0.58, rotate: -6},
	'auto-rickshaw': {x: 260, y: -470, scale: 0.5, rotate: 8},
	'it-park-building': {x: -290, y: 300, scale: 0.56, rotate: 5},
	'lalbagh-glass-house': {x: 280, y: 320, scale: 0.54, rotate: -7},
	'namma-metro': {x: 0, y: 610, scale: 0.62, rotate: 3},
	'mg-road-signage': {x: 0, y: -740, scale: 0.4, rotate: -3},
};

const flipDown = (index: number) => ({
	flipDownStart: FLIP_DOWN_START + index * FLIP_DOWN_STAGGER,
	flipDownDuration: FLIP_DOWN_DURATION,
});

const finale = (asset: keyof typeof FINALE_SLOTS) => ({
	finaleGrowStart: FINALE_GROW_START,
	finaleGrowDuration: FINALE_GROW_DURATION,
	finaleSlot: FINALE_SLOTS[asset],
});

export const lifecycleFor = (
	asset: keyof typeof REST_SLOTS,
	heroHoldEnd: number,
	recedeDuration: number,
	flipIndex: number,
): LifecycleConfig => ({
	heroHoldEnd,
	recedeDuration,
	restSlot: REST_SLOTS[asset],
	...finale(asset),
	...flipDown(flipIndex),
});

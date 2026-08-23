import type {CSSProperties} from 'react';
import {Easing, interpolate} from 'remotion';

/**
 * A resting position/scale/rotation an asset can be animated toward — used
 * for both the background "skyline" slot each asset settles into after its
 * hero moment, and the large finale poster-collage slot at the end.
 */
export type Slot = {
	x: number;
	y: number;
	scale: number;
	rotate: number;
};

export type Transform = {
	x: number;
	y: number;
	scale: number;
	rotate: number;
	opacity: number;
};

export type LifecycleConfig = {
	/** frame the hero moment ends and the recede-to-background begins */
	heroHoldEnd: number;
	recedeDuration: number;
	restSlot: Slot;
	finaleGrowStart: number;
	finaleGrowDuration: number;
	finaleSlot: Slot;
	flipDownStart: number;
	flipDownDuration: number;
};

const lerpSlot = (a: Slot, b: Slot, t: number): Transform => ({
	x: interpolate(t, [0, 1], [a.x, b.x]),
	y: interpolate(t, [0, 1], [a.y, b.y]),
	scale: interpolate(t, [0, 1], [a.scale, b.scale]),
	rotate: interpolate(t, [0, 1], [a.rotate, b.rotate]),
	opacity: 1,
});

/**
 * Shared post-hero lifecycle: recede from wherever the hero animation left
 * off into a small background "skyline" slot, rest there while other
 * assets take their turn in the foreground, grow back up into a large
 * finale poster-collage slot, then flip downward and away. Returns null
 * while frame is still within the hero window — the caller supplies its
 * own hero-phase transform for that part.
 */
export const useLifecycleTransform = (
	frame: number,
	heroTransform: Transform,
	config: LifecycleConfig,
): Transform => {
	const {
		heroHoldEnd,
		recedeDuration,
		restSlot,
		finaleGrowStart,
		finaleGrowDuration,
		finaleSlot,
		flipDownStart,
		flipDownDuration,
	} = config;

	if (frame < heroHoldEnd) {
		return heroTransform;
	}

	const recedeEnd = heroHoldEnd + recedeDuration;
	if (frame < recedeEnd) {
		const t = interpolate(frame, [heroHoldEnd, recedeEnd], [0, 1], {
			extrapolateLeft: 'clamp',
			extrapolateRight: 'clamp',
			easing: Easing.inOut(Easing.cubic),
		});
		return lerpSlot(heroTransform, restSlot, t);
	}

	if (frame < finaleGrowStart) {
		return {...restSlot, opacity: 1};
	}

	const finaleGrowEnd = finaleGrowStart + finaleGrowDuration;
	if (frame < finaleGrowEnd) {
		const t = interpolate(frame, [finaleGrowStart, finaleGrowEnd], [0, 1], {
			extrapolateLeft: 'clamp',
			extrapolateRight: 'clamp',
			easing: Easing.out(Easing.cubic),
		});
		return lerpSlot(restSlot, finaleSlot, t);
	}

	if (frame < flipDownStart) {
		return {...finaleSlot, opacity: 1};
	}

	const flipProgress = interpolate(frame, [flipDownStart, flipDownStart + flipDownDuration], [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
		easing: Easing.in(Easing.cubic),
	});
	return {
		x: finaleSlot.x,
		y: finaleSlot.y + flipProgress * 140,
		scale: finaleSlot.scale,
		rotate: finaleSlot.rotate,
		opacity: interpolate(flipProgress, [0, 0.7, 1], [1, 1, 0], {
			extrapolateLeft: 'clamp',
			extrapolateRight: 'clamp',
		}),
	};
};

/** Maps a cutout's current render scale to a shadow "elevation" — bigger
 * (more foreground) reads with a bolder shadow, smaller (receded into the
 * background skyline) with a fainter, tighter one. */
export const elevationFromScale = (scale: number): number => Math.max(0.35, Math.min(1.6, scale * 1.4));

export const transformToCss = (t: Transform, extraRotate = 0): CSSProperties => ({
	position: 'absolute',
	left: '50%',
	top: '50%',
	transform: `translate(calc(-50% + ${t.x}px), calc(-50% + ${t.y}px)) scale(${t.scale}) rotate(${t.rotate + extraRotate}deg)`,
	opacity: t.opacity,
});

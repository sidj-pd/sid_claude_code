import {Easing, interpolate} from 'remotion';
import {B1_SETUP, B2_TURN, B3_TOWER, B4_GARDEN, B5_METRO, B6_SIGN, B7_GRIDLOCK, B8_TITLE, END} from './beats';

/**
 * A single virtual camera over the whole collage. Every cutout lives at a
 * fixed spot in world space and the camera moves over it — which is what
 * gives the montage its shot language (push-in, whip-tilt, pull-back)
 * instead of a locked frame with things swapping in and out of it.
 *
 * `focusY` is the world Y the camera centres on; `scale` is the zoom.
 */
type CameraKey = {frame: number; focusY: number; scale: number};

const KEYS: CameraKey[] = [
	// Beat 1 — slow, majestic push-in. Sell the dignity before undercutting it.
	{frame: B1_SETUP, focusY: -10, scale: 0.9},
	{frame: B2_TURN, focusY: 90, scale: 0.98},
	// Beat 2 — locked off. The auto parks and we simply hold. Comedy is in the stillness.
	{frame: B3_TOWER, focusY: 130, scale: 0.98},
	// Beat 3 — whip-tilt up chasing the tower, and deliberately fail to contain it.
	{frame: B3_TOWER + 26, focusY: -380, scale: 0.88},
	{frame: B4_GARDEN, focusY: -450, scale: 0.84},
	// Beats 4-6 — keep pulling back, because more keeps arriving than fits.
	{frame: B5_METRO, focusY: -60, scale: 0.78},
	{frame: B6_SIGN, focusY: -300, scale: 0.73},
	{frame: B7_GRIDLOCK, focusY: -120, scale: 0.7},
	// Beat 7 — frozen wide on the jam.
	{frame: B8_TITLE, focusY: -120, scale: 0.7},
	// Beat 8 — a last, barely-perceptible drift so the title card isn't dead still.
	{frame: END, focusY: -120, scale: 0.68},
];

const sample = (frame: number, field: 'focusY' | 'scale'): number => {
	for (let i = 0; i < KEYS.length - 1; i++) {
		const a = KEYS[i];
		const b = KEYS[i + 1];
		if (frame <= b.frame) {
			return interpolate(frame, [a.frame, b.frame], [a[field], b[field]], {
				extrapolateLeft: 'clamp',
				extrapolateRight: 'clamp',
				easing: Easing.inOut(Easing.cubic),
			});
		}
	}
	return KEYS[KEYS.length - 1][field];
};

export type Camera = {focusY: number; scale: number};

export const cameraAt = (frame: number): Camera => ({
	focusY: sample(frame, 'focusY'),
	scale: sample(frame, 'scale'),
});

/**
 * Impact shake, used when something lands hard (the sign drop, the title
 * stamp). Decays fast so it punctuates rather than wobbles.
 */
export const shakeAt = (frame: number, impactFrame: number, amplitude: number): number => {
	const age = frame - impactFrame;
	if (age < 0 || age > 12) {
		return 0;
	}
	return Math.sin(age * 1.9) * amplitude * Math.exp(-age / 3.5);
};

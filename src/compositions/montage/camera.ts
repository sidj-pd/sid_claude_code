import {Easing, interpolate} from 'remotion';
import {
	B1_SOUDHA,
	B2_ROAD,
	B3_AUTO,
	B4_SIGNAL,
	B5_TOWER,
	B6_GARDEN,
	B7_METRO,
	B8_BARRICADE,
	B9_GRIDLOCK,
	B10_DOSA,
	B11_TITLE,
	END,
} from './beats';

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
	// Beat 1 — slow, dignified push-in. Sell it straight before undercutting it.
	{frame: B1_SOUDHA, focusY: -40, scale: 0.86},
	// Beat 2 — tilt down to the road as it slams in under the monument.
	{frame: B2_ROAD, focusY: 200, scale: 0.92},
	// Beat 3 — ride along with the auto, close enough that the bouncing reads.
	{frame: B3_AUTO, focusY: 330, scale: 1.02},
	{frame: B4_SIGNAL, focusY: 300, scale: 0.98},
	// Beat 4 — ease back so the signal towering over the stopped auto fits.
	{frame: B5_TOWER, focusY: 170, scale: 0.88},
	// Beat 5 — whip-tilt up chasing the tower, and deliberately fail to hold it.
	{frame: B5_TOWER + 24, focusY: -330, scale: 0.84},
	{frame: B6_GARDEN, focusY: -420, scale: 0.82},
	// Beats 6-8 — keep pulling back, because more keeps arriving than fits.
	{frame: B7_METRO, focusY: -140, scale: 0.77},
	{frame: B8_BARRICADE, focusY: -300, scale: 0.72},
	{frame: B9_GRIDLOCK, focusY: -110, scale: 0.68},
	// Beat 9 — frozen wide on the jam.
	{frame: B10_DOSA, focusY: -110, scale: 0.68},
	{frame: B11_TITLE, focusY: -90, scale: 0.68},
	// A last, barely-perceptible drift so the title card isn't dead still.
	{frame: END, focusY: -90, scale: 0.66},
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
 * Impact shake, used when something lands hard (the road slam, the sign
 * drop, the title stamp). Decays fast so it punctuates rather than wobbles.
 */
export const shakeAt = (frame: number, impactFrame: number, amplitude: number): number => {
	const age = frame - impactFrame;
	if (age < 0 || age > 12) {
		return 0;
	}
	return Math.sin(age * 1.9) * amplitude * Math.exp(-age / 3.5);
};

import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {CollageBackdrop} from '../components/CollageBackdrop';
import {CityScene} from './montage/CityScene';
import {TitleFinale} from './montage/TitleFinale';
import {B2_TURN, B6_SIGN, B7_GRIDLOCK, B8_TITLE, END} from './montage/beats';
import {cameraAt} from './montage/camera';

export const OPENING_MONTAGE_DURATION_IN_FRAMES = END;
export const OPENING_MONTAGE_FPS = 30;
export const OPENING_MONTAGE_WIDTH = 1080;
export const OPENING_MONTAGE_HEIGHT = 1920;

/**
 * BIZZARO BANGALORE — opening montage, 360 frames (12s @ 30fps).
 *
 * Premise: the city keeps trying to take a dignified portrait of itself and
 * keeps photobombing it. Beat 1 sets up the prestige shot; beat 2 undercuts
 * it (an auto parks dead centre and never leaves); beats 3-6 pile on faster
 * and faster until the frame can't hold everything; beat 7 jams solid; the
 * title stamps down on the mess.
 *
 * Every cutout lives at a fixed spot in world space (`world.ts`) and a
 * single virtual camera (`camera.ts`) moves over it, so the piece has actual
 * shot language — push-in, whip-tilt, progressive pull-back — rather than a
 * locked frame with elements swapping in and out.
 */
export const OpeningMontage: React.FC = () => {
	const frame = useCurrentFrame();
	const camera = cameraAt(frame);

	// The backdrop escalates with the pile-up: warmer and brighter while the
	// city is still behaving, dimmer and closing in once it isn't.
	const chaos = interpolate(frame, [B2_TURN, B6_SIGN, B7_GRIDLOCK], [0, 0.75, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});
	// Snap to the title card late and hard. Ramping it earlier just muddies
	// the gridlock beat, which should still read as paper.
	const blackout = interpolate(frame, [B8_TITLE - 3, B8_TITLE + 7], [0, 0.86], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});

	return (
		<AbsoluteFill>
			<CollageBackdrop chaos={chaos} blackout={blackout} />
			<CityScene camera={camera} />
			<TitleFinale />
		</AbsoluteFill>
	);
};

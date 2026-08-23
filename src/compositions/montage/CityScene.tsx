import React from 'react';
import {AbsoluteFill, Easing, interpolate, useCurrentFrame} from 'remotion';
import {CutoutAsset} from '../../assets/cutouts';
import {PaperCutout} from '../../components/PaperCutout';
import {usePopIn} from '../../components/usePopIn';
import {useStopMotionStep} from '../../components/useStopMotionStep';
import {AUTO_PARKED, AUTO_PUFF, B2_TURN, B3_TOWER, B4_GARDEN, B5_METRO, B6_SIGN, B7_GRIDLOCK} from './beats';
import {Camera, shakeAt} from './camera';
import {WORLD} from './world';

/** Per-cutout offset from its final world placement, driving its entrance. */
type Entrance = {dx: number; dy: number; scale: number; rotate: number; opacity: number};

const SETTLED: Entrance = {dx: 0, dy: 0, scale: 1, rotate: 0, opacity: 1};

const Cutout: React.FC<{
	asset: CutoutAsset;
	entrance: Entrance;
	camera: Camera;
}> = ({asset, entrance, camera}) => {
	const place = WORLD[asset];
	if (entrance.opacity <= 0) {
		return null;
	}

	// World -> screen: offset by the camera focus, then scale about frame centre.
	const worldX = place.x + entrance.dx;
	const worldY = place.y + entrance.dy - camera.focusY;

	return (
		<div
			style={{
				position: 'absolute',
				left: '50%',
				top: '50%',
				width: place.width,
				height: place.height,
				marginLeft: -place.width / 2,
				marginTop: -place.height / 2,
				transform: `translate(${worldX * camera.scale}px, ${worldY * camera.scale}px) scale(${camera.scale * entrance.scale}) rotate(${place.rotate + entrance.rotate}deg)`,
				opacity: entrance.opacity,
				zIndex: place.z,
			}}
		>
			<PaperCutout asset={asset} textureOpacity={0} elevation={place.elevation} />
		</div>
	);
};

/**
 * Every cutout in the collage, each with its own entrance, all viewed
 * through one shared camera. Assets never leave once they arrive — the
 * frame just keeps accumulating until it can't hold any more, which is the
 * montage's whole argument.
 */
export const CityScene: React.FC<{camera: Camera}> = ({camera}) => {
	const frame = useCurrentFrame();

	// --- Beat 1: the assembly building settles in, calm and centred.
	const soudhaIn = interpolate(frame, [0, 22], [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
		easing: Easing.out(Easing.cubic),
	});
	const soudha: Entrance = {
		dx: 0,
		dy: interpolate(soudhaIn, [0, 1], [70, 0]),
		scale: interpolate(soudhaIn, [0, 1], [0.94, 1]),
		rotate: 0,
		opacity: soudhaIn,
	};

	// --- Beat 2: the auto putters in from the left in stop-motion hops,
	// decelerates hard, and parks dead centre. Then it never moves again.
	const autoLocal = frame - B2_TURN;
	const {stepIndex} = useStopMotionStep(Math.max(0, autoLocal), 5);
	const autoTravel = interpolate(stepIndex * 5, [0, AUTO_PARKED - B2_TURN], [-1250, 0], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
		easing: Easing.out(Easing.quad),
	});
	const autoSettling = autoLocal < AUTO_PARKED - B2_TURN;
	const auto: Entrance = {
		dx: autoTravel,
		dy: 0,
		scale: 1,
		// A little chassis bounce while rolling, dead still once parked.
		rotate: autoSettling ? (stepIndex % 2 === 0 ? -1.1 : 1.1) : 0,
		opacity: autoLocal >= 0 ? 1 : 0,
	};

	const puffAge = frame - AUTO_PUFF;
	const puffAlive = puffAge >= 0 && puffAge < 26;
	const puff: Entrance = {
		dx: interpolate(puffAge, [0, 26], [0, -120], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}),
		dy: interpolate(puffAge, [0, 26], [0, -70], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}),
		scale: interpolate(puffAge, [0, 26], [0.45, 1.5], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}),
		rotate: 0,
		opacity: puffAlive
			? interpolate(puffAge, [0, 5, 26], [0, 0.7, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})
			: 0,
	};

	// --- Beat 3: the tower erupts from below the skyline, far too fast and
	// far too tall, overshooting before it settles back down.
	const towerIn = interpolate(frame, [B3_TOWER, B3_TOWER + 20], [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
		easing: Easing.out(Easing.back(1.7)),
	});
	const tower: Entrance = {
		dx: 0,
		dy: interpolate(towerIn, [0, 1], [1150, 0]),
		scale: 1,
		rotate: interpolate(towerIn, [0, 1], [-4, 0]),
		opacity: frame >= B3_TOWER ? 1 : 0,
	};

	// --- Beat 4: Lalbagh shoulders in from the left.
	const gardenPop = usePopIn(frame, {delay: B4_GARDEN, damping: 11, stiffness: 150});
	const garden: Entrance = {
		dx: interpolate(gardenPop, [0, 1], [-780, 0]),
		dy: 0,
		scale: 1,
		rotate: interpolate(gardenPop, [0, 1], [-8, 0]),
		opacity: frame >= B4_GARDEN ? 1 : 0,
	};

	// --- Beat 5: the metro slams across the top, serene and fast.
	const metroIn = interpolate(frame, [B5_METRO, B5_METRO + 22], [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
		easing: Easing.out(Easing.cubic),
	});
	const metro: Entrance = {
		dx: interpolate(metroIn, [0, 1], [-2000, 0]),
		dy: 0,
		scale: 1,
		rotate: 0,
		opacity: frame >= B5_METRO ? 1 : 0,
	};

	// --- Beat 6: the sign drops in hard from above and everything collides.
	const signPop = usePopIn(frame, {delay: B6_SIGN, damping: 8, stiffness: 190});
	const sign: Entrance = {
		dx: 0,
		dy: interpolate(signPop, [0, 1], [-1000, 0]),
		scale: 1,
		rotate: interpolate(signPop, [0, 1], [-11, 0]),
		opacity: frame >= B6_SIGN ? 1 : 0,
	};

	// --- Beat 7: the whole jam shudders once, then locks solid.
	const jolt = shakeAt(frame, B7_GRIDLOCK, 5.5);

	return (
		<AbsoluteFill style={{transform: `translateY(${jolt}px)`}}>
			<Cutout asset="namma-metro" entrance={metro} camera={camera} />
			<Cutout asset="it-park-building" entrance={tower} camera={camera} />
			<Cutout asset="vidhana-soudha" entrance={soudha} camera={camera} />
			<Cutout asset="lalbagh-glass-house" entrance={garden} camera={camera} />
			<Cutout asset="mg-road-signage" entrance={sign} camera={camera} />
			<Cutout asset="exhaust-puff" entrance={puff} camera={camera} />
			<Cutout asset="auto-rickshaw" entrance={auto} camera={camera} />
		</AbsoluteFill>
	);
};

export {SETTLED};

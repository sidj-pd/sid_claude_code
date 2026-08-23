import React from 'react';
import {AbsoluteFill, Easing, interpolate, useCurrentFrame} from 'remotion';
import {CutoutAsset} from '../../assets/cutouts';
import {PaperCutout} from '../../components/PaperCutout';
import {usePopIn} from '../../components/usePopIn';
import {
	AUTO_STOP_PUFF,
	B2_ROAD,
	B3_AUTO,
	B4_SIGNAL,
	B5_TOWER,
	B6_GARDEN,
	B7_METRO,
	B8_SIGN,
	B9_GRIDLOCK,
	B10_DOSA,
} from './beats';
import {Camera, shakeAt} from './camera';
import {WORLD} from './world';

/** Per-cutout offset from its final world placement, driving its entrance. */
type Entrance = {dx: number; dy: number; scale: number; rotate: number; opacity: number};

const clamp01 = (v: number) => Math.max(0, Math.min(1, v));

const Cutout: React.FC<{asset: CutoutAsset; entrance: Entrance; camera: Camera}> = ({
	asset,
	entrance,
	camera,
}) => {
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
 * through one shared camera. Nothing ever leaves once it arrives — the
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

	// --- Beat 2: the road it's actually standing on slams down into frame.
	const roadIn = interpolate(frame, [B2_ROAD, B2_ROAD + 12], [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
		easing: Easing.out(Easing.back(1.4)),
	});
	const road: Entrance = {
		dx: 0,
		dy: interpolate(roadIn, [0, 1], [620, 0]),
		scale: 1,
		rotate: 0,
		opacity: frame >= B2_ROAD ? 1 : 0,
	};

	// --- Beat 3: the auto bounces the length of that road, catching every
	// pothole, then brakes hard at the red light and never moves again.
	const rideT = clamp01((frame - B3_AUTO) / (B4_SIGNAL - B3_AUTO));
	const travelling = frame < B4_SIGNAL;
	const autoX = interpolate(rideT, [0, 1], [-1750, 0], {easing: Easing.out(Easing.quad)});

	// Four hops across the ride; |sin| launches it off each crater lip, and
	// the tilt follows the vertical velocity so the nose pitches up on the
	// way out and drops on the way back down.
	const hopPhase = rideT * Math.PI * 4.2;
	const hopLift = travelling ? Math.abs(Math.sin(hopPhase)) : 0;
	const braking = shakeAt(frame, B4_SIGNAL, 4.5);

	const auto: Entrance = {
		dx: autoX,
		dy: travelling ? -hopLift * 105 : 0,
		scale: 1,
		rotate: travelling ? Math.cos(hopPhase) * 9 : braking,
		opacity: frame >= B3_AUTO ? 1 : 0,
	};

	// A puff on each landing while bouncing, plus one when the brakes bite.
	const puffAge = frame - AUTO_STOP_PUFF;
	const puff: Entrance = {
		dx: interpolate(puffAge, [0, 26], [0, -150], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}),
		dy: interpolate(puffAge, [0, 26], [0, -80], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}),
		scale: interpolate(puffAge, [0, 26], [0.4, 1.6], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}),
		rotate: 0,
		opacity:
			puffAge >= 0 && puffAge < 26
				? interpolate(puffAge, [0, 5, 26], [0, 0.72, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})
				: 0,
	};

	// --- Beat 4: the signal drops in and goes red. 180 seconds.
	const signalPop = usePopIn(frame, {delay: B4_SIGNAL, damping: 9, stiffness: 200});
	const signal: Entrance = {
		dx: 0,
		dy: interpolate(signalPop, [0, 1], [-900, 0]),
		scale: 1,
		rotate: interpolate(signalPop, [0, 1], [-7, 0]),
		opacity: frame >= B4_SIGNAL ? 1 : 0,
	};

	// --- Beat 5: the tower erupts from below, far too fast and far too tall.
	const towerIn = interpolate(frame, [B5_TOWER, B5_TOWER + 20], [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
		easing: Easing.out(Easing.back(1.7)),
	});
	const tower: Entrance = {
		dx: 0,
		dy: interpolate(towerIn, [0, 1], [1150, 0]),
		scale: 1,
		rotate: interpolate(towerIn, [0, 1], [-4, 0]),
		opacity: frame >= B5_TOWER ? 1 : 0,
	};

	// --- Beat 6: Lalbagh shoulders in from the left.
	const gardenPop = usePopIn(frame, {delay: B6_GARDEN, damping: 11, stiffness: 150});
	const garden: Entrance = {
		dx: interpolate(gardenPop, [0, 1], [-880, 0]),
		dy: 0,
		scale: 1,
		rotate: interpolate(gardenPop, [0, 1], [-8, 0]),
		opacity: frame >= B6_GARDEN ? 1 : 0,
	};

	// --- Beat 7: the metro slams across the top, serene and fast.
	const metroIn = interpolate(frame, [B7_METRO, B7_METRO + 20], [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
		easing: Easing.out(Easing.cubic),
	});
	const metro: Entrance = {
		dx: interpolate(metroIn, [0, 1], [-2100, 0]),
		dy: 0,
		scale: 1,
		rotate: 0,
		opacity: frame >= B7_METRO ? 1 : 0,
	};

	// --- Beat 8: the sign drops hard and everything collides.
	const signPop = usePopIn(frame, {delay: B8_SIGN, damping: 8, stiffness: 190});
	const sign: Entrance = {
		dx: 0,
		dy: interpolate(signPop, [0, 1], [-1000, 0]),
		scale: 1,
		rotate: interpolate(signPop, [0, 1], [-11, 0]),
		opacity: frame >= B8_SIGN ? 1 : 0,
	};

	// --- Beat 10: the dosa. Everything else slammed, erupted or dropped;
	// this glides in unhurried and lands perfectly. That contrast is the joke.
	const dosaIn = interpolate(frame, [B10_DOSA, B10_DOSA + 18], [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
		easing: Easing.out(Easing.cubic),
	});
	const dosa: Entrance = {
		dx: interpolate(dosaIn, [0, 1], [420, 0]),
		dy: interpolate(dosaIn, [0, 1], [180, 0]),
		scale: interpolate(dosaIn, [0, 1], [0.86, 1]),
		rotate: 0,
		opacity: frame >= B10_DOSA ? dosaIn : 0,
	};

	// Whole-frame impacts: the road landing, the sign landing, the jam locking.
	const jolt =
		shakeAt(frame, B2_ROAD + 10, 7) + shakeAt(frame, B8_SIGN + 8, 6) + shakeAt(frame, B9_GRIDLOCK, 5.5);

	return (
		<AbsoluteFill style={{transform: `translateY(${jolt}px)`}}>
			<Cutout asset="namma-metro" entrance={metro} camera={camera} />
			<Cutout asset="it-park-building" entrance={tower} camera={camera} />
			<Cutout asset="vidhana-soudha" entrance={soudha} camera={camera} />
			<Cutout asset="lalbagh-glass-house" entrance={garden} camera={camera} />
			<Cutout asset="pothole-road" entrance={road} camera={camera} />
			<Cutout asset="mg-road-signage" entrance={sign} camera={camera} />
			<Cutout asset="traffic-signal" entrance={signal} camera={camera} />
			<Cutout asset="exhaust-puff" entrance={puff} camera={camera} />
			<Cutout asset="auto-rickshaw" entrance={auto} camera={camera} />
			<Cutout asset="masala-dosa" entrance={dosa} camera={camera} />
		</AbsoluteFill>
	);
};

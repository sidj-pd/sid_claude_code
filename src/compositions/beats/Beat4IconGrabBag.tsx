import React from 'react';
import {AbsoluteFill, Sequence, interpolate, useCurrentFrame} from 'remotion';
import {PageFlipTransition} from '../../components/PageFlipTransition';
import {PaperCutout} from '../../components/PaperCutout';
import {GlassShimmer} from '../../components/GlassShimmer';
import {usePopIn} from '../../components/usePopIn';

const CARD_STYLE: React.CSSProperties = {
	backgroundColor: '#f6f1e6',
	justifyContent: 'center',
	alignItems: 'center',
};
const CARD_SIZE = {width: 820, height: 615};

const LALBAGH_DURATION = 45;
const LALBAGH_FLIP = 6;

const LalbaghSubBeat: React.FC = () => {
	const frame = useCurrentFrame();
	const pop = usePopIn(frame, {damping: 9, stiffness: 150});

	return (
		<PageFlipTransition totalDurationInFrames={LALBAGH_DURATION} durationInFrames={LALBAGH_FLIP} sfxPlaybackRate={1}>
			<AbsoluteFill style={CARD_STYLE}>
				<div style={{...CARD_SIZE, transform: `scale(${pop})`, position: 'relative'}}>
					<PaperCutout asset="lalbagh-glass-house" textureOpacity={0} />
					<GlassShimmer frame={frame} startFrame={12} durationInFrames={16} />
				</div>
			</AbsoluteFill>
		</PageFlipTransition>
	);
};

const METRO_DURATION = 30;
const METRO_FLIP = 5;

const MetroSubBeat: React.FC = () => {
	const frame = useCurrentFrame();
	// whoosh pass-through: slides edge-to-edge across the whole sub-beat
	const x = interpolate(frame, [0, METRO_DURATION], [-1300, 1300], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});
	const speedLineOpacity = interpolate(frame, [0, 4, METRO_DURATION - 6, METRO_DURATION], [0, 1, 1, 0], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});

	return (
		<PageFlipTransition totalDurationInFrames={METRO_DURATION} durationInFrames={METRO_FLIP} sfxPlaybackRate={1.15}>
			<AbsoluteFill style={CARD_STYLE}>
				{[0, 1, 2].map((i) => (
					<div
						key={i}
						style={{
							position: 'absolute',
							left: 0,
							right: 0,
							top: `${38 + i * 8}%`,
							height: 3,
							backgroundColor: '#c9a877',
							opacity: speedLineOpacity * (0.5 - i * 0.15),
						}}
					/>
				))}
				<div style={{...CARD_SIZE, transform: `translateX(${x}px)`}}>
					<PaperCutout asset="namma-metro" textureOpacity={0} />
				</div>
			</AbsoluteFill>
		</PageFlipTransition>
	);
};

const MG_ROAD_DURATION = 45;
const MG_ROAD_FLIP = 4;
const MG_ROAD_DROP_IN = 14;

const MgRoadSubBeat: React.FC = () => {
	const frame = useCurrentFrame();
	const pop = usePopIn(frame, {damping: 7, stiffness: 130});
	const dropY = interpolate(pop, [0, 1], [-500, 0]);
	// gentle signpost sway once it's landed
	const swayStart = MG_ROAD_DROP_IN;
	const swayT = Math.max(0, frame - swayStart);
	const sway = frame > swayStart ? Math.sin(swayT / 7) * 2.5 * Math.exp(-swayT / 40) : 0;

	return (
		<PageFlipTransition totalDurationInFrames={MG_ROAD_DURATION} durationInFrames={MG_ROAD_FLIP} sfxPlaybackRate={1.3}>
			<AbsoluteFill style={CARD_STYLE}>
				<div
					style={{
						...CARD_SIZE,
						transform: `translateY(${dropY}px) rotate(${sway}deg)`,
						transformOrigin: 'top center',
					}}
				>
					<PaperCutout asset="mg-road-signage" textureOpacity={0} />
				</div>
			</AbsoluteFill>
		</PageFlipTransition>
	);
};

/**
 * Beat 4 — Icon Grab-bag, frames 180-300. Three quick sub-beats, each with
 * its own distinct "moment" rather than a generic pop/hold, and
 * progressively shorter flip transitions (6 -> 5 -> 4 frames) reinforcing
 * the accelerating rhythm.
 */
export const Beat4IconGrabBag: React.FC = () => {
	return (
		<AbsoluteFill>
			<Sequence from={0} durationInFrames={LALBAGH_DURATION}>
				<LalbaghSubBeat />
			</Sequence>
			<Sequence from={LALBAGH_DURATION} durationInFrames={METRO_DURATION}>
				<MetroSubBeat />
			</Sequence>
			<Sequence from={LALBAGH_DURATION + METRO_DURATION} durationInFrames={MG_ROAD_DURATION}>
				<MgRoadSubBeat />
			</Sequence>
		</AbsoluteFill>
	);
};

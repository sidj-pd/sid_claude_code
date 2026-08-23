import React from 'react';
import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';

export type RansomHeadlineTextProps = {
	text: string;
	/** frames of delay between each letter's entrance */
	letterStagger?: number;
	fontSize?: number;
	style?: React.CSSProperties;
};

const FONTS = [
	'Georgia, serif',
	'Impact, "Arial Narrow", sans-serif',
	'"Courier New", monospace',
	'"Times New Roman", serif',
	'"Arial Black", sans-serif',
];

const TILE_COLORS = ['#efe4c8', '#e7d9b8', '#f3ead2', '#ddcda3'];

// Deterministic pseudo-random in [-1, 1], seeded by index so every render
// (and every frame server) produces identical jitter for a given letter.
const seededUnit = (seed: number) => {
	const x = Math.sin(seed * 12.9898) * 43758.5453;
	return (x - Math.floor(x)) * 2 - 1;
};

/**
 * Kinetic-type headline: each character is its own rotated/clipped "cutout
 * tile" (varied font + size) that slams into place with a stagger, ransom
 * note style.
 */
export const RansomHeadlineText: React.FC<RansomHeadlineTextProps> = ({
	text,
	letterStagger = 2,
	fontSize = 64,
	style,
}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const letters = text.split('');

	return (
		<div
			style={{
				display: 'flex',
				flexWrap: 'wrap',
				justifyContent: 'center',
				alignItems: 'center',
				...style,
			}}
		>
			{letters.map((letter, i) => {
				const delay = i * letterStagger;
				const localFrame = frame - delay;

				const entrance = spring({
					frame: localFrame,
					fps,
					config: {damping: 11, mass: 0.6, stiffness: 180},
				});

				const rotation = seededUnit(i + 1) * 4;
				const sizeJitter = 1 + seededUnit(i + 7) * 0.15;
				const font = FONTS[i % FONTS.length];
				const bg = TILE_COLORS[i % TILE_COLORS.length];

				const scale = interpolate(entrance, [0, 1], [2.4, 1]);
				const opacity = interpolate(localFrame, [0, 1], [0, 1], {
					extrapolateLeft: 'clamp',
					extrapolateRight: 'clamp',
				});
				const translateY = interpolate(entrance, [0, 1], [-60, 0]);

				if (letter === ' ') {
					return <div key={i} style={{width: fontSize * 0.4}} />;
				}

				return (
					<span
						key={i}
						style={{
							display: 'inline-block',
							fontFamily: font,
							fontSize: fontSize * sizeJitter,
							fontWeight: 900,
							color: '#1c1712',
							backgroundColor: bg,
							padding: '2px 6px',
							margin: '0 1px',
							boxShadow: '2px 3px 0 rgba(0,0,0,0.3)',
							transform: `translateY(${translateY}px) rotate(${rotation}deg) scale(${scale})`,
							opacity,
							lineHeight: 1,
						}}
					>
						{letter}
					</span>
				);
			})}
		</div>
	);
};

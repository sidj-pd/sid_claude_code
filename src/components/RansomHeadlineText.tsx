import React from 'react';
import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {RANSOM_FONTS, loadRansomFonts} from './ransomFonts';

export type RansomHeadlineTextProps = {
	/** Split across multiple lines with "\n". */
	text: string;
	/** frames of delay between each letter's entrance */
	letterStagger?: number;
	fontSize?: number;
	style?: React.CSSProperties;
	/**
	 * Overrides the composition frame. Needed when the headline lives inside
	 * something that appears partway through a shot (a speech bubble, a stat
	 * card) and its stagger should run from that arrival, not from frame 0.
	 */
	frame?: number;
};

const FONTS = RANSOM_FONTS;

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
	frame: frameOverride,
}) => {
	loadRansomFonts();
	const currentFrame = useCurrentFrame();
	const frame = frameOverride ?? currentFrame;
	const {fps} = useVideoConfig();
	const lines = text.split('\n');

	// Stagger runs continuously across lines, so the whole headline reads as
	// one slam rather than restarting per line.
	let letterIndex = -1;

	return (
		<div
			style={{
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
				...style,
			}}
		>
			{lines.map((line, lineNo) => (
				<div
					key={lineNo}
					style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}
				>
					{line.split('').map((letter, colNo) => {
						letterIndex++;
						const i = letterIndex;
				const delay = i * letterStagger;
				const localFrame = frame - delay;

				const entrance = spring({
					frame: localFrame,
					fps,
					config: {damping: 11, mass: 0.6, stiffness: 180},
				});

				const rotation = seededUnit(i + 1) * 4;
				const sizeJitter = 1 + seededUnit(i + 7) * 0.15;
				// Seeded rather than sequential: a strict cycle through six faces
				// produces a visible repeating rhythm across a long word.
				const font = FONTS[Math.abs(Math.round(seededUnit(i + 19) * 1000)) % FONTS.length];
				const bg = TILE_COLORS[i % TILE_COLORS.length];

				const scale = interpolate(entrance, [0, 1], [2.4, 1]);
				const opacity = interpolate(localFrame, [0, 1], [0, 1], {
					extrapolateLeft: 'clamp',
					extrapolateRight: 'clamp',
				});
				const translateY = interpolate(entrance, [0, 1], [-60, 0]);

				if (letter === ' ') {
							return <div key={colNo} style={{width: fontSize * 0.4}} />;
						}

				return (
							<span
								key={colNo}
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
			))}
		</div>
	);
};

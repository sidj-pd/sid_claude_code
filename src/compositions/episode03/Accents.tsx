import React from 'react';
import {useCurrentFrame} from 'remotion';
import {useStopMotionStep} from '../../components/useStopMotionStep';
import {Arrive} from './Arrive';

/**
 * The accent layer: solid triangles, circles, squares, starbursts and drawn
 * squiggles scattered around a composition.
 *
 * These are the reference style's other half. Its own frames show each
 * composition twice — plain, then with accents — and the accents are what turn
 * an arrangement of cutouts into something that reads as designed. They carry
 * no meaning and are not illustration; they are punctuation.
 *
 * All drawn in code, deliberately. They are geometry, a generator renders them
 * worse than CSS does, and keeping them here means the density and the palette
 * are art-directable per shot rather than baked into art.
 */

export const MARK = '#8f3626';
export const INK = '#241d15';

export type AccentKind = 'triangle' | 'circle' | 'square' | 'burst' | 'squiggle' | 'eye';

export type Accent = {
	kind: AccentKind;
	/** Fractions of the frame. */
	x: number;
	y: number;
	size: number;
	at: number;
	rotate?: number;
	color?: string;
};

const FRAME_W = 1080;
const FRAME_H = 1920;

const Shape: React.FC<{kind: AccentKind; size: number; color: string}> = ({kind, size, color}) => {
	switch (kind) {
		case 'triangle':
			return (
				<svg width={size} height={size} viewBox="0 0 100 100">
					<polygon points="50,6 96,92 4,92" fill={color} />
				</svg>
			);
		case 'circle':
			return (
				<svg width={size} height={size} viewBox="0 0 100 100">
					<circle cx="50" cy="50" r="44" fill={color} />
				</svg>
			);
		case 'square':
			return (
				<svg width={size} height={size} viewBox="0 0 100 100">
					<rect x="10" y="10" width="80" height="80" fill={color} />
				</svg>
			);
		case 'burst':
			return (
				<svg width={size} height={size} viewBox="0 0 100 100">
					<polygon
						points="50,0 60,32 92,20 70,48 100,62 66,64 76,96 50,74 24,96 34,64 0,62 30,48 8,20 40,32"
						fill={color}
					/>
				</svg>
			);
		case 'squiggle':
			return (
				<svg width={size} height={size * 0.5} viewBox="0 0 100 50">
					<path
						d="M 4 34 Q 18 6 32 34 T 60 34 T 88 34"
						stroke={color}
						strokeWidth={9}
						strokeLinecap="round"
						fill="none"
					/>
				</svg>
			);
		case 'eye':
			return (
				<svg width={size} height={size * 0.6} viewBox="0 0 100 60">
					<path d="M 4 30 Q 50 -6 96 30 Q 50 66 4 30 Z" fill="none" stroke={color} strokeWidth={7} />
					<circle cx="50" cy="30" r="13" fill={color} />
				</svg>
			);
	}
};

/**
 * The whole accent set for a shot, each piece arriving on its own frame.
 *
 * They also breathe once placed — a pixel and a fraction of a degree on a slow
 * step grid, the same jitter every other piece of paper in the series has. A
 * dead-still accent reads as a sticker; a breathing one reads as cut paper.
 */
export const Accents: React.FC<{accents: Accent[]}> = ({accents}) => {
	const frame = useCurrentFrame();
	const {stepIndex: breath} = useStopMotionStep(frame, 11);

	return (
		<>
			{accents.map((a, i) => {
				const drift = ((breath + i) % 3) - 1;
				return (
					<div
						key={`${a.kind}-${i}`}
						style={{
							position: 'absolute',
							left: a.x * FRAME_W,
							top: a.y * FRAME_H + drift,
							zIndex: 55,
						}}
					>
						<Arrive at={a.at} tilt={6} rotate={a.rotate ?? 0} distance={18}>
							<Shape kind={a.kind} size={a.size} color={a.color ?? MARK} />
						</Arrive>
					</div>
				);
			})}
		</>
	);
};

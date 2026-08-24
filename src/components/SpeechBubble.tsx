import React from 'react';
import {SPEECH_FONT} from './fonts';

export {SPEECH_FONT};

export type SpeechBubbleProps = {
	text: string;
	width?: number;
	height?: number;
	fontSize?: number;
	/** Where the tail leaves the oval, in degrees. 90 = straight down. */
	tailAngle?: number;
	/** How far past the oval the tail reaches, relative to the y radius. */
	tailLength?: number;
	/** Mirror the tail's lean, for a speaker on the opposite side. */
	flip?: boolean;
};

const TAIL_HALF_WIDTH = 11; // degrees of the oval the tail's base spans

/**
 * A classic oval speech balloon.
 *
 * Drawn as one closed path — an arc around the oval, out to the tail tip and
 * back — rather than an ellipse with a separate triangle stuck on. Two
 * overlapping shapes would show a seam where their strokes cross.
 */
export const SpeechBubble: React.FC<SpeechBubbleProps> = ({
	text,
	width = 720,
	height = 420,
	fontSize = 92,
	tailAngle = 105,
	tailLength = 0.42,
	flip = false,
}) => {
	const cx = 100;
	const cy = 100;
	const rx = 96;
	const ry = 78;

	const rad = (d: number) => (d * Math.PI) / 180;
	const start = tailAngle + TAIL_HALF_WIDTH;
	const end = tailAngle - TAIL_HALF_WIDTH + 360;

	// Walk the oval from just past the tail all the way round to just before
	// it, then run out to the tip and close.
	const steps = 96;
	const pts: string[] = [];
	for (let i = 0; i <= steps; i++) {
		const a = rad(start + ((end - start) * i) / steps);
		pts.push(`${(cx + Math.cos(a) * rx).toFixed(2)},${(cy + Math.sin(a) * ry).toFixed(2)}`);
	}
	const tipAngle = rad(tailAngle + (flip ? -14 : 14));
	const tipR = 1 + tailLength;
	pts.push(
		`${(cx + Math.cos(tipAngle) * rx * tipR).toFixed(2)},${(cy + Math.sin(tipAngle) * ry * tipR).toFixed(2)}`,
	);

	return (
		<div style={{position: 'relative', width, height}}>
			<svg
				viewBox={`0 0 200 ${100 + ry * (1 + tailLength) + 6}`}
				width="100%"
				height="100%"
				preserveAspectRatio="none"
				style={{
					position: 'absolute',
					inset: 0,
					filter:
						'drop-shadow(0 2px 3px rgba(48,34,18,0.30)) drop-shadow(0 12px 20px rgba(48,34,18,0.24))',
				}}
			>
				<polygon points={pts.join(' ')} fill="#f8f3e6" stroke="#2a231a" strokeWidth="2.4" strokeLinejoin="round" />
			</svg>
			<div
				style={{
					position: 'absolute',
					left: 0,
					right: 0,
					top: 0,
					height: `${((cy + ry) / (100 + ry * (1 + tailLength) + 6)) * 100}%`,
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					padding: '0 12%',
				}}
			>
				<span
					style={{
						fontFamily: SPEECH_FONT,
						fontSize,
						color: '#221c14',
						letterSpacing: 1.5,
						lineHeight: 1,
						textAlign: 'center',
					}}
				>
					{text}
				</span>
			</div>
		</div>
	);
};

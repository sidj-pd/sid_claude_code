import React from 'react';
import {RansomHeadlineText} from './RansomHeadlineText';

export type RansomSpeechBubbleProps = {
	text: string;
	/** Local frame; letters are staggered off this. */
	frame: number;
	fontSize?: number;
	/** Which side of the bubble's underside the tail drops from, 0–1. */
	tailAt?: number;
	width?: number;
	height?: number;
	seed?: number;
};

// Deterministic jitter, so a given seed always tears the same way — the
// bubble must not reshape itself frame to frame.
const wobble = (seed: number) => {
	const x = Math.sin(seed * 12.9898) * 43758.5453;
	return (x - Math.floor(x)) * 2 - 1;
};

/**
 * A speech bubble torn out of paper, holding ransom-note lettering.
 *
 * The outline is generated as an irregular polygon rather than a rounded
 * rect: a clean ellipse reads as a comic-book balloon and fights the
 * collage, while a ragged edge reads as something actually cut out with
 * scissors and laid on the page.
 */
export const RansomSpeechBubble: React.FC<RansomSpeechBubbleProps> = ({
	text,
	frame,
	fontSize = 74,
	tailAt = 0.32,
	width = 860,
	height = 420,
	seed = 4,
}) => {
	const w = 100;
	const h = 100;
	const points: string[] = [];
	const perSide = 7;
	const rough = 2.6;

	// Walk the perimeter, nudging each vertex off the true edge.
	for (let i = 0; i < perSide; i++) {
		const t = i / perSide;
		points.push(`${t * w + wobble(seed + i) * rough},${wobble(seed + i + 40) * rough}`);
	}
	for (let i = 0; i < perSide; i++) {
		const t = i / perSide;
		points.push(`${w + wobble(seed + i + 80) * rough},${t * h + wobble(seed + i + 120) * rough}`);
	}
	// Bottom edge, interrupted by the tail.
	const tailStart = 1 - tailAt;
	for (let i = 0; i < perSide; i++) {
		const t = 1 - i / perSide;
		if (t > tailStart - 0.09 && t < tailStart + 0.09) {
			continue;
		}
		points.push(`${t * w + wobble(seed + i + 160) * rough},${h + wobble(seed + i + 200) * rough}`);
		if (t >= tailStart + 0.09 && t - 1 / perSide <= tailStart + 0.09) {
			// drop the tail down toward the speaker
			points.push(`${tailStart * w + 5},${h + 2}`);
			points.push(`${tailStart * w - 3},${h + 26}`);
			points.push(`${tailStart * w - 7},${h + 1}`);
		}
	}
	for (let i = 0; i < perSide; i++) {
		const t = 1 - i / perSide;
		points.push(`${wobble(seed + i + 240) * rough},${t * h + wobble(seed + i + 280) * rough}`);
	}

	const shape = points.join(' ');

	return (
		<div style={{position: 'relative', width, height}}>
			<svg
				viewBox={`-4 -4 ${w + 8} ${h + 36}`}
				width="100%"
				height="100%"
				preserveAspectRatio="none"
				style={{
					position: 'absolute',
					inset: 0,
					filter: 'drop-shadow(0 3px 4px rgba(48,34,18,0.32)) drop-shadow(0 14px 22px rgba(48,34,18,0.26))',
				}}
			>
				<polygon points={shape} fill="#f7f1e1" stroke="#e0d5bb" strokeWidth="0.6" />
			</svg>
			<div
				style={{
					position: 'absolute',
					inset: 0,
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					padding: '4% 6%',
				}}
			>
				<RansomHeadlineText text={text} frame={frame} letterStagger={2} fontSize={fontSize} />
			</div>
		</div>
	);
};

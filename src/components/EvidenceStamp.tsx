import React from 'react';
import {interpolate} from 'remotion';
import {useStopMotionStep} from './useStopMotionStep';

export type EvidenceStampProps = {
	text: string;
	/** Frames since the stamp landed. Negative means it has not yet. */
	age: number;
	fontSize?: number;
	rotate?: number;
	color?: string;
	style?: React.CSSProperties;
};

/**
 * A rubber-stamped evidence tag: ruled box, typewriter face, worn ink.
 *
 * It arrives the way a stamp does — over-inked and a fraction too big on the
 * first frame, then down to size — rather than fading up. Two stepped poses,
 * no easing between them, so it belongs to the same animation grain as the
 * paper puppets.
 */
export const EvidenceStamp: React.FC<EvidenceStampProps> = ({
	text,
	age,
	fontSize = 34,
	rotate = -2.5,
	color = '#8f3626',
	style,
}) => {
	if (age < 0) return null;

	// Frame 0 is the impact; frame 2 onwards is where it stays.
	const scale = age < 2 ? 1.16 : 1;
	const opacity = interpolate(age, [0, 1, 3], [0.75, 1, 0.88], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});

	return (
		<div
			style={{
				fontFamily: 'RansomSpecialElite, monospace',
				fontSize,
				letterSpacing: fontSize * 0.06,
				color,
				border: `${Math.max(3, fontSize * 0.1)}px solid ${color}`,
				borderRadius: 4,
				padding: `${fontSize * 0.22}px ${fontSize * 0.5}px`,
				lineHeight: 1.1,
				textAlign: 'center',
				whiteSpace: 'pre-line',
				transform: `rotate(${rotate}deg) scale(${scale})`,
				opacity,
				...style,
			}}
		>
			{text}
		</div>
	);
};

export type ArrowTagProps = {
	/** Frames since it landed. */
	age: number;
	/** Length of the shaft in px; it points down-left from the label. */
	length?: number;
	color?: string;
};

/**
 * The little hand-drawn arrow that goes with a tag when it has to point at
 * something too small to label in place. It points up and to the right, from
 * the tag towards the thing, and draws itself on in stepped chunks — an ink
 * line being pulled across paper, not a shape fading up.
 */
export const ArrowTag: React.FC<ArrowTagProps> = ({age, length = 150, color = '#8f3626'}) => {
	const {stepIndex} = useStopMotionStep(Math.max(0, age), 2);
	const drawn = interpolate(stepIndex, [0, 4], [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});
	if (age < 0) return null;

	return (
		<svg width={length} height={length} viewBox="0 0 100 100" style={{overflow: 'visible'}}>
			<path
				d="M 8 92 L 78 22"
				stroke={color}
				strokeWidth={7}
				strokeLinecap="round"
				fill="none"
				pathLength={1}
				strokeDasharray={1}
				strokeDashoffset={1 - drawn}
			/>
			{drawn >= 1 ? <path d="M 90 10 L 80 36 L 64 20 Z" fill={color} /> : null}
		</svg>
	);
};

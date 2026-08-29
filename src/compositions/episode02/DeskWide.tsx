import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {PaperCutout} from '../../components/PaperCutout';
import {useStopMotionStep} from '../../components/useStopMotionStep';
import {
	BREATH_STEP,
	CLOCK_CENTRE_X,
	CLOCK_CENTRE_Y,
	CLOCK_FACE_RADIUS,
	CLOCK_HOUR,
	CLOCK_MINUTE,
	TICK_FRAMES,
} from './shot01/beats';

const CLOCK_SIZE = 390;

/**
 * The clock's hands, drawn rather than generated — which is why the art was
 * commissioned without them. Cut-paper shapes, and the second hand ticks on a
 * one-second grid instead of sweeping.
 *
 * Centre and radii are measured off the keyed alpha, so the hands pivot on the
 * face rather than on a guess at where the face is.
 */
const ClockHands: React.FC<{size: number; startTick: number}> = ({size, startTick}) => {
	const frame = useCurrentFrame();
	const cx = CLOCK_CENTRE_X * size;
	const cy = CLOCK_CENTRE_Y * size;
	const r = CLOCK_FACE_RADIUS * size;

	const {stepIndex: tick} = useStopMotionStep(frame, TICK_FRAMES);
	const hourAngle = (CLOCK_HOUR % 12) * 30 + CLOCK_MINUTE * 0.5;
	const minuteAngle = CLOCK_MINUTE * 6;
	const secondAngle = ((tick + startTick) % 60) * 6;

	const hand = (angle: number, length: number, width: number, color: string) => (
		<rect
			x={cx - width / 2}
			y={cy - length}
			width={width}
			height={length + width / 2}
			rx={width / 2}
			fill={color}
			transform={`rotate(${angle} ${cx} ${cy})`}
		/>
	);

	return (
		<svg
			width={size}
			height={size}
			viewBox={`0 0 ${size} ${size}`}
			style={{position: 'absolute', left: 0, top: 0, pointerEvents: 'none'}}
		>
			{hand(hourAngle, r * 0.5, size * 0.016, '#3d4550')}
			{hand(minuteAngle, r * 0.78, size * 0.011, '#3d4550')}
			{hand(secondAngle, r * 0.84, size * 0.005, '#8f3626')}
			<circle cx={cx} cy={cy} r={size * 0.012} fill="#3d4550" />
		</svg>
	);
};

export type DeskWideProps = {
	/**
	 * Where the second hand starts, so a later shot in the same minute does
	 * not rewind the clock. Shot 2 continues from where Shot 1 left off.
	 */
	startTick?: number;
	scale?: number;
};

/**
 * The room: window, clock, and a man at a desk at midnight.
 *
 * Shared between Shot 1 and Shot 2 because it is the same room seconds apart —
 * two copies of these numbers would drift, and a wall that moves between a cut
 * and its return is a continuity bug the audience will feel without naming.
 * Shot 9 returns here too, from the manager's side.
 */
export const DeskWide: React.FC<DeskWideProps> = ({startTick = 0, scale = 1}) => {
	const frame = useCurrentFrame();
	const {stepIndex: breath} = useStopMotionStep(frame, BREATH_STEP);
	const breathY = breath % 2 === 0 ? -1 : 1;
	const breathRot = breath % 3 === 0 ? -0.18 : 0.14;

	return (
		<AbsoluteFill style={{transform: `scale(${scale}) translateY(${breathY}px)`}}>
			{/* Furthest back, and desaturated at depth. It arrived more saturated
			    than the figure (0.390 vs 0.327), and two competing colours at the
			    same depth is a bug — the same fix Episode 01 needed for the auto's
			    tail-light against the meter's flag. Wrapped rather than passed as
			    a style, because PaperCutout builds its shadows in `filter` and a
			    second one would win. */}
			<div
				style={{
					position: 'absolute',
					left: '50%',
					top: '50%',
					width: 760,
					height: 568,
					marginLeft: -380,
					marginTop: -284,
					transform: 'translate(-244px, -352px)',
					filter: 'saturate(0.45) brightness(0.86)',
					zIndex: 10,
				}}
			>
				<PaperCutout asset="office-window-night" textureOpacity={0} elevation={0.4} />
			</div>

			<div
				style={{
					position: 'absolute',
					left: '50%',
					top: '50%',
					width: CLOCK_SIZE,
					height: CLOCK_SIZE * (896 / 1200),
					marginLeft: -CLOCK_SIZE / 2,
					marginTop: (-CLOCK_SIZE * (896 / 1200)) / 2,
					transform: `translate(320px, -368px) rotate(${breathRot}deg)`,
					zIndex: 14,
				}}
			>
				<PaperCutout asset="wall-clock-face" textureOpacity={0} elevation={0.6} />
				<ClockHands size={CLOCK_SIZE} startTick={startTick} />
			</div>

			<div
				style={{
					position: 'absolute',
					left: '50%',
					top: '50%',
					width: 1860,
					height: 1389,
					marginLeft: -930,
					marginTop: -695,
					transform: `translate(0px, ${430 + breathY}px)`,
					zIndex: 30,
				}}
			>
				<PaperCutout asset="employee-desk-34" textureOpacity={0} elevation={1.2} />
			</div>
		</AbsoluteFill>
	);
};

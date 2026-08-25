import React from 'react';
import {AbsoluteFill, Audio, Easing, Sequence, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {CollageBackdrop} from '../../../components/CollageBackdrop';
import {PaperCutout} from '../../../components/PaperCutout';
import {useStopMotionStep} from '../../../components/useStopMotionStep';
import {shakeAt} from '../../montage/camera';
import {
	BREATH_STEP,
	FARE_FRAME,
	PUNCH_FRAME,
	REBOUND_FRAME,
	SETTLE_FRAME,
	SHOT_04_DURATION,
	SNAP_FRAME,
} from './beats';
import {FareReading} from './FareReading';
import {LEVER_BOX, LEVER_DOWN, LEVER_PIVOT, METER_ASPECT, PANEL_CENTRE} from '../meter';

const CLAMP = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

/**
 * The meter is drawn with its display low-left and its flag high-right, so the
 * two things this shot has to show sit almost side by side. In a 9:16 frame
 * that is the worst possible arrangement: fitting both across the width means
 * backing off until neither is a close-up. Tipping the whole meter over swings
 * that axis down the diagonal instead, where a vertical frame has room to
 * spare — and a tilted paper element is the series' native register anyway.
 */
const TILT = 32;
const METER_W = 1450;
const METER_H = METER_W * METER_ASPECT;
/** Where the display panel's centre sits in frame; the tilt pivots about it. */
const PANEL_AT = {x: 340, y: 430};

/**
 * How far back the shot sits before the punch-in. Far enough that the flag's
 * swing is in frame, which at this artwork's proportions is as much as any one
 * framing can hold.
 */
const WIDE_SCALE = 0.74;

/** ₹30.00 — the base fare, and the only digit that has to change is the first. */
const FARE_DIGITS = '3000';

/**
 * Shot 4 — Meter Down.
 *
 * A documentary insert, and it behaves like one: it overlaps the action rather
 * than continuing it. We join the flag part-way through the arc Shot 3 already
 * showed, so the snap happens again here from a tighter angle. Cutting to the
 * flag already down would leave the shot with nothing to play.
 *
 * Then the fare arrives — all at once, a beat late, with no count-up. And then
 * nothing happens for two seconds, which is the point. The frame is waiting
 * for the catch, and holding on a meter that has no more to say about it.
 */
export const Shot04MeterDown: React.FC = () => {
	const frame = useCurrentFrame();

	/**
	 * Four poses and nothing in between them: caught mid-arc, past the stop,
	 * bounced back off it, at rest on it. The overshoot and the bounce are what
	 * keep the snap from reading as a dissolve between two drawings — and they
	 * are the only frames in the shot with any force in them.
	 */
	const leverAngle =
		frame >= SETTLE_FRAME
			? LEVER_DOWN
			: frame >= REBOUND_FRAME
				? LEVER_DOWN - 4
				: frame >= SNAP_FRAME
					? LEVER_DOWN + 6
					: 52;

	// The housing takes the blow the flag delivers.
	const meterKnock = shakeAt(frame, SNAP_FRAME, 2.6);

	/**
	 * Paper breathing through the hold — a fraction of a degree, on a slow step
	 * grid. Without it the long silent tail stops looking like a held frame of
	 * animation and starts looking like the render froze.
	 */
	const {stepIndex: breath} = useStopMotionStep(frame, BREATH_STEP);
	const breathe = (breath % 3) * 0.16 - 0.16;

	/**
	 * One hard punch-in and then, for the rest of the shot, a creep so slow it
	 * is barely a camera at all. It never arrives anywhere, because there is
	 * nowhere for it to arrive: whatever it was moving in to catch has already
	 * happened.
	 */
	const push =
		frame < PUNCH_FRAME
			? WIDE_SCALE
			: interpolate(frame, [PUNCH_FRAME, SHOT_04_DURATION], [1, 1.045], CLAMP);
	const jolt = shakeAt(frame, SNAP_FRAME, 4);

	return (
		<AbsoluteFill>
			<CollageBackdrop chaos={0.22} />

			<AbsoluteFill
				style={{
					transform: `translateY(${jolt}px) scale(${push})`,
					transformOrigin: `${PANEL_AT.x}px ${PANEL_AT.y}px`,
				}}
			>
				{/* The auto's bodywork, so the meter is mounted on something rather
				    than floating on paper. It is the same cutout as every other
				    shot in the scene, which is what keeps the yellow reading as the
				    same auto across the cut.

				    Desaturated, though, and not only for depth: the auto carries a
				    red tail-light almost exactly the colour of the flag, and at
				    this framing it sits just beside it. Two identical reds at the
				    same distance from the eye and the shot briefly has two flags in
				    it. Draining one settles which is which. */}
				<div
					style={{
						position: 'absolute',
						left: '50%',
						top: '50%',
						width: 6200,
						height: 4630,
						marginLeft: -3100,
						marginTop: -2315,
						transform: 'translate(1600px, 660px)',
						filter: 'saturate(0.55) brightness(0.98)',
						zIndex: 10,
					}}
				>
					<PaperCutout asset="auto-driver-34" textureOpacity={0} elevation={0.4} />
				</div>

				<div
					style={{
						position: 'absolute',
						left: PANEL_AT.x - PANEL_CENTRE.x * METER_W,
						top: PANEL_AT.y - PANEL_CENTRE.y * METER_H,
						width: METER_W,
						height: METER_H,
						transform: `rotate(${TILT + meterKnock + breathe}deg)`,
						transformOrigin: `${PANEL_CENTRE.x * 100}% ${PANEL_CENTRE.y * 100}%`,
						zIndex: 20,
					}}
				>
					{/* Grain on, unlike the wider shots. We are close enough here that
					    a flat surface reads as flat, and the housing's right shoulder
					    is inpainted where the lever was cut away from it — a smooth
					    fill among crisp halftone is exactly what an eye picks out.
					    The same grain over both makes them one surface again. */}
					<PaperCutout asset="auto-meter-body" textureOpacity={0.24} elevation={1.4} />

					<FareReading
						digits={FARE_DIGITS}
						age={frame - FARE_FRAME}
						meterHeight={METER_H}
					/>

					<div
						style={{
							position: 'absolute',
							...LEVER_BOX,
							transform: `rotate(${leverAngle}deg)`,
							transformOrigin: LEVER_PIVOT,
						}}
					>
						<PaperCutout asset="auto-meter-lever" textureOpacity={0.24} elevation={1.5} />
					</div>
				</div>
			</AbsoluteFill>

			{/* The click on contact, then — per the script — silence. The fare gets
			    a much quieter tick of its own: in a world where paper moves with a
			    sound, a number changing in total silence reads as a glitch. */}
			<Sequence from={SNAP_FRAME}>
				<Audio src={staticFile('sfx/meter-click.wav')} volume={0.9} />
			</Sequence>
			<Sequence from={FARE_FRAME}>
				<Audio src={staticFile('sfx/meter-click.wav')} volume={0.3} playbackRate={1.6} />
			</Sequence>
		</AbsoluteFill>
	);
};

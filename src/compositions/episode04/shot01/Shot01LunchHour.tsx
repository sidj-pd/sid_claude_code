import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {NewsprintTexture} from '../../../components/NewsprintTexture';
import {PaperCutout} from '../../../components/PaperCutout';
import {useStopMotionStep} from '../../../components/useStopMotionStep';
import {VoiceOver} from '../../../components/VoiceOver';
import {BUTTER} from '../../../components/palette';
import {Ground} from '../Ground';
import {
	BANKER_LINE,
	HESITATE,
	HESITATE_END,
	PUSH_FRAMES,
	PUSH_START,
	STEP,
	STEP_FORWARD,
	VO_IN,
	WALK_END,
	WALK_EVERY,
	WALK_HOPS,
	WALK_IN,
} from './beats';

const CLAMP = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

/**
 * Shot 0's geometry, repeated exactly. The two shots cut together on the same
 * framing, so anything that disagrees by a pixel reads as a bump.
 */
const BANKER_CX = 540;
const BANKER_CY = 880;
const BANKER_W = 760;
const BANKER_H = 862;
const SIGN_Y = 1178;
const TIFFIN_Y = 1150;



/**
 * The customer, from behind, entering from the bottom of frame. He is much
 * larger than the banker because he is nearer the camera — that size
 * difference is the only depth cue in a flat collage, so it is exaggerated.
 */
const CUST_W = 470;
const CUST_H = 1295;
const CUST_X = 560;
/** Off the bottom edge, then up to here. He never reaches the counter. */
const CUST_Y_OUT = 2180;
const CUST_Y_IN = 1150;

const Sign: React.FC = () => (
	<>
		<div style={{position: 'absolute', left: 150, top: SIGN_Y, width: 300, height: 178}}>
			<PaperCutout asset="bank-sign" elevation={0.9} textureOpacity={0} style={{width: 300, height: 178}} />
		</div>
		<div
			style={{
				position: 'absolute',
				left: 150,
				top: SIGN_Y + 34,
				width: 300,
				textAlign: 'center',
				fontFamily: 'RansomArchivoBlack, sans-serif',
				fontSize: 34,
				lineHeight: 1.1,
				letterSpacing: 1,
				color: BUTTER,
				transform: 'rotate(-1.5deg)',
			}}
		>
			OUT FOR
			<br />
			LUNCH
		</div>
	</>
);

export const Shot01LunchHour: React.FC = () => {
	const frame = useCurrentFrame();
	const {steppedFrame, stepIndex} = useStopMotionStep(frame, STEP);

	/**
	 * The approach: six discrete hops, each shorter than the last. Stepping the
	 * COUNT rather than easing a distance is what makes it read as a walk — a
	 * smooth ramp with a stop-motion wobble on top is a slide, which is the
	 * thing every version of this before it looked like.
	 */
	const hop = Math.max(0, Math.min(WALK_HOPS, Math.floor((steppedFrame - WALK_IN) / WALK_EVERY)));
	// Shortening strides: the sum is normalised so hop 6 always lands on CUST_Y_IN.
	const strides = [0, 0.3, 0.55, 0.74, 0.88, 0.96, 1];
	let travelled = strides[hop];

	// One more step forward, after the freeze, as the narration starts.
	if (steppedFrame >= STEP_FORWARD) travelled = 1.09;

	/**
	 * The hesitation. Not a wobble and not a pause: an unresolved rock between
	 * two positions, a body that has stopped walking and not yet decided to
	 * leave. It stops dead at HESITATE_END and he holds — the flinch that never
	 * lands, frozen through the banker's whole line.
	 */
	const hesitating = steppedFrame >= HESITATE && steppedFrame < HESITATE_END;
	const rock = hesitating ? (stepIndex % 2 === 0 ? -1 : 1) : 0;

	const custY = interpolate(travelled, [0, 1.09], [CUST_Y_OUT, CUST_Y_IN - 46], CLAMP);

	/** The tiffin, shoved aside. Stepped, like everything else he does. */
	const pushed = interpolate(
		useStopMotionStep(Math.max(0, steppedFrame - PUSH_START), STEP).steppedFrame,
		[0, PUSH_FRAMES],
		[0, 1],
		CLAMP,
	);

	return (
		<AbsoluteFill>
			<Ground />

			<AbsoluteFill>
				<div
					style={{
						position: 'absolute',
						left: BANKER_CX - BANKER_W / 2,
						top: BANKER_CY - BANKER_H / 2,
						width: BANKER_W,
						height: BANKER_H,
					}}
				>
					{/* The reaching pose is a different drawing of the same man,
					    generated against him as a character reference. It swaps
					    in on the push and never blends: a cross-fade between two
					    poses is the one thing that would say "software" in a
					    shot built entirely out of paper. */}
					<PaperCutout
						asset={steppedFrame >= PUSH_START ? 'bank-employee-reach' : 'bank-employee'}
						elevation={1}
						textureOpacity={0}
						style={{width: BANKER_W, height: BANKER_H}}
					/>
				</div>

				<Sign />

				{/* Shoved to his left and slightly away, out of the way of the
				    form. It does not leave the counter — he is not clearing up,
				    he is making room. */}
				<div
					style={{
						position: 'absolute',
						/* All the way to the far end of the counter and half out
						   of frame, dragging slightly downward as a pushed thing
						   does. It never leaves the desk -- he is not clearing
						   up, he is making room, and a tiffin that vanishes
						   reads as the former. */
						left: 660 + pushed * 400,
						top: TIFFIN_Y + pushed * 54,
						width: 260,
						height: 191,
						transform: `rotate(${pushed * 16}deg)`,
					}}
				>
					<PaperCutout asset="tiffin-open" elevation={0.9} textureOpacity={0} style={{width: 260, height: 191}} />
				</div>
			</AbsoluteFill>

			{/* Nearest the camera, so over everything, and gone during the
			    closer framing — the cut to him is a cut to a different lens on
			    the same room, and he is behind the camera for it. */}
			{steppedFrame >= WALK_IN ? (
				<div
					style={{
						position: 'absolute',
						left: CUST_X - CUST_W / 2 + rock * 5,
						top: custY,
						width: CUST_W,
						height: CUST_H,
						transform: `rotate(${rock * 1.1}deg)`,
					}}
				>
					<PaperCutout asset="customer-back" elevation={1.6} textureOpacity={0} style={{width: CUST_W, height: CUST_H}} />
				</div>
			) : null}

			<NewsprintTexture opacity={0.16} />

			<VoiceOver id="ep04-shot01-banker-cut" from={BANKER_LINE} />
			<VoiceOver id="ep04-shot01-vo-cut" from={VO_IN} />
		</AbsoluteFill>
	);
};

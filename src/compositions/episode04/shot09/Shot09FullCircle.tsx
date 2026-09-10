import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {EvidenceStamp} from '../../../components/EvidenceStamp';
import {NewsprintTexture} from '../../../components/NewsprintTexture';
import {PaperCutout} from '../../../components/PaperCutout';
import {useStopMotionStep} from '../../../components/useStopMotionStep';
import {VoiceOver} from '../../../components/VoiceOver';
import {BUTTER, GANACHE, GANACHE_DEEP} from '../../../components/palette';
import {Ground} from '../Ground';
import {
	BITE,
	BLACKOUT,
	DRAIN_FRAMES,
	FREEZE,
	PULL_BACK,
	PULL_BACK_FRAMES,
	STAMP,
	STEP,
	VO_STARTS,
} from './beats';

const CLAMP = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

/** Shot 0's and Shot 1's geometry, to the pixel. This is the same counter. */
const BANKER_CX = 540;
const BANKER_CY = 880;
const BANKER_W = 760;
const BANKER_H = 862;
const SIGN_Y = 1178;
const TIFFIN_Y = 1150;
/** Where Shot 1 left it: shoved to the far end of the counter. */
const TIFFIN_X_PUSHED = 810;
const TIFFIN_X_HOME = 660;

export const Shot09FullCircle: React.FC = () => {
	const frame = useCurrentFrame();

	/**
	 * Everything freezes on the bite. Not a Freeze wrapper — the stop-motion
	 * step is already the clock here, so pinning the frame number pins every
	 * derived value at once, including the idle breath.
	 */
	const held = Math.min(frame, FREEZE);
	const {steppedFrame} = useStopMotionStep(held, STEP);

	/** He pulls his lunch back towards himself. Stepped, like every move he makes. */
	const back = interpolate(
		useStopMotionStep(Math.max(0, steppedFrame - PULL_BACK), STEP).steppedFrame,
		[0, PULL_BACK_FRAMES],
		[0, 1],
		CLAMP,
	);
	const tiffinX = interpolate(back, [0, 1], [TIFFIN_X_PUSHED, TIFFIN_X_HOME], CLAMP);

	const eating = steppedFrame >= BITE;

	/**
	 * The drain. Grey creeping in and grain coming up through it — the only
	 * desaturation in the episode, and the thing that says the file is closed
	 * rather than the shot merely ending.
	 */
	const drained = interpolate(frame, [FREEZE, FREEZE + DRAIN_FRAMES], [0, 1], CLAMP);

	return (
		<AbsoluteFill style={{background: GANACHE_DEEP}}>
			<AbsoluteFill
				style={{
					filter: `grayscale(${drained}) contrast(${1 + drained * 0.16}) brightness(${1 - drained * 0.1})`,
				}}
			>
				<Ground />

				<div
					style={{
						position: 'absolute',
						left: BANKER_CX - BANKER_W / 2,
						top: BANKER_CY - BANKER_H / 2,
						width: BANKER_W,
						height: BANKER_H,
					}}
				>
					{/* The bite is a hard pose swap, like the reach in Shot 1. */}
					<PaperCutout
						asset={eating ? 'bank-employee-eating' : 'bank-employee'}
						elevation={1}
						textureOpacity={0}
						style={{width: BANKER_W, height: BANKER_H}}
					/>
				</div>

				{/* The sign has not moved and does not move. That is the joke of
				    the whole beat: the counter is still open, and it still says
				    it is not. */}
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

				<div
					style={{
						position: 'absolute',
						left: tiffinX,
						top: TIFFIN_Y + (1 - back) * 44,
						width: 260,
						height: 191,
						transform: `rotate(${(1 - back) * 13}deg)`,
					}}
				>
					<PaperCutout asset="tiffin-open" elevation={0.9} textureOpacity={0} style={{width: 260, height: 191}} />
				</div>

				{/* Grain rises as the colour drains — the frame turning into an
				    archive print rather than simply going grey. */}
				<NewsprintTexture opacity={0.16 + drained * 0.26} />
			</AbsoluteFill>

			{frame >= STAMP ? (
				<div style={{position: 'absolute', left: 0, right: 0, top: 1180, textAlign: 'center'}}>
					<div style={{display: 'inline-block'}}>
						<EvidenceStamp
							text="CASE FILE #0004 — CLOSED"
							age={frame - STAMP}
							fontSize={54}
							rotate={-3}
							color={GANACHE}
						/>
					</div>
				</div>
			) : null}

			{frame >= BLACKOUT ? <AbsoluteFill style={{background: GANACHE_DEEP}} /> : null}

			<VoiceOver id="ep04-shot09-final-cut" from={VO_STARTS} />
		</AbsoluteFill>
	);
};

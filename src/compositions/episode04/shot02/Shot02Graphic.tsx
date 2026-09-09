import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {EvidenceStamp} from '../../../components/EvidenceStamp';
import {NewsprintTexture} from '../../../components/NewsprintTexture';
import {SAFE_BOTTOM_Y, safeTop} from '../../../components/safeArea';
import {useStopMotionStep} from '../../../components/useStopMotionStep';
import {VoiceOver} from '../../../components/VoiceOver';
import {BUTTER, GANACHE, GANACHE_DEEP} from '../../../components/palette';
import {StatBar} from '../../episode01/shot05/StatBar';
import {Ground} from '../Ground';
import {Clock} from './Clock';
import {
	BAR1_STARTS,
	BAR2_STARTS,
	BAR_2_GROW,
	BAR_GROW,
	BLACKOUT,
	CAP1_IN,
	CAP2_IN,
	CLOCK_IN,
	CLOSES_STAMP,
	HANDS_IN,
	HEADER_IN,
	NUM1_STAMP,
	NUM2_STAMP,
	SLIVER_MOVE,
	SLIVER_MOVE_FRAMES,
	STEP,
	SUBHEAD_IN,
	VO_A,
	VO_B,
	VO_C,
	VO_D,
	WEDGE_IN,
	WINDOW_STAMP,
	WIPE,
	WIPE_FRAMES,
} from './beats';

const CLAMP = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

/** The survey's two findings. */
const TURNED_AWAY = 0.96;
const COME_BACK = 0.89;

/** Same column grid as Episodes 01-03. Nothing may be set below y=1536. */
const BAR_X = 84;
const BAR_W = 912;
const BAR_H = 196;
const HEADER_Y = 140;
const BAR1_Y = 520;
const BAR2_Y = 980;

const SLIVER_X = BAR_X + TURNED_AWAY * BAR_W;
const SLIVER_W = BAR_W * (1 - TURNED_AWAY);

const PALETTE = {ink: GANACHE, paper: '#F3EAD8', mark: BUTTER};

const useSteppedGrowth = (frame: number, start: number, duration: number): number => {
	const {steppedFrame} = useStopMotionStep(Math.max(0, frame - start), STEP);
	return interpolate(steppedFrame, [0, duration], [0, 1], CLAMP);
};

const Caption: React.FC<{text: string; age: number; size?: number}> = ({text, age, size = 46}) => {
	if (age < 0) return null;
	return (
		<div
			style={{
				fontFamily: 'RansomAnton, sans-serif',
				fontSize: size,
				letterSpacing: 1.4,
				color: GANACHE,
				opacity: interpolate(age, [0, 2], [0, 1], CLAMP),
				transform: `translateY(${interpolate(age, [0, 3], [10, 0], CLAMP)}px)`,
			}}
		>
			{text}
		</div>
	);
};

export const Shot02Graphic: React.FC = () => {
	const frame = useCurrentFrame();

	const bar1 = useSteppedGrowth(frame, BAR1_STARTS, BAR_GROW) * TURNED_AWAY;
	const bar2 = useSteppedGrowth(frame, BAR2_STARTS, BAR_2_GROW) * COME_BACK;
	const sliver = useSteppedGrowth(frame, SLIVER_MOVE, SLIVER_MOVE_FRAMES);

	/**
	 * The page turn. The bars do not fade — a band of ground sweeps down over
	 * them and the clock is underneath it. The series has never dissolved
	 * between two pieces of evidence and this is not the place to start.
	 */
	const wipe = interpolate(frame, [WIPE, WIPE + WIPE_FRAMES], [0, 1], CLAMP);
	const onClock = frame >= CLOCK_IN;

	const hands = useSteppedGrowth(frame, HANDS_IN, 14);
	const wedge = useSteppedGrowth(frame, WEDGE_IN, 12);

	/** Hard cut to black and silence, into the tear. */
	const black = frame >= BLACKOUT;

	return (
		<AbsoluteFill>
			<Ground />

			{!onClock ? (
				<AbsoluteFill>
					<div style={{position: 'absolute', left: BAR_X, top: HEADER_Y}}>
						<Caption text="OUR SURVEY" age={frame - HEADER_IN} size={40} />
						<div style={{height: 10}} />
						<Caption text="LUNCH-HOUR VISITS" age={frame - SUBHEAD_IN} size={78} />
					</div>

					<div style={{position: 'absolute', left: BAR_X, top: BAR1_Y}}>
						<StatBar
							width={BAR_W}
							height={BAR_H}
							fill={bar1}
							label="96%"
							labelAge={frame - NUM1_STAMP}
							remainderLabel="4%"
							remainderAge={frame - NUM1_STAMP}
							remainderLabelInside={false}
							remainderTaken={frame >= SLIVER_MOVE}
							seed={4}
							{...PALETTE}
						/>
					</div>
					<div style={{position: 'absolute', left: BAR_X, top: BAR1_Y + BAR_H + 26}}>
						<Caption text="TURNED AWAY" age={frame - CAP1_IN} />
					</div>

					{/* The leftover figure, set ABOVE its block rather than in it.
					    At 4% of the bar the block is 36px wide and there is no
					    inside to put a number in -- the same reason Episode 01's
					    9% and Episode 03's 2% are labelled this way. */}
					{frame >= NUM1_STAMP ? (
						<div
							style={{
								position: 'absolute',
								right: 84,
								top: BAR1_Y - 66,
								fontFamily: 'RansomArchivoBlack, sans-serif',
								fontSize: 56,
								lineHeight: 1,
								color: BUTTER,
								opacity: interpolate(frame - NUM1_STAMP, [0, 2], [0, 1], CLAMP),
								transform: `translateY(${interpolate(frame - NUM1_STAMP, [0, 3], [12, 0], CLAMP)}px)`,
							}}
						>
							4%
						</div>
					) : null}

					{/* The leftover 4% detaches and becomes the whole of bar two.
					    It is a drawn object being carried, not a value being
					    re-plotted — that is the entire argument of the card. */}
					{frame >= SLIVER_MOVE && frame < BAR2_STARTS ? (
						<div
							style={{
								position: 'absolute',
								left: interpolate(sliver, [0, 1], [SLIVER_X, BAR_X], CLAMP),
								top: interpolate(sliver, [0, 1], [BAR1_Y, BAR2_Y], CLAMP),
								width: interpolate(sliver, [0, 1], [SLIVER_W, BAR_W], CLAMP),
								height: BAR_H,
								background: BUTTER,
								border: `4px solid ${GANACHE}`,
							}}
						/>
					) : null}

					{frame >= BAR2_STARTS ? (
						<>
							<div style={{position: 'absolute', left: BAR_X, top: BAR2_Y}}>
								<StatBar
									width={BAR_W}
									height={BAR_H}
									fill={bar2}
									label="89%"
									labelAge={frame - NUM2_STAMP}
									remainderLabelInside={false}
									seed={9}
									{...PALETTE}
								/>
							</div>
							<div style={{position: 'absolute', left: BAR_X, top: BAR2_Y + BAR_H + 26}}>
								<Caption text={'"COME BACK AFTER 3:30"'} age={frame - CAP2_IN} />
							</div>
						</>
					) : null}

					{frame >= CLOSES_STAMP ? (
						<div style={{position: 'absolute', left: BAR_X, top: safeTop(96) - 20}}>
							<EvidenceStamp text="BANK CLOSES AT 4:00" age={frame - CLOSES_STAMP} fontSize={44} color={GANACHE} />
						</div>
					) : null}
				</AbsoluteFill>
			) : (
				<AbsoluteFill>
					<div style={{position: 'absolute', left: 60, top: 470}}>
						<Clock size={960} hands={hands} wedge={wedge} />
					</div>
					{frame >= WINDOW_STAMP ? (
						<div style={{position: 'absolute', left: 0, right: 0, top: 1400, textAlign: 'center'}}>
							<div
								style={{
									display: 'inline-block',
									padding: '14px 34px',
									background: GANACHE,
									color: BUTTER,
									fontFamily: 'RansomArchivoBlack, sans-serif',
									fontSize: 62,
									letterSpacing: 3,
									transform: `rotate(-2deg) scale(${interpolate(frame - WINDOW_STAMP, [0, 3], [1.35, 1], CLAMP)})`,
									opacity: interpolate(frame - WINDOW_STAMP, [0, 2], [0, 1], CLAMP),
								}}
							>
								YOUR WINDOW
							</div>
						</div>
					) : null}
					<div
						style={{
							position: 'absolute',
							left: 0,
							right: 0,
							top: 300,
							textAlign: 'center',
							fontFamily: 'RansomAnton, sans-serif',
							fontSize: 66,
							letterSpacing: 3,
							color: GANACHE,
						}}
					>
						3:30 — 4:00
					</div>
				</AbsoluteFill>
			)}

			{/* The page turn itself: a band of ground sweeping down. */}
			{wipe > 0 && wipe < 1 ? (
				<AbsoluteFill
					style={{
						transform: `translateY(${interpolate(wipe, [0, 1], [-1920, 0], CLAMP)}px)`,
					}}
				>
					<Ground grain={0.1} />
				</AbsoluteFill>
			) : null}

			<NewsprintTexture opacity={0.14} />

			{black ? <AbsoluteFill style={{background: GANACHE_DEEP}} /> : null}

			<VoiceOver id="ep04-shot02a" from={VO_A} />
			<VoiceOver id="ep04-shot02b-cut" from={VO_B} />
			<VoiceOver id="ep04-shot02c-cut" from={VO_C} />
			<VoiceOver id="ep04-shot02d-cut" from={VO_D} />
		</AbsoluteFill>
	);
};

import React from 'react';
import {
	AbsoluteFill,
	Audio,
	Easing,
	Sequence,
	interpolate,
	staticFile,
	useCurrentFrame,
} from 'remotion';
import {CollageBackdrop} from '../../../components/CollageBackdrop';
import {PaperCutout} from '../../../components/PaperCutout';
import {StampImpact} from '../../../components/StampImpact';
import {useStopMotionStep} from '../../../components/useStopMotionStep';
import {shakeAt} from '../../montage/camera';
import {
	BREATH_STEP,
	CHIT_IN,
	CLICK,
	CLOCK_CENTRE_X,
	CLOCK_CENTRE_Y,
	CLOCK_FACE_RADIUS,
	CLOCK_HOUR,
	CLOCK_MINUTE,
	CURSOR_ARRIVES,
	CURSOR_SETTLES,
	CURSOR_STEP,
	SCREEN_CUT,
	SCREEN_HEIGHT,
	SCREEN_LEFT,
	SCREEN_TOP,
	SCREEN_WIDTH,
	TICK_FRAMES,
} from './beats';

const FRAME_W = 1080;
const FRAME_H = 1920;

const CLAMP = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

/**
 * The clock's hands, drawn rather than generated — which is why the art was
 * commissioned without them. Cut-paper shapes, and the second hand ticks on
 * a one-second grid instead of sweeping.
 */
const ClockHands: React.FC<{size: number}> = ({size}) => {
	const frame = useCurrentFrame();
	const cx = CLOCK_CENTRE_X * size;
	const cy = CLOCK_CENTRE_Y * size;
	const r = CLOCK_FACE_RADIUS * size;

	const {stepIndex: tick} = useStopMotionStep(frame, TICK_FRAMES);
	const hourAngle = (CLOCK_HOUR % 12) * 30 + CLOCK_MINUTE * 0.5;
	const minuteAngle = CLOCK_MINUTE * 6;
	const secondAngle = (tick % 60) * 6;

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

/** A cut-paper pointer. Flat fill, one small ink shadow, no gloss. */
const Cursor: React.FC<{size: number}> = ({size}) => (
	<svg width={size} height={size * 1.35} viewBox="0 0 20 27" style={{display: 'block'}}>
		<polygon points="0,0 0,20 5,15.5 8.5,23.5 12,22 8.5,14.5 15,14.5" fill="#f3ecdc" />
		<polygon
			points="1.6,3.4 1.6,17 5.4,13.6 8.9,21.4 10.2,20.8 6.6,12.9 11.6,12.9"
			fill="#2b2f36"
		/>
	</svg>
);

export const Shot01LeaveRequest: React.FC = () => {
	const frame = useCurrentFrame();
	const onScreen = frame >= SCREEN_CUT;

	// --- Paper breathing. A long held frame with nothing moving stops reading
	// as a held shot and starts reading as a stalled render.
	const {stepIndex: breath} = useStopMotionStep(frame, BREATH_STEP);
	const breathY = breath % 2 === 0 ? -1 : 1;
	const breathRot = breath % 3 === 0 ? -0.18 : 0.14;

	// --- Wide framing: a very slow push toward the desk, so the room is
	// closing in slightly before the cut rather than sitting inert.
	const wideScale = interpolate(frame, [0, SCREEN_CUT], [1, 1.06], {
		...CLAMP,
		easing: Easing.inOut(Easing.quad),
	});

	// --- The cursor's approach, quantised BEFORE easing so it covers ground
	// early and inches the last stretch: hesitation, not a glide.
	const {stepIndex: cursorStep} = useStopMotionStep(
		Math.max(0, frame - CURSOR_ARRIVES),
		CURSOR_STEP,
	);
	const travel = CURSOR_SETTLES - CURSOR_ARRIVES;
	const steppedT = Math.min(1, (cursorStep * CURSOR_STEP) / travel);
	const eased = Easing.out(Easing.quad)(steppedT);

	// Once it arrives it does not go still — it hovers, one pixel at a time,
	// on the cursor's own step grid. That is the whole performance of the shot.
	const hovering = frame >= CURSOR_SETTLES && frame < CLICK;
	const hoverX = hovering ? (cursorStep % 3 === 0 ? 1.5 : cursorStep % 3 === 1 ? -1 : 0) : 0;
	const hoverY = hovering ? (cursorStep % 2 === 0 ? -1.5 : 1) : 0;

	// The press itself: the button dips, and the frame takes a very small hit.
	const pressed = frame >= CLICK && frame < CLICK + 4;
	const jolt = shakeAt(frame, CLICK, 1.6);

	// --- Screen geometry, from the measured cutout box.
	const cutoutW = 1500;
	const cutoutH = cutoutW * (896 / 1200);
	const screenX = SCREEN_LEFT * cutoutW;
	const screenY = SCREEN_TOP * cutoutH;
	const screenW = SCREEN_WIDTH * cutoutW;
	const screenH = SCREEN_HEIGHT * cutoutH;

	// The message itself — a pale sheet laid on the dark panel. Copy is set
	// here and never in the art (§5): a generator garbles lettering, and baked
	// text cannot be re-worded or animated. It is also why the cutout was
	// commissioned with an empty screen.
	const sheetX = screenX + screenW * 0.055;
	const sheetY = screenY + screenH * 0.075;
	const sheetW = screenW * 0.89;
	const sheetH = screenH * 0.85;

	// The SEND chit sits low-right on the sheet, where a compose window puts it.
	const sendW = sheetW * 0.26;
	const sendH = sheetH * 0.15;
	const sendX = sheetX + sheetW - sendW - sheetW * 0.05;
	const sendY = sheetY + sheetH - sendH - sheetH * 0.07;

	const cursorSize = screenW * 0.075;
	const cursorFromX = screenX + screenW * 0.16;
	const cursorFromY = screenY + screenH * 0.24;
	const cursorToX = sendX + sendW * 0.42;
	const cursorToY = sendY + sendH * 0.34;
	const cursorX = interpolate(eased, [0, 1], [cursorFromX, cursorToX]) + hoverX;
	const cursorY = interpolate(eased, [0, 1], [cursorFromY, cursorToY]) + hoverY;

	const clockSize = 390;

	return (
		<AbsoluteFill>
			{/* Night is carried by the palette, never by lighting — the paper
			    world is flatly lit by definition. A higher chaos value cools and
			    dims the sheet without pretending a lamp is on. */}
			<CollageBackdrop chaos={0.52} />

			{!onScreen ? (
				<AbsoluteFill
					style={{
						transform: `scale(${wideScale}) translateY(${breathY}px)`,
					}}
				>
					{/* The window recedes furthest back and is desaturated at depth.
					    It arrived more saturated than the figure (0.390 vs 0.327),
					    and two competing colours at the same depth is a bug — the
					    same fix Episode 01 needed for the tail-light and the flag.
					    Wrapped rather than passed as a style, because PaperCutout
					    builds its shadows in `filter` and a second one would win. */}
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
							width: clockSize,
							height: clockSize * (896 / 1200),
							marginLeft: -clockSize / 2,
							marginTop: (-clockSize * (896 / 1200)) / 2,
							transform: `translate(320px, -368px) rotate(${breathRot}deg)`,
							zIndex: 14,
						}}
					>
						<PaperCutout asset="wall-clock-face" textureOpacity={0} elevation={0.6} />
						<ClockHands size={clockSize} />
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
			) : (
				<AbsoluteFill style={{transform: `translateY(${jolt}px)`}}>
					<div
						style={{
							position: 'absolute',
							left: '50%',
							top: '50%',
							width: cutoutW,
							height: cutoutH,
							marginLeft: -cutoutW / 2,
							marginTop: -cutoutH / 2,
							transform: `rotate(${breathRot}deg)`,
							zIndex: 20,
						}}
					>
						<PaperCutout asset="laptop-screen" textureOpacity={0} elevation={1.3} />

						{/* The leave request itself. A pale sheet on the dark panel —
						    a document, not software chrome, which keeps the paper
						    world intact at the exact moment the incident is being
						    established. The wording matters: he volunteers to keep
						    an eye on Teams, which is what makes the manager's reply
						    in Shot 2 land. Neither man is named — Beats 4 and 6 both
						    caption him NAME WITHHELD, and a name on screen here
						    would contradict the testimony. */}
						<div
							style={{
								position: 'absolute',
								left: sheetX,
								top: sheetY,
								width: sheetW,
								height: sheetH,
								background: '#ece4cf',
								border: '2px solid #1b1e24',
								padding: sheetH * 0.07,
								boxSizing: 'border-box',
								display: 'flex',
								flexDirection: 'column',
								gap: sheetH * 0.05,
								fontFamily: 'RansomSpecialElite, monospace',
								color: '#26292f',
								transform: 'rotate(-0.4deg)',
							}}
						>
							<div
								style={{
									fontSize: sheetH * 0.088,
									letterSpacing: 1.5,
									borderBottom: '2px solid #26292f',
									paddingBottom: sheetH * 0.035,
								}}
							>
								LEAVE REQUEST — 12–16 SEPTEMBER
							</div>
							<div style={{fontSize: sheetH * 0.062, lineHeight: 1.65, opacity: 0.88}}>
								Wanted to check if I could take leave from the 12th to the 16th.
								<br />
								Happy to hand over anything pending before I go — and I&apos;ll keep
								an eye on Teams if anything urgent comes up.
								<br />
								<br />
								Thanks.
							</div>
						</div>

						{/* The submit control, as a paper chit pinned to the screen
						    rather than drawn software chrome. Everything that happened
						    in this world is cut paper, and the incident is being
						    established here — this is the wrong moment to break that. */}
						<div
							style={{
								position: 'absolute',
								left: sendX,
								top: sendY,
								width: sendW,
								height: sendH,
								background: pressed ? '#cfc4a8' : '#e6dcc0',
								border: '2px solid #2b2f36',
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
								transform: `rotate(-1.2deg) translateY(${pressed ? 2 : 0}px)`,
								fontFamily: 'RansomSpecialElite, monospace',
								fontSize: sendH * 0.42,
								letterSpacing: 3,
								color: '#2b2f36',
							}}
						>
							SEND
						</div>

						<div
							style={{
								position: 'absolute',
								left: cursorX,
								top: cursorY,
								zIndex: 40,
							}}
						>
							<Cursor size={cursorSize} />
						</div>
					</div>

					{/* The record opens. A chit entering evidence, stamped, not typed. */}
					{frame >= CHIT_IN ? (
						<StampImpact
							triggerFrame={CHIT_IN}
							rotationDeg={-2.5}
							sfxSrc={staticFile('sfx/stamp-thud.wav')}
							sfxVolume={0.7}
						>
							<AbsoluteFill style={{alignItems: 'center', justifyContent: 'flex-end'}}>
								<div
									style={{
										marginBottom: 300,
										padding: '26px 46px',
										background: '#ece2c8',
										border: '3px solid #2b2f36',
										fontFamily: 'RansomSpecialElite, monospace',
										fontSize: 58,
										letterSpacing: 4,
										color: '#2b2f36',
										boxShadow: '0 10px 22px rgba(48,34,18,0.34)',
									}}
								>
									LEAVE REQUEST — SUBMITTED
								</div>
							</AbsoluteFill>
						</StampImpact>
					) : null}
				</AbsoluteFill>
			)}

			{/* The room. Production notes §13 lists "no ambience beds" as an open
			    gap; this is the first. Held tension needs something under it —
			    true digital silence reads as a dropout, not as quiet. */}
			<Audio src={staticFile('sfx/room-hum.wav')} volume={0.16} />

			<Sequence from={CLICK}>
				<Audio src={staticFile('sfx/key-click.wav')} volume={0.85} />
			</Sequence>
		</AbsoluteFill>
	);
};

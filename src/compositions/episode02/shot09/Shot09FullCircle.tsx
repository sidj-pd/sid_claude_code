import React from 'react';
import {
	AbsoluteFill,
	Audio,
	Sequence,
	interpolate,
	staticFile,
	useCurrentFrame,
} from 'remotion';
import {CollageBackdrop} from '../../../components/CollageBackdrop';
import {EvidenceStamp} from '../../../components/EvidenceStamp';
import {NewsprintTexture} from '../../../components/NewsprintTexture';
import {PaperCutout} from '../../../components/PaperCutout';
import {SAFE_BOTTOM_Y} from '../../../components/safeArea';
import {useStopMotionStep} from '../../../components/useStopMotionStep';
import {VoiceOver} from '../../../components/VoiceOver';
import {ClockHands} from '../DeskWide';
import {
	BLACKOUT_FRAMES,
	BLACKOUT_STARTS,
	CLOCK_HOUR,
	CLOCK_MINUTE,
	DESAT_FRAMES,
	FREEZE_AT,
	LAPTOP_CLOSES,
	PHONE_LIGHTS,
	STAMP_AT,
	VO_STARTS,
} from './beats';

const CLAMP = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

/**
 * The manager's cutout is a tall portrait, unlike the employee's landscape strip
 * in Beat 1, so this cannot reuse DeskWide's geometry — it gets its own. The
 * mirror is in the staging rather than the measurements: one man at a desk at
 * night, seen from the other side.
 */
const FIG_W = 980;
const FIG_H = FIG_W * (1376 / 768);
const FIG_TY = 150;

const CLOCK_SIZE = 300;

/** Where the phone sits in the artwork, as fractions of it. */
const PHONE = {x: 0.3, y: 0.655, w: 0.19, h: 0.055};

export const Shot09FullCircle: React.FC = () => {
	const frame = useCurrentFrame();

	const closed = frame >= LAPTOP_CLOSES;
	const frozen = frame >= FREEZE_AT;

	/** Paper breathing, which stops dead at the freeze. */
	const {stepIndex: breath} = useStopMotionStep(Math.min(frame, FREEZE_AT), 9);
	const breathY = frozen ? 0 : breath % 2 === 0 ? -1 : 1;
	const breathRot = frozen ? 0 : breath % 3 === 0 ? -0.16 : 0.12;

	const desat = interpolate(frame, [FREEZE_AT, FREEZE_AT + DESAT_FRAMES], [0, 1], CLAMP);
	const blackout = interpolate(
		frame,
		[BLACKOUT_STARTS, BLACKOUT_STARTS + BLACKOUT_FRAMES],
		[0, 1],
		CLAMP,
	);

	/** The phone's glow, pulsing on a stepped grid rather than easing. */
	const phoneAge = frame - PHONE_LIGHTS;
	const {stepIndex: pulse} = useStopMotionStep(Math.max(0, phoneAge), 8);
	const phoneLit = phoneAge >= 0 && !closed;
	const phoneGlow = phoneLit ? (pulse % 2 === 0 ? 0.85 : 0.45) : 0;

	const figLeft = 540 - FIG_W / 2;
	const figTop = 960 - FIG_H / 2 + FIG_TY;

	return (
		<AbsoluteFill style={{backgroundColor: '#0c0e11'}}>
			<AbsoluteFill
				style={{
					filter: `grayscale(${desat}) contrast(${1 + desat * 0.12}) brightness(${1 - desat * 0.06})`,
				}}
			>
				{/* Night by palette, as everywhere else in the paper world. */}
				<CollageBackdrop chaos={0.52} />

				{/* The same clock, twelve minutes past midnight — another night, and
				    he is still there. Behind him, so it reads as on the wall. */}
				<div
					style={{
						position: 'absolute',
						left: '50%',
						top: '50%',
						width: CLOCK_SIZE,
						height: CLOCK_SIZE * (896 / 1200),
						marginLeft: -CLOCK_SIZE / 2,
						marginTop: (-CLOCK_SIZE * (896 / 1200)) / 2,
						transform: `translate(330px, -560px) rotate(${breathRot}deg)`,
						zIndex: 10,
					}}
				>
					<PaperCutout asset="wall-clock-face" textureOpacity={0} elevation={0.6} />
					<ClockHands size={CLOCK_SIZE} hour={CLOCK_HOUR} minute={CLOCK_MINUTE} />
				</div>

				{/* Him. A hard swap between two registered poses when the lid comes
				    down — paper puppets do not cross-fade. */}
				<div
					style={{
						position: 'absolute',
						left: figLeft,
						top: figTop + breathY,
						width: FIG_W,
						height: FIG_H,
						zIndex: 30,
					}}
				>
					<PaperCutout
						asset={closed ? 'manager-desk-closed' : 'manager-desk-night'}
						textureOpacity={0}
						elevation={1.2}
					/>
				</div>

				{/* The phone, lighting up in the silence. Sat over the artwork's own
				    phone rather than drawn as a new object, so what glows is the
				    thing already on his desk. */}
				{phoneGlow > 0 ? (
					<div
						style={{
							position: 'absolute',
							left: figLeft + PHONE.x * FIG_W,
							top: figTop + PHONE.y * FIG_H + breathY,
							width: PHONE.w * FIG_W,
							height: PHONE.h * FIG_H,
							background: '#cbb27a',
							opacity: phoneGlow,
							boxShadow: `0 0 ${34 * phoneGlow}px ${14 * phoneGlow}px rgba(203,178,122,0.5)`,
							borderRadius: 6,
							zIndex: 34,
						}}
					/>
				) : null}

				{/* And what it says, on a chit — the notification language Beat 1
				    established, one last time and unanswered. */}
				{phoneLit ? (
					<div
						style={{
							position: 'absolute',
							left: 150,
							top: SAFE_BOTTOM_Y - 250,
							background: '#e4d9bd',
							border: '3px solid #1b1e24',
							padding: '18px 28px',
							fontFamily: 'RansomSpecialElite, monospace',
							fontSize: 40,
							letterSpacing: 1,
							color: '#1b1e24',
							transform: 'rotate(-1.4deg)',
							boxShadow: '0 10px 20px rgba(30,24,14,0.4)',
							opacity: interpolate(phoneAge, [0, 4], [0, 1], CLAMP),
							zIndex: 40,
						}}
					>
						1 NEW MESSAGE
					</div>
				) : null}

				{/* The grain comes up loud as the colour drains — a photograph fading
				    into an archive rather than a shot ending. */}
				{desat > 0 ? (
					<AbsoluteFill style={{opacity: desat, zIndex: 60}}>
						<NewsprintTexture opacity={1} grayscale contrast={1.3} halftoneSize={4} />
					</AbsoluteFill>
				) : null}
			</AbsoluteFill>

			{frame >= STAMP_AT ? (
				<AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', zIndex: 80}}>
					<EvidenceStamp
						text={'CASE FILE #0002\nCLOSED'}
						age={frame - STAMP_AT}
						fontSize={82}
						rotate={-4}
					/>
				</AbsoluteFill>
			) : null}

			<VoiceOver id="ep02-shot09-final" from={VO_STARTS} />

			{/* The room, one last time, and it stops when the picture does. */}
			<Audio
				src={staticFile('sfx/room-hum.wav')}
				volume={(f) => (f >= FREEZE_AT ? 0 : 0.16)}
			/>
			{/* The lid coming down. Not a slam — the whole point is that he closes
			    it gently and goes to bed. */}
			<Sequence from={LAPTOP_CLOSES}>
				<Audio src={staticFile('sfx/laptop-close.wav')} volume={0.75} />
			</Sequence>
			<Sequence from={PHONE_LIGHTS}>
				<Audio src={staticFile('sfx/notification-ping.wav')} volume={0.55} />
			</Sequence>
			<Sequence from={STAMP_AT}>
				<Audio src={staticFile('sfx/stamp-thud.wav')} volume={0.9} />
			</Sequence>

			{blackout > 0 ? (
				<AbsoluteFill style={{backgroundColor: '#000', opacity: blackout, zIndex: 100}} />
			) : null}
		</AbsoluteFill>
	);
};

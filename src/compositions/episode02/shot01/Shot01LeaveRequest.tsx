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
import {DeskWide} from '../DeskWide';
import {LaptopMessage, sendChitBox} from '../LaptopMessage';
import {
	BREATH_STEP,
	CHIT_IN,
	CLICK,
	CURSOR_ARRIVES,
	CURSOR_SETTLES,
	CURSOR_STEP,
	SCREEN_CUT,
	VO_IN,
	VO_TRIM_AFTER,
} from './beats';

const CLAMP = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

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

	// --- Screen geometry comes from the shared component, so the cursor aims
	// at the same SEND chit the screen actually draws.
	const cutoutW = 1500;
	const send = sendChitBox(cutoutW);

	const cursorSize = send.screenW * 0.075;
	const cursorFromX = send.screenX + send.screenW * 0.16;
	const cursorFromY = send.screenY + send.screenH * 0.24;
	// Sits on the lower half of the chit: an arrow tip parked over the first
	// letter turns SEND into END on screen.
	const cursorToX = send.x + send.w * 0.36;
	const cursorToY = send.y + send.h * 0.5;
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
				<DeskWide scale={wideScale} />
			) : (
				<AbsoluteFill style={{transform: `translateY(${jolt}px)`}}>
					<LaptopMessage cutoutW={cutoutW} pressed={pressed} rotationDeg={breathRot}>
						<div style={{position: 'absolute', left: cursorX, top: cursorY, zIndex: 40}}>
							<Cursor size={cursorSize} />
						</div>
					</LaptopMessage>

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

			{/* Sentence one only. The cut sits inside the 1.22s gap the envelope
			    found between the sentences, so Shot 2 can open on sentence two
			    without either end clipping a word. */}
			<Sequence from={VO_IN}>
				<Audio src={staticFile('vo/ep02-shot02.wav')} trimAfter={VO_TRIM_AFTER} />
			</Sequence>
		</AbsoluteFill>
	);
};

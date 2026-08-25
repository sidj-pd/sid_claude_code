import React from 'react';
import {AbsoluteFill, Audio, Easing, Sequence, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {VoiceOver} from '../../../components/VoiceOver';
import {CollageBackdrop} from '../../../components/CollageBackdrop';
import {EvidenceStamp} from '../../../components/EvidenceStamp';
import {NewsprintTexture} from '../../../components/NewsprintTexture';
import {PageFlipTransition} from '../../../components/PageFlipTransition';
import {PaperCutout} from '../../../components/PaperCutout';
import {useStopMotionStep} from '../../../components/useStopMotionStep';
import {
	BLACKOUT_FRAMES,
	BLACKOUT_STARTS,
	DESAT_FRAMES,
	DRIVE_FRAMES,
	DRIVE_STARTS,
	FLIP_IN_FRAMES,
	FREEZE_AT,
	SHOT_11_DURATION,
	STAMP_AT,
	VO_STARTS,
} from './beats';

const CLAMP = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

const AUTO_START_X = 420;
/** Left of centre but still fully in frame — the freeze needs the auto
 * actually visible, not a shot of the empty road it just left. */
const AUTO_REST_X = -260;
const AUTO_REST_SCALE = 0.8;
const HOP_STEP = 4;

/**
 * Shot 11 — Full-Circle Close.
 *
 * The wide shot that answers Shot 1's: same auto, same kind of frame,
 * driving off exactly the way it arrived — normally, unremarkably, meter
 * running, because as far as the driver is concerned nothing in this
 * episode was ever an event. Then the image itself stops being able to
 * hold that composure: motion stops, colour drains out, the halftone grain
 * that has been sitting under every paper surface in the series finally
 * comes up loud enough to read as a photograph fading into an archive
 * rather than a still frame of a cartoon.
 */
export const Shot11FullCircle: React.FC = () => {
	const frame = useCurrentFrame();

	const {stepIndex: hopStep} = useStopMotionStep(Math.max(0, frame - DRIVE_STARTS), HOP_STEP);
	const steppedT = Math.min(1, (hopStep * HOP_STEP) / DRIVE_FRAMES);
	const eased = Easing.in(Easing.quad)(steppedT);
	const driveT = frame < FREEZE_AT ? eased : 1;
	const autoX = interpolate(driveT, [0, 1], [AUTO_START_X, AUTO_REST_X]);
	// Scales down over the same drive — the auto reads as pulling away into
	// the distance rather than sliding sideways across a flat plane.
	const autoScale = interpolate(driveT, [0, 1], [1, AUTO_REST_SCALE]);
	const rolling = frame >= DRIVE_STARTS && frame < FREEZE_AT;
	const chassis = rolling ? (hopStep % 2 === 0 ? -1.1 : 1.1) : 0;

	const desat = interpolate(frame, [FREEZE_AT, FREEZE_AT + DESAT_FRAMES], [0, 1], CLAMP);
	const blackout = interpolate(frame, [BLACKOUT_STARTS, BLACKOUT_STARTS + BLACKOUT_FRAMES], [0, 1], CLAMP);

	return (
		<AbsoluteFill style={{backgroundColor: '#0c0e11'}}>
			<PageFlipTransition
				totalDurationInFrames={SHOT_11_DURATION}
				durationInFrames={1}
				entryDurationInFrames={FLIP_IN_FRAMES}
				sfxSrc={staticFile('sfx/paper-riffle.wav')}
				sfxVolume={0.85}
			>
				<AbsoluteFill
					style={{filter: `grayscale(${desat}) contrast(${1 + desat * 0.12}) brightness(${1 - desat * 0.06})`}}
				>
					<CollageBackdrop chaos={0.3} />

					<div
						style={{
							position: 'absolute',
							left: '50%',
							top: '50%',
							width: 2200,
							height: 1642,
							marginLeft: -1100,
							marginTop: -450,
							transform: 'translateY(600px)',
							zIndex: 10,
						}}
					>
						<PaperCutout asset="pothole-road" textureOpacity={0} elevation={0.9} />
					</div>

					<div
						style={{
							position: 'absolute',
							left: '50%',
							top: '50%',
							width: 1180,
							height: 881,
							marginLeft: -590,
							marginTop: -440,
							transform: `translate(${autoX}px, -165px) rotate(${chassis}deg) scale(${autoScale})`,
							zIndex: 20,
						}}
					>
						<PaperCutout asset="auto-driver-34" textureOpacity={0} elevation={1.3} />
					</div>

					{/* The grain that has been under every paper surface all along,
					    turned up loud enough at the very end to read as archive
					    photograph rather than illustration. */}
					<AbsoluteFill style={{opacity: desat * 0.55}}>
						<NewsprintTexture opacity={1} grayscale contrast={1.3} halftoneSize={4} />
					</AbsoluteFill>
				</AbsoluteFill>
			</PageFlipTransition>

			{STAMP_AT <= frame ? (
				<AbsoluteFill style={{alignItems: 'center', justifyContent: 'flex-end', paddingBottom: 420, zIndex: 90}}>
					<EvidenceStamp
						text={'CASE FILE #0001\nCLOSED'}
						age={frame - STAMP_AT}
						fontSize={58}
						rotate={-4}
						color="#8f3626"
						style={{background: 'rgba(20,16,10,0.1)'}}
					/>
				</AbsoluteFill>
			) : null}
			<Sequence from={STAMP_AT}>
				<Audio src={staticFile('sfx/stamp-thud.wav')} volume={0.85} />
			</Sequence>

			<VoiceOver id="ep01-shot11-final" from={VO_STARTS} />

			{blackout > 0 ? (
				<AbsoluteFill style={{backgroundColor: '#000', opacity: blackout, zIndex: 100}} />
			) : null}
		</AbsoluteFill>
	);
};

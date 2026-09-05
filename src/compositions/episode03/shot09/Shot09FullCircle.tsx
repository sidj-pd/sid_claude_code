import React from 'react';
import {
	AbsoluteFill,
	Audio,
	interpolate,
	staticFile,
	useCurrentFrame,
	Sequence,
} from 'remotion';
import {EvidenceStamp} from '../../../components/EvidenceStamp';
import {NewsprintTexture} from '../../../components/NewsprintTexture';
import {PaperCutout} from '../../../components/PaperCutout';
import {useStopMotionStep} from '../../../components/useStopMotionStep';
import {VoiceOver} from '../../../components/VoiceOver';
import {
	BLACKOUT_FRAMES,
	BLACKOUT_STARTS,
	DESAT_FRAMES,
	DOOR_CLOSES,
	DOOR_FRAMES,
	FREEZE_AT,
	STAMP_AT,
	VO_STARTS,
} from './beats';

const CLAMP = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

/**
 * Shot 1's room, reproduced exactly — same wall box, same floor, same three
 * pieces of damage in the same places. The whole point of the beat is that
 * nothing about the flat has changed, so none of these numbers are re-chosen.
 */
const WALL_LEFT = 40;
const WALL_TOP = 150;
const WALL_W = 1000;
const WALL_H = Math.round(WALL_W / 1.169);
const WALL_BOTTOM = WALL_TOP + WALL_H;
const FLOOR_W = 1080;
const FLOOR_H = Math.round(FLOOR_W / 0.574);

/**
 * Him, at the height Shot 1's landlord stood at, and his new artwork's own
 * measured ratio (0.516). Placed left of centre so the door has the frame's
 * right side, with his raised hand landing on the door's hinge edge.
 */
const LANDLORD_H = Math.round(WALL_H * 0.94);
const LANDLORD_W = Math.round(LANDLORD_H * 0.516);
const LANDLORD_LEFT = 380;
const LANDLORD_TOP = WALL_BOTTOM + 320 - LANDLORD_H;

/** The door: measured ratio 0.450, standing on the floor at frame right. */
const DOOR_H = 900;
const DOOR_W = Math.round(DOOR_H * 0.45);
const DOOR_LEFT = 720;
const DOOR_TOP = WALL_BOTTOM + 335 - DOOR_H;

/**
 * Shot 9 — Full Circle.
 *
 * He does not inspect anything. The crack, the stain and the broken tile are
 * all in frame the entire time and he shuts the door on all three, which is
 * the case: the damage was never the point, and the deposit was never really
 * about the flat.
 */
export const Shot09FullCircle: React.FC = () => {
	const frame = useCurrentFrame();

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

	/**
	 * The door swinging shut, in stepped chunks about its hinge edge — paper
	 * puppets do not ease. It starts ajar and comes to flush; the thud is the
	 * latch, and it lands on the step that closes it.
	 */
	const {stepIndex: doorStep} = useStopMotionStep(Math.max(0, frame - DOOR_CLOSES), 2);
	const doorShut =
		frame < DOOR_CLOSES
			? 0
			: interpolate(Math.min(doorStep * 2, DOOR_FRAMES), [0, DOOR_FRAMES], [0, 1], CLAMP);
	const doorAngle = interpolate(doorShut, [0, 1], [-19, 0]);

	return (
		<AbsoluteFill style={{backgroundColor: '#0c0e11'}}>
			<AbsoluteFill
				style={{
					filter: `grayscale(${desat}) contrast(${1 + desat * 0.12}) brightness(${1 - desat * 0.06})`,
				}}
			>
				{/* The flat field Shot 1 assembled onto, unchanged. */}
				<AbsoluteFill style={{backgroundColor: '#e7dcc0'}}>
					<NewsprintTexture opacity={interpolate(desat, [0, 1], [0.16, 0.4], CLAMP)} />
				</AbsoluteFill>

				<AbsoluteFill style={{transform: `translateY(${breathY}px) rotate(${breathRot}deg)`}}>
					<div style={{position: 'absolute', left: WALL_LEFT, top: WALL_TOP, zIndex: 10}}>
						<PaperCutout
							asset="flat-wall"
							elevation={0.45}
							textureOpacity={0}
							style={{width: WALL_W, height: WALL_H}}
						/>
					</div>

					<div style={{position: 'absolute', left: 110, top: 200, zIndex: 14}}>
						<PaperCutout
							asset="wall-crack"
							elevation={0.3}
							textureOpacity={0}
							style={{width: 132, height: Math.round(132 / 0.277)}}
						/>
					</div>

					<div style={{position: 'absolute', left: 792, top: 210, zIndex: 14}}>
						<PaperCutout
							asset="poster-patch"
							elevation={0.35}
							textureOpacity={0}
							style={{width: 210, height: Math.round(210 / 0.653)}}
						/>
					</div>

					<div style={{position: 'absolute', left: 400, top: 300, zIndex: 16}}>
						<PaperCutout
							asset="wall-stain"
							elevation={0.4}
							textureOpacity={0}
							style={{width: 260, height: Math.round(260 / 0.904)}}
						/>
					</div>

					<div style={{position: 'absolute', left: 0, top: WALL_BOTTOM, zIndex: 8}}>
						<PaperCutout
							asset="flat-floor"
							elevation={0.4}
							textureOpacity={0}
							style={{width: FLOOR_W, height: FLOOR_H}}
						/>
					</div>

					<div style={{position: 'absolute', left: 60, top: WALL_BOTTOM + 115, zIndex: 12}}>
						<PaperCutout
							asset="floor-tile-cracked"
							elevation={0.6}
							textureOpacity={0}
							style={{width: 200, height: Math.round(200 / 0.965)}}
						/>
					</div>

					{/* Him, from behind, empty-handed. */}
					<div
						style={{position: 'absolute', left: LANDLORD_LEFT, top: LANDLORD_TOP, zIndex: 30}}
					>
						<PaperCutout
							asset="landlord-leaving"
							elevation={1}
							textureOpacity={0}
							outline
							style={{width: LANDLORD_W, height: LANDLORD_H}}
						/>
					</div>

					{/* The door, swinging shut about its hinge edge, in front of him. */}
					<div
						style={{
							position: 'absolute',
							left: DOOR_LEFT,
							top: DOOR_TOP,
							zIndex: 40,
							transform: `rotate(${doorAngle}deg)`,
							transformOrigin: 'left bottom',
						}}
					>
						<PaperCutout
							asset="flat-door"
							elevation={1.2}
							textureOpacity={0}
							style={{width: DOOR_W, height: DOOR_H}}
						/>
					</div>
				</AbsoluteFill>
			</AbsoluteFill>

			{/* The latch, on the step that closes it. */}
			<Sequence from={DOOR_CLOSES + DOOR_FRAMES}>
				<Audio src={staticFile('sfx/stamp-thud.wav')} volume={0.5} />
			</Sequence>

			<VoiceOver id="ep03-shot09-final" from={VO_STARTS} />

			{/* The case, closed. */}
			{frame >= STAMP_AT ? (
				<AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}>
					<EvidenceStamp
						text={'CASE FILE #0003\nCLOSED'}
						age={frame - STAMP_AT}
						fontSize={72}
						rotate={-6}
					/>
				</AbsoluteFill>
			) : null}
			<Sequence from={STAMP_AT}>
				<Audio src={staticFile('sfx/stamp-thud.wav')} volume={0.95} />
			</Sequence>

			{/* Hard cut to black, as the script asks. */}
			<AbsoluteFill style={{backgroundColor: '#000', opacity: blackout}} />
		</AbsoluteFill>
	);
};

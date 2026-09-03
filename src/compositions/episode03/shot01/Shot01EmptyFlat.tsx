import React from 'react';
import {
	AbsoluteFill,
	Audio,
	Sequence,
	interpolate,
	staticFile,
	useCurrentFrame,
} from 'remotion';
import {NewsprintTexture} from '../../../components/NewsprintTexture';
import {SAFE_BOTTOM_Y} from '../../../components/safeArea';
import {useStopMotionStep} from '../../../components/useStopMotionStep';
import {VoiceOver} from '../../../components/VoiceOver';
import {Accent, Accents, MARK} from '../Accents';
import {Arrive} from '../Arrive';
import {Placeholder} from '../Placeholder';
import {
	CASH_AT,
	CRACK_AT,
	FLOOR_AT,
	KEYS_AT,
	LANDLORD_ENTERS,
	LANDLORD_SPEAKS,
	POSTER_AT,
	STAIN_AT,
	TENANT_AT,
	TENANT_SPEAKS,
	TILE_AT,
	VO_AT,
	WALL_AT,
} from './beats';

const CLAMP = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

/**
 * The flat field the whole thing assembles onto.
 *
 * One colour with paper over it, not Episodes 01-02's gradient-and-vignette
 * craft-paper sheet. The reference's ground is flat and single-hued, and that
 * matters more than it sounds: a vignette pulls the eye to the middle, which
 * fights a composition being built out to its edges.
 *
 * Kept in the series' own palette rather than the reference's purple. The
 * motion signature and the accent layer are adoptable without making Episode 03
 * look like a different show; the ground colour is not.
 */
const Field: React.FC = () => (
	<AbsoluteFill style={{backgroundColor: '#e7dcc0'}}>
		<NewsprintTexture opacity={0.16} />
	</AbsoluteFill>
);

/**
 * The accent set. Sparse during the build so the evidence reads, then a burst
 * at the handover — the one moment in the shot that wants punctuation.
 */
const ACCENTS: Accent[] = [
	{kind: 'triangle', x: 0.09, y: 0.2, size: 66, at: CRACK_AT + 6, rotate: -12},
	{kind: 'circle', x: 0.86, y: 0.15, size: 44, at: POSTER_AT + 5, color: '#2c3752'},
	{kind: 'squiggle', x: 0.72, y: 0.33, size: 120, at: STAIN_AT + 7, rotate: -6},
	{kind: 'eye', x: 0.13, y: 0.42, size: 78, at: STAIN_AT + 14},
	{kind: 'square', x: 0.9, y: 0.52, size: 38, at: TILE_AT + 6, rotate: 18, color: '#2c3752'},
	{kind: 'triangle', x: 0.05, y: 0.62, size: 52, at: TENANT_AT + 8, rotate: 24},
	{kind: 'burst', x: 0.63, y: 0.55, size: 150, at: CASH_AT + 2},
	{kind: 'circle', x: 0.2, y: 0.3, size: 30, at: CASH_AT + 6},
	{kind: 'squiggle', x: 0.3, y: 0.7, size: 100, at: CASH_AT + 9, rotate: 8},
];

/**
 * Shot 1 — The Empty Flat.
 *
 * The frame opens on nothing and the flat builds itself: wall, crack, poster
 * patch, stain, floor, broken tile, and only then the man standing in it. Every
 * arrival lands rather than fades, on a nineteen-frame pulse, each with a paper
 * rustle — so the assembly is audible as well as visible.
 *
 * The joke needs the evidence to exist before either man does. By the time the
 * tenant opens his mouth the audience has already been shown everything he is
 * about to apologise for, which is what makes his apology funny and the
 * landlord's indifference land.
 */
export const Shot01EmptyFlat: React.FC = () => {
	const frame = useCurrentFrame();

	/** The whole composition breathes, as one sheet. */
	const {stepIndex: breath} = useStopMotionStep(frame, 9);
	const driftX = (breath % 3) - 1;
	const driftY = (breath % 2) * 1.2 - 0.6;

	/**
	 * The cash: a stepped position swap from his hand to the tenant's, two
	 * chunky steps rather than a tween. A smooth travel would be the only eased
	 * motion in the shot and would read as motion graphics.
	 */
	const cashAge = frame - CASH_AT;
	const {stepIndex: cashStep} = useStopMotionStep(Math.max(0, cashAge), 3);
	const cashHeld = Math.min(cashStep, 2) / 2;
	const cashX = interpolate(cashHeld, [0, 1], [672, 486]);
	const cashY = interpolate(cashHeld, [0, 1], [930, 986]);

	return (
		<AbsoluteFill>
			<Field />

			<AbsoluteFill style={{transform: `translate(${driftX}px, ${driftY}px)`}}>
				{/* The room, built. Placeholders until the art lands. */}
				<div style={{position: 'absolute', left: 60, top: 170, zIndex: 10}}>
					<Arrive at={WALL_AT} from="top" distance={30} tilt={1.2}>
						<Placeholder label="BARE WALL" file="flat-wall.jpg" width={960} height={700} seed={3} />
					</Arrive>
				</div>

				<div style={{position: 'absolute', left: 250, top: 232, zIndex: 14}}>
					<Arrive at={CRACK_AT} tilt={5} rotate={-2}>
						<Placeholder label="CRACK" file="wall-crack.jpg" width={132} height={480} seed={11} />
					</Arrive>
				</div>

				<div style={{position: 'absolute', left: 620, top: 268, zIndex: 14}}>
					<Arrive at={POSTER_AT} from="right" tilt={4} rotate={2.5}>
						<Placeholder label="POSTER PATCH" file="poster-patch.jpg" width={230} height={300} seed={19} />
					</Arrive>
				</div>

				<div style={{position: 'absolute', left: 400, top: 516, zIndex: 16}}>
					<Arrive at={STAIN_AT} tilt={6} rotate={-3}>
						<Placeholder label="STAIN" file="wall-stain.jpg" width={330} height={270} seed={23} />
					</Arrive>
				</div>

				<div style={{position: 'absolute', left: 0, top: 842, zIndex: 8}}>
					<Arrive at={FLOOR_AT} from="bottom" distance={40} tilt={0.8}>
						<Placeholder label="TILED FLOOR" file="flat-floor.jpg" width={1080} height={520} seed={31} />
					</Arrive>
				</div>

				<div style={{position: 'absolute', left: 150, top: 1020, zIndex: 12}}>
					<Arrive at={TILE_AT} tilt={7} rotate={4}>
						<Placeholder label="BROKEN TILE" file="floor-tile-cracked.jpg" width={280} height={230} seed={37} />
					</Arrive>
				</div>

				{/* The tenant, last of the room and first of the people. */}
				<div style={{position: 'absolute', left: 300, top: 600, zIndex: 30}}>
					<Arrive at={TENANT_AT} from="bottom" distance={36} tilt={2.5} rotate={-1}>
						<Placeholder label="TENANT" file="tenant-tense.jpg" width={360} height={700} seed={41} />
					</Arrive>
				</div>
				<div style={{position: 'absolute', left: 268, top: 1000, zIndex: 34}}>
					<Arrive at={KEYS_AT} tilt={9} rotate={-8}>
						<Placeholder label="KEYS" file="keys.jpg" width={110} height={90} seed={43} />
					</Arrive>
				</div>

				{/* The landlord, stepping in from the edge, cutting him off. */}
				<div style={{position: 'absolute', left: 646, top: 590, zIndex: 32}}>
					<Arrive at={LANDLORD_ENTERS} from="right" distance={210} tilt={2} rotate={1}>
						<Placeholder label="LANDLORD" file="landlord-cash.jpg" width={380} height={740} seed={47} />
					</Arrive>
				</div>

				{/* The cash, which is the only thing in the shot that moves twice. */}
				{frame >= LANDLORD_ENTERS ? (
					<div style={{position: 'absolute', left: cashX, top: cashY, zIndex: 40}}>
						<Placeholder label="CASH" file="cash-stack.jpg" width={150} height={100} seed={53} />
					</div>
				) : null}

				<Accents accents={ACCENTS} />
			</AbsoluteFill>

			{/* A label strip, the reference's other recurring device — one or two
			    words on torn paper, stated flat. Clear of the platform chrome. */}
			{frame >= CASH_AT + 12 ? (
				<div
					style={{
						position: 'absolute',
						left: 84,
						top: SAFE_BOTTOM_Y - 190,
						zIndex: 70,
					}}
				>
					<Arrive at={CASH_AT + 12} tilt={5} rotate={-1.5}>
						<div
							style={{
								display: 'inline-block',
								background: '#efe4c8',
								border: `4px solid ${MARK}`,
								padding: '14px 30px 16px',
								fontFamily: 'RansomAnton, sans-serif',
								fontSize: 74,
								letterSpacing: 2,
								color: '#241d15',
								boxShadow: '0 10px 20px rgba(48,34,18,0.3)',
							}}
						>
							FULL AMOUNT
						</div>
					</Arrive>
				</div>
			) : null}

			{/* Every arrival gets a rustle, so the assembly is heard as well as
			    seen. The spec asks for exactly this. */}
			{[WALL_AT, CRACK_AT, POSTER_AT, STAIN_AT, FLOOR_AT, TILE_AT, TENANT_AT, KEYS_AT].map(
				(at, i) => (
					<Sequence key={at} from={at} durationInFrames={20}>
						<Audio
							src={staticFile('sfx/paper-riffle.wav')}
							volume={i === 0 ? 0.5 : 0.34}
							playbackRate={1.5 + (i % 3) * 0.25}
						/>
					</Sequence>
				),
			)}

			<Sequence from={LANDLORD_ENTERS}>
				<Audio src={staticFile('sfx/paper-riffle.wav')} volume={0.42} playbackRate={1.15} />
			</Sequence>
			<Sequence from={CASH_AT}>
				<Audio src={staticFile('sfx/paper-riffle.wav')} volume={0.55} playbackRate={2.1} />
			</Sequence>
			<Sequence from={CASH_AT + 12}>
				<Audio src={staticFile('sfx/stamp-thud.wav')} volume={0.7} />
			</Sequence>

			{/* An empty flat has its own acoustics; the room is the bed. */}
			<Audio src={staticFile('sfx/room-hum.wav')} volume={0.13} />

			<VoiceOver id="ep03-shot01-tenant" from={TENANT_SPEAKS} />
			<VoiceOver id="ep03-shot01-landlord" from={LANDLORD_SPEAKS} />
			<VoiceOver id="ep03-shot01-vo" from={VO_AT} />
		</AbsoluteFill>
	);
};

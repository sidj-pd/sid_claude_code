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
import {PaperCutout} from '../../../components/PaperCutout';
import {Placeholder} from '../Placeholder';

/**
 * The wall's measured content ratio is 0.94 — nearly square, not the 1.37 the
 * prompt asked for. The box follows the art rather than stretching it, which
 * makes the wall taller and moves the floor down to meet its own skirting band.
 */
/*
 * These four carry textureOpacity={0}. PaperCutout's grain overlay is an
 * AbsoluteFill with mix-blend-mode:multiply, so it paints the whole div rather
 * than the artwork's silhouette — with a thin piece like the crack, 12% opaque
 * inside its own bounds, that reads as a rectangle of tinted field around it.
 * The delivered art already has halftone grain baked in, so nothing is lost.
 */
const WALL_LEFT = 40;
const WALL_TOP = 150;
const WALL_W = 1000;
/** Measured off the trimmed PNG, not asked for: 704x602. */
const WALL_H = Math.round(WALL_W / 1.169);
const WALL_BOTTOM = WALL_TOP + WALL_H;

/**
 * Figures are sized as a fraction of the wall rather than in absolute pixels.
 * A standing man against a domestic wall is about two thirds of its height; at
 * the pixel sizes the placeholders used he came out at 82% and the room read
 * like a doll's house.
 */
const TENANT_H = Math.round(WALL_H * 0.68);
const TENANT_W = Math.round(TENANT_H * 0.329);
const LANDLORD_H = Math.round(WALL_H * 0.72);
const LANDLORD_W = Math.round(LANDLORD_H * 0.416);
/** Both stand on the floor, a little in front of its top edge. */
const TENANT_TOP = WALL_BOTTOM + 314 - TENANT_H;
const LANDLORD_TOP = WALL_BOTTOM + 334 - LANDLORD_H;
const TENANT_LEFT = 290;
const LANDLORD_LEFT = 600;

/**
 * The floor's measured ratio is 0.574 — a tall receding grid, not the wide
 * letterbox the prompt asked for. That turns out to be the more useful shape:
 * laid from the wall's base at full frame width it runs off the bottom of the
 * frame, and because the art has its small far rows at the top and its large
 * near rows at the bottom, the perspective lands the right way round with no
 * cropping. Only the far half is ever on screen.
 */
const FLOOR_W = 1080;
const FLOOR_H = Math.round(FLOOR_W / 0.574);

/**
 * The cash starts in the landlord's upturned palm — measured off his artwork
 * at 0.32 across and 0.26 down his own bounding box, not guessed — and ends by
 * the tenant's free hand.
 */
const CASH_W = 180;
const CASH_H = Math.round(CASH_W / 1.623);
const PALM_X = LANDLORD_LEFT + Math.round(LANDLORD_W * 0.32);
const PALM_Y = LANDLORD_TOP + Math.round(LANDLORD_H * 0.26);
import {
	ACCENT_BEAT,
	CASH_AT,
	CRACK_AT,
	FLOOR_AT,
	LANDLORD_ENTERS,
	LANDLORD_SPEAKS,
	OFFBEAT,
	POSTER_AT,
	STAIN_AT,
	TENANT_AT,
	TENANT_SPEAKS,
	TILE_AT,
	VO_A_AT,
	VO_B_AT,
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
	{kind: 'triangle', x: 0.05, y: 0.62, size: 52, at: ACCENT_BEAT, rotate: 24},
	{kind: 'burst', x: 0.63, y: 0.55, size: 150, at: CASH_AT + 2},
	{kind: 'circle', x: 0.2, y: 0.3, size: 30, at: CASH_AT + 6},
	{kind: 'squiggle', x: 0.3, y: 0.7, size: 100, at: CASH_AT + 9, rotate: 8},

	/*
	 * Off-beat marks. The pulse stayed at the reference's measured 19 frames,
	 * so the extra energy the brief asked for is bought here instead — a small
	 * accent on the half-beat between arrivals doubles the event rate without
	 * moving the tempo the assembly is locked to.
	 */
	{kind: 'square', x: 0.78, y: 0.08, size: 22, at: CRACK_AT + OFFBEAT, rotate: 12},
	{kind: 'circle', x: 0.28, y: 0.13, size: 20, at: POSTER_AT + OFFBEAT, color: '#2c3752'},
	{kind: 'triangle', x: 0.94, y: 0.29, size: 28, at: STAIN_AT + OFFBEAT, rotate: -30},
	{kind: 'square', x: 0.07, y: 0.34, size: 24, at: FLOOR_AT + OFFBEAT, rotate: -8},
	{kind: 'circle', x: 0.83, y: 0.44, size: 18, at: TILE_AT + OFFBEAT},
	{kind: 'triangle', x: 0.17, y: 0.55, size: 26, at: TENANT_AT + OFFBEAT, rotate: 8, color: '#2c3752'},
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
	const cashX = interpolate(cashHeld, [0, 1], [PALM_X - CASH_W / 2, TENANT_LEFT + 110]);
	const cashY = interpolate(cashHeld, [0, 1], [PALM_Y - CASH_H / 2, TENANT_TOP + Math.round(TENANT_H * 0.48)]);

	return (
		<AbsoluteFill>
			<Field />

			<AbsoluteFill style={{transform: `translate(${driftX}px, ${driftY}px)`}}>
				{/* The room, built. Placeholders until the art lands. */}
				<div style={{position: 'absolute', left: WALL_LEFT, top: WALL_TOP, zIndex: 10}}>
					<Arrive at={WALL_AT} from="top" distance={30} tilt={1.2}>
						<PaperCutout
							asset="flat-wall"
							elevation={0.45}
							textureOpacity={0}
							style={{width: WALL_W, height: WALL_H}}
						/>
					</Arrive>
				</div>

				<div style={{position: 'absolute', left: 110, top: 200, zIndex: 14}}>
					<Arrive at={CRACK_AT} tilt={5} rotate={-2}>
						<PaperCutout
							asset="wall-crack"
							elevation={0.3}
							textureOpacity={0}
							style={{width: 132, height: Math.round(132 / 0.277)}}
						/>
					</Arrive>
				</div>

				<div style={{position: 'absolute', left: 792, top: 210, zIndex: 14}}>
					<Arrive at={POSTER_AT} from="right" tilt={4} rotate={2.5}>
						<PaperCutout
							asset="poster-patch"
							elevation={0.35}
							textureOpacity={0}
							style={{width: 210, height: Math.round(210 / 0.653)}}
						/>
					</Arrive>
				</div>

				<div style={{position: 'absolute', left: 430, top: 380, zIndex: 16}}>
					<Arrive at={STAIN_AT} tilt={6} rotate={-3}>
						<PaperCutout
							asset="wall-stain"
							elevation={0.4}
							textureOpacity={0}
							style={{width: 260, height: Math.round(260 / 0.904)}}
						/>
					</Arrive>
				</div>

				<div style={{position: 'absolute', left: 0, top: WALL_BOTTOM, zIndex: 8}}>
					<Arrive at={FLOOR_AT} from="bottom" distance={40} tilt={0.8}>
						<PaperCutout
							asset="flat-floor"
							elevation={0.4}
							textureOpacity={0}
							style={{width: FLOOR_W, height: FLOOR_H}}
						/>
					</Arrive>
				</div>

				<div style={{position: 'absolute', left: 60, top: WALL_BOTTOM + 115, zIndex: 12}}>
					<Arrive at={TILE_AT} tilt={7} rotate={4}>
						<PaperCutout
							asset="floor-tile-cracked"
							elevation={0.6}
							textureOpacity={0}
							style={{width: 200, height: Math.round(200 / 0.965)}}
						/>
					</Arrive>
				</div>

				{/* The tenant, last of the room and first of the people. */}
				<div style={{position: 'absolute', left: TENANT_LEFT, top: TENANT_TOP, zIndex: 30}}>
					<Arrive at={TENANT_AT} from="bottom" distance={36} tilt={2.5} rotate={-1}>
						<PaperCutout
							asset="tenant-tense"
							elevation={0.85}
							textureOpacity={0}
							style={{width: TENANT_W, height: TENANT_H}}
						/>
					</Arrive>
				</div>

				{/* The landlord, stepping in from the edge, cutting him off. */}
				<div style={{position: 'absolute', left: LANDLORD_LEFT, top: LANDLORD_TOP, zIndex: 32}}>
					<Arrive at={LANDLORD_ENTERS} from="right" distance={210} tilt={2} rotate={1}>
						<PaperCutout
							asset="landlord-offer"
							elevation={1}
							textureOpacity={0}
							style={{width: LANDLORD_W, height: LANDLORD_H}}
						/>
					</Arrive>
				</div>

				{/* The cash, which is the only thing in the shot that moves twice. */}
				{frame >= LANDLORD_ENTERS ? (
					<div style={{position: 'absolute', left: cashX, top: cashY, zIndex: 40}}>
						<PaperCutout
							asset="cash-stack"
							elevation={1.15}
							textureOpacity={0}
							style={{width: CASH_W, height: CASH_H}}
						/>
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
			{[WALL_AT, CRACK_AT, POSTER_AT, STAIN_AT, FLOOR_AT, TILE_AT, TENANT_AT].map(
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

			{/* The -cut takes are the sources with their dead air removed by
			    scripts/tighten-vo.py; each transcribes identically to its
			    source. The narration is split at its own mid-line silence so
			    the first half can open the shot under the assembly. */}
			<VoiceOver id="ep03-shot01-vo-a" from={VO_A_AT} />
			<VoiceOver id="ep03-shot01-tenant-cut" from={TENANT_SPEAKS} />
			<VoiceOver id="ep03-shot01-landlord-cut" from={LANDLORD_SPEAKS} />
			<VoiceOver id="ep03-shot01-vo-b" from={VO_B_AT} />
		</AbsoluteFill>
	);
};

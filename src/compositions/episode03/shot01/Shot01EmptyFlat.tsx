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
import {MARK} from '../Accents';
import {Arrive} from '../Arrive';
import {PaperCutout} from '../../../components/PaperCutout';
import {Placeholder} from '../Placeholder';
import {TalkSway} from '../TalkSway';

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
const TENANT_H = Math.round(WALL_H * 0.9);
const TENANT_W = Math.round(TENANT_H * 0.329);
const LANDLORD_H = Math.round(WALL_H * 0.94);
const LANDLORD_W = Math.round(LANDLORD_H * 0.385);
/** Both stand on the floor, a little in front of its top edge. */
const TENANT_TOP = WALL_BOTTOM + 300 - TENANT_H;
const LANDLORD_TOP = WALL_BOTTOM + 320 - LANDLORD_H;
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
 * at 0.25 across and 0.32 down his own bounding box, not guessed — and ends by
 * the tenant's free hand.
 */
const CASH_W = 115;
const CASH_H = Math.round(CASH_W / 1.623);
const PALM_X = LANDLORD_LEFT + Math.round(LANDLORD_W * 0.25);
const PALM_Y = LANDLORD_TOP + Math.round(LANDLORD_H * 0.32);
/**
 * The tenant's free hand, the other end of the travel. His art was measured
 * at 0.85 across his own box — but he is now mirrored (see TENANT_FLIP below)
 * to face the landlord, and a horizontal flip reflects every x-fraction about
 * the box's centre, so the free hand that was at 0.85 is now at 1-0.85=0.15.
 */
const HAND_X = TENANT_LEFT + Math.round(TENANT_W * 0.15);
const HAND_Y = TENANT_TOP + Math.round(TENANT_H * 0.62);
/**
 * His artwork was generated facing camera-left, away from the landlord. The
 * confrontation reads backwards with him turned away from the man he is
 * talking to, so he is mirrored to face right, toward the landlord — a plain
 * CSS flip, not a re-generation, since nothing about his pose needs to change.
 */
const TENANT_FLIP = {transform: 'scaleX(-1)'} as const;
import {
	CASH_AT,
	CRACK_AT,
	FLOOR_AT,
	LANDLORD_ENTERS,
	LANDLORD_FRAMES,
	LANDLORD_SPEAKS,
	POSTER_AT,
	STAIN_AT,
	TENANT_AT,
	TENANT_FRAMES,
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
	const cashX = interpolate(cashHeld, [0, 1], [PALM_X - CASH_W / 2, HAND_X - CASH_W / 2]);
	const cashY = interpolate(cashHeld, [0, 1], [PALM_Y - CASH_H / 2, HAND_Y - CASH_H / 2]);

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

				<div style={{position: 'absolute', left: 762, top: 170, zIndex: 14}}>
					<Arrive at={POSTER_AT} from="right" tilt={4} rotate={2.5}>
						<PaperCutout
							asset="poster-patch"
							elevation={0.35}
							textureOpacity={0}
							style={{width: 210, height: Math.round(210 / 0.653)}}
						/>
					</Arrive>
				</div>

				{/* Moved up and toward centre for the bigger figures below: at the
				    old y=300 it sat in the tenant's now-taller head and shoulders. */}
				<div style={{position: 'absolute', left: 450, top: 180, zIndex: 16}}>
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

				{/* The tenant, last of the room and first of the people. A white
				    outline sells him as a sticker-style cutout against the busy
				    wall, and he sways while his own line plays — standing in for
				    a mouth the art doesn't have. */}
				<div style={{position: 'absolute', left: TENANT_LEFT, top: TENANT_TOP, zIndex: 30}}>
					<Arrive at={TENANT_AT} from="bottom" distance={36} tilt={2.5} rotate={-1}>
						<TalkSway from={TENANT_SPEAKS} frames={TENANT_FRAMES}>
							<PaperCutout
								asset="tenant-tense"
								elevation={0.85}
								textureOpacity={0}
								outline={{width: 7}}
								style={{width: TENANT_W, height: TENANT_H, ...TENANT_FLIP}}
							/>
						</TalkSway>
					</Arrive>
				</div>

				{/* The landlord, stepping in from the edge, cutting him off. Same
				    outline treatment as the tenant, and the same talk-sway while
				    his own line plays. */}
				<div style={{position: 'absolute', left: LANDLORD_LEFT, top: LANDLORD_TOP, zIndex: 32}}>
					<Arrive at={LANDLORD_ENTERS} from="right" distance={210} tilt={2} rotate={1}>
						<TalkSway from={LANDLORD_SPEAKS} frames={LANDLORD_FRAMES}>
							<PaperCutout
								asset="landlord-offer"
								elevation={1}
								textureOpacity={0}
								outline={{width: 7}}
								style={{width: LANDLORD_W, height: LANDLORD_H}}
							/>
						</TalkSway>
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

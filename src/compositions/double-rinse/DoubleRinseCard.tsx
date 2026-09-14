import React, {useLayoutEffect, useState} from 'react';
import {AbsoluteFill, continueRender, delayRender, useCurrentFrame} from 'remotion';
import '../../components/doubleRinseFonts';

/**
 * Double Rinse title card: "New Miniseries" / DOUBLE / RINSE / episode line,
 * as a transparent overlay for CapCut.
 *
 * Proportions are measured from the user's own Episode 5 card (1264x2221,
 * scaled to 1080 wide = 1898 tall, so +11px to centre it in 1920). Each line
 * is placed by its BASELINE at the measured y, and sized from the font's real
 * cap height so letters come out as tall as the CapCut original:
 *
 * - DOUBLE: caps 167px on the card. Poppins Black caps are 0.708em, so 235px;
 *   DOUBLE then sets ~916px wide against the card's 924 — a near match.
 * - New Miniseries: caps 83px, 593px wide. Gloria is wider than Crayon, so a
 *   height match alone would run 706px; 92px splits the difference.
 * - Episode line: caps 64px with wide tracking; 71px with 7px tracking keeps
 *   the look and fits the longer "Episode 2 - Hit wicket".
 *
 * Gloria Hallelujah ships one thin weight. A same-colour stroke painted over
 * the fill thickens it to Crayon's marker weight; the soft dark halo copies
 * CapCut's shadow.
 *
 * Frame 0 is the whole card; 1, 2 and 3 are the series line, the title and
 * the episode line alone, for placing separately.
 */

const YELLOW = '#FFE226';
const WHITE = '#FEFEFE';
const FRAME_WIDTH = 1080;
/** Lines wider than this shrink; keeps ~50px clear on each side. */
const MEASURE = 980;
/** The card is 1898 tall at 1080 wide; centre it in the 1920 frame. */
const Y_OFFSET = 11;

// First layer: a black shadow cast down and to the right, which the user asked
// for on all three lines. The soft halo layers after it are the original
// CapCut-style glow and keep the type off busy art. Offsets scale with type
// size — the title's letters are ~2.5x the handwritten lines'.
// The handwritten lines' cast shadow is NOT a text-shadow: text-shadow is cast
// by the thin Gloria glyph, and the same-colour stroke that fattens the letters
// covered most of it — the user could not see it at all. HAND_CAST draws a
// black, equally stroked copy of the line behind it instead, so the shadow is
// as heavy as the letters. Only the soft halo stays a text-shadow.
const HAND_SHADOW = '0 0 16px rgba(0, 0, 0, 0.6), 0 0 34px rgba(0, 0, 0, 0.35)';
const HAND_CAST = {x: 9, y: 11, blur: 1.5};
const TITLE_SHADOW = '12px 14px 6px rgba(0, 0, 0, 0.85), 0 0 28px rgba(0, 0, 0, 0.55), 0 0 60px rgba(0, 0, 0, 0.35)';

type LineSpec = {
	text: string;
	family: string;
	weight: number;
	size: number;
	/** Baseline y in the card's 1080-wide coordinates. */
	baseline: number;
	color: string;
	letterSpacing?: number;
	/** Same-colour stroke width that fattens a thin face. */
	stroke?: number;
	/** A solid black copy of the line, offset down-right, drawn behind it. */
	cast?: {x: number; y: number; blur: number};
	shadow: string;
};

const SERIES: LineSpec = {
	text: 'New Miniseries',
	family: 'DrGloria',
	weight: 400,
	size: 92,
	baseline: 749,
	color: WHITE,
	stroke: 6,
	cast: HAND_CAST,
	shadow: HAND_SHADOW,
};
const TITLE_TOP: LineSpec = {
	text: 'DOUBLE',
	family: 'DrPoppins',
	weight: 900,
	size: 235,
	baseline: 973,
	color: YELLOW,
	shadow: TITLE_SHADOW,
};
const TITLE_BOTTOM: LineSpec = {...TITLE_TOP, text: 'RINSE', baseline: 1177};
const episodeLine = (text: string): LineSpec => ({
	text,
	family: 'DrGloria',
	weight: 400,
	size: 71,
	baseline: 1288,
	color: WHITE,
	letterSpacing: 7,
	stroke: 5,
	cast: HAND_CAST,
	shadow: HAND_SHADOW,
});

export const DR_TEST_EPISODE = 'Episode 2 - Hit wicket';

type Metrics = {ascent: number; descent: number; width: number};

/**
 * One centred line with its baseline pinned to spec.baseline. The canvas
 * reports the face's line metrics, which fixes where the baseline falls in a
 * line box — the same technique that centres the Kannada episode plates.
 */
const BaselineLine: React.FC<{spec: LineSpec; hidden: boolean}> = ({spec, hidden}) => {
	const [m, setM] = useState<Metrics | null>(null);
	const [handle] = useState(() => delayRender(`Measuring "${spec.text}"`));

	useLayoutEffect(() => {
		document.fonts.ready.then(() => {
			const ctx = document.createElement('canvas').getContext('2d') as
				| (CanvasRenderingContext2D & {letterSpacing: string})
				| null;
			if (ctx) {
				ctx.font = `${spec.weight} ${spec.size}px '${spec.family}'`;
				ctx.letterSpacing = `${spec.letterSpacing ?? 0}px`;
				const t = ctx.measureText(spec.text);
				setM({ascent: t.fontBoundingBoxAscent, descent: t.fontBoundingBoxDescent, width: t.width});
			}
			continueRender(handle);
		});
		// One mount per line; the spec never changes in place.
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [handle]);

	if (!m) {
		return null;
	}

	const s = Math.min(1, MEASURE / m.width);
	const size = spec.size * s;
	const tracking = (spec.letterSpacing ?? 0) * s;
	const baselineInLine = (size - (m.ascent + m.descent) * s) / 2 + m.ascent * s;

	const top = spec.baseline + Y_OFFSET - baselineInLine;
	const strokeWidth = spec.stroke ? spec.stroke * s : 0;
	const base: React.CSSProperties = {
		position: 'absolute',
		left: 0,
		width: FRAME_WIDTH,
		top,
		textAlign: 'center',
		whiteSpace: 'nowrap',
		fontFamily: spec.family,
		fontWeight: spec.weight,
		fontSize: size,
		lineHeight: `${size}px`,
		letterSpacing: tracking,
		// CSS adds tracking after the last letter too; pad the start to match
		// so the ink stays centred.
		paddingLeft: tracking,
		visibility: hidden ? 'hidden' : 'visible',
	};

	return (
		<>
			{spec.cast ? (
				<div
					style={{
						...base,
						left: spec.cast.x * s,
						top: top + spec.cast.y * s,
						color: '#000',
						WebkitTextStroke: strokeWidth ? `${strokeWidth}px #000` : undefined,
						filter: `blur(${spec.cast.blur * s}px)`,
					}}
				>
					{spec.text}
				</div>
			) : null}
			<div
				style={{
					...base,
					color: spec.color,
					WebkitTextStroke: strokeWidth ? `${strokeWidth}px ${spec.color}` : undefined,
					textShadow: spec.shadow,
				}}
			>
				{spec.text}
			</div>
		</>
	);
};

export const DoubleRinseCard: React.FC = () => {
	const frame = useCurrentFrame();
	const show = (part: number) => frame === 0 || frame === part;

	return (
		<AbsoluteFill>
			<BaselineLine spec={SERIES} hidden={!show(1)} />
			<BaselineLine spec={TITLE_TOP} hidden={!show(2)} />
			<BaselineLine spec={TITLE_BOTTOM} hidden={!show(2)} />
			<BaselineLine spec={episodeLine(DR_TEST_EPISODE)} hidden={!show(3)} />
		</AbsoluteFill>
	);
};

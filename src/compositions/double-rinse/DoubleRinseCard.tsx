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
 * - Episode line: caps 64px on the card; 71px. The user judged Gloria with
 *   reduced spacing the closest match to Crayon. Both handwritten lines use
 *   zero tracking — the fattening stroke already tightens them — replacing an
 *   earlier wide +7px; a further -3px merged letters.
 *
 * Gloria Hallelujah ships one thin weight. A same-colour stroke painted over
 * the fill thickens it to Crayon's marker weight; the soft dark halo copies
 * CapCut's shadow.
 *
 * Each episode renders the whole card plus the series line, the title and
 * the episode line alone, for placing separately.
 */

export const YELLOW = '#FFE226';
export const WHITE = '#FEFEFE';
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

export type LineSpec = {
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

export const SERIES: LineSpec = {
	text: 'New Miniseries',
	family: 'DrGloria',
	weight: 400,
	size: 92,
	baseline: 749,
	color: WHITE,
	// The user wants Gloria's spacing reduced, as closest to Crayon. The stroke
	// that fattens the letters already closes the gaps by ~3px a side, so zero
	// tracking IS the reduced look. -3px on top of the stroke was tried and
	// merged letters outright (Mini, Hit wicket, Retirement).
	letterSpacing: 0,
	stroke: 6,
	cast: HAND_CAST,
	shadow: HAND_SHADOW,
};
export const TITLE_TOP: LineSpec = {
	text: 'DOUBLE',
	family: 'DrPoppins',
	weight: 900,
	size: 235,
	baseline: 973,
	color: YELLOW,
	shadow: TITLE_SHADOW,
};
export const TITLE_BOTTOM: LineSpec = {...TITLE_TOP, text: 'RINSE', baseline: 1177};
export const episodeLine = (text: string): LineSpec => ({
	text,
	family: 'DrGloria',
	weight: 400,
	size: 71,
	baseline: 1288,
	color: WHITE,
	letterSpacing: 0,
	stroke: 5,
	cast: HAND_CAST,
	shadow: HAND_SHADOW,
});

/** Every episode's line, in order. Frames come in fours per entry (see DoubleRinseCard). */
export const DR_EPISODES = [
	'Episode 2 - Hit wicket',
	'Episode 3 - Early Retirement',
	'Episode 6 - Protein Phase',
	'Episode 7 - Uturn',
	'Episode 8 - Sambar scale',
	'Episode 11 - The Suitcase',
	'Episode 12 - The Sofa Spot',
	'Episode 13 - Supermarket items',
];

/**
 * End-of-video prompts (share, follow), each set as two centred lines in the
 * "New Miniseries" style — same face, size, stroke and shadows — because one
 * line at that size would run nearly twice the frame width. They follow the
 * episode frames: frame 4 * DR_EPISODES.length + n is prompt n.
 */
export type DrCta = {lines: [string, string]; /** Defaults to the series line's white. */ color?: string};
export const DR_CTAS: DrCta[] = [
	{lines: ['Send this to your', 'protein-mad spouse.']},
	{lines: ['Follow for the', 'next ‘phase.’']},
	// Episode 7: the user wants these in the title's yellow, still in the handwritten face
	{lines: ['Send this to your', 'eighty-twenty partner'], color: YELLOW},
	{lines: ['Follow for the', 'next argument'], color: YELLOW},
	// Episode 8, yellow like Episode 7 (user confirmed)
	{lines: ['Send this to someone who’s', 'a ‘specialized category’'], color: YELLOW},
	{lines: ['Follow to see if she', 'ever hits ten'], color: YELLOW},
	// The beach episode, same yellow as the last two
	{lines: ['Share if some part of you is', 'still on a beach somewhere.'], color: YELLOW},
	{lines: ['Follow to see if the next', 'trip actually happens.'], color: YELLOW},
	// The ‘spot’ episode; every line here is short enough to set at full size
	{lines: ['Send this to whoever', 'has a ‘spot.’'], color: YELLOW},
	{lines: ['Follow for new', 'episodes everyday.'], color: YELLOW},
	// Episode 13
	{lines: ['Send this to the guy who', 'suddenly wants to come along.'], color: YELLOW},
	{lines: ['Follow for his next', 'terrible take.'], color: YELLOW},
	// The phase episode
	{lines: ['Tag someone still in', 'month three of a phase.'], color: YELLOW},
	{lines: ['Follow to see if he ever', 'touches a dumbbell.'], color: YELLOW},
];
const CTA_BASELINES = [900, 1018];
const ctaLine = (text: string, baseline: number, color = WHITE): LineSpec => ({...SERIES, text, baseline, color});

type Metrics = {ascent: number; descent: number; width: number};

/**
 * One centred line with its baseline pinned to spec.baseline. The canvas
 * reports the face's line metrics, which fixes where the baseline falls in a
 * line box — the same technique that centres the Kannada episode plates.
 */
export const BaselineLine: React.FC<{spec: LineSpec; hidden: boolean}> = ({spec, hidden}) => {
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
		// CSS adds tracking after the last letter too, which pulls centred text
		// off by half of it. Shift back by that half — a translate, because the
		// tracking is negative here and padding cannot be.
		translate: `${tracking / 2}px 0`,
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

/**
 * Frames come in fours per DR_EPISODES entry n: 4n is the whole card, 4n+1 the
 * series line, 4n+2 the title, 4n+3 the episode line alone. A long episode
 * name shrinks to the measure, so its letters can come out smaller than a
 * short one's — "Early Retirement" is the first to hit it.
 */
export const DoubleRinseCard: React.FC = () => {
	const frame = useCurrentFrame();

	const cta = frame - DR_EPISODES.length * 4;
	if (cta >= 0) {
		const {lines, color} = DR_CTAS[Math.min(cta, DR_CTAS.length - 1)];
		return (
			<AbsoluteFill>
				{lines.map((text, i) => (
					<BaselineLine key={text} spec={ctaLine(text, CTA_BASELINES[i], color)} hidden={false} />
				))}
			</AbsoluteFill>
		);
	}

	const episode = DR_EPISODES[Math.min(Math.floor(frame / 4), DR_EPISODES.length - 1)];
	const part = frame % 4;
	const show = (p: number) => part === 0 || part === p;

	return (
		<AbsoluteFill>
			<BaselineLine spec={SERIES} hidden={!show(1)} />
			<BaselineLine spec={TITLE_TOP} hidden={!show(2)} />
			<BaselineLine spec={TITLE_BOTTOM} hidden={!show(2)} />
			<BaselineLine key={episode} spec={episodeLine(episode)} hidden={!show(3)} />
		</AbsoluteFill>
	);
};

import React, {useLayoutEffect, useRef, useState} from 'react';
import {AbsoluteFill, continueRender, delayRender, useCurrentFrame} from 'remotion';
import '../../components/kannadaFonts';

/**
 * Opening title for the Kannada miniseries "ಖರೆ ಹೇಳ್ಯೋ ಸುಳ್ಳ ಹೇಳ್ಯೋ", as a
 * transparent overlay to lay over footage in CapCut.
 *
 * Nothing paints the background, so `remotion still` writes a PNG with alpha.
 * Legibility comes from the type itself — a hard offset shadow plus a wide
 * soft one — rather than from a plate behind it.
 *
 * Laid out against Episode 01's opening shot: a night sky over the top third,
 * a blue coach with lit windows through the middle, dark ballast and track
 * below. So the title sits up in the sky, the episode block sits on the dark
 * track bed, and nothing crosses the lit windows. The episode block's bottom
 * edge is pinned above the vertical-video safe line (y = 1536).
 *
 * TEST RUN: three typeface treatments, one per second of the timeline.
 * Frame 0 = A, 30 = B, 60 = C. Render stills at those frames to compare.
 * KhareHelyoFontSpecimen reuses TitleOverlay to try every cleared face.
 */

const TITLE_LINES: [string, string][] = [
	// [highlighted word, rest] — ಖರೆ (truth) and ಸುಳ್ಳ (lie) carry the accent.
	['ಖರೆ', ' ಹೇಳ್ಯೋ'],
	['ಸುಳ್ಳ', ' ಹೇಳ್ಯೋ'],
];
const TAG = 'NEW KANNADA MINISERIES';
const EPISODE_LABEL = 'EPISODE 01';
const EPISODE_NAME = 'ಒಂದು ರೈಲಿನ ಪಯಣ';

const FRAME_WIDTH = 1080;
const FRAME_HEIGHT = 1920;
const SAFE_BOTTOM_Y = 1536;
const SIDE_MARGIN = 70;
const MEASURE = FRAME_WIDTH - 2 * SIDE_MARGIN;
/** Clear of the platform's top bar (Reels / Shorts header). */
const TITLE_TOP_Y = 150;
/** Episode block ends this far above the safe line. */
const EPISODE_BOTTOM_Y = SAFE_BOTTOM_Y - 70;

const CREAM = '#FFF3D6';
const TURMERIC = '#F4B63F';
const SHADOW =
	'0 4px 0 rgba(30, 14, 4, 0.55), 0 10px 34px rgba(0, 0, 0, 0.65), 0 0 2px rgba(0, 0, 0, 0.5)';
const SMALL_SHADOW = '0 2px 0 rgba(30, 14, 4, 0.5), 0 4px 16px rgba(0, 0, 0, 0.6)';

export type Treatment = {
	/** fontSize is the largest allowed; lines shrink to fit the measure. */
	title: React.CSSProperties;
	episodeName: React.CSSProperties;
	label: React.CSSProperties;
};

const TREATMENTS: Treatment[] = [
	// A — rounded heavy, TV serial.
	{
		// 200 ran ಸುಳ್ಳ ಹೇಳ್ಯೋ ~50px past both frame edges; sized to the 940 measure.
		title: {fontFamily: 'KnBalooTamma', fontWeight: 800, fontSize: 160, lineHeight: 1.15},
		episodeName: {fontFamily: 'KnBalooTamma', fontWeight: 600, fontSize: 86},
		label: {fontFamily: 'KnBalooTamma', fontWeight: 700, fontSize: 36, letterSpacing: 9},
	},
	// B — literary serif, cinema.
	{
		title: {fontFamily: 'KnTiro', fontWeight: 400, fontSize: 172, lineHeight: 1.2},
		episodeName: {fontFamily: 'KnNotoSerif', fontWeight: 600, fontSize: 80},
		label: {fontFamily: 'KnNotoSerif', fontWeight: 600, fontSize: 34, letterSpacing: 10},
	},
	// C — condensed black, OTT key art.
	{
		title: {
			fontFamily: 'KnAnek',
			fontWeight: 800,
			fontStretch: '75%',
			fontSize: 205,
			lineHeight: 1.05,
		},
		episodeName: {fontFamily: 'KnAnek', fontWeight: 600, fontStretch: '100%', fontSize: 88},
		label: {
			fontFamily: 'KnAnek',
			fontWeight: 600,
			fontStretch: '125%',
			fontSize: 34,
			letterSpacing: 8,
		},
	},
];

/**
 * One line of type, shrunk to the measure if it would overflow.
 *
 * Kannada faces differ in set width by more than 2x at the same size
 * (Padyakke Expanded against Anek Condensed), so any fixed size either runs
 * the wide ones off the frame — which is what v1 did — or leaves the narrow
 * ones small. Callers must key this by face so it re-measures when the face
 * changes between frames.
 */
const FitLine: React.FC<{style: React.CSSProperties; children: React.ReactNode}> = ({style, children}) => {
	const ref = useRef<HTMLDivElement>(null);
	const [scale, setScale] = useState(1);
	const [handle] = useState(() => delayRender('Fitting a title line'));

	useLayoutEffect(() => {
		document.fonts.ready.then(() => {
			// offsetWidth, not getBoundingClientRect: the Studio preview scales
			// the canvas with a transform, which the latter would include.
			const width = ref.current?.offsetWidth ?? 0;
			if (width > MEASURE) {
				setScale(MEASURE / width);
			}
			continueRender(handle);
		});
	}, [handle]);

	return (
		<div ref={ref} style={{...style, fontSize: (style.fontSize as number) * scale, whiteSpace: 'nowrap'}}>
			{children}
		</div>
	);
};

const Rule: React.FC<{width: number}> = ({width}) => (
	<div style={{width, height: 4, borderRadius: 2, backgroundColor: TURMERIC, boxShadow: SMALL_SHADOW}} />
);

const group: React.CSSProperties = {
	position: 'absolute',
	left: 0,
	right: 0,
	display: 'flex',
	flexDirection: 'column',
	alignItems: 'center',
	padding: `0 ${SIDE_MARGIN}px`,
	color: CREAM,
	textAlign: 'center',
};

const faceKey = (s: React.CSSProperties) => `${s.fontFamily}/${s.fontWeight}/${s.fontStretch}`;

export const TitleOverlay: React.FC<{t: Treatment}> = ({t}) => (
	<AbsoluteFill>
		<div style={{...group, top: TITLE_TOP_Y}}>
			<div style={{display: 'flex', alignItems: 'center', gap: 22, marginBottom: 34}}>
				<Rule width={70} />
				<div style={{...t.label, color: CREAM, textShadow: SMALL_SHADOW, whiteSpace: 'nowrap'}}>{TAG}</div>
				<Rule width={70} />
			</div>

			{TITLE_LINES.map(([accent, rest]) => (
				<FitLine key={`${faceKey(t.title)}/${accent}`} style={{...t.title, textShadow: SHADOW}}>
					<span style={{color: TURMERIC}}>{accent}</span>
					{rest}
				</FitLine>
			))}
		</div>

		<div style={{...group, bottom: FRAME_HEIGHT - EPISODE_BOTTOM_Y}}>
			<div
				style={{
					...t.label,
					color: CREAM,
					padding: '8px 26px 6px',
					marginBottom: 18,
					border: `3px solid ${TURMERIC}`,
					borderRadius: 999,
					textShadow: SMALL_SHADOW,
					boxShadow: SMALL_SHADOW,
					whiteSpace: 'nowrap',
				}}
			>
				{EPISODE_LABEL}
			</div>
			<FitLine key={faceKey(t.episodeName)} style={{...t.episodeName, color: TURMERIC, textShadow: SHADOW}}>
				{EPISODE_NAME}
			</FitLine>
		</div>
	</AbsoluteFill>
);

export const KhareHelyoTitle: React.FC = () => {
	const frame = useCurrentFrame();
	return <TitleOverlay t={TREATMENTS[Math.min(TREATMENTS.length - 1, Math.floor(frame / 30))]} />;
};

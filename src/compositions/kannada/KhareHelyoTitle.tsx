import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import '../../components/kannadaFonts';

/**
 * Opening title for the Kannada miniseries "ಖರೆ ಹೇಳ್ಯೋ ಸುಳ್ಳ ಹೇಳ್ಯೋ", as a
 * transparent overlay to lay over footage in CapCut.
 *
 * Nothing paints the background, so `remotion still` writes a PNG with alpha.
 * The overlay goes over footage that has not been seen here, so legibility
 * comes from the type itself — a hard offset shadow plus a wide soft one —
 * rather than from a plate behind it.
 *
 * TEST RUN: three typeface treatments, one per second of the timeline.
 * Frame 0 = A, 30 = B, 60 = C. Render stills at those frames to compare.
 *
 * Layout is centred in the frame ABOVE the vertical-video safe line
 * (y = 1536), not in the whole 1920 — platform UI covers the bottom 20%.
 */

const TITLE_LINES: [string, string][] = [
	// [highlighted word, rest] — ಖರೆ (truth) and ಸುಳ್ಳ (lie) carry the accent.
	['ಖರೆ', ' ಹೇಳ್ಯೋ'],
	['ಸುಳ್ಳ', ' ಹೇಳ್ಯೋ'],
];
const TAG = 'NEW KANNADA MINISERIES';
const EPISODE_LABEL = 'EPISODE 01';
const EPISODE_NAME = 'ಒಂದು ರೈಲಿನ ಪಯಣ';

const SAFE_BOTTOM_Y = 1536;

const CREAM = '#FFF3D6';
const TURMERIC = '#F4B63F';
const SHADOW =
	'0 4px 0 rgba(30, 14, 4, 0.55), 0 10px 34px rgba(0, 0, 0, 0.65), 0 0 2px rgba(0, 0, 0, 0.5)';
const SMALL_SHADOW = '0 2px 0 rgba(30, 14, 4, 0.5), 0 4px 16px rgba(0, 0, 0, 0.6)';

type Treatment = {
	title: React.CSSProperties;
	episodeName: React.CSSProperties;
	label: React.CSSProperties;
	/**
	 * Space above the episode badge. Per face, because the subscript ya in
	 * ಹೇಳ್ಯೋ hangs well below the line box and hangs by a different amount in
	 * each — a shared value let it touch the badge in B.
	 */
	titleGap: number;
};

const TREATMENTS: Treatment[] = [
	// A — rounded heavy, TV serial.
	{
		// 200 ran ಸುಳ್ಳ ಹೇಳ್ಯೋ ~50px past both frame edges; sized to the 940 measure.
		title: {fontFamily: 'KnBalooTamma', fontWeight: 800, fontSize: 160, lineHeight: 1.15},
		titleGap: 60,
		episodeName: {fontFamily: 'KnBalooTamma', fontWeight: 600, fontSize: 86},
		label: {fontFamily: 'KnBalooTamma', fontWeight: 700, fontSize: 36, letterSpacing: 9},
	},
	// B — literary serif, cinema.
	{
		title: {fontFamily: 'KnTiro', fontWeight: 400, fontSize: 172, lineHeight: 1.2},
		titleGap: 96,
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
		titleGap: 76,
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

const Rule: React.FC<{width: number}> = ({width}) => (
	<div style={{width, height: 4, borderRadius: 2, backgroundColor: TURMERIC, boxShadow: SMALL_SHADOW}} />
);

export const KhareHelyoTitle: React.FC = () => {
	const frame = useCurrentFrame();
	const t = TREATMENTS[Math.min(TREATMENTS.length - 1, Math.floor(frame / 30))];

	return (
		<AbsoluteFill>
			<div
				style={{
					position: 'absolute',
					left: 0,
					right: 0,
					top: 0,
					height: SAFE_BOTTOM_Y,
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
					justifyContent: 'center',
					padding: '0 70px',
					color: CREAM,
					textAlign: 'center',
				}}
			>
				<div style={{display: 'flex', alignItems: 'center', gap: 22, marginBottom: 34}}>
					<Rule width={70} />
					<div style={{...t.label, color: CREAM, textShadow: SMALL_SHADOW, whiteSpace: 'nowrap'}}>
						{TAG}
					</div>
					<Rule width={70} />
				</div>

				{TITLE_LINES.map(([accent, rest]) => (
					<div key={accent} style={{...t.title, textShadow: SHADOW, whiteSpace: 'nowrap'}}>
						<span style={{color: TURMERIC}}>{accent}</span>
						{rest}
					</div>
				))}

				<div style={{marginTop: t.titleGap, marginBottom: 18}}>
					<div
						style={{
							...t.label,
							color: CREAM,
							padding: '8px 26px 6px',
							border: `3px solid ${TURMERIC}`,
							borderRadius: 999,
							textShadow: SMALL_SHADOW,
							boxShadow: SMALL_SHADOW,
							whiteSpace: 'nowrap',
						}}
					>
						{EPISODE_LABEL}
					</div>
				</div>
				<div style={{...t.episodeName, color: TURMERIC, textShadow: SHADOW, whiteSpace: 'nowrap'}}>
					{EPISODE_NAME}
				</div>
			</div>
		</AbsoluteFill>
	);
};

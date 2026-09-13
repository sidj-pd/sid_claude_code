import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import '../../components/kannadaFonts';
import {SHADOW} from './KhareHelyoTitle';

/**
 * Higher-contrast treatments for the per-episode badge and name.
 *
 * Why: Ep02's shot puts the lower third over a pale blue berth sheet, and the
 * original badge (cream on nothing) and name (turmeric on nothing) are light
 * on light — the shadow cannot rescue that. The title and tagline survived
 * because they sit on dark areas or carry their own ribbon. So every option
 * here brings its own contrast: a dark outline, or a plate behind the type.
 *
 * Frame 2n is option n's badge, frame 2n+1 its name — separate elements, as
 * the user places each by hand.
 */

const LABEL = 'EPISODE 02';
const NAME = 'ಥಟ್ ಅಂತ ಹೇಳಿ';

const CREAM = '#FFF3D6';
const TURMERIC = '#F4B63F';
const VERMILION = '#C93A26';
const INK = '#2A160C';
const DARK_PLATE = 'rgba(34, 17, 8, 0.86)';
const SMALL_SHADOW = '0 2px 0 rgba(30, 14, 4, 0.5), 0 4px 16px rgba(0, 0, 0, 0.6)';
const PLATE_SHADOW = '0 8px 24px rgba(0, 0, 0, 0.5)';

const labelFont: React.CSSProperties = {
	fontFamily: 'KnAnek',
	fontWeight: 600,
	fontStretch: '125%',
	fontSize: 34,
	letterSpacing: 8,
	whiteSpace: 'nowrap',
};
const nameFont: React.CSSProperties = {
	fontFamily: 'KnAnek',
	fontWeight: 600,
	fontStretch: '100%',
	fontSize: 88,
	lineHeight: 1.25,
	whiteSpace: 'nowrap',
};
const pill: React.CSSProperties = {padding: '8px 26px 6px', borderRadius: 999};

const darkBadge: React.CSSProperties = {
	...labelFont,
	...pill,
	color: CREAM,
	border: `3px solid ${TURMERIC}`,
	backgroundColor: DARK_PLATE,
	textShadow: SMALL_SHADOW,
	boxShadow: PLATE_SHADOW,
};

export const EPISODE_OPTIONS: {name: string; badge: React.CSSProperties; episodeName: React.CSSProperties}[] = [
	{
		name: 'Outline',
		badge: darkBadge,
		episodeName: {
			...nameFont,
			color: TURMERIC,
			// paint-order puts the stroke under the fill, so only its outer half
			// shows and the variable font's overlapping contours stay hidden.
			WebkitTextStroke: `10px ${INK}`,
			paintOrder: 'stroke fill',
			textShadow: SHADOW,
		},
	},
	{
		name: 'Ribbon',
		badge: {...labelFont, ...pill, color: INK, backgroundColor: TURMERIC, border: `3px solid ${TURMERIC}`, boxShadow: PLATE_SHADOW},
		episodeName: {
			...nameFont,
			color: CREAM,
			backgroundColor: VERMILION,
			padding: '0 36px 8px',
			borderRadius: 16,
			boxShadow: PLATE_SHADOW,
			textShadow: '0 2px 0 rgba(60, 10, 0, 0.35)',
		},
	},
	{
		name: 'Dark plate',
		badge: darkBadge,
		episodeName: {
			...nameFont,
			color: TURMERIC,
			backgroundColor: DARK_PLATE,
			padding: '0 36px 8px',
			borderRadius: 16,
			boxShadow: PLATE_SHADOW,
			textShadow: SMALL_SHADOW,
		},
	},
];

export const KhareHelyoEpisodeOptions: React.FC = () => {
	const frame = useCurrentFrame();
	const option = EPISODE_OPTIONS[Math.min(Math.floor(frame / 2), EPISODE_OPTIONS.length - 1)];
	const isBadge = frame % 2 === 0;

	return (
		<AbsoluteFill style={{justifyContent: 'center', alignItems: 'center'}}>
			<div style={isBadge ? option.badge : option.episodeName}>{isBadge ? LABEL : NAME}</div>
		</AbsoluteFill>
	);
};

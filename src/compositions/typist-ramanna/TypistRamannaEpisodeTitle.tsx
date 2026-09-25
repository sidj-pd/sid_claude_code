import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import '../../components/typistFonts';

/**
 * Typist Ramanna episode title: a cream paper label typed in a worn
 * typewriter face, stuck on at a slight tilt like the label on a tape box.
 * One frame per episode, transparent around the strip.
 *
 * The user's spec (2026-09-25): Special Elite, dark ink #1E1E1E on a cream
 * strip #FDF0D5 matching the series title, slightly tilted; the episode
 * number in the stamp red #D62828 so it ties to the "NEVER AIRED" stamp;
 * titles shortened for the cover, with the full title kept for the caption.
 */

const INK = '#1E1E1E';
const PAPER = '#FDF0D5';
const STAMP_RED = '#D62828';

export const TR_EPISODE_TITLES = [{number: '02', title: 'THE POTHOLE COMPLAINT'}];

export const TypistRamannaEpisodeTitle: React.FC = () => {
	const frame = useCurrentFrame();
	const {number, title} = TR_EPISODE_TITLES[Math.min(frame, TR_EPISODE_TITLES.length - 1)];

	return (
		<AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}>
			<div
				style={{
					maxWidth: 1000,
					background: PAPER,
					padding: '26px 38px 22px',
					transform: 'rotate(-2.5deg)',
					// A label stuck on, not floating: a tight contact shadow and a
					// faint edge, no glow.
					boxShadow: '0 3px 0 rgba(0, 0, 0, 0.18), 0 10px 22px rgba(0, 0, 0, 0.35)',
					border: '1px solid rgba(120, 90, 50, 0.25)',
					fontFamily: 'TrSpecialElite, monospace',
					fontSize: 52,
					letterSpacing: 1,
					lineHeight: 1.15,
					whiteSpace: 'nowrap',
					color: INK,
				}}
			>
				<span style={{color: STAMP_RED}}>EP {number}</span> — {title}
			</div>
		</AbsoluteFill>
	);
};

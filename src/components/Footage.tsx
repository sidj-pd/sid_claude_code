import React from 'react';
import {AbsoluteFill, OffthreadVideo, getStaticFiles, staticFile} from 'remotion';

export type FootageProps = {
	/** File name under public/footage/, without the extension. */
	id: string;
	/** What the missing file should say it is, on the placeholder card. */
	description: string;
	/**
	 * These clips are generated with their dialogue, so the sound is the
	 * performance and not a bed under one — mute only the copy that is being
	 * held frozen behind a transition.
	 */
	muted?: boolean;
	/**
	 * Skips this many frames (at the composition's fps) off the front of the
	 * source before it starts playing — for reusing a few seconds out of the
	 * middle of a clip shot for another purpose, rather than always starting
	 * a Sequence at the source's own beginning.
	 */
	trimBeforeInFrames?: number;
	style?: React.CSSProperties;
};

/**
 * A piece of photoreal footage, or a clearly-marked hole where it will go.
 *
 * The photoreal material for Scene 2 is generated outside this repo, which
 * means a shot has to be buildable, previewable and reviewable before its
 * footage lands. This renders the video when the file is there and a labelled
 * slate when it is not — labelled loudly, because the one genuinely dangerous
 * placeholder is the one that could be mistaken for a design decision.
 */
export const Footage: React.FC<FootageProps> = ({
	id,
	description,
	muted = false,
	trimBeforeInFrames,
	style,
}) => {
	const path = `footage/${id}.mp4`;
	const present = getStaticFiles().some((file) => file.name === path);

	if (present) {
		return (
			<OffthreadVideo
				src={staticFile(path)}
				muted={muted}
				trimBefore={trimBeforeInFrames}
				style={{width: '100%', height: '100%', objectFit: 'cover', ...style}}
			/>
		);
	}

	return (
		<AbsoluteFill
			style={{
				background: '#14161a',
				alignItems: 'center',
				justifyContent: 'center',
				textAlign: 'center',
				padding: 60,
				...style,
			}}
		>
			<AbsoluteFill
				style={{
					backgroundImage:
						'repeating-linear-gradient(45deg, rgba(255,255,255,0.035) 0 2px, transparent 2px 22px)',
				}}
			/>
			<div style={{fontFamily: 'RansomSpecialElite, monospace', color: '#8d949e'}}>
				<div style={{fontSize: 44, letterSpacing: 3, color: '#c8ced6'}}>FOOTAGE PENDING</div>
				<div style={{fontSize: 28, marginTop: 22, lineHeight: 1.5, whiteSpace: 'pre-line'}}>
					{description}
				</div>
				<div style={{fontSize: 24, marginTop: 30, opacity: 0.7}}>public/{path}</div>
			</div>
		</AbsoluteFill>
	);
};

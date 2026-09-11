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
	/**
	 * A number, or a function of the frame WITHIN the clip. The function form
	 * is for a deliberate audio dropout — the script asks for one on a line in
	 * Episode 02 Beat 4, and production notes §13 lists the mechanism as
	 * written but never shot because Episode 01 had no line to land it on.
	 */
	volume?: number | ((frame: number) => number);
	/**
	 * Scales the clip up from its TOP edge, pushing the bottom of the source
	 * out of frame.
	 *
	 * Every Episode 04 clip came back with the generator's sparkle mark burnt
	 * into the bottom-right corner, and the sign-off came back with a burnt-in
	 * subtitle across the bottom as well -- both despite the prompt banning
	 * writing and marks. Neither can be removed from the pixels, so the frame
	 * moves instead: at 1.14 the mark at roughly 91% of the height lands past
	 * 100% and is simply not in the shot.
	 *
	 * Anchored to the TOP rather than the centre on purpose. These are all
	 * chest-up framings with headroom to spare and nothing of interest at the
	 * bottom, so growing downwards costs a strip of desk and keeps every face
	 * where it was. Centre-anchoring would crop foreheads.
	 *
	 * A corner darkener was tried first, the way Episode 03 hides the same
	 * mark. It works on a mark and not on a caption, and this needed one fix
	 * for both.
	 */
	cropBottom?: number;
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
	volume = 1,
	cropBottom,
	style,
}) => {
	const path = `footage/${id}.mp4`;
	const present = getStaticFiles().some((file) => file.name === path);

	if (present) {
		return (
			<OffthreadVideo
				src={staticFile(path)}
				muted={muted}
				volume={volume}
				trimBefore={trimBeforeInFrames}
				style={{
					width: '100%',
					height: '100%',
					objectFit: 'cover',
					...(cropBottom
						? {transform: `scale(${cropBottom})`, transformOrigin: '50% 0%'}
						: null),
					...style,
				}}
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

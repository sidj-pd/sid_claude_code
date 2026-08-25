import React from 'react';
import {Audio, Sequence, getStaticFiles, staticFile} from 'remotion';

export type VoiceOverProps = {
	/** Line id, matching an entry in scripts/vo-lines.json. */
	id: string;
	from: number;
	/**
	 * A number, or a function of the frame WITHIN the line — which is what
	 * Remotion passes it — for lines that have to duck or drop out partway.
	 */
	volume?: number | ((frame: number) => number);
};

/**
 * One narration line, placed at a frame.
 *
 * It renders nothing at all if the WAV has not been generated yet, so a shot
 * can be built, previewed and reviewed before its voice-over exists — the
 * takes need an API key that is not always to hand, and a missing line should
 * cost a silent render, not a failed one. Generate them with:
 *
 *     GEMINI_API_KEY=... python3 scripts/tts.py
 */
export const VoiceOver: React.FC<VoiceOverProps> = ({id, from, volume = 1}) => {
	const path = `vo/${id}.wav`;
	const present = getStaticFiles().some((file) => file.name === path);
	if (!present) return null;

	return (
		<Sequence from={from}>
			<Audio src={staticFile(path)} volume={volume} />
		</Sequence>
	);
};

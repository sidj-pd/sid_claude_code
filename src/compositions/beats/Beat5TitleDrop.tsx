import React from 'react';
import {AbsoluteFill} from 'remotion';
import {NewsprintTexture} from '../../components/NewsprintTexture';
import {RansomHeadlineText} from '../../components/RansomHeadlineText';
import {StampImpact} from '../../components/StampImpact';

const LETTER_STAGGER = 2;
const STAMP_TRIGGER_FRAME = 30; // frame 330 in the full timeline (beat starts at 300)

/**
 * Beat 5 — Title Drop: hard cut to newsprint black, headline slams in
 * letter by letter, a stamp punch lands on it, then dead silence/stillness
 * holds through the rest of the beat (frames 31-60 local) before Scene 1.
 */
export const Beat5TitleDrop: React.FC = () => {
	return (
		<AbsoluteFill style={{backgroundColor: '#0b0906'}}>
			<NewsprintTexture opacity={0.15} />
			<StampImpact triggerFrame={STAMP_TRIGGER_FRAME} punchDurationInFrames={4} sfxSrc={undefined}>
				<RansomHeadlineText text="BIZZARO BANGALORE" letterStagger={LETTER_STAGGER} fontSize={72} />
			</StampImpact>
		</AbsoluteFill>
	);
};

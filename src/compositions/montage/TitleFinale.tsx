import React from 'react';
import {AbsoluteFill} from 'remotion';
import {RansomHeadlineText} from '../../components/RansomHeadlineText';
import {StampImpact} from '../../components/StampImpact';

const LETTER_STAGGER = 1;
const STAMP_TRIGGER_FRAME = 26;

/**
 * Headline + stamp only — the six locations/vehicles now handle their own
 * grow-into-poster and flip-down-away finale as part of their persistent
 * lifecycle, scattered around this title at a high z-index so it stays
 * legible above the collage.
 */
export const TitleFinale: React.FC = () => {
	return (
		<AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', zIndex: 200}}>
			<StampImpact triggerFrame={STAMP_TRIGGER_FRAME} punchDurationInFrames={4} sfxSrc={undefined}>
				<RansomHeadlineText text="BIZZARO BANGALORE" letterStagger={LETTER_STAGGER} fontSize={72} />
			</StampImpact>
		</AbsoluteFill>
	);
};

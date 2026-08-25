import React from 'react';
import {AbsoluteFill, staticFile, useCurrentFrame} from 'remotion';
import {RansomHeadlineText} from '../../components/RansomHeadlineText';
import {StampImpact} from '../../components/StampImpact';
import {B11_TITLE} from './beats';

const STAMP_AT = 14;

/**
 * The punchline. Lands on top of the frozen jam rather than on a cleared
 * stage — the mess stays visible behind it, which is the point.
 *
 * Stacked on two lines rather than one: a single long line forced the camera
 * to keep pulling back at the end just to fit the type, which threw away the
 * crowding the whole montage had spent 300 frames building. Two lines fit in
 * a much narrower column, so the camera can stay in tight.
 */
export const TitleFinale: React.FC = () => {
	const frame = useCurrentFrame();
	if (frame < B11_TITLE) {
		return null;
	}

	return (
		<AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', zIndex: 200}}>
			<StampImpact
				triggerFrame={B11_TITLE + STAMP_AT}
				punchDurationInFrames={4}
				sfxSrc={staticFile('sfx/stamp-thud.wav')}
				sfxVolume={0.95}
			>
				<RansomHeadlineText text={"BIZZARO\nBANGALORE"} letterStagger={1} fontSize={132} />
			</StampImpact>
		</AbsoluteFill>
	);
};

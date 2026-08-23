import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {RansomHeadlineText} from '../../components/RansomHeadlineText';
import {StampImpact} from '../../components/StampImpact';
import {B11_TITLE} from './beats';

const STAMP_AT = 14;

/**
 * The punchline. Lands on top of the frozen jam rather than on a cleared
 * stage — the mess stays visible behind it, which is the point.
 */
export const TitleFinale: React.FC = () => {
	const frame = useCurrentFrame();
	if (frame < B11_TITLE) {
		return null;
	}

	return (
		<AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', zIndex: 200}}>
			<StampImpact triggerFrame={B11_TITLE + STAMP_AT} punchDurationInFrames={4}>
				<RansomHeadlineText text="BIZZARO BANGALORE" letterStagger={1} fontSize={74} />
			</StampImpact>
		</AbsoluteFill>
	);
};

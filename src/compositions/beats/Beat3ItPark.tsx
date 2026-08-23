import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {PageFlipTransition} from '../../components/PageFlipTransition';
import {PaperCutout} from '../../components/PaperCutout';
import {GlassShimmer} from '../../components/GlassShimmer';
import {usePopIn} from '../../components/usePopIn';

const DURATION = 60;
const FLIP_DURATION = 6;
const SHIMMER_START = 16;

/**
 * Beat 3 — IT Park, frames 120-180. Pops up with a springy overshoot, then
 * gets a light-on-glass shimmer sweep for its "moment" before flipping out.
 */
export const Beat3ItPark: React.FC = () => {
	const frame = useCurrentFrame();
	const pop = usePopIn(frame, {damping: 10, stiffness: 170});

	return (
		<PageFlipTransition totalDurationInFrames={DURATION} durationInFrames={FLIP_DURATION}>
			<AbsoluteFill style={{backgroundColor: '#f6f1e6', justifyContent: 'center', alignItems: 'center'}}>
				<div style={{width: 820, height: 615, transform: `scale(${pop})`, position: 'relative'}}>
					<PaperCutout asset="it-park-building" textureOpacity={0} />
					<GlassShimmer frame={frame} startFrame={SHIMMER_START} />
				</div>
			</AbsoluteFill>
		</PageFlipTransition>
	);
};

import React from 'react';
import {AbsoluteFill} from 'remotion';
import {PageFlipTransition} from '../../components/PageFlipTransition';
import {PaperCutout} from '../../components/PaperCutout';

const DURATION = 60;
const FLIP_DURATION = 6;

/** Beat 3 — IT Park: static hold with classified-ad window gag, frames 120-180. */
export const Beat3ItPark: React.FC = () => {
	return (
		<PageFlipTransition totalDurationInFrames={DURATION} durationInFrames={FLIP_DURATION}>
			<AbsoluteFill style={{backgroundColor: '#f6f1e6', justifyContent: 'center', alignItems: 'center'}}>
				<div style={{width: 820, height: 615}}>
					<PaperCutout asset="it-park-building" textureOpacity={0} />
				</div>
			</AbsoluteFill>
		</PageFlipTransition>
	);
};

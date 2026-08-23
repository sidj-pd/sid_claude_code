import React from 'react';
import {AbsoluteFill} from 'remotion';
import {PageFlipTransition} from '../../components/PageFlipTransition';
import {PaperCutout} from '../../components/PaperCutout';
import {NewsprintTexture} from '../../components/NewsprintTexture';

const DURATION = 60;
const FLIP_DURATION = 6;

/** Beat 1 — Vidhana Soudha: static hold, frames 0-60. */
export const Beat1VidhanaSoudha: React.FC = () => {
	return (
		<PageFlipTransition totalDurationInFrames={DURATION} durationInFrames={FLIP_DURATION}>
			<AbsoluteFill style={{backgroundColor: '#f6f1e6', justifyContent: 'center', alignItems: 'center'}}>
				<div style={{width: 920, height: 690}}>
					<PaperCutout asset="vidhana-soudha" textureOpacity={0} />
				</div>
				<NewsprintTexture opacity={0.08} />
			</AbsoluteFill>
		</PageFlipTransition>
	);
};

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
			<AbsoluteFill style={{backgroundColor: '#efe4c8', justifyContent: 'center', alignItems: 'center'}}>
				<div style={{width: 700, height: 580}}>
					<PaperCutout asset="vidhana-soudha" textureOpacity={0.25} />
				</div>
				<NewsprintTexture opacity={0.4} grayscale />
			</AbsoluteFill>
		</PageFlipTransition>
	);
};

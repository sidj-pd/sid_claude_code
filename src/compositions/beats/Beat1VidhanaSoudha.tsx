import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {PageFlipTransition} from '../../components/PageFlipTransition';
import {PaperCutout} from '../../components/PaperCutout';
import {NewsprintTexture} from '../../components/NewsprintTexture';

const DURATION = 60;
const FLIP_DURATION = 6;
const ENTRY_FLIP_DURATION = 16;

/**
 * Beat 1 — Vidhana Soudha, frames 0-60. Flips in (page-turn reveal) rather
 * than just appearing, then holds with a slow majestic push-in before
 * flipping out into Beat 2.
 */
export const Beat1VidhanaSoudha: React.FC = () => {
	const frame = useCurrentFrame();

	// gentle continuous push-in for the whole hold, so the "establishing
	// shot" still feels alive rather than a dead static frame
	const scale = interpolate(frame, [0, DURATION], [1, 1.05], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});

	return (
		<PageFlipTransition
			totalDurationInFrames={DURATION}
			durationInFrames={FLIP_DURATION}
			entryDurationInFrames={ENTRY_FLIP_DURATION}
		>
			<AbsoluteFill style={{backgroundColor: '#f6f1e6', justifyContent: 'center', alignItems: 'center'}}>
				<div style={{width: 920, height: 690, transform: `scale(${scale})`}}>
					<PaperCutout asset="vidhana-soudha" textureOpacity={0} />
				</div>
				<NewsprintTexture opacity={0.08} />
			</AbsoluteFill>
		</PageFlipTransition>
	);
};

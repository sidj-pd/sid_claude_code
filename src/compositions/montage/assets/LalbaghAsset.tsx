import React from 'react';
import {useCurrentFrame} from 'remotion';
import {PaperCutout} from '../../../components/PaperCutout';
import {GlassShimmer} from '../../../components/GlassShimmer';
import {usePopIn} from '../../../components/usePopIn';
import {Transform, elevationFromScale, transformToCss, useLifecycleTransform} from '../lifecycle';
import {LALBAGH_ENTRANCE_START, LALBAGH_HERO_END, lifecycleFor} from '../timeline';

const RECEDE_DURATION = 12;
const HERO_HOLD_END = LALBAGH_HERO_END - RECEDE_DURATION; // 213
const CONFIG = lifecycleFor('lalbagh-glass-house', HERO_HOLD_END, RECEDE_DURATION, 3);
const BOX = {width: 820, height: 615};
const STAGE_Y = 150;
const SHIMMER_DELAY = 12;

/**
 * Lalbagh Glass House — pops up while IT park is still settling into the
 * skyline, gets its own glass shimmer moment, then recedes for Metro.
 */
export const LalbaghAsset: React.FC = () => {
	const frame = useCurrentFrame();
	const localFrame = frame - LALBAGH_ENTRANCE_START;
	const pop = usePopIn(frame, {delay: LALBAGH_ENTRANCE_START, damping: 9, stiffness: 150});

	const heroTransform: Transform = {x: 0, y: STAGE_Y, scale: pop, rotate: 0, opacity: 1};
	const transform = useLifecycleTransform(frame, heroTransform, CONFIG);
	const isActive = frame < HERO_HOLD_END + RECEDE_DURATION;

	if (frame < LALBAGH_ENTRANCE_START) {
		return null;
	}

	return (
		<div style={{...transformToCss(transform), zIndex: isActive ? 53 : frame < 322 ? 13 : 23}}>
			<div style={{...BOX, position: 'relative'}}>
				<PaperCutout
					asset="lalbagh-glass-house"
					textureOpacity={0}
					elevation={elevationFromScale(transform.scale)}
				/>
				{localFrame >= 0 && localFrame < HERO_HOLD_END - LALBAGH_ENTRANCE_START ? (
					<GlassShimmer frame={localFrame} startFrame={SHIMMER_DELAY} durationInFrames={16} />
				) : null}
			</div>
		</div>
	);
};

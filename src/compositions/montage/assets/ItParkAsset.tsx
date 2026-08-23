import React from 'react';
import {useCurrentFrame} from 'remotion';
import {PaperCutout} from '../../../components/PaperCutout';
import {GlassShimmer} from '../../../components/GlassShimmer';
import {usePopIn} from '../../../components/usePopIn';
import {Transform, elevationFromScale, transformToCss, useLifecycleTransform} from '../lifecycle';
import {IT_PARK_ENTRANCE_START, IT_PARK_HERO_END, lifecycleFor} from '../timeline';

const RECEDE_DURATION = 14;
const HERO_HOLD_END = IT_PARK_HERO_END - RECEDE_DURATION; // 166
const CONFIG = lifecycleFor('it-park-building', HERO_HOLD_END, RECEDE_DURATION, 2);
const BOX = {width: 820, height: 615};
const STAGE_Y = 150;
const SHIMMER_DELAY = 16;

/**
 * IT park — pops up with a springy overshoot while the auto is still
 * settling into the skyline, gets a light-on-glass shimmer for its moment,
 * then recedes to make room for Lalbagh.
 */
export const ItParkAsset: React.FC = () => {
	const frame = useCurrentFrame();
	const localFrame = frame - IT_PARK_ENTRANCE_START;
	const pop = usePopIn(frame, {delay: IT_PARK_ENTRANCE_START, damping: 10, stiffness: 170});

	const heroTransform: Transform = {x: 0, y: STAGE_Y, scale: pop, rotate: 0, opacity: 1};
	const transform = useLifecycleTransform(frame, heroTransform, CONFIG);
	const isActive = frame < HERO_HOLD_END + RECEDE_DURATION;

	if (frame < IT_PARK_ENTRANCE_START) {
		return null;
	}

	return (
		<div style={{...transformToCss(transform), zIndex: isActive ? 52 : frame < 322 ? 12 : 22}}>
			<div style={{...BOX, position: 'relative'}}>
				<PaperCutout asset="it-park-building" textureOpacity={0} elevation={elevationFromScale(transform.scale)} />
				{localFrame >= 0 && localFrame < HERO_HOLD_END - IT_PARK_ENTRANCE_START ? (
					<GlassShimmer frame={localFrame} startFrame={SHIMMER_DELAY} />
				) : null}
			</div>
		</div>
	);
};

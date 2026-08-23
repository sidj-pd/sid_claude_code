import React from 'react';
import {useCurrentFrame} from 'remotion';
import {PaperCutout} from '../../../components/PaperCutout';
import {usePopIn} from '../../../components/usePopIn';
import {Transform, elevationFromScale, transformToCss, useLifecycleTransform} from '../lifecycle';
import {MG_ROAD_ENTRANCE_START, MG_ROAD_HERO_END, lifecycleFor} from '../timeline';

const RECEDE_DURATION = 14;
const HERO_HOLD_END = MG_ROAD_HERO_END - RECEDE_DURATION; // 286
const DROP_IN_DURATION = 14;
const CONFIG = lifecycleFor('mg-road-signage', HERO_HOLD_END, RECEDE_DURATION, 5);
const BOX = {width: 700, height: 525};
const STAGE_Y = 150;

/**
 * MG Road — its sign drops in from above with a bounce while Metro is
 * still whooshing off into the skyline, settles into a gentle sway, then
 * recedes — the last hero before the title lands.
 */
export const MgRoadAsset: React.FC = () => {
	const frame = useCurrentFrame();
	const localFrame = frame - MG_ROAD_ENTRANCE_START;
	const pop = usePopIn(frame, {delay: MG_ROAD_ENTRANCE_START, damping: 7, stiffness: 130});

	const dropY = STAGE_Y - (1 - pop) * 500;
	const swayT = Math.max(0, localFrame - DROP_IN_DURATION);
	const sway = localFrame > DROP_IN_DURATION ? Math.sin(swayT / 7) * 2.5 * Math.exp(-swayT / 45) : 0;

	const heroTransform: Transform = {x: 0, y: dropY, scale: pop, rotate: sway, opacity: 1};
	const transform = useLifecycleTransform(frame, heroTransform, CONFIG);
	const isActive = frame < HERO_HOLD_END + RECEDE_DURATION;

	if (frame < MG_ROAD_ENTRANCE_START) {
		return null;
	}

	return (
		<div style={{...transformToCss(transform), transformOrigin: 'center top', zIndex: isActive ? 55 : frame < 322 ? 15 : 25}}>
			<div style={BOX}>
				<PaperCutout asset="mg-road-signage" textureOpacity={0} elevation={elevationFromScale(transform.scale)} />
			</div>
		</div>
	);
};

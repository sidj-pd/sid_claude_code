import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {PaperCutout} from '../../../components/PaperCutout';
import {Transform, elevationFromScale, transformToCss, useLifecycleTransform} from '../lifecycle';
import {METRO_ENTRANCE_START, METRO_HERO_END, lifecycleFor} from '../timeline';

const RECEDE_DURATION = 10;
const HERO_HOLD_END = METRO_HERO_END - RECEDE_DURATION; // 245
const WHOOSH_DURATION = HERO_HOLD_END - METRO_ENTRANCE_START; // 20
const CONFIG = lifecycleFor('namma-metro', HERO_HOLD_END, RECEDE_DURATION, 4);
const BOX = {width: 820, height: 615};
const STAGE_Y = 150;
const WHOOSH_START_X = -750;
const WHOOSH_END_X = 220;

/**
 * Namma Metro — rushes across the stage left to right while Lalbagh is
 * still settling into the skyline, trailing speed lines, then hops up into
 * its own slot instead of holding still.
 */
export const MetroAsset: React.FC = () => {
	const frame = useCurrentFrame();
	const localFrame = frame - METRO_ENTRANCE_START;

	const x = interpolate(localFrame, [0, WHOOSH_DURATION], [WHOOSH_START_X, WHOOSH_END_X], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});
	const heroTransform: Transform = {x, y: STAGE_Y, scale: 1, rotate: 0, opacity: 1};
	const transform = useLifecycleTransform(frame, heroTransform, CONFIG);
	const isActive = frame < HERO_HOLD_END + RECEDE_DURATION;

	const speedLineOpacity = interpolate(localFrame, [0, 4, WHOOSH_DURATION - 4, WHOOSH_DURATION], [0, 1, 1, 0], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});

	if (frame < METRO_ENTRANCE_START) {
		return null;
	}

	return (
		<>
			{localFrame >= 0 && localFrame < WHOOSH_DURATION
				? [0, 1, 2].map((i) => (
						<div
							key={i}
							style={{
								position: 'absolute',
								left: 0,
								right: 0,
								top: `${44 + i * 6}%`,
								height: 3,
								backgroundColor: '#c9a877',
								opacity: speedLineOpacity * (0.5 - i * 0.15),
								zIndex: 40,
							}}
						/>
					))
				: null}
			<div style={{...transformToCss(transform), zIndex: isActive ? 54 : frame < 322 ? 14 : 24}}>
				<div style={BOX}>
					<PaperCutout asset="namma-metro" textureOpacity={0} elevation={elevationFromScale(transform.scale)} />
				</div>
			</div>
		</>
	);
};

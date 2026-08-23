import React from 'react';
import {Easing, interpolate, useCurrentFrame} from 'remotion';
import {PaperCutout} from '../../../components/PaperCutout';
import {Transform, elevationFromScale, transformToCss, useLifecycleTransform} from '../lifecycle';
import {VIDHANA_HERO_END, lifecycleFor} from '../timeline';

const ENTRANCE_DURATION = 16;
const RECEDE_DURATION = 14;
const HERO_HOLD_END = VIDHANA_HERO_END - RECEDE_DURATION; // 46
const CONFIG = lifecycleFor('vidhana-soudha', HERO_HOLD_END, RECEDE_DURATION, 0);
const BOX = {width: 820, height: 615};

/**
 * Vidhana Soudha — the opening hero. Flips in (3D page-turn reveal) rather
 * than appearing, pushes in slowly during its hold, then settles into the
 * background skyline where it stays visible for the rest of the montage.
 */
export const VidhanaSoudhaAsset: React.FC = () => {
	const frame = useCurrentFrame();

	const entranceProgress = interpolate(frame, [0, ENTRANCE_DURATION], [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
		easing: Easing.out(Easing.cubic),
	});
	const pushIn = interpolate(frame, [ENTRANCE_DURATION, HERO_HOLD_END], [1, 1.05], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});
	const heroTransform: Transform = {
		x: 0,
		y: 140,
		scale: frame < ENTRANCE_DURATION ? interpolate(entranceProgress, [0, 1], [0.85, 1]) : pushIn,
		rotate: 0,
		opacity: interpolate(frame, [0, 8], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}),
	};

	const transform = useLifecycleTransform(frame, heroTransform, CONFIG);
	const rotateY = frame < ENTRANCE_DURATION ? interpolate(entranceProgress, [0, 1], [100, 0]) : 0;
	const isActive = frame < HERO_HOLD_END + RECEDE_DURATION;

	return (
		<div
			style={{
				...transformToCss(transform),
				perspective: 1400,
				zIndex: isActive ? 50 : frame < 322 ? 10 : 20,
			}}
		>
			<div style={{...BOX, transform: `rotateY(${rotateY}deg)`, transformStyle: 'preserve-3d'}}>
				<PaperCutout
					asset="vidhana-soudha"
					textureOpacity={0}
					elevation={elevationFromScale(transform.scale)}
				/>
			</div>
		</div>
	);
};

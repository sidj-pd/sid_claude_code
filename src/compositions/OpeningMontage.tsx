import React from 'react';
import {AbsoluteFill, Sequence, interpolateColors, useCurrentFrame} from 'remotion';
import {NewsprintTexture} from '../components/NewsprintTexture';
import {AutoAsset} from './montage/assets/AutoAsset';
import {ItParkAsset} from './montage/assets/ItParkAsset';
import {LalbaghAsset} from './montage/assets/LalbaghAsset';
import {MetroAsset} from './montage/assets/MetroAsset';
import {MgRoadAsset} from './montage/assets/MgRoadAsset';
import {VidhanaSoudhaAsset} from './montage/assets/VidhanaSoudhaAsset';
import {TitleFinale} from './montage/TitleFinale';
import {TITLE_START} from './montage/timeline';

export const OPENING_MONTAGE_DURATION_IN_FRAMES = 360;
export const OPENING_MONTAGE_FPS = 30;
export const OPENING_MONTAGE_WIDTH = 1080;
export const OPENING_MONTAGE_HEIGHT = 1920;

const BG_DUSK_START = 285;
const BG_DUSK_END = 315;

/**
 * BIZZARO BANGALORE — opening montage, frames 0-360 (0:00-0:12).
 *
 * Unlike a slideshow of discrete cards, every location/vehicle is a single
 * persistent component mounted for the whole timeline: each has its own
 * "hero" moment in the foreground, then recedes into a background skyline
 * where it stays visible (smaller, softer-shadowed) while the next asset
 * takes the stage — so the previous beat is still on screen, receding,
 * while the next one is already animating in. At the title, every asset
 * grows back into a large overlapping poster collage around the headline,
 * then flips downward away before the hard cut into Scene 1.
 */
export const OpeningMontage: React.FC = () => {
	const frame = useCurrentFrame();
	const backgroundColor = interpolateColors(frame, [BG_DUSK_START, BG_DUSK_END], ['#f6f1e6', '#0b0906']);

	return (
		<AbsoluteFill style={{backgroundColor}}>
			<NewsprintTexture opacity={0.08} />
			<VidhanaSoudhaAsset />
			<AutoAsset />
			<ItParkAsset />
			<LalbaghAsset />
			<MetroAsset />
			<MgRoadAsset />
			<Sequence from={TITLE_START} durationInFrames={OPENING_MONTAGE_DURATION_IN_FRAMES - TITLE_START}>
				<TitleFinale />
			</Sequence>
		</AbsoluteFill>
	);
};

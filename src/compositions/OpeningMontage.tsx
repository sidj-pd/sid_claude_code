import React from 'react';
import {AbsoluteFill, Sequence} from 'remotion';
import {Beat1VidhanaSoudha} from './beats/Beat1VidhanaSoudha';
import {Beat2TheAuto} from './beats/Beat2TheAuto';
import {Beat3ItPark} from './beats/Beat3ItPark';
import {Beat4IconGrabBag} from './beats/Beat4IconGrabBag';
import {Beat5TitleDrop} from './beats/Beat5TitleDrop';

export const OPENING_MONTAGE_DURATION_IN_FRAMES = 360;
export const OPENING_MONTAGE_FPS = 30;
export const OPENING_MONTAGE_WIDTH = 1080;
export const OPENING_MONTAGE_HEIGHT = 1920;

/**
 * BIZZARO BANGALORE — opening montage, frames 0-360 (0:00-0:12), leading
 * into the Scene 1 cold open. See the beat breakdown for frame ranges.
 */
export const OpeningMontage: React.FC = () => {
	return (
		<AbsoluteFill style={{backgroundColor: '#0b0906'}}>
			<Sequence from={0} durationInFrames={60}>
				<Beat1VidhanaSoudha />
			</Sequence>
			<Sequence from={60} durationInFrames={60}>
				<Beat2TheAuto />
			</Sequence>
			<Sequence from={120} durationInFrames={60}>
				<Beat3ItPark />
			</Sequence>
			<Sequence from={180} durationInFrames={120}>
				<Beat4IconGrabBag />
			</Sequence>
			<Sequence from={300} durationInFrames={60}>
				<Beat5TitleDrop />
			</Sequence>
		</AbsoluteFill>
	);
};

import React from 'react';
import {Composition} from 'remotion';
import {Shot01AutoStop} from './compositions/episode01/shot01/Shot01AutoStop';
import {SHOT_01_DURATION} from './compositions/episode01/shot01/beats';
import {Shot02Destination} from './compositions/episode01/shot02/Shot02Destination';
import {SHOT_02_DURATION} from './compositions/episode01/shot02/beats';
import {
	OPENING_MONTAGE_DURATION_IN_FRAMES,
	OPENING_MONTAGE_FPS,
	OPENING_MONTAGE_HEIGHT,
	OPENING_MONTAGE_WIDTH,
	OpeningMontage,
} from './compositions/OpeningMontage';

export const Root: React.FC = () => {
	return (
		<>
			<Composition
				id="OpeningMontage"
				component={OpeningMontage}
				durationInFrames={OPENING_MONTAGE_DURATION_IN_FRAMES}
				fps={OPENING_MONTAGE_FPS}
				width={OPENING_MONTAGE_WIDTH}
				height={OPENING_MONTAGE_HEIGHT}
			/>
			<Composition
				id="Ep01Shot01AutoStop"
				component={Shot01AutoStop}
				durationInFrames={SHOT_01_DURATION}
				fps={OPENING_MONTAGE_FPS}
				width={OPENING_MONTAGE_WIDTH}
				height={OPENING_MONTAGE_HEIGHT}
			/>
			<Composition
				id="Ep01Shot02Destination"
				component={Shot02Destination}
				durationInFrames={SHOT_02_DURATION}
				fps={OPENING_MONTAGE_FPS}
				width={OPENING_MONTAGE_WIDTH}
				height={OPENING_MONTAGE_HEIGHT}
			/>
		</>
	);
};

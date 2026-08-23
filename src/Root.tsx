import React from 'react';
import {Composition} from 'remotion';
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
		</>
	);
};

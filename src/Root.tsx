import React from 'react';
import {Composition} from 'remotion';
import {Shot01AutoStop} from './compositions/episode01/shot01/Shot01AutoStop';
import {SHOT_01_DURATION} from './compositions/episode01/shot01/beats';
import {Shot02Destination} from './compositions/episode01/shot02/Shot02Destination';
import {SHOT_02_DURATION} from './compositions/episode01/shot02/beats';
import {Shot03InstantYes} from './compositions/episode01/shot03/Shot03InstantYes';
import {SHOT_03_DURATION} from './compositions/episode01/shot03/beats';
import {Shot04MeterDown} from './compositions/episode01/shot04/Shot04MeterDown';
import {SHOT_04_DURATION} from './compositions/episode01/shot04/beats';
import {Shot05Graphic} from './compositions/episode01/shot05/Shot05Graphic';
import {SHOT_05_DURATION} from './compositions/episode01/shot05/beats';
import {Shot06Testimony} from './compositions/episode01/shot06/Shot06Testimony';
import {SHOT_06_DURATION} from './compositions/episode01/shot06/beats';
import {Shot07Expert} from './compositions/episode01/shot07/Shot07Expert';
import {SHOT_07_DURATION} from './compositions/episode01/shot07/beats';
import {Shot08Fallout} from './compositions/episode01/shot08/Shot08Fallout';
import {SHOT_08_DURATION} from './compositions/episode01/shot08/beats';
import {Shot09Psa} from './compositions/episode01/shot09/Shot09Psa';
import {SHOT_09_DURATION} from './compositions/episode01/shot09/beats';
import {Shot10Committee} from './compositions/episode01/shot10/Shot10Committee';
import {SHOT_10_DURATION} from './compositions/episode01/shot10/beats';
import {Shot11FullCircle} from './compositions/episode01/shot11/Shot11FullCircle';
import {SHOT_11_DURATION} from './compositions/episode01/shot11/beats';
import {
	OPENING_MONTAGE_DURATION_IN_FRAMES,
	OPENING_MONTAGE_FPS,
	OPENING_MONTAGE_HEIGHT,
	OPENING_MONTAGE_WIDTH,
	OpeningMontage,
} from './compositions/OpeningMontage';
import {Shot01LeaveRequest} from './compositions/episode02/shot01/Shot01LeaveRequest';
import {SHOT_01_DURATION as EP02_SHOT_01_DURATION} from './compositions/episode02/shot01/beats';
import {Shot02InstantReply} from './compositions/episode02/shot02/Shot02InstantReply';
import {SHOT_02_DURATION as EP02_SHOT_02_DURATION} from './compositions/episode02/shot02/beats';
import {Shot03Graphic} from './compositions/episode02/shot03/Shot03Graphic';
import {SHOT_03_DURATION as EP02_SHOT_03_DURATION} from './compositions/episode02/shot03/beats';
import {Shot04Testimony} from './compositions/episode02/shot04/Shot04Testimony';
import {SHOT_04_DURATION as EP02_SHOT_04_DURATION} from './compositions/episode02/shot04/beats';
import {Shot05Expert} from './compositions/episode02/shot05/Shot05Expert';
import {SHOT_05_DURATION as EP02_SHOT_05_DURATION} from './compositions/episode02/shot05/beats';
import {Shot06Fallout} from './compositions/episode02/shot06/Shot06Fallout';
import {SHOT_06_DURATION as EP02_SHOT_06_DURATION} from './compositions/episode02/shot06/beats';
import {Shot08Committee} from './compositions/episode02/shot08/Shot08Committee';
import {SHOT_08_DURATION as EP02_SHOT_08_DURATION} from './compositions/episode02/shot08/beats';
import {Shot07Psa} from './compositions/episode02/shot07/Shot07Psa';
import {SHOT_07_DURATION as EP02_SHOT_07_DURATION} from './compositions/episode02/shot07/beats';
import {Shot09FullCircle} from './compositions/episode02/shot09/Shot09FullCircle';
import {SHOT_09_DURATION as EP02_SHOT_09_DURATION} from './compositions/episode02/shot09/beats';
import {Shot01EmptyFlat} from './compositions/episode03/shot01/Shot01EmptyFlat';
import {SHOT_01_DURATION as EP03_SHOT_01_DURATION} from './compositions/episode03/shot01/beats';
import {Shot02Graphic as Ep03Shot02Graphic} from './compositions/episode03/shot02/Shot02Graphic';
import {SHOT_02_DURATION as EP03_SHOT_02_DURATION} from './compositions/episode03/shot02/beats';
import {Shot04Testimony as Ep03Shot04Testimony} from './compositions/episode03/shot04/Shot04Testimony';
import {SHOT_04_DURATION as EP03_SHOT_04_DURATION} from './compositions/episode03/shot04/beats';
import {Shot05Expert as Ep03Shot05Expert} from './compositions/episode03/shot05/Shot05Expert';
import {SHOT_05_DURATION as EP03_SHOT_05_DURATION} from './compositions/episode03/shot05/beats';
import {Ep01CoverCard} from './compositions/covers/Ep01CoverCard';

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
				id="Ep01CoverCard"
				component={Ep01CoverCard}
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
			<Composition
				id="Ep01Shot03InstantYes"
				component={Shot03InstantYes}
				durationInFrames={SHOT_03_DURATION}
				fps={OPENING_MONTAGE_FPS}
				width={OPENING_MONTAGE_WIDTH}
				height={OPENING_MONTAGE_HEIGHT}
			/>
			<Composition
				id="Ep01Shot04MeterDown"
				component={Shot04MeterDown}
				durationInFrames={SHOT_04_DURATION}
				fps={OPENING_MONTAGE_FPS}
				width={OPENING_MONTAGE_WIDTH}
				height={OPENING_MONTAGE_HEIGHT}
			/>
			<Composition
				id="Ep01Shot05Graphic"
				component={Shot05Graphic}
				durationInFrames={SHOT_05_DURATION}
				fps={OPENING_MONTAGE_FPS}
				width={OPENING_MONTAGE_WIDTH}
				height={OPENING_MONTAGE_HEIGHT}
			/>
			<Composition
				id="Ep01Shot06Testimony"
				component={Shot06Testimony}
				durationInFrames={SHOT_06_DURATION}
				fps={OPENING_MONTAGE_FPS}
				width={OPENING_MONTAGE_WIDTH}
				height={OPENING_MONTAGE_HEIGHT}
			/>
			<Composition
				id="Ep01Shot07Expert"
				component={Shot07Expert}
				durationInFrames={SHOT_07_DURATION}
				fps={OPENING_MONTAGE_FPS}
				width={OPENING_MONTAGE_WIDTH}
				height={OPENING_MONTAGE_HEIGHT}
			/>
			<Composition
				id="Ep01Shot08Fallout"
				component={Shot08Fallout}
				durationInFrames={SHOT_08_DURATION}
				fps={OPENING_MONTAGE_FPS}
				width={OPENING_MONTAGE_WIDTH}
				height={OPENING_MONTAGE_HEIGHT}
			/>
			<Composition
				id="Ep01Shot09Psa"
				component={Shot09Psa}
				durationInFrames={SHOT_09_DURATION}
				fps={OPENING_MONTAGE_FPS}
				width={OPENING_MONTAGE_WIDTH}
				height={OPENING_MONTAGE_HEIGHT}
			/>
			<Composition
				id="Ep01Shot10Committee"
				component={Shot10Committee}
				durationInFrames={SHOT_10_DURATION}
				fps={OPENING_MONTAGE_FPS}
				width={OPENING_MONTAGE_WIDTH}
				height={OPENING_MONTAGE_HEIGHT}
			/>
			<Composition
				id="Ep02Shot01LeaveRequest"
				component={Shot01LeaveRequest}
				durationInFrames={EP02_SHOT_01_DURATION}
				fps={OPENING_MONTAGE_FPS}
				width={OPENING_MONTAGE_WIDTH}
				height={OPENING_MONTAGE_HEIGHT}
			/>
			<Composition
				id="Ep02Shot02InstantReply"
				component={Shot02InstantReply}
				durationInFrames={EP02_SHOT_02_DURATION}
				fps={OPENING_MONTAGE_FPS}
				width={OPENING_MONTAGE_WIDTH}
				height={OPENING_MONTAGE_HEIGHT}
			/>
			<Composition
				id="Ep02Shot03Graphic"
				component={Shot03Graphic}
				durationInFrames={EP02_SHOT_03_DURATION}
				fps={OPENING_MONTAGE_FPS}
				width={OPENING_MONTAGE_WIDTH}
				height={OPENING_MONTAGE_HEIGHT}
			/>
			<Composition
				id="Ep02Shot04Testimony"
				component={Shot04Testimony}
				durationInFrames={EP02_SHOT_04_DURATION}
				fps={OPENING_MONTAGE_FPS}
				width={OPENING_MONTAGE_WIDTH}
				height={OPENING_MONTAGE_HEIGHT}
			/>
			<Composition
				id="Ep02Shot05Expert"
				component={Shot05Expert}
				durationInFrames={EP02_SHOT_05_DURATION}
				fps={OPENING_MONTAGE_FPS}
				width={OPENING_MONTAGE_WIDTH}
				height={OPENING_MONTAGE_HEIGHT}
			/>
			<Composition
				id="Ep02Shot06Fallout"
				component={Shot06Fallout}
				durationInFrames={EP02_SHOT_06_DURATION}
				fps={OPENING_MONTAGE_FPS}
				width={OPENING_MONTAGE_WIDTH}
				height={OPENING_MONTAGE_HEIGHT}
			/>
			<Composition
				id="Ep02Shot08Committee"
				component={Shot08Committee}
				durationInFrames={EP02_SHOT_08_DURATION}
				fps={OPENING_MONTAGE_FPS}
				width={OPENING_MONTAGE_WIDTH}
				height={OPENING_MONTAGE_HEIGHT}
			/>
			<Composition
				id="Ep02Shot07Psa"
				component={Shot07Psa}
				durationInFrames={EP02_SHOT_07_DURATION}
				fps={OPENING_MONTAGE_FPS}
				width={OPENING_MONTAGE_WIDTH}
				height={OPENING_MONTAGE_HEIGHT}
			/>
			<Composition
				id="Ep02Shot09FullCircle"
				component={Shot09FullCircle}
				durationInFrames={EP02_SHOT_09_DURATION}
				fps={OPENING_MONTAGE_FPS}
				width={OPENING_MONTAGE_WIDTH}
				height={OPENING_MONTAGE_HEIGHT}
			/>
			<Composition
				id="Ep03Shot01EmptyFlat"
				component={Shot01EmptyFlat}
				durationInFrames={EP03_SHOT_01_DURATION}
				fps={OPENING_MONTAGE_FPS}
				width={OPENING_MONTAGE_WIDTH}
				height={OPENING_MONTAGE_HEIGHT}
			/>
			<Composition
				id="Ep03Shot02Graphic"
				component={Ep03Shot02Graphic}
				durationInFrames={EP03_SHOT_02_DURATION}
				fps={OPENING_MONTAGE_FPS}
				width={OPENING_MONTAGE_WIDTH}
				height={OPENING_MONTAGE_HEIGHT}
			/>
			<Composition
				id="Ep03Shot04Testimony"
				component={Ep03Shot04Testimony}
				durationInFrames={EP03_SHOT_04_DURATION}
				fps={OPENING_MONTAGE_FPS}
				width={OPENING_MONTAGE_WIDTH}
				height={OPENING_MONTAGE_HEIGHT}
			/>
			<Composition
				id="Ep03Shot05Expert"
				component={Ep03Shot05Expert}
				durationInFrames={EP03_SHOT_05_DURATION}
				fps={OPENING_MONTAGE_FPS}
				width={OPENING_MONTAGE_WIDTH}
				height={OPENING_MONTAGE_HEIGHT}
			/>
			<Composition
				id="Ep01Shot11FullCircle"
				component={Shot11FullCircle}
				durationInFrames={SHOT_11_DURATION}
				fps={OPENING_MONTAGE_FPS}
				width={OPENING_MONTAGE_WIDTH}
				height={OPENING_MONTAGE_HEIGHT}
			/>
		</>
	);
};

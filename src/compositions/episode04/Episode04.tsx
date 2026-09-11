import React from 'react';
import {AbsoluteFill, Sequence} from 'remotion';
import {Shot00ColdOpen} from './shot00/Shot00ColdOpen';
import {EP04_SHOT_00_DURATION} from './shot00/beats';
import {Shot01LunchHour} from './shot01/Shot01LunchHour';
import {EP04_SHOT_01_DURATION} from './shot01/beats';
import {Shot02Graphic} from './shot02/Shot02Graphic';
import {EP04_SHOT_02_DURATION} from './shot02/beats';
import {Shot04Testimony} from './shot04/Shot04Testimony';
import {EP04_SHOT_04_DURATION} from './shot04/beats';
import {Shot05Expert} from './shot05/Shot05Expert';
import {EP04_SHOT_05_DURATION} from './shot05/beats';
import {Shot06Fallout} from './shot06/Shot06Fallout';
import {EP04_SHOT_06_DURATION} from './shot06/beats';
import {Shot07Psa} from './shot07/Shot07Psa';
import {EP04_SHOT_07_DURATION} from './shot07/beats';
import {Shot08Committee} from './shot08/Shot08Committee';
import {EP04_SHOT_08_DURATION} from './shot08/beats';
import {Shot09FullCircle} from './shot09/Shot09FullCircle';
import {EP04_SHOT_09_DURATION} from './shot09/beats';

/**
 * BIZZARO BANGALORE — Case File #04: THE BANK EMPLOYEE, assembled.
 *
 * Every shot is its own composition and stays that way: they are reviewed,
 * re-rendered and re-timed one at a time, and this file only decides what
 * order they play in. Nothing here may change how a shot looks, or the
 * assembly and the shot renders stop agreeing.
 *
 * THE SHOTS OVERLAP WHERE THEY TEAR
 *
 * Three shots open by tearing out of the picture before them. Shot 4 tears the
 * stat card away and renders that card itself, frozen, to do it; Shot 6 and
 * Shot 8 close paper back over the footage before them the same way. Each of
 * those tears is the END of the outgoing shot as much as the start of the
 * incoming one, so the incoming shot starts EARLY, over its predecessor's last
 * frames, by exactly the length of its own tear.
 *
 * Butting them end to end instead would play the outgoing shot's last frame,
 * cut, and then play a tear that starts from a frozen copy of that same frame
 * — the same picture twice with a cut in the middle of it.
 *
 * This is the first episode in the series assembled at all. Episodes 01, 02
 * and 03 exist only as loose shot files.
 */

/**
 * How far each tearing shot reaches back over the one before it.
 *
 * For Shot 4 this is not a taste decision: Shot 2 ends on eighteen frames of
 * black, and Shot 4 opens by tearing away a frozen copy of the CARD. Start it
 * eighteen frames early and the tear begins exactly as Shot 2 blacks out, so
 * the card is continuous into the tear and the black is never seen. The beat
 * of silence the script asks for survives anyway — no narration plays there.
 */
const TEAR_OVERLAP = 18;

const SHOTS: {id: string; component: React.FC; frames: number; overlap: number}[] = [
	{id: 'cold-open', component: Shot00ColdOpen, frames: EP04_SHOT_00_DURATION, overlap: 0},
	{id: 'lunch-hour', component: Shot01LunchHour, frames: EP04_SHOT_01_DURATION, overlap: 0},
	{id: 'stat-card', component: Shot02Graphic, frames: EP04_SHOT_02_DURATION, overlap: 0},
	{id: 'testimony', component: Shot04Testimony, frames: EP04_SHOT_04_DURATION, overlap: TEAR_OVERLAP},
	{id: 'expert', component: Shot05Expert, frames: EP04_SHOT_05_DURATION, overlap: 0},
	{id: 'fallout', component: Shot06Fallout, frames: EP04_SHOT_06_DURATION, overlap: TEAR_OVERLAP},
	{id: 'psa', component: Shot07Psa, frames: EP04_SHOT_07_DURATION, overlap: 0},
	{id: 'committee', component: Shot08Committee, frames: EP04_SHOT_08_DURATION, overlap: TEAR_OVERLAP},
	{id: 'full-circle', component: Shot09FullCircle, frames: EP04_SHOT_09_DURATION, overlap: 0},
];

/** Start frame of each shot, and the length of the finished episode. */
export const EP04_TIMELINE = SHOTS.reduce<{at: number[]; total: number}>(
	(acc, shot) => {
		const start = Math.max(0, acc.total - shot.overlap);
		acc.at.push(start);
		acc.total = start + shot.frames;
		return acc;
	},
	{at: [], total: 0},
);

export const EP04_DURATION = EP04_TIMELINE.total;

export const Episode04: React.FC = () => (
	<AbsoluteFill>
		{SHOTS.map((shot, i) => {
			const Shot = shot.component;
			return (
				<Sequence key={shot.id} from={EP04_TIMELINE.at[i]} durationInFrames={shot.frames}>
					<Shot />
				</Sequence>
			);
		})}
	</AbsoluteFill>
);

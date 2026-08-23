import React from 'react';
import {AbsoluteFill, Sequence} from 'remotion';
import {PageFlipTransition} from '../../components/PageFlipTransition';
import {PaperCutout} from '../../components/PaperCutout';

// Sub-beat local frame offsets/durations, relative to Beat 4's own Sequence
// (which starts at frame 180 in the full timeline).
// All three source images are ~4:3, so a matching 4:3 box lets object-fit:
// contain fill it exactly with no letterboxing.
const SUB_BEATS = [
	{asset: 'lalbagh-glass-house' as const, from: 0, duration: 45, flip: 6, size: {width: 820, height: 615}},
	{asset: 'namma-metro' as const, from: 45, duration: 30, flip: 5, size: {width: 820, height: 615}},
	{asset: 'mg-road-signage' as const, from: 75, duration: 45, flip: 4, size: {width: 820, height: 615}},
];

/**
 * Beat 4 — Icon Grab-bag: three quick sub-beats with progressively shorter
 * flip transitions (6 -> 5 -> 4 frames) to reinforce accelerating rhythm.
 * `sfxPlaybackRate` climbs across sub-beats for the heartbeat-speedup cue,
 * ready to wire up once the paper-riffle asset lands (see PageFlipTransition
 * usage below — pass `sfxSrc` once public/sfx/paper-riffle.* exists).
 */
export const Beat4IconGrabBag: React.FC = () => {
	return (
		<AbsoluteFill>
			{SUB_BEATS.map((beat, i) => (
				<Sequence key={beat.asset} from={beat.from} durationInFrames={beat.duration}>
					<PageFlipTransition
						totalDurationInFrames={beat.duration}
						durationInFrames={beat.flip}
						sfxPlaybackRate={1 + i * 0.15}
					>
						<AbsoluteFill
							style={{backgroundColor: '#f6f1e6', justifyContent: 'center', alignItems: 'center'}}
						>
							<div style={{width: beat.size.width, height: beat.size.height}}>
								<PaperCutout asset={beat.asset} textureOpacity={0} />
							</div>
						</AbsoluteFill>
					</PageFlipTransition>
				</Sequence>
			))}
		</AbsoluteFill>
	);
};

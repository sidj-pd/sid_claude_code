import React from 'react';
import {AbsoluteFill, Audio, Freeze, Sequence, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {CollageBackdrop} from '../../../components/CollageBackdrop';
import {Footage} from '../../../components/Footage';
import {NewsHeadline} from '../../../components/NewsHeadline';
import {PaperTear} from '../../../components/PaperTear';
import {VoiceOver} from '../../../components/VoiceOver';
import {useStopMotionStep} from '../../../components/useStopMotionStep';
import {PSA_FRAMES} from '../shot09/beats';
import {HEADLINE_LAND, REV_DONE, REV_FRAMES, REV_STARTS, VO_STARTS} from './beats';

const CLAMP = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

/**
 * Shot 10 — The Committee.
 *
 * The episode's smallest joke, played at the episode's smallest scale: one
 * headline, one dry sentence, gone almost as soon as it lands. Escalating it
 * with more graphics or a longer hold would undersell the line it exists to
 * deliver — a government's idea of resolution is a meeting about a meeting,
 * and the shot's brevity is what sells that better than any amount of set
 * dressing could.
 */
export const Shot10Committee: React.FC = () => {
	const frame = useCurrentFrame();

	const {stepIndex: tearStep} = useStopMotionStep(Math.max(0, frame - REV_STARTS), 2);
	const opening = interpolate(
		Math.min(tearStep * 2, REV_FRAMES),
		[0, REV_FRAMES],
		[0, 1],
		CLAMP,
	);
	const progress = frame < REV_STARTS ? 1 : frame < REV_DONE ? 1 - opening : 0;

	return (
		<AbsoluteFill style={{backgroundColor: '#0c0e11'}}>
			<Sequence from={0} durationInFrames={REV_STARTS + REV_FRAMES}>
				<Freeze frame={PSA_FRAMES - 6}>
					<Footage
						id="ep01-correspondent-psa"
						description="Correspondent on a video call."
						muted
					/>
				</Freeze>
			</Sequence>

			<PaperTear progress={progress} at={38} lean={24} seed={53}>
				<AbsoluteFill>
					<CollageBackdrop chaos={0.16} />
					<div style={{position: 'absolute', left: 130, top: 560}}>
						<NewsHeadline
							headline={'GOVERNMENT FORMS\nCOMMITTEE TO STUDY\nW.T.F. SYNDROME'}
							quote="COMMITTEE YET TO MEET"
							quoted={false}
							clipping="newspaper-clip-committee"
							age={frame - HEADLINE_LAND}
							width={780}
							clipHeight={520}
							rotate={-1}
						/>
					</div>
				</AbsoluteFill>
			</PaperTear>

			<Sequence from={REV_STARTS}>
				<Audio src={staticFile('sfx/paper-rip.wav')} volume={0.85} />
			</Sequence>
			<Sequence from={HEADLINE_LAND}>
				<Audio src={staticFile('sfx/stamp-thud.wav')} volume={0.7} />
			</Sequence>

			<VoiceOver id="ep01-shot10-committee" from={VO_STARTS} />
		</AbsoluteFill>
	);
};

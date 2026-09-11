import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {Chyron} from '../../../components/Chyron';
import {Footage} from '../../../components/Footage';
import {NewsprintTexture} from '../../../components/NewsprintTexture';
import {tornPolygon} from '../../../components/tornEdge';
import {SAFE_BOTTOM_Y} from '../../../components/safeArea';
import {useStopMotionStep} from '../../../components/useStopMotionStep';
import {BUTTER, GANACHE, GANACHE_DEEP} from '../../../components/palette';
import {CARD_FRAMES, CARD_IN, CHYRON_IN, TAKE_FRAMES, TRIM_IN} from './beats';

const CLAMP = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

export const Shot07Psa: React.FC = () => {
	const frame = useCurrentFrame();

	/**
	 * The card stamps rather than fades, and it stamps on the stop-motion grid
	 * — it is a piece of paper held up to camera, not a broadcast graphic.
	 */
	const {steppedFrame} = useStopMotionStep(Math.max(0, frame - CARD_IN), 2);
	const age = frame >= CARD_IN ? steppedFrame : -1;
	const showCard = frame >= CARD_IN && frame < CARD_IN + CARD_FRAMES;

	return (
		<AbsoluteFill style={{backgroundColor: GANACHE_DEEP}}>
			<Footage
				id="ep04-correspondent-psa"
				trimBeforeInFrames={TRIM_IN}
				description={
					'The correspondent, direct address, news sign-off framing.\n' +
					'"If a bank counter has served you during the lunch hour — do not\n' +
					'celebrate. Note the time you reached home. Inform your family in\n' +
					'advance. Some things are better discovered on schedule."\n' +
					'Beat: "Better safe than sorry."\nVertical, photoreal, with its own dialogue.'
				}
			/>

			<Chyron
				name="BIZZARO BANGALORE"
				title="PUBLIC SERVICE ANNOUNCEMENT"
				frame={frame}
				in={CHYRON_IN}
				out={TAKE_FRAMES - 6}
				top={SAFE_BOTTOM_Y - 196}
				seed={73}
			/>

			{/* The reassurance he never actually offers, stated flatly on card
			    while he says something else. Same device as Episode 03's PSA. */}
			{showCard ? (
				<div
					style={{
						position: 'absolute',
						left: 90,
						right: 90,
						top: 300,
						background: BUTTER,
						padding: '38px 30px',
						clipPath: tornPolygon({seed: 44, depth: 5, teeth: 15}),
						textAlign: 'center',
						fontFamily: 'RansomArchivoBlack, sans-serif',
						fontSize: 76,
						lineHeight: 1.02,
						letterSpacing: 1,
						color: GANACHE,
						transform: `rotate(-2deg) scale(${interpolate(age, [0, 2], [1.22, 1], CLAMP)})`,
						opacity: interpolate(age, [0, 1], [0, 1], CLAMP),
					}}
				>
					SOME THINGS ARE BETTER
					<br />
					DISCOVERED ON SCHEDULE
					<NewsprintTexture opacity={0.16} />
				</div>
			) : null}
		</AbsoluteFill>
	);
};

import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {NewsprintTexture} from '../../../components/NewsprintTexture';
import {tornPolygon} from '../../../components/tornEdge';
import {useStopMotionStep} from '../../../components/useStopMotionStep';
import {BUTTER, GANACHE} from '../../../components/palette';

const CLAMP = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

/** The diagram's pulse — the slower one, as the stat card uses. */
const STEP = 3;

/**
 * The expert's chain of causation, drawn as five boxes joined by hand-drawn
 * arrows, each one arriving on the beat.
 *
 * The escalation is the whole gag: a four-minute bank transaction to
 * civilisational collapse with no logical step in between. So the boxes get
 * BIGGER and heavier as they go, and the last one lands hardest — the type
 * grows, the stamp grows, and the thud grows with them. A diagram drawn at one
 * weight throughout would present all five as equally reasonable, which is the
 * opposite of the joke.
 *
 * Box four is covered by a PARENTAL ADVISORY stamp. The script wants the
 * familiar warning-label look, so it is the only element in the episode that
 * is deliberately NOT in the palette: flat black on flat white, no grain, no
 * torn edge, no Aruba anywhere near it. It reads as something pasted on from
 * outside the film, which is exactly what a censor's label is.
 */
const BOXES = [
	{label: 'OPEN COUNTER', size: 44, w: 620, h: 132},
	{label: '4 MINUTES', size: 50, w: 660, h: 142},
	{label: 'HOME BY 2', size: 58, w: 700, h: 156},
	{label: null, size: 0, w: 760, h: 176},
	{label: 'CITY STOPS\nFUNCTIONING', size: 74, w: 860, h: 250},
] as const;

/**
 * Stacked so the last box's BOTTOM clears SAFE_BOTTOM_Y (1536). The first
 * spacing put it at 1570 -- thirty-four pixels under the platform's caption
 * rail, which on the biggest and most important word in the diagram is the
 * one place it could not go.
 */
const TOPS = [110, 370, 640, 930, 1240];

export const ChainDiagram: React.FC<{
	/**
	 * The frame each box lands on, one per box. Explicit rather than a start
	 * plus an interval, because the narration's phrases are not evenly spaced
	 * and the boxes follow the narration.
	 */
	at: number[];
}> = ({at}) => {
	const frame = useCurrentFrame();
	const {steppedFrame} = useStopMotionStep(frame, STEP);

	return (
		<AbsoluteFill>
			{BOXES.map((box, i) => {
				const age = steppedFrame - at[i];
				if (age < 0) return null;

				const left = 540 - box.w / 2;
				const top = TOPS[i];

				// Each box arrives the way a stamp does: over-sized on the first
				// step, settled by the second. The last one overshoots hardest.
				const punch = i === BOXES.length - 1 ? 1.3 : 1.14;
				const scale = interpolate(age, [0, 3], [punch, 1], CLAMP);
				const opacity = interpolate(age, [0, 2], [0, 1], CLAMP);

				return (
					<React.Fragment key={i}>
						{/* The arrow down from the previous box, drawn on before
						    the box it points at rather than after, so the chain
						    reads as being followed rather than assembled. */}
						{i > 0 ? (
							<svg
								width={1080}
								height={1920}
								style={{position: 'absolute', inset: 0, pointerEvents: 'none', opacity}}
							>
								<line
									x1={540}
									y1={TOPS[i - 1] + BOXES[i - 1].h}
									x2={540}
									y2={top - 14}
									stroke={BUTTER}
									strokeWidth={7}
									strokeLinecap="round"
								/>
								<polygon
									points={`${540 - 16},${top - 20} ${540 + 16},${top - 20} 540,${top + 2}`}
									fill={BUTTER}
								/>
							</svg>
						) : null}

						{box.label === null ? (
							/* The censor's label. Flat black on flat white, no
							   grain and no torn edge -- the only thing in the
							   episode outside the palette, because it is meant
							   to look pasted on from outside the film. */
							<div
								style={{
									position: 'absolute',
									left,
									top,
									width: box.w,
									height: box.h,
									background: '#ffffff',
									border: '10px solid #000000',
									display: 'flex',
									flexDirection: 'column',
									alignItems: 'center',
									justifyContent: 'center',
									transform: `scale(${scale}) rotate(-1.5deg)`,
									opacity,
								}}
							>
								{/* Archivo Black, and the only thing in the episode
								    left on it. The censor label is deliberately
								    outside the palette and outside the house type:
								    it is meant to look pasted on from elsewhere,
								    and Anton would quietly make it belong. */}
								<div
									style={{
										fontFamily: 'RansomArchivoBlack, sans-serif',
										fontSize: 56,
										lineHeight: 0.98,
										letterSpacing: 2,
										color: '#000000',
										textAlign: 'center',
									}}
								>
									PARENTAL
									<br />
									ADVISORY
								</div>
							</div>
						) : (
							<div
								style={{
									position: 'absolute',
									left,
									top,
									width: box.w,
									height: box.h,
									background: i === BOXES.length - 1 ? GANACHE : BUTTER,
									color: i === BOXES.length - 1 ? BUTTER : GANACHE,
									clipPath: tornPolygon({seed: 7 + i * 3, depth: 4, teeth: 13}),
									display: 'flex',
									alignItems: 'center',
									justifyContent: 'center',
									textAlign: 'center',
									/* Anton, matching the stat card and the nameplates. */
									fontFamily: 'RansomAnton, sans-serif',
									fontSize: box.size,
									lineHeight: 0.98,
									letterSpacing: 1.5,
									whiteSpace: 'pre-line',
									transform: `scale(${scale}) rotate(${(i % 2 ? 1 : -1) * 1.2}deg)`,
									opacity,
									boxShadow: `0 ${6 + i * 2}px ${14 + i * 4}px rgba(36,24,18,0.26)`,
								}}
							>
								{box.label}
								<NewsprintTexture opacity={0.16} />
							</div>
						)}
					</React.Fragment>
				);
			})}
			<AbsoluteFill
				style={{
					background: `radial-gradient(ellipse at 50% 46%, transparent 62%, rgba(36,24,18,0.2) 130%)`,
					pointerEvents: 'none',
				}}
			/>
		</AbsoluteFill>
	);
};

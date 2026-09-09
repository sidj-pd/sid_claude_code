import React from 'react';
import {interpolate} from 'remotion';
import {PaperCutout} from '../../../components/PaperCutout';
import {BUTTER, GANACHE} from '../../../components/palette';

const CLAMP = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

/**
 * The clock face, with the window between 3:30 and 4:00 lit.
 *
 * The ART has no hands and no numerals — deliberately. A generated clock face
 * puts its hands wherever it likes and spells its numerals wrong, and this one
 * has to read exactly half past three. So the drawing supplies the rim, the
 * ticks and the paper, and everything that has to be CORRECT is drawn here in
 * SVG: two hands at measured angles and a wedge between them.
 *
 * Angles are from twelve o'clock, clockwise. 3:30 puts the hour hand halfway
 * between 3 and 4 — 105 degrees, not 90, which is the mistake every clock
 * illustration makes — and the minute hand at 180.
 */
const HOUR_ANGLE = 105;
const MINUTE_ANGLE = 180;
/** Four o'clock: where the window shuts. */
const CLOSE_ANGLE = 120;

const polar = (cx: number, cy: number, r: number, deg: number) => {
	const rad = ((deg - 90) * Math.PI) / 180;
	return [cx + r * Math.cos(rad), cy + r * Math.sin(rad)];
};

export const Clock: React.FC<{
	size: number;
	/** 0-1, hands drawing on. */
	hands: number;
	/** 0-1, the window wedge filling in. */
	wedge: number;
}> = ({size, hands, wedge}) => {
	const c = size / 2;
	const r = size * 0.36;

	const [hx, hy] = polar(c, c, r * 0.56, HOUR_ANGLE);
	const [mx, my] = polar(c, c, r * 0.84, MINUTE_ANGLE);

	// The wedge sweeps from 3:30 to 4:00 as `wedge` fills, so the window is
	// seen to be small rather than asserted to be.
	const to = interpolate(wedge, [0, 1], [HOUR_ANGLE, CLOSE_ANGLE], CLAMP);
	const [wx0, wy0] = polar(c, c, r * 0.92, HOUR_ANGLE);
	const [wx1, wy1] = polar(c, c, r * 0.92, to);

	return (
		<div style={{position: 'relative', width: size, height: size}}>
			<PaperCutout asset="bank-clock" elevation={1.1} textureOpacity={0} style={{width: size, height: size}} />

			<svg width={size} height={size} style={{position: 'absolute', inset: 0}}>
				{wedge > 0.01 ? (
					<path
						d={`M ${c} ${c} L ${wx0} ${wy0} A ${r * 0.92} ${r * 0.92} 0 0 1 ${wx1} ${wy1} Z`}
						fill={BUTTER}
						opacity={0.92}
					/>
				) : null}

				{/* Hands draw outward from the centre rather than fading in —
				    a hand that appears at full length has not been set. */}
				<line
					x1={c}
					y1={c}
					x2={c + (hx - c) * Math.min(1, hands * 2)}
					y2={c + (hy - c) * Math.min(1, hands * 2)}
					stroke={GANACHE}
					strokeWidth={size * 0.032}
					strokeLinecap="round"
				/>
				<line
					x1={c}
					y1={c}
					x2={c + (mx - c) * Math.max(0, Math.min(1, hands * 2 - 1))}
					y2={c + (my - c) * Math.max(0, Math.min(1, hands * 2 - 1))}
					stroke={GANACHE}
					strokeWidth={size * 0.024}
					strokeLinecap="round"
				/>
				<circle cx={c} cy={c} r={size * 0.024} fill={GANACHE} />
			</svg>
		</div>
	);
};

import React from 'react';
import {NewsprintTexture} from '../../../components/NewsprintTexture';
import {FARE_TILES, TILE_INK, TILE_NUMERAL} from '../meter';

/**
 * Changes what the meter reads.
 *
 * The art draws the fare as four dark tiles with a cream numeral knocked out
 * of each, all reading zero. So a new reading is four fresh tiles of the same
 * design laid over the old ones — which is not a workaround, it is how an
 * animator changes a number on a physical puppet: you cut a new chit and put
 * it down on top of the old one.
 *
 * Only the digits that actually change get a chit. Patching all four would
 * mean matching the art's per-tile rotation and grain four times over for no
 * gain, and any mismatch would be four times as visible.
 */

/** Each chit is cut a little larger than the digit it covers. */
const OVERSIZE = 1.08;

/**
 * Three poses as it lands: over-rotated and proud of the surface, a
 * correction past level, then where it stays. Stepped, never eased — a hand
 * put it there between two exposures.
 */
const POSES = [
	{scale: 1.13, rotate: -7, lift: 2.4},
	{scale: 1.02, rotate: -0.6, lift: 1.4},
	{scale: 1, rotate: -1.6, lift: 1},
];
const POSE_HOLD = 2;

type Props = {
	/** Four digits, most significant first: '3000' reads ₹30.00. */
	digits: string;
	/** Frames since the reading changed. Negative means it has not yet. */
	age: number;
	/** Rendered height of the meter in px, which sets the numeral size. */
	meterHeight: number;
};

export const FareReading: React.FC<Props> = ({digits, age, meterHeight}) => {
	if (age < 0) return null;
	const pose = POSES[Math.min(POSES.length - 1, Math.floor(age / POSE_HOLD))];

	return (
		<>
			{FARE_TILES.map((tile, i) => {
				const digit = digits[i];
				// The art already reads zero, so an unchanged digit needs no chit.
				if (digit === undefined || digit === '0') return null;
				const height = tile.height * meterHeight;

				return (
					<div
						key={tile.left}
						style={{
							position: 'absolute',
							left: `${tile.left * 100}%`,
							top: `${tile.top * 100}%`,
							width: `${tile.width * 100}%`,
							height: `${tile.height * 100}%`,
							transform: `scale(${OVERSIZE * pose.scale}) rotate(${pose.rotate}deg)`,
							filter: `drop-shadow(0 ${2 * pose.lift}px ${3 * pose.lift}px rgba(40,28,14,0.45))`,
						}}
					>
						<div
							style={{
								position: 'relative',
								width: '100%',
								height: '100%',
								background: TILE_INK,
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
								overflow: 'hidden',
							}}
						>
							<span
								style={{
									fontFamily: 'RansomArchivoBlack, sans-serif',
									// Archivo Black's cap height is about 0.73em, and the
									// art's numerals stand about 0.69 of their tile.
									fontSize: height * 0.94,
									lineHeight: 1,
									color: TILE_NUMERAL,
									// The knocked-out numerals sit a touch high in the art.
									transform: `translateY(${-height * 0.03}px)`,
								}}
							>
								{digit}
							</span>
							<NewsprintTexture opacity={0.3} />
						</div>
					</div>
				);
			})}
		</>
	);
};

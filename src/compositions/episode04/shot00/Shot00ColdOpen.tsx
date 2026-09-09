import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {CollageBackdrop} from '../../../components/CollageBackdrop';
import {NewsprintTexture} from '../../../components/NewsprintTexture';
import {PaperCutout} from '../../../components/PaperCutout';
import {BankFlatLay} from './BankFlatLay';
import {VIGNETTE_FRAMES, VIGNETTE_IN} from './beats';

/**
 * The man behind the counter. Placed once, at frame 0, and never touched
 * again — no entrance, no easing, no reaction. Sixteen props are stacked over
 * him and then taken off, and he is in exactly the same position at the end
 * as at the start, which is the joke and also the reason nothing here
 * animates him.
 */
const SUBJECT_CX = 540;
const SUBJECT_CY = 880;
const SUBJECT_W = 760;
/** 760 / 0.881, the ratio measured off the keyed art rather than asked for. */
const SUBJECT_H = 862;

/**
 * The vignette's clear centre. The reference's disc is 0.86 of its frame
 * width, and that fraction carried straight over cropped his shoulders and
 * both ends of the counter — its subject is a line of type, which is much
 * shorter than a man. So the geometry follows him instead: he spans y 449-1311
 * and x 160-920, and 1040 across, centred on his torso, is the smallest circle
 * that holds all of that with a margin.
 */
const DISC_D = 1040;
const DISC_CY = 920;

export const Shot00ColdOpen: React.FC = () => {
	const frame = useCurrentFrame();

	/**
	 * Deliberately NOT quantised to the stop-motion step. Everything else in
	 * this shot hops on a 2-frame grid; the light is the one thing that eases,
	 * and that is what makes the ending register as a change of kind rather
	 * than as a fourteenth prop leaving.
	 */
	const closed = interpolate(frame, [VIGNETTE_IN, VIGNETTE_IN + VIGNETTE_FRAMES], [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});

	return (
		<AbsoluteFill>
			<CollageBackdrop chaos={0} />

			{/* Under the pile from frame 0, never placed, never moved. */}
			<div
				style={{
					position: 'absolute',
					left: SUBJECT_CX - SUBJECT_W / 2,
					top: SUBJECT_CY - SUBJECT_H / 2,
					width: SUBJECT_W,
					height: SUBJECT_H,
				}}
			>
				<PaperCutout
					asset="bank-employee"
					elevation={1}
					textureOpacity={0}
					style={{width: SUBJECT_W, height: SUBJECT_H}}
				/>
			</div>

			<BankFlatLay />

			{/* One grain pass over the paper and everything on it, so the man
			    and the props are printed on the same sheet rather than
			    composited onto it. */}
			<NewsprintTexture opacity={0.22} />

			{/* The vignette closes OVER the finished frame rather than swapping
			    the ground underneath it. The paper he is sitting on is the same
			    paper it always was — the room around it just stops being lit,
			    which is why nothing appears to move at the end of the shot. */}
			<AbsoluteFill
				style={{
					pointerEvents: 'none',
					opacity: closed,
					background: `radial-gradient(circle ${DISC_D / 2}px at ${SUBJECT_CX}px ${DISC_CY}px, rgba(11,9,6,0) 0%, rgba(11,9,6,0) 58%, ${'#0b0906'} 100%)`,
				}}
			/>
		</AbsoluteFill>
	);
};

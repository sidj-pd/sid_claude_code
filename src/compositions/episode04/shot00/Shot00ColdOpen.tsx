import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {BUTTER, GANACHE_DEEP} from '../../../components/palette';
import {BankPlate} from '../BankPlate';
import {Ground} from '../Ground';
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
 * The counter top runs across the bottom of his art, around y 1230. Both props
 * stand on it, and both sit inside the open ledger's footprint (x 50-1030,
 * y 938-1462), which is what keeps them buried until he is.
 */
const SIGN_Y = 1178;
const TIFFIN_Y = 1150;

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
	/**
	 * The iris closes SPATIALLY: the gradient is always at full strength and
	 * it is its radius that shrinks, from well outside the frame down onto
	 * him. The obvious version — a fixed vignette faded up on opacity — was
	 * built and rendered and it is wrong: at half opacity a black outer stop
	 * over cream paper is a flat grey, so the whole frame washes muddy on the
	 * way in and reads as a dissolve rather than as the lights going down.
	 */
	const radius = interpolate(frame, [VIGNETTE_IN, VIGNETTE_IN + VIGNETTE_FRAMES], [2600, DISC_D / 2], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});

	return (
		<AbsoluteFill>
			<Ground />

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

			{/* Mounted above the counter, and buried with him: the coverage
			    check counts the plate's rectangle as part of the subject, and
			    the pile had to be re-laid to hide it. */}
			<BankPlate />

			{/* On the counter, under the pile with him. Both sit inside the
			    ledger's footprint, which is what keeps them hidden until he
			    is -- checked against the same coverage pass, not eyeballed. */}
			<div style={{position: 'absolute', left: 150, top: SIGN_Y, width: 300, height: 178}}>
				<PaperCutout asset="bank-sign" elevation={0.9} textureOpacity={0} style={{width: 300, height: 178}} />
			</div>
			{/* The sign's panel is blank art. Every word in this episode is set
			    here, because the generator cannot spell -- one clipping came
			    back with a headline in Malayalam. */}
			<div
				style={{
					position: 'absolute',
					left: 150,
					top: SIGN_Y + 34,
					width: 300,
					textAlign: 'center',
					fontFamily: 'RansomArchivoBlack, sans-serif',
					fontSize: 34,
					lineHeight: 1.1,
					letterSpacing: 1,
					color: BUTTER,
					transform: 'rotate(-1.5deg)',
				}}
			>
				OUT FOR
				<br />
				LUNCH
			</div>
			<div style={{position: 'absolute', left: 660, top: TIFFIN_Y, width: 260, height: 191}}>
				<PaperCutout asset="tiffin-open" elevation={0.9} textureOpacity={0} style={{width: 260, height: 191}} />
			</div>

			<BankFlatLay />

			{/* One grain pass over the ground and everything on it, so the man
			    and the props are printed on the same sheet rather than
			    composited onto it. */}
			<NewsprintTexture opacity={0.16} />

			{/* The vignette closes OVER the finished frame rather than swapping
			    the ground underneath it. The sheet he is sitting on is the same
			    sheet it always was — the room around it just stops being lit,
			    which is why nothing appears to move at the end of the shot. */}
			<AbsoluteFill
				style={{
					pointerEvents: 'none',
					background: `radial-gradient(circle ${radius}px at ${SUBJECT_CX}px ${DISC_CY}px, rgba(36,24,18,0) 0%, rgba(36,24,18,0) 52%, ${GANACHE_DEEP} 96%)`,
				}}
			/>
		</AbsoluteFill>
	);
};

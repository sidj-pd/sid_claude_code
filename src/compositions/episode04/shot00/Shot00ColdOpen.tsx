import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {CollageBackdrop} from '../../../components/CollageBackdrop';
import {NewsprintTexture} from '../../../components/NewsprintTexture';
import {PaperCutout} from '../../../components/PaperCutout';
import {PAPER} from '../../episode01/shot05/StatBar';
import {BankFlatLay} from './BankFlatLay';
import {SPOTLIGHT} from './beats';

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
 * The spotlight. The reference's disc is 0.86 of its frame width, and that
 * fraction carried straight over cropped his shoulders and both ends of the
 * counter — its subject is a line of type, which is much shorter than a man.
 * So the geometry follows him instead: he spans y 449-1311 and x 160-920, and
 * 1040 across, centred on his torso, is the smallest disc that holds all of
 * that with a margin. He must not move or resize across the cut, so the light
 * is the only thing left to change.
 */
const DISC_D = 1040;
const DISC_CY = 920;

export const Shot00ColdOpen: React.FC = () => {
	const frame = useCurrentFrame();
	const lit = frame >= SPOTLIGHT;

	return (
		<AbsoluteFill style={{background: lit ? '#0b0906' : undefined}}>
			{/* Ground. Before the spotlight it is the series' paper; after, the
			    paper survives only as the disc he is sitting in, so his
			    relationship to his own surface never changes and the cut reads
			    as the lights going out around him rather than as a new shot. */}
			{lit ? (
				<AbsoluteFill
					style={{
						background: `radial-gradient(circle ${DISC_D / 2}px at ${SUBJECT_CX}px ${DISC_CY}px, ${PAPER} 0%, ${PAPER} 82%, rgba(242,233,211,0) 100%)`,
					}}
				/>
			) : (
				<CollageBackdrop chaos={0} />
			)}

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

			{/* One grain pass over everything, so the man and the props are
			    printed on the same sheet rather than composited onto it. */}
			<NewsprintTexture opacity={0.22} />
		</AbsoluteFill>
	);
};

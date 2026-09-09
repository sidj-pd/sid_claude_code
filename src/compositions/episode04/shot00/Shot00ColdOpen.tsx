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

/**
 * The spotlight. Geometry taken from the reference as a fraction of its frame
 * and multiplied up to 1080x1920 — diameter 0.86 of the frame width, centred
 * at (0.495, 0.520) — so the disc occupies the same share of the screen it
 * does there rather than a share that merely looked similar. Nudged onto him
 * rather than onto the geometric centre.
 */
const DISC_D = 929;

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
						background: `radial-gradient(circle ${DISC_D / 2}px at ${SUBJECT_CX}px ${SUBJECT_CY + 60}px, ${PAPER} 0%, ${PAPER} 82%, rgba(242,233,211,0) 100%)`,
					}}
				/>
			) : (
				<CollageBackdrop chaos={0} />
			)}

			<div
				style={{
					position: 'absolute',
					left: SUBJECT_CX - SUBJECT_W / 2,
					top: SUBJECT_CY - SUBJECT_W / 2,
					width: SUBJECT_W,
				}}
			>
				<PaperCutout asset="bank-employee" elevation={1} />
			</div>

			<BankFlatLay />

			{/* One grain pass over everything, so the man and the props are
			    printed on the same sheet rather than composited onto it. */}
			<NewsprintTexture opacity={0.22} />
		</AbsoluteFill>
	);
};

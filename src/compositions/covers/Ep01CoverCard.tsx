import React from 'react';
import {AbsoluteFill} from 'remotion';
import {RansomHeadlineText} from '../../components/RansomHeadlineText';
import {OpeningMontage} from '../OpeningMontage';

/**
 * A still export of the series cover: the opening montage's own final frame
 * (the crowded jam, stamped BIZZARO BANGALORE) with an "EPISODE ONE" line
 * added above the title.
 *
 * Renders the real OpeningMontage as its background rather than
 * reconstructing the backdrop and stamp by hand, so this can never drift
 * from what the actual opening looks like — take a still of this
 * composition's last frame and it is pixel-identical to the montage's own
 * ending, plus the one new line.
 */
export const Ep01CoverCard: React.FC = () => (
	<AbsoluteFill>
		<OpeningMontage />
		<AbsoluteFill style={{alignItems: 'center', zIndex: 250}}>
			<div style={{marginTop: 610}}>
				<RansomHeadlineText text="EPISODE ONE" letterStagger={1} fontSize={54} />
			</div>
		</AbsoluteFill>
	</AbsoluteFill>
);

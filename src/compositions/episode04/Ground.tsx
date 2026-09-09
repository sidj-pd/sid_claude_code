import React from 'react';
import {AbsoluteFill} from 'remotion';
import {NewsprintTexture} from '../../components/NewsprintTexture';
import {ARUBA, ARUBA_DEEP, ARUBA_LIGHT, SHADOW_RGB} from '../../components/palette';

/**
 * Episode 04's surface: a flat sheet of Aruba Blue, lit from above.
 *
 * This replaces CollageBackdrop for this episode. The old one is built out of
 * warm creams and a brown horizon haze, and none of that survives a move to a
 * saturated aqua — the haze in particular turns to mud. What is kept is the
 * reason the old one exists at all: a ground that is subtly lit rather than a
 * flat fill, so a cutout laid on it reads as sitting ON something.
 *
 * Deliberately much flatter than its predecessor. Aruba is a loud colour and
 * a gradient across it that would be invisible in cream becomes a visible band
 * here, so the top-to-bottom shift is about a third of what Episodes 01-03
 * use, and the vignette is a whisper rather than a frame.
 */
export const Ground: React.FC<{grain?: number}> = ({grain = 0.14}) => (
	<AbsoluteFill>
		<AbsoluteFill
			style={{
				background: `linear-gradient(180deg, ${ARUBA_LIGHT} 0%, ${ARUBA} 46%, ${ARUBA_DEEP} 100%)`,
			}}
		/>

		{/* Grain, so the sheet is printed rather than filled. Lower than the
		    warm episodes use: halftone dots read much harder on saturated
		    aqua than they do on cream. */}
		<NewsprintTexture opacity={grain} halftoneSize={7} />

		<AbsoluteFill
			style={{
				background: `radial-gradient(ellipse at 50% 44%, transparent 66%, rgba(${SHADOW_RGB}, 0.22) 130%)`,
			}}
		/>
	</AbsoluteFill>
);

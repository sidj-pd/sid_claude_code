import React from 'react';
import {AbsoluteFill, Easing, interpolate, useCurrentFrame} from 'remotion';
import {NewsprintTexture} from '../../components/NewsprintTexture';
import {PaperCutout} from '../../components/PaperCutout';
import {RansomHeadlineText} from '../../components/RansomHeadlineText';
import {StampImpact} from '../../components/StampImpact';
import {usePopIn} from '../../components/usePopIn';
import {CutoutAsset} from '../../assets/cutouts';

const LETTER_STAGGER = 1;
const STAMP_TRIGGER_FRAME = 26;

const CAST: CutoutAsset[] = [
	'vidhana-soudha',
	'auto-rickshaw',
	'it-park-building',
	'lalbagh-glass-house',
	'namma-metro',
	'mg-road-signage',
];

const POP_START = 32;
const POP_STAGGER = 2;
const FLIP_DOWN_START = 48;
const FLIP_DOWN_STAGGER = 2;
const FLIP_DOWN_DURATION = 10;

const CastThumbnail: React.FC<{asset: CutoutAsset; index: number}> = ({asset, index}) => {
	const frame = useCurrentFrame();
	const pop = usePopIn(frame, {delay: POP_START + index * POP_STAGGER, damping: 9, stiffness: 170});

	const flipDelay = FLIP_DOWN_START + index * FLIP_DOWN_STAGGER;
	const flipProgress = interpolate(frame - flipDelay, [0, FLIP_DOWN_DURATION], [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
		easing: Easing.in(Easing.cubic),
	});
	const opacity = interpolate(flipProgress, [0, 0.7, 1], [1, 1, 0], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});

	return (
		<div
			style={{
				width: 140,
				height: 105,
				transform: `scale(${pop}) translateY(${flipProgress * 90}px) rotateX(${flipProgress * 110}deg)`,
				transformOrigin: 'center top',
				opacity,
			}}
		>
			<PaperCutout asset={asset} textureOpacity={0} />
		</div>
	);
};

/**
 * Beat 5 — Title Drop, frames 300-360. Headline slams in, gets stamped,
 * then the whole cast of locations pops in beneath it for a curtain call —
 * which then flips downward and away, clearing the frame into Scene 1.
 */
export const Beat5TitleDrop: React.FC = () => {
	return (
		<AbsoluteFill style={{backgroundColor: '#0b0906'}}>
			<NewsprintTexture opacity={0.15} />
			<StampImpact triggerFrame={STAMP_TRIGGER_FRAME} punchDurationInFrames={4} sfxSrc={undefined}>
				<div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 36}}>
					<RansomHeadlineText text="BIZZARO BANGALORE" letterStagger={LETTER_STAGGER} fontSize={72} />
					<div style={{display: 'flex', gap: 16, perspective: 900}}>
						{CAST.map((asset, i) => (
							<CastThumbnail key={asset} asset={asset} index={i} />
						))}
					</div>
				</div>
			</StampImpact>
		</AbsoluteFill>
	);
};

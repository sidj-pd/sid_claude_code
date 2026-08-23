import React from 'react';
import {Img, staticFile} from 'remotion';

/**
 * Real paper-cutout illustrations. The source art in public/cutouts/ is flat
 * JPGs on a cream backdrop; scripts/cutout-alpha.mjs keys that backdrop out
 * (edge flood fill, so interior cream survives) into true transparent PNGs
 * in public/cutouts-alpha/, which is what we render. Transparency is what
 * lets a drop-shadow hug the artwork's real silhouette — without it every
 * cutout reads as a rectangular postcard with a shadow around the card.
 *
 * Re-run `node scripts/cutout-alpha.mjs` after replacing any source art.
 */

const IMAGE_STYLE: React.CSSProperties = {
	width: '100%',
	height: '100%',
	objectFit: 'contain',
};

const makeCutout = (file: string): React.FC => {
	const Cutout: React.FC = () => <Img src={staticFile(file)} style={IMAGE_STYLE} />;
	return Cutout;
};

export const VidhanaSoudha = makeCutout('cutouts-alpha/vidhana-soudha.png');
export const AutoRickshaw = makeCutout('cutouts-alpha/auto-rickshaw.png');
export const ExhaustPuff = makeCutout('cutouts-alpha/exhaust-puff.png');
export const ItParkBuilding = makeCutout('cutouts-alpha/it-park-building.png');
export const LalbaghGlassHouse = makeCutout('cutouts-alpha/lalbagh-glass-house.png');
export const NammaMetro = makeCutout('cutouts-alpha/namma-metro.png');
export const MgRoadSignage = makeCutout('cutouts-alpha/mg-road-signage.png');

export type CutoutAsset =
	| 'vidhana-soudha'
	| 'auto-rickshaw'
	| 'exhaust-puff'
	| 'it-park-building'
	| 'lalbagh-glass-house'
	| 'namma-metro'
	| 'mg-road-signage';

export const CUTOUT_REGISTRY: Record<CutoutAsset, React.FC> = {
	'vidhana-soudha': VidhanaSoudha,
	'auto-rickshaw': AutoRickshaw,
	'exhaust-puff': ExhaustPuff,
	'it-park-building': ItParkBuilding,
	'lalbagh-glass-house': LalbaghGlassHouse,
	'namma-metro': NammaMetro,
	'mg-road-signage': MgRoadSignage,
};

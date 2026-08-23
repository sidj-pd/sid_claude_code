import React from 'react';
import {Img, staticFile} from 'remotion';

/**
 * Real paper-cutout illustrations (generated art, dropped into
 * public/cutouts/). Each is a flat ~4:3 image on a plain cream backdrop —
 * no alpha transparency — so <PaperCutout> just renders it with
 * object-fit: contain inside whatever box the beat gives it, and the beat's
 * own background is picked to match the art's backdrop tone.
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

export const VidhanaSoudha = makeCutout('cutouts/vidhana-soudha.jpg');
export const AutoRickshaw = makeCutout('cutouts/auto-rickshaw.jpg');
export const ExhaustPuff = makeCutout('cutouts/exhaust-puff.jpg');
export const ItParkBuilding = makeCutout('cutouts/it-park-building.jpg');
export const LalbaghGlassHouse = makeCutout('cutouts/lalbagh-glass-house.jpg');
export const NammaMetro = makeCutout('cutouts/namma-metro.jpg');
export const MgRoadSignage = makeCutout('cutouts/mg-road-signage.jpg');

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

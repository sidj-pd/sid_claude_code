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
export const PotholeRoad = makeCutout('cutouts-alpha/pothole-road.png');
export const TrafficSignal = makeCutout('cutouts-alpha/traffic-signal.png');
export const MasalaDosa = makeCutout('cutouts-alpha/masala-dosa.png');
export const WorkBarricade = makeCutout('cutouts-alpha/work-barricade.png');
export const HailingHand = makeCutout('cutouts-alpha/hailing-hand.png');
export const AutoDriver34 = makeCutout('cutouts-alpha/auto-driver-34.png');
export const PassengerLeaning = makeCutout('cutouts-alpha/passenger-leaning.png');
export const DriverHandReach = makeCutout('cutouts-alpha/driver-hand-reach.png');
// Derived from auto-meter.jpg by scripts/split-meter.mjs, so the flag lever
// can rotate independently of the housing.
export const AutoMeterBody = makeCutout('cutouts-alpha/auto-meter-body.png');
export const AutoMeterLever = makeCutout('cutouts-alpha/auto-meter-lever.png');
export const NewspaperClipAutoUnion = makeCutout('cutouts-alpha/newspaper-clip-autounion.png');
export const NewspaperClipVictim = makeCutout('cutouts-alpha/newspaper-clip-victim.png');
export const NewspaperClipCommittee = makeCutout('cutouts-alpha/newspaper-clip-committee.png');

// Episode 02, Shot 1 — the leave request, late at night.
export const EmployeeDesk34 = makeCutout('cutouts-alpha/employee-desk-34.png');
// The same pose, smiling, for the beat after the reply lands. Registered
// against the original: head top at y=40 and right edge at x=632 in both, so
// a hard swap reads as a stop-motion pose change rather than a jump.
export const EmployeeDesk34Happy = makeCutout('cutouts-alpha/employee-desk-34-happy.png');
// Screen arrives empty: the form and the cursor are set in code, per the
// standing rule that no copy is ever baked into generated art.
export const LaptopScreen = makeCutout('cutouts-alpha/laptop-screen.png');
// Deliberately handless — the hands are drawn in code so the clock can tick.
// Measured off the keyed PNG: centre 0.5021/0.5017 of the frame, face radius
// 0.2267 of width, rim radius 0.3279.
export const WallClockFace = makeCutout('cutouts-alpha/wall-clock-face.png');
export const DeskLamp = makeCutout('cutouts-alpha/desk-lamp.png');
// Sits furthest back at elevation 0.4. Arrived more saturated than the rest
// (0.390 vs 0.327 for the figure), so the shot desaturates it at depth rather
// than competing with the man in front of it.
export const OfficeWindowNight = makeCutout('cutouts-alpha/office-window-night.png');

// Episode 02, Beat 6 and Beat 8. These three are cropped from source by
// scripts/crop-newspaper-clippings.mjs rather than keyed: NewsHeadline shows a
// clipping in a box with overflow hidden, so its outline is the box and the
// alpha is never used.
export const NewspaperClipManagers = makeCutout('cutouts-alpha/newspaper-clip-managers.png');
export const NewspaperClipOwnClaim = makeCutout('cutouts-alpha/newspaper-clip-ownclaim.png');
export const NewspaperClipHrCommittee = makeCutout('cutouts-alpha/newspaper-clip-hrcommittee.png');

// Episode 02, Beat 9 — the manager at his own desk, mirroring Beat 1.
export const ManagerDeskNight = makeCutout('cutouts-alpha/manager-desk-night.png');

export type CutoutAsset =
	| 'vidhana-soudha'
	| 'auto-rickshaw'
	| 'exhaust-puff'
	| 'it-park-building'
	| 'lalbagh-glass-house'
	| 'namma-metro'
	| 'mg-road-signage'
	| 'pothole-road'
	| 'traffic-signal'
	| 'masala-dosa'
	| 'work-barricade'
	| 'hailing-hand'
	| 'auto-driver-34'
	| 'passenger-leaning'
	| 'driver-hand-reach'
	| 'auto-meter-body'
	| 'auto-meter-lever'
	| 'newspaper-clip-autounion'
	| 'newspaper-clip-victim'
	| 'newspaper-clip-committee'
	| 'employee-desk-34'
	| 'employee-desk-34-happy'
	| 'laptop-screen'
	| 'wall-clock-face'
	| 'desk-lamp'
	| 'office-window-night'
	| 'newspaper-clip-managers'
	| 'newspaper-clip-ownclaim'
	| 'newspaper-clip-hrcommittee'
	| 'manager-desk-night';

export const CUTOUT_REGISTRY: Record<CutoutAsset, React.FC> = {
	'vidhana-soudha': VidhanaSoudha,
	'auto-rickshaw': AutoRickshaw,
	'exhaust-puff': ExhaustPuff,
	'it-park-building': ItParkBuilding,
	'lalbagh-glass-house': LalbaghGlassHouse,
	'namma-metro': NammaMetro,
	'mg-road-signage': MgRoadSignage,
	'pothole-road': PotholeRoad,
	'traffic-signal': TrafficSignal,
	'masala-dosa': MasalaDosa,
	'work-barricade': WorkBarricade,
	'hailing-hand': HailingHand,
	'auto-driver-34': AutoDriver34,
	'passenger-leaning': PassengerLeaning,
	'driver-hand-reach': DriverHandReach,
	'auto-meter-body': AutoMeterBody,
	'auto-meter-lever': AutoMeterLever,
	'newspaper-clip-autounion': NewspaperClipAutoUnion,
	'newspaper-clip-victim': NewspaperClipVictim,
	'newspaper-clip-committee': NewspaperClipCommittee,
	'employee-desk-34': EmployeeDesk34,
	'employee-desk-34-happy': EmployeeDesk34Happy,
	'laptop-screen': LaptopScreen,
	'wall-clock-face': WallClockFace,
	'desk-lamp': DeskLamp,
	'office-window-night': OfficeWindowNight,
	'newspaper-clip-managers': NewspaperClipManagers,
	'newspaper-clip-ownclaim': NewspaperClipOwnClaim,
	'newspaper-clip-hrcommittee': NewspaperClipHrCommittee,
	'manager-desk-night': ManagerDeskNight,
};

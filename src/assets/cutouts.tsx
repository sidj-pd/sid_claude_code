import React from 'react';

/**
 * Placeholder paper-cutout illustrations, flat-shape SVGs standing in for
 * the real newsprint-collage art listed in the asset checklist. Swap any
 * of these for a layered PNG/SVG cutout later without touching
 * <PaperCutout> — just point CUTOUT_REGISTRY[key] at the new component.
 */

const PALETTE = {
	sandstone: '#c9a877',
	sandstoneDark: '#a3844f',
	cream: '#efe4c8',
	ink: '#26211a',
	red: '#a83c2e',
	yellow: '#e0b23c',
	green: '#4c6b4a',
	metroBlue: '#3a5a78',
	metroPurple: '#5b4a78',
	glass: '#8fb3c4',
};

export const VidhanaSoudha: React.FC = () => (
	<svg viewBox="0 0 600 500" width="100%" height="100%">
		<rect x="40" y="320" width="520" height="140" fill={PALETTE.sandstone} />
		{Array.from({length: 9}).map((_, i) => (
			<rect
				key={i}
				x={60 + i * 58}
				y={180}
				width="22"
				height="180"
				fill={PALETTE.sandstoneDark}
			/>
		))}
		<rect x="20" y="150" width="560" height="34" fill={PALETTE.sandstone} />
		<path d="M250 150 L300 60 L350 150 Z" fill={PALETTE.sandstoneDark} />
		<ellipse cx="300" cy="150" rx="55" ry="20" fill={PALETTE.sandstone} />
		<rect x="296" y="40" width="8" height="24" fill={PALETTE.ink} />
		<rect x="0" y="455" width="600" height="20" fill={PALETTE.ink} opacity={0.2} />
	</svg>
);

export const AutoRickshaw: React.FC = () => (
	<svg viewBox="0 0 300 200" width="100%" height="100%">
		<path
			d="M40 150 L40 90 Q40 60 90 60 L190 60 Q220 60 220 100 L230 150 Z"
			fill={PALETTE.yellow}
		/>
		<rect x="55" y="70" width="80" height="55" fill={PALETTE.ink} opacity={0.15} />
		<circle cx="80" cy="165" r="26" fill={PALETTE.ink} />
		<circle cx="80" cy="165" r="10" fill="#555" />
		<circle cx="205" cy="165" r="26" fill={PALETTE.ink} />
		<circle cx="205" cy="165" r="10" fill="#555" />
		<rect x="20" y="140" width="24" height="16" fill={PALETTE.red} />
	</svg>
);

export const ExhaustPuff: React.FC = () => (
	<svg viewBox="0 0 100 100" width="100%" height="100%">
		<circle cx="30" cy="60" r="16" fill="#999" opacity={0.6} />
		<circle cx="55" cy="45" r="12" fill="#aaa" opacity={0.5} />
		<circle cx="70" cy="65" r="9" fill="#bbb" opacity={0.4} />
	</svg>
);

export const ItParkBuilding: React.FC = () => (
	<svg viewBox="0 0 500 600" width="100%" height="100%">
		<rect x="80" y="20" width="340" height="560" fill={PALETTE.glass} />
		{Array.from({length: 8}).map((_, row) =>
			Array.from({length: 5}).map((_, col) => {
				const gag = (row * 5 + col) % 7 === 0;
				return (
					<g key={`${row}-${col}`}>
						<rect
							x={100 + col * 62}
							y={45 + row * 66}
							width="50"
							height="50"
							fill={gag ? PALETTE.cream : '#5f8296'}
							stroke="#33566b"
							strokeWidth="1"
						/>
						{gag ? (
							<text
								x={125 + col * 62}
								y={73 + row * 66}
								fontSize="6"
								textAnchor="middle"
								fill={PALETTE.ink}
								fontFamily="Georgia, serif"
							>
								{(row + col) % 2 === 0 ? 'URGENT HIRING' : '2BHK AVAILABLE'}
							</text>
						) : null}
					</g>
				);
			}),
		)}
	</svg>
);

export const LalbaghGlassHouse: React.FC = () => (
	<svg viewBox="0 0 600 400" width="100%" height="100%">
		<rect x="40" y="220" width="520" height="150" fill={PALETTE.glass} opacity={0.7} />
		<path d="M40 220 L300 80 L560 220 Z" fill={PALETTE.glass} opacity={0.85} />
		{Array.from({length: 10}).map((_, i) => (
			<line
				key={i}
				x1={300}
				y1={80}
				x2={40 + i * 58}
				y2={220}
				stroke={PALETTE.ink}
				strokeWidth="2"
				opacity={0.5}
			/>
		))}
		<rect x="290" y="40" width="20" height="45" fill={PALETTE.ink} opacity={0.6} />
	</svg>
);

export const NammaMetro: React.FC = () => (
	<svg viewBox="0 0 700 220" width="100%" height="100%">
		<rect x="20" y="40" width="660" height="110" rx="18" fill={PALETTE.metroBlue} />
		<rect x="20" y="40" width="660" height="30" fill={PALETTE.metroPurple} />
		{Array.from({length: 9}).map((_, i) => (
			<rect
				key={i}
				x={45 + i * 72}
				y={80}
				width="50"
				height="38"
				rx="4"
				fill={PALETTE.glass}
			/>
		))}
		<circle cx="70" cy="170" r="18" fill={PALETTE.ink} />
		<circle cx="630" cy="170" r="18" fill={PALETTE.ink} />
	</svg>
);

export const MgRoadSignage: React.FC = () => (
	<svg viewBox="0 0 400 500" width="100%" height="100%">
		<rect x="185" y="120" width="16" height="380" fill={PALETTE.ink} opacity={0.7} />
		<rect x="60" y="60" width="280" height="90" fill={PALETTE.red} />
		<text
			x="200"
			y="118"
			fontSize="44"
			textAnchor="middle"
			fill={PALETTE.cream}
			fontFamily="Impact, 'Arial Narrow', sans-serif"
			letterSpacing="2"
		>
			MG ROAD
		</text>
	</svg>
);

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

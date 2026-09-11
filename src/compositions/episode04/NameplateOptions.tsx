import React from 'react';
import {AbsoluteFill} from 'remotion';
import {NewsprintTexture} from '../../components/NewsprintTexture';
import {tornPolygon} from '../../components/tornEdge';
import {BUTTER, BUTTER_DEEP, GANACHE} from '../../components/palette';
import {Ground} from './Ground';

/**
 * Six lower-third treatments, on one page, for the director to choose from.
 *
 * Not a shot. It exists so a decision about edge shape, palette and typeface
 * can be made by looking at the real faces at the real size, rather than from
 * a description — the woff2 files only exist inside the renderer, so a mock
 * built anywhere else would show the wrong type.
 *
 * Two things vary together deliberately: the torn edge and the near-cream card
 * are both inherited from Episodes 01-03, and the note that the palette "has
 * not changed" is really about the card, not the ink. #F6E7CB is a Butter tint
 * so pale it reads as the old cream. The options below move it properly.
 */

const NAME = 'WITNESS — NAME WITHHELD';
const ROLE = 'SURVIVOR, INCIDENT #0004';

const Label: React.FC<{children: React.ReactNode}> = ({children}) => (
	<div
		style={{
			fontFamily: 'RansomSpecialElite, monospace',
			fontSize: 26,
			letterSpacing: 2,
			color: GANACHE,
			opacity: 0.8,
			marginBottom: 10,
		}}
	>
		{children}
	</div>
);

type Opt = {
	key: string;
	note: string;
	paper: string;
	ink: string;
	sub: string;
	torn?: boolean;
	/** A rule down the left edge, broadcast-style. */
	bar?: string;
	/** A rule along the top edge. */
	rule?: string;
	border?: string;
	nameFont?: string;
};

const OPTIONS: Opt[] = [
	{
		key: 'A',
		note: 'TORN EDGE, CREAM CARD — what is in the cut now',
		paper: '#F6E7CB',
		ink: GANACHE,
		sub: 'rgba(67,48,42,0.75)',
		torn: true,
		rule: BUTTER,
	},
	{
		key: 'B',
		note: 'SQUARE CARD, BUTTER',
		paper: BUTTER,
		ink: GANACHE,
		sub: 'rgba(67,48,42,0.78)',
	},
	{
		key: 'C',
		note: 'GANACHE PLATE, BUTTER TYPE — matches the FUCO BANK sign',
		paper: GANACHE,
		ink: BUTTER,
		sub: 'rgba(238,202,143,0.78)',
		border: BUTTER_DEEP,
	},
	{
		key: 'D',
		note: 'GANACHE PLATE, BUTTER BAR DOWN THE EDGE',
		paper: GANACHE,
		ink: BUTTER,
		sub: 'rgba(238,202,143,0.78)',
		bar: BUTTER,
	},
	{
		key: 'E',
		note: 'BUTTER CARD, GANACHE BAR DOWN THE EDGE',
		paper: BUTTER,
		ink: GANACHE,
		sub: 'rgba(67,48,42,0.78)',
		bar: GANACHE,
	},
	{
		key: 'F',
		note: 'AS C, BUT THE NAME SET IN ARCHIVO BLACK',
		paper: GANACHE,
		ink: BUTTER,
		sub: 'rgba(238,202,143,0.78)',
		border: BUTTER_DEEP,
		nameFont: 'RansomArchivoBlack, sans-serif',
	},
];

const Card: React.FC<{opt: Opt}> = ({opt}) => (
	<div
		style={{
			position: 'relative',
			width: 880,
			background: opt.paper,
			padding: opt.bar ? '20px 32px 24px 46px' : '20px 32px 24px',
			clipPath: opt.torn ? tornPolygon({seed: 91, depth: 5, teeth: 16}) : undefined,
			border: opt.border ? `4px solid ${opt.border}` : undefined,
			boxShadow: '0 10px 22px rgba(20,13,9,0.45)',
		}}
	>
		{opt.bar ? (
			<div style={{position: 'absolute', left: 0, top: 0, bottom: 0, width: 14, background: opt.bar}} />
		) : null}
		{opt.rule ? (
			<div style={{position: 'absolute', left: 0, right: 0, top: 0, height: 8, background: opt.rule}} />
		) : null}
		<div
			style={{
				fontFamily: opt.nameFont ?? 'RansomAnton, sans-serif',
				fontSize: 52,
				letterSpacing: 1.5,
				color: opt.ink,
			}}
		>
			{NAME}
		</div>
		<div
			style={{
				marginTop: 6,
				fontFamily: 'RansomSpecialElite, monospace',
				fontSize: 27,
				lineHeight: 1.3,
				color: opt.sub,
			}}
		>
			{ROLE}
		</div>
		<NewsprintTexture opacity={0.16} />
	</div>
);

export const NameplateOptions: React.FC = () => (
	<AbsoluteFill>
		<Ground />
		<div style={{position: 'absolute', left: 84, top: 60}}>
			<div
				style={{
					fontFamily: 'RansomAnton, sans-serif',
					fontSize: 62,
					letterSpacing: 1,
					color: GANACHE,
					marginBottom: 30,
				}}
			>
				NAMEPLATE OPTIONS
			</div>
			{OPTIONS.map((opt) => (
				<div key={opt.key} style={{marginBottom: 40}}>
					<Label>
						{opt.key} · {opt.note}
					</Label>
					<Card opt={opt} />
				</div>
			))}
		</div>
	</AbsoluteFill>
);

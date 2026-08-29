import React from 'react';
import {PaperCutout} from '../../components/PaperCutout';
import {
	SCREEN_HEIGHT,
	SCREEN_LEFT,
	SCREEN_TOP,
	SCREEN_WIDTH,
} from './shot01/beats';

export type LaptopMessageProps = {
	/** Rendered width of the laptop cutout. Everything else derives from it. */
	cutoutW: number;
	/** SEND depressed, for the frames around the click. */
	pressed?: boolean;
	rotationDeg?: number;
	/** Cursor, reply chit — anything that sits over the screen. */
	children?: React.ReactNode;
};

/**
 * The laptop with the leave request on it.
 *
 * Shared because Shot 1 writes the message and Shot 2 punches back in on the
 * same screen to receive the reply — two shots, one piece of copy. Keeping it
 * in one place is the same reason the copy is in code at all (§5): it has to
 * be re-wordable in exactly one edit.
 *
 * Screen geometry comes from scripts/measure-laptop.mjs, consumed verbatim.
 */
export const LaptopMessage: React.FC<LaptopMessageProps> = ({
	cutoutW,
	pressed = false,
	rotationDeg = 0,
	children,
}) => {
	const cutoutH = cutoutW * (896 / 1200);
	const screenX = SCREEN_LEFT * cutoutW;
	const screenY = SCREEN_TOP * cutoutH;
	const screenW = SCREEN_WIDTH * cutoutW;
	const screenH = SCREEN_HEIGHT * cutoutH;

	const sheetX = screenX + screenW * 0.07;
	const sheetY = screenY + screenH * 0.09;
	const sheetW = screenW * 0.86;
	const sheetH = screenH * 0.82;

	const sendW = sheetW * 0.26;
	const sendH = sheetH * 0.15;
	const sendX = sheetX + sheetW - sendW - sheetW * 0.05;
	const sendY = sheetY + sheetH - sendH - sheetH * 0.07;

	return (
		<div
			style={{
				position: 'absolute',
				left: '50%',
				top: '50%',
				width: cutoutW,
				height: cutoutH,
				marginLeft: -cutoutW / 2,
				marginTop: -cutoutH / 2,
				transform: `rotate(${rotationDeg}deg)`,
			}}
		>
			<PaperCutout asset="laptop-screen" textureOpacity={0} elevation={1.3} />

			{/* The leave request. A pale sheet on the dark panel — a document,
			    not software chrome, which keeps the paper world intact at the
			    exact moment the incident is being established. He volunteers to
			    keep an eye on Teams, which is what makes the manager's reply in
			    Shot 2 land. Neither man is named: Beats 4 and 6 both caption him
			    NAME WITHHELD, and a name here would contradict the testimony. */}
			<div
				style={{
					position: 'absolute',
					left: sheetX,
					top: sheetY,
					width: sheetW,
					height: sheetH,
					background: '#ece4cf',
					border: '2px solid #1b1e24',
					padding: sheetH * 0.07,
					boxSizing: 'border-box',
					display: 'flex',
					flexDirection: 'column',
					gap: sheetH * 0.05,
					fontFamily: 'RansomSpecialElite, monospace',
					color: '#26292f',
					transform: 'rotate(-0.4deg)',
				}}
			>
				<div
					style={{
						fontSize: sheetH * 0.072,
						letterSpacing: 1.5,
						borderBottom: '2px solid #26292f',
						paddingBottom: sheetH * 0.035,
					}}
				>
					LEAVE REQUEST — 12–16 SEPT
				</div>
				<div
					style={{
						fontSize: sheetH * 0.05,
						lineHeight: 1.5,
						opacity: 0.88,
						paddingRight: sheetW * 0.02,
					}}
				>
					Wanted to check if I could take leave from the 12th to the 16th.
					<br />
					Happy to hand over anything pending before I go — and I&apos;ll keep an
					eye on Teams if anything urgent comes up.
					<br />
					Thanks.
				</div>
			</div>

			<div
				style={{
					position: 'absolute',
					left: sendX,
					top: sendY,
					width: sendW,
					height: sendH,
					background: pressed ? '#cfc4a8' : '#e6dcc0',
					border: '2px solid #2b2f36',
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					transform: `rotate(-1.2deg) translateY(${pressed ? 2 : 0}px)`,
					fontFamily: 'RansomSpecialElite, monospace',
					fontSize: sendH * 0.42,
					letterSpacing: 3,
					color: '#2b2f36',
				}}
			>
				SEND
			</div>

			{children}
		</div>
	);
};

/** Where the SEND chit lands, for a shot that needs to aim a cursor at it. */
export const sendChitBox = (cutoutW: number) => {
	const cutoutH = cutoutW * (896 / 1200);
	const screenX = SCREEN_LEFT * cutoutW;
	const screenY = SCREEN_TOP * cutoutH;
	const screenW = SCREEN_WIDTH * cutoutW;
	const screenH = SCREEN_HEIGHT * cutoutH;
	const sheetX = screenX + screenW * 0.07;
	const sheetY = screenY + screenH * 0.09;
	const sheetW = screenW * 0.86;
	const sheetH = screenH * 0.82;
	const w = sheetW * 0.26;
	const h = sheetH * 0.15;
	return {
		x: sheetX + sheetW - w - sheetW * 0.05,
		y: sheetY + sheetH - h - sheetH * 0.07,
		w,
		h,
		screenX,
		screenY,
		screenW,
		screenH,
	};
};

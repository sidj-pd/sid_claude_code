import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {EvidenceStamp} from '../../../components/EvidenceStamp';
import {Footage} from '../../../components/Footage';
import {SAFE_BOTTOM_Y} from '../../../components/safeArea';
import {ChecklistItem} from '../../episode01/shot06/Checklist';
import {
	ADVISORY_IN,
	CLOSER_IN,
	CONDITIONS,
	INSTRUCTIONS,
	SRC_IN,
} from './beats';

const CLAMP = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const PAPER = '#efe4c8';
const INK = '#241d15';

const PSA_DESCRIPTION =
	'The sign-off, on a video call with headphones.\nVertical, photoreal, with its own dialogue.';

/** Left column, in the plain dark band of his jacket and the laptop below it. */
const X = 84;
const W = 850;
const ADVISORY_Y = 752;
const COND_Y = 838;
const COND_H = 76;
const COND_GAP = 10;
const INSTR_Y = 1044;
const INSTR_STEP = 70;
const CLOSER_Y = 1276;

/**
 * One instruction: a stamped line, not a chit.
 *
 * A chit is a record of something that happened — that is what the witness's
 * checklist and the expert's findings are. These are being told to the viewer,
 * so they are set as type with a stroke, legible over both the dark jacket and
 * the pale laptop without a backing panel dimming either.
 */
const Instruction: React.FC<{text: string; age: number}> = ({text, age}) => {
	if (age < 0) return null;
	return (
		<div
			style={{
				fontFamily: 'RansomAnton, sans-serif',
				fontSize: 46,
				letterSpacing: 1.5,
				lineHeight: 1.2,
				color: PAPER,
				textShadow: [
					'0 0 8px rgba(20,14,8,0.85)',
					'2px 2px 0 #1b140d',
					'-2px 2px 0 #1b140d',
					'2px -2px 0 #1b140d',
					'-2px -2px 0 #1b140d',
				].join(', '),
				opacity: interpolate(age, [0, 2], [0, 1], CLAMP),
				// Stamped rather than faded: over-scaled on the frame it lands.
				transform: `scale(${age < 2 ? 1.06 : 1}) translateX(${interpolate(age, [0, 3], [-14, 0], CLAMP)}px)`,
				transformOrigin: 'left center',
			}}
		>
			{text}
		</div>
	);
};

/**
 * Shot 7 — The Sign-off.
 *
 * The advisory is set on screen as well as spoken, because the joke is the
 * apparatus: a public-information notice issued about a manager being pleasant.
 * The two conditions are tick-box chits — the viewer invited to check their own
 * experience against them — and the three instructions are stamped lines,
 * because a chit records something that happened and an instruction is given.
 *
 * "YOU ARE NOT ALONE" lands last and largest, and nothing follows it. It is
 * reassurance that is not reassuring, and the frame should let it sit.
 */
export const Shot07Psa: React.FC = () => {
	const frame = useCurrentFrame();

	return (
		<AbsoluteFill style={{backgroundColor: '#0c0e11'}}>
			<Footage
				id="ep02-correspondent-psa"
				description={PSA_DESCRIPTION}
				trimBeforeInFrames={SRC_IN}
			/>

			{frame >= ADVISORY_IN ? (
				<div style={{position: 'absolute', left: X, top: ADVISORY_Y}}>
					<EvidenceStamp
						text="PUBLIC ADVISORY"
						age={frame - ADVISORY_IN}
						fontSize={34}
						rotate={-1.5}
						color="#d8563a"
						style={{background: 'rgba(12,10,8,0.5)'}}
					/>
				</div>
			) : null}

			{CONDITIONS.map((c, i) => (
				<div
					key={c.text}
					style={{position: 'absolute', left: X, top: COND_Y + i * (COND_H + COND_GAP)}}
				>
					<ChecklistItem
						text={c.text}
						age={frame - c.in}
						tickAge={frame - c.tick}
						width={W}
						height={COND_H}
						seed={110 + i * 6}
					/>
				</div>
			))}

			{INSTRUCTIONS.map((ins, i) => (
				<div
					key={ins.text}
					style={{position: 'absolute', left: X, top: INSTR_Y + i * INSTR_STEP}}
				>
					<Instruction text={ins.text} age={frame - ins.at} />
				</div>
			))}

			{frame >= CLOSER_IN ? (
				<div style={{position: 'absolute', left: X, top: CLOSER_Y}}>
					<div
						style={{
							display: 'inline-block',
							background: PAPER,
							border: `4px solid ${INK}`,
							padding: '16px 30px 18px',
							fontFamily: 'RansomAnton, sans-serif',
							fontSize: 68,
							letterSpacing: 2,
							color: INK,
							boxShadow: '0 12px 24px rgba(12,10,8,0.55)',
							transform: `rotate(-1.2deg) scale(${frame - CLOSER_IN < 2 ? 1.08 : 1})`,
							opacity: interpolate(frame - CLOSER_IN, [0, 2], [0, 1], CLAMP),
						}}
					>
						YOU ARE NOT ALONE
					</div>
				</div>
			) : null}
		</AbsoluteFill>
	);
};

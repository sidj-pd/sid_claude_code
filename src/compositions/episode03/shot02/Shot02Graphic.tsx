import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {CollageBackdrop} from '../../../components/CollageBackdrop';
import {ArrowTag, EvidenceStamp} from '../../../components/EvidenceStamp';
import {NewsprintTexture} from '../../../components/NewsprintTexture';
import {tornPolygon} from '../../../components/tornEdge';
import {SAFE_BOTTOM_Y, safeTop} from '../../../components/safeArea';
import {useStopMotionStep} from '../../../components/useStopMotionStep';
import {VoiceOver} from '../../../components/VoiceOver';
import {INK, MARK, StatBar} from '../../episode01/shot05/StatBar';
import {
	BAR1_STARTS,
	BAR2_STARTS,
	BAR_2_GROW,
	BAR_GROW,
	CALLOUT_IN,
	CAP1_IN,
	CAP2_IN,
	FOOTNOTE_IN,
	HEADER_IN,
	HEADER_STAMP,
	NUM1_STAMP,
	NUM2_STAMP,
	REMAINDER1_IN,
	REMAINDER2_IN,
	SLIVER_MOVE,
	SLIVER_MOVE_FRAMES,
	STEP,
	SUBHEAD_IN,
	TAG_STAMP,
	VO_A_STARTS,
	VO_B_STARTS,
	VO_C_STARTS,
} from './beats';

const CLAMP = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

/** The survey's two findings. */
const RETURNED_STANDARD = 0.98;
const TAKES_SIX_MONTHS = 0.85;

// One column, spread deep enough down the frame that the page fills a 9:16
// crop. Same grid as Episodes 01 and 02 — where a beat has a twin, it gets
// the twin's treatment.
const BAR_X = 84;
const BAR_W = 912;
const BAR_H = 196;

// Nothing here may be set below SAFE_BOTTOM_Y (1536): the platforms cover the
// bottom fifth with the handle, caption and action rail. See safeArea.ts.
const HEADER_Y = 150;
const BAR1_Y = 520;
const BAR2_Y = 980;
const TAG_Y = 1340;
/** Same grid position as Episodes 01 and 02 — checked, not assumed, that it
 *  still clears both neighbours: at fontSize 40 "THIS LANDLORD" runs to
 *  x=1031 (40px inside the frame's 1080), and the footnote line ends at
 *  x=600, 40px clear of this stamp's left edge. */
const TAG_X = 640;
/** "THIS LANDLORD" is longer than "THIS RIDE" or "THIS REQUEST" — sized down
 *  from the 46 those used so it stays one line and clear of the arrow. */
const TAG_SIZE = 40;
const FOOTNOTE_Y = 1352;
/** Page furniture, pinned to the last legible line in the frame. */
const SOURCE_H = 64;
const SOURCE_Y = safeTop(SOURCE_H) - 12;

/** Where the leftover 2% of the first bar sits, before it becomes the second. */
const SLIVER_X = BAR_X + RETURNED_STANDARD * BAR_W;
const SLIVER_W = BAR_W * (1 - RETURNED_STANDARD);

const useSteppedGrowth = (frame: number, start: number, duration: number): number => {
	const {steppedFrame} = useStopMotionStep(Math.max(0, frame - start), STEP);
	return interpolate(steppedFrame, [0, duration], [0, 1], CLAMP);
};

/**
 * The figure for a leftover block, set above it rather than inside it. At two
 * percent of the bar the block is 18px wide — there is no inside to put a
 * number in, same reasoning as Episode 01's 9% and Episode 02's 11%.
 */
const RemainderLabel: React.FC<{text: string; age: number; top: number}> = ({text, age, top}) => {
	if (age < 0) return null;
	return (
		<div
			style={{
				position: 'absolute',
				right: 84,
				top,
				fontFamily: 'RansomArchivoBlack, sans-serif',
				fontSize: 50,
				lineHeight: 1,
				color: MARK,
				opacity: interpolate(age, [0, 2], [0, 1], CLAMP),
				transform: `translateY(${interpolate(age, [0, 3], [12, 0], CLAMP)}px)`,
			}}
		>
			{text}
		</div>
	);
};

const Caption: React.FC<{text: string; age: number; size?: number; color?: string}> = ({
	text,
	age,
	size = 54,
	color = INK,
}) => {
	if (age < 0) return null;
	return (
		<div
			style={{
				fontFamily: 'RansomAnton, sans-serif',
				fontSize: size,
				letterSpacing: 1.5,
				color,
				whiteSpace: 'nowrap',
				opacity: interpolate(age, [0, 2], [0, 1], CLAMP),
				transform: `translateY(${interpolate(age, [0, 3], [10, 0], CLAMP)}px)`,
			}}
		>
			{text}
		</div>
	);
};

/**
 * Shot 2 — The Stat Card.
 *
 * The two statistics are one object, not two — same argument as Episodes 01
 * and 02's stat cards. The 2% left over from the first bar (deposits NOT
 * returned with the standard deduction) is drawn as its own outlined block,
 * then expands into the whole width of the second bar (85% of that 2% take
 * over six months), with ruled lines running from its corners to the new
 * bar's. The 2% is not a separate claim about a separate population; it is
 * the same 2% being looked at more closely.
 *
 * What survives at the end is 15% of 2% — 0.3% of all deposits, and the case
 * this episode is about: a landlord who is technically part of the "problem"
 * 2% (someone whose deposit was NOT returned by the standard one-month
 * process) but who did not take six months either. The cliffhanger — "this
 * landlord shouldn't exist" — goes up as a picture a beat before the
 * narrator states it as a line, the same ordering as THIS RIDE / THIS
 * REQUEST before it.
 */
export const Shot02Graphic: React.FC<{silent?: boolean}> = ({silent = false}) => {
	const frame = useCurrentFrame();

	const bar1 = useSteppedGrowth(frame, BAR1_STARTS, BAR_GROW) * RETURNED_STANDARD;
	const bar2 = useSteppedGrowth(frame, BAR2_STARTS, BAR_2_GROW) * TAKES_SIX_MONTHS;

	// The leftover's journey to becoming the second bar. Stepped like
	// everything else, so it hops down the page rather than gliding.
	const {steppedFrame: moveStep} = useStopMotionStep(Math.max(0, frame - SLIVER_MOVE), STEP);
	const move = interpolate(moveStep, [0, SLIVER_MOVE_FRAMES], [0, 1], CLAMP);
	const moving = frame >= SLIVER_MOVE;
	const bar2X = interpolate(move, [0, 1], [SLIVER_X, BAR_X]);
	const bar2Y = interpolate(move, [0, 1], [BAR1_Y, BAR2_Y]);
	const bar2W = interpolate(move, [0, 1], [SLIVER_W, BAR_W]);

	/** The last 15% of 2%: the landlord this case is about. */
	const remainderX = bar2X + bar2W * TAKES_SIX_MONTHS;

	/**
	 * The page breathes. Barely — a pixel and a fraction of a degree, on a slow
	 * step grid. The script asks for the card to be held frozen while the
	 * narrator finishes, and a genuinely frozen frame stops reading as a held
	 * shot and starts reading as a stalled render.
	 */
	const {stepIndex: breath} = useStopMotionStep(frame, 9);
	const drift = `translate(${(breath % 3) - 1}px, ${(breath % 2) * 1.2 - 0.6}px) rotate(${
		((breath % 4) - 1.5) * 0.06
	}deg)`;

	return (
		<AbsoluteFill>
			<CollageBackdrop chaos={0.12} />
			{/* Ruled like a form, so the frame reads as a document rather than as
			    a slide. Faint enough to sit under everything. */}
			<AbsoluteFill
				style={{
					backgroundImage:
						'repeating-linear-gradient(180deg, transparent 0 46px, rgba(36,29,21,0.055) 46px 47px)',
				}}
			/>

			<AbsoluteFill style={{transform: drift}}>
				{frame >= HEADER_IN ? (
					<div style={{position: 'absolute', left: BAR_X, top: HEADER_Y, width: BAR_W}}>
						<div
							style={{
								background: '#efe4c8',
								padding: '34px 40px 40px',
								clipPath: tornPolygon({seed: 3, depth: 4, teeth: 15}),
								boxShadow: '0 8px 18px rgba(48,34,18,0.22)',
								position: 'relative',
							}}
						>
							<div
								style={{
									fontFamily: 'RansomAnton, sans-serif',
									fontSize: 96,
									lineHeight: 0.96,
									letterSpacing: 1,
									color: INK,
								}}
							>
								SECURITY DEPOSITS
								<br />
								SURVEYED
							</div>
							{frame >= SUBHEAD_IN ? (
								<div
									style={{
										marginTop: 18,
										fontFamily: 'RansomSpecialElite, monospace',
										fontSize: 32,
										color: 'rgba(36,29,21,0.72)',
									}}
								>
									n = 2,310 · METHODOLOGY UNAVAILABLE
								</div>
							) : null}
							<NewsprintTexture opacity={0.18} />
						</div>

						<div style={{position: 'absolute', right: -26, top: -62}}>
							<EvidenceStamp
								text={'EXHIBIT\nA'}
								age={frame - HEADER_STAMP}
								fontSize={40}
								rotate={7}
							/>
						</div>
					</div>
				) : null}

				{/* The ruled lines that say "this piece, enlarged". They open out of
				    the leftover block as it travels, so the two bars are never two
				    separate graphics that happen to share a page. */}
				{moving ? (
					<svg
						width={1080}
						height={1920}
						style={{position: 'absolute', left: 0, top: 0, pointerEvents: 'none'}}
					>
						{[
							[SLIVER_X, bar2X],
							[SLIVER_X + SLIVER_W, bar2X + bar2W],
						].map(([from, to]) => (
							<line
								key={from}
								x1={from}
								y1={BAR1_Y + BAR_H}
								x2={to}
								y2={bar2Y}
								stroke={MARK}
								strokeWidth={4}
								strokeDasharray="14 10"
								opacity={0.85}
							/>
						))}
					</svg>
				) : null}

				{/* Claim one. The empty outline arrives a few frames ahead of the
				    fill, so the bar is a thing being measured rather than a thing
				    that appears already measured. */}
				{frame >= BAR1_STARTS - 6 ? (
					<div style={{position: 'absolute', left: BAR_X, top: BAR1_Y}}>
						<StatBar
							width={BAR_W}
							height={BAR_H}
							fill={bar1}
							label="98%"
							labelAge={frame - NUM1_STAMP}
							remainderLabel="2%"
							remainderAge={frame - REMAINDER1_IN}
							remainderTaken={moving}
							remainderLabelInside={false}
							seed={5}
						/>
					</div>
				) : null}
				<div style={{position: 'absolute', left: BAR_X, top: BAR1_Y + BAR_H + 26}}>
					<Caption text="RETURNED WITH STANDARD DEDUCTION" age={frame - CAP1_IN} />
				</div>
				<RemainderLabel text="2%" age={frame - REMAINDER1_IN} top={BAR1_Y - 62} />

				{/* Claim two — the same 2%, enlarged. */}
				{moving ? (
					<>
						<div style={{position: 'absolute', left: bar2X, top: bar2Y}}>
							<StatBar
								width={bar2W}
								height={BAR_H}
								fill={bar2}
								label={move >= 1 ? '85%' : undefined}
								labelAge={frame - NUM2_STAMP}
								remainderLabel={move >= 1 ? '15%' : undefined}
								remainderAge={frame - REMAINDER2_IN}
								// 15% of BAR_W is 137px, over the height*0.5 cutoff
								// StatBar uses to decide whether the figure also fits
								// inside the block — the exact case remainderLabelInside
								// was added for at Episode 01's 11%. Without this the
								// render showed "15%" twice: once above, once inside the
								// pink block.
								remainderLabelInside={false}
								seed={11}
							/>
						</div>
						{move >= 1 ? (
							<>
								<div style={{position: 'absolute', left: BAR_X, top: BAR2_Y - 62}}>
									<Caption
										text="OF THE REMAINING 2% —"
										age={frame - CALLOUT_IN}
										size={44}
										color={MARK}
									/>
								</div>
								<div style={{position: 'absolute', left: BAR_X, top: BAR2_Y + BAR_H + 26}}>
									<Caption text="TAKE OVER 6 MONTHS TO PAY" age={frame - CAP2_IN} />
								</div>
								<RemainderLabel text="15%" age={frame - REMAINDER2_IN} top={BAR2_Y - 60} />
							</>
						) : null}
					</>
				) : null}

				{/* What is left. At fifteen percent of two percent there is nowhere
				    on the bar itself to put a label, so the arrow runs up to it
				    from a tag below — same device as Episodes 01 and 02. */}
				{frame >= TAG_STAMP ? (
					<>
						<div style={{position: 'absolute', left: remainderX - 132, top: BAR2_Y + BAR_H + 18}}>
							<ArrowTag age={frame - TAG_STAMP} length={148} />
						</div>
						<div style={{position: 'absolute', left: TAG_X, top: TAG_Y}}>
							<EvidenceStamp
								text="THIS LANDLORD"
								age={frame - TAG_STAMP - 6}
								fontSize={TAG_SIZE}
								rotate={-4}
							/>
						</div>
						{frame >= FOOTNOTE_IN ? (
							<div
								style={{
									position: 'absolute',
									left: BAR_X,
									top: FOOTNOTE_Y,
									fontFamily: 'RansomSpecialElite, monospace',
									fontSize: 28,
									letterSpacing: 1,
									color: 'rgba(36,29,21,0.78)',
								}}
							>
								0.3% OF ALL SECURITY DEPOSITS
							</div>
						) : null}
					</>
				) : null}

				{frame >= SUBHEAD_IN ? (
					<div
						style={{
							position: 'absolute',
							left: BAR_X,
							top: SOURCE_Y,
							width: BAR_W,
							background: '#e6dabb',
							padding: '16px 28px',
							clipPath: tornPolygon({seed: 21, depth: 5, teeth: 15}),
							fontFamily: 'RansomSpecialElite, monospace',
							fontSize: 26,
							letterSpacing: 1,
							color: 'rgba(36,29,21,0.7)',
						}}
					>
						SOURCE: BIZZARO BANGALORE FIELD UNIT · FILE 03
						<NewsprintTexture opacity={0.16} />
					</div>
				) : null}
			</AbsoluteFill>

			{/* Shot 3 opens by tearing this page apart, and renders it frozen to do
			    so. A frozen frame holding audio would fight the shot it is being
			    torn out of, so the tear asks for it silent. */}
			{silent ? null : (
				<>
					<VoiceOver id="ep03-shot02a" from={VO_A_STARTS} />
					<VoiceOver id="ep03-shot02b" from={VO_B_STARTS} />
					<VoiceOver id="ep03-shot02c" from={VO_C_STARTS} />
				</>
			)}
		</AbsoluteFill>
	);
};

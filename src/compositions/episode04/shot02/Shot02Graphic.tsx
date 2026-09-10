import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {ArrowTag, EvidenceStamp} from '../../../components/EvidenceStamp';
import {NewsprintTexture} from '../../../components/NewsprintTexture';
import {tornPolygon} from '../../../components/tornEdge';
import {safeTop} from '../../../components/safeArea';
import {useStopMotionStep} from '../../../components/useStopMotionStep';
import {VoiceOver} from '../../../components/VoiceOver';
import {BUTTER, GANACHE, GANACHE_DEEP} from '../../../components/palette';
import {StatBar} from '../../episode01/shot05/StatBar';
import {Ground} from '../Ground';
import {Clock} from './Clock';
import {
	BAR1_STARTS,
	BAR2_STARTS,
	BAR_2_GROW,
	BAR_GROW,
	BLACKOUT,
	CALLOUT_IN,
	CAP1_IN,
	CAP2_IN,
	CLOCK_IN,
	FOOTNOTE_IN,
	HANDS_IN,
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
	VO_D_STARTS,
	WEDGE_IN,
	WINDOW_STAMP,
	WIPE,
	WIPE_FRAMES,
} from './beats';

const CLAMP = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

/** The survey's two findings. */
const TURNED_AWAY = 0.96;
const COME_BACK = 0.89;

/**
 * Episode 04's paper. The bars and blocks are still paper — the Aruba is the
 * DESK the page is lying on, not the page — so the card keeps a light stock,
 * pulled slightly warm so it does not read as white against the aqua.
 */
const CARD = '#F3EAD8';
const CARD_DEEP = '#E7DAC0';
const PALETTE = {ink: GANACHE, paper: CARD, mark: BUTTER};

// One column, same grid as Episodes 01, 02 and 03.
const BAR_X = 84;
const BAR_W = 912;
const BAR_H = 196;
const HEADER_Y = 150;
const BAR1_Y = 520;
const BAR2_Y = 980;
const TAG_Y = 1340;
/** "THIS COUNTER" is shorter than Episode 03's "THIS LANDLORD", so it takes
 *  the 46 Episodes 01 and 02 use rather than 03's sized-down 40. */
const TAG_X = 656;
const TAG_SIZE = 46;
const FOOTNOTE_Y = 1352;
const SOURCE_H = 64;
const SOURCE_Y = safeTop(SOURCE_H) - 12;

const SLIVER_X = BAR_X + TURNED_AWAY * BAR_W;
const SLIVER_W = BAR_W * (1 - TURNED_AWAY);

const useSteppedGrowth = (frame: number, start: number, duration: number): number => {
	const {steppedFrame} = useStopMotionStep(Math.max(0, frame - start), STEP);
	return interpolate(steppedFrame, [0, duration], [0, 1], CLAMP);
};

/**
 * The figure for a leftover block, set above it rather than inside it. At four
 * percent of the bar the block is 36px wide — there is no inside to put a
 * number in, the same reasoning as Episode 01's 9%, Episode 02's 11% and
 * Episode 03's 2%.
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
				color: BUTTER,
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
	color = GANACHE,
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
 * The two statistics are one object, not two — the same argument Episodes 01,
 * 02 and 03 make. The 4% left over from the first bar (visits that were NOT
 * turned away) is drawn as its own outlined block, then expands into the whole
 * width of the second bar (89% of that 4% told to come back after 3:30), with
 * ruled lines running from its corners to the new bar's. The 4% is not a
 * separate claim about a separate population; it is the same 4% looked at
 * more closely.
 *
 * What survives is 11% of 4% — 0.4% of all lunch-hour visits, and the case
 * this episode is about.
 *
 * Then the page turns. The script's last two lines are about a thirty-minute
 * window between "come back after 3:30" and a bank that shuts at 4, and no
 * bar can show a window, so the bars wipe and a clock takes the page.
 */
export const Shot02Graphic: React.FC<{silent?: boolean}> = ({silent = false}) => {
	const frame = useCurrentFrame();

	const bar1 = useSteppedGrowth(frame, BAR1_STARTS, BAR_GROW) * TURNED_AWAY;
	const bar2 = useSteppedGrowth(frame, BAR2_STARTS, BAR_2_GROW) * COME_BACK;

	// The leftover's journey to becoming the second bar. Stepped like
	// everything else, so it hops down the page rather than gliding.
	const {steppedFrame: moveStep} = useStopMotionStep(Math.max(0, frame - SLIVER_MOVE), STEP);
	const move = interpolate(moveStep, [0, SLIVER_MOVE_FRAMES], [0, 1], CLAMP);
	const moving = frame >= SLIVER_MOVE;
	const bar2X = interpolate(move, [0, 1], [SLIVER_X, BAR_X]);
	const bar2Y = interpolate(move, [0, 1], [BAR1_Y, BAR2_Y]);
	const bar2W = interpolate(move, [0, 1], [SLIVER_W, BAR_W]);

	/** The last 11% of 4%: the counter this case is about. */
	const remainderX = bar2X + bar2W * COME_BACK;

	/**
	 * The page breathes. Barely — a pixel and a fraction of a degree, on a slow
	 * step grid. The card is held frozen while the narrator finishes, and a
	 * genuinely frozen frame stops reading as a held shot and starts reading as
	 * a stalled render.
	 */
	const {stepIndex: breath} = useStopMotionStep(frame, 9);
	const drift = `translate(${(breath % 3) - 1}px, ${(breath % 2) * 1.2 - 0.6}px) rotate(${
		((breath % 4) - 1.5) * 0.06
	}deg)`;

	const wipe = interpolate(frame, [WIPE, WIPE + WIPE_FRAMES], [0, 1], CLAMP);
	const onClock = frame >= CLOCK_IN;
	const hands = useSteppedGrowth(frame, HANDS_IN, 14);
	const wedge = useSteppedGrowth(frame, WEDGE_IN, 12);

	return (
		<AbsoluteFill>
			<Ground />
			{/* Ruled like a form, so the frame reads as a document rather than as
			    a slide. Faint enough to sit under everything. */}
			<AbsoluteFill
				style={{
					backgroundImage:
						'repeating-linear-gradient(180deg, transparent 0 46px, rgba(36,24,18,0.06) 46px 47px)',
				}}
			/>

			{!onClock ? (
				<AbsoluteFill style={{transform: drift}}>
					{frame >= HEADER_IN ? (
						<div style={{position: 'absolute', left: BAR_X, top: HEADER_Y, width: BAR_W}}>
							<div
								style={{
									background: CARD,
									padding: '34px 40px 40px',
									clipPath: tornPolygon({seed: 3, depth: 4, teeth: 15}),
									boxShadow: '0 8px 18px rgba(36,24,18,0.24)',
									position: 'relative',
								}}
							>
								<div
									style={{
										fontFamily: 'RansomAnton, sans-serif',
										fontSize: 96,
										lineHeight: 0.96,
										letterSpacing: 1,
										color: GANACHE,
									}}
								>
									LUNCH-HOUR VISITS
									<br />
									SURVEYED
								</div>
								{frame >= SUBHEAD_IN ? (
									<div
										style={{
											marginTop: 18,
											fontFamily: 'RansomSpecialElite, monospace',
											fontSize: 32,
											color: 'rgba(36,24,18,0.72)',
										}}
									>
										n = 2,940 · METHODOLOGY UNAVAILABLE
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
									color={GANACHE}
								/>
							</div>
						</div>
					) : null}

					{/* The ruled lines that say "this piece, enlarged". They open out
					    of the leftover block as it travels, so the two bars are never
					    two separate graphics that happen to share a page. */}
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
									stroke={BUTTER}
									strokeWidth={4}
									strokeDasharray="14 10"
									opacity={0.9}
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
								label="96%"
								labelAge={frame - NUM1_STAMP}
								remainderLabel="4%"
								remainderAge={frame - REMAINDER1_IN}
								remainderTaken={moving}
								remainderLabelInside={false}
								seed={5}
								{...PALETTE}
							/>
						</div>
					) : null}
					<div style={{position: 'absolute', left: BAR_X, top: BAR1_Y + BAR_H + 26}}>
						<Caption text="TURNED AWAY" age={frame - CAP1_IN} />
					</div>
					<RemainderLabel text="4%" age={frame - REMAINDER1_IN} top={BAR1_Y - 62} />

					{/* Claim two — the same 4%, enlarged. */}
					{moving ? (
						<>
							<div style={{position: 'absolute', left: bar2X, top: bar2Y}}>
								<StatBar
									width={bar2W}
									height={BAR_H}
									fill={bar2}
									label={move >= 1 ? '89%' : undefined}
									labelAge={frame - NUM2_STAMP}
									remainderLabel={move >= 1 ? '11%' : undefined}
									remainderAge={frame - REMAINDER2_IN}
									// 11% of BAR_W is 100px, over the height*0.5 cutoff
									// StatBar uses to decide whether the figure also fits
									// inside the block. Without this the render shows
									// "11%" twice: once above, once inside.
									remainderLabelInside={false}
									seed={11}
									{...PALETTE}
								/>
							</div>
							{move >= 1 ? (
								<>
									<div style={{position: 'absolute', left: BAR_X, top: BAR2_Y - 62}}>
										<Caption
											text="OF THE 4% ENTERTAINED —"
											age={frame - CALLOUT_IN}
											size={44}
											color={BUTTER}
										/>
									</div>
									<div style={{position: 'absolute', left: BAR_X, top: BAR2_Y + BAR_H + 26}}>
										<Caption text={'TOLD TO COME BACK AFTER 3:30'} age={frame - CAP2_IN} />
									</div>
									<RemainderLabel text="11%" age={frame - REMAINDER2_IN} top={BAR2_Y - 60} />
								</>
							) : null}
						</>
					) : null}

					{/* What is left. At eleven percent of four percent there is
					    nowhere on the bar itself to put a label, so the arrow runs
					    up to it from a tag below — same device as Episodes 01-03. */}
					{frame >= TAG_STAMP ? (
						<>
							<div style={{position: 'absolute', left: remainderX - 132, top: BAR2_Y + BAR_H + 18}}>
								<ArrowTag age={frame - TAG_STAMP} length={148} />
							</div>
							<div style={{position: 'absolute', left: TAG_X, top: TAG_Y}}>
								<EvidenceStamp
									text="THIS COUNTER"
									age={frame - TAG_STAMP - 6}
									fontSize={TAG_SIZE}
									rotate={-4}
									color={GANACHE}
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
										color: 'rgba(36,24,18,0.8)',
									}}
								>
									0.4% OF ALL LUNCH-HOUR VISITS
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
								background: CARD_DEEP,
								padding: '16px 28px',
								clipPath: tornPolygon({seed: 21, depth: 5, teeth: 15}),
								fontFamily: 'RansomSpecialElite, monospace',
								fontSize: 26,
								letterSpacing: 1,
								color: 'rgba(36,24,18,0.74)',
							}}
						>
							SOURCE: BIZZARO BANGALORE FIELD UNIT · FILE 04
							<NewsprintTexture opacity={0.16} />
						</div>
					) : null}
				</AbsoluteFill>
			) : (
				<AbsoluteFill style={{transform: drift}}>
					<div
						style={{
							position: 'absolute',
							left: BAR_X,
							top: 300,
							fontFamily: 'RansomAnton, sans-serif',
							fontSize: 88,
							lineHeight: 0.96,
							letterSpacing: 1,
							color: GANACHE,
						}}
					>
						YOUR WINDOW
					</div>

					<div style={{position: 'absolute', left: 60, top: 520}}>
						<Clock size={960} hands={hands} wedge={wedge} />
					</div>

					{frame >= WINDOW_STAMP ? (
						<div style={{position: 'absolute', left: BAR_X, top: 1520}}>
							<EvidenceStamp
								text="3:30 — 4:00 · THIRTY MINUTES"
								age={frame - WINDOW_STAMP}
								fontSize={44}
								rotate={-2}
								color={GANACHE}
							/>
						</div>
					) : null}

					<div
						style={{
							position: 'absolute',
							left: BAR_X,
							top: SOURCE_Y,
							width: BAR_W,
							background: CARD_DEEP,
							padding: '16px 28px',
							clipPath: tornPolygon({seed: 21, depth: 5, teeth: 15}),
							fontFamily: 'RansomSpecialElite, monospace',
							fontSize: 26,
							letterSpacing: 1,
							color: 'rgba(36,24,18,0.74)',
						}}
					>
						SOURCE: BIZZARO BANGALORE FIELD UNIT · FILE 04
						<NewsprintTexture opacity={0.16} />
					</div>
				</AbsoluteFill>
			)}

			{/* The page turn itself: a band of ground sweeping down. */}
			{wipe > 0 && wipe < 1 ? (
				<AbsoluteFill style={{transform: `translateY(${interpolate(wipe, [0, 1], [-1920, 0], CLAMP)}px)`}}>
					<Ground grain={0.1} />
				</AbsoluteFill>
			) : null}

			<NewsprintTexture opacity={0.14} />

			{frame >= BLACKOUT ? <AbsoluteFill style={{background: GANACHE_DEEP}} /> : null}

			{/* Shot 3 opens by tearing this page apart, and renders it frozen to do
			    so. A frozen frame holding audio would fight the shot it is being
			    torn out of, so the tear asks for it silent. */}
			{silent ? null : (
				<>
					<VoiceOver id="ep04-shot02a" from={VO_A_STARTS} />
					<VoiceOver id="ep04-shot02b-cut" from={VO_B_STARTS} />
					<VoiceOver id="ep04-shot02c-cut" from={VO_C_STARTS} />
					<VoiceOver id="ep04-shot02d-cut" from={VO_D_STARTS} />
				</>
			)}
		</AbsoluteFill>
	);
};

import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {CollageBackdrop} from '../../../components/CollageBackdrop';
import {ArrowTag, EvidenceStamp} from '../../../components/EvidenceStamp';
import {NewsprintTexture} from '../../../components/NewsprintTexture';
import {VoiceOver} from '../../../components/VoiceOver';
import {tornPolygon} from '../../../components/tornEdge';
import {useStopMotionStep} from '../../../components/useStopMotionStep';
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
import {INK, MARK, StatBar} from './StatBar';

const CLAMP = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

/** The survey's two findings. */
const REFUSE_ROUTE = 0.91;
const REFUSE_METER = 0.96;

// One column, so both bars are read against the same width, and spread deep
// enough down the frame that the page fills a 9:16 crop.
const BAR_X = 84;
const BAR_W = 912;
const BAR_H = 196;
const BAR1_Y = 640;
const BAR2_Y = 1200;

/** Where the leftover 9% of the first bar sits, before it becomes the second. */
const SLIVER_X = BAR_X + REFUSE_ROUTE * BAR_W;
const SLIVER_W = BAR_W * (1 - REFUSE_ROUTE);

/**
 * Grows a value in stepped chunks rather than smoothly. Used for both bars,
 * so they fill the way a strip of paper gets torn to length — in bites.
 */
const useSteppedGrowth = (frame: number, start: number, duration: number): number => {
	const {steppedFrame} = useStopMotionStep(Math.max(0, frame - start), STEP);
	return interpolate(steppedFrame, [0, duration], [0, 1], CLAMP);
};

/**
 * The figure for a leftover block, set above it rather than inside it.
 * At nine percent of the bar the block is 82px wide and at four percent it is
 * 36px — there is no inside to put a number in.
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
 * Shot 5 — The Graphic.
 *
 * A hard cut out of the meter and into the case file's evidence: a survey
 * page, read out. The register changes completely — no puppets, no depth,
 * everything flat on the page — which is what makes it land as a cutaway
 * rather than as more of the same scene.
 *
 * The two statistics are one object, not two. The 9% left over from the first
 * bar is drawn as its own outlined block, then expands into the whole width of
 * the second, with ruled lines running from its corners to the new bar's — the
 * standard way a graphic says "this piece, enlarged". Doing it as a
 * transformation rather than as a second chart is what keeps the 96% anchored
 * to the 9% it is a slice of.
 *
 * What survives at the end is four percent of nine percent, and the episode is
 * about that sliver — so the cliffhanger is on screen as a picture before the
 * narrator finishes saying it.
 */
export const Shot05Graphic: React.FC<{silent?: boolean}> = ({silent = false}) => {
	const frame = useCurrentFrame();

	const bar1 = useSteppedGrowth(frame, BAR1_STARTS, BAR_GROW) * REFUSE_ROUTE;
	const bar2 = useSteppedGrowth(frame, BAR2_STARTS, BAR_2_GROW) * REFUSE_METER;

	// The leftover's journey to becoming the second bar. Stepped like
	// everything else, so it hops down the page rather than gliding.
	const {steppedFrame: moveStep} = useStopMotionStep(Math.max(0, frame - SLIVER_MOVE), STEP);
	const move = interpolate(moveStep, [0, SLIVER_MOVE_FRAMES], [0, 1], CLAMP);
	const moving = frame >= SLIVER_MOVE;
	const bar2X = interpolate(move, [0, 1], [SLIVER_X, BAR_X]);
	const bar2Y = interpolate(move, [0, 1], [BAR1_Y, BAR2_Y]);
	const bar2W = interpolate(move, [0, 1], [SLIVER_W, BAR_W]);

	// The last 4%: what the whole episode turns out to be about.
	const remainderX = bar2X + bar2W * REFUSE_METER;



	/**
	 * The page breathes. Barely — a pixel and a fraction of a degree, on a slow
	 * step grid. The script asks for the last stat card to be held frozen while
	 * the narrator finishes, and a genuinely frozen frame stops reading as a
	 * held shot and starts reading as a stalled render.
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
					<div style={{position: 'absolute', left: BAR_X, top: 196, width: BAR_W}}>
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
								AUTO DRIVERS
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
									n = 1,200 · METHODOLOGY UNAVAILABLE
								</div>
							) : null}
							<NewsprintTexture opacity={0.18} />
						</div>

						<div style={{position: 'absolute', right: -26, top: -62}}>
							<EvidenceStamp text={'EXHIBIT\nB'} age={frame - HEADER_STAMP} fontSize={40} rotate={7} />
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
							label="91%"
							labelAge={frame - NUM1_STAMP}
							remainderLabel="9%"
							remainderAge={frame - REMAINDER1_IN}
							remainderTaken={moving}
							seed={5}
						/>
					</div>
				) : null}
				<div style={{position: 'absolute', left: BAR_X, top: BAR1_Y + BAR_H + 26}}>
					<Caption text="REFUSE THE WHITEFIELD ROUTE" age={frame - CAP1_IN} />
				</div>
				<RemainderLabel text="9%" age={frame - REMAINDER1_IN} top={BAR1_Y - 62} />

				{/* Claim two — the same 9%, enlarged. */}
				{moving ? (
					<>
						<div style={{position: 'absolute', left: bar2X, top: bar2Y}}>
							<StatBar
								width={bar2W}
								height={BAR_H}
								fill={bar2}
								label={move >= 1 ? '96%' : undefined}
								labelAge={frame - NUM2_STAMP}
								remainderLabel={move >= 1 ? '4%' : undefined}
								remainderAge={frame - REMAINDER2_IN}
								seed={11}
							/>
						</div>
						{move >= 1 ? (
							<>
								<div style={{position: 'absolute', left: BAR_X, top: BAR2_Y - 62}}>
									<Caption
										text="OF THE 9% WHO ACCEPT —"
										age={frame - CALLOUT_IN}
										size={44}
										color={MARK}
									/>
								</div>
								<div style={{position: 'absolute', left: BAR_X, top: BAR2_Y + BAR_H + 26}}>
									<Caption text="REFUSE THE METER" age={frame - CAP2_IN} />
								</div>
								<RemainderLabel text="4%" age={frame - REMAINDER2_IN} top={BAR2_Y - 60} />
							</>
						) : null}
					</>
				) : null}

				{/* What is left. At four percent of the width there is nowhere on the
				    bar to put a label, so the arrow runs up to it from a tag below. */}
				{frame >= TAG_STAMP ? (
					<>
						<div style={{position: 'absolute', left: remainderX - 132, top: BAR2_Y + BAR_H + 18}}>
							<ArrowTag age={frame - TAG_STAMP} length={148} />
						</div>
						<div style={{position: 'absolute', left: 470, top: BAR2_Y + BAR_H + 186}}>
							<EvidenceStamp text="THIS RIDE" age={frame - TAG_STAMP - 6} fontSize={68} rotate={-4} />
						</div>
						{frame >= FOOTNOTE_IN ? (
							<div
								style={{
									position: 'absolute',
									right: BAR_X,
									top: BAR2_Y + BAR_H + 346,
									fontFamily: 'RansomSpecialElite, monospace',
									fontSize: 32,
									letterSpacing: 1,
									color: 'rgba(36,29,21,0.78)',
								}}
							>
								0.36% OF ALL AUTO RIDES
							</div>
						) : null}
					</>
				) : null}

				{frame >= SUBHEAD_IN ? (
					<div
						style={{
							position: 'absolute',
							left: BAR_X,
							top: 1830,
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
						SOURCE: BIZZARO BANGALORE FIELD UNIT · FILE 01
						<NewsprintTexture opacity={0.16} />
					</div>
				) : null}
			</AbsoluteFill>

			{/* Shot 6 opens by tearing this page apart, and renders it frozen to
			    do so. A frozen frame holding audio would fight the shot it is
			    being torn out of, so the tear asks for it silent. */}
			{silent ? null : (
				<>
					<VoiceOver id="ep01-shot05a" from={VO_A_STARTS} />
					<VoiceOver id="ep01-shot05b" from={VO_B_STARTS} />
					<VoiceOver id="ep01-shot05c" from={VO_C_STARTS} />
				</>
			)}

		</AbsoluteFill>
	);
};

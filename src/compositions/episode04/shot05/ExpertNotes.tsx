import React from 'react';
import {interpolate} from 'remotion';
import {NewsprintTexture} from '../../../components/NewsprintTexture';
import {tornPolygon} from '../../../components/tornEdge';
import {useStopMotionStep} from '../../../components/useStopMotionStep';
import {BUTTER, GANACHE} from '../../../components/palette';

const CLAMP = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

/**
 * Annotations over the expert, in the band ABOVE his head.
 *
 * The expert stretch was forty-four seconds of a man talking with nothing on
 * screen but his nameplate, and it felt like it. These are the documentary
 * move that fills it: a note pinned over the picture as the point is made,
 * which is also the only way an invented term like K.Y.C. Syndrome reads as
 * something being cited rather than something being said.
 *
 * WHY THEY SIT AT THE TOP
 *
 * Measured on the delivered take, his head runs from about y500 to y1044 and
 * the whole band above it is bookshelf. The bottom band is free too, but the
 * nameplate is already there for the first nine seconds, and notes that dodge
 * a card that comes and goes end up moving for no reason the audience can
 * see. The top band is empty for the whole stretch.
 *
 * Everything here is TYPE. No generated art: the words K.Y.C., RAJAJINAGAR
 * and NINETY MINUTES all have to be spelled correctly, and that is the one
 * thing the image generator reliably cannot do.
 */

const Card: React.FC<{
	age: number;
	top: number;
	children: React.ReactNode;
	tone?: 'paper' | 'ink';
	rotate?: number;
	seed?: number;
}> = ({age, top, children, tone = 'paper', rotate = -1.4, seed = 5}) => {
	if (age < 0) return null;
	// Stamps rather than fades: over-sized on the first step, settled by the
	// second, the way every other piece of paper in the series arrives.
	const {steppedFrame} = useStopMotionStep(age, 2);
	return (
		<div
			style={{
				position: 'absolute',
				left: 84,
				right: 84,
				top,
				background: tone === 'ink' ? GANACHE : '#F6E7CB',
				color: tone === 'ink' ? BUTTER : GANACHE,
				padding: '22px 30px 26px',
				clipPath: tornPolygon({seed, depth: 5, teeth: 15}),
				boxShadow: '0 10px 22px rgba(20,13,9,0.45)',
				textAlign: 'center',
				transform: `rotate(${rotate}deg) scale(${interpolate(steppedFrame, [0, 2], [1.16, 1], CLAMP)})`,
				opacity: interpolate(steppedFrame, [0, 2], [0, 1], CLAMP),
			}}
		>
			{children}
			<NewsprintTexture opacity={0.16} />
		</div>
	);
};

const Big: React.FC<{children: React.ReactNode; size?: number}> = ({children, size = 72}) => (
	<div
		style={{
			fontFamily: 'RansomArchivoBlack, sans-serif',
			fontSize: size,
			lineHeight: 1,
			letterSpacing: 2,
		}}
	>
		{children}
	</div>
);

/**
 * A drawn arrowhead, not a glyph. "↓" was here first and it is exactly the
 * kind of thing that renders as tofu: the container ships 59 fonts, the ones
 * this project loads are a handful of display faces, and none of them promise
 * an arrow. A triangle in SVG has no such question hanging over it.
 */
const Down: React.FC<{colour: string}> = ({colour}) => (
	<svg width={26} height={22} style={{display: 'block', margin: '8px auto'}}>
		<polygon points="13,22 0,4 26,4" fill={colour} opacity={0.85} />
	</svg>
);

const Small: React.FC<{children: React.ReactNode}> = ({children}) => (
	<div
		style={{
			marginTop: 10,
			fontFamily: 'RansomSpecialElite, monospace',
			fontSize: 27,
			letterSpacing: 2,
			opacity: 0.82,
		}}
	>
		{children}
	</div>
);

export const ExpertNotes: React.FC<{
	frame: number;
	/** Frames at which each note lands. See beats.ts for where they come from. */
	at: {term: number; chaos: number; law: number; case_: number; minutes: number};
	/** Frame ranges each note is allowed to be on screen for. */
	until: {term: number; chaos: number; butterfly: number; minutes: number};
}> = ({frame, at, until}) => (
	<>
		{/* His invented term, glossed the moment he says it. */}
		{frame < until.term ? (
			<Card age={frame - at.term} top={110} seed={5}>
				<Big>K.Y.C. SYNDROME</Big>
				<Small>KEPT YOUR COUNTER (OPEN)</Small>
			</Card>
		) : null}

		{/* The escalation he makes in one sentence, stated as a finding. */}
		{frame >= at.chaos && frame < until.chaos ? (
			<Card age={frame - at.chaos} top={110} tone="ink" rotate={1.6} seed={11}>
				<Big size={64}>NO LONGER BEHAVIOURAL</Big>
				<Small>RECLASSIFIED: CHAOS THEORY</Small>
			</Card>
		) : null}

		{/* The butterfly effect, and then the same shape with his own terms
		    substituted -- the second row is what makes it a joke rather than a
		    definition, so it lands as a separate card under the first. */}
		{frame >= at.law && frame < until.butterfly ? (
			<Card age={frame - at.law} top={100} seed={17}>
				<Big size={50}>A BUTTERFLY, BRAZIL</Big>
				<Down colour={GANACHE} />
				<Big size={50}>A TYPHOON, TEXAS</Big>
			</Card>
		) : null}
		{/* The substitution goes BELOW him, not under the first card. At top 400
		    it sat across his hair -- measured on the delivered take his head
		    starts at about y500, and this card is 200 tall. Putting the two
		    halves of the rhyme at opposite ends of the frame also reads better
		    than stacking them: the eye compares across the picture instead of
		    down a list. The nameplate is long gone by the time this lands. */}
		{frame >= at.case_ && frame < until.butterfly ? (
			<Card age={frame - at.case_} top={1120} tone="ink" rotate={1.2} seed={23}>
				<Big size={50}>A MAN, LUNCH HOUR</Big>
				<Down colour={BUTTER} />
				<Big size={50}>A MARRIAGE, RAJAJINAGAR</Big>
			</Card>
		) : null}

		{/* The number the whole argument rests on. */}
		{frame >= at.minutes && frame < until.minutes ? (
			<Card age={frame - at.minutes} top={110} tone="ink" rotate={-2} seed={29}>
				<Big size={92}>NINETY MINUTES</Big>
				<Small>WHERE THINGS ARE DISCOVERED</Small>
			</Card>
		) : null}
	</>
);

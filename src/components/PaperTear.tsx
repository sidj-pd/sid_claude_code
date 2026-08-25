import React from 'react';
import {AbsoluteFill} from 'remotion';

/**
 * Rips the paper apart to reveal whatever is behind it.
 *
 * The series rule is that a tear means reality intruding on the reenactment —
 * it is reserved for cuts from the paper world to real footage, and the
 * page-flip stays reserved for reenactment-to-reenactment. So this has to
 * read as physical destruction rather than as a wipe: two halves of the same
 * sheet, separating along one ragged line, each carrying its own share of the
 * artwork away with it.
 *
 * Both halves render the SAME children and differ only in how they are
 * clipped, which is what makes the tear line consistent — the piece that goes
 * left and the piece that goes right were one sheet a frame ago.
 */

/** Deterministic pseudo-random in [-1, 1]. */
const wobble = (seed: number): number => {
	const x = Math.sin(seed * 91.7 + 47.3) * 28213.4;
	return (x - Math.floor(x)) * 2 - 1;
};

/**
 * The ragged line the sheet parts along, as points down the frame.
 *
 * It leans as it descends and wanders around that lean, because a tear
 * follows the grain of the paper and the pull of the hand: a line that only
 * wobbles about dead vertical reads as a machine-cut perforation.
 */
const tearPoints = (seed: number, at: number, lean: number, teeth: number): {x: number; y: number}[] =>
	Array.from({length: teeth + 1}, (_, i) => {
		const y = (i / teeth) * 100;
		// Three scales of wander stacked: a slow wide meander, a middling
		// waver, and a fine fray. One scale on its own comes out as a zigzag —
		// the thing that separates a tear from a lightning bolt is that its
		// roughness goes all the way down.
		const drift =
			wobble(seed + i * 0.37) * 3.4 + wobble(seed + i * 3.1) * 1.5 + wobble(seed + i * 9.3) * 0.7;
		return {x: at + lean * (y / 100 - 0.5) + drift, y};
	});

export type PaperTearProps = {
	/** 0 = intact sheet, 1 = both halves clear of the frame. */
	progress: number;
	children: React.ReactNode;
	/** Where down the middle the tear runs, as a percentage of the width. */
	at?: number;
	/** How far the line leans across as it descends, in percent. */
	lean?: number;
	seed?: number;
};

export const PaperTear: React.FC<PaperTearProps> = ({
	progress,
	children,
	at = 50,
	lean = 22,
	seed = 5,
}) => {
	const points = tearPoints(seed, at, lean, 52);
	const down = points.map((p) => `${p.x.toFixed(2)}% ${p.y.toFixed(2)}%`).join(', ');
	const up = [...points]
		.reverse()
		.map((p) => `${p.x.toFixed(2)}% ${p.y.toFixed(2)}%`)
		.join(', ');

	// Each half slides clear and tips as it goes, the way a piece of paper
	// pulled off a surface turns about the hand holding it.
	//
	// The travel is deliberately back-loaded. A tear is slow to start and then
	// runs: at a constant rate the halves are half off the frame before the
	// audience has registered that a line has opened at all, and the reveal
	// reads as a wipe rather than as something being destroyed.
	const shift = progress ** 1.9 * 122;
	const tilt = progress ** 1.6 * 8;

	const half = (clip: string, direction: -1 | 1) => (
		<AbsoluteFill
			style={{
				clipPath: clip,
				transform: `translateX(${direction * shift}%) rotate(${direction * tilt}deg)`,
				transformOrigin: direction < 0 ? '0% 40%' : '100% 40%',
				// The halves throw shadows onto whatever is underneath, which is
				// what stops the reveal reading as a layer being switched off.
				filter: `drop-shadow(${direction * -14}px 10px ${16 + progress * 24}px rgba(24,16,8,${0.42 * Math.min(1, progress * 4)}))`,
			}}
		>
			{children}
		</AbsoluteFill>
	);

	return (
		<>
			{half(`polygon(0% 0%, ${down}, 0% 100%)`, -1)}
			{half(`polygon(100% 100%, ${up}, 100% 0%)`, 1)}
		</>
	);
};

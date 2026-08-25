/**
 * Builds a CSS `polygon()` for a rectangle whose chosen edges are torn.
 *
 * A clip path rather than a drawn SVG shape, so whatever is inside the
 * element — a bar's fill, a number knocked out of it, a texture overlay —
 * gets torn along with it, and the element stays an ordinary div that can be
 * laid out and animated normally.
 *
 * The jag is seeded, so a strip has the same tear on every frame and on every
 * frame server. Torn paper that reshuffles between frames reads as noise.
 */

/** Deterministic pseudo-random in [0, 1). */
const rand = (seed: number): number => {
	const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
	return x - Math.floor(x);
};

export type TornEdges = {top?: boolean; right?: boolean; bottom?: boolean; left?: boolean};

export type TornOptions = {
	/** Which edges are torn. Anything left out is cut straight. */
	edges?: TornEdges;
	/** Depth of the tear as a percentage of the box. */
	depth?: number;
	/** Teeth per edge. Fewer and larger reads as torn; many and small as cut. */
	teeth?: number;
	seed?: number;
};

export const tornPolygon = ({
	edges = {top: true, bottom: true},
	depth = 2.2,
	teeth = 14,
	seed = 1,
}: TornOptions = {}): string => {
	const points: string[] = [];
	let n = seed * 977;

	/**
	 * Walks one edge from (x0,y0) to (x1,y1), pushing points that wobble
	 * along the edge's inward normal. Straight edges get their corner only.
	 */
	const walk = (
		x0: number,
		y0: number,
		x1: number,
		y1: number,
		nx: number,
		ny: number,
		torn: boolean,
	) => {
		if (!torn) {
			points.push(`${x0.toFixed(2)}% ${y0.toFixed(2)}%`);
			return;
		}
		for (let i = 0; i < teeth; i++) {
			const t = i / teeth;
			// Alternating sign gives the tear its saw; the random factor stops
			// the saw from being regular enough to read as a zigzag border.
			const bite = (i % 2 === 0 ? 1 : 0.25) * rand(n++) * depth;
			points.push(
				`${(x0 + (x1 - x0) * t + nx * bite).toFixed(2)}% ${(y0 + (y1 - y0) * t + ny * bite).toFixed(2)}%`,
			);
		}
	};

	walk(0, 0, 100, 0, 0, 1, Boolean(edges.top));
	walk(100, 0, 100, 100, -1, 0, Boolean(edges.right));
	walk(100, 100, 0, 100, 0, -1, Boolean(edges.bottom));
	walk(0, 100, 0, 0, 1, 0, Boolean(edges.left));

	return `polygon(${points.join(', ')})`;
};

import React from 'react';

/**
 * TEMPORARY stand-in for the hailing-hand cutout, so Shot 1's timing and
 * staging are reviewable before the real art lands. Swap it out by dropping
 * `hailing-hand.jpg` into public/cutouts/, re-running
 * `node scripts/cutout-alpha.mjs`, and registering it in assets/cutouts.tsx —
 * nothing else in the shot needs to change.
 */
export const PlaceholderHand: React.FC = () => (
	<svg viewBox="0 0 400 620" width="100%" height="100%">
		{/* forearm, running off the bottom edge */}
		<path d="M150 620 L150 380 Q200 360 250 380 L250 620 Z" fill="#b07a4e" />
		{/* shirt cuff */}
		<rect x="142" y="392" width="116" height="46" rx="8" fill="#cfd9c4" />
		{/* palm */}
		<path d="M148 400 Q140 300 160 250 Q200 228 240 250 Q260 300 252 400 Z" fill="#c48a5c" />
		{/* fingers, slightly spread */}
		<rect x="156" y="150" width="28" height="115" rx="14" fill="#c48a5c" transform="rotate(-7 170 200)" />
		<rect x="188" y="132" width="28" height="132" rx="14" fill="#c48a5c" />
		<rect x="220" y="146" width="28" height="120" rx="14" fill="#c48a5c" transform="rotate(6 234 200)" />
		<rect x="250" y="176" width="26" height="94" rx="13" fill="#c48a5c" transform="rotate(13 262 220)" />
		{/* thumb */}
		<rect x="120" y="250" width="26" height="86" rx="13" fill="#b8804f" transform="rotate(-28 133 290)" />
	</svg>
);

import React from 'react';

/**
 * TEMPORARY stand-in for the passenger cutout (three-quarter rear view,
 * leaning in toward the auto), so Shot 2's staging and the bubble timing are
 * reviewable before the real art lands. Swap it out by dropping
 * `passenger-leaning.jpg` into public/cutouts/, re-running
 * `node scripts/cutout-alpha.mjs`, and registering it in assets/cutouts.tsx.
 */
export const PlaceholderPassenger: React.FC = () => (
	<svg viewBox="0 0 460 900" width="100%" height="100%">
		{/* legs */}
		<path d="M170 560 L165 880 L205 880 L215 600 Z" fill="#3f4652" />
		<path d="M230 560 L250 880 L290 880 L275 570 Z" fill="#363c47" />
		{/* torso, leaning left */}
		<path d="M150 300 Q135 460 165 580 L285 580 Q305 450 285 300 Z" fill="#8d9a7e" />
		{/* sling bag strap + bag */}
		<path d="M262 310 L200 520 L232 530 L292 320 Z" fill="#7a5c3e" opacity={0.9} />
		<rect x="150" y="490" width="105" height="86" rx="10" fill="#6d5136" />
		{/* head, turned away */}
		<ellipse cx="222" cy="240" rx="76" ry="84" fill="#c48a5c" />
		<path d="M146 226 Q160 150 222 152 Q288 152 300 232 Q286 186 222 190 Q166 194 146 226 Z" fill="#241d17" />
		{/* far ear edge */}
		<ellipse cx="292" cy="252" rx="15" ry="22" fill="#b87f52" />
	</svg>
);

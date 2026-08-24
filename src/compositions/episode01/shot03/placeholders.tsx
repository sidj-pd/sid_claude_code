import React from 'react';

/**
 * TEMPORARY stand-ins for Shot 3's two missing cutouts, so the timing of
 * the flip is reviewable before the real art lands. Swap them out by
 * dropping `auto-meter.jpg` and `driver-hand-reach.jpg` into
 * public/cutouts/, re-running `node scripts/cutout-alpha.mjs`, and
 * registering both in assets/cutouts.tsx.
 *
 * The meter is drawn WITHOUT its lever — the lever is a separate element in
 * the shot so it can rotate independently. When the real art arrives the
 * same split is needed: either a lever-less meter plus a lever cutout, or
 * the lever masked out of the meter image.
 */
export const PlaceholderMeter: React.FC = () => (
	<svg viewBox="0 0 420 340" width="100%" height="100%">
		{/* bracket */}
		<rect x="186" y="250" width="48" height="86" fill="#4a4640" />
		{/* housing */}
		<rect x="70" y="60" width="280" height="200" rx="14" fill="#55514a" />
		<rect x="70" y="60" width="280" height="26" rx="12" fill="#625d55" />
		{/* display window */}
		<rect x="112" y="112" width="196" height="96" rx="8" fill="#e8e0c8" />
	</svg>
);

/** The meter's flag lever, drawn about its pivot at the left edge. */
export const PlaceholderLever: React.FC = () => (
	<svg viewBox="0 0 240 60" width="100%" height="100%">
		<rect x="0" y="18" width="200" height="24" rx="12" fill="#6d6860" />
		<circle cx="206" cy="30" r="26" fill="#8a8279" />
		<circle cx="14" cy="30" r="15" fill="#3c3833" />
	</svg>
);

export const PlaceholderDriverHand: React.FC = () => (
	<svg viewBox="0 0 620 300" width="100%" height="100%">
		{/* sleeve, running off the left edge */}
		<path d="M0 96 L150 96 L150 214 L0 214 Z" fill="#8a8452" />
		{/* forearm */}
		<path d="M140 104 L330 112 L330 200 L140 206 Z" fill="#c48a5c" />
		{/* hand */}
		<path d="M322 108 Q400 104 442 130 L470 150 Q486 162 470 176 L430 196 Q392 210 322 202 Z" fill="#c48a5c" />
		{/* index finger, extended toward the lever */}
		<rect x="440" y="132" width="118" height="26" rx="13" fill="#c48a5c" />
		{/* thumb */}
		<rect x="430" y="168" width="86" height="24" rx="12" fill="#b8804f" transform="rotate(12 430 180)" />
	</svg>
);

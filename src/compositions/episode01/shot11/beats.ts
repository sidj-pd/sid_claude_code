/**
 * Episode 01 / Scene 1 (reprise) — Shot 11 — Full-Circle Close.
 *
 * Paper to paper from Shot 10, so the series rule gives this one a
 * page-flip rather than a tear — no reality to intrude here, just the
 * reenactment resuming where the cold open left it.
 *
 * The beat mirrors Shot 1 deliberately: the same auto, the same kind of
 * wide framing, driving off exactly the way it arrived. Freezing and
 * desaturating it at the end is the visual rhyme with Shot 1's own opening
 * freeze — the episode closing the same door it walked in through.
 */

const S = 30;

export const FLIP_IN_FRAMES = 16;

export const DRIVE_STARTS = 10;
/** Reaches its resting position well before the VO ends, so the back half
 *  of the line plays over a wide shot that has already gone still. */
export const DRIVE_FRAMES = 220;
export const FREEZE_AT = DRIVE_STARTS + DRIVE_FRAMES;
export const DESAT_FRAMES = 70;

/** 12.16s take; speech runs 0.28-11.74s. */
export const VO_STARTS = 20;
export const VO_FRAMES = Math.round(12.16 * S);

export const STAMP_AT = VO_STARTS + VO_FRAMES + 14;
export const BLACKOUT_STARTS = STAMP_AT + 22;
export const BLACKOUT_FRAMES = 10;

export const SHOT_11_DURATION = BLACKOUT_STARTS + BLACKOUT_FRAMES;

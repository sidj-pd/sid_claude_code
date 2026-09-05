/**
 * Episode 03 / Shot 9 — Full Circle.
 *
 * Shot 1 from the other side. The tenant stood in this flat bracing for an
 * argument about a stain; the landlord stands in the same flat, with the same
 * stain, and shuts the door on it. The damage is all still there and none of
 * it was ever going to matter.
 *
 * The twin of Episode 01's Shot 11 and Episode 02's Shot 9: freeze, drain the
 * colour, turn the halftone up, stamp the case closed, cut to black. A
 * photograph going into an archive.
 *
 * Measured: ep03-shot09-final.wav 11.28s, speech 0.28-10.79, four gaps — and
 * as in both previous closers, the gaps are most of the performance, so the
 * visual beat is placed INSIDE a silence rather than under a word:
 *
 *   0.28-1.88   "As for the landlord himself —"
 *   2.91-4.86   "already looking for the next tenant."
 *   5.81-6.65   "Deposit policy..."
 *   7.96-8.78   "Unchanged."
 *   8.78-10.49  1.71s of nothing        <- the door closes here
 *   10.49-10.79 "For now."
 *
 * The script also asks him to glance at the tile, the stain and the crack
 * before he shuts the door. That is not staged, and deliberately: he is a
 * paper cutout photographed from behind and he cannot look at anything, and
 * the only tools for faking it — a camera drift or a pop on each piece of
 * damage — read as drift and as a rendering fault respectively. The 1.71s of
 * silence before the door moves is the beat of consideration; the room is
 * already holding all three pieces of evidence in frame while it passes.
 */

const S = 30;

export const VO_STARTS = 14;
export const VO_FRAMES = Math.round(11.28 * S);

const AT = (seconds: number) => VO_STARTS + Math.round(seconds * S);

/**
 * The door, inside the long pause after "Unchanged." — the act comes first
 * and the narration catches up, which is what makes "For now" land as a
 * warning rather than a sign-off.
 */
export const DOOR_CLOSES = AT(9.2);
export const DOOR_FRAMES = 14;

/** Motion stops just after the last word. */
export const FREEZE_AT = AT(11.0);
export const DESAT_FRAMES = 70;

export const STAMP_AT = VO_STARTS + VO_FRAMES + 14;
export const BLACKOUT_STARTS = STAMP_AT + 22;
export const BLACKOUT_FRAMES = 10;

export const SHOT_09_DURATION = BLACKOUT_STARTS + BLACKOUT_FRAMES;

/**
 * Episode 01 / Scene 1 / Shot 5 — The Graphic.
 *
 * The script gives this beat seven seconds, and it cannot have seven seconds:
 * the voice-over it also specifies runs to about twenty. Per the rule the
 * pipeline has followed since Shot 1, a line that does not fit means a longer
 * shot, never a faster take — so the shot is as long as the narration, and
 * the visuals are cut to land on the figures as he says them.
 *
 * The narration is three separate lines rather than one long one. Each stat
 * gets its own file, so each can be placed against the beat it belongs to
 * instead of the visuals having to guess where inside a single take the
 * second number falls. It also puts real silence between the claims, which is
 * how this kind of sequence is read out anyway.
 */

/**
 * Lengths of the three voice-over takes, in frames.
 *
 * ESTIMATES until the WAVs exist — measured from the narrator's rate on the
 * lines already recorded, about half a second per spoken word. Everything
 * below is derived from them, so re-timing the shot to the real takes is a
 * matter of correcting these three numbers and nothing else.
 */
export const VO_A_FRAMES = 210;
export const VO_B_FRAMES = 210;
export const VO_C_FRAMES = 150;

/** The header card lands immediately — this is a hard cut, not a transition. */
export const HEADER_IN = 0;
export const HEADER_STAMP = 6;
export const SUBHEAD_IN = 14;

// --- Claim one: 91% refuse the route.
export const VO_A_STARTS = 10;
export const BAR1_STARTS = 40;
/** Frames the bar takes to reach 91%, in stepped chunks. */
export const BAR_GROW = 30;
export const NUM1_STAMP = BAR1_STARTS + BAR_GROW + 4;
export const CAP1_IN = NUM1_STAMP + 8;

// --- Claim two: of the 9% who accept, 96% refuse the meter.
export const VO_B_STARTS = VO_A_STARTS + VO_A_FRAMES + 20;
/**
 * The leftover 9% detaches from the first bar and grows into the whole width
 * of the second one. It is the move the line itself makes — "of the 9% who
 * accept" — and doing it as a transformation rather than as a new graphic is
 * what keeps the second statistic anchored to the first.
 */
export const SLIVER_MOVE = VO_B_STARTS + 12;
export const SLIVER_MOVE_FRAMES = 16;
export const BAR2_STARTS = SLIVER_MOVE + SLIVER_MOVE_FRAMES + 12;
export const NUM2_STAMP = BAR2_STARTS + BAR_GROW + 4;
export const CAP2_IN = NUM2_STAMP + 8;

// --- The cliffhanger.
/** A real gap before it: the script asks for a beat, and the beat is the joke. */
export const VO_C_STARTS = VO_B_STARTS + VO_B_FRAMES + 26;
/**
 * What is left of the second bar is a sliver four percent wide. Tagging it is
 * the line's proof: the ride the episode is about is that piece of paper.
 */
export const TAG_STAMP = VO_C_STARTS + 46;

/** Hard cut to black, then silence, exactly as scripted. */
export const CUT_TO_BLACK = VO_C_STARTS + VO_C_FRAMES + 16;
export const SHOT_05_DURATION = CUT_TO_BLACK + 18;

/** Frames per stepped chunk anywhere in this shot. */
export const STEP = 3;

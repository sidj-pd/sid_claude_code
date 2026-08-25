/**
 * Episode 01 / Scene 1 / Shot 5 — The Graphic.
 *
 * The script gives this beat seven seconds, and it cannot have seven: the
 * voice-over it also specifies runs to twenty-two. Per the rule the pipeline
 * has followed since Shot 1, a line that does not fit means a longer shot,
 * never a faster take — so the shot is as long as the narration, and every
 * visual is cut to land on the figure as he says it.
 *
 * The narration is three takes rather than one. Each statistic gets its own
 * file, so each can be placed against the beat it belongs to instead of the
 * visuals having to guess where inside a single take the second number falls.
 */

/**
 * The three takes, measured from the rendered WAVs rather than estimated:
 * total length, when speech actually starts, and where the pause inside the
 * line falls. Every cue below is expressed as an offset into one of these, so
 * the shot is timed against what the narrator does rather than against a
 * guess about what he might do.
 *
 * Re-measure with the RMS envelope after any re-record — the takes carry
 * about a third of a second of lead-in and half a second of tail, and cueing
 * a graphic to the top of the file rather than to the first word puts every
 * number a beat late.
 */
const S = 30; // frames per second, for reading the numbers below as seconds
export const VO_A = {frames: 207, speechIn: 9, resumesAt: Math.round(1.84 * S)};
export const VO_B = {frames: 225, speechIn: 9, numberAt: Math.round(5.44 * S)};
export const VO_C = {frames: 239, speechIn: 8, lastClauseAt: Math.round(3.86 * S)};

/** The header card lands immediately — this is a hard cut, not a transition. */
export const HEADER_IN = 0;
export const HEADER_STAMP = 6;
export const SUBHEAD_IN = 14;

// --- Claim one: 91% refuse the route.
export const VO_A_STARTS = 12;
/** "According to our survey," lands, he pauses, and the bar starts filling. */
export const BAR1_STARTS = VO_A_STARTS + VO_A.resumesAt - 13;
/** Frames the bar takes to reach 91%, in stepped chunks. */
export const BAR_GROW = 27;
export const NUM1_STAMP = BAR1_STARTS + BAR_GROW + 1;
export const CAP1_IN = NUM1_STAMP + 20;
/** The leftover is named as soon as the first figure has landed — it is the
 *  subject of the next sentence, and the graphic should be holding it up
 *  before he reaches for it. */
export const REMAINDER1_IN = NUM1_STAMP + 30;

// --- Claim two: of the 9% who accept, 96% refuse the meter.
/** Butted against the end of take A; the takes' own lead and tail are the beat. */
export const VO_B_STARTS = VO_A_STARTS + VO_A.frames - 6;
/**
 * "Of the 9% who accept" — and the leftover expands into the whole of the
 * second bar. Doing it as one continuous transformation, with ruled lines
 * running from the old block's corners to the new one's, is what keeps the
 * second statistic anchored to the first: it is visibly a slice being
 * enlarged, not a fresh claim that happens to be underneath.
 */
export const SLIVER_MOVE = VO_B_STARTS + 30;
export const SLIVER_MOVE_FRAMES = 20;
export const CALLOUT_IN = SLIVER_MOVE + SLIVER_MOVE_FRAMES + 4;
/** Fills as he says the number, landing on the last syllable of it. */
export const BAR2_STARTS = VO_B_STARTS + VO_B.numberAt - 6;
export const BAR_2_GROW = 24;
export const NUM2_STAMP = BAR2_STARTS + BAR_2_GROW + 1;
export const CAP2_IN = NUM2_STAMP + 13;
export const REMAINDER2_IN = CAP2_IN + 22;

// --- The cliffhanger.
/** A real gap before it: the script asks for a beat, and the beat is the joke. */
export const VO_C_STARTS = VO_B_STARTS + VO_B.frames + 12;
/**
 * On "this shouldn't have happened at all". What is left of the second bar is
 * four percent of nine percent, and the episode is about that sliver — so the
 * line's proof is already on screen by the time he finishes saying it.
 */
export const TAG_STAMP = VO_C_STARTS + VO_C.lastClauseAt;
export const FOOTNOTE_IN = TAG_STAMP + 24;

/**
 * The page holds to the end rather than cutting to black.
 *
 * The script asks Shot 5 for a hard cut to black AND asks the transition that
 * follows it to rip the frozen stat card apart. Both cannot happen: a card
 * that has been cut away from is not there to be torn. The transition spec is
 * the more specific of the two and carries the series rule with it — a tear
 * means reality intruding on the reenactment — so the tear wins, and Shot 6
 * opens on this page still standing.
 */
export const SHOT_05_DURATION = VO_C_STARTS + VO_C.frames + 22;

/** Frames per stepped chunk anywhere in this shot. */
export const STEP = 3;

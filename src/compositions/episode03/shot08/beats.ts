/**
 * Episode 03 / Shot 8 — The Committee.
 *
 * The punchline beat. Paper closes over the sign-off, one headline lands, one
 * dry line of narration, out. The twin of Episode 01's Shot 10 and Episode
 * 02's Shot 8.
 *
 * Longer than either of those, because this episode's version of the line is
 * longer. Measured: ep03-shot08-committee.wav 9.68s, speech 0.32-9.31, gaps
 * 3.84-4.44, 6.01-6.65, 7.76-7.95 — the gaps fall between its clauses:
 *
 *   0.32-3.84  "The housing ministry has since formed a committee"
 *   4.44-6.01  "to study the matter further."
 *   6.65-7.76  "The first meeting was rescheduled —"
 *   7.95-9.31  "due to a site visit for a new project launch."
 *
 * Nothing here waits for anything: the headline is already on the page as it
 * closes, and the narration reads over it.
 */

const S = 30;

export const REV_STARTS = 4;
export const REV_FRAMES = 26;
export const REV_DONE = REV_STARTS + REV_FRAMES;
/** On the page as it closes, not stamped after. */
export const HEADLINE_LAND = REV_DONE - 8;

export const VO_STARTS = REV_DONE + 6;
export const VO_FRAMES = Math.round(9.68 * S);

/**
 * Reusing Episode 01's committee photograph, as agreed — an empty boardroom
 * with a clock on the wall, which is the joke for a committee whose first
 * meeting has been rescheduled.
 *
 * It gets its own crop under its own name (newspaper-clip-ministry) rather
 * than sharing Episode 01's entry, because that crop stops above the
 * body-text columns and widening it would silently re-frame a delivered
 * shot. Cropped Episode 03's way — photo through columns — it comes out
 * portrait at aspect 0.753, which is much taller than Shot 6's clippings and
 * drives the block narrower again: at width 700 the clipping box is 799
 * tall, three headline lines are 206, the quote wraps to two at 60
 * characters (74), plus the component's own margins (14 and 28) — 1121 in
 * total. At top 190 its foot lands at 1311, clear of the 1536 limit.
 *
 * The headline's line breaks are explicit for the same reason: left to wrap
 * at this width it broke into four lines with "SYNDROME" alone on the last.
 */
export const BLOCK = {left: 190, top: 190, width: 700, clipHeight: 799, rotate: -1};

export const SHOT_08_DURATION = VO_STARTS + VO_FRAMES + 20;

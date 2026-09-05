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
 * Reusing Episode 01's committee clipping, as agreed — an empty boardroom with
 * a clock on the wall, which is the joke for a committee whose first meeting
 * has been rescheduled. Its existing crop (768x680, aspect 1.129) already runs
 * photo through body text, so it needs nothing done to it.
 *
 * Block geometry derived the same way Shot 6's is: three headline lines at
 * width 780 is 229, the quote wraps to two at 60 characters (82), plus the
 * component's own margins (16 and 31) and a 594 clipping box set from that
 * 1.129 aspect — 952 in total. At top 430 its foot lands at 1382, clear of
 * the 1536 limit.
 */
export const BLOCK = {left: 140, top: 430, width: 780, clipHeight: 594, rotate: -1};

export const SHOT_08_DURATION = VO_STARTS + VO_FRAMES + 20;

/**
 * Episode 04 / Shot 7 — CORRESPONDENT PSA.
 *
 * Measured off the delivered take, not budgeted. ep04-correspondent-psa.mp4
 * runs 10.01s with speech from 1.38 to 9.28, so the shot trims 1.38s of
 * generator lead-in off the front and ends 0.4s after the last word.
 *
 * THE TAKE IS MISSING A LINE, AND THAT IS AN IMPROVEMENT
 *
 * The script has him say "Some things are better discovered on schedule"
 * before "Better safe than sorry". The generated take skips it — it goes
 * straight from "Inform your family in advance." to "Better safe than sorry."
 *
 * That line is now on the card and nowhere else, which is the better version
 * of this beat and the same device Episode 03's PSA uses: the card states the
 * thing the correspondent is carefully not saying. Re-generating the take to
 * put the line back would make the card redundant, so it stays as it is.
 *
 * Word timings from the take, relative to its own start:
 *
 *   0.73  "If a bank counter has served you during the lunch hour,"
 *   3.03  "do not celebrate."
 *   4.64  "Note the time you reached home."
 *   6.07  "Inform your family in advance."
 *   7.96  "Better safe than sorry."
 */

const S = 30;

/** Generator lead-in, cut off the front of the source. */
export const TRIM_IN = Math.round(1.38 * S);

export const CHYRON_IN = 10;

/** Speech runs 1.38-9.28 in the source; 0.4s of tail after the last word. */
export const TAKE_FRAMES = Math.round((9.28 - 1.38 + 0.4) * S);

/**
 * The card lands in the 0.96s silence between "advance." and "Better safe
 * than sorry" — so it is on screen, unread, for the beat before the payoff,
 * and it is still up under the payoff. Source 7.00s minus the 1.38 trim, plus
 * a couple of frames.
 */
export const CARD_IN = Math.round((7.35 - 1.38) * S);
export const CARD_FRAMES = TAKE_FRAMES - CARD_IN - 4;

export const EP04_SHOT_07_DURATION = TAKE_FRAMES + 14;

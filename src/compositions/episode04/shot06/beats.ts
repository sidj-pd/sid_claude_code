/**
 * Episode 04 / Shot 6 — INSTITUTIONAL FALLOUT.
 *
 * The same three-part shape as Episode 03's: a reverse tear back into paper
 * for the union's headline, a forward tear into the witness for his one
 * aggrieved line, and a second reverse tear onto his own words reprinted as a
 * headline. The joke is the reprinting, so both headlines have to be on the
 * SAME sheet — the first is still sitting there, untouched, when the second
 * lands beneath it.
 *
 * ep04-shot06-union-cut runs 11.38s / 341 frames.
 *
 * The witness clip and the expert freeze are both delivered footage now, and
 * every beat below is measured off them rather than budgeted.
 */

const S = 30;

export const REV1_STARTS = 4;
export const REV1_FRAMES = 26;
export const REV1_DONE = REV1_STARTS + REV1_FRAMES;

export const HEADLINE1_LAND = REV1_DONE + 6;
export const VO_UNION_STARTS = HEADLINE1_LAND + 4;
export const VO_UNION_FRAMES = Math.round(11.38 * S);

/** Forward tear, into the witness. */
export const FWD_TEAR_STARTS = VO_UNION_STARTS + VO_UNION_FRAMES + 9;
export const FWD_TEAR_FRAMES = 26;
export const FWD_TEAR_DONE = FWD_TEAR_STARTS + FWD_TEAR_FRAMES;

/**
 * The witness's line, measured off the delivered take: ep04-witness-claim.mp4
 * runs 8.00s with speech from 1.10 to 7.32, so 1.10s of generator lead-in is
 * trimmed off the front and the clip ends 0.35s after the last word.
 */
export const WITNESS_TRIM = Math.round(1.1 * S);
export const WITNESS_FRAMES = Math.round((7.32 - 1.1 + 0.35) * S);
export const WITNESS_CHYRON_IN = FWD_TEAR_DONE + 8;

/** Second reverse tear, onto his own words in print. */
export const REV2_STARTS = FWD_TEAR_DONE + WITNESS_FRAMES + 8;
export const REV2_FRAMES = 26;
export const REV2_DONE = REV2_STARTS + REV2_FRAMES;
export const HEADLINE2_STAMP = REV2_DONE + 6;

/**
 * Two blocks on one page, and the geometry is derived rather than chosen: the
 * clippings are 625x928 and 578x790 after cropping, and the one thing this
 * page must not do is put a headline on top of a photograph. Block one takes
 * the top third; block two sits clear below it with its own headline space.
 */
export const BLOCK1 = {left: 150, top: 64, width: 620, clipHeight: 470, rotate: -1.5};
export const BLOCK2 = {left: 240, top: 830, width: 560, clipHeight: 440, rotate: 2};

export const EP04_SHOT_06_DURATION = HEADLINE2_STAMP + 78;

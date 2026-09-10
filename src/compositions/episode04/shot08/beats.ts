/**
 * Episode 04 / Shot 8 — THE COMMITTEE.
 *
 * The series' shortest beat and its fourth of this kind: a reverse tear back
 * out of the photoreal world into paper, one headline, one dry line of
 * narration, out. Built to the same shape as Episode 03's committee card.
 *
 * ep04-shot08-committee-cut is 7.55s / 227 frames.
 */

const S = 30;

export const REV_STARTS = 4;
export const REV_FRAMES = 26;
export const REV_DONE = REV_STARTS + REV_FRAMES;

/** The headline lands before the paper has finished closing, not after. */
export const HEADLINE_LAND = REV_DONE - 8;

export const VO_STARTS = REV_DONE + 6;
export const VO_FRAMES = Math.round(7.55 * S);

/**
 * The clipping is 581x974 after cropping — taller and narrower than Episode
 * 03's ministry page, so the block is narrower to keep the same margin.
 */
export const BLOCK = {left: 200, top: 210, width: 680, clipHeight: 820, rotate: -1.4};

export const EP04_SHOT_08_DURATION = VO_STARTS + VO_FRAMES + 20;

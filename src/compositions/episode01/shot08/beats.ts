/**
 * Episode 01 / Scene 2 / Shot 8 — Institutional Fallout.
 *
 * The busiest transition beat in the episode: paper, then real footage,
 * then paper again with a second headline added — three crossings of the
 * series' reality/reenactment boundary in one shot, each one a tear.
 *
 * The direction of the tear carries the meaning the whole way through:
 * paper reasserting itself over reality closes (REV1, REV2); reality
 * breaking back through opens (FWD). Same PaperTear component both ways —
 * closing is just its progress run from 1 down to 0 instead of up.
 */

const S = 30;

/** Opens on Shot 7's last frame, then the paper closes over it. */
export const REV1_STARTS = 4;
export const REV1_FRAMES = 26;
export const REV1_DONE = REV1_STARTS + REV1_FRAMES;

/** The union headline lands as the page finishes closing, not after. */
export const HEADLINE1_LAND = REV1_DONE - 8;

/** 9.04s take, measured; speech runs 0.30-8.68s. */
export const VO_UNION_STARTS = REV1_DONE + 6;
export const VO_UNION_FRAMES = Math.round(9.04 * S);

/** The page holds a beat after the line finishes, then tears open. */
export const FWD_TEAR_STARTS = VO_UNION_STARTS + VO_UNION_FRAMES + 10;
export const FWD_TEAR_FRAMES = 26;
export const FWD_TEAR_DONE = FWD_TEAR_STARTS + FWD_TEAR_FRAMES;

export const WITNESS2_CHYRON_IN = FWD_TEAR_DONE + 8;
/**
 * 8.00s take; speech runs 0.41-7.11s across four short utterances (two
 * questions, a two-part sentence with the script's own scripted ellipsis,
 * and the closing question). Trimmed a little short of the full clip — the
 * same reasoning as every other clip in this episode: keep the natural tail,
 * not all of the silence past it.
 */
export const WITNESS2_FRAMES = Math.round(7.6 * S);

/** Paper closes back over him once he finishes. */
export const REV2_STARTS = FWD_TEAR_DONE + WITNESS2_FRAMES + 10;
export const REV2_FRAMES = 26;
export const REV2_DONE = REV2_STARTS + REV2_FRAMES;

/**
 * The second headline, landing beside the first rather than replacing it —
 * the page from earlier in the shot is still the same page, so headline 1
 * is still on it.
 */
export const HEADLINE2_STAMP = REV2_DONE + 6;

/** A quick closing beat, per the script — not a full scene. */
export const SHOT_08_DURATION = HEADLINE2_STAMP + 50;

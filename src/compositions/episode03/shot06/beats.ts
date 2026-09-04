/**
 * Episode 03 / Shot 6 — Institutional Fallout.
 *
 * Every change of world is a tear, twice, around one piece of video — the
 * same structure Episode 02's fallout beat used. The tenant is back on
 * camera from Shot 4, more visibly shaken, and he believes he is the injured
 * party, which is why his own words become the second headline without
 * anyone needing to comment on them.
 *
 * Measured, not estimated:
 *
 *   ep03-shot06-assoc.wav  9.36s  speech 0.32-8.90
 *     gaps 2.40-2.60, 4.75-5.20, 7.65-7.88 — the last one right before
 *     "F.A.Q. Syndrome", which the narrator lands completely flat.
 *
 *   ep03-witness-4.mp4  10.01s  speech 0.69-7.45
 *     gaps 2.41-3.58, 4.89-6.33 area, 6.33-7.10
 *     "He gets compensation for being nice?" / "I had a whole speech
 *     prepared," / "rehearsed," / "ready."
 *     The three long gaps are the clipped-evidence delivery the prompt asked
 *     for, and they arrived.
 *
 *   ep03-witness-5.mp4   6.02s  speech 0.26-4.29, gap 1.57-1.95
 *     "I never got to use it." / "Do you know what that does to a person?"
 *
 * Both witness clips keep a short lead trimmed off so the jump cut between
 * them is tight; the paper's own tears cover the joins into and out of them.
 */

const S = 30;

/**
 * A few frames of Shot 5's last frame before the paper comes back over it,
 * so the cut into this shot is invisible. Shot 5's punch-in has already
 * zoomed back out by its final frame, so the held frame is continuous with
 * what the audience was just looking at.
 */
export const REV1_STARTS = 4;
export const REV1_FRAMES = 26;
export const REV1_DONE = REV1_STARTS + REV1_FRAMES;

/** The first headline lands once the page has closed over him. */
export const HEADLINE1_LAND = REV1_DONE + 6;
export const VO_ASSOC_STARTS = HEADLINE1_LAND + 4;
/** 9.36s; speech ends at 8.90. */
export const VO_ASSOC_FRAMES = Math.round(9.36 * S);

/** The page tears open onto the tenant, a beat after the narrator finishes. */
export const FWD_TEAR_STARTS = VO_ASSOC_STARTS + VO_ASSOC_FRAMES + 9;
export const FWD_TEAR_FRAMES = 26;
export const FWD_TEAR_DONE = FWD_TEAR_STARTS + FWD_TEAR_FRAMES;

/** Clip one — the outburst. Lead trimmed to just before "He gets". */
export const W4_SRC_IN = Math.round(0.55 * S);
export const W4_FRAMES = Math.round(7.3 * S);
/** Clip two — the question. A hard jump cut after the first. */
export const W5_IN = FWD_TEAR_DONE + W4_FRAMES;
export const W5_SRC_IN = Math.round(0.16 * S);
export const W5_FRAMES = Math.round(4.63 * S);

export const WITNESS_CHYRON_IN = FWD_TEAR_DONE + 8;

/** The page closes back over him a beat after he stops. */
export const REV2_STARTS = W5_IN + W5_FRAMES + 8;
export const REV2_FRAMES = 26;
export const REV2_DONE = REV2_STARTS + REV2_FRAMES;

/**
 * The second headline — his own words, recontextualised as a claim. Lands
 * once the paper has closed, so the page he is now a story in is the last
 * thing standing.
 */
export const HEADLINE2_STAMP = REV2_DONE + 6;

/**
 * Both headline blocks' geometry, kept here because the one thing this shot
 * must not do is let a headline sit on a photograph.
 *
 * NewsHeadline stacks headline -> quote -> clipping inside one block, so
 * type can never land on that block's own picture. The risk is block two
 * landing on block one, and it is a computable risk rather than a matter of
 * taste: a block's height is
 *   headlineLines*(w*0.098) + w*0.02 + quoteLines*(w*0.0525) + w*0.04 + clipHeight
 * Block one is 701 tall at width 800 (two headline lines, and its quote
 * wraps to two at 47 characters); block two is 556 at width 660. Block one's
 * static foot lands at 781 and block two's top at 852, so there is ~49px of
 * clear paper between them even allowing for the landing punch, and block
 * two's own foot reaches 1430 — inside the 1536 text limit (§15).
 *
 * These are larger than the first pass, which left 270px of dead paper below
 * the second headline on a page that had nothing else on it. The clip heights
 * are set to the crops' real aspects (1.671 and 1.613) rather than picked, so
 * object-fit: cover has nothing to trim and the whole press photo shows.
 */
export const BLOCK1 = {left: 104, top: 80, width: 800, clipHeight: 412, rotate: -1.5};
export const BLOCK2 = {left: 150, top: 852, width: 660, clipHeight: 352, rotate: 2};

export const SHOT_06_DURATION = HEADLINE2_STAMP + 78;

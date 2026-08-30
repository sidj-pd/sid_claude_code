/**
 * Episode 02 / Beat 5 / Shot 5 — The Expert.
 *
 * A straight cut in from Shot 4, no transition device: the script keeps this
 * in the photoreal register, and nothing needs to re-announce a change already
 * made once. He is mid-sentence when we arrive, which is the whole posture of
 * the character — the diagnosis was already under way.
 *
 * The twin of Episode 01's Shot 7, and treated as one. Same term card in the
 * clear strip above his head, same punch-in on his own whiteboard during the
 * kicker, same chyron undercut by its own footnote. Where a beat has a twin it
 * gets the twin's treatment: the comedy depends on the apparatus being
 * identical while the incident is trivially different.
 *
 * One difference: Episode 01 opened on the correspondent's question and cut
 * away to him mid-answer. There is no question here and no cutaway — his three
 * clips run back to back, and what breaks up the take is the punch-in.
 *
 * ---------------------------------------------------------------------------
 * PROVISIONAL: none of the three clips exist yet.
 *
 * The lengths below are the ~9s / ~8s / ~9s the prompts ask for, and every cue
 * inside them is a guess at a performance nobody has recorded. §8 requires
 * these to be offsets into a measured envelope. When the clips land, measure
 * them, replace these values, and delete this warning.
 * ---------------------------------------------------------------------------
 */

const S = 30;

/** Clip 1 — the diagnosis. He is already talking when the shot starts. */
export const A1_STARTS = 0;
export const A1_FRAMES = Math.round(9 * S);

/**
 * The term, named on screen the moment he names it, so the audience gets the
 * acronym and its nonsense expansion at the same time he delivers them rather
 * than having to hold the joke in their head from audio alone.
 */
export const TERM_IN = A1_STARTS + Math.round(1.2 * S);
export const TERM_EXPANSION_IN = A1_STARTS + Math.round(2.6 * S);
export const TERM_OUT = A1_STARTS + Math.round(6.5 * S);

/** Clip 2 — the precedent. */
export const A2_STARTS = A1_STARTS + A1_FRAMES;
export const A2_FRAMES = Math.round(8 * S);

/** Clip 3 — the apology beat and the kicker. */
export const A3_STARTS = A2_STARTS + A2_FRAMES;
export const A3_FRAMES = Math.round(9 * S);

/**
 * The punch-in, onto the whiteboard behind him, over the kicker. Diegetic
 * undercutting: the frame never editorialises against him, it just shows the
 * room — and the arrows connecting his exhibits demonstrably connect to
 * nothing.
 */
export const WHITEBOARD_IN = A3_STARTS + Math.round(4.5 * S);
export const WHITEBOARD_OUT = A3_STARTS + Math.round(8.5 * S);

/** The kicker type, once the push has settled. */
export const KICKER_IN = WHITEBOARD_IN + 14;
export const KICKER_OUT = WHITEBOARD_OUT;
/** Frames between one line arriving and the next — a read-down, not a pop. */
export const KICKER_STAGGER = 7;

export const CHYRON_IN = A1_STARTS + 10;
/**
 * Out before the kicker, and well before it. Raising the lower third to clear
 * the platform chrome (§15) put it in the same band the kicker type runs
 * through, and the chyron was covering NOW — the one word in the shot that
 * has to land. A name card has no business staying up for twenty-six seconds
 * anyway: it identifies him once, early, and goes.
 */
export const CHYRON_OUT = A1_STARTS + A1_FRAMES - 20;

export const SHOT_05_DURATION = A3_STARTS + A3_FRAMES + 20;

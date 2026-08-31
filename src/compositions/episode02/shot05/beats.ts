/**
 * Episode 02 / Beat 5 / Shot 5 — The Expert.
 *
 * A straight cut in from Shot 4, no transition device: the script keeps this in
 * the photoreal register, and nothing needs to re-announce a change already
 * made once. He is mid-sentence when we arrive, which is the posture of the
 * character — the diagnosis was already under way.
 *
 * The twin of Episode 01's Shot 7 and treated as one: term card in the clear
 * strip above his head, punch-in on his own whiteboard during the kicker,
 * chyron undercut by its own footnote.
 *
 * FOUR clips, not the three the prompts asked for. The generator split his
 * speech its own way and condensed it — "It's rare. It's poorly understood.
 * Some don't recover." and "This... this progressed." are not in any take.
 * Transcribed rather than guessed:
 *
 *   1  8.00s  "This is a classic case of STFU syndrome.
 *              Suddenly transparent, fair, and understanding."
 *   2  8.00s  "Under prolonged exposure to healthy work-life boundaries, a
 *              manager's brain can spontaneously begin to communicating clearly."
 *   3 10.01s  "We've seen early symptoms before. A manager saying good point in
 *              a meeting without adding a but. These are usually isolated
 *              incidents."
 *   4  8.00s  "In advanced cases, like this one, the manager may even apologize
 *              first. If anything, he's the one who needs the leave now."
 *
 * He runs 0.189 s/syllable across the four — SLOWER than the narrator's 0.17,
 * which is right for the register. An earlier pass put him at 0.105 by
 * measuring one clip against the whole scripted paragraph; that was wrong and
 * every cue here is derived from the transcribed segments instead.
 */

const S = 30;

/**
 * Each clip's own segment boundaries, from its RMS envelope. Leads are trimmed
 * so the joins are tight — four takes with half a second of silence at each
 * seam would read as four separate interviews.
 */

/** Clip 1 — the term. Segments: 0.23-1.65 / 2.04-3.34 / 4.06-5.28 / 5.86-6.19 / 6.40-7.14 */
export const A1_STARTS = 0;
export const A1_SRC_IN = 0;
export const A1_FRAMES = Math.round(7.4 * S);

/**
 * The term card. He names the syndrome in his second segment (2.04-3.34) and
 * expands it across the remaining three (4.06-7.14), so the card goes up as he
 * says it and the expansion lands as he starts spelling it out.
 */
export const TERM_IN = Math.round(2.04 * S);
export const TERM_EXPANSION_IN = Math.round(4.06 * S);
/** Held a beat past the end of his expansion, then gone. */
export const TERM_OUT = Math.round(8.4 * S);

/** Clip 2 — the mechanism. Speech 0.46-7.21, one break at 3.32-3.85. */
export const A2_STARTS = A1_STARTS + A1_FRAMES;
export const A2_SRC_IN = Math.round(0.4 * S);
export const A2_FRAMES = Math.round(7.2 * S);

/** Clip 3 — the precedent. Speech 0.65-9.47, breaks at 2.11, 4.90, 6.68. */
export const A3_STARTS = A2_STARTS + A2_FRAMES;
export const A3_SRC_IN = Math.round(0.53 * S);
export const A3_FRAMES = Math.round(9.6 * S);

/**
 * Clip 4 — the kicker. Speech 0.18-7.71.
 * Segments: 1.04-2.06 / 2.25-2.86 / 3.28-5.14 / 5.73-7.71
 * That last one is the whole kicker clause, and the 0.59s gap before it is the
 * beat the script asks for.
 */
export const A4_STARTS = A3_STARTS + A3_FRAMES;
export const A4_SRC_IN = Math.round(0.2 * S);
export const A4_FRAMES = Math.round(7.8 * S);

/** Source seconds inside clip 4 -> frame in this shot. */
const IN_A4 = (seconds: number) => A4_STARTS + Math.round(seconds * S) - A4_SRC_IN;

/**
 * The punch-in, onto the whiteboard behind him, over the kicker. It starts
 * inside the 0.59s beat before he speaks, so the move is already under way when
 * the line lands rather than chasing it.
 *
 * Diegetic undercutting: the frame never editorialises against him, it just
 * shows the room — and the arrows connecting his exhibits go nowhere.
 */
export const WHITEBOARD_IN = IN_A4(5.35);
export const WHITEBOARD_OUT = IN_A4(7.95);

/** The kicker type, landing with the clause itself at 5.73s. */
export const KICKER_IN = IN_A4(5.78);
export const KICKER_OUT = WHITEBOARD_OUT;
/** Frames between one line arriving and the next — a read-down, not a pop. */
export const KICKER_STAGGER = 7;

export const CHYRON_IN = A1_STARTS + 10;
/**
 * Out well before the kicker. Raising the lower third to clear the platform
 * chrome (§15) put it in the band the kicker type runs through, where it
 * covered NOW — the one word in the shot that has to land.
 */
export const CHYRON_OUT = A1_STARTS + A1_FRAMES - 20;

export const SHOT_05_DURATION = A4_STARTS + A4_FRAMES + 18;

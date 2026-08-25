/**
 * Episode 01 / Scene 2 / Shot 7 — The Expert.
 *
 * A straight cut, not a tear: the script is explicit that this stays in the
 * photoreal "real interview" register with no transition device. We are
 * already on the other side of the tear from Shot 6, so nothing needs to
 * announce that again.
 *
 * Dr. Ramamurthy's two clips carry his own dialogue, generated with the
 * footage per the pipeline rule from Shot 6 — a talking head cut to
 * synthesised speech does not lip sync. The correspondent's question ahead of
 * them stays off-screen exactly as scripted, so it is TTS under a hold on Dr.
 * Ramamurthy; midway through, a few seconds of the correspondent's OWN clip
 * — the silent stretch after his Shot 6 question, where he is simply
 * listening — are reused as a reaction cutaway, the way a real two-camera
 * interview cuts to the listener without needing a whole second shoot for it.
 *
 * All the delivery timing below is measured off the two clips' RMS
 * envelopes, the same way shot06/beats.ts measures the witness.
 */

const S = 30;

/** "How do you explain what happened?" — measured, 2.20s take. */
export const Q_STARTS = 6;
export const Q_FRAMES = Math.round(2.2 * S);
/** A held beat on Dr. Ramamurthy before he starts. */
export const A1_STARTS = Q_STARTS + Q_FRAMES + Math.round(0.6 * S);

/**
 * Clip 1 — both of his first two lines in one continuous take, the script's
 * own em-dashes landing as the internal pauses: speech runs 0.08-3.20s (the
 * W.T.F. Syndrome line, including spelling it out), 3.90-5.15s ("Willful
 * Traffic-rule Following"), 5.86-7.43s and 7.96-9.68s (the second line's own
 * two dashed clauses). 10.01s at 24fps, conformed to the composition's 30 —
 * used near enough whole, the same as the witness clip in Shot 6.
 */
export const A1_FRAMES = 300;

/**
 * The WTF term itself, called out as text while he says it — a fine-grained
 * read of the same envelope, not just the segment boundary: there is a clear
 * dip in it around 2.0-2.1s (the breath before the acronym) and a sustained
 * run from there to the segment's end at 3.20s covering the three spelled
 * letters and "Syndrome". "Willful Traffic-rule Following" is its own later
 * segment, 3.90-5.15s, and gets its own line rather than arriving with the
 * first — it is the answer to a question the first line has only just posed.
 */
export const WTF_TERM_IN = A1_STARTS + Math.round(2.05 * S);
export const WTF_EXPANSION_IN = A1_STARTS + Math.round(3.9 * S);
export const WTF_OUT = A1_STARTS + Math.round(5.55 * S);

/**
 * The correspondent, reused. His Shot 6 clip is 6.02s long and silent from
 * 2.89s (the end of his question there) onward — this uses only the LAST two
 * seconds of that silence, where he is dipping his head down toward his
 * notes, rather than the whole stretch: a two-second nod reads as a reaction,
 * where five seconds of him just sitting reads as the shot forgetting to cut
 * away.
 */
export const CORR_CUTAWAY_STARTS = A1_STARTS + A1_FRAMES;
export const CORR_CUTAWAY_SRC_IN = Math.round(4.02 * S);
export const CORR_CUTAWAY_FRAMES = Math.round(2 * S);

/**
 * Clip 2 — the last two lines, including the script's own scripted pause
 * before the kicker. Speech: 0.13-1.38s and 2.22-3.79s (the first line's two
 * sentences), then a long silent beat to 5.87s — the "leans in" stage
 * direction landed as an actual pause in the take rather than something to
 * be added after the fact — then 5.87-6.28s ("Frankly,") and 6.82-8.52s (the
 * rest of the kicker). Trimmed a little short of the full 10.01s: the
 * trailing silence past 8.52s runs long enough that keeping all of it would
 * leave the shot sitting on nothing.
 */
export const A2_STARTS = CORR_CUTAWAY_STARTS + CORR_CUTAWAY_FRAMES;
export const A2_FRAMES = Math.round(9.0 * S);

/** His chyron: name, title, and the footnote gag — barely legible on purpose. */
export const CHYRON_IN = A1_STARTS + 10;

/**
 * The whiteboard cutaway, timed to the kicker itself (5.87-8.52s within clip
 * 2) rather than to the pause before it — the punch-in should land on the
 * line that needs undercutting, not on the beat where he is only leaning in.
 * WHITEBOARD_CROP in Shot07Expert.tsx was measured directly off the delivered
 * clip: the board sits upper-right of frame, roughly 70-100% across and
 * 20-58% down.
 */
export const WHITEBOARD_IN = A2_STARTS + Math.round(5.6 * S);
export const WHITEBOARD_OUT = A2_STARTS + Math.round(8.8 * S);

/**
 * The kicker itself, as a caption — arriving once the punch-in has settled
 * (WHITEBOARD_IN + the 14 frames its own push takes to land) rather than at
 * "Frankly," the instant the word starts, so the graphic never fights the
 * camera move for the eye's attention. Held through to the same frame the
 * zoom eases back out on.
 */
export const KICKER_QUOTE_IN = WHITEBOARD_IN + 14;
export const KICKER_QUOTE_OUT = WHITEBOARD_OUT;

export const SHOT_07_DURATION = A2_STARTS + A2_FRAMES + 20;

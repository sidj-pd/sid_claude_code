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
 * The correspondent, reused. His Shot 6 clip runs the question at
 * 1.49-2.89s and is silent from there to its end at 6.02s — him simply
 * listening, head dipping down toward his notes around 5s. That dip is what
 * gets used: a nod-and-look-away reads as more active listening than a
 * static held stare.
 */
export const CORR_CUTAWAY_STARTS = A1_STARTS + A1_FRAMES;
export const CORR_CUTAWAY_SRC_IN = Math.round(3.3 * S);
export const CORR_CUTAWAY_FRAMES = Math.round(2.5 * S);

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

export const SHOT_07_DURATION = A2_STARTS + A2_FRAMES + 20;

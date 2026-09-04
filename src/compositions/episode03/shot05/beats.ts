/**
 * Episode 03 / Shot 5 — The Expert.
 *
 * A straight cut in from Shot 4, no transition device — the script keeps this
 * in the photoreal register throughout, and nothing needs to re-announce a
 * change already made once. He is mid-sentence when we arrive (the script's
 * own dialogue starts on an em-dash), which is the posture of the character:
 * the diagnosis was already under way.
 *
 * The twin of Episode 01's Shot 7 and Episode 02's Shot 5: term card in the
 * clear strip above his head, punch-in on his own whiteboard during the
 * kicker, chyron undercut by its own footnote. No correspondent question and
 * no clinical-findings checklist this time — the script asks for neither,
 * and six clips of monologue already fill the shot without one.
 *
 * All six clips landed exactly as asked and are measured (scripts/measure-vo.py
 * against each clip's extracted audio track):
 *
 *   ep03-expert-1.mp4   8.00s  speech 0.69-7.07
 *     gaps 2.29-2.65, 2.81-3.39, 4.32-5.38, 5.85-6.38
 *     "This is a textbook case of" / "F." / "A.Q. syndrome." / "Full amount" / "questions free."
 *     — the long gap at 4.32-5.38 is the sentence boundary; the two short
 *       gaps around 2.3-3.4 are him spelling the acronym out letter by letter.
 *
 *   ep03-expert-2.mp4  10.01s  speech 0.11-9.71
 *     gaps 2.36-3.07, 5.71-6.22, 7.69-7.98
 *     One continuous delivery of the whole "rare psychological reflex" sentence.
 *
 *   ep03-expert-3.mp4  10.01s  speech 1.26-6.13, gaps 2.60-2.84, 4.13-5.21
 *     "It's been observed maybe four, five times" / "in recorded history."
 *
 *   ep03-expert-4.mp4  10.01s  speech 1.44-9.12, gaps 2.55-3.46, 6.17-7.10
 *     "Early signs are subtle." / "a landlord not raising rent by 20% at
 *     renewal," / "replying to a maintenance request within the week."
 *
 *   ep03-expert-5.mp4  10.01s  speech 0.06-6.93 (the first 0.02s is noise, not
 *     a word — treated as silence to 1.63), gaps 2.22-2.57, 3.63-4.59,
 *     5.15-5.49, 6.02-6.39
 *     "Left unchecked, it can progress to this." / "Full deposit, same day,
 *     no fuss."
 *
 *   ep03-expert-6.mp4  10.01s  speech 2.21-5.85, gap 2.66-3.45
 *     The 2.21s lead is the script's own "leans in" beat, landing as silence
 *     before he speaks rather than as a direction that has to be illustrated
 *     separately — same device Shot 4's "eyes drift" beat used. "Frankly,"
 *     then a second pause, then the whole kicker clause.
 *
 * Leads are trimmed on clips 2-5 so the joins are tight; clip 1 keeps its
 * natural lead since it opens the shot, and clip 6 keeps its full 2.21s lead
 * because that silence IS the lean-in beat.
 */

const S = 30;

/** Clip 1 — the diagnosis and the acronym. */
export const A1_STARTS = 0;
export const A1_SRC_IN = 0;
export const A1_FRAMES = Math.round(7.4 * S);

/**
 * The term card. He finishes naming the syndrome at the sentence boundary
 * (4.32s, where the long gap starts) and begins spelling out the expansion
 * at 5.38s ("Full amount"), so the card goes up right as the diagnosis
 * lands and the expansion arrives a beat later — read the initials, wonder,
 * then get told, rather than being handed both at once.
 */
export const TERM_IN = Math.round(4.32 * S);
export const TERM_EXPANSION_IN = Math.round(5.38 * S);
/** Held a beat past clip 1's own end, into clip 2. */
export const TERM_OUT = Math.round(8.07 * S);

/** Clip 2 — the reflex, one continuous sentence. */
export const A2_STARTS = A1_STARTS + A1_FRAMES;
export const A2_SRC_IN = 0;
export const A2_FRAMES = Math.round(9.9 * S);

/** Clip 3 — the citation. */
export const A3_STARTS = A2_STARTS + A2_FRAMES;
export const A3_SRC_IN = Math.round(1.16 * S);
export const A3_FRAMES = Math.round(5.47 * S);

/** Clip 4 — the early signs. */
export const A4_STARTS = A3_STARTS + A3_FRAMES;
export const A4_SRC_IN = Math.round(1.34 * S);
export const A4_FRAMES = Math.round(8.08 * S);

/** Clip 5 — the progression. */
export const A5_STARTS = A4_STARTS + A4_FRAMES;
export const A5_SRC_IN = Math.round(1.53 * S);
export const A5_FRAMES = Math.round(5.7 * S);

/** Clip 6 — the kicker, lead kept in full for the lean-in. */
export const A6_STARTS = A5_STARTS + A5_FRAMES;
export const A6_SRC_IN = 0;
export const A6_FRAMES = Math.round(7.35 * S);

/** Source seconds inside clip 6 -> frame in this shot. */
const IN_A6 = (seconds: number) => A6_STARTS + Math.round(seconds * S) - A6_SRC_IN;

/**
 * The punch-in onto his own whiteboard, over the kicker. Starts a beat
 * before he speaks — 1.0s into the clip, inside the silent lean — so the
 * move is already under way when "Frankly," lands rather than chasing it.
 * WHITEBOARD_CROP itself is measured off ep03-expert-6.mp4's own first
 * frame (a grid overlay + several trial crops, not guessed): the board
 * sits further right and needs a tighter zoom in this footage than Episodes
 * 01 and 02's numbers gave it, so those numbers were not reused.
 */
export const WHITEBOARD_IN = IN_A6(1.0);
export const WHITEBOARD_OUT = A6_STARTS + A6_FRAMES - 4;

/** The kicker type, landing with "Frankly," itself. */
export const KICKER_IN = IN_A6(2.21);
export const KICKER_OUT = WHITEBOARD_OUT;
/** Frames between one line arriving and the next — a read-down, not a pop. */
export const KICKER_STAGGER = 8;

export const CHYRON_IN = A1_STARTS + 10;
/**
 * Held across clips 1 AND 2 — about 17s, where both previous episodes' expert
 * shots dropped theirs after ~6s. Forty-five seconds of a man talking with
 * nothing else on screen reads as empty, and the lower third is the cheapest
 * thing in the frame that fixes it. It still has to be gone before the
 * findings list below arrives, because at the height §15 forces the chyron to
 * (SAFE_BOTTOM_Y - 230) the two occupy the same band.
 */
export const CHYRON_OUT = A3_STARTS - 12;

/** Source seconds inside clips 3, 4 and 5 -> frame in this shot. */
const IN_A3 = (seconds: number) => A3_STARTS + Math.round(seconds * S) - A3_SRC_IN;
const IN_A4 = (seconds: number) => A4_STARTS + Math.round(seconds * S) - A4_SRC_IN;
const IN_A5 = (seconds: number) => A5_STARTS + Math.round(seconds * S) - A5_SRC_IN;

/**
 * His claims, written down as findings while he makes them.
 *
 * Clips 3 to 5 are nineteen seconds of a talking head with nothing over them
 * — the same hole Episode 02's expert shot had and filled the same way, with
 * the newsprint chit the witness's checklist already uses. It ties the two
 * photoreal shots of this episode to each other as well.
 *
 * Each is cut to the segment where he actually says it, off the measured
 * envelopes above. The wording is his, turned into case-note register: that
 * is the joke the checklist made in Shot 4 too — nothing he describes is
 * remarkable, and writing it down as a clinical finding is what makes it
 * absurd.
 *
 * `in` is where the line is written, `tick` where it is ticked, and the gap
 * between them is what makes it read as a record being kept rather than a
 * subtitle.
 */
export const FINDINGS = [
	// Clip 3, second segment: "maybe four, five times in recorded history."
	{text: 'PRECEDENT: 4-5 CASES ON RECORD', in: IN_A3(2.84), tick: IN_A3(6.13)},
	// Clip 4, second segment: "not raising rent by 20% at renewal,"
	{text: 'EARLY SIGN: NO 20% HIKE AT RENEWAL', in: IN_A4(3.46), tick: IN_A4(6.17)},
	// Clip 4, third segment: "replying to a maintenance request within the week."
	{text: 'EARLY SIGN: REPLIED WITHIN A WEEK', in: IN_A4(7.1), tick: IN_A4(9.12)},
	// Clip 5, third segment: "Full deposit, same day, no fuss."
	{text: 'ADVANCED: FULL DEPOSIT, SAME DAY', in: IN_A5(4.59), tick: IN_A5(6.93)},
];

/** The header chit above the list. */
export const FINDINGS_HEADER_IN = FINDINGS[0].in - 8;
/**
 * Gone before the punch-in. The kicker wants the frame to itself, and a list
 * of findings still on screen would compete with the one line that has to
 * land.
 */
export const FINDINGS_OUT = WHITEBOARD_IN - 26;

export const SHOT_05_DURATION = A6_STARTS + A6_FRAMES + 18;

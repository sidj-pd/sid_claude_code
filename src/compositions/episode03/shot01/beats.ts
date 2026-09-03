/**
 * Episode 03 / Shot 1 — The Empty Flat.
 *
 * The series' first shot built in the assembly style: the frame opens EMPTY and
 * the flat builds itself, piece by piece, before anyone is in it. That is the
 * reference's signature (docs/EP03-STYLE-NOTES.md) and the opposite of
 * EP03-SHOT01-SPEC.md, which has everything pre-placed and found by a camera
 * drag — Episodes 01 and 02's grammar, and the slowest thing in the series.
 *
 * ---------------------------------------------------------------------------
 * The spec's 360 frames cannot hold this shot's audio.
 *
 * It puts the VO at frame ~330 of 360, which leaves 30 frames for a line that
 * measures 8.52s (256 frames). That number was set before any audio existed.
 * Measured, the shot's three takes total 16.96s of speech before a single pause
 * between them:
 *
 *   ep03-shot01-tenant    4.72s  speech 0.27-4.36
 *     0.27-1.16  "About the deposit, sir —"
 *     1.43-3.00  "the wall, that stain,"
 *     3.19-4.36  "that was already like that when I—"
 *
 *   ep03-shot01-landlord  3.72s  speech 0.32-3.34
 *     0.32-0.91  "Forget it."      then 0.89s of nothing
 *     1.80-2.19  "Full amount."    then 0.69s of nothing
 *     3.11-3.34  "Here."
 *
 *   ep03-shot01-vo        8.52s  speech 0.33-8.03
 *     0.33-0.98  "Every day,"
 *     1.43-4.35  "thousands of security deposits are settled in Bangalore."
 *     5.14-7.69  "This is the story of the one that was"
 *     7.89-8.03  "returned in full."
 *
 * So this runs 702 frames, 23.4s. A line that does not fit means a longer shot,
 * never a faster take. If twelve seconds is a hard requirement instead, the
 * dialogue has to become silent speech bubbles and the VO has to move to Shot 2.
 * ---------------------------------------------------------------------------
 */

const S = 30;

/**
 * The assembly pulse. The reference runs at 91 BPM — 19.8 frames a beat — and
 * while its music is not being used, that rate is a good upper bound on how
 * long the frame may sit unchanged before the style stops reading. Nineteen
 * frames, eight arrivals, and the flat is built before anyone speaks.
 */
export const PULSE = 19;
const BEAT = (n: number) => 6 + n * PULSE;

export const WALL_AT = BEAT(0);
export const CRACK_AT = BEAT(1);
export const POSTER_AT = BEAT(2);
export const STAIN_AT = BEAT(3);
export const FLOOR_AT = BEAT(4);
export const TILE_AT = BEAT(5);
export const TENANT_AT = BEAT(6);
/**
 * Not an asset any more — the keys are in the tenant's hand in his own artwork,
 * which is one fewer cutout and one fewer thing that can drift out of register.
 * The slot is kept because an accent lands on it.
 */
export const ACCENT_BEAT = BEAT(6) + 8;

/** He starts talking once the room he is standing in exists. */
export const TENANT_SPEAKS = BEAT(7) + 11;
export const TENANT_FRAMES = Math.round(4.72 * S);

/**
 * The landlord steps in before the tenant has finished — the tenant's line is
 * written to be cut off ("...when I—") and the take delivers it cut off, so the
 * interruption has to be visible before it is audible.
 */
export const LANDLORD_ENTERS = TENANT_SPEAKS + TENANT_FRAMES - 16;
export const LANDLORD_SPEAKS = TENANT_SPEAKS + TENANT_FRAMES + 4;
export const LANDLORD_FRAMES = Math.round(3.72 * S);

/** The cash moves on "Here." — 3.11s into his take. */
export const CASH_AT = LANDLORD_SPEAKS + Math.round(3.11 * S);

/** And the narration closes it, over the aftermath. */
export const VO_AT = CASH_AT + 31;
export const VO_FRAMES = Math.round(8.52 * S);

export const SHOT_01_DURATION = VO_AT + VO_FRAMES + 26;

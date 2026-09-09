/**
 * Episode 04 / Shot 0 — THE COLD OPEN.
 *
 * The frame opens already buried. Thirteen bank props are scattered across it
 * from the very first frame, covering the man who works there completely, and
 * then they are pulled off one at a time — yanked out of frame, as if each
 * were on an invisible string — until he is sitting there alone, exactly where
 * he was the whole time. Then the lights go down around him.
 *
 * WHY THERE IS NO BUILD
 *
 * The first cut of this shot built the pile up first and took it apart after.
 * It was rendered and it was wrong for two reasons. The build spends two and a
 * half seconds explaining a joke whose whole content is the removal, and worse,
 * a shot that starts nearly empty and fills up reads as a shot still loading.
 * Opening on the mess costs nothing and puts the audience straight into it.
 *
 * The one structural idea kept from the director's reference: THE SUBJECT IS
 * UNDER EVERYTHING FROM FRAME 0 AND IS NEVER PLACED. He has no entrance. He is
 * simply what is left when everything else has been taken away, which is the
 * joke, and it only works if he was demonstrably there all along.
 *
 * Three acts:
 *
 *   BURIED  f0-f12     the whole bank at once, nobody visible in it.
 *   PULL    f12-f96    thirteen props yanked out of frame one at a time, from
 *                      the centre outwards, so he is glimpsed through the
 *                      gaps long before the last one goes.
 *   ALONE   f96-f110   him, on bare paper, unchanged.
 *
 * Then the vignette closes and leaves him in a disc of light.
 *
 * Frames are 30fps.
 */

/**
 * The stop-motion pulse. The reference's flat-lay was authored at ~18.75fps
 * and conformed to 25 — one duplicated frame in every four. At 30fps the
 * nearest honest quantisation is every 2 frames: fifteen hops a second, which
 * reads as hands moving between shutter clicks rather than as a stutter.
 * Everything stepped in this shot uses this one value, and everything
 * quantises BEFORE easing, never after.
 */
export const STEP = 2;

/** The full pile, held, so the mess registers before anything moves. */
export const PULL_START = 12;

/**
 * A prop is pulled every PULL_EVERY frames. Must be a multiple of STEP or the
 * yanks land between the stop-motion hops and the sequence stops reading as
 * one rhythm. Thirteen at six frames apart is 2.6s of clearing.
 */
export const PULL_EVERY = 6;

/**
 * One yank, from first twitch to out of frame.
 *
 * A string is not a fade and it is not a cut. It has three frames of it: the
 * prop tugs slightly the WRONG way first, then leaves accelerating, and then
 * it is simply not there. The back-tug is two frames and does almost nothing
 * on its own, but without it a prop reads as deleted rather than pulled — the
 * eye needs the anticipation to believe something took hold of it.
 */
export const PULL_ANTICIPATE = 2;
export const PULL_EXIT = 8;
export const PULL_FRAMES = PULL_ANTICIPATE + PULL_EXIT;

/** Last prop starts at f84 and is clear of the frame by f94. */
export const PULL_END = 96;

/** Him alone on bare paper, before the light changes. */
export const ALONE_END = 110;

/**
 * The vignette. Not a cut this time: the props leaving is already a sequence
 * of hard events, and a fourteenth hard event on top of them reads as a
 * glitch. The light closes over about half a second instead, which is the
 * only easing in the shot and is why it registers as a different kind of
 * moment.
 */
export const VIGNETTE_IN = 110;
export const VIGNETTE_FRAMES = 16;

/** A held beat on him alone in the light. */
export const EP04_SHOT_00_DURATION = 150;

/**
 * The bottom of a vertical frame does not belong to us.
 *
 * On Instagram Reels and YouTube Shorts the lower fifth of the screen is
 * covered by the platform's own furniture — handle, caption, follow button,
 * audio credit, the row of action icons. Anything we set down there is either
 * hidden or read through someone else's UI.
 *
 * So: no TEXT below SAFE_BOTTOM_Y. Picture may run to the edge and should —
 * a desk that stops short of the frame looks like a mistake, and the platform
 * chrome sitting over paper is fine. It is only copy that has to stay clear,
 * because copy that cannot be read is the same as copy that was never set.
 *
 * This is a delivery constraint, not a taste one. It applies to every episode
 * and every shot, and it outranks composition: if a caption will not fit above
 * the line, the layout moves up, the type gets smaller, or the words get cut.
 */

export const FRAME_W = 1080;
export const FRAME_H = 1920;

/** Fraction of the frame height the platforms take at the bottom. */
export const SOCIAL_UI_FRACTION = 0.2;

/** No text may start, or extend, below this y. 1536 at 1080x1920. */
export const SAFE_BOTTOM_Y = FRAME_H * (1 - SOCIAL_UI_FRACTION);

/**
 * Highest y a block of `height` may sit at and still clear the chrome.
 * Use it rather than eyeballing: `top: safeTop(blockHeight)` pins a caption to
 * the lowest legible line in the frame.
 */
export const safeTop = (height: number): number => SAFE_BOTTOM_Y - height;

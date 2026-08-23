/**
 * Quantizes a frame number into discrete steps so motion built on top of it
 * (translateX, rotation, etc.) hops between fixed positions instead of
 * easing smoothly — the "stop motion" look for paper-cutout puppets.
 *
 * @param frame current frame (e.g. from useCurrentFrame(), possibly offset)
 * @param stepSize how many frames each discrete step lasts. Larger = chunkier hops.
 * @returns the frame snapped down to the start of its step, plus how many
 *          steps have elapsed — both useful inputs to interpolate/spring.
 */
export const useStopMotionStep = (
	frame: number,
	stepSize: number,
): {steppedFrame: number; stepIndex: number} => {
	const clamped = Math.max(0, frame);
	const stepIndex = Math.floor(clamped / stepSize);
	const steppedFrame = stepIndex * stepSize;

	return {steppedFrame, stepIndex};
};

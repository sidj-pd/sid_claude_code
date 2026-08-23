import {spring, useVideoConfig} from 'remotion';

export type PopInConfig = {
	delay?: number;
	damping?: number;
	stiffness?: number;
	mass?: number;
};

/**
 * A springy 0->1 progress value with a bit of overshoot bounce, meant to
 * drive a scale/translate "pop" entrance. Low damping relative to stiffness
 * is what gives the bounce — tune per asset for a snappier or heavier feel.
 */
export const usePopIn = (frame: number, config?: PopInConfig): number => {
	const {fps} = useVideoConfig();
	const {delay = 0, damping = 9, stiffness = 160, mass = 0.7} = config ?? {};
	return spring({frame: frame - delay, fps, config: {damping, stiffness, mass}});
};

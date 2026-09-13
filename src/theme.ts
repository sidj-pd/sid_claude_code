export const WIDTH = 1080;
export const HEIGHT = 1920;

/** Safe width for text: leaves a margin so nothing touches the frame edge. */
export const SAFE_WIDTH = 960;

/** Warm amber fill with a dark outline — reads over both night and daylight footage. */
export const palette = {
  fillTop: '#FFDF95',
  fillBottom: '#F2A93B',
  stroke: '#241505',
  glow: 'rgba(255,255,255,0.9)',
} as const;

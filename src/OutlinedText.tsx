import React from 'react';
import {fitText} from '@remotion/layout-utils';
import {palette, SAFE_WIDTH} from './theme';

export type OutlinedTextProps = {
  children: string;
  fontFamily: string;
  fontWeight?: number;
  /** Desired size; shrunk automatically if the line would exceed maxWidth. */
  size: number;
  maxWidth?: number;
  letterSpacing?: number;
  strokeRatio?: number;
  glowRatio?: number;
  fillTop?: string;
  fillBottom?: string;
  strokeColor?: string;
};

/**
 * Display text with an outside-only dark outline and a tight white halo.
 *
 * The outline is a second copy behind the fill: -webkit-text-stroke centres the
 * stroke on the glyph edge, so repainting the fill on top keeps the inner half
 * from eating the letterform. Kannada needs this — the ligature loops and
 * vattaksharas close up entirely under a centred stroke.
 */
export const OutlinedText: React.FC<OutlinedTextProps> = ({
  children,
  fontFamily,
  fontWeight = 700,
  size,
  maxWidth = SAFE_WIDTH,
  letterSpacing = 0,
  strokeRatio = 0.055,
  glowRatio = 0.07,
  fillTop = palette.fillTop,
  fillBottom = palette.fillBottom,
  strokeColor = palette.stroke,
}) => {
  // Shrink to fit rather than overflow the 1080px frame.
  const fitted = fitText({
    text: children,
    withinWidth: maxWidth,
    fontFamily,
    fontWeight,
    letterSpacing: `${letterSpacing}px`,
  });
  const fontSize = Math.min(size, fitted.fontSize);

  const strokeWidth = fontSize * strokeRatio;
  const glow = fontSize * glowRatio;

  const base: React.CSSProperties = {
    fontFamily,
    fontWeight,
    fontSize,
    lineHeight: 1.3,
    letterSpacing,
    whiteSpace: 'pre',
    margin: 0,
    // Kannada sits low in the em box; padding keeps the halo from clipping.
    padding: `${fontSize * 0.28}px ${fontSize * 0.2}px`,
  };

  return (
    <div style={{position: 'relative', display: 'inline-block'}}>
      <div
        style={{
          ...base,
          color: strokeColor,
          WebkitTextStroke: `${strokeWidth}px ${strokeColor}`,
          filter: [
            `drop-shadow(0 0 ${glow * 0.5}px ${palette.glow})`,
            `drop-shadow(0 0 ${glow}px ${palette.glow})`,
            `drop-shadow(0 ${glow * 0.3}px ${glow * 0.6}px rgba(0,0,0,0.45))`,
          ].join(' '),
        }}
      >
        {children}
      </div>
      <div
        style={{
          ...base,
          position: 'absolute',
          inset: 0,
          background: `linear-gradient(180deg, ${fillTop} 0%, ${fillBottom} 100%)`,
          WebkitBackgroundClip: 'text',
          backgroundClip: 'text',
          color: 'transparent',
        }}
      >
        {children}
      </div>
    </div>
  );
};

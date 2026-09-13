import React from 'react';
import {AbsoluteFill} from 'remotion';
import {OutlinedText} from './OutlinedText';
import {copy} from './copy';
import {palette, SAFE_WIDTH} from './theme';
import {FontGate} from './FontGate';

export type Pairing = {
  /** Font for the Kannada episode title. */
  kannada: string;
  kannadaWeight: number;
  /** Font for the English "EPISODE 01" label. */
  latin: string;
  latinWeight: number;
  /** Per-font optical size correction — x-heights differ a lot across these. */
  titleSize: number;
  labelSize: number;
  labelTracking: number;
};

/** A short rule either side of the English label. */
const Rule: React.FC = () => (
  <div
    style={{
      width: 110,
      height: 6,
      borderRadius: 3,
      background: palette.fillBottom,
      boxShadow: `0 0 10px ${palette.glow}, 0 0 0 3px ${palette.stroke}`,
    }}
  />
);

export const EpisodeCard: React.FC<{pairing: Pairing}> = ({pairing}) => (
  <FontGate>
  <AbsoluteFill
    style={{
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'column',
    }}
  >
    <div style={{display: 'flex', alignItems: 'center', gap: 26}}>
      <Rule />
      <OutlinedText
        fontFamily={pairing.latin}
        fontWeight={pairing.latinWeight}
        size={pairing.labelSize}
        letterSpacing={pairing.labelTracking}
        maxWidth={SAFE_WIDTH - 300}
        strokeRatio={0.075}
      >
        {copy.episodeLabel}
      </OutlinedText>
      <Rule />
    </div>

    <div style={{marginTop: -6}}>
      <OutlinedText
        fontFamily={pairing.kannada}
        fontWeight={pairing.kannadaWeight}
        size={pairing.titleSize}
      >
        {copy.episodeTitle}
      </OutlinedText>
    </div>
  </AbsoluteFill>
  </FontGate>
);

export const pairings: Record<string, Pairing> = {
  // Modern humanist Kannada, tall condensed Latin. Clean and contemporary.
  A: {kannada: 'Anek Kannada', kannadaWeight: 800, latin: 'Bebas Neue', latinWeight: 400, titleSize: 150, labelSize: 78, labelTracking: 8},
  // Serif Kannada with a heavy grotesque. Editorial, matches the investigative tone.
  B: {kannada: 'Noto Serif Kannada', kannadaWeight: 900, latin: 'Archivo Black', latinWeight: 400, titleSize: 140, labelSize: 58, labelTracking: 4},
  // Heaviest Kannada available paired with Anton. Loud, news-bulletin energy.
  C: {kannada: 'Noto Sans Kannada', kannadaWeight: 900, latin: 'Anton', latinWeight: 400, titleSize: 140, labelSize: 68, labelTracking: 5},
  // Benne is a calligraphic Kannada serif; Oswald keeps the label compact.
  D: {kannada: 'Benne', kannadaWeight: 400, latin: 'Oswald', latinWeight: 700, titleSize: 160, labelSize: 66, labelTracking: 7},
  // Hubballi is light and airy — the understated option.
  E: {kannada: 'Hubballi', kannadaWeight: 400, latin: 'Bebas Neue', latinWeight: 400, titleSize: 185, labelSize: 78, labelTracking: 8},
};

import React from 'react';
import {Composition} from 'remotion';
import './fonts.css';
import {WIDTH, HEIGHT} from './theme';
import {EpisodeCard, pairings} from './EpisodeCard';

// Stills only — each renders to a transparent PNG for overlaying in CapCut.
const still = {durationInFrames: 1, fps: 30, width: WIDTH, height: HEIGHT};

export const RemotionRoot: React.FC = () => (
  <>
    {Object.entries(pairings).map(([key, pairing]) => (
      <Composition
        key={key}
        id={`Ep1-${key}`}
        component={EpisodeCard}
        defaultProps={{pairing}}
        {...still}
      />
    ))}
  </>
);

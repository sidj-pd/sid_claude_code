import React from 'react';
import {AbsoluteFill} from 'remotion';
import {OutlinedText} from './OutlinedText';
import {copy} from './copy';

const Stack: React.FC<{children: React.ReactNode; gap?: number}> = ({
  children,
  gap = 0,
}) => (
  <AbsoluteFill
    style={{
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'column',
      gap,
    }}
  >
    {children}
  </AbsoluteFill>
);

/** Line 1 + line 2 of the series title, the hero lockup. */
export const SeriesTitle: React.FC = () => (
  <Stack gap={-30}>
    <OutlinedText size={150}>{copy.titleLine1}</OutlinedText>
    <OutlinedText size={150}>{copy.titleLine2}</OutlinedText>
  </Stack>
);

/** "ಹೊಸ ಕನ್ನಡ ಮಿನಿ ಸರಣಿ" — the New Kannada Miniseries kicker. */
export const Kicker: React.FC = () => (
  <Stack>
    <OutlinedText size={92} letterSpacing={2}>
      {copy.kicker}
    </OutlinedText>
  </Stack>
);

/** Kicker above the title — the full opening lockup. */
export const TitleCard: React.FC = () => (
  <Stack gap={10}>
    <OutlinedText size={86} letterSpacing={2}>
      {copy.kicker}
    </OutlinedText>
    <div style={{height: 26}} />
    <OutlinedText size={150}>{copy.titleLine1}</OutlinedText>
    <div style={{marginTop: -30}}>
      <OutlinedText size={150}>{copy.titleLine2}</OutlinedText>
    </div>
  </Stack>
);

/** "ಸಂಚಿಕೆ ೧" on its own. */
export const EpisodeNumber: React.FC = () => (
  <Stack>
    <OutlinedText size={110} letterSpacing={3}>
      {copy.episodeNumber}
    </OutlinedText>
  </Stack>
);

/** "ಒಂದು ರೈಲಿನ ಪಯಣ" on its own. */
export const EpisodeName: React.FC = () => (
  <Stack>
    <OutlinedText size={132}>{copy.episodeName}</OutlinedText>
  </Stack>
);

/** Episode number above episode name. */
export const EpisodeCard: React.FC = () => (
  <Stack gap={-10}>
    <OutlinedText size={88} letterSpacing={3}>
      {copy.episodeNumber}
    </OutlinedText>
    <OutlinedText size={132}>{copy.episodeName}</OutlinedText>
  </Stack>
);

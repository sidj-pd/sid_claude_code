# Kannada Miniseries Titles

Remotion project that renders title cards as **1080x1920 PNGs with a
transparent alpha channel**, for overlaying directly on footage in CapCut.

## Conventions

- Series and episode labels are set in English; only the series title and the
  episode title are Kannada.
- Text auto-shrinks to fit `SAFE_WIDTH` (960px), so a longer episode title can
  never overflow the frame.

## Usage

```bash
npm install
npm run render            # renders every composition to out/
node render.mjs Ep1-A     # renders a single option
npm run studio            # interactive preview
```

Text lives in `src/copy.ts`; font pairings in `src/EpisodeCard.tsx`.

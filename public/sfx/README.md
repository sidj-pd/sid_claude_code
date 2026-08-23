# SFX assets

Drop the two cues from the asset checklist here, then wire them up:

- `paper-riffle.wav` (or `.mp3`) — pitch-shiftable, used by `<PageFlipTransition>`
  on every flip. Pass it via `sfxSrc={staticFile('sfx/paper-riffle.wav')}`, and
  bump `sfxPlaybackRate` per flip for the Beat 4 heartbeat-speedup effect
  (already wired in `src/compositions/beats/Beat4IconGrabBag.tsx`).
- `stamp-thud.wav` (or `.mp3`) — used once by `<StampImpact>` in
  `src/compositions/beats/Beat5TitleDrop.tsx`. Pass it via
  `sfxSrc={staticFile('sfx/stamp-thud.wav')}`.

Until these files exist, both components render silently — `sfxSrc` is
optional and simply skips mounting `<Audio>` when omitted.

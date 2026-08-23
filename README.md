# Bizzaro Bangalore — Opening Montage

Remotion project for the show's opening montage: 0:00–0:12 (360 frames @
30fps, 1080x1920 vertical) leading into the Scene 1 cold open.

## Setup

```bash
npm install
```

## Preview

```bash
npm start
```

Opens the Remotion Studio at the `OpeningMontage` composition.

## Render

```bash
npm run build
```

Outputs `out/opening-montage.mp4`.

## Structure

```
src/
  components/
    useStopMotionStep.ts   quantizes a frame into discrete hop steps
    NewsprintTexture.tsx   procedural paper grain + halftone overlay
    PaperCutout.tsx        base wrapper for any landmark/character cutout
    PageFlipTransition.tsx reusable 3D page-turn wipe with SFX cue slot
    RansomHeadlineText.tsx kinetic ransom-note title type
    StampImpact.tsx        title-drop stamp punch effect
  assets/
    cutouts.tsx             placeholder paper-cutout illustrations (see below)
  compositions/
    OpeningMontage.tsx       assembles all 5 beats on the timeline
    beats/                   one file per beat from the spec
  Root.tsx                   registers the OpeningMontage composition
public/
  sfx/                       drop paper-riffle / stamp-thud audio here (see public/sfx/README.md)
```

The four reusable primitives (`PaperCutout`, `PageFlipTransition`,
`RansomHeadlineText`, `useStopMotionStep`) plus `StampImpact` and
`NewsprintTexture` are built standalone in `src/components/` so future
episodes can import them directly.

## Placeholder art

`src/assets/cutouts.tsx` currently renders each landmark/character as a flat
geometric SVG (not the final newsprint-collage art from the asset
checklist), so the whole montage is playable and timed correctly today.
To swap in real art: replace a cutout's component body in that file (or
point `CUTOUT_REGISTRY[key]` at a new component built from layered PNGs) —
`<PaperCutout>` and the rest of the pipeline don't need to change.

## SFX

`<PageFlipTransition>` and `<StampImpact>` both accept an optional `sfxSrc`
prop and skip rendering `<Audio>` when it's omitted, which is the current
state (no audio files exist yet). See `public/sfx/README.md` for where to
drop `paper-riffle.*` and `stamp-thud.*` and how to wire them in.

## Sandbox note

`remotion.config.ts` points at a Chromium binary preinstalled at
`/opt/pw-browsers/...` when present, since some sandboxes block the network
egress Remotion needs to download its own browser. On a machine without
that path, this is a no-op and Remotion falls back to its normal behavior.

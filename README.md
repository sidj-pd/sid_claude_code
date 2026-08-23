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
    cutouts.tsx             registry mapping each asset key to its image (see below)
  compositions/
    OpeningMontage.tsx       assembles all 5 beats on the timeline
    beats/                   one file per beat from the spec
  Root.tsx                   registers the OpeningMontage composition
public/
  cutouts/                   generated paper-cutout art, one JPG per landmark/character
  sfx/                       drop paper-riffle / stamp-thud audio here (see public/sfx/README.md)
```

The four reusable primitives (`PaperCutout`, `PageFlipTransition`,
`RansomHeadlineText`, `useStopMotionStep`) plus `StampImpact` and
`NewsprintTexture` are built standalone in `src/components/` so future
episodes can import them directly.

## Cutout art

`src/assets/cutouts.tsx` maps each `CutoutAsset` key to a generated image in
`public/cutouts/` (rendered via Remotion's `<Img>`). Each source image is a
flat ~4:3 JPG on a plain cream backdrop, no alpha transparency — `PaperCutout`
displays it with `object-fit: contain` inside whatever box a beat gives it,
and each beat's own background is picked to closely match the art's backdrop
so the card reads as a clean torn-paper piece rather than a photo with visible
edges. Since the art already has its own grain/halftone baked in, every beat
passes `textureOpacity={0}` to `<PaperCutout>` to avoid double-processing it.

To regenerate or swap an asset: replace the file in `public/cutouts/` (same
name) or point `CUTOUT_REGISTRY[key]` in `cutouts.tsx` at a new file —
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

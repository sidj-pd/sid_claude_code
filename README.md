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
    usePopIn.ts             springy bounce-in progress value
    NewsprintTexture.tsx   procedural paper grain + halftone overlay
    GlassShimmer.tsx        light-sweep pass for glass-fronted buildings
    PaperCutout.tsx        base wrapper for any landmark/character cutout
    PageFlipTransition.tsx reusable 3D page-turn wipe with SFX cue slot
    RansomHeadlineText.tsx kinetic ransom-note title type
    StampImpact.tsx        title-drop stamp punch effect
  assets/
    cutouts.tsx             registry mapping each asset key to its image (see below)
  compositions/
    OpeningMontage.tsx       assembles the background + all 6 assets + title
    montage/
      lifecycle.ts           shared hero->rest->finale->flip-down transform math
      timeline.ts             global frame numbers, rest/finale slot positions
      TitleFinale.tsx         headline + stamp
      assets/                 one persistent component per location/vehicle
  Root.tsx                   registers the OpeningMontage composition
public/
  cutouts/                   generated paper-cutout art, one JPG per landmark/character
  sfx/                       drop paper-riffle / stamp-thud audio here (see public/sfx/README.md)
```

The four reusable primitives (`PaperCutout`, `PageFlipTransition`,
`RansomHeadlineText`, `useStopMotionStep`) plus `StampImpact`, `usePopIn`,
`GlassShimmer` and `NewsprintTexture` are built standalone in
`src/components/` so future episodes can import them directly.

## How the montage is composed

Rather than a slideshow of discrete cards, each of the six
locations/vehicles (`src/compositions/montage/assets/*.tsx`) is a single
component mounted for the whole 360-frame timeline. Each one moves through
the same lifecycle (`src/compositions/montage/lifecycle.ts`):

1. **Entrance** — its own flavor (Vidhana Soudha flips in, the auto hops in,
   IT park/Lalbagh pop with a spring overshoot, Metro whooshes across, MG
   Road's sign drops in).
2. **Hero hold** — its dedicated "moment" in the foreground stage.
3. **Recede** — shrinks and moves into a small background "skyline" slot
   (`REST_SLOTS` in `timeline.ts`), overlapping in time with the *next*
   asset's entrance — that overlap, plus staying visible afterward, is what
   makes the montage read as one continuous, blended scene instead of a
   slideshow.
4. **Rest** — sits quietly in its skyline slot (with a fainter shadow — see
   `elevation` on `PaperCutout`) while later assets take their turn.
5. **Finale grow** — during the title beat, every asset grows back up into
   a large, overlapping poster-collage slot (`FINALE_SLOTS`) around the
   headline.
6. **Flip down** — staggered rotateX + fade, clearing the frame into the
   hard cut to Scene 1.

`timeline.ts` holds every global frame number and slot position in one
place — that's the file to tune for timing or layout changes.

## Cutout art

`src/assets/cutouts.tsx` maps each `CutoutAsset` key to a generated image in
`public/cutouts/` (rendered via Remotion's `<Img>`). Each source image is a
flat ~4:3 JPG on a plain cream backdrop, no alpha transparency — `PaperCutout`
displays it with `object-fit: contain`, and the composition's own background
(`OpeningMontage.tsx`) is picked to closely match the art's backdrop so each
cutout reads as a clean torn-paper piece rather than a photo with visible
edges. Since the art already has its own grain/halftone baked in, every asset
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

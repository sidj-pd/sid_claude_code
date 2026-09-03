# Episode 03 — the collage-assembly style

Measured off `EP03-STYLE-REFERENCE.mp4`, the reference supplied 2026-09-03.
26.4s, 720x1280, 24fps.

## What it actually is

**Zero cuts.** Scene detection finds no boundary at any threshold down to 0.04.
The whole 26 seconds is one continuous frame.

So its pace does not come from cutting. It comes from two things:

**1. The frame assembles itself.** The reference states this outright in its own
closing panel: *"The frame does not simply wobble or drift. It assembles itself.
It opens on an empty background and builds, piece by piece, until the full
composition is in place. That building motion is the signature of the whole
style."*

**2. It is cut to music at ~91 BPM.** No narration at all — the audio is a music
bed. Autocorrelation of the onset envelope gives 0.660s per beat (90.9 BPM), and
that agrees with the measured 0.65-0.67s spacing of its audio gaps.

```
beat    0.660s   19.8 frames at 30fps
bar     2.640s   79 frames
```

Elements arrive ON the beat. That is the source of the energy, and it is why the
style reads as fast without a single cut.

## The visual language

- A **flat coloured field** with a paper texture over it — deep purple in the
  reference, one colour for the whole piece.
- **Black-and-white halftone cutouts** with clean hard edges. Photographic, not
  illustrated: a boxer, a pointing hand, dominoes, two hands over a chessboard,
  a strongman holding a question mark, a crowd climbing a pyramid.
- **Geometric accents** scattered around each composition: solid triangles,
  circles, squares, starbursts, hand-drawn squiggles, small engraved eyes.
  Orange/red against the field.
- **Torn label strips** with a word or two set in condensed type —
  CONSEQUENCES, THE BIG DECISION, CLIMB, ALMOST THERE.
- **One clear idea per frame.** Every composition is a single readable metaphor.

The reference shows each composition twice: plain first, then with the accents
added. The accents are what make it feel designed rather than assembled.

## How this differs from Bizzaro Bangalore as built

| | Episodes 01-02 | This reference |
|---|---|---|
| Ground | warm craft paper, gradient, vignette | flat single colour + texture |
| Cutouts | coloured paper-collage illustration | B&W halftone photographic |
| Motion | camera moves over placed elements | elements assemble into a still frame |
| Timing | cut to measured speech | cut to a musical beat grid |
| Accents | none | geometric shapes and squiggles throughout |

Two of those are additive and two are replacements. The motion signature and the
accent layer can be adopted without touching the series' identity; the ground
colour and the halftone-photographic cutouts cannot — those would make Episode
03 look like a different show.

## What this means for the Shot 1 spec

`EP03-SHOT01-SPEC.md` describes the opposite motion: *"a crack cutout is already
in place at frame 0, revealed as the camera passes over it — no separate
entrance animation, it's found by the camera."* That is Episodes 01-02's grammar,
and it is the slowest thing in the series.

If the reference is the target, the spec's sub-beats stop being camera positions
and become **assembly beats**: the wall arrives, then the crack, then the poster
patch, then the stain, then the floor, then the tenant, then the landlord, then
the cash — each on a beat of the grid, into a frame that starts empty.

Its 360 frames is also 4.55 bars, which is not a musical length. 8 bars is 632
frames (21.1s); 6 bars is 474 (15.8s). A beat grid wants the shot length chosen
from the grid rather than rounded to twelve seconds.

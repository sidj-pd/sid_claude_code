# BIZZARO BANGALORE
## Case File #03: THE LANDLORD — Shot 1 Build Spec

**Composition settings:** 30fps, 1080x1920 (vertical/reel format)
**Shot duration:** 0:00–0:12 (360 frames)
**Style:** paper-cutout, stop-motion stepped movement (per series format bible — `useStopMotionStep` hook)

---

## Overview

One continuous shot (Shot 1), built as a slow camera drag across an empty flat — revealing "evidence" (wall crack, stain, broken floor tile) before landing on the tenant. Ends with the landlord entering and handing over the full deposit without inspection. No cuts within this shot — all sub-beats are camera moves and element entries within a single continuous take.

---

## Sub-beat breakdown

### 1a — The Walls
**Frames 0–75 (0:00–0:02.5)**
- Camera pans/drags horizontally across a bare wall cutout.
- Movement: stepped stop-motion drag — quantize camera position updates every 4–5 frames (`useStopMotionStep(frame, 5)`), not a smooth pan. Reads as ~6fps camera movement against 30fps overall.
- Element entry: a crack cutout (jagged paper-tear shape, thin) is already in place at frame 0, revealed as the camera passes over it — no separate "entrance" animation, it's found by the camera.
- A faded poster-patch (slightly discolored paper rectangle, torn corner) enters view mid-drag, around frame 40.

### 1b — The Stain
**Frames 75–140 (0:02.5–0:04.7)**
- Camera drag continues in the same direction/speed as 1a — no hard cut, continuous motion.
- Element: stain cutout (irregular blotch shape, torn/soft edges, slightly darker paper texture or a subtle radial gradient) comes into frame center around frame 100.
- Optional: a very slight camera "pause" (hold for 10 frames) directly on the stain before continuing — mimics a documentary camera operator dwelling on the evidence.

### 1c — The Broken Floor
**Frames 140–200 (0:04.7–0:06.7)**
- Camera drag changes axis — tilts/drags downward from wall to floor level (still stepped motion, same quantization).
- Element: cracked floor tile cutout — a jagged paper-tear cutout breaking up a tiled-floor pattern — enters as the camera settles, around frame 170.

### 1d — The Tenant
**Frames 200–260 (0:06.7–0:8.7)**
- Camera drag settles/stops on the tenant, standing amid the "damage" — first human figure in the shot.
- Element entry: tenant cutout is revealed via the camera arriving at his position (not a separate pop-in) — holding keys, posture tense (shoulders slightly raised — use a static pose, no walk-cycle needed here).
- Dialogue starts at frame ~230:
  **Tenant:** "About the deposit, sir — the wall, that stain, that was already like that when I—"

### 1e — The Landlord Enters, Hands It Over
**Frames 260–360 (0:8.7–0:12)**
- New element enters frame: landlord cutout steps in from screen edge on stepped hop-motion (same `useStopMotionStep` walk-in technique as the auto-rickshaw entrance in Episode 1's opening montage), entering around frame 265, arriving/settling by frame 290.
- He's already holding a stack of cutout currency notes (pre-attached prop, not a separate pickup animation).
- Dialogue cuts off the tenant, starts at frame ~295:
  **Landlord:** "Forget it. Full amount. Here."
- Visual beat: cash stack transfers from landlord's cutout hand to tenant's — simple stepped position swap (2–3 stepped frames), not a smooth tween. Tenant's hands are mid-reach, posture still confused/flinching rather than relieved.
- VO begins exactly as the cash completes the transfer, frame ~330:
  **VO:** "Every day, thousands of security deposits are 'settled' in Bangalore. This is the story of the one that was returned in full."

---

## Sound design cues

| Frame range | Sound |
|---|---|
| 0–200 | Low, dry room-echo/reverb building gradually (empty-flat acoustics) |
| 0–200 | Soft paper-drag/rustle sound synced to each stepped camera move |
| 200–260 | Room tone continues, dialogue (tenant) begins ~230 |
| 265–290 | Footstep-ish paper-shuffle as landlord enters |
| 290–330 | Cash-counting/stack rustle sound as notes transfer |
| 330+ | VO begins, room tone under |

---

## Component/asset checklist for this shot
- [ ] Bare wall cutout (base layer)
- [ ] Wall crack cutout (thin jagged paper-tear shape)
- [ ] Faded poster-patch cutout (discolored rectangle, torn corner)
- [ ] Stain cutout (irregular blotch, soft torn edge)
- [ ] Floor tile pattern cutout (base layer)
- [ ] Cracked floor tile cutout (jagged tear overlay)
- [ ] Tenant cutout (static tense pose, holding keys)
- [ ] Landlord cutout (walk-in rig, holding cash-stack prop)
- [ ] Cash-stack cutout prop (attachable to either hand position)
- [ ] SFX: room-echo/reverb loop, paper-drag rustle, footstep-shuffle, cash-count rustle

---

## Notes for build
This is a single continuous camera-drag shot with no internal cuts — build it as one Remotion scene with a moving camera (translate/scale the whole layered composition) rather than as five separate scenes stitched together. All stop-motion jitter/stepping should use the same `useStopMotionStep` hook and jitter logic established in the opening montage spec, so movement style stays consistent across the series.

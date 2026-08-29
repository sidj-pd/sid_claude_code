# BIZZARO BANGALORE — Episode 02 build plan

*Case File #02: THE MANAGER.* Written before any Episode 02 code exists, from
the script and from what Episode 01 actually shipped. Read
[PRODUCTION-NOTES.md](./PRODUCTION-NOTES.md) first — every rule there still
applies and none of it is restated here.

---

## 1. The finding that shapes everything else

Case 2 is not a new format. It is the **same format with new evidence**, beat
for beat:

| Ep 02 | Ep 01 twin | Shared grammar |
|---|---|---|
| Shot 02 — the reply lands | Shot 04 — meter down | Punch-in on the one piece of evidence |
| Shot 03 — stat card | Shot 05 — stat card | Subdivide a bar, expand the remainder |
| Shot 04 — witness + checklist | Shot 06 — witness + checklist | Tear in, tick to the delivery |
| Shot 05 — expert + kicker | Shot 07 — expert + kicker | Push-in, whip to whiteboard |
| Shot 06 — fallout, two headlines | Shot 08 — fallout, two headlines | `PaperTear` run in both directions |
| Shot 07 — PSA | Shot 09 — PSA | Direct address, studio register |
| Shot 08 — committee | Shot 10 — committee | One headline, dry VO, out |
| Shot 09 — full circle | Shot 11 — full circle | Freeze, desaturate, CASE CLOSED |

That is a **format**, and it means the component library carries almost
entirely. The work in Episode 02 is assets, audio and one new component
family — not architecture.

It also sets a standing rule: where Case 2 has a twin, **match Case 1's
treatment deliberately**. The series' comedy depends on the apparatus being
identical while the incident is trivially different. Two episodes that solve
the same beat two different ways read as inconsistency, not variety.

## 2. Shot map

Vertical 1080×1920, 30fps, same as Episode 01. Durations are **deliberately
absent** — per §8 they get derived from measured audio, and nothing here is
measured yet. The frame counts Episode 01 landed on are given only as a
sanity range.

| Composition | Beat | World | Content | Ep01 range |
|---|---|---|---|---|
| `Ep02Shot01LeaveRequest` | 1 | paper | Desk at night, cursor hesitates over Send, request goes | ~240 |
| `Ep02Shot02InstantReply` | 1 | paper | Punch-in: notification lands, "Approved. Don't check Teams." | ~90 |
| `Ep02Shot03Graphic` | 2 | paper | 89% / 11% / 94%, cliffhanger freeze | ~711 |
| `Ep02Shot04Testimony` | 3–4 | tear → photoreal | Correspondent Q, employee, four-tick checklist | ~456 |
| `Ep02Shot05Expert` | 5 | photoreal | S.T.F.U. Syndrome, whiteboard kicker | ~740 |
| `Ep02Shot06Fallout` | 6 | tear both ways | Headline → manager on camera → second headline | ~663 |
| `Ep02Shot07Psa` | 7 | photoreal | Correspondent PSA | ~338 |
| `Ep02Shot08Committee` | 8 | paper | Committee headline punchline | ~172 |
| `Ep02Shot09FullCircle` | 9 | paper | Manager closes the laptop, freeze, CASE CLOSED | ~431 |
| `Ep02CoverCard` | — | — | Still export, "EPISODE TWO" | 360 |

Beat 3's tear is not its own composition — it opens Shot 04, exactly as
Episode 01 folded its tear into Shot 06 rather than cutting to it.

## 3. What is genuinely new

### The screen has to be paper

Beat 1 is the only thing in Case 2 that Episode 01 has no vocabulary for: a
leave-request form, a Send button, and two notifications. The temptation is to
draw software. **Don't.**

The paper world's rule is that everything that *happened* is hand-cut paper.
A notification rendered as real UI chrome — rounded rect, drop shadow, app
icon — breaks the conceit at exactly the moment the episode is establishing
its incident. It would also be the first thing in the series that looks
generated rather than cut out.

Proposal: notifications are **newsprint chits**, the same object `Chyron`
already builds, pinned over the laptop and stamped in with the existing
`StampImpact`. The manager's reply is a second chit landing on top of the
first. This reuses a solved component, keeps the world intact, and makes the
reply read as *a document entering the record* — which is the joke.

Note the existing typography rule cuts the right way here: ransom tiles are
**titling only**, so `LEAVE REQUEST — SUBMITTED` may use them, but the
manager's actual words may not. His reply is dialogue and belongs in a clean
face, the same call `SpeechBubble` already makes.

### One new component, one new script

- **`NoticeChit`** — a notification as a torn paper chit. Probably a thin
  wrapper over `Chyron`'s chit rather than a new drawing; decide after
  reading `Chyron.tsx`, and prefer extending it if the shapes agree.
- **`scripts/split-laptop.mjs`** — the laptop lid has to close in Shot 09,
  which is the same problem the meter's flag posed in Shot 04. Copy
  `split-meter.mjs`: split body from lid, print the lid's box and hinge pivot,
  and have the shot consume those numbers verbatim rather than guessing them.

### Three new sound cues

`sfx.py` gains, in its existing synth-from-scratch style:

- **`notification-ping`** — two short bright partials, the second higher, fast
  decay. It has to cut through silence without reading as a musical note; the
  meter-click's lesson about detuning the resonance applies directly.
- **`laptop-close`** — hinge sweep into a soft damped clack. Not a slam; the
  whole point of Beat 9 is that he closes it gently.
- **`room-hum`** — a low looping fan/AC bed for the cold open. This is the
  first ambience bed in the series and closes one of §13's open gaps.

### The audio-dropout glitch finally lands

§13 records that the mechanism exists — `volume` accepts a function of frame,
the picture-tear overlay is written — but Episode 01 never shot the line it
was built for. Beat 4 explicitly asks for it on *"I didn't know what to do
with myself."* Build it there.

## 4. The stat card is the hard shot again

Shot 03 must not be drawn as three separate figures. The script's structure is
89 → 11 → 94, which is the **same subdivision problem** Episode 01's Shot 5
solved the expensive way: the 11% has to be an outlined, filled, labelled
block that detaches, travels and enlarges into the 94% bar, with ruled
connectors from its corners.

Draw the 11% as leftover negative space and it cannot be picked up and moved —
that is documented in §5 as the single best structural fix in the project, and
it will be needed verbatim here. `StatBar` already does this; the shot should
consume it, not reimplement it.

## 5. Assets to commission

### Cutouts (`public/cutouts/`, then `cutout-alpha.mjs`)

| Asset | Used by | Notes |
|---|---|---|
| `employee-desk-night` | 01, 02 | ¾ view at a laptop, late-night desk lamp |
| `laptop-open` | 01, 02, 09 | Must survive `split-laptop.mjs` — clean hinge line |
| `desk-lamp`, `wall-clock` | 01 | Clock needs a readable face for the held beat |
| `manager-desk-night` | 09 | Same staging as `employee-desk-night`, mirrored |
| `office-window-night` | 01, 09 | Backdrop; receded, `elevation: 0.4` |
| `newspaper-clip-managers` | 06 | Managers' Association petition |
| `newspaper-clip-ownclaim` | 06 | The manager's own claim |
| `newspaper-clip-committee` | 08 | HR committee / rangoli |

Every clipping needs `crop-newspaper-clippings.mjs` afterwards — raw generated
clippings run nearly a full 9:16 frame and two headlines cannot share a page
at that size.

### Footage (`public/footage/`)

| File | Shot | Notes |
|---|---|---|
| `ep02-witness-1/-2.mp4` | 04 | The employee. Deadpan-traumatized, building through the list |
| `ep02-expert-1/-2/-3.mp4` | 05 | Dr. Ramamurthy — **continuity: match Ep01's wardrobe, desk and room** |
| `ep02-manager-1.mp4` | 06 | First time the manager is on camera. Flat, aggrieved, sincere |
| `ep02-correspondent-psa.mp4` | 07 | Studio register, matching `ep01-correspondent-psa.mp4` |

Three clips for the expert, not one: his speech runs three paragraphs and the
models top out near eight seconds. Cut testimony is the native grammar anyway.

**Continuity flag.** Case 2 promotes Dr. Ramamurthy from `URBAN MOBILITY
BEHAVIOURIST` to `ORGANIZATIONAL BEHAVIOURIST` at the same unaccredited
institute. That reads deliberate — the same man, credentialed to whatever the
week requires — so keep it and keep the institute line and the footnote
identical.

## 6. Voice-over

Eight lines are already written into `scripts/vo-lines.json`:

```
ep02-shot02            narrator      opening line, twin of ep01-shot01
ep02-shot03a/b/c       narrator      stat card, cliffhanger on c
ep02-shot04-q          correspondent off-screen question
ep02-shot06-assoc      narrator      Managers' Association petition
ep02-shot08-committee  narrator      committee, throwaway
ep02-shot09-final      narrator      closing line, twin of ep01-shot11-final
```

No new voice is needed. The employee, the manager and the expert all speak on
camera, so their dialogue is generated **with** the video and never through
TTS — §12 rule 8, which is not negotiable for talking heads.

Generating these needs `GEMINI_API_KEY` in a local `.env`; §13 records that the
key does not survive a fresh environment and has to be re-supplied.

## 7. Build order — one shot at a time

**Do not batch.** Work a single shot end to end before starting the next, and
generate only that shot's audio when you reach it:

1. **Its VO** — `python3 scripts/tts.py ep02-shot03a`, one id at a time.
2. **Listen to it.** A take that is wrong is cheapest to catch here, before any
   visual constant depends on it. Re-record with `--force <id>`.
3. **Measure** — `python3 scripts/measure-vo.py --beats <id>` prints the
   constant block straight into `beats.ts`.
4. **Build the shot** against those numbers, register it in `Root.tsx`.
5. **Preview it in Studio**, then move on.

The reason is §12's hardest rule: *a line that doesn't fit means a longer shot,
never a faster take.* You can only act on that if the shot is being built
around the take you actually got. Generating a whole episode of audio up front
decouples the two and invites the temptation to trim the performance to fit a
slot that was decided before the performance existed.

It also keeps a bad take cheap. Episode 01 re-timed Shots 1, 3, 5, 6 and 7
after their audio landed; each of those would have been a wasted build if the
visuals had been made first.

**Footage** is the exception — commission it in batches, because it comes from
outside the repo and has a long turnaround. `Footage.tsx` renders a loud slate
until each clip arrives, so shots stay buildable meanwhile.

**Cutouts last** for the paper shots. The graphic and testimony shots need none
of them and can be finished first.

## 8. Open questions

- **Does the montage re-run?** Episode 01 opens on `OpeningMontage`. Assume yes
  and unchanged, with `Ep02CoverCard` swapping only the episode number.
- **Is the employee the same actor as Episode 01's passenger?** They are
  different characters. Generating a visibly different person is the safer
  read, but it costs the cheap continuity of a returning face.
- **Assembly.** §13 lists "no assembled episode" as an open gap for Episode 01.
  Episode 02 should not repeat it: build the parent composition that sequences
  the shots *before* the shot count gets large.

## 9. What this phone can and cannot do

Established by trying it, 2026-08-29. Recorded so nobody re-derives it.

**Works on the phone:**

- `scripts/tts.py`, `scripts/sfx.py`, `scripts/measure-vo.py` — Python 3.14, stdlib.
- `scripts/cutout-alpha.mjs` and the measure scripts, but only after
  `npm i @img/sharp-wasm32`: sharp has no android-arm64 prebuild and the
  package installs but throws on require. The WASM build gives real libvips
  8.18.6 and keys a 1200x896 image without complaint.
- `node node_modules/typescript/bin/tsc --noEmit`. Note `npx tsc` does NOT
  work — Termux has no `/usr/bin/env`, so the bin shebang fails.

**Does not work on the phone:**

- `remotion render` — needs a headless Chrome. No aarch64 chromium in the
  Termux repos, and the Chrome Headless Shell Remotion downloads is a
  linux-arm64 *glibc* build that Android's Bionic cannot load.
- `remotion studio` — and this one is not obvious, because the browser
  would be the phone's own Chrome. The blocker is the *bundler*: rspack ships
  no android-arm64 binding. Its WASI fallback exists but Android denies
  `uvwasi_init` a preopen of `/`; pointing the preopen at `$HOME` in both
  `rspack.wasi.cjs` and `wasi-worker.mjs` clears that error and the module
  loads, but the studio process then exits silently without binding a port.
  Abandoned there.

**So there is no way to see a frame on this device.** Authoring, audio,
keying, measuring and typechecking all work here; anything visual has to
happen in CI or on the machine that built Episode 01. That makes a render
workflow the prerequisite for reviewing any Episode 02 shot, not a nicety.

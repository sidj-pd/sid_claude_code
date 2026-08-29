# BIZZARO BANGALORE — Production Notes

Everything learned building the opening montage and Episode 01, *Case File
#01: THE AUTO*, in Remotion. Written as a working reference for the next
episode, not as a retrospective — the rules at the bottom are the part worth
re-reading before starting anything new.

---

## 1. What was built

A vertical mock-documentary comedy short. Bangalore's auto-rickshaw culture
played as a true-crime investigation: an auto driver puts the meter down
without being asked, and the episode treats it as an unexplained incident
requiring expert testimony, institutional response and a government committee.

**Format:** 1080×1920, 30fps, H.264. Everything renders from code — there is
no timeline file, no NLE project, no manual keyframing.

| Composition | Frames | Length | Content |
|---|---|---|---|
| `OpeningMontage` | 360 | 12.00s | Series opening — paper city assembling itself, title stamp |
| `Ep01CoverCard` | 360 | 12.00s | Still export: montage final frame + "EPISODE ONE" |
| `Ep01Shot01AutoStop` | 240 | 8.00s | Hand hails, auto arrives |
| `Ep01Shot02Destination` | 150 | 5.00s | "WHITEFIELD" / "OK" speech bubbles |
| `Ep01Shot03InstantYes` | 168 | 5.60s | Driver's hand flips the meter |
| `Ep01Shot04MeterDown` | 90 | 3.00s | Meter close-up, fare jump-cut |
| `Ep01Shot05Graphic` | 711 | 23.70s | Survey infographic, torn newsprint bars |
| `Ep01Shot06Testimony` | 456 | 15.20s | Tear reveal → witness interview + checklist |
| `Ep01Shot07Expert` | 740 | 24.67s | Dr. Ramamurthy, W.T.F. Syndrome |
| `Ep01Shot08Fallout` | 663 | 22.10s | Newspaper headlines, witness returns |
| `Ep01Shot09Psa` | 338 | 11.27s | Correspondent PSA |
| `Ep01Shot10Committee` | 172 | 5.73s | Committee headline punchline |
| `Ep01Shot11FullCircle` | 431 | 14.37s | Auto drives off, freeze, CASE CLOSED |

Total episode runtime ≈ 2m 41s across eleven shots. **Not yet assembled into
a single continuous file** — see §12.

**Stack:** Remotion 4.0.515, React 18.3.1, TypeScript. `sharp` for all image
processing. Python 3 (stdlib only) for TTS and sound synthesis. Chromium
`headless_shell` for rendering.

---

## 2. The visual system

Two worlds, and the whole episode is about moving between them.

**The paper world** (reenactment) — hand-cut paper collage on a warm craft
paper backdrop. Flat, lit from above, halftone grain everywhere. Everything
that *happened* is told here.

**The photoreal world** (testimony) — compressed video calls. Everything
*about* what happened — witnesses, experts, official response — is told here.

The joke lives in the gap: an absolutely mundane event, documented with the
full apparatus of investigative journalism.

### Depth, and why it took three attempts

The single most important asset-pipeline decision: **cutouts must be real
transparent PNGs, not JPGs with a background baked in.** Repeated shadow
tuning failed to produce depth for a long time, and the root cause was that
every "cutout" was a rectangle. A drop-shadow on a rectangular image traces
the *card*, not the artwork — so it reads as a postcard lying on a table, and
no amount of blur/offset/opacity tuning fixes that.

`scripts/cutout-alpha.mjs` keys the generated art. It uses an **edge-seeded
flood fill**, not a global brightness threshold, because the artwork itself
contains plenty of cream (the Vidhana Soudha dome, the metro doors, the
meter's display panel) and a global threshold punches holes straight through
it. Only background actually *connected to the frame edge* is removed. A
second, much tighter-tolerance pass clears enclosed holes a border fill can
never reach (the auto's cabin, gaps between columns).

Per-asset overrides exist because generated art is not uniform:

```js
'traffic-signal':   {inset: 0.1},      // art sits on a deckle-edged paper sheet filling the canvas
'auto-driver-34':   {interior: false}, // windscreen is cream ARTWORK, not backdrop showing through
'hailing-hand':     {tolerance: 72},   // carries a baked-in grey drop shadow
'passenger-leaning':{tolerance: 60},   // paper-sheet seams + painted ground shadow
'newspaper-clip-autounion': {tolerance: 46}, // photographed on wood grain, not flat backdrop
```

Shadows are then two stacked layers scaled by an `elevation` prop — a tight
dark contact shadow anchoring the piece to the surface, plus a wide soft cast
shadow for height. A receded background element sits nearly flat
(`elevation: 0.4`); a foreground one floats well clear (`elevation: 1.5`).

---

## 3. Cinematic techniques

### Stop-motion quantization — quantize *before* easing

The core motion rule. `useStopMotionStep` snaps a frame number down to a step
grid; the shot then eases the **stepped** value, never the raw frame:

```ts
const {stepIndex} = useStopMotionStep(frame - AUTO_ENTERS, HOP_STEP);
const steppedT = Math.min(1, (stepIndex * HOP_STEP) / (AUTO_STOPS - AUTO_ENTERS));
const eased = Easing.out(Easing.quad)(steppedT);
```

Easing a smooth value and *then* quantizing gives evenly-spaced hops. Doing it
in this order means the motion covers big chunks early and inches the last few
— which reads as a vehicle **braking**, not gliding. Same principle drives the
bar growth in Shot 5, the tear separation, and the hand's reach in Shot 3.

### Virtual camera over world space

The montage places every cutout at a fixed spot in world space (`world.ts`)
and moves a single camera over it (`camera.ts`, keyframed `focusY` + `scale`).
That gives real shot language — push-in, whip-tilt, progressive pull-back —
instead of a locked frame with elements swapping in and out. It also means
overlapping composition comes free: the Vidhana Soudha stays visible behind
the auto because it never left, the camera just moved.

### Punch-ins as an editing device

**Shot 4** is two framings hard-cut together. The meter artwork puts the
display low-left and the flag high-right, so no single framing holds both at
close-up scale — fitting the swing in shot means backing off until it's barely
tighter than the shot before it. Solution: play the flag snap wide
(`WIDE_SCALE = 0.74`), then hard-cut in to read the fare. A punch-in is what a
cutting room does to a piece of evidence anyway.

The same shot also tips the whole meter 32° clockwise, swinging the
display→flag axis down the diagonal where a 9:16 frame has room to spare. A
tilted paper element is the series' native register regardless.

**Shot 7** punches into the whiteboard behind Dr. Ramamurthy during his kicker
line — the arrows connecting his exhibits demonstrably connect to nothing.
Diegetic undercutting: the frame never editorialises against him, it just
shows the room.

### Cut on action, overlap the action

Shot 4 doesn't continue Shot 3, it **overlaps** it — we join the flag part-way
through an arc Shot 3 already showed, from a tighter angle. That overlap is
what makes the cut invisible. Cutting to a flag already down leaves the shot
with nothing to play.

### Freeze / desaturate as bookend

Shot 11 mirrors Shot 1's framing, then freezes, drains to grayscale, and turns
the halftone grain up loud — a photograph fading into an archive. The auto
also scales down over its drive so it reads as pulling into the distance
rather than sliding sideways across a flat plane.

### Micro-motion during holds

Long held frames need **paper breathing** — a pixel of translation and a
fraction of a degree of rotation on a slow step grid. Shot 5 holds its stat
card for seconds while the narrator finishes; a genuinely frozen frame stops
reading as a held shot and starts reading as a stalled render.

### Impact shake

`shakeAt(frame, impactFrame, amplitude)` — decays fast, punctuates rather than
wobbles. Used on the meter's flag hitting its stop, the auto's brake dip, the
road slam.

---

## 4. Transition grammar (the series rule)

Established in the script and enforced everywhere:

> **Paper tears = reality intruding on the reenactment.** Reserved for cuts to
> and from real footage.
> **Page-flip = reenactment-to-reenactment** scene changes only.

This is why the audience knows what kind of thing is coming before their eye
resolves it. `PaperTear` renders the *same children twice*, differing only in
clip path — which is what makes the halves read as one sheet that was whole a
frame ago.

Two details that took iteration:

- **The tear line wanders at three scales** — a slow wide meander, a middling
  waver, a fine fray. Roughness at a single scale comes out as a lightning
  bolt, not a tear. Roughness has to go all the way down.
- **Travel is back-loaded** (`progress ** 1.9`). A tear is slow to start and
  then runs. At a constant rate the halves are half off-frame before the
  audience registers a line has opened, and the reveal reads as a wipe.

Shot 8 runs the same component in **both directions inside one shot** —
closing is just its progress driven from 1 down to 0. Paper closes over Shot
7's ending, holds under narration, tears open onto the witness, closes again
onto the *same page* now carrying a second headline.

---

## 5. Overlays and Vox-style visuals

Everything on screen is set in **code**, never baked into generated art. That
keeps copy exactly on the script's wording, animatable letter-by-letter, and
art-directable after the fact.

| Component | Purpose |
|---|---|
| `RansomHeadlineText` | Per-letter ransom-note tiles — varied face, size, rotation, seeded |
| `NewsHeadline` | Kinetic headline type over a real torn clipping photo |
| `Chyron` | Broadcast lower-third, newsprint chit, optional footnote line |
| `EvidenceStamp` / `ArrowTag` | Rubber-stamped tags, typewriter face, worn ink |
| `StatBar` | Proportional bar; percentage knocked out of the ink |
| `ChecklistItem` | Evidence checklist chit with a tick box |
| `SpeechBubble` | Classic oval balloon, single closed path |
| `PaperTear` / `PageFlipTransition` | The two transition devices |
| `NewsprintTexture` | Procedural grain + halftone (SVG turbulence, no binary asset) |
| `tornEdge.ts` | Seeded `clipPath` polygon generator for torn paper |

### Rules that emerged

**Knock numbers out of the thing they describe.** The fare is knocked out of
the meter's own digit tiles; the percentage is knocked out of the bar's ink.
You can't read the figure without also seeing the quantity. Setting a number
*beside* a bar makes them two objects.

**Negative space can't be picked up and moved.** Shot 5's original bars drew
the leftover as "the part the ink didn't reach" — so when the 9% needed to
expand into the second bar, there was nothing there to animate. Redrawn as an
outlined, filled, *labelled block*, it becomes an object that can detach,
travel, and enlarge — with ruled connector lines running from its corners to
the new bar's. That's the standard "this piece, enlarged" grammar, and it's
what makes 96% read as a slice of 9% rather than a fresh claim.

**Cut the boundary straight, tear the outside.** The ink's right edge in a
stat bar is cut clean while the outer edges stay torn. A ragged boundary
between two quantities makes the division between them unreadable — the one
place in an infographic that can't afford to be vague.

**A stamp across a finished form beats a sixth tick.** Shot 6's checklist ends
with `FOLLOWED EVERY RULE` stamped diagonally across the completed list.

**Card vs. no card.** A caption entering evidence into the record (chyron,
term card, lower third) gets the newsprint chit. A line spoken on camera by
someone fully audible does not — Shot 7's kicker is bold type straight over
the picture with a stroke instead of a backing panel, because a solid card
would have sat over the whiteboard the shot is punching in to show.

**Titling vs. dialogue faces.** Ransom tiles are for *titling only*. Speech
bubbles use one clean face throughout (`SPEECH_FONT`), because dialogue set in
cut-and-pasted letters reads as a threat note, not as talking.

---

## 6. Voice-over and the TTS setup

Google Gemini TTS, driven by `scripts/tts.py`. The whole pipeline came from a
user-supplied working spec (`googlettsvoiceover.md`) and every rule in it
earned its place.

### The call

```
POST https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent?key={KEY}
```

Models tried in order: `gemini-3.1-flash-tts-preview` (primary), then
`gemini-2.5-flash-preview-tts` (fallback, same payload shape).

`safetySettings` with all four categories at `BLOCK_NONE` — without it,
ordinary screen dialogue gets blocked often enough to matter.

### The prompt is a stage direction, not a string to read

This is the whole trick. The model is a **speech director**, not a TTS engine.

```
Synthesize speech for the performance defined below. The Stage direction is
for vocal direction only. Do NOT read it aloud.

Stage direction: {who this person is — accent, age, register, temperament}.
Delivery of THIS line: {how they say this one line}. This overrides the
general register above wherever the two disagree.
#### TRANSCRIPT
{the words, and only the words}
```

Two separate levers, and keeping them separate is what makes it directable:

- **Character** — fixed per speaker, never changes between lines. *This is the
  voice.* Lives in `vo-lines.json` under `voices`.
- **Delivery** — per line. *This is the take.* Without it every line in a
  scene comes out in the same register regardless of what's happening.

**Character descriptions read better when they say what NOT to do.** Left to
itself the model *performs* an accent rather than speaking in one. Every
character block in `vo-lines.json` ends with a list of prohibitions:

> "…speaking natural Indian English in an educated urban register — unhurried,
> fairly flat… Speak plainly and naturally — no performed or exaggerated
> accent, no theatrical shakiness, no comic timing, no caricature."

### Cast

| Role | Voice | Register |
|---|---|---|
| Narrator | `Fenrir` | Vox explainer — bright, articulate, dry, trusts the material |
| Passenger | `Puck` | Bangalore software professional, deadpan-unsettled |
| Correspondent | `Algenib` | Flat professional interviewer, performs no interest |

Pin one voice per character in a dict and **never pick per line.**

### The output is NOT a WAV file

The biggest single gotcha. `inlineData.data` decodes to **raw PCM** — signed
16-bit little-endian, mono, **24000 Hz, no header at all.** Write it to disk
as-is and every player refuses it. It must be wrapped:

```python
with wave.open(out_path, "wb") as w:
    w.setnchannels(1); w.setsampwidth(2); w.setframerate(24000)
    w.writeframes(audio)
```

Duration, before you even open it: `secs = len(audio) / (24000 * 2)`

### Guard rails — every one is a hard stop, never a retry

A speech model that degenerates **does not stop**. It keeps emitting and the
account is billed for everything generated on the far side. Retrying a runaway
is what multiplies it.

```python
MAX_ATTEMPTS      = 2     # TOTAL across all models, not per model
MAX_OUTPUT_TOKENS = 3000
CONNECT_TIMEOUT   = 10
read_timeout = min(120, 45 + words * 0.8)   # scaled to the line, not flat
max_audio    = min(30, 4.0 + words * 0.9)
```

Three post-hoc checks, all fatal: output tokens over cap → discard; audio
longer than `max_audio` → discard (that length is the white-noise loop, not a
performance); `promptFeedback.blockReason` present → stop on that model, try
the fallback, never retry the same one.

### Small things that cost time

- **Ellipses drag.** `re.sub(r'\.{2,}', '—', text)` before sending — trailing
  dots make the model trail off into a long pause.
- **One line per call.** Never batch a scene: you lose per-line direction, and
  one safety block kills everything.
- **Never speed-adjust the result to fit a slot.** `atempo` gabbles the
  performance. If it doesn't fit, shorten the writing or lengthen the shot.

### Cost

Input $1.00/M tokens, output $20.00/M. Audio is all output — which is exactly
why the runaway cap matters. Total spend across the whole episode's narration
was **well under $0.10**.

### Key handling

The key lives in a gitignored `.env`, sourced into the environment at call
time, and is never written to a tracked file. `.gitignore` covers `.env`,
`.env.*`, `*.key`.

---

## 7. Sound design

`scripts/sfx.py` synthesises every non-vocal cue from scratch — deterministic,
free, and tunable by a number. Four effects in `public/sfx/`:

| Cue | Construction |
|---|---|
| `meter-click` | Noise burst (contact) + inharmonic ring at 1780/2490/3910 Hz + 186 Hz thud |
| `stamp-thud` | Sharp noise slap + two low body tones (92/143 Hz) |
| `paper-riffle` | One-pole low-passed noise, swelling then falling |
| `paper-rip` | Accelerating impulse stream + bright filtered noise + a low first-grab thump |

Design notes worth keeping:

- **A single decaying sine reads as a beep, not as something mechanical.** The
  meter click needed three layers — physical contact, housing resonance
  (detuned so it isn't a musical note), and the mass of the lever arriving.
- **A tear is not a swell.** Unlike a page turn, it's a rapid burst of tiny
  discrete fibre breaks whose rate accelerates and then stops *dead* — paper
  goes quiet the instant it's through. Envelope: fast rise, peak past the
  middle, hard stop rather than a fade.
- Everything is written with headroom (peak normalised to 0.82) so mixing
  under a voice-over never clips.

**On asking TTS for sound effects:** tested empirically. Onomatopoeia with a
stage direction returned an 80ms transient — usable. A plainly-worded request
returned 0.45s of speech-length audio. So it *can* work, but it isn't
reliably a sound rather than a clipped word, costs a call each time, and can't
be tuned. Effects that are pure physics belong in synthesis.

---

## 8. Timing methodology — the single most important technique

**Cut graphics to measured audio, never to a script's stated timing or to an
estimate.**

Every cue in every shot is an offset into an RMS envelope measurement of the
actual audio file:

```python
win = int(sr * 0.01)                    # 10ms windows
env = [rms(d[s:s+win]) for s in ...]
thr = max(peak * 0.07, floor * 2.2)     # floor-relative, not peak-relative —
                                        # real footage has significant room tone
```

From that you get speech-start, speech-end, and every internal pause. Those
become the constants in each shot's `beats.ts`, and every visual derives from
them. Re-timing to a re-recorded take is then *correcting three numbers*, not
rebuilding a shot.

**Cue to the first word, not the top of the file.** Generated takes carry
~0.3s of lead-in and ~0.45s of tail. Cueing a graphic to frame zero of the WAV
puts every number a beat late.

**Syllable-rate cross-checking.** Every clip in this episode landed within a
few percent of **~0.17s per syllable**. That's precise enough to disambiguate
what's being said in a segment you can't hear — it's how Shot 6's ambiguous
final utterance was resolved (duration and syllable count both fit "he
followed every rule"; the longer parallel-universe sentence would not fit).

**Corollary — the pipeline's hardest rule:** *a line that doesn't fit means a
longer shot, never a faster take.* The script allots Shot 5 seven seconds; its
own specified narration runs to twenty-two. The shot became twenty-four
seconds. This happened on Shots 1, 3, 5, 6 and 7.

---

## 9. Asset pipeline

### Images

1. Generated externally from prompts written here (self-contained, style
   included in each prompt — never pasted separately).
2. Dropped into `public/cutouts/`.
3. `node scripts/cutout-alpha.mjs [names…]` → keyed PNGs in
   `public/cutouts-alpha/` (gitignored; regenerated from source).
4. Registered in `src/assets/cutouts.tsx`.

Two specialised passes:

- **`scripts/split-meter.mjs`** — splits the fare meter into
  `auto-meter-body.png` + `auto-meter-lever.png` so the flag rotates
  independently, and prints the lever's box and pivot for the shot to consume
  verbatim.
- **`scripts/measure-meter.mjs`** — finds the display panel and its four digit
  tiles by connected-component analysis and prints them as fractions.
- **`scripts/crop-newspaper-clippings.mjs`** — crops keyed clippings down to
  their photo (the raw generated clippings run nearly a full 9:16 frame tall
  on their own; two headlines can't share a page at that size).

### Footage

`public/footage/` + `src/components/Footage.tsx`. The component renders the
video when the file exists and a **loudly labelled slate** when it doesn't, so
a shot is buildable, previewable and reviewable before its footage lands.
`trimBeforeInFrames` skips into the middle of an existing source, which is
what lets one clip be reused across shots.

`public/footage/README.md` carries every prompt and the per-shot expectations.

---

## 10. Decisions made that the script didn't specify

Recorded because they're all reversible and some are worth revisiting.

**Additions to the script:**
- Shot 5's `THIS RIDE` arrow-and-tag pointing at the surviving 4% sliver, plus
  the footnote `0.36% OF ALL AUTO RIDES` — states the cliffhanger as a picture
  a beat before the narrator states it as a line.
- Shot 5's page furniture: `EXHIBIT B` stamp, `n = 1,200 · METHODOLOGY
  UNAVAILABLE`, `SOURCE: BIZZARO BANGALORE FIELD UNIT · FILE 01`.
- Correspondent named **KARTHIK MENON**, outlet **BANGALORE VOX** — invented;
  the script never names him. Played straight with no footnote, so it can
  carry a joke later without this shot changing.
- Shot 6's checklist wording (`PUT THE METER DOWN`, `DID NOT ASK`, `NO HORN`,
  `NOT ON THE PHONE`, `STOPPED AT EVERY SIGNAL`, `FOLLOWED EVERY RULE`).
- Shot 7's correspondent reaction cutaway — not in the script; built by
  reusing two seconds of his own Shot 6 clip.
- Base fare set at **₹30.00**, so exactly one digit changes on the jump-cut.

**Script instructions overridden:**
- **Shot 5's "hard cut to black" was dropped.** The transition spec has the
  frozen stat card itself being ripped apart — and a card that's been cut away
  from isn't there to tear. The more specific instruction won.
- **Shot 7's whiteboard cutaway is a punch-in, not a separate shot.** The
  footage prompt already asked for the whiteboard as set dressing.

**Costs incurred:**
- The driver is visible from Shot 1, which spends the script's later
  "face withheld for reveal".
- Shot 2's added "OK" bubble spent part of Shot 3's payoff — Shot 3's VO was
  reworded in response.
- The correspondent appears on camera in Shot 6, which spends the script's
  "first time shown on camera" in Shot 9. *(This one was a direct request.)*

---

## 11. Direction given in chat, in order

The record of what changed and why — most of the good decisions in this
project came from these.

**Montage phase**
1. *"this looks very plane"* — every asset needed its own moment: the Soudha
   flips in, the auto rides through leaving smoke, elements flip down into the
   title.
2. *"they all seems different elements and are not blending together"* —
   overlapping composition, larger scale, and shadows for depth. This is what
   forced the world-space + virtual camera architecture.
3. *"you are making a very basic style video… no coherent thought process"* —
   the reset. Led to choosing **comedy/satire**, storyboarding first, and
   rebuilding the montage around a premise (the city photobombing its own
   portrait) rather than a list of assets.
4. Background surface + shadows around cutouts for depth.
5. Three assets added mid-flight (traffic signal, pothole road, masala dosa)
   with a specified running order.
6. *"the mg road is not fitting in"* — asset swapped, new one moved left.
7. *"towards the end we are unnecessary zooming out"* — the long single-line
   title was forcing the camera to pull back and throwing away the crowding
   the montage had spent 300 frames building. Title stacked to two lines,
   font size up, camera stays tight.

**Episode phase**
8. Shot 1 restaged: hand waving from frame *right*, ¾ view of auto with
   driver. Prompt requested **with style included, not pasted separately** —
   this became the standing rule for every prompt since.
9. TTS pipeline doc supplied. *"keep it vox style."*
10. *"the video is just 4 second and the voice over is 7-8 seconds"* — extend
    the shot. First instance of the rule that governed everything after.
11. Shot 2 speech bubbles: wrong font (twice), then **classic oval shape**,
    then a second bubble for the driver's "OK", then both repositioned to sit
    over the actual speakers' heads.
12. Shot 3: *"accommodate the dialogues"*, and *"check if google TTS can give
    the meter down sound"* — tested, answered, and built as synthesis instead.
13. **Shot 5 rebuild** — *"the box from the remaining of 91% is not rendered
    properly… the remaining part needs to expand and then we go into that part
    explaining further."* This diagnosed the root cause exactly and produced
    the best structural fix in the project (§5, negative space).
14. Shot 6: *"do not add your audio"* — clips carry their own dialogue; cut
    the tick marks to the pace of the delivered video.
15. Correspondent question clip supplied + *"insert the correspondent nodding
    footage from the previously given clip in between these clips."*
16. Chyron requested for the correspondent, plus a request for suggestions on
    what else could go in that frame.
17. *"pull the tick mark boxes down… his face should be visible."*
18. Shot 7 prompts requested **in chat**, split into two clips of two lines.
19. Shot 7 overlays: W.T.F. Syndrome as an aligned overlay, the kicker line as
    on-screen wording during the zoom, and the cutaway cut to **just the last
    two seconds** of head-nodding.
20. Kicker restyled: *"bold font with no background on the right of the screen
    with vertical distribution"*, then *"increase the font size."*
21. Newspaper clipping prompts requested as separate generated assets.
22. **PSA prompt blocked by the generator** — *"remove correspondent and such
    reference just keep a guy with headphones delivering the message."*
23. All remaining assets delivered at once: *"proceed make the rest of the
    shots in sequence."*
24. Cover card: "EPISODE ONE" over the Bizzaro Bangalore title.

---

## 12. Lessons to carry into the next video

### Process

1. **Premise before assets.** The montage failed twice as a list of things
   that appear. It worked once it had an argument — the city photobombing its
   own portrait — that every beat could serve.
2. **Measure, don't eyeball.** Every geometric constant in this project that
   was guessed had to be corrected; every one derived by connected-component
   analysis or envelope measurement held. Write the measuring script.
3. **Render a diagnostic instead of claiming a fix.** The font bug was
   "fixed" once in a commit message before it was actually fixed. What
   resolved it was rendering a probe composition and *looking*.
4. **Placeholders must be loud.** The only genuinely dangerous placeholder is
   one that could be mistaken for a design decision.
5. **Structure timing as derived constants.** Three measured numbers at the
   top of `beats.ts`, everything else computed from them. A re-record becomes
   a re-measure.

### Craft

6. **A line that doesn't fit means a longer shot, never a faster take.**
7. **Cut to the first word, not the top of the file.**
8. **Generate dialogue *with* the video for talking heads.** TTS over a
   generated performance will not lip sync. Ever. The scratch track is for
   timing only.
9. **Keep copy in code, not baked into generated images.** Generators garble
   text, and baked text can't be animated or re-worded.
10. **Ask for several short clips, not one long one.** Video models top out
    near eight seconds, and cut testimony is the native grammar of the genre
    anyway — jump cuts read as *edited evidence*.
11. **Leave a quiet zone in the frame when commissioning footage.** Specifying
    "head and shoulders in the upper half, plain torso and room below" is what
    made the checklist and lower thirds possible without fighting the picture.
12. **Two identical colours at the same depth is a bug.** The auto's red
    tail-light sat beside the meter's red flag and the frame briefly had two
    flags in it. Desaturating the background layer settled which was which —
    and improved depth separation as a bonus.
13. **Roughness needs multiple scales.** One scale of noise is a zigzag. Three
    is a tear.
14. **Inpainting: take colour from the structure's own direction, grain from a
    featureless patch.** Copying pixels smears — across a row it blended grey
    housing into olive canopy and turned the boundary to mush; up a column it
    tiled a rivet into a ladder of rivets. Per-column median colour + grain
    transferred from the flattest square in the image has no feature left to
    repeat.
15. **Reuse footage across shots.** A listening cutaway from a clip you
    already have is free and reads exactly like a second camera.

### Technical traps

16. **Google Fonts returns multiple `@font-face` blocks per family, split by
    `unicode-range`.** Taking the first one grabs the **Cyrillic** subset. It
    loads fine, `document.fonts` reports "loaded", `fonts.check()` returns
    true — and every Latin character silently falls back per-glyph. Always
    extract from the `/* latin */` block.
17. **Register fonts at module level, not in a component.** A component that
    mounts partway through a shot registers its fonts partway through the
    render, and earlier frames paint against the fallback.
18. **Draw a speech balloon as one closed path.** Two overlapping shapes show
    a stroke seam where they meet.
19. **Safety filters trip on institutional framing, not on content.** A "TV
    correspondent delivering a public-health warning" was blocked as
    impersonation risk; the identical dialogue from "a guy with headphones on
    a video call" passed. Strip the institutional costume, keep the words.
20. **Verify what you can't perceive.** Audio can't be heard here — so measure
    RMS envelopes (a meter click is 65-80ms of activity; speech is 400ms+).
    Motion can't be watched — so render contact strips of key frames.

---

## 13. Known gaps

Honest list of what isn't done.

- **The "parallel universe" beat was never shot.** It's Shot 6's punchline and
  the script's biggest laugh in Scene 2. Needs one more witness clip: same
  setup, same wardrobe, eyes drifting off camera.
- **The audio-dropout glitch** the script asks for on that line is
  consequently unbuilt. The mechanism exists (`volume` accepts a function of
  frame; the picture-tear overlay is written) — it just has no line to land on.
- **No assembled episode.** Eleven separate MP4s; no single continuous cut.
- **No ambience beds.** The script calls for street ambience under Scene 1 and
  muffled room tone under the interviews. Neither exists — every shot is dry.
- **Shot 2's tension cue** (ambient dip under the held bubble) is unbuilt.
- **Shot 3's background auto is at full saturation**, so its tail-lights still
  clash with the meter's red flag. Shot 4 fixes this; Shot 3 was already
  delivered and left alone.
- **All cue timing is envelope-derived, not word-aligned.** No forced-alignment
  tool was available. Cues are accurate to within a few frames of a pause
  boundary, not frame-exact to a phoneme.
- **`public/cutouts-alpha/` is gitignored.** Anyone cloning fresh must run
  `node scripts/cutout-alpha.mjs` (then `crop-newspaper-clippings.mjs`) before
  rendering.
- **The Gemini key lives only in a local `.env`.** The container is ephemeral;
  a fresh session needs it re-supplied before any new line can be generated.

---

## 14. Running it

```bash
npm install

# Regenerate keyed cutouts (required after a fresh clone)
node scripts/cutout-alpha.mjs
node scripts/split-meter.mjs
node scripts/crop-newspaper-clippings.mjs

# Sound effects (idempotent; --force to rebuild)
python3 scripts/sfx.py

# Voice-over (needs a key; only generates missing lines)
set -a; . ./.env; set +a
python3 scripts/tts.py                     # all missing
python3 scripts/tts.py ep01-shot05a        # one line
python3 scripts/tts.py --force ep01-shot05a

# Preview / render
npx remotion studio
npx remotion compositions
npx remotion render Ep01Shot07Expert out/ep01-shot07.mp4 --crf 30
npx remotion still Ep01CoverCard out/ep01-cover.png --frame=359
```

`--crf 30` keeps deliverables small enough to move around without visible
degradation at this resolution.

---

## 15. Delivery — the bottom of the frame is not ours

Added 2026-08-29, during Episode 02.

These go out as Instagram Reels and YouTube Shorts, and both platforms cover
**the lower 20% of the frame** with their own furniture: handle, caption,
follow button, audio credit, and the vertical rail of action icons. At
1080×1920 that is everything below **y = 1536**.

**The rule: no text below y = 1536.** Ever, in any shot, in any episode.

Picture may run to the bottom edge and generally should — a desk that stops
short of the frame looks like a mistake, and platform chrome sitting over paper
is fine. It is only *copy* that has to stay clear, because copy that cannot be
read is the same as copy that was never set.

This is a delivery constraint, not a taste one, so it outranks composition. If
a caption will not fit above the line the layout moves up, the type gets
smaller, or the words get cut — in that order.

`src/components/safeArea.ts` holds `SAFE_BOTTOM_Y` and a `safeTop(height)`
helper. Use them instead of eyeballing a number: `top: safeTop(blockHeight)`
pins an element to the lowest legible line in the frame.

**Episode 01 predates this and violates it.** `Shot05Graphic` sets its
`0.36% OF ALL AUTO RIDES` footnote at y = 1742 and its `SOURCE: …` strip at
y = 1830, both of which are under the caption on a phone. Episode 02's stat
card was rebuilt to the rule — the whole page moved up, bars at 520 and 980
rather than 640 and 1200 — and Episode 01's Shot 5 wants the same treatment
before it is posted anywhere.

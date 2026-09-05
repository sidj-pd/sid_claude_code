# BIZZARO BANGALORE — Episode 03 lessons

Written after Case File #03: THE LANDLORD shipped as nine shots (eight
compositions; the tear transition folds into Shot 4). Episode 02's lessons
still stand — this covers what Episode 03 added, and it leads with the
things that had to be **asked for twice**, because those are the ones worth
not repeating.

---

## 1. Every change the director asked for, and what it means next time

These are in the order they happened. Each one cost a round trip that a
better first attempt would have saved.

### 1.1 "What are you doing eating into my tokens without even having any assets"

I spent a long stretch trimming voice-over dead air and restructuring the
beat grid for Shot 1 while the shot still rendered nothing but grey
placeholder boxes. All of it had to be re-derived once real art changed the
composition.

**Rule: build the picture first, then fit the audio to the cut.** When assets
are pending, either wait or build structure that does not depend on timing.
Audio is the last pass, not the first. (Saved as a standing memory.)

### 1.2 "Remove the triangles and the funky red things"

Episode 03 opened by adopting the style reference's accent layer — floating
triangles, circles, squiggles, an eye, a burst on the handover. Against
placeholders it looked like design. Against the delivered art it read as
belonging to **the reference video**, not to this series.

**Rule: a reference's motion grammar is adoptable; its decoration is not.**
The assembly-on-a-beat idea survived. The shapes went in the bin. Nothing was
lost — event density moved into the paper's own arrivals.

### 1.3 "Turn the tenant towards the right, flip the current position"

His artwork was generated facing away from the man he is arguing with, so the
confrontation read backwards. Fixed with a CSS `scaleX(-1)` rather than a
regeneration — but a horizontal flip **mirrors every x-fraction on the
figure**, so the hand that was measured at 0.85 across his box is at 0.15
afterwards. The cash's destination had to be re-derived, not nudged.

**Rule: when you mirror a figure, re-derive every position measured off it.**

### 1.4 "Increase the size of tenant and landlord"

They were sized at 0.68 and 0.72 of the wall's height, which is roughly what
a standing man actually measures against a domestic wall. On a 1080-wide
phone frame it made the room read like a doll's house and the faces barely
resolved.

**Rule: legibility at phone size beats anatomical proportion.** They ended at
0.9 and 0.94. Nobody reads a paper collage as dimensionally wrong; everybody
notices a face they cannot see. Note the knock-on: taller figures put heads
into wall detail placed for shorter ones, so the stain and poster patch had
to move — check the new bounding boxes in code before rendering.

### 1.5 "Keep a slight pause between the voice over and the dialogues"

Three takes butted together with 3-4 frames between them. Audible as a cut,
not as a conversation.

**Rule: a deliberate ten-frame breath before each line.** Nothing in the
audio forces it — it has to be put there. Applied at VO→tenant,
tenant→landlord, landlord→closing VO.

### 1.6 "Add a white border around the tenant and the landlord"

Took three attempts, and the first two are the lesson:

1. **16 chained CSS `drop-shadow()`s** (one offset copy per direction). Worked
   locally, **hung the render**: each drop-shadow in a filter chain
   re-composites the entire accumulated result of the ones before it, so 16
   is 16 full-image composites per frame. Chromium timed out on the first
   frame that used it.
2. **An SVG `feMorphology` dilate** — one operation instead of sixteen.
   Rendered, but left square tiling seams near the figure: headless
   Chromium's software rasteriser tiles large filtered elements and does not
   always compute a spreading filter across tile boundaries.
3. **A pre-baked `<asset>-outline.png`**, generated at build time by dilating
   the art's own binarised alpha and stacking it under the original. No
   per-frame cost at all.

**Rule: if an effect can be baked into an asset, bake it.** A runtime filter
that works in preview is not evidence it will survive a render.

Two sub-lessons from the same fix:
- Dilate with a **true separable max-filter**, not blur-then-threshold. The
  blur approximation left the ring inconsistently thick.
- **Drop connected components under ~24px before dilating.** The keyed art
  carries 1-4px alpha specks, invisible at native size, that each balloon
  into a visible white square once grown. `landlord-offer` had 13.
- And a `position: absolute` outline **paints above static siblings
  regardless of DOM order** — it needs an explicit z-index, or it covers the
  character instead of peeking out from behind.

### 1.7 "Shake them a little, sway side to side, to convey the dialogue"

Static cutouts with no mouths. Solved with `TalkSway`: a small stepped
side-to-side weight shift, active only across that figure's own line and
inert outside it. Stepped, not eased — a sine wave reads as motion graphics
in this series.

### 1.8 "Change the landlord's dialogue to 'Here is the full deposit amount'"

A dialogue rewrite is not just a re-record. The cash handoff had been
anchored to the isolated word "Here." in the old three-phrase take, which had
its own clean silence either side. The new line is one continuous phrase with
**no internal gap at all**, so that anchor vanished and the cue had to be
re-derived by syllable share (7 of 9 syllables land before "amount").

**Rule: when a line changes, re-check every visual cue that was anchored to
its silences.**

### 1.9 "Change Transit Studies to Housing Studies" / "the 45 second clip is feeling empty"

Two requests in one message, and the second was the real one. A longer
lower-third alone would not have fixed 45 seconds of talking head — clips 3
to 5 were nineteen seconds with nothing over them.

**Rule: a long photoreal shot needs on-screen furniture, and the series
already owns the device for it** — the newsprint checklist chit. Four
findings cut to the segments where he actually says them. Episode 02's expert
shot had the identical hole and filled it the identical way; I should have
built it in from the start rather than after being told the shot felt empty.

Constraint discovered: the chyron and the findings list **cannot coexist**. At
the height §15 forces the lower third to, it occupies the same band as the
list. The chyron holds ~17s and is out before the list arrives.

### 1.10 "On the last zoom make the font bigger than Episode 02's"

Done (112/148 against Ep02's 92/116). Worth knowing it interacts with the
punch-in: large right-aligned type and a punched-in whiteboard compete for
the same side of frame. See 3.3.

### 1.11 "Now I am getting the camera with the tripod in the frame"

The prompt said "a fixed camera on a tripod, not a propped phone" as a
*cinematography* note. The generator rendered an actual tripod standing in
the room.

**Rule: never name camera equipment in a prompt.** Describe the result — "
completely static throughout, no handheld sway, the way a formal sit-down
interview is shot" — because naming a piece of gear is a request for that
gear to be visible, exactly like naming any other prop.

### 1.12 "Now he is looking away from the camera"

Neither this prompt nor Episode 01's proven one specified an eyeline. It held
there and drifted here.

**Rule: state the eyeline explicitly in every talking-head prompt.** "Looks
directly into the camera the entire time, steady eye contact, addressing the
interviewer rather than glancing away or down at notes."

### 1.13 "Don't want that last zoom into the whiteboard, let it be in the background"

The prompt contained "that disconnect is the whole joke of a cutaway that
punches into it later" — a note about **our** post-production. The generator
took it as a stage direction for itself and baked a zoom into the take.

**Rule: never describe what the edit will do later.** State the opposite,
explicitly: "the shot never moves toward it, zooms into it, or refocuses onto
it at any point."

### 1.14 "The newspaper clippings and the headlines were overlapping" → "Why is the lower half of the clipping missing?"

The clearest over-correction of the episode. Told the headlines overlapped
the pictures, I cropped each clipping tight to its photo band. That fixed the
overlap and broke something worse: **with no caption line and no body-text
columns, a clipping stops reading as newsprint and becomes a photograph with
a headline above it.**

**Rule: a newspaper clipping needs its body text.** The columns are the thing
that says "newspaper". Crop from just below the clipping's own empty top
third (that blank band is what the code-set headline replaces) down through
the photo, its caption, and a good depth of columns.

Consequences to plan for, not discover:
- That crop is **portrait or near-square** (aspects 1.13, 1.11, 0.75), not
  landscape. Two of them only share a 9:16 page if the headline blocks give
  up width — 620/560, down from Episode 02's 800/600.
- Crop **horizontally too**. A full-width crop carries the surface the
  clipping was photographed *on* into the box, and `object-fit: cover` has
  nothing to trim when the box matches the crop's aspect, so the backdrop
  shows as grey bands down both sides of the newsprint.
- Overlap between two blocks is **computable**, not a matter of taste:
  `headlineLines*(w*0.098) + w*0.02 + quoteLines*(w*0.0525) + w*0.04 +
  clipHeight`. Derive it, add the landing punch, check the gap, then render.
- Set line breaks in the headline **explicitly**. Left to wrap, Shot 8's put
  "SYNDROME" alone on a fourth line.
- If a shot needs a different crop of a clipping another episode already
  uses, **copy the source under a new name**. Widening the shared entry
  silently re-frames a delivered shot.

### 1.15 "It's not clear which prompts to generate"

My prompt numbering shifts every time the sheet grows, and I had been quoting
stale numbers across several messages.

**Rule: when handing over prompts, give the exact commands and the exact
filenames, and say how many there are in total.** Never a bare number.

### 1.16 "Keep one asset for the correspondent PSA... let's add that text overlay"

The delivered take stopped a line short of the script — "You are not alone"
was never spoken. Rather than regenerate, it became a card landing in the
silence after he finishes, which is a better version of the script's own
"beat, false gravity" note than the spoken line would have been.

**Rule: a line the performance dropped can often become an overlay.** All
copy lives in code in this series anyway (§5), so this costs nothing and the
silence does the work.

---

## 2. Safety filters — three refusals on one prompt

Episode 02 established §12 rule 19: filters trip on institutional framing,
not on content. Episode 03 confirmed it the expensive way, refusing the same
expert prompt three times before it passed.

1. **"He never signals that any of it is absurd — that he is completely wrong
   is for the audience to notice, not for him to hint at."** My own addition,
   present in neither earlier episode's working prompt. Read literally,
   stripped of comic context, that instructs a generator to make fabricated
   expert claims maximally convincing and undetectable as fiction — which is
   close to the definition of what a misinformation classifier exists to
   catch. **Never write an instruction to make false content more
   convincing.** Replaced with an explicit "a scripted mockumentary interview
   for a comedy series: a fictional talking-head character."

2. **"BASELINE" and "CONTROL GROUP?"** — added to the whiteboard when asked to
   enrich it. Real clinical-trial vocabulary, stacked next to a bar graph, a
   line chart, "Dr." and an academic office, made the board read as genuine
   research. Swapped for deliberately mundane scribbles ("LUNCH?", "CALL
   BACK", "LEFTOVER PAINT") plus an explicit "nothing on it should look like
   genuine research or data of any kind."

3. **The named title itself.** What finally passed was dropping "DR. NAGESH
   RAMAMURTHY" from the generation prompt entirely and describing a plain
   physical person. His name, title and the unaccredited-institute joke were
   never going to render in the footage anyway — they are the chyron's job.

**Rule for next time: the generator never needs to know who the character
is.** Describe a body in a room. Identity, credentials and the joke are all
added in code. Shot 7's PSA prompt was written that way from the start and
passed first time.

**Second lever, if framing is already clean:** the dialogue. "Do not panic"
is the phrase that tripped Episode 02's PSA; it survived here, but it is the
first thing to swap.

---

## 3. Working with generated footage

### 3.1 Transcribe before you build, and after you cut

Six expert clips arrived in the asked-for order — but that was verified by
transcript, not assumed, because Episode 02 lost a rebuild to guessing clip
identity from envelope shape.

More important: **transcribe again after trimming.** My first voice-over
trimmer cut on the RMS envelope's own edges, and an envelope marks vowel
energy, not word boundaries: "Full amount. Here." came back as "Pull up.
Yeah." The quiet F and H onsets sit under the threshold and were sliced off.
Fixed with a 70ms attack and 110ms release before any cut — and caught only
because the cut takes were re-transcribed.

### 3.2 Every generated asset carries a watermark

Cutouts, footage, clippings — all of it, same corner. Three different
handlings, all cheap:
- **Cutouts:** measured 17-19 off the cream backdrop against a tolerance of
  38, so the flood fill absorbs it for free. Verified, not assumed.
- **Footage:** a soft dark radial fade at that corner. It sits *inside* the
  zone §15 already describes as covered by platform UI, so it is probably
  invisible on delivery — but it is plainly visible in the raw file, which is
  what gets reviewed.
- **Clippings:** the photo-band crop excludes it.

### 3.3 Source resolution caps the punch-in

The expert clips are 360x640. The composition already upscales 3x before any
push-in, so the 2.8x crop I picked first was ~8x effective magnification and
turned the whiteboard to mush — which defeats a punch-in whose entire job is
to show that his arrows connect to nothing.

**Rule: find the crop by rendering trial crops at full composition size and
looking at them**, with the on-screen type's zone overlaid. Two constraints
fight: gentler zoom keeps the board sharp but leaves the subject centre-frame
where the type lands on his face; harder zoom clears him but destroys the
board. 2.2x about x=0.88 was where they balanced. Do not carry a previous
episode's crop numbers over — measure this footage.

### 3.4 `Freeze` is required for held-behind-the-tear segments

A `<Sequence>` gives its child a fresh local timeline, so a second Sequence
restarts the same clip from its own frame zero. Playing the clip un-frozen
behind a tear and then cutting to it produces a visible jump the moment the
paper clears. Freeze the held segment at frame 0.

---

## 4. The keying pipeline

### 4.1 Trim the transparent padding, by coverage not bounding box

A keyed PNG is still the generator's full canvas with the artwork floating in
transparent padding. `objectFit: contain` fits **the canvas**, not the art, so
a box positioned in code places the padding and the artwork lands somewhere
inside it at a size nothing in the layout knows about — Shot 1's wall came out
540px wide in a 1000px box with all three overlays off the wall entirely.

Trim to the alpha, but **require a row or column to be ~2% opaque to count**.
A plain bounding box treated ~230 scattered opaque pixels below the wall's
skirting as artwork and reported 705x747 for a wall that is 704x602.

Opt in per asset. Episodes 01 and 02 have every position tuned against the
padded canvases.

### 4.2 Per-asset tolerance belongs to the delivered art, not the prompt

The sharpest trap of the episode. `landlord-offer` needed tolerance 42 (its
kurta measures 54 off the backdrop). `landlord-leaving` was generated from
near-identical prompt wording — and came back with a kurta whose histogram
**starts at 20**. Reusing 42 shredded it; the check render showed the field
straight through his back. It needed 18.

**Rule: measure every new asset's own closest tone, even when it is the same
character in the same wardrobe from the same prompt.**

### 4.3 Cream-on-cream artwork needs `interiorExclude`

The tenant's key-ring is drawn as cream shapes with dark outlines — delta 7
from the backdrop. The enclosed-hole pass punched the bodies out and left an
outline skeleton with the wall showing through. Turning that pass off kept
the keys but filled the gaps between his arm and torso and between his legs
with cream. Neither tolerance nor hole area separates the cases (both are
cream at delta 3-20, and the keys are the *larger* area). The pass now skips
a named box.

### 4.4 Delivered aspect ratios never match the prompt

Not once, across fifteen assets. Wall asked 1.37, arrived 1.169. Floor asked
2.08, arrived 0.574 — which turned out better, since a tall receding grid laid
from the wall's base runs off frame with its perspective the right way round.

**Rule: measure every delivered asset's ratio and derive box heights from
it.** Never hardcode a height next to a width.

### 4.5 `crop-newspaper-clippings.mjs` is not idempotent

Episode 01's clippings crop from the keyed PNG, so running the script twice
tries to crop an already-cropped file and dies with "bad extract area".
Re-key those first. Episode 02's and 03's use `fromSource: true` and are safe.

---

## 5. Small traps worth one line each

- **`PaperCutout`'s outline prop points at `<asset>-outline.png`.** Passing it
  without setting `outline` in the keyer's OVERRIDES is a **render failure**
  (404), not a missing effect. Shot 9 died on this.
- **`PaperCutout`'s texture overlay is an `AbsoluteFill` with
  `mix-blend-mode: multiply`** — it paints the whole div, not the silhouette.
  On a thin asset (the crack, 12% opaque in its own bounds) that is a visible
  rectangle. Set `textureOpacity={0}` when the art already has grain.
- **`EvidenceStamp` over pale footage needs a backing.** Red outline type on a
  pale wall and a pale shirt was nearly invisible; Episode 02's sat over
  darker material. Give it the same cream plate the chits use.
- **`StatBar`'s `remainderLabelInside`** fires whenever the leftover is wider
  than `height*0.5`. At 15% of a 912px bar that is 137px, so the figure drew
  twice — once above, once inside. Episode 01 hit this at 11%; set the flag.
- **Push-triggered renders use the workflow's default composition**, not the
  shot you are working on. Three runs in a row built an Episode 02 shot.
  Point the default at the current shot.
- **The `prompt` tool parses `###` + a backticked filename + a blockquote.** A
  numbered list parses to *nothing*, silently. Check the tool's own listing
  after appending, rather than assuming the append worked.
- **TTS glitches happen.** One take duplicated its own last two words ("hand
  it over. Hand it over.") with a matching 1.82s gap. Regenerate; do not try
  to repair.
- **Trim VO for a dialogue shot; do not trim it for an infographic.** Shot 1's
  takes were 35% silence and needed cutting. Shots 2, 6 and 8's silences *are*
  the graphic's timing cues — the pause after "survey," starts the bar, the
  dash is when the block travels. Trimming there removes the cue.

---

## 6. What went right and should be repeated

- **Deriving layout in `beats.ts` and stating the arithmetic in the comment.**
  Every geometry bug this episode was found in a still and fixed by
  computing, not nudging. The block-height formula in Shot 6 is the model.
- **Splitting a long narration line at its own mid-line silence** and running
  the first half under the assembly. Free 131 frames, and better documentary
  grammar than narration bolted on the end.
- **Placing visual beats inside measured silences**, not under words. The cash
  moves in a pause; the door closes in the 1.71s before "For now", so the act
  comes first and the narration catches up.
- **Reusing the series' own vocabulary instead of inventing devices.** The
  newsprint chit does duty as the witness's checklist, the expert's clinical
  findings and the PSA's conditions — three photoreal shots, one language.
- **Reproducing Shot 1's geometry exactly in Shot 9**, none of the numbers
  re-chosen. The point of a full-circle beat is that nothing changed.

---

## 7. Still open

- **No assembled episode.** Eight separate MP4s, same as Episodes 01 and 02.
  This is now three episodes of the same gap.
- **No ambience beds.** The script asks for empty-flat reverb and muffled room
  tone; every shot is dry apart from Shot 1's room hum.
- **Shot 9's "glance" is not staged.** The script has the landlord look at the
  tile, the stain and the crack before shutting the door. He is a cutout
  photographed from behind and cannot look at anything; a camera drift reads
  as drift and popping each piece of damage reads as a render fault. The
  silence before the door moves carries it instead, with all three in frame.
  If this beat matters, it needs a **second landlord pose** — three-quarter
  from behind, head turned down toward the floor — and a hard swap between the
  two, the way Episode 02 swapped the manager's laptop-open and -closed poses.
- **Episode 01's Shots 5 and 6 still violate §15** (content below y=1536).

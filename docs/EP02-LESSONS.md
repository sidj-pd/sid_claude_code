# BIZZARO BANGALORE — Episode 02 lessons

*Case File #02: THE MANAGER.* Written after the nine shots were rendered.
[PRODUCTION-NOTES.md](./PRODUCTION-NOTES.md) still holds; nothing here restates
it. This is only what Episode 02 taught, and the numbers are the point — every
claim below has one because every one of them was measured or paid for.

Episode 02: 9 shots, 2m 31s. Episode 01: 11 shots, 2m 41s.

---

## 1. The finding that mattered most

**Case 2 was Case 1's format, not a new build.** Every beat had a structural
twin, and the component library carried almost entirely — `StatBar`,
`PaperTear`, `NewsHeadline`, `Chyron`, `ChecklistItem`, `EvidenceStamp`,
`tornEdge`, `NewsprintTexture` all went in unchanged or nearly so. The work was
assets, audio, and one new component family.

That is now a standing rule: **where a beat has a twin, give it the twin's
treatment deliberately.** The comedy depends on the apparatus being identical
while the incident is trivially different. Two episodes solving the same beat
two different ways read as inconsistency, not variety.

The corollary is that Episode 03 should start by mapping its beats onto Episode
01 and 02's, and only then commissioning anything.

## 2. Timing

**Put the visual beat inside the silence, not under the words.** This is the
single most useful thing learned. The takes came back with much bigger internal
pauses than the delivery notes asked for, and those pauses are where the picture
should move:

| Beat | Gap | What goes in it |
|---|---|---|
| Shot 2 | 1.90s before "without a follow-up call" | cut back to the room; the punchline lands on a man not reacting |
| Shot 5 | 0.59s before the kicker | the whiteboard push starts, so it is already moving when the line lands |
| Shot 9 | 1.90s after "still responding fast" | the phone lights up |
| Shot 9 | 1.85s on "Boundaries..." | he closes the laptop, BEFORE "intact" is spoken |

That last one is the technique at its best. The act comes first and the
narration catches up, which is what makes "intact" sound like a question.

**A pause bigger than you wrote is a gift.** Cut to it rather than trimming it.

**Land a reaction after the line, not on it.** Shot 2's smile arrives four
frames after the narrator stops. On the line it would have him react before the
sentence finished; four frames later he takes a moment to believe it.

## 3. Measurement

**Every performer has their own rate. Never carry one over.**

```
narrator (Fenrir)     0.168 - 0.197 s/syllable
witness                       ~0.165
expert                         0.189
closing line (both eps)  0.225 / 0.226
```

Those closing lines matching to a thousandth of a second is the series' own
register reproducing itself, which is worth knowing: the closing shot is allowed
to be slower than everything else because it always has been.

**Measure the text that is actually in the clip.** An early pass put the expert
at 0.105 s/syllable — nearly twice as fast as reality — by measuring one clip
against the whole scripted paragraph when the clip held only its first two
sentences. Every cue derived from that number was wrong. Transcribe first, then
measure.

**Syllable subdivision resolves a segment with no silence in it.** Shot 4's
three checklist findings all sit inside one 3.13s breath. Subdividing by
syllable count put the boundary at the measured gap **to within 0.01s**, and it
agreed with the series' established rate. Validated again on Shot 7's two
conditions. This is now a normal tool, not a last resort.

## 4. Working with generated footage

**Transcribe before using. Do not identify clips by ear or by envelope.**

Four expert clips came back and I tried to identify them from duration, gap
count and voiced time. All three cluster too tightly to separate — voiced times
of 6.22, 6.08 and 5.56s for different paragraphs — and the end frames were
indistinguishable because the generator gave him none of the staging the prompt
asked for. My best guess put the precedent clip as the kicker. Wrong.

The fix takes one API call per clip, using the `GEMINI_API_KEY` already in
`.env`: send the audio to `gemini-2.5-flash` and ask for a verbatim transcript.
Four calls settled what an hour of arithmetic could not.

**The generator restructures and condenses the script.** It is not a typist.

- The expert's speech came back as **four** clips, not the three the prompts
  asked for, split at its own boundaries.
- "It's rare. It's poorly understood. Some don't recover." — absent from every
  take.
- "This... this progressed." — absent.
- "These are usually contained" became "usually isolated incidents".
- The witness's clip ran 10.01s against the 6.2s planned for it.

So: **write the shot around what arrived**, and expect the shot to get longer.
A line that does not fit means a longer shot, never a faster take — Episode 01's
hardest rule held again on Shots 4, 5 and 9.

**Ask when files are visually identical.** One question answered in seconds beat
a wrong guess that would have put the wrong dialogue under the wrong graphics.

## 5. The delivery constraint (new, and it changes layout everywhere)

**No text below y = 1536.** Instagram Reels and YouTube Shorts cover the lower
20% with handle, caption, follow button and action rail. This is now §15 of the
production notes, and `src/components/safeArea.ts` holds `SAFE_BOTTOM_Y` and
`safeTop(height)`.

It is not a small constraint. It broke three shots:

- **Shot 3** had its footnote at 1742 and source strip at 1830. The whole page
  moved up — bars from 640/1200 to 520/980.
- **Shot 5**'s chyron, raised to clear the chrome, landed on top of `NOW` — the
  one word in the shot that has to read.
- **Shot 6** and **Shot 8** both needed tighter headline stacks than their
  Episode 01 twins, which run under the caption.

**Episode 01 predates the rule and violates it.** `Shot05Graphic` and
`Shot06Testimony` both set copy below 1536. Worth fixing before it is posted.

**Two things follow:**

**Fixing one collision creates the next.** Raising Shot 3's page compressed a
band, and three sequential overlaps followed — footnote into stamp, stamp into
arrow, footnote into stamp again. Budget for two or three passes on any dense
lower block, and check the same still each time.

**Box positions can be computed; rendered text extents cannot.** I placed
elements by arithmetic and got them right, then estimated the typewriter face's
width and was out by 84px. Type sitting near another element always needs a
still to confirm. `RansomSpecialElite` advances about 0.6em plus letter-spacing,
which is close enough to plan with and not close enough to trust.

## 6. Asset pipeline

**Clippings are never keyed; crop them from source.** `NewsHeadline` shows a
clipping in a box with `overflow: hidden` and `object-fit: cover`, so its outline
is the box and the alpha is unused. Episode 02's clippings arrived on cream,
which is **unkeyable against cream paper** — measured 4-10 values apart against
a tolerance of 38, so the fill walked through the paper. Tolerance 3 does not
help; then the backdrop survives at 92% opaque. No value separates them.
`crop-newspaper-clippings.mjs` now takes `fromSource: true` for these.

Episode 01's clippings still key first, because those were photographed on wood
and the alpha is what removes it. I removed the wood specifically to dodge that
`tolerance: 46` override, which was the wrong trade — but the source-crop fix
makes the backdrop irrelevant either way.

**Two-pose swaps beat splitting a part out.** Both the employee's smile and the
manager's closing laptop are two registered drawings, hard-cut. That is cheaper
than a `split-meter.mjs` equivalent and it reads correctly, because paper puppets
do not cross-fade — an animator changes them between frames.

**Verify registration before relying on a swap.** Measure head top, an outer
edge, and total mass:

```
employee smile   head top delta 0   right edge delta 0   mass within 11px
manager laptop   head top delta 0   right edge delta 0   mass -5.5% (the lid)
```

Bounding boxes differ where the desk is drawn differently, and that is fine if
those edges fall outside the frame at the shot's scale — check that they do.

**Commission the moving part absent.** The clock arrived handless on purpose and
the hands are drawn in code, so it can tick and can read 11:47 to match the
testimony. Cheaper than cutting a part out afterwards, which is the only reason
`split-meter.mjs` exists.

**Ask for blank screens, always.** Every screen in this episode arrived empty
and every word on them is code. That is what let the leave request be re-worded
three times without regenerating anything.

**Aspect and technique drift between assets.** `manager-desk-night` came back
portrait 0.56 and painterly, against `employee-desk-34`'s landscape 1.34 and flat
cut paper. Beat 9 is meant to mirror Beat 1 and does not, quite. If two cutouts
have to rhyme, say so in both prompts and generate them together.

## 7. Safety filters

**A warning that is not inside the artefact does not work.**

Episode 01 already recorded the finding (§12 rule 19): filters trip on
institutional framing, not on content. I wrote that warning into the footage
README as a note *underneath* the PSA prompt — and then wrote the prompt asking
for a "television correspondent" in a "broadcast studio" delivering "a
public-health advisory". It was refused, exactly as documented.

Rewritten as a man with headphones at a laptop in a plain room, words unchanged,
it passed immediately — and matched Episode 01's actual footage better, since
that PSA was never a studio either.

**So: put the constraint in the prompt, not beside it.** The same applies to
every keyer rule now baked into `public/cutouts/README.md`.

## 8. Tooling and environment

**The phone cannot render, and that is settled.** No aarch64 chromium in Termux,
and the Chrome Headless Shell Remotion downloads is a glibc build Android's
Bionic cannot load. `remotion studio` is also out: rspack ships no android-arm64
binding, and its WASI fallback fails because Android denies `uvwasi_init` a
preopen of `/`. Repointing that at `$HOME` clears the error and the process then
exits silently. Abandoned.

**CI renders in about two minutes a shot.** `.github/workflows/render.yml`, on
`workflow_dispatch` or any push to `claude/**`. It keys the cutouts first, since
`cutouts-alpha/` is gitignored and absent on a fresh checkout.

**Render stills alongside the video.** From a phone they are the only way to
actually look at a shot, and every layout bug this episode was found in a PNG.
`-f frames="..."` on the dispatch.

**What the phone CAN do, and it is most of the work:** `tts.py`, `sfx.py`,
`measure-vo.py`, keying, cropping, typechecking, and — after installing ffmpeg —
frame extraction and audio measurement from video. Plus Gemini transcription.
Author and measure locally, render remotely.

**Environment gotchas, all real:**

- `sharp` has no android-arm64 prebuild. `npm i @img/sharp-wasm32` gives working
  libvips 8.18.6.
- `npx tsc` fails — Termux has no `/usr/bin/env`. Use
  `node node_modules/typescript/bin/tsc --noEmit`.
- ffmpeg's Termux package was broken by an x265 symbol mismatch;
  `pkg install --reinstall x265` fixed it.
- `gh workflow run` occasionally fails with `unexpected EOF`. Retry.
- `crop-newspaper-clippings.mjs` is not idempotent — it overwrites the keyed
  PNG, so re-key before re-cropping.

**Wire only cues that exist.** Shot 9's first render died on a 404 for
`sfx/laptop-close.wav`, a cue specified in the plan and never written into
`sfx.py`. Check `public/sfx/` before referencing.

## 9. Craft notes worth keeping

**Fill a dead middle with vocabulary you already own.** Shot 5's clips 2 and 3
were seventeen seconds of talking head with nothing over them, because Episode
01 broke its equivalent up with a cutaway and there is none here. The fix was
his claims entering the record on the *same chit the witness's checklist uses* —
which filled the gap and tied the two photoreal shots together instead of
inventing a third look.

**Distinguish a record from an instruction.** Shot 4's checklist and Shot 5's
findings are chits, because they record something that happened. Shot 7's
advisory instructions are stamped type, because they are being told to you. Same
episode, same palette, different objects.

**Copy in code pays for itself immediately.** The leave request was re-worded
twice and re-typeset three times without touching the art.

**A delay can be the joke.** Shot 4's final tick goes up as he says the line and
then sits there, empty, for four and a half seconds through two more sentences
before ticking. The script asked for "slightly delayed"; the take gave room for
much more.

## 10. Still open

- **No assembled episode.** Nine MP4s, no single cut. This was Episode 01's
  biggest listed gap and it is Episode 02's too. Build the parent composition
  *before* the shot count grows next time.
- **No ambience beyond `room-hum`.** Shots 3 through 8 are dry.
- **Episode 01 violates §15** in Shots 5 and 6.
- **Shot 9's mirror is imperfect** — see the aspect/technique note in §6.
- **`1 NEW MESSAGE` chit overlaps the manager's forearm**, and the phone glow is
  a flat rectangle rather than a lit screen.

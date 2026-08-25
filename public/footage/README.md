# Photoreal footage — Episode 01, Scene 2

Scene 2 leaves the paper world. Its footage is generated outside this repo and
dropped in here; `src/components/Footage.tsx` renders a labelled slate wherever
a file is still missing, so the shots build and preview without it.

## Files the shots look for

| File | Shot | Length needed |
|---|---|---|
| `ep01-witness.mp4` | 6 — Witness Testimony | landed, 10s |
| `ep01-correspondent-q.mp4` | 6 — the question that opens it | landed, 6s |
| `ep01-expert-1.mp4`, `ep01-expert-2.mp4` | 7 — The Expert | landed, 10s each |
| `ep01-expert.mp4` | 7 — The Expert | ~14s |
| `ep01-witness-2.mp4` | 8 — the passenger again, more haggard | ~10s |
| `ep01-correspondent.mp4` | 9 — Correspondent PSA | ~12s |

## Two things worth deciding before generating

**Generate the dialogue with the video, not separately.** These are talking
heads, and TTS laid over a generated performance will not lip sync. The lines
below are meant to be spoken by the model. The TTS takes in `public/vo/` for
the passenger are a scratch track for timing only, and get dropped once real
clips land. The correspondent's questions in Shots 6 and 8 are off-screen, so
those stay TTS.

**Generate in several clips.** The models top out around eight seconds, and an
interview is cut anyway — jump cuts between takes are the native grammar of
this kind of testimony and make it read as edited evidence rather than as one
unbroken performance. Deliver each shot as numbered clips
(`ep01-witness-1.mp4`, `-2`, …) and they get assembled here.

**Leave the lower part of the frame quiet.** Vertical 9:16, head and shoulders
in the upper half. The evidence checklist and the lower third sit over roughly
the bottom 45% of the frame, so keep that area to plain torso and room — no
busy background, no hands coming up into it.

---

## Shot 6 — the correspondent's question

**Landed.** Cuts in before the witness answers. He is the other end of the same video
call, so this matches the witness's register rather than the studio look of
Shot 9 — a call, not a broadcast.

A photorealistic vertical video, 9:16, of an Indian television correspondent
in his forties on a video call from a work desk. Clean-shaven, a plain dark
shirt or a jacket over a light shirt, over-ear headphones with a small boom
mic. Behind him a plain office wall, a shelf edge, a closed laptop — tidy and
anonymous. Even indoor light from a window off to one side, slightly cooler
than the witness's room.

Framed on a laptop webcam, so slightly high and level with his eyes, dead
still, no camera movement. Head and shoulders in the upper half; the lower
half stays plain torso and desk, for the caption. The look is the same
compressed video call: soft focus, sensor noise in the shadows, no grade, no
shallow depth of field, no music.

He is professionally uninterested. He is not the subject of this piece and
knows it. No warmth, no leaning in, no encouraging nod — he asks and then
waits, blinking, one small notepad glance.

Spoken dialogue:

1. "Can you walk us through what happened?"

## Shot 6 — the witness

A photorealistic vertical video-call recording, 9:16, of an Indian man in his
early thirties sitting at home in Bangalore, talking to camera as though on a
video call. Slightly built, short dark hair, two days of stubble, a plain
crew-neck t-shirt in a washed-out colour. He sits in a small apartment room:
an unmade bed or a plain painted wall behind him, a window off to one side
throwing flat overcast daylight across his face, a ceiling fan turning slowly
out of focus. The camera is a phone propped on a table, so the framing is
slightly low and slightly off-centre, dead still, no camera movement at all.
Head and shoulders in the upper half of the frame; the lower half is plain
torso and room.

The look is a compressed video call, not cinema: soft focus, mild motion blur
when he moves, visible sensor noise in the shadows, slightly crushed blacks, a
faintly cool white balance. No colour grading, no shallow depth of field, no
lens flare, no music.

His performance is deadpan and mildly shaken. He is describing something
ordinary that disturbed him and he has not worked out why. He does not
gesture, does not smile, and does not perform distress — he recounts. Small
pause between each sentence. He blinks slowly and holds eye contact with the
camera, except where noted.

Spoken dialogue, split across clips:

1. "He put the meter down. Without even asking."
2. "He wasn't honking. He wasn't on the phone."
3. "He stopped at every single signal. He followed every rule."
4. — his eyes drift off camera, as though replaying it — "It almost felt
   like... I was in a parallel universe."

**Landed as one 10s clip** covering the list. The checklist in
`shot06/beats.ts` is cut to its measured envelope. The parallel-universe beat
is the shot's punchline and still wants its own clip — same setup, same
wardrobe, eyes drifting off camera.

## Shot 7 — the expert

**Correspondent's question stays off-screen here**, per the script — no clip
needed for it. It plays as a TTS line (`ep01-shot07-q`, already generated)
under a held, silent frame of Dr. Ramamurthy about to answer, the same way
the script originally had Shot 6 staged before you sent that clip on-screen.
Say the word if you'd rather show him again for visual variety.

**Landed as two clips**, two lines each, per your direction — not the four
originally asked for below. `ep01-expert-1.mp4` carries lines 1-2 in one
continuous take (the script's own em-dashes landing as real pauses in the
delivery); `ep01-expert-2.mp4` carries lines 3-4, including a long silent
beat before the kicker that happens to land exactly where the script's
"leans in" stage direction wants it.

**No fifth clip for the whiteboard cutaway.** The generated footage already
has "a whiteboard with a few hand-drawn arrows" as set dressing behind him,
upper-right of frame — Shot07Expert.tsx punches the camera into that
existing part of the frame during the kicker line rather than using a
separate shot. `WHITEBOARD_CROP` in that file is now measured off the real
clip rather than guessed.

**The correspondent's reaction cutaway between the two clips reuses his Shot
6 footage** — the silent few seconds after his question there, where he is
listening rather than speaking — instead of a new clip. `trimBeforeInFrames`
on `Footage` is what makes that possible: it skips into the middle of an
existing source rather than always starting a Sequence at frame zero.

The same photoreal register but a more formal setup, which is the joke: he
believes he is the credible one. A photorealistic vertical video, 9:16, of an
Indian man in his late fifties — DR. NAGESH RAMAMURTHY — seated in a small
office. Neat side-parted grey hair, rimless glasses, a well-pressed short-
sleeved shirt. Behind him a bookshelf of identical unlabelled binders and a
whiteboard with a few hand-drawn arrows on it. Lit by an overhead fluorescent
tube and a desk lamp, so the light is even and slightly green.

Framing is straight-on, chest up, still — a fixed camera on a tripod rather
than a propped phone. Cleaner and a touch better exposed than the witness
call, but still video, not film: no shallow focus, no grade, no movement.

He performs total academic confidence. Unhurried, faintly pleased with
himself, hands folded or making one small precise gesture per sentence. He
never smiles at his own material.

Spoken dialogue, split across clips:

1. "What we're looking at here is a textbook case of W.T.F. Syndrome —
   Willful Traffic-rule Following."
2. "Under extreme cognitive load — traffic, heat, passenger volume — the brain
   sometimes overcorrects."
3. "He didn't choose to follow the rules. His brain simply forgot how to break
   them."
4. — leaning slightly in, completely sincere — "Frankly, we're lucky he
   remembered how to drive at all."

## Shot 8 — the witness again

Identical setup, room, wardrobe and framing to Shot 6 — same man, same t-shirt,
same room, same propped phone — so the two read as the same call on a later
day. The only change is him: darker under-eye circles, flatter affect, a
stillness that has stopped being composure. He blinks less.

Spoken dialogue:

1. "He gets compensation for suffering? What about me?"
2. "I followed every rule too. I sat there and just... accepted it."
3. "Why should I suffer alone?"

## Shot 9 — the correspondent

A photorealistic vertical video, 9:16, of a television correspondent in his
forties speaking directly to camera in the manner of a news sign-off. Indian,
clean-shaven, a plain dark jacket over a light shirt, no tie. He stands or
sits against a neutral studio backdrop — flat mid-grey, evenly lit, no set
dressing. The framing is centred and formal, chest up, camera locked off.

Broadcast video rather than a call: correctly exposed, sharp, slightly flat
contrast. Still no grade and no camera movement.

He delivers a public-health warning with complete sincerity and no wink
whatsoever. Level, measured, faintly grave.

Spoken dialogue:

1. "If you or someone you love has experienced a similar auto ride — do not
   panic. Do not tip extra. This may worsen the condition."
2. "Please report the incident to your nearest Auto Union office."

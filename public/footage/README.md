# Photoreal footage — Episode 01, Scene 2

Scene 2 leaves the paper world. Its footage is generated outside this repo and
dropped in here; `src/components/Footage.tsx` renders a labelled slate wherever
a file is still missing, so the shots build and preview without it.

## Files the shots look for

| File | Shot | Length needed |
|---|---|---|
| `ep01-witness.mp4` | 6 — Witness Testimony | ~28s |
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

## Shot 7 — the expert

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

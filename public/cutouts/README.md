# Paper cutouts — source art and prompts

Source art is a **flat JPG on a cream backdrop**. `scripts/cutout-alpha.mjs`
keys that backdrop out with an edge-seeded flood fill into
`public/cutouts-alpha/`, which is what actually renders. Re-run it after
dropping in any new art, then register the asset in `src/assets/cutouts.tsx`.

## What the keyer needs, and why each rule is here

Every one of these is a mistake Episode 01 paid for in a per-asset override:

| Rule | What went wrong without it |
|---|---|
| Plain flat cream backdrop reaching all four edges | The fill is seeded from the border; anything else strands it |
| **No drop shadow, cast shadow or painted ground shadow** | `hailing-hand` needed `tolerance: 72` and still left a halo |
| No deckle edge, torn-page border, mount or frame | `traffic-signal` arrived on a paper sheet filling the canvas, needed `inset: 0.1` |
| Never photograph art on a table | `newspaper-clip-autounion` was shot on wood grain, needed `tolerance: 46` |
| Artwork tones clearly off-cream | Cream *artwork* survives only because the interior pass runs at `tolerance: 10` |
| Nothing touching the frame edge | Artwork touching the border is read as backdrop and eaten |

Two further rules come from the production notes rather than the keyer:

- **Nothing that has to move independently may be baked in.** The meter's flag
  cost a whole script (`split-meter.mjs`) because it arrived welded to its
  housing. Ask for the moving part separately, or ask for it to be absent and
  draw it in code.
- **No copy in the art, ever.** §5: all on-screen text is set in code, so it
  matches the script exactly, animates, and can be re-worded. Generators garble
  lettering anyway. Screens arrive blank.

**Style goes inside every prompt, never pasted separately.** That has been the
standing rule since Episode 01 Shot 1.

---

# Episode 02 — Shot 1, "The Leave Request"

Employee at a desk late at night, cursor hovering over Send. Five assets.

## `employee-desk-34.jpg`

> Hand-cut paper collage illustration in the style of a printed mid-century
> explainer: layered construction and craft paper, matte and slightly
> desaturated, with visible scissor-cut and torn edges and a fine halftone
> grain over the whole piece. Flatly lit from above — no rendering, no gloss,
> no gradient lighting, no highlights.
>
> Subject: a South Indian man in his early thirties sitting at a plain desk,
> seen from a three-quarter angle from his left, leaning very slightly toward
> an open laptop. Plain crew-neck t-shirt, short hair. His posture is tired and
> still — one hand resting flat beside the laptop, shoulders low, chin slightly
> down. The desk is a bare slab with nothing on it but the laptop. The laptop's
> screen is a completely empty flat dark rectangle: no text, no icons, no
> lettering, no glow, no reflection.
>
> It is late at night, and that is carried entirely by the palette — deep
> indigo, slate and charcoal papers for his clothing and the desk, warm muted
> paper for skin — never by lighting. The piece stays flatly lit.
>
> The figure sits centred on a plain flat cream craft-paper backdrop that runs
> to all four edges with clear empty margin all round. No drop shadow, no cast
> shadow, no shading painted onto the backdrop. No deckle edge, no torn-page
> border, no frame, no mount, no table or wood grain. Nothing touches the edge
> of the frame. No text anywhere in the image.

## `laptop-screen.jpg`

The punch-in asset. Shot 1 pushes in on it for the Send hesitation and Shot 2
reuses it for the reply. Near-frontal so code-rendered copy can sit on the
screen without a perspective fight.

> Hand-cut paper collage illustration in the style of a printed mid-century
> explainer: layered construction and craft paper, matte and slightly
> desaturated, with visible scissor-cut and torn edges and a fine halftone
> grain over the whole piece. Flatly lit from above — no rendering, no gloss,
> no gradient lighting.
>
> Subject: an open laptop seen almost straight on and very slightly from
> above, tilted about eight degrees clockwise, filling most of the frame. The
> screen is a completely empty flat dark rectangle — no text, no icons, no
> lettering, no user interface, no glow, no reflection, nothing on it at all.
> The keyboard below is suggested with simple cut paper rectangles, no legends
> on the keys. The body is slate and charcoal paper.
>
> Centred on a plain flat cream craft-paper backdrop running to all four edges
> with clear empty margin all round. No drop shadow, no cast shadow, no shading
> painted onto the backdrop. No deckle edge, no torn-page border, no frame, no
> mount, no desk surface, no wood grain. Nothing touches the edge of the frame.
> No text anywhere in the image.

## `wall-clock-face.jpg`

**Deliberately handless** — it has to tick, so the hands are drawn in code.

> Hand-cut paper collage illustration in the style of a printed mid-century
> explainer: layered construction and craft paper, matte and slightly
> desaturated, with visible scissor-cut and torn edges and a fine halftone
> grain over the whole piece. Flatly lit from above — no rendering, no gloss,
> no gradient lighting.
>
> Subject: a plain round office wall clock seen straight on, filling the frame.
> A simple cut-paper rim in muted slate, a pale bone-coloured face, and twelve
> small cut tick marks around the edge, with slightly longer marks at the
> quarters. **The clock has no hands at all** — no hour hand, no minute hand,
> no second hand, and no centre pin. The face is otherwise completely empty:
> no numerals, no brand name, no lettering of any kind.
>
> Centred on a plain flat cream craft-paper backdrop running to all four edges
> with clear empty margin all round. The clock's face must be clearly darker
> and cooler than the cream backdrop so the two do not read as the same paper.
> No drop shadow, no cast shadow, no shading painted onto the backdrop. No
> deckle edge, no torn-page border, no frame, no mount, no wall texture.
> Nothing touches the edge of the frame. No text anywhere in the image.

## `desk-lamp.jpg`

> Hand-cut paper collage illustration in the style of a printed mid-century
> explainer: layered construction and craft paper, matte and slightly
> desaturated, with visible scissor-cut and torn edges and a fine halftone
> grain over the whole piece. Flatly lit from above — no rendering, no gloss,
> no gradient lighting.
>
> Subject: a simple angled desk lamp seen from the side, the shade tilted down
> and to the right, on a small round base with a single straight arm. Muted
> mustard or brick paper for the shade, charcoal for the arm and base. The lamp
> is switched off — no light pool, no glow, no light rays, no bright patch
> anywhere.
>
> Centred on a plain flat cream craft-paper backdrop running to all four edges
> with clear empty margin all round. No drop shadow, no cast shadow, no shading
> painted onto the backdrop. No deckle edge, no torn-page border, no frame, no
> mount, no desk surface. Nothing touches the edge of the frame. No text
> anywhere in the image.

## `office-window-night.jpg`

Recedes furthest back in the composition, so it sits nearly flat
(`elevation: 0.4`) and must not compete with the figure.

> Hand-cut paper collage illustration in the style of a printed mid-century
> explainer: layered construction and craft paper, matte and slightly
> desaturated, with visible scissor-cut and torn edges and a fine halftone
> grain over the whole piece. Flatly lit from above — no rendering, no gloss,
> no gradient lighting.
>
> Subject: a plain rectangular window seen straight on, with a simple cut-paper
> frame and a single vertical divider. Beyond the glass is night in flat cut
> paper: a deep indigo field with a scattering of small warm rectangular
> windows from distant buildings, cut as simple shapes with no detail and no
> glow. The whole piece is low in contrast and quiet — it sits behind a figure
> and must not compete with him.
>
> Centred on a plain flat cream craft-paper backdrop running to all four edges
> with clear empty margin all round. No curtains, no blinds, no wall around the
> window, no drop shadow, no cast shadow, no shading painted onto the backdrop.
> No deckle edge, no torn-page border, no frame, no mount. Nothing touches the
> edge of the frame. No text anywhere in the image.

---

## After the art lands

```bash
node scripts/cutout-alpha.mjs employee-desk-34 laptop-screen \
     wall-clock-face desk-lamp office-window-night
```

Then check each keyed PNG before building anything on it. A halo means the
source carried a shadow; holes through the artwork mean a tone sat too close to
cream. Both are per-asset `OVERRIDES` in `scripts/cutout-alpha.mjs`, but both
are cheaper to fix by regenerating the art.

---

# Episode 02 — Beats 6, 8 and 9

## The three newspaper clippings

**Clippings are never keyed, so their backdrop does not matter.** `NewsHeadline`
shows a clipping in a box with `overflow: hidden` and `object-fit: cover`, so its
outline is the box rather than a silhouette — the alpha channel is unused.
`crop-newspaper-clippings.mjs` therefore crops Episode 02's clippings straight
from the source JPG.

That was worth discovering the hard way. Episode 02's clippings arrived on cream,
which the keyer cannot separate from cream paper at all: measured 4-10 values
apart against a tolerance of 38, so the fill walked through the paper and punched
it full of holes. Tolerance 3 does not help either — then the backdrop survives.
Cropping from source skips the question, and cream around a clipping is invisible
on a cream page anyway. Episode 01's still key first, because those were
photographed on wood and the alpha is what removes it.

**No readable headline in the art.** `NewsHeadline` sets the headline and quote
in code, over the clipping — that is what keeps the copy exactly on the script's
wording and animatable. The clipping supplies the photo and the greeked body
text, which a generator renders better than CSS can fake. Leave clear space
across the top third for the code-set headline to sit in.

**On a flat cream backdrop, not a table.** Episode 01's `newspaper-clip-autounion`
was photographed on wood grain and needed a `tolerance: 46` override to key.

`scripts/crop-newspaper-clippings.mjs` crops each one down to its photo
afterwards, so the clipping can be generous — but two headlines have to share a
9:16 frame, so keep the photo roughly landscape rather than tall.

### `newspaper-clip-managers.jpg`

> A photograph of a single torn clipping from an old newspaper, lying flat and
> square-on. The paper is aged to a yellowish cream, softly foxed, with one
> ragged torn edge down the right side and small tears at the corners.
>
> Across the top third the paper is EMPTY — no headline, no display type, just
> blank newsprint with a couple of faint horizontal rules. Below that sits a
> single black-and-white press photograph, roughly landscape, of a group of
> Indian office managers in their forties standing together outside a corporate
> building in shirts and lanyards, mid-discussion, looking organised and mildly
> aggrieved — the look of people who have just formed a committee. Under the
> photo, three narrow columns of small newspaper body text in unreadable
> greeked latin filler, slightly blurred and broken as old newsprint is.
>
> The clipping lies on a plain flat even surface with clear margin all round —
> cream is fine, since these are cropped from the source rather than keyed. No
> wood grain, no desk, no hands, no drop shadow, no cast shadow. Nothing touches
> the edge of the frame. No legible headline text anywhere in the image.

### `newspaper-clip-ownclaim.jpg`

> A photograph of a single torn clipping from an old newspaper, lying flat and
> square-on. The paper is aged to a yellowish cream, softly foxed, with one
> ragged torn edge down the left side and small tears at the corners.
>
> Across the top third the paper is EMPTY — no headline, no display type, just
> blank newsprint with a couple of faint horizontal rules. Below that sits a
> single black-and-white press photograph, roughly landscape, of one Indian man
> in his late forties in a plain office shirt sitting alone at a desk, looking
> lost and slightly hollowed out, staring at nothing. Under the photo, three
> narrow columns of small newspaper body text in unreadable greeked latin
> filler, slightly blurred and broken as old newsprint is.
>
> The clipping lies on a plain flat even surface with clear margin all round —
> cream is fine, since these are cropped from the source rather than keyed. No
> wood grain, no desk, no hands, no drop shadow, no cast shadow. Nothing touches
> the edge of the frame. No legible headline text anywhere in the image.

### `newspaper-clip-hrcommittee.jpg`

For Beat 8. Episode 01 has a `newspaper-clip-committee`, but that one is a
government committee and this is HR — a different room.

> A photograph of a single torn clipping from an old newspaper, lying flat and
> square-on. The paper is aged to a yellowish cream, softly foxed, with one
> ragged torn edge along the bottom and small tears at the corners.
>
> Across the top third the paper is EMPTY — no headline, no display type, just
> blank newsprint with a couple of faint horizontal rules. Below that sits a
> single black-and-white press photograph, roughly landscape, of an empty
> corporate meeting room in India: a long table, eight stacking chairs pushed
> in, a blank flip chart, fluorescent light, nobody in the room at all. Under
> the photo, three narrow columns of small newspaper body text in unreadable
> greeked latin filler, slightly blurred and broken as old newsprint is.
>
> The clipping lies on a plain flat even surface with clear margin all round —
> cream is fine, since these are cropped from the source rather than keyed. No
> wood grain, no desk, no hands, no drop shadow, no cast shadow. Nothing touches
> the edge of the frame. No legible headline text anywhere in the image.

## The manager at his desk — two poses

Beat 9 mirrors Beat 1 from the manager's side, and he closes his laptop instead
of replying. **That is a two-pose swap, not a moving lid** — the same trick the
employee's smile uses, which is registered and works. So: the same drawing
twice, identical framing, differing only in the laptop.

Generate them as a pair. If the framing drifts between them the swap will jump
rather than reading as a paper puppet changing pose.

### `manager-desk-night.jpg` — laptop open

> Hand-cut paper collage illustration in the style of a printed mid-century
> explainer: layered construction and craft paper, matte and slightly
> desaturated, with visible scissor-cut and torn edges and a fine halftone grain
> over the whole piece. Flatly lit from above — no rendering, no gloss, no
> gradient lighting.
>
> Subject: an Indian man in his late forties sitting at a plain desk, seen from
> a three-quarter angle from his RIGHT — mirroring a younger man drawn from his
> left, so the two read as opposite sides of the same situation. Short greying
> hair, a plain collared shirt with the sleeves rolled. His posture is heavy and
> settled, one hand flat on the desk, shoulders low. In front of him an OPEN
> laptop, its screen a completely empty flat dark rectangle: no text, no icons,
> no lettering, no glow. Beside it a small dark phone, face up, screen also
> completely empty.
>
> It is late at night, and that is carried entirely by the palette — deep indigo,
> slate and charcoal papers for his clothing and the desk, warm muted paper for
> skin — never by lighting. The piece stays flatly lit.
>
> The figure sits centred on a plain flat cream craft-paper backdrop that runs
> to all four edges with clear empty margin all round. No drop shadow, no cast
> shadow, no shading painted onto the backdrop. No deckle edge, no torn-page
> border, no frame, no mount, no table or wood grain. Nothing touches the edge
> of the frame. No text anywhere in the image.

### `manager-desk-closed.jpg` — laptop closed, hand still on it

> The SAME illustration as the previous one, in the same style, with the same
> man in the same position, the same clothes, the same desk, the same phone, the
> same framing and the same scale — identical in every respect except one.
>
> Hand-cut paper collage illustration in the style of a printed mid-century
> explainer: layered construction and craft paper, matte and slightly
> desaturated, with visible scissor-cut and torn edges and a fine halftone grain
> over the whole piece. Flatly lit from above — no rendering, no gloss, no
> gradient lighting.
>
> Subject: an Indian man in his late forties sitting at a plain desk, seen from
> a three-quarter angle from his RIGHT. Short greying hair, plain collared shirt
> with the sleeves rolled. The laptop in front of him is now CLOSED — a flat
> slate slab — and his hand rests on top of the closed lid. Beside it the same
> small dark phone, face up, screen completely empty. His expression is calm and
> unreadable. Night is carried by the palette, not by lighting: deep indigo,
> slate and charcoal papers, warm muted paper for skin.
>
> Centred on a plain flat cream craft-paper backdrop running to all four edges
> with clear empty margin all round. No drop shadow, no cast shadow, no shading
> painted onto the backdrop. No deckle edge, no torn-page border, no frame, no
> mount, no table or wood grain. Nothing touches the edge of the frame. No text
> anywhere in the image.

---

# Episode 03 — Shot 1, "The Empty Flat"

The flat assembles itself piece by piece on a 19-frame pulse, so every layer
arrives as a **separate cutout**. Nine assets.

Two constraints specific to this shot:

- **The wall and floor are large near-uniform fields.** That is the exact shape
  of the Episode 02 clipping failure — a pale flat area sitting on a cream
  backdrop has nothing for the keyer to separate, and tightening tolerance far
  enough to catch it leaves the backdrop 92% opaque. Both prompts therefore
  name a firmly off-cream tone. Do not lighten them.
- **Four of these are overlays**, laid on top of the wall and floor in code.
  They must arrive as isolated shapes on cream, *not* painted onto a wall — if
  the crack comes attached to its own patch of wall, that patch keys as artwork
  and lands as a visible rectangle.

The keys are in the tenant's hand in his own artwork, and the landlord's hand
is deliberately **empty** — the cash is a separate prop that travels between
them, so it cannot be baked into either figure.

## `flat-wall.jpg`

> Hand-cut paper collage illustration in the style of a printed mid-century
> explainer: layered construction and craft paper, matte and slightly
> desaturated, with visible scissor-cut and torn edges and a fine halftone grain
> over the whole piece. Flatly lit from above — no rendering, no gloss, no
> gradient lighting.
>
> Subject: a bare interior wall of a cheap rented flat, seen straight on, filling
> a wide landscape shape roughly 1.4 times wider than it is tall. Flat, plain and
> completely empty — no window, no door, no fittings, no pictures. The paper is a
> dull institutional grey-green, clearly darker and cooler than cream, with faint
> mottling and a few scissor-cut seams where sheets of the same tone butt
> together. A narrow band of slightly darker skirting runs along the very bottom
> edge. Nothing else on it — the wall's damage arrives separately.
>
> Centred on a plain flat cream craft-paper backdrop running to all four edges
> with clear empty margin all round. No drop shadow, no cast shadow, no shading
> painted onto the backdrop. No deckle edge, no torn-page border, no frame, no
> mount, no table or wood grain. Nothing touches the edge of the frame. No text
> anywhere in the image.

## `wall-crack.jpg`

> Hand-cut paper collage illustration in the style of a printed mid-century
> explainer: layered construction and craft paper, matte and slightly
> desaturated, with visible scissor-cut and torn edges and a fine halftone grain
> over the whole piece. Flatly lit from above — no rendering, no gloss, no
> gradient lighting.
>
> Subject: a single jagged crack, cut from very dark charcoal-brown paper, as an
> ISOLATED SHAPE ON ITS OWN — no wall behind it, no patch or rectangle of
> background attached. It runs top to bottom in a tall narrow portrait shape
> roughly three and a half times taller than it is wide, wandering and forking
> once near the middle, wider at the top and tapering to a hairline at the
> bottom. Torn paper edges give it a rough, slightly furry outline. A few tiny
> separate flakes of the same dark paper sit clear of the main crack.
>
> Centred on a plain flat cream craft-paper backdrop running to all four edges
> with clear empty margin all round. No drop shadow, no cast shadow, no shading
> painted onto the backdrop. No deckle edge, no torn-page border, no frame, no
> mount, no table or wood grain. Nothing touches the edge of the frame. No text
> anywhere in the image.

## `poster-patch.jpg`

> Hand-cut paper collage illustration in the style of a printed mid-century
> explainer: layered construction and craft paper, matte and slightly
> desaturated, with visible scissor-cut and torn edges and a fine halftone grain
> over the whole piece. Flatly lit from above — no rendering, no gloss, no
> gradient lighting.
>
> Subject: the rectangular ghost left on a wall where a poster hung for years,
> as an ISOLATED SHAPE ON ITS OWN — no wall around it, just the patch itself, in
> an upright portrait shape a little taller than wide. Cut from grubby
> yellow-ochre paper, clearly darker and warmer than cream, with one corner torn
> away raggedly and a short strip of greyed tape still stuck across the top edge.
> Two small torn scraps of the old poster remain attached inside the patch,
> blank. The edges are soft and irregular where the paper lifted.
>
> Centred on a plain flat cream craft-paper backdrop running to all four edges
> with clear empty margin all round. No drop shadow, no cast shadow, no shading
> painted onto the backdrop. No deckle edge, no torn-page border, no frame, no
> mount, no table or wood grain. Nothing touches the edge of the frame. No text
> anywhere in the image.

## `wall-stain.jpg`

> Hand-cut paper collage illustration in the style of a printed mid-century
> explainer: layered construction and craft paper, matte and slightly
> desaturated, with visible scissor-cut and torn edges and a fine halftone grain
> over the whole piece. Flatly lit from above — no rendering, no gloss, no
> gradient lighting.
>
> Subject: a water-damage stain, as an ISOLATED SHAPE ON ITS OWN — no wall
> behind it, no rectangle of background attached. A single irregular blotch in a
> slightly wide landscape shape, built from three nested torn layers of paper in
> deepening muddy tones: a mid grey-brown outer shape, a darker umber inside it,
> and a small near-black core low down. Torn, feathered edges on every layer, the
> outline lumpy and organic with one drip running down from the lowest point.
> Clearly darker than cream throughout.
>
> Centred on a plain flat cream craft-paper backdrop running to all four edges
> with clear empty margin all round. No drop shadow, no cast shadow, no shading
> painted onto the backdrop. No deckle edge, no torn-page border, no frame, no
> mount, no table or wood grain. Nothing touches the edge of the frame. No text
> anywhere in the image.

## `flat-floor.jpg`

> Hand-cut paper collage illustration in the style of a printed mid-century
> explainer: layered construction and craft paper, matte and slightly
> desaturated, with visible scissor-cut and torn edges and a fine halftone grain
> over the whole piece. Flatly lit from above — no rendering, no gloss, no
> gradient lighting.
>
> Subject: the tiled floor of a cheap rented flat, seen from slightly above in a
> very wide letterbox shape roughly twice as wide as it is tall. A grid of square
> mosaic floor tiles in dull grey-brown paper, clearly darker than cream,
> receding gently with the rows growing shorter towards the top. Each tile is cut
> separately so the grid is a little uneven, with visible scissor edges and thin
> darker grout lines between them, and the tiles vary slightly in tone from one
> to the next. Worn, plain and empty — no furniture, no objects, no damage.
>
> Centred on a plain flat cream craft-paper backdrop running to all four edges
> with clear empty margin all round. No drop shadow, no cast shadow, no shading
> painted onto the backdrop. No deckle edge, no torn-page border, no frame, no
> mount, no table or wood grain. Nothing touches the edge of the frame. No text
> anywhere in the image.

## `floor-tile-cracked.jpg`

> Hand-cut paper collage illustration in the style of a printed mid-century
> explainer: layered construction and craft paper, matte and slightly
> desaturated, with visible scissor-cut and torn edges and a fine halftone grain
> over the whole piece. Flatly lit from above — no rendering, no gloss, no
> gradient lighting.
>
> Subject: a small cluster of broken floor tiles, as an ISOLATED SHAPE ON ITS
> OWN — no surrounding floor, no background rectangle. Three or four square
> mosaic tiles in dull grey-brown paper, seen from slightly above in a mildly
> wide shape, one of them split clean across by a dark jagged tear and a corner
> missing entirely to show a patch of near-black paper beneath. Two loose
> triangular shards of tile lie clear of the cluster. Clearly darker than cream.
>
> Centred on a plain flat cream craft-paper backdrop running to all four edges
> with clear empty margin all round. No drop shadow, no cast shadow, no shading
> painted onto the backdrop. No deckle edge, no torn-page border, no frame, no
> mount, no table or wood grain. Nothing touches the edge of the frame. No text
> anywhere in the image.

## `tenant-tense.jpg`

> Hand-cut paper collage illustration in the style of a printed mid-century
> explainer: layered construction and craft paper, matte and slightly
> desaturated, with visible scissor-cut and torn edges and a fine halftone grain
> over the whole piece. Flatly lit from above — no rendering, no gloss, no
> gradient lighting.
>
> Subject: a young Indian man in his late twenties standing FULL LENGTH facing
> the viewer, seen slightly from his left, in a tall narrow portrait shape about
> twice as tall as it is wide. Plain t-shirt and jeans in muted teal and indigo
> paper, warm muted paper for skin, short dark hair. His posture is tense and
> braced — shoulders slightly raised, weight on one leg, one arm held stiffly at
> his side. In his other hand, held down and a little away from his body, he
> grips a small ring of keys cut from pale grey paper. His expression is guarded
> and unhappy, mouth a flat closed line, brows drawn slightly in.
>
> Centred on a plain flat cream craft-paper backdrop running to all four edges
> with clear empty margin all round. No drop shadow, no cast shadow, no shading
> painted onto the backdrop. No deckle edge, no torn-page border, no frame, no
> mount, no table or wood grain. Nothing touches the edge of the frame. No text
> anywhere in the image.

## `landlord-offer.jpg`

> Hand-cut paper collage illustration in the style of a printed mid-century
> explainer: layered construction and craft paper, matte and slightly
> desaturated, with visible scissor-cut and torn edges and a fine halftone grain
> over the whole piece. Flatly lit from above — no rendering, no gloss, no
> gradient lighting.
>
> Subject: a heavy-set Indian man in his fifties standing FULL LENGTH facing the
> viewer, seen slightly from his right, in a tall narrow portrait shape about
> twice as tall as it is wide. He wears a plain cream-white kurta over a
> comfortable belly — use a warm putty and oatmeal paper for it so it stays
> clearly darker than the backdrop — with dark trousers and sandals. Thinning
> grey hair, thick moustache, a bland untroubled smile. One hand rests on his
> hip. The other arm is extended forward towards the viewer with the palm turned
> UP and the fingers slightly cupped, and that hand is COMPLETELY EMPTY —
> holding nothing at all, no money, no paper, no object of any kind.
>
> Centred on a plain flat cream craft-paper backdrop running to all four edges
> with clear empty margin all round. No drop shadow, no cast shadow, no shading
> painted onto the backdrop. No deckle edge, no torn-page border, no frame, no
> mount, no table or wood grain. Nothing touches the edge of the frame. No text
> anywhere in the image.

## `cash-stack.jpg`

> Hand-cut paper collage illustration in the style of a printed mid-century
> explainer: layered construction and craft paper, matte and slightly
> desaturated, with visible scissor-cut and torn edges and a fine halftone grain
> over the whole piece. Flatly lit from above — no rendering, no gloss, no
> gradient lighting.
>
> Subject: a thick bundle of banknotes lying flat, seen straight on from above,
> in a landscape shape half again as wide as it is tall, with nothing holding it
> and no hand anywhere in the image. The notes are cut from muted olive-green and
> dusty pink paper, clearly darker than cream, stacked so that a dozen individual
> scissor-cut edges show along the sides and the top note sits very slightly
> askew. A plain paper band runs around the middle of the bundle. The note faces
> are BLANK — no numerals, no portraits, no lettering, no printed pattern of any
> kind.
>
> Centred on a plain flat cream craft-paper backdrop running to all four edges
> with clear empty margin all round. No drop shadow, no cast shadow, no shading
> painted onto the backdrop. No deckle edge, no torn-page border, no frame, no
> mount, no table or wood grain. Nothing touches the edge of the frame. No text
> anywhere in the image.

---

# Episode 03 — Shot 6, "Institutional Fallout"

Two clippings, same rules as Episode 02's: no readable headline in the art
(`NewsHeadline` sets the headline and quote in code so the copy stays exactly
on the script's wording and can animate), clear space across the top third
for that code-set type to sit in, a roughly landscape photo because two
headlines have to share a 9:16 frame, and a flat even backdrop with no wood,
no hands and no shadows.

These cannot be reused from Episodes 01 or 02. Each clipping carries a real
press photo inside it — Episode 02's shows office managers in lanyards,
Episode 01's shows auto drivers — and a landlords'-association story running
under a photo of office managers reads as a mistake rather than as a joke.

**When they land:** they crop from the SOURCE jpg rather than the keyed PNG,
like Episode 02's — a clipping never needs alpha, since `NewsHeadline` shows
it in a box with `overflow: hidden`. Add each to `CROPS` in
`scripts/crop-newspaper-clippings.mjs` with `fromSource: true` and a measured
photo band, then register in `src/assets/cutouts.tsx`.

## `newspaper-clip-landlords.jpg`

> A photograph of a single torn clipping from an old newspaper, lying flat and
> square-on. The paper is aged to a yellowish cream, softly foxed, with one
> ragged torn edge down the right side and small tears at the corners.
>
> Across the top third the paper is EMPTY — no headline, no display type, just
> blank newsprint with a couple of faint horizontal rules. Below that sits a
> single black-and-white press photograph, roughly landscape, of a group of
> Indian men in their fifties and sixties standing together on the steps of a
> government building — plain shirts and a couple of sober jackets, a document
> folder under one arm, mid-discussion, looking organised and mildly aggrieved.
> The look of a property owners' delegation that has just handed in a letter.
> Under the photo, three narrow columns of small newspaper body text in
> unreadable greeked latin filler, slightly blurred and broken as old newsprint
> is.
>
> The clipping lies on a plain flat even surface with clear margin all round —
> cream is fine, since these are cropped from the source rather than keyed. No
> wood grain, no desk, no hands, no drop shadow, no cast shadow. Nothing touches
> the edge of the frame. No legible headline text anywhere in the image.

## `newspaper-clip-tenantclaim.jpg`

> A photograph of a single torn clipping from an old newspaper, lying flat and
> square-on. The paper is aged to a yellowish cream, softly foxed, with one
> ragged torn edge down the left side and small tears at the corners.
>
> Across the top third the paper is EMPTY — no headline, no display type, just
> blank newsprint with a couple of faint horizontal rules. Below that sits a
> single black-and-white press photograph, roughly landscape, of one Indian man
> in his late twenties photographed the way a local paper photographs a
> complainant: seated at a plain table, holding a folded sheet of paper up
> towards the camera, looking directly at the lens with a flat, wronged
> expression. Plain t-shirt, ordinary room behind him. Under the photo, three
> narrow columns of small newspaper body text in unreadable greeked latin
> filler, slightly blurred and broken as old newsprint is.
>
> The clipping lies on a plain flat even surface with clear margin all round —
> cream is fine, since these are cropped from the source rather than keyed. No
> wood grain, no desk, no hands, no drop shadow, no cast shadow. Nothing touches
> the edge of the frame. No legible headline text anywhere in the image.

---

# Episode 03 — Shot 9, "Full-Circle Close"

Shot 9 restages Shot 1's opening image with the flat now empty, so the wall,
crack, poster patch, stain, floor and broken tile are all reused as they are.
Two things do not exist yet.

The landlord cannot be reused: `landlord-offer` is him mid-offer with his
palm out and the cash already in flight, which is the wrong posture for a man
who has already handed it over and is leaving. And the door has to be its own
piece rather than part of his artwork, because it swings shut on camera —
the standing rule since Episode 01's meter flag is that nothing which has to
move independently may be baked in.

## `flat-door.jpg`

> Hand-cut paper collage illustration in the style of a printed mid-century
> explainer: layered construction and craft paper, matte and slightly
> desaturated, with visible scissor-cut and torn edges and a fine halftone
> grain over the whole piece. Flatly lit from above — no rendering, no gloss,
> no gradient lighting.
>
> Subject: a single plain interior door, seen straight on and filling a tall
> narrow portrait shape roughly two and a half times taller than it is wide.
> Cut from a dull grey-brown paper clearly darker than cream, with a slightly
> darker edge strip down one long side and a small pale grey circular
> doorknob about two thirds of the way up. Cheap and flush — no panels, no
> mouldings, no glass, no number, no letterbox. Just the door slab itself:
> NO door frame, NO surrounding wall, NO floor, nothing behind or around it.
>
> Centred on a plain flat cream craft-paper backdrop running to all four
> edges with clear empty margin all round. No drop shadow, no cast shadow, no
> shading painted onto the backdrop. No deckle edge, no torn-page border, no
> frame, no mount, no table or wood grain. Nothing touches the edge of the
> frame. No text anywhere in the image.

## `landlord-leaving.jpg`

> Hand-cut paper collage illustration in the style of a printed mid-century
> explainer: layered construction and craft paper, matte and slightly
> desaturated, with visible scissor-cut and torn edges and a fine halftone
> grain over the whole piece. Flatly lit from above — no rendering, no gloss,
> no gradient lighting.
>
> Subject: the same heavy-set Indian man in his fifties as before, standing
> FULL LENGTH in a tall narrow portrait shape about two and a half times
> taller than it is wide, but now seen from BEHIND and slightly to his right,
> three-quarters turned away from the viewer so only the edge of his cheek
> and moustache are visible. He wears the same plain cream-white kurta over a
> comfortable belly — use a warm putty and oatmeal paper so it stays clearly
> darker than the backdrop — with dark trousers and sandals, thinning grey
> hair. One arm is raised and extended forward at about shoulder height, the
> hand open and turned slightly down as though resting on something just in
> front of him and about to push it. That hand is COMPLETELY EMPTY — no
> money, no paper, no keys, no object of any kind — and there is nothing in
> front of him: no door, no wall, no handle, nothing for him to touch. His
> other arm hangs at his side.
>
> Centred on a plain flat cream craft-paper backdrop running to all four
> edges with clear empty margin all round. No drop shadow, no cast shadow, no
> shading painted onto the backdrop. No deckle edge, no torn-page border, no
> frame, no mount, no table or wood grain. Nothing touches the edge of the
> frame. No text anywhere in the image.

---

# Episode 04 — Shot 0, "The Cold Open"

The bank builds itself on top of the man who works there, then is taken away
again piece by piece until only he is left, exactly where he was the whole
time. He is never placed and never revealed by a fade — he is UNDER
everything from frame 0, so the last prop lifting off is the only reveal the
shot gets. That means his art has to hold the centre of the frame on its own.

Everything here is a FLAT-LAY piece: it will be laid over its neighbours at a
slight angle, so each one has to read on its own silhouette with nothing
around it. Chunky and simple beats detailed — a thing that needs squinting at
will not survive being one of seventeen.

Four cutouts we already have are reused and do not need generating:
`cash-stack`, `wall-clock-face`, `desk-lamp`, `laptop-screen`.

Two rules that cost us a shot each in Episode 03, repeated here because they
are easy to lose in a long sheet:

- **No text, anywhere, on anything.** Not on a sign, not on a spine, not on a
  form. The generator cannot spell and the misspelling is what the eye goes
  to. Every label in this shot is set in Remotion.
- **Every piece must sit clearly darker than the cream backdrop.** Cream on
  cream keys out as an outline skeleton — that is what happened to the
  tenant's keys. Where a prop would naturally be pale, the prompt names a
  darker paper for it.

## `bank-employee.jpg`

> Hand-cut paper collage illustration in the style of a printed mid-century
> explainer: layered construction and craft paper, matte and slightly
> desaturated, with visible scissor-cut and torn edges and a fine halftone grain
> over the whole piece. Flatly lit from above — no rendering, no gloss, no
> gradient lighting.
>
> Subject: an Indian man in his forties seated behind a bank counter, seen from
> the front from the waist up, in an upright portrait shape a little taller than
> it is wide. He wears a short-sleeved shirt in muted slate blue with a darker
> collar — keep the shirt clearly darker than the backdrop — over a slight
> paunch, with a plain lanyard round his neck and a pen in the breast pocket.
> Neatly combed black hair going grey at the temples, a trimmed moustache,
> reading glasses low on the nose. Both forearms rest flat on the counter top in
> front of him, hands loosely folded, doing nothing at all. His expression is
> patient, blank and entirely unbothered — not smiling, not annoyed, a man who
> has been sitting exactly like this for a very long time. He looks straight out
> at the viewer. The counter top is a plain slab of dark oxblood paper crossing
> the bottom of the shape; below its front edge, nothing.
>
> Centred on a plain flat cream craft-paper backdrop running to all four edges
> with clear empty margin all round. No drop shadow, no cast shadow, no shading
> painted onto the backdrop. No deckle edge, no torn-page border, no frame, no
> mount, no table or wood grain. Nothing touches the edge of the frame. No text
> anywhere in the image.

## `bank-grille.jpg`

> Hand-cut paper collage illustration in the style of a printed mid-century
> explainer: layered construction and craft paper, matte and slightly
> desaturated, with visible scissor-cut and torn edges and a fine halftone grain
> over the whole piece. Flatly lit from above — no rendering, no gloss, no
> gradient lighting.
>
> Subject: a teller window grille seen straight on, in a wide landscape shape
> about twice as wide as it is tall. A frame of dark bronze-brown paper holds
> nine or ten thick vertical bars with an arched opening cut through the lower
> middle, wide enough to pass a bundle through. Below the bars a narrow ledge
> runs the full width in a slightly lighter tan. The gaps between the bars are
> cut clean THROUGH the piece — open holes, not pale paper — so the artwork
> behind will show between them. No glass, no reflection, no counter, no person.
>
> Centred on a plain flat cream craft-paper backdrop running to all four edges
> with clear empty margin all round. No drop shadow, no cast shadow, no shading
> painted onto the backdrop. No deckle edge, no torn-page border, no frame, no
> mount, no table or wood grain. Nothing touches the edge of the frame. No text
> anywhere in the image.

## `token-display.jpg`

> Hand-cut paper collage illustration in the style of a printed mid-century
> explainer: layered construction and craft paper, matte and slightly
> desaturated, with visible scissor-cut and torn edges and a fine halftone grain
> over the whole piece. Flatly lit from above — no rendering, no gloss, no
> gradient lighting.
>
> Subject: a wall-mounted queue token display board seen straight on, in a
> landscape shape about twice as wide as it is tall. A boxy charcoal-grey casing
> with rounded corners, and set into it two BLANK recessed panels of deep red
> paper side by side where the digits would be — the panels are completely
> empty, no numerals, no segments, no dots, no lettering of any kind. A short
> stub of dark cable leaves the top right corner. No stand, no bracket, no wall.
>
> Centred on a plain flat cream craft-paper backdrop running to all four edges
> with clear empty margin all round. No drop shadow, no cast shadow, no shading
> painted onto the backdrop. No deckle edge, no torn-page border, no frame, no
> mount, no table or wood grain. Nothing touches the edge of the frame. No text
> anywhere in the image.

## `file-tower.jpg`

> Hand-cut paper collage illustration in the style of a printed mid-century
> explainer: layered construction and craft paper, matte and slightly
> desaturated, with visible scissor-cut and torn edges and a fine halftone grain
> over the whole piece. Flatly lit from above — no rendering, no gloss, no
> gradient lighting.
>
> Subject: a leaning stack of about a dozen cloth-tied office file bundles seen
> from the side, in a tall narrow portrait shape roughly twice as tall as it is
> wide. Each bundle is a slab of thick papers between dusty card covers in muted
> ochre, brick red and olive, tied shut with a length of pale cord knotted at the
> front. The stack is uneven — bundles sit slightly askew, edges of loose paper
> stick out at the sides, and the whole tower leans a few degrees. Nothing holds
> it and no hand appears. No shelf, no floor, no desk.
>
> Centred on a plain flat cream craft-paper backdrop running to all four edges
> with clear empty margin all round. No drop shadow, no cast shadow, no shading
> painted onto the backdrop. No deckle edge, no torn-page border, no frame, no
> mount, no table or wood grain. Nothing touches the edge of the frame. No text
> anywhere in the image.

## `ledger-open.jpg`

> Hand-cut paper collage illustration in the style of a printed mid-century
> explainer: layered construction and craft paper, matte and slightly
> desaturated, with visible scissor-cut and torn edges and a fine halftone grain
> over the whole piece. Flatly lit from above — no rendering, no gloss, no
> gradient lighting.
>
> Subject: a large hardbound accounts ledger lying open, seen straight down from
> above, in a wide landscape shape about half again as wide as it is tall. The
> covers are dark maroon board. The two open pages are cut from a muted
> grey-green paper, clearly and obviously DARKER than the cream backdrop — not
> white, not cream, not ivory — and ruled with a grid of fine horizontal lines
> and a few vertical column rules in a deeper slate blue. Those ruled lines are
> the ONLY marks on the pages. The pages are otherwise COMPLETELY EMPTY: no
> handwriting, no scribbles, no pen strokes, no figures, no numerals, no words,
> no stamps, no smudges, no ink of any kind. A dark cloth spine and a ribbon
> marker lie down the gutter, and the outer page edges are visibly thick and
> slightly wavy. No hand, no pen, no desk.
>
> Centred on a plain flat cream craft-paper backdrop running to all four edges
> with clear empty margin all round. No drop shadow, no cast shadow, no shading
> painted onto the backdrop. No deckle edge, no torn-page border, no frame, no
> mount, no table or wood grain. Nothing touches the edge of the frame. No text
> anywhere in the image.

## `form-pile.jpg`

> Hand-cut paper collage illustration in the style of a printed mid-century
> explainer: layered construction and craft paper, matte and slightly
> desaturated, with visible scissor-cut and torn edges and a fine halftone grain
> over the whole piece. Flatly lit from above — no rendering, no gloss, no
> gradient lighting.
>
> Subject: a loose heap of about twenty deposit-slip forms seen from slightly
> above, in a landscape shape about half again as wide as it is tall. The slips
> are cut from dusty pink, pale olive and grey-blue paper — no white and no cream
> among them, so the whole heap stays clearly darker than the backdrop — fanned
> out at all angles so a dozen separate corners and edges show. Each slip carries
> a few ruled boxes and a printed grid, and nothing else: no words, no numerals,
> no handwriting, no signatures. A single bulldog clip in dark steel grey grips
> one corner of the pile. No hand, no tray, no desk.
>
> Centred on a plain flat cream craft-paper backdrop running to all four edges
> with clear empty margin all round. No drop shadow, no cast shadow, no shading
> painted onto the backdrop. No deckle edge, no torn-page border, no frame, no
> mount, no table or wood grain. Nothing touches the edge of the frame. No text
> anywhere in the image.

## `rubber-stamp.jpg`

> Hand-cut paper collage illustration in the style of a printed mid-century
> explainer: layered construction and craft paper, matte and slightly
> desaturated, with visible scissor-cut and torn edges and a fine halftone grain
> over the whole piece. Flatly lit from above — no rendering, no gloss, no
> gradient lighting.
>
> Subject: a round wooden-handled rubber stamp standing upright beside a square
> ink pad, seen from the front and slightly above, in a shape a little wider than
> it is tall. The stamp has a turned handle in dark walnut brown over a black
> rubber base. The ink pad is an open metal tin in dull olive with a felt pad of
> deep violet-blue inside, the lid folded back behind it. A few stray stamped
> rings mark the surface of the pad. No paper under them, no hand, no desk, and
> nothing printed or lettered on the stamp face or the tin.
>
> Centred on a plain flat cream craft-paper backdrop running to all four edges
> with clear empty margin all round. No drop shadow, no cast shadow, no shading
> painted onto the backdrop. No deckle edge, no torn-page border, no frame, no
> mount, no table or wood grain. Nothing touches the edge of the frame. No text
> anywhere in the image.

## `passbook-stack.jpg`

> Hand-cut paper collage illustration in the style of a printed mid-century
> explainer: layered construction and craft paper, matte and slightly
> desaturated, with visible scissor-cut and torn edges and a fine halftone grain
> over the whole piece. Flatly lit from above — no rendering, no gloss, no
> gradient lighting.
>
> Subject: a short stack of eight or nine small bank passbooks seen from above
> and slightly to one side, in a landscape shape about half again as wide as it
> is tall. Each booklet is a stapled card cover in a different muted colour —
> teal, brick, mustard, slate — with a few pale inner pages showing at the
> edges. They sit askew on each other so every cover is separately visible, and
> the top one is open a crack. The covers are completely plain: no emblem, no
> lettering, no numbering, no printed panel. No rubber band, no hand, no desk.
>
> Centred on a plain flat cream craft-paper backdrop running to all four edges
> with clear empty margin all round. No drop shadow, no cast shadow, no shading
> painted onto the backdrop. No deckle edge, no torn-page border, no frame, no
> mount, no table or wood grain. Nothing touches the edge of the frame. No text
> anywhere in the image.

## `note-counter.jpg`

> Hand-cut paper collage illustration in the style of a printed mid-century
> explainer: layered construction and craft paper, matte and slightly
> desaturated, with visible scissor-cut and torn edges and a fine halftone grain
> over the whole piece. Flatly lit from above — no rendering, no gloss, no
> gradient lighting.
>
> Subject: a desktop banknote counting machine seen from the front and slightly
> above, in a shape a little wider than it is tall. A chunky boxy body in muted
> grey-green with a sloping front, a hopper on top holding an upright wedge of
> olive-green notes, and a shallow output tray at the bottom front with a few
> notes fanned in it. A small blank display recess in dark charcoal sits on the
> upper face — empty, no digits, no segments. Four rubber feet. The notes are
> completely blank: no numerals, no portraits, no printing. No cable, no hand, no
> desk.
>
> Centred on a plain flat cream craft-paper backdrop running to all four edges
> with clear empty margin all round. No drop shadow, no cast shadow, no shading
> painted onto the backdrop. No deckle edge, no torn-page border, no frame, no
> mount, no table or wood grain. Nothing touches the edge of the frame. No text
> anywhere in the image.

## `queue-post.jpg`

> Hand-cut paper collage illustration in the style of a printed mid-century
> explainer: layered construction and craft paper, matte and slightly
> desaturated, with visible scissor-cut and torn edges and a fine halftone grain
> over the whole piece. Flatly lit from above — no rendering, no gloss, no
> gradient lighting.
>
> Subject: a single retractable queue barrier post seen from the front, in an
> upright portrait shape about twice as tall as it is wide. A thick dark
> gunmetal-grey column on a heavy round base. From a slot near the top, a wide
> flat belt of deep maroon webbing is pulled straight out horizontally to the
> right and runs all the way to the right-hand edge of the composition — a bold
> solid band as thick as a finger, clearly visible, not a thin cord and not a
> chain — ending in a steel clip that hooks onto nothing. The belt is plain: no
> stripe, no lettering, no logo. Only one post; no second post, no rope, no
> floor, no queue, no people.
>
> Centred on a plain flat cream craft-paper backdrop running to all four edges
> with clear empty margin all round. No drop shadow, no cast shadow, no shading
> painted onto the backdrop. No deckle edge, no torn-page border, no frame, no
> mount, no table or wood grain. Nothing touches the edge of the frame. No text
> anywhere in the image.

## `steel-almirah.jpg`

> Hand-cut paper collage illustration in the style of a printed mid-century
> explainer: layered construction and craft paper, matte and slightly
> desaturated, with visible scissor-cut and torn edges and a fine halftone grain
> over the whole piece. Flatly lit from above — no rendering, no gloss, no
> gradient lighting.
>
> Subject: a tall two-door steel office cupboard seen straight on from the front,
> in a tall portrait shape about twice as tall as it is wide. The body is cut
> from muted grey-green paper with a slightly darker recessed panel down each
> door, a long vertical handle bar on the right-hand door and a small round lock
> plate beside it. One door stands open a hand's width, showing a sliver of
> shelved files in ochre and brick inside. Short flat feet at the bottom. No
> stickers, no plate, no numbering, no lettering anywhere on it. No wall, no
> floor.
>
> Centred on a plain flat cream craft-paper backdrop running to all four edges
> with clear empty margin all round. No drop shadow, no cast shadow, no shading
> painted onto the backdrop. No deckle edge, no torn-page border, no frame, no
> mount, no table or wood grain. Nothing touches the edge of the frame. No text
> anywhere in the image.

## `notice-board.jpg`

> Hand-cut paper collage illustration in the style of a printed mid-century
> explainer: layered construction and craft paper, matte and slightly
> desaturated, with visible scissor-cut and torn edges and a fine halftone grain
> over the whole piece. Flatly lit from above — no rendering, no gloss, no
> gradient lighting.
>
> Subject: a cork notice board seen straight on, in a landscape shape about half
> again as wide as it is tall. A dark walnut-brown frame around a mottled tan
> cork field, with seven or eight circulars pinned to it. Every circular is a
> RECTANGULAR SHEET OF PAPER with four straight edges and square corners — some
> upright, some on their side, pinned at slight angles and overlapping each
> other — cut from dusty pink, pale olive and grey-blue paper. They are not
> round, not oval, not discs, not tags and not labels. Each sheet is BLANK apart
> from three or four faint ruled lines across it: no words, no letters, no
> headings, no numerals, no scribbles, no signatures, no stamps, no printing of
> any kind. A single brass drawing pin at the top of each sheet. One or two
> sheets curl at a bottom corner. No wall, no bracket.
>
> Centred on a plain flat cream craft-paper backdrop running to all four edges
> with clear empty margin all round. No drop shadow, no cast shadow, no shading
> painted onto the backdrop. No deckle edge, no torn-page border, no frame, no
> mount, no table or wood grain. Nothing touches the edge of the frame. No text
> anywhere in the image.

## `chai-glass.jpg`

> Hand-cut paper collage illustration in the style of a printed mid-century
> explainer: layered construction and craft paper, matte and slightly
> desaturated, with visible scissor-cut and torn edges and a fine halftone grain
> over the whole piece. Flatly lit from above — no rendering, no gloss, no
> gradient lighting.
>
> Subject: a small cutting-chai glass standing on a steel saucer, seen from the
> front and slightly above, in an upright shape a little taller than it is wide.
> The glass is a short straight-sided tumbler with a rolled rim, filled
> two-thirds with milky tea in a warm mid-brown, cut so the tea reads as a solid
> darker block behind the glass wall. The saucer is a shallow dull-steel disc in
> muted grey. A faint ring of dried tea marks the saucer. No steam, no spoon, no
> hand, no table.
>
> Centred on a plain flat cream craft-paper backdrop running to all four edges
> with clear empty margin all round. No drop shadow, no cast shadow, no shading
> painted onto the backdrop. No deckle edge, no torn-page border, no frame, no
> mount, no table or wood grain. Nothing touches the edge of the frame. No text
> anywhere in the image.

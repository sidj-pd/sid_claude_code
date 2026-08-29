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

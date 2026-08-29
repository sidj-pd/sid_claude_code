# SFX

All four cues are synthesised from scratch by `scripts/sfx.py` — no binary
source assets, no licensing, deterministic output, tunable by a number.

```bash
python3 scripts/sfx.py            # write any missing effects
python3 scripts/sfx.py --force    # rebuild everything
python3 scripts/sfx.py paper-rip  # just one
```

| File | Used by |
|---|---|
| `meter-click.wav` | Shot 3 and Shot 4, on the flag hitting its stop |
| `stamp-thud.wav` | `StampImpact` (montage title), every headline landing in Shots 8 and 10, the closing CASE CLOSED stamp |
| `paper-riffle.wav` | `PageFlipTransition` — reenactment-to-reenactment cuts only |
| `paper-rip.wav` | `PaperTear` — every crossing of the reality/reenactment boundary |

See `docs/PRODUCTION-NOTES.md` §7 for how each is constructed and why.

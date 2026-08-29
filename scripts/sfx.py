#!/usr/bin/env python3
"""
Synthesise the show's mechanical sound effects.

Gemini TTS *can* be coaxed into returning a short transient (asking it for the
onomatopoeia "click" with a stage direction returned an 80ms burst), but it is
a speech model: the result is not reliably a sound rather than a clipped word,
it costs a call each time, and it cannot be tuned. Effects that are pure
physics — a lever hitting its stop, a stamp landing — are better built here,
where they are deterministic, free, and adjustable by a number.

Voice stays with TTS (scripts/tts.py). This is only for non-vocal sound.

    python3 scripts/sfx.py            # write any missing effects
    python3 scripts/sfx.py --force    # rebuild everything
"""
import argparse
import math
import random
import struct
import wave
from pathlib import Path

SR = 48000  # high rate: these are sharp transients with real HF content
OUT_DIR = Path(__file__).resolve().parent.parent / "public" / "sfx"


def _env(t, decay):
    """Exponential decay envelope."""
    return math.exp(-t / decay)


def meter_click(dur=0.16, seed=7):
    """
    An auto-rickshaw fare-meter flag being pushed down to its stop.

    Three layers, because a single decaying sine reads as a beep rather than
    as something mechanical:
      - a very short noise burst: the physical contact of lever on stop
      - inharmonic metal ring: the housing resonating, detuned so it does not
        sound like a musical note
      - a low thud: the mass of the lever arriving
    """
    rng = random.Random(seed)
    n = int(SR * dur)
    out = []
    for i in range(n):
        t = i / SR
        contact = rng.uniform(-1, 1) * _env(t, 0.0035) * 0.9
        ring = (
            math.sin(2 * math.pi * 1780 * t) * _env(t, 0.028) * 0.34
            + math.sin(2 * math.pi * 2490 * t) * _env(t, 0.019) * 0.22
            + math.sin(2 * math.pi * 3910 * t) * _env(t, 0.011) * 0.13
        )
        thud = math.sin(2 * math.pi * 186 * t) * _env(t, 0.032) * 0.38
        out.append(contact + ring + thud)
    return out


def stamp_thud(dur=0.42, seed=3):
    """A rubber stamp landing hard on paper — for the title card."""
    rng = random.Random(seed)
    n = int(SR * dur)
    out = []
    for i in range(n):
        t = i / SR
        slap = rng.uniform(-1, 1) * _env(t, 0.006) * 0.75
        body = (
            math.sin(2 * math.pi * 92 * t) * _env(t, 0.075) * 0.85
            + math.sin(2 * math.pi * 143 * t) * _env(t, 0.045) * 0.4
        )
        out.append(slap + body)
    return out


def paper_riffle(dur=0.55, seed=11):
    """A page being turned — filtered noise, swelling then falling away."""
    rng = random.Random(seed)
    n = int(SR * dur)
    prev = 0.0
    out = []
    for i in range(n):
        t = i / SR
        white = rng.uniform(-1, 1)
        # one-pole low-pass, so it hisses like paper rather than static
        prev = prev * 0.72 + white * 0.28
        swell = math.sin(math.pi * min(1.0, t / dur)) ** 1.6
        # a few discrete rustles riding on the swell
        grain = 1.0 + 0.5 * math.sin(2 * math.pi * 27 * t)
        out.append(prev * swell * grain * 0.75)
    return out


def paper_rip(dur=0.62, seed=23):
    """
    Paper being torn — the series' signal that reality is intruding on the
    reenactment, so it has to be sharper and more violent than the page-flip
    riffle used between paper scenes.

    A tear is not a swell like a page turn; it is a rapid burst of tiny
    discrete fibre breaks. So the layers are:
      - a dense stream of impulses whose rate accelerates and then stops dead
      - brightly filtered noise riding on them, for the hiss of the fibres
      - a low thump at the very start: the first grab, before the run
    """
    rng = random.Random(seed)
    n = int(SR * dur)
    out = []
    hp = 0.0  # running value for a one-pole high-pass, to keep it bright
    prev_in = 0.0
    next_pop = 0.0
    pop = 0.0
    for i in range(n):
        t = i / SR
        # The run accelerates through the tear, then cuts out rather than
        # decaying: paper stops making noise the instant it is through.
        progress = min(1.0, t / dur)
        rate = 300 + 2600 * progress
        if t >= next_pop:
            pop = rng.uniform(-1, 1)
            next_pop = t + (1.0 / rate) * rng.uniform(0.4, 1.6)
        pop *= 0.55  # each fibre break is a click, not a tone

        white = rng.uniform(-1, 1)
        hp = 0.86 * (hp + white - prev_in)
        prev_in = white

        # Rises fast, peaks past the middle, then stops rather than fading:
        # paper goes quiet the instant it is through.
        shape = min(1.0, t / 0.02) * math.sin(math.pi * progress**0.62) ** 0.45
        grab = math.sin(2 * math.pi * 128 * t) * _env(t, 0.012) * 0.5
        out.append((pop * 0.85 + hp * 0.5) * shape + grab)
    return out


def key_click(dur=0.11, seed=17):
    """
    A laptop key being pressed — the Send that starts the whole case.

    Deliberately smaller than meter_click: this is plastic on plastic in a
    quiet room, not a metal lever hitting its stop. The resonance sits high
    and dies almost immediately, because a keycap has no body to ring, and
    the bottom-out is an octave under the meter's thud and far shorter — a
    key travels two millimetres, not twenty.
    """
    rng = random.Random(seed)
    n = int(SR * dur)
    out = []
    for i in range(n):
        t = i / SR
        contact = rng.uniform(-1, 1) * _env(t, 0.0018) * 0.85
        shell = (
            math.sin(2 * math.pi * 3120 * t) * _env(t, 0.0060) * 0.22
            + math.sin(2 * math.pi * 4650 * t) * _env(t, 0.0040) * 0.12
        )
        bottom = math.sin(2 * math.pi * 95 * t) * _env(t, 0.014) * 0.30
        out.append(contact + shell + bottom)
    return out


def room_hum(dur=10.0, seed=41):
    """
    The series' first ambience bed: a fan or an AC in a flat at midnight.

    Production notes §13 lists "no ambience beds" as an open gap — every
    Episode 01 shot is dry. This closes it, because Episode 02 opens on held
    tension and true digital silence reads as a dropout rather than as quiet.
    The notification also needs something to cut through.

    Two-pole low-passed noise for the moving air, plus two low tones for the
    motor. The tones are deliberately not harmonically related, and neither
    sits at 50Hz, so the bed never resolves into a note the ear can name and
    start listening to. A very slow drift keeps it from sitting dead still.
    """
    rng = random.Random(seed)
    n = int(SR * dur)
    out = []
    lp = 0.0
    lp2 = 0.0
    for i in range(n):
        t = i / SR
        lp += (rng.uniform(-1, 1) - lp) * 0.0045
        lp2 += (lp - lp2) * 0.0045
        motor = (
            math.sin(2 * math.pi * 71.3 * t) * 0.10
            + math.sin(2 * math.pi * 108.7 * t) * 0.055
        )
        drift = 1.0 + 0.06 * math.sin(2 * math.pi * 0.07 * t)
        out.append((lp2 * 30.0 + motor) * drift)
    return out


EFFECTS = {
    "paper-rip": paper_rip,
    "meter-click": meter_click,
    "stamp-thud": stamp_thud,
    "paper-riffle": paper_riffle,
    "key-click": key_click,
    "room-hum": room_hum,
}


def write(name, samples):
    peak = max(abs(s) for s in samples) or 1.0
    # Leave headroom so mixing under a voice-over never clips.
    gain = 0.82 / peak
    fade = int(SR * 0.008)
    total = len(samples)
    frames = bytearray()
    for i, s in enumerate(samples):
        v = s * gain
        if i > total - fade:  # avoid a discontinuity at the tail
            v *= (total - i) / fade
        frames += struct.pack("<h", max(-32767, min(32767, int(v * 32767))))

    path = OUT_DIR / f"{name}.wav"
    path.parent.mkdir(parents=True, exist_ok=True)
    with wave.open(str(path), "wb") as w:
        w.setnchannels(1)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes(bytes(frames))
    print(f"  {path.name}  {total / SR:.3f}s")


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("names", nargs="*")
    ap.add_argument("--force", action="store_true")
    args = ap.parse_args()

    for name, fn in EFFECTS.items():
        if args.names and name not in args.names:
            continue
        if (OUT_DIR / f"{name}.wav").exists() and not args.force:
            print(f"  {name}.wav exists, skipping")
            continue
        write(name, fn())


if __name__ == "__main__":
    main()

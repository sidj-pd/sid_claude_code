#!/usr/bin/env python3
"""
Remove dead air from a generated take without changing the delivery.

The TTS returns takes that are around a third silence — Episode 03 Shot 1's
three came to 16.96s for 11.10s of speech, and the landlord's was 67% padding.
That is not a performance choice to be respected, it is an artefact of the
generator, and cutting it is the only way to shorten a shot that does not
speed a voice up or throw a word away.

Every cut lands inside measured silence, so no speech is touched:

    python3 scripts/tighten-vo.py ep03-shot01-landlord --gap 0.22
    python3 scripts/tighten-vo.py ep03-shot01-vo --keep 1-2 --out ep03-shot01-vo-a

--keep selects voiced segments by index, which is how one take becomes two.
Stdlib only, to match tts.py and sfx.py. Sources are never overwritten.
"""
import argparse
import array
import importlib.util
import pathlib
import sys
import wave

ROOT = pathlib.Path(__file__).resolve().parent.parent
VO_DIR = ROOT / "public" / "vo"

_spec = importlib.util.spec_from_file_location("measure_vo", ROOT / "scripts" / "measure-vo.py")
measure_vo = importlib.util.module_from_spec(_spec)
_spec.loader.exec_module(measure_vo)

#: A join inside silence still clicks if the waveform steps. Ramp across it.
FADE_SEC = 0.006

#: An RMS envelope marks vowel energy, not word boundaries. Cutting on its
#: edges ate consonants on the first pass: "Full amount. Here." transcribed
#: back as "Pull up. Yeah." — the F and H onsets are quiet fricatives that sit
#: under the threshold, and the release of a final l or nt decays under it too.
#: So every segment is widened outward before anything is cut.
ATTACK_SEC = 0.070
RELEASE_SEC = 0.110

#: Words still need air between them once both sides have been widened.
MIN_PAUSE_SEC = 0.045


def voiced_segments(path):
    """The take's speech, as (start, end) seconds, from the §8 envelope."""
    r = measure_vo.analyse(path)
    if r is None or r.get("silent"):
        sys.exit("%s: no speech found" % path.name)
    bounds = [r["speech_start"]]
    for gap_start, gap_end in r["gaps"]:
        bounds += [gap_start, gap_end]
    bounds.append(r["speech_end"])
    return [(bounds[i], bounds[i + 1]) for i in range(0, len(bounds), 2)], r


def read_mono(path):
    with wave.open(str(path), "rb") as w:
        rate, channels = w.getframerate(), w.getnchannels()
        samples = array.array("h")
        samples.frombytes(w.readframes(w.getnframes()))
    if channels > 1:
        samples = array.array("h", samples[::channels])
    return samples, rate


def fade(chunk, rate, rising):
    n = min(int(rate * FADE_SEC), len(chunk))
    for i in range(n):
        k = (i / n) if rising else (1 - i / n)
        j = i if rising else len(chunk) - n + i
        chunk[j] = int(chunk[j] * k)
    return chunk


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("take")
    ap.add_argument("--lead", type=float, default=0.08, help="silence kept before the first word")
    ap.add_argument("--trail", type=float, default=0.10, help="silence kept after the last")
    ap.add_argument("--gap", type=float, default=0.22, help="ceiling on any pause between words")
    ap.add_argument("--attack", type=float, default=ATTACK_SEC, help="pre-roll kept before each segment")
    ap.add_argument("--release", type=float, default=RELEASE_SEC, help="decay kept after each segment")
    ap.add_argument("--keep", help="voiced segments to keep, 1-based, e.g. 1-2 or 3")
    ap.add_argument("--out", help="output id (default: <take>-cut)")
    args = ap.parse_args()

    src = VO_DIR / ("%s.wav" % args.take)
    if not src.exists():
        sys.exit("no such take: %s" % src.name)

    segs, r = voiced_segments(src)
    if args.keep:
        lo, _, hi = args.keep.partition("-")
        lo = int(lo); hi = int(hi) if hi else lo
        if not (1 <= lo <= hi <= len(segs)):
            sys.exit("--keep %s outside 1-%d" % (args.keep, len(segs)))
        segs = segs[lo - 1:hi]

    samples, rate = read_mono(src)

    # Widen every segment to cover the consonants the envelope missed, without
    # letting neighbours cross into each other.
    wide = []
    for i, (a, b) in enumerate(segs):
        floor_ = segs[i - 1][1] if i else 0.0
        ceil_ = segs[i + 1][0] if i + 1 < len(segs) else r["duration"]
        wide.append((max(a - args.attack, floor_, 0.0),
                     min(b + args.release, ceil_, r["duration"])))

    out = array.array("h", [0] * int(rate * args.lead))
    for i, (a, b) in enumerate(wide):
        if i:
            # The real pause, clamped — never widened, so natural beats survive.
            pause = max(min(a - wide[i - 1][1], args.gap), MIN_PAUSE_SEC)
            out.extend([0] * int(rate * pause))
        chunk = array.array("h", samples[int(a * rate):int(b * rate)])
        fade(chunk, rate, True)
        fade(chunk, rate, False)
        out.extend(chunk)

    out.extend([0] * int(rate * args.trail))

    dst = VO_DIR / ("%s.wav" % (args.out or "%s-cut" % args.take))
    if dst.resolve() == src.resolve():
        sys.exit("refusing to overwrite the source take")
    with wave.open(str(dst), "wb") as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(rate)
        w.writeframes(out.tobytes())

    before, after = r["duration"], len(out) / float(rate)
    print("%-26s %5.2fs -> %5.2fs  (-%.2fs, %d frames @30fps)  %d segment%s"
          % (dst.name, before, after, before - after,
             round(after * 30), len(segs), "" if len(segs) == 1 else "s"))


if __name__ == "__main__":
    main()

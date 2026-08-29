#!/usr/bin/env python3
"""
Measure the voice-over takes so shots can be cut to the audio, not to a script.

Production notes §8: every visual constant is an offset into an RMS envelope of
the real file. This makes that repeatable — Episode 01 did it ad hoc, which
means a re-record meant redoing the analysis by hand.

    python3 scripts/measure-vo.py                 # every wav in public/vo
    python3 scripts/measure-vo.py ep02-shot03a    # one take
    python3 scripts/measure-vo.py --fps 30 --beats ep02-shot06-assoc

`--beats` prints the numbers as a beats.ts constant block, ready to paste.

Stdlib only, to match tts.py and sfx.py.
"""
import argparse
import array
import pathlib
import sys
import wave

ROOT = pathlib.Path(__file__).resolve().parent.parent
VO_DIR = ROOT / "public" / "vo"

WINDOW_SEC = 0.010
#: A gap shorter than this is a breath inside a phrase, not a beat between two.
MIN_GAP_SEC = 0.18


def envelope(path):
    with wave.open(str(path), "rb") as w:
        if w.getsampwidth() != 2:
            sys.exit("%s: expected 16-bit PCM, got %d-bit" % (path.name, w.getsampwidth() * 8))
        rate = w.getframerate()
        channels = w.getnchannels()
        raw = w.readframes(w.getnframes())

    samples = array.array("h")
    samples.frombytes(raw)
    if channels > 1:
        samples = array.array("h", samples[::channels])

    win = max(1, int(rate * WINDOW_SEC))
    env = []
    for start in range(0, len(samples) - win + 1, win):
        total = 0
        for s in samples[start:start + win]:
            total += s * s
        env.append((total / win) ** 0.5)
    return env, rate, len(samples) / float(rate)


def analyse(path):
    env, rate, duration = envelope(path)
    if not env:
        return None

    peak = max(env)
    floor = min(env)
    # Floor-relative as well as peak-relative: generated takes carry real room
    # tone, and a purely peak-relative threshold reads that as speech.
    threshold = max(peak * 0.07, floor * 2.2)

    loud = [i for i, v in enumerate(env) if v >= threshold]
    if not loud:
        return {"path": path, "duration": duration, "silent": True}

    first, last = loud[0], loud[-1]

    gaps = []
    prev = None
    for i in loud:
        if prev is not None and (i - prev) * WINDOW_SEC >= MIN_GAP_SEC:
            gaps.append((prev * WINDOW_SEC, i * WINDOW_SEC))
        prev = i

    return {
        "path": path,
        "duration": duration,
        "silent": False,
        "speech_start": first * WINDOW_SEC,
        "speech_end": (last + 1) * WINDOW_SEC,
        "lead_in": first * WINDOW_SEC,
        "tail": duration - (last + 1) * WINDOW_SEC,
        "gaps": gaps,
        "peak": peak,
        "floor": floor,
    }


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("ids", nargs="*", help="take ids, without .wav (default: all)")
    ap.add_argument("--fps", type=int, default=30)
    ap.add_argument("--beats", action="store_true", help="print a beats.ts constant block")
    args = ap.parse_args()

    if args.ids:
        paths = [VO_DIR / ("%s.wav" % i) for i in args.ids]
    else:
        paths = sorted(VO_DIR.glob("*.wav"))

    missing = [p for p in paths if not p.exists()]
    if missing:
        sys.exit("no such take: %s" % ", ".join(p.name for p in missing))

    fps = args.fps
    for path in paths:
        r = analyse(path)
        if r is None or r["silent"]:
            print("%-26s SILENT — check the take" % path.stem)
            continue

        if args.beats:
            print("/* Measured from public/vo/%s.wav at %dfps. */" % (path.stem, fps))
            print("export const SPEECH_IN = %d;   // %.2fs" % (round(r["speech_start"] * fps), r["speech_start"]))
            print("export const SPEECH_OUT = %d;  // %.2fs" % (round(r["speech_end"] * fps), r["speech_end"]))
            print("export const CLIP_FRAMES = %d; // %.2fs" % (round(r["duration"] * fps), r["duration"]))
            for n, (a, b) in enumerate(r["gaps"], 1):
                print("export const GAP_%d_IN = %d;   // %.2fs" % (n, round(a * fps), a))
                print("export const GAP_%d_OUT = %d;  // %.2fs" % (n, round(b * fps), b))
            print()
            continue

        print("%-26s %6.2fs  speech %5.2f-%5.2f  lead %.2f  tail %.2f  %d gap(s)"
              % (path.stem, r["duration"], r["speech_start"], r["speech_end"],
                 r["lead_in"], r["tail"], len(r["gaps"])))
        for n, (a, b) in enumerate(r["gaps"], 1):
            print("%-26s   gap %d: %5.2f-%5.2f  (%.2fs)  frames %d-%d"
                  % ("", n, a, b, b - a, round(a * fps), round(b * fps)))


if __name__ == "__main__":
    main()

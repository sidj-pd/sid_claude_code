#!/usr/bin/env python3
"""
Transcribe a take, so a clip is identified by what it says rather than guessed.

Episode 02 cost a rebuild here: three expert takes had voiced durations of
6.22, 6.08 and 5.56s and I matched them to scripted lines by envelope shape.
Two were wrong. Envelopes cannot tell you which words are in a file.

    python3 scripts/transcribe.py ep03-shot01-vo-a ep03-shot01-vo-b

Needs GEMINI_API_KEY in .env. Stdlib only, to match tts.py.
"""
import base64
import json
import pathlib
import sys
import urllib.error
import urllib.request

ROOT = pathlib.Path(__file__).resolve().parent.parent
VO_DIR = ROOT / "public" / "vo"
MODEL = "gemini-2.5-flash"


def api_key():
    env = ROOT / ".env"
    if env.exists():
        for line in env.read_text().splitlines():
            if line.startswith("GEMINI_API_KEY="):
                return line.split("=", 1)[1].strip().strip('"').strip("'")
    sys.exit("GEMINI_API_KEY not found in .env")


def transcribe(path, key):
    body = json.dumps({
        "contents": [{"parts": [
            {"text": "Transcribe this audio exactly. Output only the words spoken, nothing else."},
            {"inline_data": {"mime_type": "audio/wav",
                             "data": base64.b64encode(path.read_bytes()).decode()}},
        ]}]
    }).encode()
    req = urllib.request.Request(
        "https://generativelanguage.googleapis.com/v1beta/models/%s:generateContent" % MODEL,
        data=body, headers={"Content-Type": "application/json", "x-goog-api-key": key})
    with urllib.request.urlopen(req, timeout=120) as r:
        d = json.load(r)
    return d["candidates"][0]["content"]["parts"][0]["text"].strip()


def main():
    if len(sys.argv) < 2:
        sys.exit(__doc__)
    key = api_key()
    for take in sys.argv[1:]:
        p = VO_DIR / ("%s.wav" % take)
        if not p.exists():
            print("%-26s MISSING" % take); continue
        try:
            print("%-26s %s" % (take, transcribe(p, key)))
        except (urllib.error.URLError, urllib.error.HTTPError, OSError) as e:
            print("%-26s failed: %s" % (take, e))


if __name__ == "__main__":
    main()

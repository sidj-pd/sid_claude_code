#!/usr/bin/env python3
"""
Generate the episode voice-over from Google Gemini TTS.

One line per call, guard-railed. Lines live in scripts/vo-lines.json so the
script itself carries no copy, and output lands in public/vo/<id>.wav ready
for Remotion's staticFile().

    GEMINI_API_KEY=... python3 scripts/tts.py            # only missing lines
    GEMINI_API_KEY=... python3 scripts/tts.py --force ep01-shot01

The key is read from the environment and is never written to disk. Do not
paste it into this file or into the manifest.
"""
import argparse
import base64
import json
import os
import re
import sys
import urllib.error
import urllib.request
import wave
from pathlib import Path

RATE = 24000
MODELS = ["gemini-3.1-flash-tts-preview", "gemini-2.5-flash-preview-tts"]
SAFETY = [
    {"category": c, "threshold": "BLOCK_NONE"}
    for c in (
        "HARM_CATEGORY_HARASSMENT",
        "HARM_CATEGORY_HATE_SPEECH",
        "HARM_CATEGORY_SEXUALLY_EXPLICIT",
        "HARM_CATEGORY_DANGEROUS_CONTENT",
    )
]

# Hard stops, never retries — retrying a runaway is what multiplies it.
MAX_ATTEMPTS = 2          # total, across all models
MAX_OUTPUT_TOKENS = 3000
CONNECT_TIMEOUT = 10

ROOT = Path(__file__).resolve().parent.parent
MANIFEST = ROOT / "scripts" / "vo-lines.json"
OUT_DIR = ROOT / "public" / "vo"


def synthesize(text, voice, character, delivery, out_path):
    key = os.environ.get("GEMINI_API_KEY")
    if not key:
        sys.exit("GEMINI_API_KEY is not set. Export it; do not hard-code it.")

    # Trailing dots make the model trail off into a long pause.
    text = re.sub(r"\.{2,}", "—", text)
    words = max(1, len(text.split()))
    read_timeout = min(120, 45 + words * 0.8)
    max_audio = min(30, 4.0 + words * 0.9)

    tone = ""
    if delivery.strip():
        tone = (
            "Delivery of THIS line: %s. This overrides the general register "
            "above wherever the two disagree.\n" % delivery.strip().rstrip(".")
        )
    prompt = (
        "Synthesize speech for the performance defined below. The Stage "
        "direction is for vocal direction only. Do NOT read it aloud.\n\n"
        "Stage direction: %s.\n%s#### TRANSCRIPT\n%s" % (character, tone, text)
    )

    payload = {
        "contents": [{"parts": [{"text": prompt}]}],
        "generationConfig": {
            "responseModalities": ["AUDIO"],
            "speechConfig": {
                "voiceConfig": {"prebuiltVoiceConfig": {"voiceName": voice}}
            },
        },
        "safetySettings": SAFETY,
    }
    body = json.dumps(payload).encode()

    attempts = 0
    last = None
    for model in MODELS:
        url = (
            "https://generativelanguage.googleapis.com/v1beta/models/"
            "%s:generateContent?key=%s" % (model, key)
        )
        while attempts < MAX_ATTEMPTS:
            attempts += 1
            req = urllib.request.Request(
                url,
                data=body,
                headers={"Content-Type": "application/json", "Connection": "close"},
            )
            try:
                with urllib.request.urlopen(req, timeout=read_timeout) as res:
                    data = json.loads(res.read().decode())
            except urllib.error.HTTPError as e:
                last = e.read().decode()[:200]
                break  # a rejected request stays rejected
            except Exception as e:  # timeout, connection reset
                sys.exit("%s: %s — abandoned, not retried" % (type(e).__name__, e))

            if "error" in data:
                last = str(data["error"].get("message", ""))[:200]
                break
            if data.get("promptFeedback", {}).get("blockReason"):
                last = "safety: " + data["promptFeedback"]["blockReason"]
                break

            usage = data.get("usageMetadata", {})
            out_tok = usage.get("candidatesTokenCount", 0)
            if out_tok > MAX_OUTPUT_TOKENS:
                sys.exit("runaway: %d output tokens for %d words" % (out_tok, words))

            b64 = next(
                (
                    p["inlineData"]["data"]
                    for p in data.get("candidates", [{}])[0]
                    .get("content", {})
                    .get("parts", [])
                    if "inlineData" in p
                ),
                None,
            )
            if not b64:
                last = "no audio in response"
                continue

            # inlineData is raw PCM: signed 16-bit LE, mono, 24kHz, no header.
            audio = base64.b64decode(b64)
            secs = len(audio) / float(RATE * 2)
            if secs > max_audio:
                sys.exit("runaway: %.1fs of audio for %d words" % (secs, words))

            out_path.parent.mkdir(parents=True, exist_ok=True)
            with wave.open(str(out_path), "wb") as w:
                w.setnchannels(1)
                w.setsampwidth(2)
                w.setframerate(RATE)
                w.writeframes(audio)

            cost = usage.get("promptTokenCount", 0) / 1e6 + out_tok * 20.0 / 1e6
            print(
                "  %-18s %5.2fs  %4d tok  ~$%.4f  (%s)"
                % (out_path.name, secs, out_tok, cost, model)
            )
            return secs

    sys.exit("TTS failed after %d attempt(s): %s" % (attempts, last))


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("ids", nargs="*", help="line ids to generate; default all")
    ap.add_argument("--force", action="store_true", help="regenerate existing files")
    args = ap.parse_args()

    spec = json.loads(MANIFEST.read_text())
    voices = spec["voices"]

    total = 0.0
    for line in spec["lines"]:
        if args.ids and line["id"] not in args.ids:
            continue
        out = OUT_DIR / ("%s.wav" % line["id"])
        if out.exists() and not args.force:
            print("  %-18s exists, skipping" % out.name)
            continue
        speaker = voices[line["speaker"]]
        print("%s:" % line["id"])
        total += synthesize(
            line["text"],
            speaker["voiceName"],
            speaker["character"],
            line.get("delivery", ""),
            out,
        )
    if total:
        print("\ntotal new audio: %.2fs" % total)


if __name__ == "__main__":
    main()

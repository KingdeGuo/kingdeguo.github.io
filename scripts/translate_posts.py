#!/usr/bin/env python3
"""Translate Chinese blog posts to English using DeepSeek API."""

import os
import hashlib
import json
import time
import urllib.request
import urllib.error
from pathlib import Path

DEEPSEEK_API_KEY = os.environ.get("DEEPSEEK_API_KEY")
MAX_TRANSLATIONS = os.environ.get("MAX_TRANSLATIONS")
if MAX_TRANSLATIONS is not None:
    MAX_TRANSLATIONS = int(MAX_TRANSLATIONS)
ZH_DIR = Path("content/zh/posts")
EN_DIR = Path("content/en/posts")
CACHE_FILE = Path("scripts/.translation_cache.json")

TRANSLATION_PROMPT = """You are a professional translator specializing in Chinese-to-English translation of blog posts about technology, management, organizational behavior, and workplace culture.

Translate the following Chinese blog post to English. Follow these rules strictly:
1. Preserve the YAML front matter structure (the content between --- markers) exactly as-is, only translate the field values (title, description, categories, tags)
2. Preserve all Markdown formatting
3. Do NOT translate code blocks, URLs, or proper nouns (author names, product names, etc.)
4. Keep the overall structure: front matter, then content body
5. The translation should be natural, idiomatic English, suitable for a professional blog
6. Preserve the original tone: thoughtful, analytical, and clear
7. Keep the slug/filename unchanged in front matter if present

Here is the content to translate:
"""


def file_hash(path):
    return hashlib.md5(path.read_bytes()).hexdigest()


def load_cache():
    if CACHE_FILE.exists():
        return json.loads(CACHE_FILE.read_text())
    return {}


def save_cache(cache):
    CACHE_FILE.write_text(json.dumps(cache, indent=2, ensure_ascii=False))


def translate_text(text, retries=3):
    payload = json.dumps({
        "model": "deepseek-chat",
        "messages": [
            {"role": "system", "content": TRANSLATION_PROMPT},
            {"role": "user", "content": text},
        ],
        "temperature": 0.3,
    }).encode("utf-8")

    for attempt in range(retries):
        try:
            req = urllib.request.Request(
                "https://api.deepseek.com/v1/chat/completions",
                data=payload,
                headers={
                    "Authorization": f"Bearer {DEEPSEEK_API_KEY}",
                    "Content-Type": "application/json",
                },
            )
            with urllib.request.urlopen(req, timeout=120) as resp:
                result = json.loads(resp.read().decode("utf-8"))
            return result["choices"][0]["message"]["content"]
        except Exception as e:
            print(f"  API error (attempt {attempt + 1}): {e}")
            if attempt < retries - 1:
                time.sleep(2 ** attempt)
    return None


IN_GITHUB_ACTIONS = os.environ.get("GITHUB_ACTIONS") == "true"


def gh_group(title):
    if IN_GITHUB_ACTIONS:
        print(f"::group::{title}")


def gh_endgroup():
    if IN_GITHUB_ACTIONS:
        print("::endgroup::")


def gh_summary(text):
    if IN_GITHUB_ACTIONS:
        summary_file = os.environ.get("GITHUB_STEP_SUMMARY")
        if summary_file:
            with open(summary_file, "a") as f:
                f.write(text + "\n")


def format_duration(seconds):
    m, s = divmod(int(seconds), 60)
    return f"{m}m{s}s" if m else f"{s}s"


def main():
    if not DEEPSEEK_API_KEY:
        print("ERROR: DEEPSEEK_API_KEY environment variable not set.")
        print("Set it or create it as a GitHub Secret for CI.")
        print("For local testing: export DEEPSEEK_API_KEY='your-key-here'")
        exit(1)

    EN_DIR.mkdir(parents=True, exist_ok=True)
    cache = load_cache()
    zh_files = sorted(ZH_DIR.glob("*.md"))
    total = len(zh_files)
    start_time = time.time()

    print("=" * 60)
    print(f"  Translation Job")
    print("=" * 60)
    print(f"  Source:      {ZH_DIR}")
    print(f"  Target:      {EN_DIR}")
    print(f"  To process:  {total} post(s)")
    print("-" * 60)

    translated = 0
    skipped = 0
    failed = 0

    if MAX_TRANSLATIONS is not None and MAX_TRANSLATIONS > 0:
        zh_files = zh_files[:MAX_TRANSLATIONS]
        total = len(zh_files)
        print(f"  Test mode: MAX_TRANSLATIONS={MAX_TRANSLATIONS}, only processing first {total} file(s)")

    gh_group("Translation progress")
    for i, zh_file in enumerate(zh_files, 1):
        en_file = EN_DIR / zh_file.name
        fhash = file_hash(zh_file)

        if en_file.exists() and cache.get(zh_file.name) == fhash:
            skipped += 1
            if i % 10 == 0 or i == total:
                print(f"  [{i}/{total}] {translated} translated, {skipped} skipped, {failed} failed")
            continue

        print(f"  [{i}/{total}] Translating: {zh_file.name} ... ", end="", flush=True)
        zh_content = zh_file.read_text(encoding="utf-8")
        en_content = translate_text(zh_content)

        if en_content is None:
            print("FAILED")
            failed += 1
            continue

        en_file.write_text(en_content.lstrip(), encoding="utf-8")
        cache[zh_file.name] = fhash
        translated += 1
        print("OK")

        if translated % 5 == 0:
            save_cache(cache)
    gh_endgroup()

    save_cache(cache)
    elapsed = format_duration(time.time() - start_time)

    print()
    print("=" * 60)
    print(f"  Result")
    print("=" * 60)
    print(f"  Total:            {total}")
    print(f"  OK (translated):  {translated}")
    print(f"  Skipped:          {skipped}")
    print(f"  Failed:           {failed}")
    print(f"  Elapsed:          {elapsed}")
    print("=" * 60)

    # Write GitHub Actions step summary
    gh_summary(
        f"## 🌐 Translation Result\n\n"
        f"| Status | Count |\n"
        f"|--------|------|\n"
        f"| **Total** | {total} |\n"
        f"| **✓ Translated** | {translated} |\n"
        f"| **- Skipped** | {skipped} |\n"
        f"| **✗ Failed** | {failed} |\n"
        f"| **⏱ Time** | {elapsed} |\n"
    )


if __name__ == "__main__":
    main()

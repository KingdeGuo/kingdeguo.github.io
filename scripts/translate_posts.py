#!/usr/bin/env python3
"""Translate Chinese blog posts to English using DeepSeek API."""

import os
import hashlib
import json
import time
from pathlib import Path

DEEPSEEK_API_KEY = os.environ.get("DEEPSEEK_API_KEY")
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
    import requests
    for attempt in range(retries):
        try:
            resp = requests.post(
                "https://api.deepseek.com/v1/chat/completions",
                headers={
                    "Authorization": f"Bearer {DEEPSEEK_API_KEY}",
                    "Content-Type": "application/json",
                },
                json={
                    "model": "deepseek-chat",
                    "messages": [
                        {"role": "system", "content": TRANSLATION_PROMPT},
                        {"role": "user", "content": text},
                    ],
                    "temperature": 0.3,
                },
                timeout=120,
            )
            resp.raise_for_status()
            return resp.json()["choices"][0]["message"]["content"]
        except Exception as e:
            print(f"  API error (attempt {attempt + 1}): {e}")
            if attempt < retries - 1:
                time.sleep(2 ** attempt)
    return None


def main():
    if not DEEPSEEK_API_KEY:
        print("ERROR: DEEPSEEK_API_KEY environment variable not set.")
        print("Set it or create it as a GitHub Secret for CI.")
        print("For local testing: export DEEPSEEK_API_KEY='your-key-here'")
        exit(1)

    EN_DIR.mkdir(parents=True, exist_ok=True)
    cache = load_cache()
    zh_files = sorted(ZH_DIR.glob("*.md"))

    print(f"Found {len(zh_files)} Chinese posts to check.")
    translated = 0
    skipped = 0

    for zh_file in zh_files:
        en_file = EN_DIR / zh_file.name
        fhash = file_hash(zh_file)

        if en_file.exists() and cache.get(zh_file.name) == fhash:
            skipped += 1
            continue

        print(f"  Translating: {zh_file.name}...")
        zh_content = zh_file.read_text(encoding="utf-8")
        en_content = translate_text(zh_content)

        if en_content is None:
            print(f"  FAILED: {zh_file.name}, skipping.")
            continue

        en_file.write_text(en_content.lstrip(), encoding="utf-8")
        cache[zh_file.name] = fhash
        translated += 1

        if translated % 5 == 0:
            save_cache(cache)

    save_cache(cache)
    print(f"Done. Translated: {translated}, Skipped (up-to-date): {skipped}")


if __name__ == "__main__":
    main()

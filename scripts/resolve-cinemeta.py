#!/usr/bin/env python3
"""Resolve official studio title lists against Cinemeta and report ambiguous hits."""
import concurrent.futures
import json
import re
import sys
import urllib.parse
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
source = json.loads((ROOT / "source-films.json").read_text())
source.update(json.loads((ROOT / "source-extras.json").read_text()))
aliases = {
    "Monster's Inc.": "Monsters, Inc.",
    "Monster's University": "Monsters University",
    "WALL-E": "WALL·E",
    "Fantasia 2000": "Fantasia/2000",
    "One Hundred and One Dalmatians": "101 Dalmatians",
    "Moana": "Moana",
    "Frozen 2": "Frozen II",
    "The Three Caballeros": "The Three Caballeros",
}


def norm(s):
    return re.sub(r"[^a-z0-9]", "", s.lower())


def resolve(row, kind="movie"):
    name, year = row["name"], row["year"]
    query = aliases.get(name, name)
    url = f"https://v3-cinemeta.strem.io/catalog/{kind}/top/search=" + urllib.parse.quote(query, safe="") + ".json"
    try:
        req = urllib.request.Request(url, headers={"User-Agent": "StremioCatalogBuilder/1.0"})
        with urllib.request.urlopen(req, timeout=35) as response:
            hits = json.load(response)["metas"]
        matches = []
        for hit in hits:
            if norm(hit.get("name", "")) not in {norm(query), norm(name)}:
                continue
            release = str(hit.get("releaseInfo", ""))
            if str(year) not in release:
                continue
            if not re.fullmatch(r"tt\d+", hit.get("id", "")):
                continue
            matches.append(hit)
        if len(matches) != 1:
            return {**row, "error": "ambiguous" if matches else "not found", "candidates": [(h.get("name"), h.get("releaseInfo"), h.get("id")) for h in hits[:6]]}
        return {**row, "imdb": matches[0]["id"], "matchedName": matches[0]["name"]}
    except Exception as exc:
        return {**row, "error": str(exc)}


for studio, rows in source.items():
    path = ROOT / f"{studio}-resolved.json"
    if path.exists():
        rows = json.loads(path.read_text())
    indices = list(range(len(rows))) if "--all" in sys.argv else [i for i, x in enumerate(rows) if "imdb" not in x]
    with concurrent.futures.ThreadPoolExecutor(max_workers=3) as pool:
        updated = list(pool.map(lambda i: resolve(rows[i], "series" if studio == "series" else "movie"), indices))
    results = list(rows)
    for i, item in zip(indices, updated):
        results[i] = item
    path.write_text(json.dumps(results, indent=2, ensure_ascii=False) + "\n")
    unresolved = [x for x in results if "imdb" not in x]
    print(studio, len(results) - len(unresolved), "/", len(results), "resolved")
    for row in unresolved:
        print("  ", row["name"], row["year"], row.get("error"), row.get("candidates", "")[:3] if isinstance(row.get("candidates"), list) else "")

#!/usr/bin/env python3
"""Audit statico SceltoSmart senza dipendenze esterne.

Controlla link locali, metadati principali, sitemap, copertura delle 71 schede
e sintassi dei dati JS serializzati come JSON. Non misura velocita' reale
ne' raggiungibilita' di siti o immagini ospitati da terzi.
"""
from __future__ import annotations

import json
import re
import sys
import unicodedata
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urlsplit
from xml.etree import ElementTree as ET

ROOT = Path(__file__).resolve().parents[1]
BASE = "https://mattiaaaa780.github.io/sceltosmart"
errors = []
warnings = []

def warn(msg):
    warnings.append(msg)

def fail(msg):
    errors.append(msg)

class Reader(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.links = []
        self.ids = set()
        self.h1 = 0
        self.titles = 0
        self.descriptions = 0
        self.canonicals = 0
        self.noindex = False
        self.lang = False
        self.images = 0
    def handle_starttag(self, tag, pairs):
        attrs = dict(pairs)
        if tag == "html":
            self.lang = attrs.get("lang") == "it"
        if tag == "h1":
            self.h1 += 1
        if tag == "title":
            self.titles += 1
        if tag == "meta" and attrs.get("name", "").lower() == "description":
            self.descriptions += 1
        if tag == "meta" and attrs.get("name", "").lower() == "robots":
            self.noindex = "noindex" in attrs.get("content", "").lower()
        if tag == "link" and attrs.get("rel", "").lower() == "canonical":
            self.canonicals += 1
        if attrs.get("id"):
            self.ids.add(attrs["id"])
        if tag == "img":
            self.images += 1
            if "alt" not in attrs:
                warn("Immagine senza alt: " + str(attrs.get("src", ""))[:90])
        if tag in ("a", "link", "script", "img", "source"):
            value = attrs.get("href") if tag in ("a", "link") else attrs.get("src")
            if value:
                self.links.append((value, tag))

def find_local(ref, current):
    if ref.startswith("#"):
        return current, unquote(ref[1:])
    parsed = urlsplit(ref)
    if parsed.scheme or parsed.netloc or ref.startswith("//"):
        return None, None
    raw = unquote(parsed.path).replace("\\", "/")
    if not raw:
        return current, unquote(parsed.fragment)
    if raw.startswith("/sceltosmart/"):
        raw = raw[len("/sceltosmart/"):]
        target = ROOT / raw
    elif raw == "/sceltosmart" or raw == "/":
        target = ROOT / "index.html"
    elif raw.startswith("/"):
        target = ROOT / raw.lstrip("/")
    else:
        target = current.parent / raw
    target = target.resolve()
    if not target.is_relative_to(ROOT):
        fail(f"Link fuori repository: {current.relative_to(ROOT)} -> {ref}")
        return None, None
    if target.is_dir():
        target /= "index.html"
    return target, unquote(parsed.fragment)

pages = {}
for path in ROOT.rglob("*.html"):
    if any(x in {".git", "node_modules", ".venv"} for x in path.parts):
        continue
    parser = Reader()
    try:
        parser.feed(path.read_text(encoding="utf-8"))
    except Exception as exc:
        fail(f"HTML non leggibile: {path.relative_to(ROOT)} ({exc})")
        continue
    pages[path.resolve()] = parser
    relative = path.relative_to(ROOT).as_posix()
    # Il file di verifica Search Console e' un token e NON una pagina HTML.
    if re.fullmatch(r"google[0-9a-f]+\.html", path.name):
        continue
    if not parser.lang:
        fail("Manca lang=it: " + relative)
    if parser.h1 != 1:
        fail(f"H1 non univoco ({parser.h1}): {relative}")
    if parser.titles != 1:
        fail(f"Titolo non univoco ({parser.titles}): {relative}")
    if not parser.noindex and relative not in {"404.html"} and parser.canonicals != 1:
        fail(f"Canonical mancante/duplicato ({parser.canonicals}): {relative}")
    if not parser.noindex and parser.descriptions != 1:
        warn(f"Descrizione non univoca ({parser.descriptions}): {relative}")

for current, parser in pages.items():
    for ref, tag in parser.links:
        target, fragment = find_local(ref, current)
        if not target:
            continue
        if not target.is_file():
            fail(f"Risorsa mancante da {current.relative_to(ROOT)}: {ref}")
            continue
        if fragment and target.resolve() in pages and fragment not in pages[target.resolve()].ids:
            warn(f"Ancora non trovata da {current.relative_to(ROOT)}: {ref}")

def assigned_json(path, variable):
    raw = (ROOT / path).read_text(encoding="utf-8")
    match = re.search(r"window\." + re.escape(variable) + r"\s*=\s*", raw)
    if not match:
        raise ValueError("Variabile non trovata: " + variable)
    return json.loads(raw[match.end():].strip().rstrip(";").strip())

def slug(name):
    text = unicodedata.normalize("NFKD", name.lower())
    text = "".join(c for c in text if not unicodedata.combining(c))
    text = text.replace("+", "-plus")
    return re.sub(r"^-|-$", "", re.sub(r"[^a-z0-9]+", "-", text))

try:
    families = assigned_json("prodotti/dati-smartphone.js", "SCELTOSMART_FAMIGLIE")
    models = [name for family in families for name in family["models"]]
    documented = assigned_json("prodotti/specifiche-verificate.js", "SCELTOSMART_SPECIFICHE")
    if len(models) != 71 or len(set(models)) != 71:
        fail(f"Numero di modelli inatteso: {len(models)}")
    if len({slug(m) for m in models}) != len(models):
        fail("Collisione fra URL di due modelli")
    for name in models:
        target = ROOT / "prodotti" / "schede" / (slug(name) + ".html")
        if not target.exists():
            fail("Scheda HTML assente per " + name)
        if not documented.get(name, {}).get("source", "").startswith("https://"):
            fail("Fonte ufficiale mancante per " + name)
except Exception as exc:
    fail("Catalogo non valido: " + str(exc))

try:
    xml = ET.parse(ROOT / "sitemap.xml")
    urls = [node.text for node in xml.findall(".//{*}loc")]
    if len(urls) != len(set(urls)):
        fail("URL duplicati nella sitemap XML")
    if len(urls) < 88:
        fail(f"Sitemap incompleta: solo {len(urls)} URL")
    for link in urls:
        if not link.startswith(BASE + "/"):
            fail("URL estraneo alla sitemap: " + str(link))
            continue
        raw = unquote(urlsplit(link).path[len("/sceltosmart/"):])
        candidate = ROOT / raw
        if candidate.is_dir() or not candidate.suffix:
            candidate /= "index.html"
        if not candidate.is_file():
            fail("URL sitemap senza file: " + link)
    # La sitemap XML deve essere coerente con quella testuale e includere le 71 schede.
    txt_urls = [line.strip() for line in (ROOT / "sitemap.txt").read_text(encoding="utf-8").splitlines() if line.strip()]
    if txt_urls != urls:
        fail("Sitemap testuale diversa dalla sitemap XML (URL o ordine)")
    for name in models:
        model_url = BASE + "/prodotti/schede/" + slug(name) + ".html"
        if model_url not in urls:
            fail("Scheda non presente nella sitemap: " + name)
    # Le URL pubblicate nella sitemap non devono puntare a pagine noindex.
    for link in urls:
        raw = unquote(urlsplit(link).path[len("/sceltosmart/"):])
        candidate = ROOT / raw
        if candidate.is_dir() or not candidate.suffix:
            candidate /= "index.html"
        page = pages.get(candidate.resolve())
        if page and page.noindex:
            fail("Pagina noindex elencata nella sitemap: " + link)
except Exception as exc:
    fail("Sitemap XML non valida: " + str(exc))

print(f"Pagine HTML analizzate: {len(pages)}")
print(f"Avvisi: {len(warnings)} | Errori: {len(errors)}")
for item in warnings[:35]:
    print("AVVISO:", item)
if len(warnings) > 35:
    print(f"... altri {len(warnings)-35} avvisi")
for item in errors:
    print("ERRORE:", item)
sys.exit(1 if errors else 0)

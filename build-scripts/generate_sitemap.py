"""
Sitemap generator for openfpv.com.ua
Produces:
  site/sitemap-ua.xml    — Ukrainian pages only
  site/en/sitemap.xml    — English pages only
  site/sitemap_index.xml — index pointing to both
  site/sitemap.xml       — alias of sitemap_index (for Google Search Console)

Run after `mkdocs gh-deploy` so that site/ exists with all built pages.
"""

import os
import subprocess
import yaml
from datetime import datetime

# ── Config ──────────────────────────────────────────────────────────────────

yaml.SafeLoader.add_multi_constructor(
    "tag:yaml.org,2002:python/name:",
    lambda loader, suffix, node: suffix,
)
with open("mkdocs.yml", "r", encoding="utf-8") as f:
    config = yaml.safe_load(f)

BASE_URL = config.get("site_url", "https://openfpv.com.ua").rstrip("/")
NOW = datetime.now().date().isoformat()

# ── Helpers ──────────────────────────────────────────────────────────────────

def get_git_lastmod(file_path: str) -> str:
    """Return YYYY-MM-DD of the last git commit touching file_path."""
    try:
        result = subprocess.run(
            ["git", "log", "-1", "--format=%ai", "--", file_path],
            capture_output=True, text=True, timeout=10,
        )
        date_str = result.stdout.strip()
        if date_str:
            return date_str[:10]
    except Exception:
        pass
    return NOW


def get_changefreq(url_path: str) -> str:
    """Google officially ignores changefreq, so we use daily for all pages.
    This is simpler and has no negative SEO impact."""
    return "daily"


def find_source_file(url_path: str, lang: str) -> str | None:
    """
    Map a URL path back to its source .md file.
    url_path examples: '', 'quick-start', 'firmware/overview',
                       'update/posts/2025-04-23-jumbo'
    """
    base_dirs = [f"docs/{lang}", "docs"]
    candidates = []

    if not url_path or url_path in ("en", "en/"):
        candidates = [f"docs/{lang}/index.md"]
    else:
        for base in base_dirs:
            candidates += [
                f"{base}/{url_path}.md",
                f"{base}/{url_path}/index.md",
            ]

    for c in candidates:
        if os.path.exists(c):
            return c
    return None


# ── Scan site/ directory for all built pages ─────────────────────────────────

def scan_site() -> tuple[list[str], list[str]]:
    """
    Walk site/ and collect URL paths from index.html files.
    Returns (uk_paths, en_paths) — sorted lists, no duplicates.
    """
    SKIP_DIRS = {"assets", "search", ".git"}
    uk_paths: list[str] = []
    en_paths: list[str] = []
    seen: set[str] = set()

    for root, dirs, files in os.walk("site"):
        dirs[:] = [d for d in dirs if d not in SKIP_DIRS and not d.startswith(".")]

        if "index.html" not in files:
            continue

        rel = os.path.relpath(root, "site").replace("\\", "/")
        url_path = "" if rel == "." else rel  # '' = root page

        if url_path in seen:
            continue
        seen.add(url_path)

        if url_path == "en" or url_path.startswith("en/"):
            en_paths.append(url_path)
        else:
            uk_paths.append(url_path)

    return sorted(uk_paths), sorted(en_paths)


# ── Build XML entries ─────────────────────────────────────────────────────────

def loc(url_path: str) -> str:
    return f"{BASE_URL}/{url_path}/" if url_path else f"{BASE_URL}/"


def build_entry(url_path: str, self_lang: str, pair_path: str | None) -> str:
    src_lang = "en" if url_path.startswith("en/") else "uk"
    source   = find_source_file(
        url_path.removeprefix("en/") if src_lang == "en" else url_path,
        src_lang,
    )
    lastmod    = get_git_lastmod(source) if source else NOW
    changefreq = get_changefreq(url_path)

    self_loc = loc(url_path)
    lines = [
        "  <url>",
        f"    <loc>{self_loc}</loc>",
        f"    <lastmod>{lastmod}</lastmod>",
        f"    <changefreq>{changefreq}</changefreq>",
        f'    <xhtml:link rel="alternate" hreflang="{self_lang}" href="{self_loc}"/>',
    ]
    if pair_path is not None:
        pair_lang = "en" if self_lang == "uk" else "uk"
        lines.append(
            f'    <xhtml:link rel="alternate" hreflang="{pair_lang}" href="{loc(pair_path)}"/>'
        )
    lines.append("  </url>")
    return "\n".join(lines)


# ── Write helpers ─────────────────────────────────────────────────────────────

URLSET_OPEN = (
    '<?xml version="1.0" encoding="UTF-8"?>\n'
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n'
    '        xmlns:xhtml="http://www.w3.org/1999/xhtml">\n'
)
URLSET_CLOSE = "</urlset>\n"


def write_sitemap(filepath: str, entries: list[str]) -> None:
    os.makedirs(os.path.dirname(filepath) or ".", exist_ok=True)
    with open(filepath, "w", encoding="utf-8") as f:
        f.write(URLSET_OPEN)
        f.write("\n".join(entries))
        f.write("\n")
        f.write(URLSET_CLOSE)


def write_sitemap_index() -> None:
    """Write sitemap_index.xml only (separate file for Google Search Console).
    Does NOT overwrite sitemap.xml — that must remain a urlset for
    MkDocs Material's navigation.instant to parse correctly."""
    content = (
        '<?xml version="1.0" encoding="UTF-8"?>\n'
        '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
        f"  <sitemap>\n"
        f"    <loc>{BASE_URL}/sitemap-ua.xml</loc>\n"
        f"    <lastmod>{NOW}</lastmod>\n"
        f"  </sitemap>\n"
        f"  <sitemap>\n"
        f"    <loc>{BASE_URL}/en/sitemap.xml</loc>\n"
        f"    <lastmod>{NOW}</lastmod>\n"
        f"  </sitemap>\n"
        f"</sitemapindex>\n"
    )
    with open("site/sitemap_index.xml", "w", encoding="utf-8") as f:
        f.write(content)


def write_combined_sitemap(uk_entries: list[str], en_entries: list[str]) -> None:
    """Write site/sitemap.xml as a combined urlset with ALL pages (UK + EN).
    MkDocs Material's navigation.instant reads this file to discover all site
    pages — it must stay in urlset format, not sitemapindex."""
    write_sitemap("site/sitemap.xml", uk_entries + en_entries)


# ── Main ──────────────────────────────────────────────────────────────────────

uk_pages, en_pages = scan_site()

# Build lookup sets for pairing
uk_set = set(uk_pages)
en_set = set(en_pages)


def uk_to_en(p: str) -> str:
    return ("en/" + p) if p else "en"

def en_to_uk(p: str) -> str:
    return p.removeprefix("en/") if p != "en" else ""


# Ukrainian sitemap
uk_entries = []
for path in uk_pages:
    en_pair = uk_to_en(path)
    uk_entries.append(build_entry(path, "uk", en_pair if en_pair in en_set else None))

# English sitemap
en_entries = []
for path in en_pages:
    uk_pair = en_to_uk(path)
    en_entries.append(build_entry(path, "en", uk_pair if uk_pair in uk_set else None))

os.makedirs("site/en", exist_ok=True)
write_sitemap("site/sitemap-ua.xml", uk_entries)
write_sitemap("site/en/sitemap.xml", en_entries)
write_sitemap_index()
write_combined_sitemap(uk_entries, en_entries)

print(f"✅ sitemap.xml        — {len(uk_entries) + len(en_entries)} сторінок (UK+EN, urlset для теми)")
print(f"✅ sitemap-ua.xml     — {len(uk_entries)} сторінок (UK)")
print(f"✅ en/sitemap.xml     — {len(en_entries)} сторінок (EN)")
print(f"✅ sitemap_index.xml  — індекс обох (для Google Search Console)")


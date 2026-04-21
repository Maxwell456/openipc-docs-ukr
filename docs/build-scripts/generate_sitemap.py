import os
import yaml
from datetime import datetime

# Handle !!python/name tags in mkdocs.yml
yaml.SafeLoader.add_multi_constructor(
    'tag:yaml.org,2002:python/name:',
    lambda loader, suffix, node: suffix
)

with open("mkdocs.yml", "r", encoding="utf-8") as f:
    config = yaml.safe_load(f)

base_url = config.get("site_url", "http://localhost").rstrip("/")
now = datetime.now().date().isoformat()
uk_paths = []

def extract_paths(nav):
    for item in nav:
        if isinstance(item, dict):
            for key, value in item.items():
                if isinstance(value, str):
                    uk_paths.append(value.replace(".md", "").lstrip("/"))
                elif isinstance(value, list):
                    extract_paths(value)
        elif isinstance(item, str):
            uk_paths.append(item.replace(".md", "").lstrip("/"))

extract_paths(config["nav"])

# English paths mirror Ukrainian but nested under /en/
en_paths = ["en/" + p if p else "en/" for p in uk_paths]

def write_sitemap(filepath, paths, base):
    os.makedirs(os.path.dirname(filepath), exist_ok=True)
    with open(filepath, "w", encoding="utf-8") as f:
        f.write('<?xml version="1.0" encoding="UTF-8"?>\n')
        f.write('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n')
        for path in paths:
            url = f"{base}/{path.strip('/')}/" if path else f"{base}/"
            f.write("  <url>\n")
            f.write(f"    <loc>{url}</loc>\n")
            f.write(f"    <lastmod>{now}</lastmod>\n")
            f.write("  </url>\n")
        f.write('</urlset>\n')

# Only generate /en/sitemap.xml
# The root /sitemap.xml is generated automatically by MkDocs Material
# and already contains ALL pages (UK + EN) — do not overwrite it.
os.makedirs("site/en", exist_ok=True)
write_sitemap("site/en/sitemap.xml", en_paths, base_url)

print("✅ site/en/sitemap.xml згенеровано")
print("ℹ️  Кореневий sitemap.xml генерується автоматично MkDocs (містить усі мови)")

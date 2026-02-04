import os
import yaml
from datetime import datetime

# Handle !!python/name tags in mkdocs.yml
yaml.SafeLoader.add_multi_constructor('tag:yaml.org,2002:python/name:', lambda loader, suffix, node: suffix)

with open("mkdocs.yml", "r", encoding="utf-8") as f:
    config = yaml.safe_load(f)

base_url = config.get("site_url", "http://localhost")
now = datetime.now().date().isoformat()
paths = []

def extract_paths(nav, parent=""):
    for item in nav:
        if isinstance(item, dict):
            for key, value in item.items():
                if isinstance(value, str):
                    path = parent + value.replace(".md", "").lstrip("/")
                    paths.append(path)
                elif isinstance(value, list):
                    extract_paths(value, parent)
        elif isinstance(item, str):
            path = parent + item.replace(".md", "").lstrip("/")
            paths.append(path)

extract_paths(config["nav"])

# Ensure site directory exists
if not os.path.exists("site"):
    os.makedirs("site")

with open("site/sitemap.xml", "w", encoding="utf-8") as f:
    f.write('<?xml version="1.0" encoding="UTF-8"?>\n')
    f.write('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n')
    for path in paths:
        url = f"{base_url}/{path.strip('/')}/" if path else f"{base_url}/"
        f.write("  <url>\n")
        f.write(f"    <loc>{url}</loc>\n")
        f.write(f"    <lastmod>{now}</lastmod>\n")
        f.write("  </url>\n")
    f.write('</urlset>\n')

print("✅ Sitemap сгенеровано на основі mkdocs.yml")

<div align="center">

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="docs/public/logo-dark.png">
  <source media="(prefers-color-scheme: light)" srcset="docs/public/logo-light.png">
  <img src="docs/public/logo-light.png" alt="OpenFPV" width="320">
</picture>

### Open documentation for digital FPV systems based on OpenIPC

Bilingual Ukrainian / English knowledge base — hardware, firmware, configuration and guides for the OpenIPC digital FPV ecosystem.

[![Live site](https://img.shields.io/badge/live-openfpv.com.ua-3d6aff?style=flat-square)](https://openfpv.com.ua)
[![Deploy](https://github.com/Maxwell456/openipc-docs-ukr/actions/workflows/deploy.yml/badge.svg)](https://github.com/Maxwell456/openipc-docs-ukr/actions/workflows/deploy.yml)
[![Built with VitePress](https://img.shields.io/badge/built%20with-VitePress-646cff?style=flat-square&logo=vite&logoColor=white)](https://vitepress.dev)
[![Languages](https://img.shields.io/badge/languages-UK%20%2F%20EN-success?style=flat-square)](https://openfpv.com.ua/en/)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue?style=flat-square)](LICENSE)

**[openfpv.com.ua](https://openfpv.com.ua)** · **[Documentation](https://openfpv.com.ua/getting-started/)** · **[English version](https://openfpv.com.ua/en/)**

</div>

---

## About

**OpenFPV** is a community-maintained documentation site for building and running digital FPV systems on the [OpenIPC](https://openipc.org) platform — turning affordable IP cameras into low-latency, long-range digital video links.

It covers the full journey: choosing hardware, flashing firmware, configuring the link, and troubleshooting — for both newcomers and DIY enthusiasts.

> A community project by Ukrainian OpenIPC users. Not an official OpenIPC resource.

## Features

- Fully bilingual — every page exists in both Ukrainian and English
- Instant full-text search (VitePress local provider, no external service)
- Modern, responsive dark theme
- Installable as a PWA with offline support
- Optimized for search engines and social sharing — JSON-LD, hreflang, OG images and redirect stubs for legacy URLs

## What's inside

| Section | Contents |
| --- | --- |
| **Getting Started** | Quick start, drone & ground-station setup, troubleshooting |
| **Hardware** | Cameras (VTX), receivers (VRX), Wi-Fi network cards |
| **Software** | Camera firmware (APFPV, APALink, Greg's, WFB-NG), OpenIPC 4G/LTE (QuadroFleet), Waybeam Venc, fiber-optic link, ground-station firmware |
| **Configuration** | Companion configurator, firmware flashing (sysupgrade, UART), telemetry & OSD, Adaptive-Link, advanced settings |
| **Tools** | Glass-to-glass latency timer, WFB-NG bitrate calculator |
| **Updates** | Changelog & news |

## Tech stack

- [VitePress](https://vitepress.dev) 1.6 — static-site generator (Vue 3 + Vite)
- Node.js · npm — CI builds on Node 22
- Deployed to GitHub Pages; a Docker + nginx image is available for self-hosting

## Local development

**Prerequisites:** Node.js 18+ and npm 9+.

```bash
# 1. Clone
git clone https://github.com/Maxwell456/openipc-docs-ukr.git
cd openipc-docs-ukr

# 2. Install dependencies
npm install

# 3. Start the dev server (hot-reload)
npm run dev          # http://localhost:5173
```

Build and preview the production site:

```bash
npm run build        # output: docs/.vitepress/dist/
npm run preview      # http://localhost:4173
```

| Script | Purpose |
| --- | --- |
| `npm run dev` | Dev server with hot-reload |
| `npm run build` | Production build — **fails on dead internal links** |
| `npm run preview` | Serve the built site locally |

## Project structure

```
docs/
├─ .vitepress/
│  ├─ config.mts          # Nav, sidebar, i18n, redirects, JSON-LD, SEO
│  └─ theme/              # Custom theme, styles and Vue components
├─ public/                # Static assets (favicon, images, PWA, CNAME)
├─ en/                    # English content (mirrors the Ukrainian tree)
├─ getting-started/       # Quick start & setup
├─ hardware/              # VTX / VRX / network cards
├─ software/              # Firmware guides
├─ configuration/         # Flashing & tuning
├─ tools/                 # Interactive tools
├─ updates/posts/         # News & release posts
└─ index.md               # Homepage

scripts/                  # Maintenance scripts (e.g. Search Console queries)
Dockerfile, nginx.conf    # Optional self-hosted deployment
```

## Deployment

Every push to `main` triggers [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml), which builds the site on Node 22 and publishes it to GitHub Pages. The custom domain is set via `docs/public/CNAME`.

To self-host instead, build the bundled image — a multi-stage build that compiles the site and serves it with nginx (clean URLs, asset caching, health check):

```bash
docker build -t openfpv-docs .
docker run -p 8080:80 openfpv-docs    # http://localhost:8080
```

## Contributing

Contributions are welcome — fixes, new guides, translations.

1. Fork the repository
2. Create a branch: `git checkout -b fix/short-description`
3. Make your changes and commit
4. Open a Pull Request

**Conventions worth knowing:**

- **Keep both locales in sync.** Every page under `docs/` has a counterpart under `docs/en/`. Add or rename a page in one language — do the same in the other.
- **Run `npm run build` before opening a PR.** The build fails on dead internal links, so it catches most mistakes.
- **Never delete a live URL.** If a page moves or merges, add the old path to the `REDIRECTS` map in `config.mts` so existing search rankings carry over.
- **Front-matter matters.** `title` and `description` drive SEO; the optional `faq` block renders FAQ schema.

Spotted an error in the docs? Use the **"Report an error"** button on any page, or [open an issue](https://github.com/Maxwell456/openipc-docs-ukr/issues/new).

## License

Code and content are released under the [MIT License](LICENSE).

Third-party trademarks, firmware and product names belong to their respective owners. OpenIPC is a separate open-source project — this site is an independent community resource.

---

<div align="center">

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="docs/public/logo-dark.png">
  <source media="(prefers-color-scheme: light)" srcset="docs/public/logo-light.png">
  <img src="docs/public/logo-light.png" alt="OpenFPV" width="320">
</picture>

### Open documentation for digital FPV systems based on OpenIPC

Bilingual Ukrainian / English knowledge base — hardware, firmware, configuration and guides for the OpenIPC digital FPV ecosystem.

[![Live site](https://img.shields.io/badge/live-openfpv.com.ua-3d6aff?style=flat-square)](https://openfpv.com.ua)
[![Built with VitePress](https://img.shields.io/badge/built%20with-VitePress-646cff?style=flat-square&logo=vite&logoColor=white)](https://vitepress.dev)
[![Languages](https://img.shields.io/badge/languages-UK%20%2F%20EN-success?style=flat-square)](https://openfpv.com.ua/en/)

**[openfpv.com.ua](https://openfpv.com.ua)** · **[Documentation](https://openfpv.com.ua/getting-started/)** · **[English version](https://openfpv.com.ua/en/)**

</div>

---

## About

**OpenFPV** is a community-maintained documentation site for building and running digital FPV systems on the [OpenIPC](https://openipc.org) platform — turning affordable IP cameras into low-latency, long-range digital video links.

It covers the full journey: choosing hardware, flashing firmware, configuring the link, and troubleshooting — for both newcomers and DIY enthusiasts.

> A community project by Ukrainian OpenIPC users. Not an official OpenIPC resource.

## Features

- Fully bilingual — Ukrainian and English
- Instant full-text search
- Modern, responsive dark theme
- Installable as a PWA with offline support
- Optimized for search engines and social sharing

## What's inside

| Section | Contents |
| --- | --- |
| **Getting Started** | Quick start, drone & ground-station setup, troubleshooting |
| **Hardware** | Cameras (VTX), receivers (VRX), Wi-Fi network cards |
| **Software** | Camera firmware (APFPV, APALink, Greg's, WFB-NG), OpenIPC 4G/LTE (QuadroFleet), Waybeam Venc, ground-station firmware |
| **Configuration** | Multiconfigurator, telemetry & OSD, Adaptive-Link, advanced settings |
| **Updates** | Changelog & news |

## Tech stack

- [VitePress](https://vitepress.dev) — static-site generator (Vue 3 + Vite)
- Node.js 20 · npm
- Hosted on GitHub Pages

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

## Project structure

```
docs/
├─ .vitepress/
│  ├─ config.mts          # Nav, sidebar, i18n, site config
│  └─ theme/              # Custom theme, styles and components
├─ public/                # Static assets (favicon, images, PWA, CNAME)
├─ en/                    # English content
├─ getting-started/       # Quick start & setup
├─ hardware/              # VTX / VRX / network cards
├─ software/              # Firmware guides
├─ configuration/         # Configuration
├─ updates/               # Changelog
└─ index.md               # Homepage
```

## Deployment

The site is hosted on GitHub Pages and deploys automatically on every push to the `main` branch.

## Contributing

Contributions are welcome — fixes, new guides, translations.

1. Fork the repository
2. Create a branch: `git checkout -b fix/short-description`
3. Make your changes and commit
4. Open a Pull Request

Spotted an error in the docs? Use the **"Report an error"** button on any page, or [open an issue](https://github.com/Maxwell456/openipc-docs-ukr/issues/new).

---
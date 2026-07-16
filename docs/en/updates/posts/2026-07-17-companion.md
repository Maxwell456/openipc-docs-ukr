---
title: Companion v0.9.4 — the multiconfigurator changed its name, learned to back up firmware and got a dark theme
sidebarTitle: Companion v0.9.4
date: 2026-07-17
description: The official OpenIPC configurator is now called Companion. The highlights of v0.8–v0.9.4 — firmware backup and restore, a dark theme, the Preferences tab with firmware-focused mode, a fixed sysupgrade path and a working signed app on macOS.
tags:
  - companion
  - configurator
  - OpenIPC
  - firmware
  - backup
---

# Companion v0.9.4 — the multiconfigurator changed its name, learned to back up firmware and got a dark theme

The official OpenIPC graphical configurator — the one everybody in the community calls the **multiconfigurator** — quietly changed its name and grew noticeably over the past six months. It is now called **Companion**, and the current version is **v0.9.4**. Here are the highlights of releases v0.8–v0.9.4, and why you should update if you are on v0.9.0.

---

### 🔹 First, about the name

The app used to be called **OpenIPC Config**, and "multiconfigurator" in the docs and chats. As of release **v0.7.14** (4 January 2026) the build files are named `Companion-*` instead of `OpenIPC-Config-*`, and the `openipc-configurator` repository was renamed to [OpenIPC/companion](https://github.com/OpenIPC/companion).

This matters for one reason only: **your old links still work** — GitHub redirects them to the new repository and you land on the same releases. The download page simply shows a different name now.

Do not confuse it with [OpenIPC Config by MarioFPV](https://github.com/OpenIPC/configurator) — that is a separate tool, and it is the one you need for NVRs, which Companion still does not support.

---

### 🔹 Firmware backup and restore

The most important addition in **v0.9.0** (10 April). The **Firmware** tab gained a **Backup / Restore** section that takes a full dump of the camera's flash: the app kills the streamer to free RAM, dumps every `/dev/mtdblock*` partition with `dd`, generates MD5 checksums and downloads a ready `.tar.gz` to your machine.

Restore works from the same place, but with guardrails: checksums are verified locally, the layout is confirmed by reading `/proc/mtd` from the device, and only then are partitions written with `flashcp`. If MD5 verification fails, the restore is aborted **before** anything is written to flash. Plus there is a mandatory "I accept the risk of permanently bricking this device" checkbox — the operation is irreversible.

For FPV this is essentially insurance: take a backup of the stock firmware and you can experiment freely.

---

### 🔹 Dark theme and a rebuilt interface

- **Dark theme** with a toggle in the header; text and warning colours were made theme-aware so nothing disappears against a dark background
- **The Advanced tab was replaced by Preferences** — with proper persistence of the app's settings
- **Firmware-focused mode** in Preferences hides every tab except `Firmware` and `Preferences`. If you only use Companion as a flasher, turn it on
- **A splash screen** at startup, and tabs now load lazily — the app opens noticeably faster
- **The log panel** became collapsible and remembers its height; the follow-the-latest-line behaviour was fixed
- **Firmware selection** on the Firmware tab was redrawn: radio-button cards instead of sections separated by "OR"
- **A Report Bug button** in the header links straight to GitHub Issues

---

### 🔹 Fewer first-run headaches

- the default username is `root` (you no longer type it at all)
- sensible default IP and password are filled in on first run
- the default bootloader storage is `nor`
- on Linux the config path was fixed: it is now `LocalApplicationData` rather than a folder next to the binary

---

### 🔹 Important: don't stay on v0.9.0

**v0.9.0** shipped a bug in the uploaded-image upgrade path. Companion uploaded `kernel` and `rootfs` to `/tmp` and ran `sysupgrade` **without the `-z` flag** — so the device still took the "online" route: synchronising time via `ntpd`, checking GitHub for an update to the `sysupgrade` script itself, and only then starting the flash. Hence the delays and failures.

**v0.9.1** (11 April) fixed the command to `sysupgrade --force_ver -n -z --kernel=… --rootfs=…` — `-z` forces the local offline path. The developers [published the post-mortem in the repository](https://github.com/OpenIPC/companion/blob/master/docs/0.9.0-to-0.9.1-sysupgrade-hotfix.md).

---

### 🔹 macOS: the app finally launches

Three releases in a row went to fixing macOS: notarization and stapling were added to CI (v0.9.0), single-file publishing was dropped (v0.9.3), and **v0.9.4** (19 April) added .NET entitlements — without them the signed app simply would not start. If you tried Companion on a Mac before and it silently refused to open, get v0.9.4.

---

### 🔹 Other changes

- **v0.8.0**: added the [Greg APFPV](/en/software/apfpv-greg) firmware source; added **88x2cu** to the Wi-Fi card detector; preset sync is disabled by default; the update-check URL was hardened
- **Presets**: the `Presets` tab was hidden back in January (v0.7.15) — the mechanism is being redesigned, so current builds cannot apply a preset from the app. The `preset-config.yaml` format and the [fpv-presets](https://github.com/OpenIPC/fpv-presets) repository are still there
- **Mobile builds**: Android remains alpha — it can hang when working through a tunnel on Radxa; iOS is in progress

---

### 🔹 Documentation

We put together a full guide to the app:

- [**Companion — the official OpenIPC configurator**](/en/configuration/companion) — installation on Windows/macOS/Linux, connecting, the tabs, presets, firmware backup and restore, log paths and troubleshooting

> **Repository:** [github.com/OpenIPC/companion](https://github.com/OpenIPC/companion) · [releases](https://github.com/OpenIPC/companion/releases) · [demo on YouTube](https://www.youtube.com/watch?v=iJXXMcnOC7w)

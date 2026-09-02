---
title: "On-board QR scanning on a Waybeam camera"
description: "An OpenIPC camera reads a QR marker out of its own frame: the Waybeam marker format, the /api/v1/qr/* endpoints, generating markers, the pixels-per-module budget, and why the pairing logic is not implemented yet."
---

# On-board QR scanning

The camera can read a QR marker out of its own frame — no workstation in the loop. You hold a marker up to the lens, and the camera returns its contents over HTTP.

::: info Where this works
**Star6E** only (Infinity6E). On Maruko `/api/v1/qr/*` returns `404`; there is no QR on CV610. This reference is verified against version **v0.73.3**.
:::

---

### ⚠️ Most important: pairing is NOT implemented yet

This is easy to misread, so up front.

Waybeam ships **only the transport layer**: the marker geometry, envelope validation and decoding. It hands you 16 characters and **stops there**. Quoting the tool's own README:

> It does not interpret, authorize, persist, or execute that payload.

The `P` and `C` envelope prefixes **reserve** transport types for future pairing/passphrase and command/settings logic respectively. But their meanings and the structure of the remaining 15 characters are **deliberately not implemented**. Pairing, commands, boot scheduling and action dispatch are deliberately kept **outside the waybeam binary**, in a separate work package (a shell/action layer) that exists neither in the repository nor in the release yet.

::: tip What this means in practice
"QR pairing" today means **you** decide, on top of `/api/v1/qr/status`, what those 16 characters mean, and you perform the action yourself. Waybeam gives you a reliable "lens to HTTP" channel, nothing more.
:::

---

### Marker format

Only a locked envelope is accepted:

```text
PXXXXXXXXXXXXXXX
```

| Property | Value |
| :--- | :--- |
| QR version | **1** (21 × 21 modules) |
| Error correction | **Q** |
| Mode | alphanumeric |
| Length | exactly **16** characters |
| Alphabet | `0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ` and `` $%*+-./:`` |
| First character | type: **`P`** or **`C`** |
| Remaining 15 | **opaque** to the decoder |

<strong>The outer frame is mandatory</strong>

A standards-compliant but **unframed** QR is deliberately ignored:

```text
33 × 33 marker units total
2-module continuous black outer frame
4-module white quiet zone inside the frame
21 × 21 Version-1 QR at marker coordinate (6, 6)
```

This is not a quirk. The connected border supplies four stable projective corners from which the decoder maps the QR grid **directly** — which is why unbounded finder-pattern discovery **never runs** in the production decoder. It is both cheaper and it makes the transport marker unambiguous: a random QR in frame will not be taken for a command.

::: details Why this works better — measured
Bench: 768 generated 1280×720 symbols — four captured marker widths (180–500 px), compressed-edge ratios from 1.00 down to 0.35, three rotations, four perspective directions, four defocus levels.

```text
outer frame identified:  768/768  (100.0%)
framed payload decoded:  709/768  ( 92.3%)
stock payload decoded:   506/768  ( 65.9%)
```

Framed decode stayed at **100%** at edge ratios 1.00 and 0.70. It reached 77.1% at the harshest 0.35 ratio, and 81.2% at the strongest defocus level. The remaining misses occur **after** successful frame identification: where blur and projection compress the QR modules below the recoverable pixel budget.

The same 768-image series was run **natively on the SSC338Q bench** — the counts were identical.
:::

---

### The pixels-per-module budget

The most common cause of "it won't read":

| Scenario | Needed |
| :--- | :--- |
| Lab minimum | ~**3 px** per module |
| Real camera target | **4 px** per module |

That budget is spent against the **MJPEG channel's** resolution, because that is what the decoder reads: `snapshot.width` / `snapshot.height` (`0` = inherit the main stream). So to decode markers **from further away, size the channel up** — don't just print a bigger marker.

JPEG q80 luma decodes reliably: `qr_decode` extracts the luma plane directly, and its own tiling passes cover small codes anywhere in the frame.

---

### Generating markers

```bash
python3 -m pip install -r tools/qr/requirements-generator.txt

# Vector SVG
python3 tools/qr/generate_qr.py P23456789ABCDEFG waybeam-pair.svg

# Two-color PNG, 30 pixels per marker unit
python3 tools/qr/generate_qr.py CRES1080P60A0030 command.png --scale 30

# PGM for the bench
python3 tools/qr/generate_qr.py P23456789ABCDEFG bench.pgm --scale 6
```

The generator **locks** the QR metadata and outer-frame geometry itself, and accepts only a valid 16-character `P`/`C` envelope. The generated image includes four white presentation units outside the 33×33 marker so the connected black border does not touch the image edge.

::: warning Render with integer scaling and no interpolation
Any smoothing blurs the module edges — exactly what the decoder will not forgive at the edge of the budget.
:::

---

### HTTP API

<strong>GET /api/v1/qr/scan[?ms=N]</strong>

Opens a scan window — or **extends** one already running. `ms` defaults to `qr.windowMs`, clamped to 1000–60000.

A supervisor thread owns the window: it opens port1, sends each fresh frame to the helper until the deadline, and closes the port on the way out — so a client that dies mid-scan **cannot strand port1**. A successful decode ends the window early: the point of a window is to find one code.

```bash
curl "http://<ip>/api/v1/qr/scan?ms=10000"
```

```json
{"ok": true, "data": {"scanning": true, "window_ms": 10000,
                      "remaining_ms": 9999, "capture": "1080x1080"}}
```

| Error | Cause |
| :--- | :--- |
| `409 port1_busy` | Stabilization or the detector holds port1. Reported immediately, **never queued** |
| `503 tap_disabled` | `qr.tapEnabled` is off, or the pipeline is not running |
| `500 scan_failed` | The SCL would not drive the configured geometry. The port is enabled, then verified to deliver a frame within 1 s; if it does not, port1 is released rather than held for a window that can never capture |

Extending a window **never touches port state** — and that matters: re-opening port1 per request is what wedged the retired `/api/v1/snapshot.pgm`.

<strong>GET /api/v1/qr/stop</strong>

Ends the window and hands port1 back. Blocks until the port is actually released. Idempotent.

::: danger The path is `/api/v1/qr/stop`, NOT `/api/v1/qr/scan/stop`
The router matches on prefix and accepts a `/` continuation, so a nested path would be swallowed by the `/qr/scan` route.
:::

This *requests* a close rather than forcing one:

- the port is held for a minimum of **750 ms** after it comes up — disabling one that only just opened, while the SCL still has buffers in flight, **panics the kernel** (the same failure that retired `snapshot.pgm`)
- a further **500 ms** floor applies between two opens

Together these cap the port-cycle rate no matter how fast a client loops. A stop issued against a window older than 750 ms returns immediately; against a brand-new one it waits out the remainder.

<strong>GET /api/v1/qr/status</strong>

Poll a window without disturbing it.

```json
{
  "ok": true,
  "data": {
    "armed": true,
    "scanning": false,
    "window_ms": 15000,
    "remaining_ms": 0,
    "capture": "1080x1080",
    "frames": 3,
    "grabs": 1,
    "port1_owner": "",
    "decode": {
      "attempts": 1,
      "decoded": true,
      "payload": "P23456789ABCDEFG",
      "stage": "qr_decode",
      "decode_ms": 84,
      "last_ms": 84
    }
  }
}
```

- `frames` / `grabs` — buffers drained, and buffers actually copied out, this window. Reset when a window **opens**, not when one is extended
- `port1_owner` — `""`, `"qr"`, `"stab"` or `"detect"`
- the `decode` block **survives the window closing** and is cleared only by the next `/qr/scan`, so a client polling at 1 Hz still sees the payload from a window that found its code and shut down between two polls

`payload` is a Waybeam envelope: exactly 16 characters from the QR alphanumeric alphabet. Nothing in that set needs JSON escaping; anything outside it is scrubbed to `?` before serialization.

<strong>GET /api/v1/qr/tap.pgm</strong> — one frame of the tap as a binary P5 PGM (self-describing dimensions), for diagnostics.

---

### Configuration fields

| Field | Description |
| :--- | :--- |
| `qr.tapEnabled` | Enable the **overlay-free** luma tap |
| `qr.tapWidth` / `tapHeight` | Tap resolution; `0` — follow the snapshot resolution |
| `qr.windowMs` | Default window length (**live**: the next scan picks up the new value) |

The tap is deliberately overlay-free: an OSD over the marker would break recognition.

---

### Checking by hand

```bash
# Straight from the camera, without opening a scan window
curl -s http://127.0.0.1/api/v1/snapshot.jpg | qr_decode

# Diagnostics: which passes fired and how long each took
qr_decode --stats capture.jpg

# Polling with no action dispatch — just prints valid envelopes
qr_watch.sh -c -v
```

This needs `snapshot.enabled: true`. `qr_watch.sh` reports HTTP `503` when snapshots are disabled; it exits after the first decode by default, and `-c` streams continuously. The minimum spacing between capture starts is 0.5 s (lower values are clamped).

`--stats` keeps stdout **payload-only** and writes structured diagnostics to stderr: every applied pass and region, time spent preparing, identifying the frame and decoding, candidate counts, and where processing stopped.

---

### Limitations

::: danger QR is the lowest-priority port1 claimant
port1 is single-owner and shared between **stabilization**, the **detector** and **QR**. A scan is mutually exclusive with both, and QR loses to both: `star6e_vpe_port1_claim("qr")` runs after both have had their turn, and a refusal is logged and **non-fatal**.

Having QR displace stab or detect automatically is **deliberately not implemented** — it would mean restructuring two working, wedge-prone subsystems. Operators turn them off to free port1.
:::

- Star6E only; Maruko answers `404` and the `qr.*` fields report `supported: false`
- pairing/commands are not implemented (see the top of this page)

---

### History

::: details For versions before v0.60 — the `/api/v1/snapshot.pgm` endpoint <Badge type="danger" text="REMOVED" />
The QR decoder used to consume a grayscale PGM snapshot at `/api/v1/snapshot.pgm`. **v0.60.0 removed it — it now returns `404`**, and this was not housekeeping: its per-request VPE/SCL tap **could wedge the SoC**. Device-verified: `DisablePort … mhal not return buffer` → an `EnsureInputPortFifoEmpty` storm.

The MJPEG channel has no such cycle: it is created once at pipeline start and pulse-encoded per capture, so rapid back-to-back captures are safe.

QR now consumes the ordinary `/api/v1/snapshot.jpg`, and `qr_decode` reads JPEG **natively** (vendored `stb_image`, luma only) and is built with `-O3` — 1.66× faster end-to-end. The error codes `bad_crop`, `bad_max_dim`, `snapshot_gray_busy` and `snapshot_gray_unsupported` went with it.
:::

::: details Star6E performance — and the size tradeoff
The final build is size-optimized (`-Os`, per-function/data sections, linker garbage collection): **30,288 bytes** on Star6E, against 63,052 for the earlier `-O3` build.

The tradeoff is measured: on an SSC338Q the final `-Os` binary decoded a saved hard 1280×720 fisheye capture through `lens-blur/full/refine` in a **425 ms** mean over 20 runs (404 ms minimum, 472 ms maximum). The previous 63 KB build averaged 257 ms on the same capture.

The smaller build still fits the watcher's 0.5-second minimum start cadence for successful hard captures. Changing the optimization level **does not alter** samples, thresholds, candidates, scan coverage, or the same 768-case recognition counts.
:::

---

### Next

- [**Web panel and HTTP API**](/en/software/waybeam-venc-web-interface) — the remaining endpoints
- [**NPU object detection**](/en/software/waybeam-detection) — the other claimant on the same tap
- [**Install on the camera**](/en/software/waybeam-venc-install-camera) — where the `qr` section lives in the config
- [**Waybeam overview**](/en/software/waybeam-venc) — the full feature list

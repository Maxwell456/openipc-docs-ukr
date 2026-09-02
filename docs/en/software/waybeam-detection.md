---
title: "NPU object detection in Waybeam"
description: "Object detection on the camera's built-in NPU in OpenIPC: Waybeam's pluggable architecture, the detect config section, the DETECT trailer in the RTP sidecar, OSD boxes, and hot model swap without dropping the video stream."
---

# NPU object detection

Waybeam can run an object detector on the camera's **idle IPU/NPU** and stream the result as per-frame metadata — the boxes travel alongside the video, in the same telemetry, and survive RF loss.

::: info Where this works
Star6E (Infinity6E) and Maruko (Infinity6C). **There is no detection on CV610.** This reference is verified against version **v0.73.3**.
:::

---

### The pluggable architecture — and why it is shaped this way

The key decision: **the model is not part of waybeam**.

| Who owns what | |
| :--- | :--- |
| **The host (waybeam)** | the model-input-size frame tap (NV12, drop-not-block), the reader thread, the config, the result transport |
| **The plugin (`.so`)** | the IPU device, loading the `.img` model, decoding its output, the class table |

The plugin hands the host a plain `DetectBox[]` array — and that is the whole boundary. The consequence: **a new model is a config change, not a waybeam rebuild**. Everything model-specific lives outside the waybeam repository, so you can carry your own models without forking the encoder.

The host publishes a mutex double-buffered snapshot (up to 64 boxes) consumed by both the sidecar and the OSD. The lock is held only for the copy, **never** across an IPU invoke.

::: tip Detection is best-effort — it cannot take down a flight
Any bring-up failure is logged and the stream simply continues without it. That is a deliberate design choice: the video matters more than the boxes.
:::

---

### Where the result goes

<strong>1. The DETECT trailer in the RTP sidecar</strong>

Flag `0x10`, appended **last** among the trailers:

| Part | Contents |
| :--- | :--- |
| Header (16 B) | `model_id`, `schema_ver`, box count, `detect_seq`, payload length, age in ms |
| Body | TLV with BOX records in normalized `u16` |

The trailer is attached to **every** frame while at least one subscriber is present — precisely so the boxes survive RF loss. To make that work, the sidecar send path was rebuilt around a 512-byte datagram buffer with flag-ordered variable trailers.

The sidecar itself is **multi-subscriber** (up to 4 receivers, 5 s TTL per slot), so a box-drawing HUD and an adaptive-link controller listen in parallel without hijacking the feed from each other.

<strong>2. Boxes on the debug OSD</strong>

`detect.osd` (needs `debug.showOsd`): the encode-thread OSD pass scales the published snapshot onto the canvas and draws palette-colored rectangles per class, plus a `det N` row.

Snapshots older than **700 ms are not drawn** — an empty frame beats a box that has fallen behind the picture.

---

### Configuration fields

The `detect` section in `/etc/waybeam.json`:

| Field | Mutability | Description |
| :--- | :--- | :--- |
| `enabled` | **live** | Enable the detector (since v0.53, no restart) |
| `plugin` | restart | Path to the `.so` plugin |
| `modelPath` | **live** | Path to the `.img` model — hot swap |
| `firmwarePath` | restart | NPU firmware |
| `inferInterval` | live | Run inference once every N frames |
| `osd` | live | Draw boxes on the debug OSD |
| `confThresh` | **live** | Confidence threshold. `<=0` — plugin default |
| `nmsIou` | **live** | NMS IoU threshold. `<=0` — plugin default |
| `netWidth` / `netHeight` | restart | Tap geometry for the model |
| `modelId` | live | Class-table selector for the sidecar |

```json
"detect": {
  "enabled": false,
  "plugin": "",
  "modelPath": "",
  "firmwarePath": "",
  "inferInterval": 1,
  "osd": false,
  "confThresh": 0.20,
  "nmsIou": 0.0,
  "netWidth": 640,
  "netHeight": 352,
  "modelId": 0
}
```

::: warning All `detect` fields are append-only at the end of the struct
The config ABI is deliberately extended only at the tail: SigmaStar ISP bin loading breaks if `VencConfig`'s layout shifts. This is a requirement, not a style preference.
:::

---

### Live control

```bash
# Enable / disable the detector without a restart
curl "http://<ip>/api/v1/set?detect.enabled=true"

# Hot model swap — the pipeline is not respawned, the stream does not drop
curl "http://<ip>/api/v1/set?detect.modelPath=/opt/models/sar_person.img"

# Thresholds
curl "http://<ip>/api/v1/set?detect.confThresh=0.20&detect.nmsIou=0.45"
```

The swap runs on the pipeline (encode) thread, so it is **atomic with respect to a frame**. A model whose reported input geometry disagrees with the configured tap is **refused** — and detection stays off rather than running on garbage.

::: tip Set the threshold to ~0.20, not 0.40
This is not "being less strict", it corrects a systematic bias. INT8 quantization costs roughly **30% of the score** compared to FP32 precisely on small objects — and small objects are the target workload. The intended architecture: run the detector at ~`0.20` and let the ground tracker reject noise with its 2-hit confirmation.

Before **v0.51.0** these fields never reached the plugin at all — the host passed zeros, so every backend silently ran its built-in `0.40` / `0.45`.
:::

---

### Tap geometry

`detect.netWidth` / `netHeight` replaced the hardcoded `640×352` — a geometry inherited from someone else's VisDrone model rather than chosen for your sensor. It was the **single largest constraint** on small-object recall.

Constraints:

- both values must be **multiples of 32** (the model head strides 8/16/32)
- both must **match** the compiled `.img` — the backend already rejects a mismatched frame
- the fields are **restart**: tap geometry is fixed when the port is created
- `0` means `640` / `352`

---

### `modelId` — why it cannot be derived

`detect.modelId` puts a class-table selector on the DETECT trailer. Before v0.51.0 it was **hardcoded to VisDrone**, so a one-class SAR-person model announced itself as VisDrone-10 and every box arrived on the ground labelled **"pedestrian"**.

It cannot be derived: the plugin loads whatever `.img` `modelPath` names, and nothing more is known about it. So it is **operator config**.

The host calls the plugin's `describe()` hook at start and **warns** when the reported class count contradicts the configured `modelId`. Unknown ids skip the check — a private `model_id` is legitimate.

---

### Limitations

::: danger Detection and stabilization are mutually exclusive
Both claim the same tap: **VPE port1** on Star6E, **SCL port3** on Maruko. You cannot run `detect` together with `video0.framing=stab`.

The claimant order on port1 is: stabilization first, then the detector, and **last** — QR scanning.
:::

- there is **no detection on CV610** at all
- `netWidth`/`netHeight` require a restart (see above)

---

### History: why this was not live from day one

::: details v0.48–v0.53 — detection was Star6E-only and needed a restart
In the first version (**v0.48.0**) `detect.enabled` was a restart-class field, and on Maruko `/api/v1/set?detect.enabled=...` returned `501`.

Making it live ran into a real defect: after `set?detect.enabled=false` the fresh process **wedged**. The cause turned out to be neither timing nor port state, as it first appeared, but the **inherited `/dev/mi_sys` file descriptor**.

In **v0.53.0** the field became `MUT_LIVE` via a dedicated detector start/stop path, and `iy_unload_graph()` learned to release the port's user output. **v0.54.0** added a state scrub: whatever a predecessor's teardown leaves behind, its successor clears out.

Maruko parity (the detector on SCL port 3, with live enable, model reload and `detect.osd`) landed in API contract **0.15.0**.
:::

::: details v0.52.0 — how the hot model swap was built
Before this, changing a model meant restarting the pipeline: a black frame for the pilot, mid-flight.

v0.52.0 added a detector-only reload entrypoint, and the plugin ABI went to `2` — model geometry is now verified against the tap. The live path is taken only when `netWidth`/`netHeight` match.

Measured: a model change **does not respawn the pipeline, drop frames or break the stream**. Only a genuine model change reloads the graph — `model_id` is just a label stamped into the trailer, and changing it does not touch the graph.
:::

::: details v0.51.1 — hardening against badly behaved plugins
Four defensive fixes that change nothing on the normal path but close what an out-of-contract plugin can deliver:

- **idempotent `libmi_sys` load** — the detector opened the library on every start and never closed it, so each SIGHUP reinit bumped the dlopen refcount unboundedly
- **float→pixel clamp before the cast** — the OSD path clamped only the low side, so a huge / `inf` / `NaN` edge from an out-of-contract plugin hit undefined behaviour
- **NaN-safe wire quantization** — `<=0` / `>=1` guards let `NaN` slip through (all comparisons are false); reordered to `!(x > 0)` so `NaN` maps to 0
- **`ipu_probe` overflow guard** — the tensor element count is checked against multiply overflow before `malloc`
:::

---

### Next

- [**Web panel and HTTP API**](/en/software/waybeam-venc-web-interface) — the remaining endpoints
- [**On-board QR scanning**](/en/software/waybeam-qr) — the other claimant on the same tap
- [**Install on the camera**](/en/software/waybeam-venc-install-camera) — where the `detect` section lives in the config
- [**Waybeam overview**](/en/software/waybeam-venc) — the full feature list

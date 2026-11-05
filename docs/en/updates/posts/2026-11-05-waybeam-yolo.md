---
title: "YOLOv8 on the NPU in Waybeam: detection on the SSC378QE and a custom model guide"
sidebarTitle: YOLO in Waybeam
date: 2026-11-05
description: "Waybeam runs YOLOv8n on the SigmaStar IPU on both the SSC338Q and the SSC378QE (Maruko): 60 fps video plus ~9.5 inferences/s. New guide: how to train your own model, compile it to .img and plug it into Waybeam."
tags:
  - waybeam
  - YOLO
  - YOLOv8
  - NPU
  - object detection
  - SigmaStar
  - SSC338Q
  - SSC378QE
---

# YOLOv8 on the NPU in Waybeam: detection on the SSC378QE and a custom model guide

[Waybeam](/en/software/waybeam-venc) detects objects right on the camera: a **YOLOv8n** model runs on the SigmaStar built-in NPU (IPU) alongside encoding, and the boxes travel to the ground with the video in the RTP sidecar. Since version **0.58.0** this works not only on the SSC338Q (Star6E) but also on the **SSC378QE (Maruko)**.

Step-by-step guide: **[Custom YOLO model for Waybeam](/en/software/waybeam-yolo-training)**.

---

### 🔹 Does detection slow the video down

No. The Waybeam authors measured it on the SSC378QE on 26 July 2026: 2688×1512@60 video, a "person" model at 800×448.

| Mode | Video FPS | Inferences/s | Box age, median / p95 |
| :--- | ---: | ---: | ---: |
| Detection off | 59.7 | 0 | — |
| Detection, `inferInterval=2` | **59.7** | **9.46** | 51 / 94 ms |

With detection on, the video stays at the same 60 fps, and CPU load is even slightly lower: ~23–24% against ~26%. On Star6E the same model gives 9–10 inferences/s next to 90 fps video.

On Maruko the default interval is 2: feeding the detector every frame makes the tap hold the SCL buffer while the IPU reads it, and both video (down to 38 fps) and detector (down to 6.9/s) suffer.

---

### 🔹 The model is config, not firmware

Waybeam does not contain a model. The decoder is loaded as a `.so` plugin against the open ABI 3 contract, and the model is a path in `detect.modelPath`. So:

- the model can be **swapped live** over the HTTP API without breaking the video stream;
- the `confThresh` / `nmsIou` thresholds change without rebuilding the NPU graph;
- if the plugin or model does not fit, Waybeam keeps streaming without boxes.

On cameras with little flash the model is stored compressed in `/root/models/*.img.xz`, and the init script inflates it into `/tmp`.

---

### 🔹 What the guide covers

- building a dataset from the camera's own DVR recordings;
- training YOLOv8n in Ultralytics for a rectangular 800×448 input;
- exporting to ONNX and compiling to `.img` for I6E or I6C with the SigmaStar IPU SDK, with NV12 input and INT8 calibration;
- checking the model on the camera with `ipu_probe`;
- a skeleton for your own ABI 3 plugin;
- config, deployment, live tuning and common errors.

::: warning What you will have to find separately
The Waybeam authors' ready plugins and training pipeline are private, and the SigmaStar IPU SDK is not published. The guide shows what happens at each step and where to get the open parts.
:::

---

- [**Custom YOLO model for Waybeam**](/en/software/waybeam-yolo-training)
- [**NPU object detection**](/en/software/waybeam-detection): the `detect` section reference
- [**AI Dual Camera**](/en/software/dual-camera): a ready build with YOLOv8n on the SSC338Q

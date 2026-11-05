---
title: "Custom YOLO model for Waybeam: training and integration"
description: "How to train YOLOv8n for an FPV task, turn it into an .img for the SigmaStar IPU (SSC338Q / SSC378QE) and plug it into the Waybeam detector: input geometry, INT8 calibration, the ABI 3 plugin, deployment on the camera and live model swap."
---

# Custom YOLO model for Waybeam

The [Waybeam](/en/software/waybeam-detection) detector is not tied to one model. The host only feeds frames to the IPU and publishes boxes; the model and its decoder are loaded from config. This page covers the whole path from dataset to boxes in the RTP sidecar.

::: warning What is open and what is not
- **Open:** the Waybeam host ([OpenIPC/waybeam](https://github.com/OpenIPC/waybeam)), the plugin contract `include/detect_plugin.h`, and the model check tool `tools/ipu_probe.c`.
- **Closed:** the Waybeam authors' prebuilt decoder plugins and training pipeline live in a separate private repository and ship as built `.so` files. They are not in the Waybeam releases.
- **Vendor:** the IPU model compiler (SigmaStar IPU SDK) is not published; you get it through SigmaStar or your board vendor.

So the training steps below are standard Ultralytics, while the conversion step depends on the SDK version you have.
:::

::: info What about the files from the AI Dual Camera archive?
The [AI Dual Camera archive](/en/software/dual-camera) contains `mi_ipu.ko`, `ipu_firmware.bin`, `libipu_yolo_worker.so` and the `yolov8n352drone.img` model. **They are no use for training**: the `.img` is already compiled and quantized and cannot be turned back into `.pt` or ONNX, so a new model is trained from `yolov8n.pt`. You will need them later: the IPU driver and firmware are required to run your model on the camera (steps 5 and 7), and `libipu_yolo_worker.so` is a decoder for that particular 352px model.
:::

---

### The whole chain

| # | Step | Input | Output | Where |
| :---: | :--- | :--- | :--- | :--- |
| 1 | Dataset | camera frames, labels | YOLO dataset | PC |
| 2 | Training | `yolov8n.pt` or a VisDrone model | `best.pt` | PC with a GPU |
| 3 | Export | `best.pt` | `best.onnx` | PC |
| 4 | Compilation | ONNX + calibration frames | `.img` for I6E or I6C | SigmaStar IPU SDK |
| 5 | Check | `.img` + `ipu_firmware.bin` | tensor description, test inference | camera, `ipu_probe` |
| 6 | Plugin | `.img` | `.so` with a decoder for ABI 3 | cross-compiler |
| 7 | Deployment | `.so` + `.img` | boxes in the sidecar and on the OSD | camera, `/etc/waybeam.json` |
| 8 | Tuning | running detector | thresholds and interval | camera, HTTP API |

---

### Pick the geometry first

The model input size is set once and carries through every step: training, export, `.img` compilation and the `detect.netWidth` / `netHeight` fields.

- both dimensions are **multiples of 32** (YOLOv8 head strides: 8 / 16 / 32);
- the aspect ratio is close to 16:9 so the tap does not distort the frame;
- the Waybeam authors' standard geometry is **800×448**. The config default of `640×352` is left over from an old VisDrone model.

::: tip The model is compiled for a specific chip
An `.img` for **Star6E (I6E, SSC338Q)** will not run on **Maruko (I6C, SSC378QE)** and vice versa. If you fly both, build two files from the same `best.onnx`.
:::

---

### Step 1. Dataset

A drone detector sees small objects from above, so a COCO-trained model does poorly. Collect frames in real flight conditions:

- **recordings from the camera itself.** Enable recording in Waybeam and cut frames from the DVR: the sensor, ISP and compression match what the detector sees in flight;
- **open drone datasets** (e.g. VisDrone) as a base, mixed with your own frames;
- **empty frames** (fields, forest, roads with no targets) with no labels, about 10% of the dataset: they teach the model to stay quiet.

Labels in YOLO format (`class cx cy w h`, normalized 0..1), layout:

```text
dataset/
  images/train/  images/val/
  labels/train/  labels/val/
  data.yaml
```

```yaml
# data.yaml — single-class person search model
path: dataset
train: images/train
val: images/val
names:
  0: person
```

Keep the class count as low as possible. A single-class "person" model has its own `modelId=1` in Waybeam, so boxes are labelled correctly on the ground without extra tables.

---

### Step 2. Training

#### Base model

Training always starts from existing weights, not from scratch. For a drone the best base is a model already trained on **VisDrone**: it knows the top-down view and the 10 classes Waybeam labels with `modelId=0`:

`pedestrian`, `people`, `bicycle`, `car`, `van`, `truck`, `tricycle`, `awning-tricycle`, `bus`, `motor`

| Base | Classes | Quality (mAP50) | When to use |
| :--- | :--- | :--- | :--- |
| `yolov8n.pt` + `VisDrone.yaml` | 10, Waybeam order | up to you | **recommended**: full control over input size |
| [mshamrai/yolov8n-visdrone](https://huggingface.co/mshamrai/yolov8n-visdrone) | 10, Waybeam order | 0.34 | quick start for fine-tuning on your own frames |
| [dronefreak/visdrone-yolov8n](https://huggingface.co/dronefreak/visdrone-yolov8n) | 11 (extra `others`) | 0.40 | **ready model**: most accurate, usable without training (see below) |

The **`VisDrone.yaml`** dataset is built into Ultralytics: on first run it downloads VisDrone2019-DET (about 2.3 GB, 6,471 training frames) and converts the labels. Its class order matches the Waybeam table, so the model works with `modelId=0` as is.

#### Ready model: dronefreak/visdrone-yolov8n

If you have no dataset of your own yet, you can skip steps 1–2 and take the ready [dronefreak/visdrone-yolov8n](https://huggingface.co/dronefreak/visdrone-yolov8n) model. It is YOLOv8n fine-tuned on VisDrone-DET as part of the [DetectionBench](https://github.com/dronefreak/DetectionBench) benchmark: 3.2M parameters, 39.7% mAP50 and 23.0% mAP50-95 on the test split.

| Class | mAP50 | Class | mAP50 |
| :--- | ---: | :--- | ---: |
| car | 79.0 | tricycle | 25.4 |
| bus | 60.1 | people | 23.6 |
| truck | 45.6 | awning-tricycle | 22.3 |
| van | 44.7 | bicycle | 17.6 |
| motor | 40.4 | others | 0.0 |
| pedestrian | 38.3 | | |

The model sees vehicles well and people and bicycles noticeably worse: they are the smallest objects in drone footage.

Download and check on the PC:

```bash
pip install ultralytics huggingface_hub
huggingface-cli download dronefreak/visdrone-yolov8n best.pt --local-dir dronefreak

# run it on a frame from your camera with the same size and threshold as on board
yolo detect predict model=dronefreak/best.pt source=frame.jpg imgsz=800 conf=0.20
```

If the result suits you, go straight to [step 3](#step-3-export) with this file:

```bash
yolo export model=dronefreak/best.pt format=onnx imgsz=448,800 opset=13 simplify=True dynamic=False
```

Keep in mind:

- **11 classes instead of 10.** The first 10 follow the Waybeam order, so `modelId=0` labels them correctly. The 11th, `others`, is empty in the training data and never fires. But the model output is one class wider (`1×15×K` instead of `1×14×K`), and the plugin has to know that. If the plugin's `describe()` returns 11 names, Waybeam warns at startup about the mismatch with `modelId=0`; it does not stop it working;
- **trained at 1280.** At an 800×448 input small objects get even smaller, and accuracy drops below the table figures. The best result comes from fine-tuning at 800: option B below with `model=dronefreak/best.pt` and 20–30 epochs;
- **AGPL-3.0 license.**

::: tip Single-class model
If you only search for people, fine-tune a VisDrone model on your own dataset with a single `person` class (`modelId=1`). The model keeps its top-down view, and the NPU spends no time on unused classes.
:::

#### Running it

You need Python 3.10+, a CUDA GPU and [Ultralytics](https://docs.ultralytics.com/):

```bash
pip install ultralytics

# option A: 10 VisDrone classes, starting from yolov8n.pt
yolo detect train \
  model=yolov8n.pt data=VisDrone.yaml \
  imgsz=800 rect=True epochs=100 batch=16 \
  name=wb_visdrone_800x448

# option B: fine-tune a ready VisDrone model on your own dataset
huggingface-cli download mshamrai/yolov8n-visdrone best.pt --local-dir base
yolo detect train \
  model=base/best.pt data=dataset/data.yaml \
  imgsz=800 rect=True epochs=50 batch=16 \
  name=wb_person_800x448
```

- **`yolov8n`** is the smallest model in the family. The IPU runs it at about 9–10 inferences/s at 800×448, so `s` and larger are not worth the lost rate;
- **`imgsz=800 rect=True`** trains on rectangular frames, closer to what the tap delivers.

Output: `runs/detect/<name>/weights/best.pt`.

::: info License
Ultralytics YOLOv8 and both `dronefreak` models are AGPL-3.0, `mshamrai` is OpenRAIL. That is no restriction for private use, but check the terms for a commercial product.
:::

---

### Step 3. Export

```bash
yolo export \
  model=runs/detect/wb_person_800x448/weights/best.pt \
  format=onnx imgsz=448,800 opset=13 simplify=True dynamic=False
```

`imgsz` here is **height, width**. The size must be fixed (`dynamic=False`): the IPU compiler does not accept dynamic axes.

::: info Where the output is decoded
The standard YOLOv8 export keeps DFL decoding in the graph and concatenates all outputs into a single `1×(4+N)×K` tensor. The Waybeam plugin decodes the output on the CPU itself (dequantization, thresholds, NMS), so the output shape has to match what your plugin expects. If you write the plugin yourself, keeping the standard output is simplest. If you use a ready plugin, ask its author which head it expects and inspect the tensors with `ipu_probe` (step 5).
:::

---

### Step 4. Compilation

Compilation has three stages: ONNX → floating-point `float.sim` → INT8-quantized `fixed.sim` → offline `.img` image. Script names and flags differ between SDK versions, so check the commands against your SDK's documentation. An example for a typical `SGS_IPU_SDK` layout:

```ini
; input_config.ini
[INPUT_CONFIG]
inputs=images;
training_input_formats=RGB;
input_formats=YUV_NV12;
quantizations=TRUE;
mean_red=0;
mean_green=0;
mean_blue=0;
std_value=255;

[OUTPUT_CONFIG]
outputs=output0;
dequantizations=FALSE;
```

```bash
cd SGS_IPU_SDK && source cfg_env.sh

# ONNX -> float.sim
python3 Scripts/ConvertTool/ConvertTool.py onnx \
  --model_file best.onnx --input_shapes 1,3,448,800 \
  --input_config input_config.ini --output_file wb_person_float.sim

# float.sim -> fixed.sim (INT8, calibrated on real frames)
python3 Scripts/calibrator/calibrator.py \
  -i calib_images/ -m wb_person_float.sim \
  --input_config input_config.ini -n preprocess.py -c Detection

# fixed.sim -> offline image for the IPU
python3 Scripts/calibrator/compiler.py -m wb_person_fixed.sim -c Detection
```

What matters in `input_config.ini`:

- **`input_formats=YUV_NV12`**: Waybeam feeds raw NV12 from the VPE/SCL tap to the IPU with zero copies. The IPU does the color conversion and `/255` normalization itself, hence `training_input_formats=RGB`, zero means and `std_value=255`, as in YOLOv8 training;
- **`dequantizations=FALSE`**: the output stays integer and the plugin dequantizes it with `real = (q − zero_point) × scale`. Less work for the IPU;
- **`calib_images/`**: 100–300 frames **from your camera and your scenario**, not from COCO. They decide how well INT8 keeps small objects.

Name the result so the size and chip are visible, as the authors do: `yolov8n_448x800_ped_e20_i6c.img`.

::: tip Why the threshold ends up at 0.20
INT8 quantization eats about **30% of the score** on small objects compared to FP32. A model that confidently gives 0.4 on the PC will give about 0.25 on the camera. That is why the recommended `confThresh` in Waybeam is **0.20**, with noise filtered by the ground tracker.
:::

---

### Step 5. Check

The Waybeam repository has `ipu_probe`, a tool that loads a model onto the IPU, prints the input and output tensors (shape, format, `scalar`, `zero_point`) and runs one test inference:

```bash
# on the PC, in a clone of OpenIPC/waybeam
make ipu-probe
scp out/star6e/ipu_probe root@<camera-ip>:/tmp/

# on the camera
/tmp/ipu_probe /config/dla/ipu_firmware.bin /root/models/wb_person_448x800_i6e.img /tmp/frame.nv12
```

`frame.nv12` is a raw 800×448 NV12 frame (`800 × 448 × 1.5` = 537,600 bytes). Check that:

- there is one input, format `NV12`, shape 448×800;
- the output shape matches what you expect (for the standard head with one class: `1×5×K`);
- the dequantized values make sense rather than being zeros or saturated.

::: info
The `make ipu-probe` target builds for Star6E. For I6C you need the matching `libmi_ipu.so` and the `sdk/ssc338q/include/i6c_ipu.h` headers.
:::

---

### Step 6. Plugin

Waybeam loads the detector with `dlopen()` from the file named in `detect.plugin`. There are two ways:

1. **A ready plugin** from the Waybeam authors. Works if your model has the same head and geometry as theirs; then only `modelPath` changes.
2. **Your own plugin** against the open `include/detect_plugin.h` contract. Needed if the classes, head or decoding changed.

The ABI 3 contract: the plugin exports one function, `waybeam_detect_entry`, which returns a static function table. The host requires an **exact** ABI version match.

```c
#include "detect_plugin.h"

static const char *const k_names[] = { "person" };
static uint32_t g_w, g_h;

static int my_init(const DetectBackendConfig *cfg)
{
	/* MI_IPU: CreateDevice(firmware_path) + CreateChannel(model_path),
	 * GetInOutTensorDesc; store the real input size in g_w/g_h.
	 * Call order as in tools/ipu_probe.c. */
	return 0;
}

static int my_process(const DetectFrame *f, DetectBox *out, int max, int *n)
{
	/* f->phy_y / f->phy_uv are NV12 physical addresses the IPU reads directly.
	 * Invoke -> dequantize (detect_dequant.c) -> thresholds -> NMS ->
	 * boxes in model-input pixels, corner form x1,y1,x2,y2. */
	*n = 0;
	return 0;
}

static int my_dims(uint32_t *w, uint32_t *h) { *w = g_w; *h = g_h; return 0; }
static int my_describe(const char *const **names) { *names = k_names; return 1; }
static void my_display(int w, int h) { (void)w; (void)h; }
static void my_thresh(float conf, float iou) { /* update thresholds without reloading */ }
static void my_deinit(void) { /* DestroyChannel + DestroyDevice */ }

static const DetectBackend k_backend = {
	.name = "my-yolov8n-person",
	.abi = DETECT_PLUGIN_ABI,          /* 3 */
	.init = my_init,
	.process = my_process,
	.set_display = my_display,
	.deinit = my_deinit,
	.describe = my_describe,
	.model_dims = my_dims,             /* required */
	.set_thresholds = my_thresh,       /* optional */
};

const DetectBackend *waybeam_detect_entry(void) { return &k_backend; }
```

Rules the host enforces:

- **`model_dims()` returns the `.img`'s real input**, not the config values. If it does not match `netWidth` / `netHeight`, detection is turned off;
- **boxes** are in model-input pixels (`float`), corner form, up to 64 per frame; `score` is already past the sigmoid;
- **`describe()`** returns the class names. The host warns if their count disagrees with `modelId`;
- **`set_thresholds()`** lets `confThresh` / `nmsIou` change live without rebuilding the graph. Without it every threshold change reloads the model.

Build the plugin with the same cross toolchain as Waybeam, as `-shared -fPIC`, and link against `libmi_ipu.so` (or load it with `dlopen`, as the host does).

---

### Step 7. Deployment

Copy the files. The `mi_ipu.ko` driver and `ipu_firmware.bin` for the SSC338Q are in the [AI Dual Camera](/en/software/dual-camera) archive; the driver must be loaded (`insmod`) before Waybeam starts.

```bash
scp ipu_firmware.bin root@<ip>:/config/dla/
scp libwb_detect_person.so root@<ip>:/usr/lib/
scp yolov8n_448x800_person_i6c.img root@<ip>:/root/models/
```

The `detect` section in `/etc/waybeam.json`:

```json
"detect": {
  "enabled": true,
  "plugin": "/usr/lib/libwb_detect_person.so",
  "modelPath": "/root/models/yolov8n_448x800_person_i6c.img",
  "firmwarePath": "/config/dla/ipu_firmware.bin",
  "inferInterval": 2,
  "osd": false,
  "confThresh": 0.20,
  "nmsIou": 0.45,
  "netWidth": 800,
  "netHeight": 448,
  "modelId": 1
}
```

- **`modelId`**: `0` for VisDrone-10 classes, `1` for the single `person` class. A custom class set gets its own number, and the ground station has to know its table;
- **`inferInterval`**: use **2** on Maruko (see below); 1 is fine on Star6E;
- **`netWidth` / `netHeight`** only change with a restart.

Detection cannot break the video: if the plugin, model or ABI does not fit, Waybeam logs the error and keeps streaming without boxes.

#### Low flash (Maruko)

An SSC378QE with 5–6 MB of free overlay has no room for both the model and its copy. Store it compressed and point the config at `/tmp`:

```bash
xz -9 -k yolov8n_448x800_person_i6c.img
scp yolov8n_448x800_person_i6c.img.xz root@<ip>:/root/models/
```

```json
"modelPath": "/tmp/yolov8n_448x800_person_i6c.img"
```

Before start, `S95waybeam` looks for `/root/models/<same name>.xz` and inflates it into `/tmp`. If inflating fails, the video still starts.

---

### Step 8. Tuning

```bash
# enable, swap model and thresholds without breaking the video
curl "http://<ip>/api/v1/set?detect.enabled=true"
curl "http://<ip>/api/v1/set?detect.modelPath=/root/models/yolov8n_448x800_v2_i6c.img"
curl "http://<ip>/api/v1/set?detect.confThresh=0.20&detect.nmsIou=0.45"

# boxes on the debug OSD (needs debug.showOsd)
curl "http://<ip>/api/v1/set?debug.showOsd=true&detect.osd=true"
```

A new model with a different input geometry will not swap live; the `model_dims()` check rejects it. For that one, change `netWidth` / `netHeight` and restart Waybeam.

Reference numbers from the authors' bench (2026-07-26, SSC378QE, 2688×1512@60, single-class 800×448 model):

| Mode | Video FPS | Inferences/s | Box age, median / p95 | waybeam CPU |
| :--- | ---: | ---: | ---: | ---: |
| Detection off | 59.7 | 0 | — | ~26% |
| `inferInterval=1` | 38.0 | 6.9 | — | ~42% |
| `inferInterval=2` | 59.7 | 9.46 | 51 / 94 ms | ~23–24% |
| Star6E, `inferInterval=1` | 90 | 9–10 | 52 / 96 ms | — |

On Maruko `inferInterval=1` slows both video and detector: the tap holds the SCL buffer while the IPU reads the frame, and the queue backs up. With interval 2 every other frame is released at once, so video stays at 60 fps and the IPU runs at its limit of ~9–10 inferences/s.

---

### Common problems

| Symptom | Cause |
| :--- | :--- |
| `ABI mismatch`, detection off | the plugin was built against a different `detect_plugin.h` version |
| Model rejected over geometry | the `.img` was compiled for a size other than `netWidth` / `netHeight` |
| Model does not load on Maruko | the `.img` was built for I6E, not I6C |
| `fail to get IPU MMA heap name` in your own tool | no private IPU memory pool allocated (see `tools/ipu_probe.c`) |
| No boxes, `object_count=0` | threshold too high after INT8; try `confThresh=0.15–0.20`, recalibrate on your own frames |
| Boxes labelled "pedestrian" | `modelId=0` (VisDrone) on a single-class model; set it to `1` |
| Detection will not start alongside stabilization | both use the same tap; turn off `video0.framing=stab` |

---

### Next

- [**NPU object detection**](/en/software/waybeam-detection): all `detect` fields, the DETECT trailer and the feature's history
- [**AI Dual Camera**](/en/software/dual-camera): a ready build with YOLOv8n on the SSC338Q
- [**Web panel and HTTP API**](/en/software/waybeam-venc-web-interface): the remaining endpoints
- [**Waybeam overview**](/en/software/waybeam-venc)

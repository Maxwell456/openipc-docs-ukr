---
title: "Власна YOLO-модель для Waybeam: навчання та інтеграція"
description: "Як навчити YOLOv8n під FPV-задачу, перетворити її на .img для IPU SigmaStar (SSC338Q / SSC378QE) і підключити до детектора Waybeam: геометрія входу, INT8-калібрування, плагін ABI 3, розгортання на камері й живе перемикання моделі."
---

# Власна YOLO-модель для Waybeam

Детектор [Waybeam](/software/waybeam-detection) не прив'язаний до однієї моделі: хост лише подає кадри на IPU і розсилає рамки, а модель і її декодер підвантажуються з конфіга. Ця сторінка описує весь шлях від датасету до рамок у RTP-sidecar.

::: warning Що відкрите, а що ні
- **Відкрите:** хост Waybeam ([OpenIPC/waybeam](https://github.com/OpenIPC/waybeam)), контракт плагіна `include/detect_plugin.h`, утиліта перевірки моделі `tools/ipu_probe.c`.
- **Закрите:** готові плагіни-декодери і пайплайн навчання авторів Waybeam живуть в окремому приватному репозиторії й поставляються як зібрані `.so`. У релізах Waybeam їх немає.
- **Від вендора:** компілятор моделей під IPU (SigmaStar IPU SDK) не викладено публічно, його отримують через SigmaStar або постачальника плати.

Тож кроки з навчання нижче стандартні для Ultralytics, а крок конвертації залежить від версії SDK, яка у вас на руках.
:::

::: info А готові файли з архіву AI Dual Camera?
В [архіві AI Dual Camera](/software/dual-camera) лежать `mi_ipu.ko`, `ipu_firmware.bin`, `libipu_yolo_worker.so` і модель `yolov8n352drone.img`. **Для навчання вони не підходять**: `.img` уже скомпільований і квантований, назад у `.pt` чи ONNX його не перетворити, тож нову модель вчать від `yolov8n.pt`. Знадобляться вони пізніше: драйвер і прошивка IPU потрібні, щоб запустити вашу модель на камері (кроки 5 і 7), а `libipu_yolo_worker.so` — це декодер саме під ту модель 352px.
:::

---

### Увесь ланцюжок

| # | Крок | Що на вході | Що на виході | Де |
| :---: | :--- | :--- | :--- | :--- |
| 1 | Датасет | кадри з камери, розмітка | YOLO-датасет | ПК |
| 2 | Навчання | `yolov8n.pt` або VisDrone-модель | `best.pt` | ПК з GPU |
| 3 | Експорт | `best.pt` | `best.onnx` | ПК |
| 4 | Компіляція | ONNX + калібрувальні кадри | `.img` під I6E або I6C | SigmaStar IPU SDK |
| 5 | Перевірка | `.img` + `ipu_firmware.bin` | опис тензорів, тестовий інференс | камера, `ipu_probe` |
| 6 | Плагін | `.img` | `.so` з декодером під ABI 3 | крос-компілятор |
| 7 | Розгортання | `.so` + `.img` | рамки в sidecar і на OSD | камера, `/etc/waybeam.json` |
| 8 | Налаштування | працюючий детектор | пороги та інтервал | камера, HTTP API |

---

### Спершу оберіть геометрію

Розмір входу моделі задається один раз і проходить через усі кроки: навчання, експорт, компіляцію `.img` і поля `detect.netWidth` / `netHeight`.

- обидва розміри **кратні 32** (страйди голови YOLOv8: 8 / 16 / 32);
- пропорція близька до 16:9, щоб тап не спотворював кадр;
- стандартна геометрія авторів Waybeam: **800×448**. Значення за замовчуванням у конфігу `640×352` залишилось від старої моделі VisDrone.

::: tip Модель компілюється під конкретний чип
`.img` для **Star6E (I6E, SSC338Q)** не запуститься на **Maruko (I6C, SSC378QE)** і навпаки. Якщо літаєте на обох, збирайте два файли з одного `best.onnx`.
:::

---

### Крок 1. Датасет

Детектор на дроні бачить дрібні об'єкти згори, тож модель, навчена на COCO, працює погано. Збирайте кадри в умовах реального польоту:

- **записи з самої камери.** Увімкніть запис у Waybeam і нарізайте кадри з DVR: сенсор, ISP і стиснення будуть ті самі, що й у польоті;
- **відкриті датасети з дрона** (наприклад VisDrone) як основа, до якої домішуються власні кадри;
- **порожні кадри** (поле, ліс, дороги без цілей) без розмітки, приблизно 10 % датасету: вони вчать модель мовчати.

Розмітка у форматі YOLO (`class cx cy w h`, нормовані 0..1), структура:

```text
dataset/
  images/train/  images/val/
  labels/train/  labels/val/
  data.yaml
```

```yaml
# data.yaml — одноклясова модель пошуку людини
path: dataset
train: images/train
val: images/val
names:
  0: person
```

Тримайте класів якнайменше. Одноклясова модель «person» у Waybeam має окремий `modelId=1`, і на землі рамки підписуються правильно без додаткових таблиць.

---

### Крок 2. Навчання

#### Базова модель

Навчання завжди починають від готових ваг, а не з нуля. Для дрона найкраща основа — модель, уже навчена на **VisDrone**: вона знає вигляд згори і 10 класів, які Waybeam підписує при `modelId=0`:

`pedestrian`, `people`, `bicycle`, `car`, `van`, `truck`, `tricycle`, `awning-tricycle`, `bus`, `motor`

| Основа | Класи | Якість (mAP50) | Коли брати |
| :--- | :--- | :--- | :--- |
| `yolov8n.pt` + `VisDrone.yaml` | 10, порядок Waybeam | залежить від вас | **рекомендовано**: повний контроль над розміром входу |
| [mshamrai/yolov8n-visdrone](https://huggingface.co/mshamrai/yolov8n-visdrone) | 10, порядок Waybeam | 0.34 | швидкий старт для дотренування на своїх кадрах |
| [dronefreak/visdrone-yolov8n](https://huggingface.co/dronefreak/visdrone-yolov8n) | 11 (зайвий `others`) | 0.40 | **готова модель**: найточніша, можна брати без навчання (див. нижче) |

Набір **`VisDrone.yaml`** вбудований в Ultralytics: при першому запуску він сам завантажує VisDrone2019-DET (близько 2.3 ГБ, 6471 кадр для навчання) і конвертує розмітку. Порядок класів у ньому збігається з таблицею Waybeam, тож модель працюватиме з `modelId=0` без змін.

#### Готова модель: dronefreak/visdrone-yolov8n

Якщо власного датасету ще немає, кроки 1–2 можна пропустити й узяти готову модель [dronefreak/visdrone-yolov8n](https://huggingface.co/dronefreak/visdrone-yolov8n). Це YOLOv8n, дотренована на VisDrone-DET у бенчмарку [DetectionBench](https://github.com/dronefreak/DetectionBench): 3.2 млн параметрів, mAP50 39.7 % і mAP50-95 23.0 % на тестовій вибірці.

| Клас | mAP50 | Клас | mAP50 |
| :--- | ---: | :--- | ---: |
| car | 79.0 | tricycle | 25.4 |
| bus | 60.1 | people | 23.6 |
| truck | 45.6 | awning-tricycle | 22.3 |
| van | 44.7 | bicycle | 17.6 |
| motor | 40.4 | others | 0.0 |
| pedestrian | 38.3 | | |

Транспорт модель бачить добре, людей і велосипеди помітно гірше: вони на кадрах із дрона найдрібніші.

Завантаження і перевірка на ПК:

```bash
pip install ultralytics huggingface_hub
huggingface-cli download dronefreak/visdrone-yolov8n best.pt --local-dir dronefreak

# прогнати на своєму кадрі з камери з тими самими розміром і порогом, що й на борту
yolo detect predict model=dronefreak/best.pt source=frame.jpg imgsz=800 conf=0.20
```

Якщо результат влаштовує, переходьте одразу до [кроку 3](#крок-3-експорт) з цим файлом:

```bash
yolo export model=dronefreak/best.pt format=onnx imgsz=448,800 opset=13 simplify=True dynamic=False
```

Що врахувати:

- **11 класів замість 10.** Перші 10 ідуть у порядку Waybeam, тож `modelId=0` підписує їх правильно. 11-й `others` у навчальних даних порожній і не спрацьовує. Але вихід моделі на один клас ширший (`1×15×K` замість `1×14×K`), і плагін має про це знати. Якщо `describe()` плагіна поверне 11 імен, Waybeam при старті попередить про розбіжність із `modelId=0`; працювати це не заважає;
- **навчена на 1280.** На вході 800×448 дрібні об'єкти стають ще меншими, і точність падає нижче цифр з таблиці. Найкращий результат дає дотренування на 800: варіант Б нижче з `model=dronefreak/best.pt` і 20–30 епох;
- **ліцензія AGPL-3.0.**

::: tip Одноклясова модель
Якщо шукаєте тільки людей, вчіть від VisDrone-моделі на своєму датасеті з одним класом `person` (`modelId=1`). Модель зберігає «бачення згори», а NPU не витрачає час на зайві класи.
:::

#### Запуск

Потрібен Python 3.10+, GPU з CUDA і [Ultralytics](https://docs.ultralytics.com/):

```bash
pip install ultralytics

# варіант А: 10 класів VisDrone з нуля від yolov8n.pt
yolo detect train \
  model=yolov8n.pt data=VisDrone.yaml \
  imgsz=800 rect=True epochs=100 batch=16 \
  name=wb_visdrone_800x448

# варіант Б: дотренування готової VisDrone-моделі на своєму датасеті
huggingface-cli download mshamrai/yolov8n-visdrone best.pt --local-dir base
yolo detect train \
  model=base/best.pt data=dataset/data.yaml \
  imgsz=800 rect=True epochs=50 batch=16 \
  name=wb_person_800x448
```

- **`yolov8n`** — найменша модель сімейства. IPU дає на ній близько 9–10 інференсів/с при 800×448, тож `s` і більші не варті втраченої частоти;
- **`imgsz=800 rect=True`** — навчання на прямокутних кадрах, ближче до того, що прийде з тапу.

Результат: `runs/detect/<name>/weights/best.pt`.

::: info Ліцензія
Ultralytics YOLOv8 і обидві моделі `dronefreak` поширюються під AGPL-3.0, `mshamrai` — під OpenRAIL. Для приватного використання це не обмеження, а для комерційного продукту перевірте умови.
:::

---

### Крок 3. Експорт

```bash
yolo export \
  model=runs/detect/wb_person_800x448/weights/best.pt \
  format=onnx imgsz=448,800 opset=13 simplify=True dynamic=False
```

`imgsz` тут у порядку **висота, ширина**. Розмір має бути фіксованим (`dynamic=False`): компілятор IPU не приймає динамічні осі.

::: info Де декодувати вихід
Стандартний експорт YOLOv8 зберігає в графі декодування DFL і з'єднує всі виходи в один тензор `1×(4+N)×K`. Плагін Waybeam декодує вихід на CPU сам (деквантизація, пороги, NMS), тож форма виходу має збігатися з тим, що чекає ваш плагін. Якщо пишете плагін самі, простіше залишити стандартний вихід. Якщо берете готовий плагін, дізнайтеся в його автора, яку голову він очікує, і подивіться тензори утилітою `ipu_probe` (крок 5).
:::

---

### Крок 4. Компіляція

Компіляція йде в три етапи: ONNX → плаваюча модель `float.sim` → INT8-квантизована `fixed.sim` → офлайн-образ `.img`. Назви скриптів і ключі відрізняються між версіями SDK, тож звіряйте команди з документацією свого SDK. Приклад для типової структури `SGS_IPU_SDK`:

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

# float.sim -> fixed.sim (INT8, калібрування на реальних кадрах)
python3 Scripts/calibrator/calibrator.py \
  -i calib_images/ -m wb_person_float.sim \
  --input_config input_config.ini -n preprocess.py -c Detection

# fixed.sim -> офлайн-образ для IPU
python3 Scripts/calibrator/compiler.py -m wb_person_fixed.sim -c Detection
```

Ключове в `input_config.ini`:

- **`input_formats=YUV_NV12`** — Waybeam подає на IPU сирий NV12 з тапу VPE/SCL без копіювання. Перетворення кольору і нормалізацію `/255` виконує сам IPU, тому `training_input_formats=RGB`, середні `0`, `std_value=255`, як при навчанні YOLOv8;
- **`dequantizations=FALSE`** — вихід лишається цілочисловим, а плагін деквантизує його за формулою `real = (q − zero_point) × scale`. Так менше роботи на IPU;
- **`calib_images/`** — 100–300 кадрів **з вашої камери й вашого сценарію**, а не з датасету COCO. Від них залежить, наскільки INT8 зберігає дрібні об'єкти.

Назвіть результат так, щоб з імені було видно розмір і чип, як у авторів: `yolov8n_448x800_ped_e20_i6c.img`.

::: tip Чому поріг потім ставлять 0.20
INT8-квантизація з'їдає близько **30 % скору** на дрібних об'єктах порівняно з FP32. Модель, яка на ПК впевнено дає 0.4, на камері дасть приблизно 0.25. Тому в Waybeam рекомендований `confThresh` — **0.20**, а шум відсіює наземний трекер.
:::

---

### Крок 5. Перевірка

У репозиторії Waybeam є `ipu_probe` — утиліта, яка вантажить модель на IPU, друкує вхідні й вихідні тензори (форма, формат, `scalar`, `zero_point`) і робить один тестовий інференс:

```bash
# на ПК, у клоні OpenIPC/waybeam
make ipu-probe
scp out/star6e/ipu_probe root@<ip-камери>:/tmp/

# на камері
/tmp/ipu_probe /config/dla/ipu_firmware.bin /root/models/wb_person_448x800_i6e.img /tmp/frame.nv12
```

`frame.nv12` — сирий кадр 800×448 у NV12 (`800 × 448 × 1.5` = 537 600 байт). Перевірте, що:

- вхід один, формат `NV12`, форма 448×800;
- форма виходу збігається з очікуваною (для стандартної голови з одним класом: `1×5×K`);
- після деквантизації значення осмислені, а не нулі чи насичення.

::: info
Ціль `make ipu-probe` зібрана під Star6E. Для I6C потрібна відповідна `libmi_ipu.so` і заголовки `sdk/ssc338q/include/i6c_ipu.h`.
:::

---

### Крок 6. Плагін

Waybeam завантажує детектор через `dlopen()` з файлу, вказаного в `detect.plugin`. Є два шляхи:

1. **Готовий плагін** від авторів Waybeam. Підходить, якщо ваша модель має ту саму голову і геометрію, що й їхня. Тоді змінюється тільки `modelPath`.
2. **Власний плагін** за відкритим контрактом `include/detect_plugin.h`. Потрібен, якщо змінилися класи, голова або декодування.

Контракт ABI 3: плагін експортує одну функцію `waybeam_detect_entry`, яка повертає статичну таблицю функцій. Хост вимагає **точного** збігу версії ABI.

```c
#include "detect_plugin.h"

static const char *const k_names[] = { "person" };
static uint32_t g_w, g_h;

static int my_init(const DetectBackendConfig *cfg)
{
	/* MI_IPU: CreateDevice(firmware_path) + CreateChannel(model_path),
	 * GetInOutTensorDesc; запам'ятати реальні розміри входу в g_w/g_h.
	 * Порядок викликів — як у tools/ipu_probe.c. */
	return 0;
}

static int my_process(const DetectFrame *f, DetectBox *out, int max, int *n)
{
	/* f->phy_y / f->phy_uv — фізичні адреси NV12, IPU читає їх напряму.
	 * Invoke -> деквантизація (detect_dequant.c) -> пороги -> NMS ->
	 * рамки в пікселях входу моделі, кутова форма x1,y1,x2,y2. */
	*n = 0;
	return 0;
}

static int my_dims(uint32_t *w, uint32_t *h) { *w = g_w; *h = g_h; return 0; }
static int my_describe(const char *const **names) { *names = k_names; return 1; }
static void my_display(int w, int h) { (void)w; (void)h; }
static void my_thresh(float conf, float iou) { /* оновити пороги без перезавантаження */ }
static void my_deinit(void) { /* DestroyChannel + DestroyDevice */ }

static const DetectBackend k_backend = {
	.name = "my-yolov8n-person",
	.abi = DETECT_PLUGIN_ABI,          /* 3 */
	.init = my_init,
	.process = my_process,
	.set_display = my_display,
	.deinit = my_deinit,
	.describe = my_describe,
	.model_dims = my_dims,             /* обов'язковий */
	.set_thresholds = my_thresh,       /* необов'язковий */
};

const DetectBackend *waybeam_detect_entry(void) { return &k_backend; }
```

Правила, які хост перевіряє:

- **`model_dims()` повертає реальний вхід `.img`**, а не значення з конфіга. Якщо він не збігається з `netWidth` / `netHeight`, детекція вимикається;
- **рамки** в пікселях входу моделі (`float`), у кутовій формі, до 64 штук за кадр; `score` уже після sigmoid;
- **`describe()`** повертає імена класів. Хост попередить, якщо їх кількість не збігається з `modelId`;
- **`set_thresholds()`** дає змінювати `confThresh` / `nmsIou` на льоту без перебудови графа. Без нього кожна зміна порогу перезавантажує модель.

Збирайте плагін тим самим крос-тулчейном, що й Waybeam, як `-shared -fPIC`, і лінкуйте з `libmi_ipu.so` (або вантажте її через `dlopen`, як це робить хост).

---

### Крок 7. Розгортання

Скопіюйте файли. Драйвер `mi_ipu.ko` і `ipu_firmware.bin` для SSC338Q є в архіві [AI Dual Camera](/software/dual-camera); драйвер має бути завантажений (`insmod`) до старту Waybeam.

```bash
scp ipu_firmware.bin root@<ip>:/config/dla/
scp libwb_detect_person.so root@<ip>:/usr/lib/
scp yolov8n_448x800_person_i6c.img root@<ip>:/root/models/
```

Секція `detect` у `/etc/waybeam.json`:

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

- **`modelId`** — `0` для класів VisDrone-10, `1` для одного класу `person`. Власний набір класів отримує свій номер, і наземна станція повинна знати його таблицю;
- **`inferInterval`** — на Maruko ставте **2** (див. нижче), на Star6E можна 1;
- **`netWidth` / `netHeight`** змінюються лише з рестартом.

Детекція не може зламати відео: якщо плагін, модель або ABI не підійшли, Waybeam пише помилку в лог і стрімить далі без рамок.

#### Мало флеш-пам'яті (Maruko)

На SSC378QE з 5–6 МБ вільного оверлею немає місця і для моделі, і для її копії. Зберігайте її стиснутою, а в конфігу вказуйте шлях у `/tmp`:

```bash
xz -9 -k yolov8n_448x800_person_i6c.img
scp yolov8n_448x800_person_i6c.img.xz root@<ip>:/root/models/
```

```json
"modelPath": "/tmp/yolov8n_448x800_person_i6c.img"
```

Скрипт `S95waybeam` перед стартом знаходить `/root/models/<те саме ім'я>.xz` і розпаковує його в `/tmp`. Якщо розпакувати не вдалося, відео все одно запускається.

---

### Крок 8. Налаштування

```bash
# увімкнути, змінити модель і пороги без розриву відео
curl "http://<ip>/api/v1/set?detect.enabled=true"
curl "http://<ip>/api/v1/set?detect.modelPath=/root/models/yolov8n_448x800_v2_i6c.img"
curl "http://<ip>/api/v1/set?detect.confThresh=0.20&detect.nmsIou=0.45"

# рамки на debug-OSD (потрібен debug.showOsd)
curl "http://<ip>/api/v1/set?debug.showOsd=true&detect.osd=true"
```

Нова модель з іншою геометрією входу живцем не підміниться, її відхилить перевірка `model_dims()`. Для неї змініть `netWidth` / `netHeight` і перезапустіть Waybeam.

Орієнтири з замірів авторів (2026-07-26, SSC378QE, 2688×1512@60, одноклясова модель 800×448):

| Режим | FPS відео | Інференсів/с | Вік рамок, медіана / p95 | CPU waybeam |
| :--- | ---: | ---: | ---: | ---: |
| Детекція вимкнена | 59.7 | 0 | — | ~26 % |
| `inferInterval=1` | 38.0 | 6.9 | — | ~42 % |
| `inferInterval=2` | 59.7 | 9.46 | 51 / 94 мс | ~23–24 % |
| Star6E, `inferInterval=1` | 90 | 9–10 | 52 / 96 мс | — |

На Maruko `inferInterval=1` гальмує і відео, і детектор: тап тримає буфер SCL, поки IPU читає кадр, і черга забивається. З інтервалом 2 кожен другий кадр звільняється одразу, тому відео лишається 60 fps, а IPU працює на своїй межі в ~9–10 інференсів/с.

---

### Типові проблеми

| Симптом | Причина |
| :--- | :--- |
| `ABI mismatch`, детекція вимкнена | плагін зібраний під іншу версію `detect_plugin.h` |
| Модель відхилено через геометрію | `.img` скомпільовано під інший розмір, ніж `netWidth` / `netHeight` |
| Модель не вантажиться на Maruko | `.img` зібраний під I6E, а не I6C |
| `fail to get IPU MMA heap name` у власній утиліті | не виділено приватний пул пам'яті IPU (див. `tools/ipu_probe.c`) |
| Рамок немає, `object_count=0` | поріг завеликий після INT8; спробуйте `confThresh=0.15–0.20`, перекалібруйте на своїх кадрах |
| Рамки підписані «pedestrian» | `modelId=0` (VisDrone) для одноклясової моделі; поставте `1` |
| Детекція не вмикається разом зі стабілізацією | обидві займають один тап; вимкніть `video0.framing=stab` |

---

### Далі

- [**Детекція об'єктів на NPU**](/software/waybeam-detection) — усі поля `detect`, DETECT-трейлер і історія функції
- [**AI Dual Camera**](/software/dual-camera) — готова збірка з YOLOv8n на SSC338Q
- [**Веб-панель та HTTP API**](/software/waybeam-venc-web-interface) — решта ендпоінтів
- [**Огляд Waybeam**](/software/waybeam-venc)

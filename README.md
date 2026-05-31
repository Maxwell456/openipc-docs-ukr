# OpenFPV — Документація OpenIPC

> Community documentation for OpenIPC FPV systems · Документація спільноти для OpenIPC FPV систем

[![Deploy to GitHub Pages](https://github.com/Maxwell456/openipc-docs-ukr/actions/workflows/deploy.yml/badge.svg)](https://github.com/Maxwell456/openipc-docs-ukr/actions/workflows/deploy.yml)

**Сайт:** [openfpv.com.ua](https://openfpv.com.ua)

Документаційний сайт для OpenIPC FPV систем, написаний на [VitePress](https://vitepress.dev). Підтримує дві мови: 🇺🇦 Українська / 🇬🇧 English.

---

## Передумови

- **Node.js** 18 або новіше
- **npm** 9+

---

## Встановлення

```bash
git clone https://github.com/Maxwell456/openipc-docs-ukr.git
cd openipc-docs-ukr
npm install
```

---

## Розробка

```bash
npm run dev
```

Відкрийте [http://localhost:5173](http://localhost:5173)

Зміни в `.md` файлах та `.vitepress/` відображаються миттєво завдяки hot-reload.

---

## Збірка

```bash
npm run build
```

Зібраний сайт знаходиться у `docs/.vitepress/dist/`.

Для попереднього перегляду зібраного сайту:

```bash
npm run preview
```

---

## Структура проекту

```
├── docs/
│   ├── .vitepress/
│   │   ├── config.mts        # Конфігурація VitePress
│   │   └── theme/
│   │       ├── index.ts      # Точка входу теми
│   │       ├── custom.css    # Стилі
│   │       ├── LangSwitcher.vue
│   │       ├── BackToTop.vue
│   │       └── ReportError.vue
│   ├── public/               # Статичні файли (favicon, og-images, PWA)
│   ├── en/                   # Англійська версія
│   ├── getting-started/      # Швидкий старт (УКР)
│   ├── hardware/             # Обладнання (УКР)
│   ├── software/             # Прошивки (УКР)
│   ├── configuration/        # Конфігурація (УКР)
│   └── index.md              # Головна сторінка
├── .github/
│   └── workflows/
│       └── deploy.yml        # GitHub Pages автодеплой
├── Dockerfile                # Docker production build
├── nginx.conf                # Nginx конфіг для Docker
└── package.json
```

---

## Docker

### Production

```bash
docker build -t openfpv-docs .
docker run -p 80:80 openfpv-docs
```

Сайт доступний на [http://localhost](http://localhost)

### Development (з hot-reload)

```bash
docker run --rm -it \
  -v $(pwd):/app \
  -w /app \
  -p 5173:5173 \
  node:20-alpine \
  sh -c "npm ci && npm run dev -- --host"
```

---

## Деплой

Сайт автоматично деплоїться на GitHub Pages при кожному push до гілки `main`.

**Ручний деплой:** GitHub → Actions → Deploy to GitHub Pages → Run workflow

### Налаштування GitHub Pages (перший раз)

1. GitHub репозиторій → Settings → Pages
2. Source: **GitHub Actions**
3. Додайте CNAME запис у свого хостера: `openfpv.com.ua → <username>.github.io`

---

## Внесок у проект

1. Fork репозиторію
2. Створіть гілку: `git checkout -b fix/назва-виправлення`
3. Внесіть зміни та зробіть commit
4. Відкрийте Pull Request

Знайшли помилку в документації? Скористайтесь кнопкою **"Знайшли помилку?"** на сторінці або [відкрийте issue](https://github.com/Maxwell456/openipc-docs-ukr/issues/new) вручну.

---

## Контакти

- **Email:** [openfpv.com.ua@gmail.com](mailto:openfpv.com.ua@gmail.com)
- **GitHub:** [Maxwell456/openipc-docs-ukr](https://github.com/Maxwell456/openipc-docs-ukr)
- **Сайт:** [openfpv.com.ua](https://openfpv.com.ua)

---

© 2024–2026 OpenFPV Ukraine · Проект спільноти, не є офіційним ресурсом OpenIPC

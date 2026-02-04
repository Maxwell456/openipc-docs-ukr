# OpenIPC FPV — Документація українською

Повна документація OpenIPC для FPV-пілотів українською мовою

[![Website](https://img.shields.io/badge/Website-openfpv.com.ua-blue?style=flat-square)](https://openfpv.com.ua)
[![GitHub](https://img.shields.io/badge/GitHub-OpenFPV-181717?style=flat-square&logo=github)](https://github.com/Maxwell456/openipc-docs-ukr)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)
[![Language](https://img.shields.io/badge/Мова-Українська-yellow?style=flat-square)](https://openfpv.com.ua)

---

## Огляд проєкту

**OpenIPC** — це відкрита платформа для IP-камер на цифрових FPV-системах. Цей репозиторій містить повну документацію українською мовою для налаштування та використання OpenIPC у FPV-польотах.

### Основні можливості

- **Українська мова** — повна документація перекладена українською
- **Сучасний дизайн** — адаптивний інтерфейс з підтримкою світлої та темної теми
- **Швидкий пошук** — миттєвий пошук по всій документації
- **Мобільна версія** — оптимізований перегляд на всіх пристроях
- **Двомовність** — підтримка української та англійської мов
- **Регулярні оновлення** — актуальна інформація від спільноти

**[Переглянути документацію →](https://openfpv.com.ua)**

---

## Швидкий старт

### Локальна розробка

```bash
# Клонування репозиторію
git clone https://github.com/Maxwell456/openipc-docs-ukr.git
cd openipc-docs-ukr

# Встановлення залежностей
pip install mkdocs-material mkdocs-static-i18n

# Запуск локального сервера
mkdocs serve
```

Відкрийте http://127.0.0.1:8000 у браузері.

### Розгортання через Docker

**Збірка образу:**
```bash
docker build -t openipc-docs .
```

**Збірка без кешу:**
```bash
docker build --no-cache -t openipc-docs .
```

**Запуск контейнера:**
```bash
docker run -d --name openipc-docs -p 8888:80 openipc-docs
```

**Зупинка контейнера:**
```bash
docker stop openipc-docs && docker rm openipc-docs
```

---

## Структура документації

### Перші кроки
- Посібник швидкого старту
- Налаштування дрона
- Налаштування приймача VRX
- Збірка наземної станції
- Поширені проблеми та їх вирішення

### Обладнання
- **Модулі VTX**: Mario AIO, Thinker, Runcam
- **Приймачі VRX**: Emax Wyvern, OpenIPC Bonnet
- **Мережеві карти**: сумісність RTL8812EU/AU/BU

### Прошивки
- APFPV — посібник для початківців
- Налаштування WFB-NG
- APALink — адаптивний бітрейт
- OpenIPC 4G/LTE FPV

### Конфігурація
- Оновлення прошивки
- Телеметрія та OSD
- VTXMenu
- Налаштування Adaptive-Link

---

## Участь у розробці

Ми вітаємо внески для покращення документації. Якщо ви знайшли помилку або хочете додати нову інформацію:

1. Створіть форк репозиторію
2. Створіть нову гілку (`git checkout -b feature/improvement`)
3. Внесіть ваші зміни
4. Закомітьте зміни (`git commit -m 'Додано покращення'`)
5. Надішліть зміни до гілки (`git push origin feature/improvement`)
6. Створіть Pull Request

### Повідомлення про помилки

Знайшли помилку в документації? [Створіть Issue](https://github.com/Maxwell456/openipc-docs-ukr/issues/new) або скористайтеся кнопкою "Знайшли помилку?" на сайті.

---

## Корисні посилання

- [Офіційний сайт OpenIPC](https://openipc.org)
- [Telegram спільнота](https://t.me/openipc)
- [GitHub OpenIPC](https://github.com/OpenIPC)
- [Сайт документації](https://openfpv.com.ua)

---

## Системні вимоги

- Python 3.8 або вище
- Тема MkDocs Material
- Плагін MkDocs Static i18n

Встановлення всіх залежностей:
```bash
pip install -r requirements.txt
```

---

## Ліцензія

Цей проєкт розповсюджується під ліцензією MIT. Детальніше у файлі [LICENSE](LICENSE).

---

## Подяки

Створено та підтримується українською FPV спільнотою.

Якщо цей проєкт допоміг вам, будь ласка, поставте зірку.

[![Star History](https://img.shields.io/github/stars/Maxwell456/openipc-docs-ukr?style=social)](https://github.com/Maxwell456/openipc-docs-ukr/stargazers)

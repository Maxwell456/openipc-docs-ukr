# --------- Етап 1: Збірка ---------

    FROM python:3.11-slim AS builder

    # Встановлюємо системні бібліотеки для cairosvg
    
    RUN apt-get update && apt-get install -y \
        libcairo2 \
        libpango-1.0-0 \
        libpangocairo-1.0-0 \
        libgdk-pixbuf2.0-0 \
        libffi-dev \
        shared-mime-info \
        && rm -rf /var/lib/apt/lists/*
    
    # Встановлюємо Python-залежності
    
    RUN pip install "mkdocs-material[imaging]" \
        mkdocs \
        pyyaml \
        mkdocs-meta-descriptions-plugin \
        mkdocs-glightbox \
        mkdocs-git-revision-date-localized-plugin \
        mkdocs-minify-plugin
    
    # Переходимо до робочої директорії
    WORKDIR /app
    COPY . /app
    
    # Копіюємо OG preview зображення (якщо вони вже згенеровані)
    RUN [ -d .cache/plugin/social ] && python3 build-scripts/copy-og-images.py || echo "OG preview зображення не знайдені"
    
    # Генеруємо sitemap (якщо є відповідний скрипт)
    RUN python3 build-scripts/generate_sitemap.py || true
    
    # Збираємо сайт MkDocs
    RUN mkdocs build --clean
    
    # --------- Етап 2: NGINX ---------
    
    FROM nginx:alpine
    
    # Видаляємо стандартні HTML-файли nginx
    RUN rm -rf /usr/share/nginx/html/*
    
    # Копіюємо власну сторінку 404
    COPY docs/404.html /usr/share/nginx/html/404.html
    
    # Копіюємо зібраний сайт із етапу builder
    COPY --from=builder /app/site/ /usr/share/nginx/html/
    
    # Копіюємо конфіг nginx
    COPY config/nginx.conf /etc/nginx/nginx.conf
    
    EXPOSE 80
    
    CMD ["nginx", "-g", "daemon off;"]
    
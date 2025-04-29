# --------- Stage 1: Builder ---------
    FROM python:3.11-slim AS builder

    # Устанавливаем все необходимые зависимости
    RUN pip install mkdocs mkdocs-material pyyaml mkdocs-meta-descriptions-plugin
    
    # Работаем в директории /app
    WORKDIR /app
    COPY . /app
    
    # Генерируем sitemap.xml
    RUN python3 generate_sitemap.py
    
    # Билдим сайт
    RUN mkdocs build --clean
    
    # --------- Stage 2: NGINX ---------
    FROM nginx:alpine
    
    # Удаляем стандартные HTML страницы nginx
    RUN rm -rf /usr/share/nginx/html/*
    
    # Копируем свою 404.html и сайт
    COPY docs/404.html /usr/share/nginx/html/404.html
    COPY --from=builder /app/site/ /usr/share/nginx/html/
    
    # Копируем свой конфиг
    COPY nginx.conf /etc/nginx/nginx.conf
    
    EXPOSE 80
    
    CMD ["nginx", "-g", "daemon off;"]
    
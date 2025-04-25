# --------- Stage 1: Builder ---------
    FROM python:3.11-slim AS builder

    RUN pip install mkdocs mkdocs-material pyyaml
    
    WORKDIR /app
    COPY . /app
    
    # Генеруємо sitemap.xml
    RUN python3 generate_sitemap.py
    
    # Білдимо статику
    RUN mkdocs build --clean
    
    # --------- Stage 2: NGINX ---------
    FROM nginx:alpine
    
    # Видаляємо дефолтні html
    RUN rm -rf /usr/share/nginx/html/*
    
    # Копіюємо вашу 404 і весь site/ з builder
    COPY docs/404.html                /usr/share/nginx/html/404.html
    COPY --from=builder /app/site/    /usr/share/nginx/html/
    
    # Копіюємо свій конфіг
    COPY nginx.conf /etc/nginx/nginx.conf
    
    EXPOSE 80
    
    CMD ["nginx", "-g", "daemon off;"]
    
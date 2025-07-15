FROM php:8.2-fpm-alpine

# Instalar dependencias del sistema
RUN apk add --no-cache \
    git \
    curl \
    libpng-dev \
    libxml2-dev \
    zip \
    unzip \
    oniguruma-dev \
    jpeg-dev \
    freetype-dev

# Instalar extensiones PHP
RUN docker-php-ext-configure gd --with-freetype --with-jpeg
RUN docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd

# Instalar Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Establecer directorio de trabajo
WORKDIR /var/www/html

# Copiar archivos de la aplicación
COPY . .

# Instalar dependencias de PHP
RUN composer install --no-dev --optimize-autoloader

# Configurar permisos
RUN chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache
RUN chmod -R 775 /var/www/html/storage /var/www/html/bootstrap/cache

# Crear enlace simbólico de storage
RUN php artisan storage:link

# Optimizaciones de producción
RUN php artisan config:cache
RUN php artisan route:cache
RUN php artisan view:cache

# Exponer puerto
EXPOSE 9000

CMD ["php-fpm"]

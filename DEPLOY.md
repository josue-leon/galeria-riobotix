# 🚀 Guía de Despliegue - Galería RIOBOTIX


## 📋 **Requisitos Previos**

### En tu VPS:
- ✅ Docker y Docker Compose instalados
- ✅ Nginx configurado
- ✅ Subdominio `galeria.riobotix.com` apuntando al VPS
- ✅ SSL/TLS configurado (Let's Encrypt recomendado)

## 🔧 **Paso 1: Preparar el VPS**

### 1.1 Instalar Docker (si no está instalado)
```bash
# Actualizar sistema
sudo apt update && sudo apt upgrade -y

# Instalar Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER

# Instalar Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Verificar instalación
docker --version
docker-compose --version
```

### 1.2 Configurar Nginx del Host
```bash
# Copiar la configuración nginx
sudo cp nginx-host-config.conf /etc/nginx/sites-available/galeria.riobotix.com

# Activar el sitio
sudo ln -s /etc/nginx/sites-available/galeria.riobotix.com /etc/nginx/sites-enabled/

# Verificar configuración
sudo nginx -t

# Recargar nginx
sudo systemctl reload nginx
```

### 1.3 Configurar SSL (si no está configurado)
```bash
# Instalar Certbot
sudo apt install certbot python3-certbot-nginx -y

# Obtener certificado SSL
sudo certbot --nginx -d galeria.riobotix.com
```

## 🐳 **Paso 2: Desplegar con Docker**

### 2.1 Clonar y Configurar
```bash
# Ir al directorio de proyectos
cd /opt  # o donde prefieras

# Clonar el repositorio
git clone [tu-repositorio] galeria-riobotix
cd galeria-riobotix

# Hacer ejecutable el script de deploy
chmod +x deploy.sh
```

### 2.2 Configurar Variables de Entorno
```bash
# Copiar archivo de ejemplo
cp env.example .env

# Editar configuraciones
nano .env
```

**Configuraciones importantes en `.env`:**
```bash
# Base de datos - CAMBIAR ESTAS PASSWORDS
DB_USERNAME=galeria_user
DB_PASSWORD=tu_password_seguro_aqui
DB_ROOT_PASSWORD=tu_root_password_aqui

# Laravel - GENERAR APP_KEY
APP_KEY=base64:tu_app_key_generada_aqui
APP_URL=https://galeria.riobotix.com
APP_ENV=production
APP_DEBUG=false
```

### 2.3 Generar APP_KEY de Laravel
```bash
# Instalar PHP temporalmente para generar la key
sudo apt install php-cli -y
php -r "echo 'base64:'.base64_encode(random_bytes(32)).PHP_EOL;"

# O usar el contenedor de Laravel (después del deploy)
docker-compose exec laravel_api php artisan key:generate --show
```

### 2.4 Ejecutar Despliegue
```bash
# Ejecutar script de deploy
./deploy.sh

# O manualmente:
docker-compose up -d --build
```

## 🔍 **Paso 3: Verificación**

### 3.1 Verificar Contenedores
```bash
# Ver estado de contenedores
docker-compose ps

# Ver logs
docker-compose logs -f
```

### 3.2 Ejecutar Migraciones
```bash
# Ejecutar migraciones de base de datos
docker-compose exec laravel_api php artisan migrate --force

# Crear enlace simbólico de storage
docker-compose exec laravel_api php artisan storage:link
```

### 3.3 Verificar Acceso
- 🌐 **Producción**: https://galeria.riobotix.com
- 🔧 **Local**: http://tu-ip:8080

## 📁 **Estructura de Archivos**

```
galeria-riobotix/
├── docker-compose.yml      # Orquestación de contenedores
├── nginx.conf             # Nginx interno
├── nginx-host-config.conf # Nginx del host
├── deploy.sh              # Script de despliegue
├── env.example            # Variables de entorno
├── gallery-api/           # Laravel API
│   └── Dockerfile
├── gallery-app/           # Angular Frontend
│   ├── Dockerfile
│   └── nginx-angular.conf
└── DEPLOY.md             # Esta guía
```

## 🛠️ **Comandos Útiles**

### Gestión de Contenedores
```bash
# Ver logs en tiempo real
docker-compose logs -f

# Reiniciar servicios
docker-compose restart

# Parar todo
docker-compose down

# Rebuild y restart
docker-compose up -d --build

# Acceder a bash del contenedor
docker-compose exec laravel_api bash
docker-compose exec angular_app sh
```

### Laravel Artisan
```bash
# Ejecutar comandos artisan
docker-compose exec laravel_api php artisan migrate
docker-compose exec laravel_api php artisan cache:clear
docker-compose exec laravel_api php artisan config:cache
```

### Base de Datos
```bash
# Conectar a MySQL
docker-compose exec mysql mysql -u root -p galeria

# Backup de base de datos
docker-compose exec mysql mysqldump -u root -p galeria > backup.sql

# Restaurar backup
docker-compose exec -T mysql mysql -u root -p galeria < backup.sql
```

## 🚨 **Solución de Problemas**

### Error de Permisos de Storage
```bash
docker-compose exec laravel_api chown -R www-data:www-data storage bootstrap/cache
docker-compose exec laravel_api chmod -R 775 storage bootstrap/cache
```

### Error de APP_KEY
```bash
docker-compose exec laravel_api php artisan key:generate
```

### Problemas de CORS
Verificar que `APP_URL` en `.env` coincida con el dominio de producción.

### Error de Base de Datos
```bash
# Verificar conexión
docker-compose exec laravel_api php artisan tinker
# En tinker: DB::connection()->getPdo();
```

## 🔄 **Actualizaciones**

```bash
# Pull de cambios
git pull origin main

# Rebuild y deploy
./deploy.sh

# O manual
docker-compose down
docker-compose up -d --build
```

## 🔒 **Seguridad**

- ✅ SSL/TLS configurado
- ✅ Firewall configurado (solo puertos 80, 443, 22)
- ✅ Passwords fuertes en `.env`
- ✅ APP_DEBUG=false en producción
- ✅ Backups regulares de base de datos

## 📞 **Soporte**

Si encuentras problemas:
1. Revisa los logs: `docker-compose logs -f`
2. Verifica el estado: `docker-compose ps`
3. Checa la configuración de nginx: `sudo nginx -t`
4. Verifica SSL: `curl -I https://galeria.riobotix.com` 
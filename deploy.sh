#!/bin/bash

# Script de despliegue para Galería RIOBOTIX
echo "🚀 Iniciando despliegue de Galería RIOBOTIX..."

# Verificar que estamos en el directorio correcto
if [ ! -f "docker-compose.yml" ]; then
    echo "❌ Error: docker-compose.yml no encontrado"
    exit 1
fi

# Crear archivo .env si no existe
if [ ! -f ".env" ]; then
    echo "📝 Creando archivo .env desde env.example..."
    cp env.example .env
    echo "⚠️  IMPORTANTE: Edita el archivo .env con tus configuraciones"
    echo "   - Especialmente DB_PASSWORD, DB_ROOT_PASSWORD y APP_KEY"
    read -p "Presiona Enter cuando hayas editado .env..."
fi

# Detener contenedores existentes
echo "🛑 Deteniendo contenedores existentes..."
docker-compose down

# Limpiar imágenes anteriores (opcional)
read -p "¿Limpiar imágenes Docker anteriores? (y/N): " cleanup
if [[ $cleanup =~ ^[Yy]$ ]]; then
    echo "🧹 Limpiando imágenes anteriores..."
    docker system prune -f
fi

# Construir y levantar contenedores
echo "🔧 Construyendo y levantando contenedores..."
docker-compose up -d --build

# Esperar a que los servicios estén listos
echo "⏳ Esperando a que los servicios estén listos..."
sleep 30

# Ejecutar migraciones de Laravel
echo "📊 Ejecutando migraciones de base de datos..."
docker-compose exec laravel_api php artisan migrate --force

# Crear storage link
echo "🔗 Creando enlace simbólico de storage..."
docker-compose exec laravel_api php artisan storage:link

# Verificar estado de los contenedores
echo "✅ Verificando estado de los contenedores..."
docker-compose ps

echo ""
echo "🎉 ¡Despliegue completado!"
echo "📱 La aplicación debería estar disponible en: http://localhost:8080"
echo "🌐 Y en producción en: https://galeria.riobotix.com"
echo ""
echo "📋 Comandos útiles:"
echo "   - Ver logs: docker-compose logs -f"
echo "   - Parar: docker-compose down"
echo "   - Reiniciar: docker-compose restart"
echo "   - Actualizar: git pull && ./deploy.sh" 
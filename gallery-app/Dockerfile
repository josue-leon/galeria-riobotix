# Etapa 1: Build de Angular
FROM node:18-alpine AS builder

WORKDIR /app

# Copiar package.json y package-lock.json
COPY package*.json ./

# Instalar dependencias
RUN npm ci

# Copiar código fuente
COPY . .

# Build para producción
RUN npm run build --prod

# Etapa 2: Nginx para servir la aplicación
FROM nginx:alpine

# Copiar archivos construidos desde el builder
COPY --from=builder /app/dist/gallery-app /usr/share/nginx/html

# Configuración básica de nginx
COPY nginx-angular.conf /etc/nginx/conf.d/default.conf

# Exponer puerto
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

# --- Stage 1: Build ---
FROM node:20-alpine AS builder

WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar dependencias
RUN npm install --legacy-peer-deps

# Copiar el resto del código
COPY . .

# Generar la versión de producción
RUN npm run build

# --- Stage 2: Run ---
FROM node:20-alpine

WORKDIR /app

# Copiar las dependencias y la carpeta dist desde el builder
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist

# Exponer el puerto que usa NestJS
EXPOSE 3000

# Comando para iniciar la aplicación
CMD ["node", "dist/main"]

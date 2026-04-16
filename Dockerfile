# Imagen base liviana
FROM node:18-alpine

# Carpeta de trabajo
WORKDIR /app

# Copiamos dependencias primero (mejor cache)
COPY package*.json ./

# Instalamos dependencias
RUN npm install

# Copiamos el resto del proyecto
COPY . .

# Generamos Prisma Client
RUN npx prisma generate

# Exponemos el puerto de Nest
EXPOSE 3000 5555

# Comando de arranque (con migraciones incluidas)
CMD ["sh", "-c", "npx prisma db push --accept-data-loss && npx prisma db seed && npm run start:dev"]
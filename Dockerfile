FROM node:latest AS build

WORKDIR /app

COPY . .

RUN npm install

# No es necesario ejecutar npm run build en este caso

# Etapa final para servir la aplicación
FROM node:latest

WORKDIR /app

# Copiar los archivos de la aplicación desde la etapa de construcción
COPY --from=build /app .

# Instalar Vite de forma global
RUN npm install -g vite

# Exponer el puerto en el que se ejecutará la aplicación de Vite
EXPOSE 5173

# Ejecutar el servidor de desarrollo de Vite
CMD ["vite", "dev", "--port", "5173", "--host", "0.0.0.0"]
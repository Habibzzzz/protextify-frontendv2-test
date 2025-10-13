# Dockerfile untuk React + Vite (production)
FROM node:22-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Nginx untuk serve static files
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html

# Optional: custom nginx config (bisa dihapus jika tidak perlu)
COPY default.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

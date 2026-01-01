# build stage
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
# Install dev deps so build tools (vite) are available during build
RUN npm ci
COPY . .
RUN npm run build

# runtime stage
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

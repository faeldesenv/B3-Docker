# Stage 1: build the Angular app
FROM node:20-alpine AS builder
WORKDIR /app

ARG API_URL=http://localhost:8080

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

RUN sed -i "s|{{API_URL}}|$API_URL|g" src/environments/environment.prod.ts

RUN npm run build -- --configuration production

# Stage 2: serve with nginx
FROM nginx:alpine
COPY --from=builder /app/dist/frontend /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

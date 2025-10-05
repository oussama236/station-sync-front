# ---------- Build stage ----------
FROM node:20-alpine AS builder
WORKDIR /app

# Install dependencies (use package-lock for reproducible builds)
COPY package*.json ./
RUN npm ci

# Copy source and build
COPY . .
# Build with production config (Angular 15/16+)
RUN npm run build -- --configuration production

# ---------- Runtime stage ----------
FROM nginx:alpine

# Clean default Nginx web root
RUN rm -rf /usr/share/nginx/html/*

# ⬇️ CHANGE THIS PATH to your real outputPath from angular.json
# Example if outputPath is dist/stationsync:
COPY --from=builder /app/dist/station-sync/ /usr/share/nginx/html/

# Provide SPA-aware nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

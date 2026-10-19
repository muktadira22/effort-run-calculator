# ==============================================================================
# Stage 1: Build Stage (Node.js 22 Alpine)
# ==============================================================================
FROM node:22.14.0-alpine3.21 AS builder

WORKDIR /app

# Copy lockfile and package manifest first to maximize Docker layer caching
COPY package.json package-lock.json ./

# Install deterministic dependencies from lockfile
RUN npm ci

# Copy application source and configuration files
COPY index.html tsconfig.json vite.config.ts eslint.config.js ./
COPY public ./public
COPY src ./src

# Compile TypeScript and build production static bundle into /app/dist
RUN npm run build

# ==============================================================================
# Stage 2: Production Runtime Stage (Unprivileged Nginx on Alpine)
# ==============================================================================
FROM nginxinc/nginx-unprivileged:1.27.4-alpine3.21 AS production

# Metadata labels following OCI image specification
LABEL org.opencontainers.image.title="trail-effort-converter" \
      org.opencontainers.image.description="Trail-to-Road Effort Converter (ITRA Km-Effort & Pace Estimator)" \
      org.opencontainers.image.version="1.0.0"

# Copy hardened Nginx configuration (SPA routing + HTTP Security Headers + Caching)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy compiled static assets from builder stage with non-root ownership (nginx:nginx = 101:101)
COPY --from=builder --chown=101:101 /app/dist /usr/share/nginx/html

# Run explicitly as non-root user (UID 101 in nginx-unprivileged)
USER 101

# Expose unprivileged HTTP port
EXPOSE 8080

# Built-in container health check querying the static /health.json endpoint
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://127.0.0.1:8080/health.json || exit 1

STOPSIGNAL SIGQUIT

CMD ["nginx", "-g", "daemon off;"]

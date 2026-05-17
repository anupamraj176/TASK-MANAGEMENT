# Stage 1: Install all dependencies for building and testing
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci

# Stage 2: Install production dependencies only
FROM node:18-alpine AS prod-deps
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev

# Stage 3: Production runner
FROM node:18-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

# Copy production node_modules and app files
COPY --from=prod-deps /app/node_modules ./node_modules
COPY . .

# Expose backend port
EXPOSE 5000

# Run backend directly with node to bypass any dev-only wrappers (like cross-env)
CMD ["node", "server.js"]

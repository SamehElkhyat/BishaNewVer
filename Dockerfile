# ================================
# Stage 1: Build
# ================================
FROM node:20-alpine AS builder
WORKDIR /app

# Install system dependencies for node-gyp
RUN apk add --no-cache libc6-compat

# Copy package files
COPY package*.json ./

# Set npm config for better reliability
RUN npm config set registry https://registry.npmjs.org/ && \
    npm config set fetch-retries 5 && \
    npm config set fetch-retry-mintimeout 20000 && \
    npm config set fetch-retry-maxtimeout 120000

# Install all dependencies including devDependencies with retry logic
RUN npm install --no-fund --no-audit --prefer-offline || \
    (sleep 30 && npm install --no-fund --no-audit --prefer-offline) || \
    (sleep 60 && npm install --no-fund --no-audit --prefer-offline)

# Copy the rest of the project
COPY . .

# Set environment variables
ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

# Build the project
RUN npm run build

# ================================
# Stage 2: Production
# ================================
FROM node:20-alpine AS runner
WORKDIR /app

# Install system dependencies for node-gyp
RUN apk add --no-cache libc6-compat

# Create non-root user
RUN addgroup -S app && adduser -S app -G app

# Copy necessary files from builder
COPY --from=builder --chown=app:app /app/next.config.mjs .
COPY --from=builder --chown=app:app /app/public ./public
COPY --from=builder --chown=app:app /app/package.json .

# Copy the standalone directory
COPY --from=builder --chown=app:app /app/.next/standalone ./
COPY --from=builder --chown=app:app /app/.next/static ./.next/static

# Set proper permissions
RUN chown -R app:app /app

# Create necessary directories with correct permissions
RUN mkdir -p .next/cache/images && \
    chown -R app:app .next/cache

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3000
EXPOSE $PORT

# Switch to non-root user
USER app

# Command to run the application
CMD ["node", "server.js"]

# Set user
USER app

# Start the application
CMD ["node", "server.js"]
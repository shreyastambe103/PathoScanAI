FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Install build dependencies
RUN apk add --no-cache python3 make g++ curl

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source files
COPY . .

# Build application
RUN chmod +x build.sh && ./build.sh

# Production image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Install production dependencies only
COPY package*.json ./
RUN npm ci --production

# Copy built application from builder stage
COPY --from=builder /app/client/dist ./client/dist
COPY --from=builder /app/server/dist ./server/dist
COPY --from=builder /app/start.sh ./
COPY --from=builder /app/healthcheck.sh ./

# Install curl for healthcheck
RUN apk add --no-cache curl

# Set environment variables
ENV NODE_ENV=production
<<<<<<< HEAD
ENV PORT=5000

# Expose port
EXPOSE 5000
=======
ENV PORT=8080

# Expose port
EXPOSE 8080
>>>>>>> a47e7aecac876d457013c1d57c25e2fb2aa67360

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
  CMD ./healthcheck.sh

# Run application
CMD ["./start.sh"]
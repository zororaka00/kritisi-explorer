# Use Debian slim as base image
FROM debian:bullseye-slim

# Install Bun
RUN apt-get update && apt-get install -y curl git build-essential \
    && curl -fsSL https://bun.sh/install | bash

# Add Bun to PATH
ENV PATH="/root/.bun/bin:$PATH"

# Set working directory
WORKDIR /app

# Copy bun.lockb & package.json / bunfig.toml
COPY package.json bun.lockb bunfig.toml ./

# Install dependencies via Bun
RUN bun install

# Copy entire project
COPY . .

# Build Nuxt (production)
RUN bun run build

# Expose port
EXPOSE 8080

# Run Nuxt server with Bun
CMD ["bun", "run", "preview", "--port", "8080", "--host"]

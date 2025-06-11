FROM node:20-slim

# Install pnpm and turbo
RUN npm install -g pnpm@9.1.0 turbo@^2.0.4

WORKDIR /app

# Copy root package files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json ./

# Copy app and package manifests
COPY apps/ apps/
COPY packages/ packages/

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy the rest of the source code
COPY . .

CMD ["pnpm", "dev"]

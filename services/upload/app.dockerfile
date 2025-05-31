# ---------- STAGE 1: Build ----------
  FROM node:18 AS builder

  WORKDIR /usr/src/app

  # Install only prod + dev dependencies
  COPY package*.json ./
  RUN npm install

  # Copy only TypeScript source code
  COPY . .

  # Compile TypeScript to JavaScript
  RUN npm run build

  # ---------- STAGE 2: Production ----------
  FROM node:18-slim AS production

  WORKDIR /usr/src/app

  # Copy only package.json for production install
  COPY package*.json ./

  # Install only production dependencies
  RUN npm install --omit=dev

  # Copy only built JS files from builder
  COPY --from=builder /usr/src/app/dist ./dist

  # Expose the app port
  EXPOSE 4000

  # Start the server
  CMD ["node", "dist/server.js"]

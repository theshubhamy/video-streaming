# ---------- STAGE 1: Build ----------
FROM node:18 AS builder
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# ---------- STAGE 2: Production ----------
FROM node:18-slim AS production
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install --omit=dev
COPY --from=builder /usr/src/app/dist ./dist
EXPOSE 4000
CMD ["node", "dist/server.js"]

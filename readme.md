# 🎥 Video Streaming Platform

## Project Architecture (Node.js + REST + GraphQL Gateway)

This document outlines a production-grade microservices-based architecture for a **Video Streaming Platform** like Loom or Vimeo, built using **Node.js**, **Express**, and **REST for internal communication**. It uses **GraphQL as the public API Gateway**, and focuses on secure uploads, video transcoding, streaming, background processing, and analytics.

---

## 📂 Microservices & Their Responsibilities

### 1. `user-service`

**Responsibilities:**

- User registration/login (email/phone with otp)
- JWT-based auth
- Profile and subscription tier management

**Tools & Packages:**

- `bcrypt`, `jsonwebtoken`
- `PostgreSQL` 'pg'
- `Redis` for sessions/cache

---

### 2. `upload-service`

**Responsibilities:**

- Receive video uploads (chunked/resumable)
- Store raw files in S3-compatible storage
- Send job to transcode queue

**Tools & Packages:**

- `multer`, `tus-node-server` (optional for resumable)
- `AWS S3`, `MinIO`, `Backblaze`
- `BullMQ` + `Redis` for job queue

---

### 3. `transcode-service`

**Responsibilities:**

- Process uploaded videos into multiple resolutions (e.g., 1080p, 720p)
- Store processed files
- Notify system on job success/failure

**Tools & Packages:**

- `fluent-ffmpeg`
- `BullMQ` (worker)
- `Node.js` or Go-based FFmpeg wrapper

---

### 4. `stream-service`

**Responsibilities:**

- Serve videos securely (HLS/DASH)
- Generate signed URLs for playback
- CDN integration

**Tools & Packages:**

- `express-static`, `signed-url` generation
- `CloudFront` / `Cloudflare R2`
- Token-based access to prevent unauthorized downloads

---

### 5. `video-service`

**Responsibilities:**

- Metadata (title, thumbnail, duration)
- Likes/comments/visibility (public/private)
- Thumbnail generation

**Tools & Packages:**

- `PostgreSQL`
- `sharp` (for thumbnail generation)
- `REST API` for internal ops

---

### 6. `notification-service`

**Responsibilities:**

- Notify users (email) when transcoding is done
- Alerts for failed uploads
- Promotion or newsletter campaigns

**Tools & Packages:**

- `Nodemailer`, `SendGrid`, `Twilio`
- Kafka or BullMQ

---

### 7. `analytics-service`

**Responsibilities:**

- Track views, watch duration, geo/device
- Unique viewers count per video
- Aggregation dashboard

**Tools & Packages:**

- `PostgreSQL` or `ClickHouse`
- Express collector API
- Scheduled aggregation via cron/BullMQ

### 8. `search-service`

**Responsibilities:**

- Full-text search on videos, tags, transcripts
- Filter by category, duration, creator
- Sync with video-service updates via Kafka

**Tools & Packages:**

- `MeiliSearch` or `ElasticSearch`
- Kafka (video.created, video.deleted)
- Redis (cache trending searches)

---

## 🗒️ Folder Structure & Utilities

```
.
├── graphql/ # GraphQL Gateway
│   ├── main.ts
│   ├── schema.graphql
│   └── resolvers/
│
├── services/
│   ├── user-service/
│   ├── upload-service/
│   ├── transcode-service/
│   ├── stream-service/
│   ├── search-service/
│   ├── video-service/
│   ├── analytics-service/
│   └── notification-service/
│
├── shared/ # Common utilities
│   ├── auth/
│   ├── s3/
│   ├── queue/
│
├── docker-compose.yml
├── nginx/ # Reverse proxy
├── Makefile
├── README.md

```

---

## 🏗️ Service Template Layout

Each service (e.g., `upload-service`) follows this internal structure:

```
upload-service/
├── src/
│   ├── controllers/
│   ├── routes/
│   ├── services/
│   ├── jobs/
│   ├── models/
│   ├── config/
│   └── app.ts
├── Dockerfile
├── package.json
```

---

## 🚀 GraphQL Gateway (Public Interface)

- Built with `Apollo Server` or `GraphQL Yoga`
- Converts frontend queries into REST requests to services
- Does **not** contain business logic

**Example flow:**

```
Frontend → GraphQL Query
          → graphql/
            → Calls REST: POST /videos to video-service
```

---

## 🔁 Async Processing with BullMQ

Used in:

- `upload-service` (push video to queue)
- `transcode-service` (consume job, transcode with FFmpeg)
- `notification-service` (email on status change)
- `analytics-service` (aggregate view stats)

---

## 📬 Video Upload & Transcode Flow

```
[Frontend]
   ↓
GraphQL Mutation
   ↓
upload-service (receives raw video, stores in S3)
   ↓
BullMQ → transcode queue
   ↓
transcode-service (uses FFmpeg to generate formats)
   ↓
S3 (store output)
   ↓
notification-service → Email/SMS update to user
```

---

## 📡 Video Streaming with Signed URLs

- HLS (.m3u8) format stored in S3
- Frontend player fetches video chunks
- Signed URLs with TTL to prevent hotlinking
- Optional: CDN layer with signed cookies (CloudFront)

---

## 📈 Monitoring & DevOps

- **Prometheus + Grafana**: service metrics (requests, queue lag, transcoding time)
- **Bull Board**: visualize background queues
- **Sentry**: error tracking
- **Docker + Docker Compose**: for local orchestration
- **Kubernetes**: HPA + liveness probes in production

---

## 🔐 Security

- HTTPS via NGINX
- JWT-based access
- Signed URLs for video access
- File size & type validation during upload

---

## 📌 Optional Features

- Video Chapters / Timestamped comments
- Team workspaces (like Loom Teams)
- Browser extension for instant screen recording
- Video transcripts via Whisper AI

---

## 📍 Future Enhancements

- Migrate BullMQ to Kafka for massive scale
- Add WebRTC live streaming support
- Usage-based billing (minutes watched)
- AI-based thumbnail suggestions
- gRPC between services (optional scale-up)

---

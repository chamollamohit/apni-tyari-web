# Apni Tyari - EdTech Platform

![Next.js](https://img.shields.io/badge/Next.js-16-black) ![TypeScript](https://img.shields.io/badge/TypeScript-blue) ![Prisma](https://img.shields.io/badge/Prisma-ORM-green) ![Status](https://img.shields.io/badge/Status-MVP%20Complete-success)

A full-stack Learning Management System (LMS) built with **Next.js (App Router)**, tailored for the Indian EdTech market (NEET/JEE/UPSC). Features a role-based Admin dashboard, bulk batch scheduling via Excel, and a secure, time-locked student learning environment.

![Project Screenshot](public/apni-tyari.png)

## 🚀 Features

- **Secure Video Streaming**: Private content delivery using AWS CloudFront Signed URLs.
- **Automated Video Pipeline**: S3-triggered Lambda functions for video processing and metadata management.
- **Dynamic Dashboard**: Admin panel for course, teacher, and lesson management.
- **Real-time Analytics**: Course performance tracking and student progress monitoring.
- **Optimized Performance**: Redis caching layer for frequent database queries and session management.
- **Secure Authentication**: Role-based access control (Admin/Student) via NextAuth.

### 🎓 Student Experience

- **Browse & Filter:** Search courses by category (NEET, JEE) with instant URL-based filtering.
- **Secure Purchase:** Integrated **Razorpay** payment gateway with server-side signature verification.
- **My Learning Dashboard:** Track progress (%) across enrolled courses.
- **Course Player:**
    - Video player with YouTube embedding.
    - Downloadable PDF notes.
    - "Mark as Complete" logic to track syllabus coverage.
- **Smart Schedule:** Chronological timeline of classes. Future classes are **Time-Locked** and cannot be accessed before the scheduled date.

### 🛠 Admin & Operations

- **Course Management:** Create courses, set pricing (MRP vs Sale), and manage metadata (Validity, Hinglish).
- **Subject & Faculty Manager:**
    - **Deep Hierarchy:** Course -> Subject -> Chapter -> Lesson.
    - **Faculty Pool:** Create teachers once and assign them to specific subjects (e.g., "Mohit Sir" -> Physics).
- **Batch Operations (The Engine):**
    - **Bulk Import:** Upload an Excel file (`.xlsx`) to auto-generate hundreds of lessons instantly using Prisma Transactions.
    - **Manual Scheduling:** Add/Edit daily lessons via a calendar UI.
- **Analytics Dashboard:** Visual revenue charts, total sales, and student enrollment stats.
- **Secure Video:** Upload videos in s3 and use key in lessons.

---

## 🏗 Architecture Highlights

- **Database Schema:** Optimized MongoDB schema using **Prisma** with Many-to-Many relations for Teachers and Subjects.
- **Bulk Import Logic:** Uses `db.$transaction` to ensure schedule integrity. If one row in the Excel file fails, the entire upload rolls back to prevent partial data corruption.
- **Security:**
    - **Role-Based Middleware:** Protects `/admin` routes.
    - **CloudFront Signed URLs:** Time-limited access to prevent unauthorized link sharing.

- **High-Performance Caching (Redis):**
    - **Course Data Caching:** Utilizes ioredis to cache heavy course objects. This significantly reduces database read pressure during high-traffic periods.

    - **Performance Gains:** Frequently accessed "Public" course data is served from memory, ensuring sub-50ms response times.

    - **Cache Management:** Implements precise cache invalidation; when course content or status changes, relevant Redis keys are cleared to maintain data integrity.

    ```mermaid
    sequenceDiagram
    participant User
    participant NextJS as Next.js API
    participant Redis as Redis Cache
    participant DB as MongoDB (Prisma)

    User->>NextJS: Request Course Data
    NextJS->>Redis: Check for Key (GET)

    alt Cache Hit
        Redis-->>NextJS: Return Cached Data
        NextJS-->>User: Serve Response (~50ms)
    else Cache Miss
        Redis-->>NextJS: Null / Expired
        NextJS->>DB: Fetch from MongoDB
        DB-->>NextJS: Return Data
        NextJS->>Redis: Store Data with TTL (SET)
        NextJS-->>User: Serve Response
    end
    ```

- **Video Upload & Playback Flow:**
    - **Upload:** Admin initiates a multipart upload directly to S3. A Prisma record is created with `status: PENDING` to track the initial state.

    - **Queue Management (SQS):** Upon successful upload, S3 triggers an event that is sent to **AWS SQS**. This ensures the system is resilient; even during high-traffic upload periods, tasks are queued and processed sequentially without losing data.

    - **Asynchronous Processing:** **AWS Lambda** `(lambda-functions/video-queue.ts)` acts as a consumer for the SQS queue. It extracts video metadata, updates the database status to `COMPLETED` (or `FAILED`), and triggers any necessary cache invalidations.

    ```mermaid
    graph LR
    A[Admin/Client] -- Video Upload --> B((AWS S3))
    B -- ObjectCreated Event --> C[AWS SQS]
    C -- Message Trigger --> D[AWS Lambda Processing]
    D -- Webhook Call --> E[Next.js API Route]
    E -- Update Metadata & Status --> F[(MongoDB)]

    subgraph "Asynchronous Worker"
    C
    D
    end

    style A fill:#f9f,stroke:#333,stroke-width:2px
    style B fill:#ff9900,stroke:#fff,color:#fff
    style C fill:#ff4400,stroke:#fff,color:#fff
    style D fill:#f5af64,stroke:#333
    style E fill:#000,stroke:#fff,color:#fff
    ```

    - **Signed Access:** Both Students and Admins access videos via a unified API route.
        - The API performs a three-way check: User Session, Purchase History, and Lesson "Free" status.

        - Successfully authorized requests receive a CloudFront Signed URL generated with an RSA private key.

---

## 🛠 Tech Stack

- **Framework:** [Next.js 16](https://nextjs.org) (App Router)
- **Language:** TypeScript
- **Database:** MongoDB (via [Prisma ORM](https://prisma.io))
- **Auth:** [NextAuth.js](https://next-auth.js.org) (Google Provider)
- **Styling:** [Tailwind CSS](https://tailwindcss.com) + [shadcn/ui](https://ui.shadcn.com)
- **Storage & CDN**: AWS S3 & AWS CloudFront (Videos)
- **Uploads:** [Cloudinary](https://cloudinary.com) (Images & PDFs)
- **Caching**: Upstash Redis / ioredis
- **Video Processing**: AWS Lambda
- **Payments:** Razorpay

---

## ⚙️ Environment Variables

Create a `.env` file in the root directory:

```env
# Database & Auth
DATABASE_URL="mongodb+srv://..."
NEXTAUTH_SECRET="your-secret"
NEXTAUTH_URL="http://localhost:3000"

# AWS Configuration
AWS_ACCESS_KEY_ID="your-access-key"
AWS_SECRET_ACCESS_KEY="your-secret-key"
AWS_REGION="your-region"
S3_BUCKET_NAME="your-bucket-name"

# AWS CloudFront (For Signed URLs)
CLOUDFRONT_DOMAIN=""
CLOUDFRONT_PUBLIC_KEY_ID="your-key-id"
CLOUDFRONT_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----"

# Redis Configuration
REDIS_URL="redis://..."
```

## 🏃‍♂️ Getting Started

1. Clone the repository:

```bash
git clone https://github.com/yourusername/apni-tyari.git
cd apni-tyari
```

2. Install dependencies:

```bash
npm install
```

3. Setup Database:

```bash
npx prisma generate
npx prisma db push
```

4. Run Development Server:

```bash
npm run dev
```

## 📂 Project Structure

```bash
src/
├── services/ # Utility Functions (Data fetching & logic)
├── app/
│ ├── (admin)/ # Protected Admin Routes (Dashboard, Operations)
│ ├── (auth)/ # Login/Register Pages
│ ├── (student)/ # Public Storefront & Player
│ └── api/ # Backend Routes (Webhooks, Cron, Excel Import)
├── components/ # Reusable UI (Navbar, VideoPlayer, Editor)
├── lib/ # Utilities (DB connection, Formatters)
├── hooks/ # Custom React Hooks
└── types/ # Global TypeScript definitions

```

## 📊 Operations Workflow (How to Schedule)

1. Go to Admin > Batch Operations.

2. Select a Course (e.g., "Arjuna Batch") and Subject (e.g., "Physics").
    - Option A (Bulk): Click "Upload Excel". Use the template to upload 100+ lessons at once.

    - Option B (Manual): Click "Add Lesson" to schedule a single class.

3. Daily Task: Click "Edit" on a lesson to paste the YouTube Link and Upload PDF Notes.

## 🔮 Future Scope & System Improvements

- **Assessment Engine**: MCQ Quizzes with negative marking (NEET pattern).

- **Doubt Forum**: StackOverflow-style discussion under every lesson.

- **Coupons**: Admin UI to create discount codes (e.g., DIWALI25).

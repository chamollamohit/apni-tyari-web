# Apni Tyari - EdTech Platform

![Next.js](https://img.shields.io/badge/Next.js-16-black) ![TypeScript](https://img.shields.io/badge/TypeScript-blue) ![Prisma](https://img.shields.io/badge/Prisma-ORM-green) ![Status](https://img.shields.io/badge/Status-MVP%20Complete-success)

A full-stack Learning Management System (LMS) built with **Next.js 16 (App Router)**, tailored for the Indian EdTech market (NEET/JEE/UPSC). Features a role-based Admin dashboard, bulk batch scheduling via Excel, and a secure, time-locked student learning environment.

![Project Screenshot](public/apni-tyari.png)

## 🚀 Features

### 🎓 Student Experience

-   **Browse & Filter:** Search courses by category (NEET, JEE) with instant URL-based filtering.
-   **Secure Purchase:** Integrated **Razorpay** payment gateway with server-side signature verification.
-   **My Learning Dashboard:** Track progress (%) across enrolled courses.
-   **Course Player:**
    -   "Netflix-style" video player with YouTube embedding.
    -   Downloadable PDF notes.
    -   "Mark as Complete" logic to track syllabus coverage.
-   **Smart Schedule:** Chronological timeline of classes. Future classes are **Time-Locked** and cannot be accessed before the scheduled date.

### 🛠 Admin & Operations

-   **Course Management:** Create courses, set pricing (MRP vs Sale), and manage metadata (Validity, Hinglish).
-   **Subject & Faculty Manager:**
    -   **Deep Hierarchy:** Course -> Subject -> Chapter -> Lesson.
    -   **Faculty Pool:** Create teachers once and assign them to specific subjects (e.g., "Mohit Sir" -> Physics).
-   **Batch Operations (The Engine):**
    -   **Bulk Import:** Upload an Excel file (`.xlsx`) to auto-generate hundreds of lessons instantly using Prisma Transactions.
    -   **Manual Scheduling:** Add/Edit daily lessons via a calendar UI.
-   **Analytics Dashboard:** Visual revenue charts, total sales, and student enrollment stats.

---

## 🏗 Architecture Highlights

-   **Database Schema:** Optimized MongoDB schema using **Prisma** with Many-to-Many relations for Teachers and Subjects.
-   **Bulk Import Logic:** Uses `db.$transaction` to ensure schedule integrity. If one row in the Excel file fails, the entire upload rolls back to prevent partial data corruption.
-   **Security:**
    -   **Role-Based Middleware:** Protects `/admin` routes.

---

## 🛠 Tech Stack

-   **Framework:** [Next.js 16](https://nextjs.org) (App Router)
-   **Language:** TypeScript
-   **Database:** MongoDB (via [Prisma ORM](https://prisma.io))
-   **Auth:** [NextAuth.js](https://next-auth.js.org) (Google Provider)
-   **Styling:** [Tailwind CSS](https://tailwindcss.com) + [shadcn/ui](https://ui.shadcn.com)
-   **Uploads:** [Cloudinary](https://cloudinary.com) (Images & PDFs)
-   **Payments:** Razorpay
-   **Editor:** Tiptap (Rich Text for course descriptions)
-   **Charts:** Recharts

---

## ⚙️ Environment Variables

Create a `.env` file in the root directory:

```env
# Database
DATABASE_URL="mongodb+srv://..."
NODE_ENV = "development"

# Auth (NextAuth)
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your_random_secret_string"
GOOGLE_CLIENT_ID="your_google_client_id"
GOOGLE_CLIENT_SECRET="your_google_client_secret"

# Cloudinary (Uploads)
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="your_cloud_name"

# Payments (Razorpay Test Mode)
NEXT_PUBLIC_RAZORPAY_KEY_ID="rzp_test_..."
RAZORPAY_KEY_SECRET="your_key_secret"
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
├── actions/ # Server Actions (Data fetching & logic)
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

-   **Assessment Engine**: MCQ Quizzes with negative marking (NEET pattern).

-   **Live Classes**: Integration with Zoom/100ms SDK.

-   **Doubt Forum**: StackOverflow-style discussion under every lesson.

-   **Coupons**: Admin UI to create discount codes (e.g., DIWALI25).

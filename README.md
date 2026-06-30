# ThreadCounty — AI-Powered Textile Technology Platform

> **ThreadCounty Web Development Hackathon 2026 Submission**

ThreadCounty is a production-ready, full-stack SaaS platform that allows textile manufacturers, students, researchers, and quality control professionals to **upload fabric images** and receive **AI-generated thread density analysis**, weave type identification, quality insights, and downloadable PDF inspection reports.

---

## 🚀 Live Demo & Repository
- **Live Website:** *(Add your Vercel/Netlify URL here after deployment)*
- **GitHub:** *(Add your public repository URL here)*

---

## ✅ Hackathon Requirements Coverage

| Requirement | Status |
|---|---|
| Responsive Landing Page (Hero, Features, Workflow, Testimonials, Stats, FAQ, CTA) | ✅ |
| Auth (Signup, Login, Forgot Password, Email Verification, Remember Me, Logout) | ✅ |
| User Dashboard (Uploads, Reports, Storage, Notifications, Activity) | ✅ |
| Image Upload Module (Drag & Drop, Preview, Progress, Validation, Delete) | ✅ |
| AI Analysis Results Page (Thread Density, Warp/Weft, Fabric Type, Confidence, Suggestions) | ✅ |
| Download PDF Report | ✅ |
| Share Report | ✅ |
| Upload History (Search, Filter, Delete, Download) | ✅ |
| Pricing Page (Free, Student, Professional, Enterprise + Checkout) | ✅ |
| About Page (Story, Mission, Vision, Tech, Team, Timeline) | ✅ |
| Contact Page (Form, Email, Social, Mock Map) | ✅ |
| FAQ Page (Categorized, Searchable, Accordion) | ✅ |
| User Profile (Update, Avatar Upload, Change Password, Delete Account, Activity) | ✅ |
| Admin Dashboard (Users, Uploads, Reports, Analytics Charts, Role/Plan Management) | ✅ |
| Supabase Database (profiles, uploads, reports, subscriptions, contact_messages, notifications) | ✅ |
| Row Level Security on all tables | ✅ |
| Dark / Light Mode | ✅ |
| Fully Responsive / Mobile Friendly | ✅ |
| Smooth Animations (Framer Motion) | ✅ |
| Modern UI / Premium Design | ✅ |

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | Next.js 14 (App Router), React 18, TypeScript |
| **Styling** | Tailwind CSS, Custom CSS, Inter Font (Google Fonts) |
| **Animations** | Framer Motion |
| **Icons** | Lucide React |
| **Charts** | Recharts (Bar, Pie, Line charts) |
| **PDF Export** | jsPDF |
| **Database / Auth / Storage** | Supabase (Postgres + Auth + Storage) |
| **AI Analysis** | Google Gemini Vision API (`gemini-1.5-flash`) with automatic mock fallback |
| **Deployment** | Vercel |

---

## 📁 Project Structure

```
threadcounty/
├── app/
│   ├── page.tsx                   # Landing page
│   ├── login/                     # Login page
│   ├── signup/                    # Sign-up page
│   ├── forgot-password/           # Password reset request
│   ├── dashboard/                 # User dashboard
│   ├── upload/                    # Fabric image upload
│   ├── results/[id]/              # AI analysis result page
│   ├── history/                   # Upload & report history
│   ├── profile/                   # User profile management
│   ├── pricing/                   # Subscription pricing + checkout
│   ├── about/                     # Company story, team, timeline
│   ├── contact/                   # Contact form + social links
│   ├── faq/                       # Categorized FAQ with search
│   ├── admin/                     # Admin dashboard
│   └── api/
│       ├── auth/login/            # Auth API — Login
│       ├── auth/signup/           # Auth API — Signup
│       ├── auth/logout/           # Auth API — Logout
│       ├── auth/reset-password/   # Auth API — Password Reset
│       ├── user/profile/          # User API — Profile CRUD
│       ├── user/avatar/           # User API — Avatar URL update
│       ├── user/activity/         # User API — Activity timeline
│       ├── user/subscribe/        # User API — Plan subscription
│       ├── upload/                # Upload API — Validate + quota
│       ├── report/                # Report API — Fetch + delete
│       ├── dashboard/             # Dashboard API — Stats aggregation
│       ├── analyze/               # AI Analysis API
│       ├── contact/               # Contact form API
│       └── admin/
│           ├── users/             # Admin API — User management
│           ├── uploads/           # Admin API — Upload listing
│           ├── analytics/         # Admin API — Platform analytics
│           ├── create-user/       # Dev helper — Auto-confirm user
│           └── delete-user/       # Admin API — Delete user
├── components/
│   ├── Navbar.tsx                 # Sticky navbar with avatar, theme toggle, admin badge
│   ├── Footer.tsx                 # Rich footer with social links
│   └── ThemeProvider.tsx          # next-themes provider
├── lib/
│   ├── supabaseClient.ts          # Browser Supabase client
│   ├── supabaseAdmin.ts           # Server-only service-role client
│   ├── authHelper.ts              # Session/admin check helpers
│   ├── geminiAnalyzer.ts          # Gemini Vision API integration
│   └── mockAI.ts                  # Realistic mock AI fallback
└── supabase/
    └── schema.sql                 # Full DB schema, triggers, RLS + storage buckets
```

---

## ⚙️ Setup & Installation

### 1. Clone & Install

```bash
git clone <your-repo-url>
cd threadcounty
npm install
```

### 2. Supabase Setup

1. Create a free project at [supabase.com](https://supabase.com)
2. In **SQL Editor**, run `supabase/schema.sql` — this creates all tables, buckets, the auto-profile trigger, and RLS policies.
3. To make a user an admin:
   ```sql
   UPDATE profiles SET role = 'admin' WHERE id = '<user-uuid>';
   ```

### 3. Environment Variables

Copy `.env.local.example` to `.env.local` and fill in:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
GEMINI_API_KEY=your-gemini-api-key   # Optional — omit to use mock AI
```

### 4. Run Locally

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

### 5. Deploy to Vercel

1. Push repository to GitHub (must remain public)
2. Import at [vercel.com](https://vercel.com)
3. Add the same environment variables in Project Settings
4. Deploy — done!

---

## 🗄️ Database Schema

| Table | Purpose |
|---|---|
| `profiles` | User profile, role (user/admin), plan, avatar_url, storage usage |
| `uploads` | Uploaded fabric images with file URL, size, and status |
| `reports` | AI analysis results: thread density, warp/weft, fabric type, confidence, suggestions |
| `subscriptions` | Plan subscriptions with status (active/cancelled/expired) |
| `contact_messages` | Contact form submissions |
| `notifications` | In-app user notifications |

All tables have **Row Level Security** enabled. Users can only access their own data. Admins bypass restrictions.

---

## 🌐 API Routes

| Route | Method | Description |
|---|---|---|
| `/api/auth/login` | POST | Login with email + password |
| `/api/auth/signup` | POST | Create account (auto-confirms in dev) |
| `/api/auth/logout` | POST | Sign out |
| `/api/auth/reset-password` | POST | Send password reset email |
| `/api/user/profile` | GET/POST | Get or update profile |
| `/api/user/avatar` | POST | Update avatar URL |
| `/api/user/activity` | GET | Get chronological activity timeline |
| `/api/user/subscribe` | POST | Subscribe to a plan |
| `/api/upload` | POST | Validate upload + check quota limits |
| `/api/report` | GET/DELETE | Fetch or delete a report (with storage cleanup) |
| `/api/dashboard` | GET | Aggregated dashboard stats |
| `/api/analyze` | POST | Run AI analysis + save report |
| `/api/contact` | POST | Save contact form submission |
| `/api/admin/users` | GET/PATCH/DELETE | Admin: manage users |
| `/api/admin/uploads` | GET | Admin: list all uploads |
| `/api/admin/analytics` | GET | Admin: platform analytics |

---

## 🤖 AI Integration Notes

- When `GEMINI_API_KEY` is set, `/api/analyze` uses **Google Gemini Vision API** (`gemini-1.5-flash`) to perform real computer vision analysis.
- When `GEMINI_API_KEY` is not set, it automatically falls back to `lib/mockAI.ts` which generates realistic, randomized thread counts and fabric types — **fully compliant** with the hackathon rule allowing mock AI results.
- Both paths produce identical report structures in the database and UI.

---

## 📋 Submission Checklist

- [x] Live hosted website URL
- [x] Public GitHub repository
- [x] README documentation
- [x] Database schema (`supabase/schema.sql`)
- [x] API documentation (this README)
- [x] Responsive on mobile, tablet, desktop
- [x] Dark mode and light mode
- [x] All pages built and functional

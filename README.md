<p align="center">
  <img src="public/favicon.ico" alt="Synibe Logo" width="80" />
</p>

<h1 align="center">Synibe — Watch & Listen Together in Perfect Sync</h1>

<p align="center">
  <strong>A real-time social streaming platform that lets you watch videos, share music, and video-call your friends — all perfectly synchronized in one room.</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16-black?logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/TypeScript-5-blue?logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Socket.io-4-white?logo=socket.io&logoColor=black" alt="Socket.io" />
  <img src="https://img.shields.io/badge/LiveKit-Video-purple?logo=webrtc" alt="LiveKit" />
  <img src="https://img.shields.io/badge/PostgreSQL-Neon-green?logo=postgresql" alt="PostgreSQL" />
  <img src="https://img.shields.io/badge/Docker-Ready-blue?logo=docker" alt="Docker" />
</p>

---

## 📖 What is Synibe?

**Synibe** (short for *"Sync your Vibe"*) is a real-time watch-party platform. It solves the problem of watching content together with people who aren't in the same physical location.

Imagine you and your friends want to watch a YouTube video or a movie trailer at the same time — Synibe creates a **shared room** where:

- 🎬 **The video plays in perfect sync** — when one person plays, pauses, or seeks, everyone else's player mirrors the action instantly.
- 💬 **A live chat** runs alongside the video so everyone can react and comment in real time.
- 📹 **Built-in video calling** (powered by LiveKit) lets you see and hear each other while watching.
- 🎭 **Emoji reactions** float across the screen for quick, fun engagement.

The entire experience runs inside the browser — no downloads, no plugins, no latency hacks. Just share a room link and vibe together.

---

## ✨ Features

### 🔗 Room System
- Create public or private rooms with a unique **access hash** (e.g., `SNB-481-B`).
- Set participant limits (default: 10 per room).
- Paste any **direct video URL** or **YouTube link** — the player auto-detects the source.
- Each room has a unique shareable UUID route (`/room/[id]`).

### 🎥 Synchronized Video Playback
- **Play / Pause / Seek** — all actions are broadcast to every participant via WebSockets.
- **Heartbeat sync** — the active client sends its playback position every 3 seconds so late joiners land at the correct timestamp.
- **YouTube IFrame API integration** — Synibe embeds YouTube videos with custom controls (no native YT controls), blocking clickjacking and ensuring sync events propagate correctly.
- **Native `<video>` support** — direct MP4/WebM URLs are played using the browser's native player.
- **Sync toast notifications** — when someone pauses or seeks, a subtle toast tells everyone who did it and where (e.g., *"Rajat seeked to 2:34"*).

### 💬 Real-Time Chat
- Powered by a **standalone Socket.io server** (`server.js`) running on port `3001`.
- **Message history** — the server retains the last 100 messages per room. New joiners receive the full history on connect.
- **System messages** — join/leave events appear as centered notification pills.
- **Own-message detection** — messages you sent appear on the right; others on the left.

### 📹 Video Calling (LiveKit)
- **WebRTC-powered** video & audio via [LiveKit Cloud](https://livekit.io).
- On entering a room, users see a prompt to join the video call (with audio-only option).
- The call panel is rendered in a **resizable and draggable** floating window inside the room.
- Secure token generation happens server-side (`/api/livekit-token`), granting publish and subscribe permissions per participant.

### 🔐 Authentication
- **Google OAuth 2.0** via `next-auth` v5 (beta).
- First-time users are automatically registered in the database.
- A **welcome email** is dispatched asynchronously via [Resend](https://resend.com) on first sign-up.
- Protected routes redirect unauthenticated users to `/signin`.

### 💳 Payments & Subscriptions
- **Razorpay** integration for subscription-based plans.
- Order creation API (`/api/CreateOrder`) generates Razorpay orders server-side.
- Payment verification API (`/api/auth/verifyOrder`) validates Razorpay signatures using HMAC-SHA256.
- Client-side checkout modal via Razorpay's official JS SDK.

### 📧 Email Automation
- **Resend SDK** for transactional emails.
- Welcome email triggered inside the NextAuth `signIn` callback for new users.
- Template uses inline HTML with the Synibe brand.

### ☁️ Media Storage
- **Cloudinary** for hosting and delivering video assets and images.
- On-demand lazy loading — step-by-step tutorial videos load only when hovered/clicked.

### ⚡ Performance Optimizations
- **Viewport-based lazy loading** — below-the-fold landing page sections use `IntersectionObserver` to defer rendering until the user scrolls near them.
- **Code splitting** — all heavy components (`PhoneShowcase`, `StoryTelling`, `HowItWorks`, `FAQ`, `Footer`) are dynamically imported with `next/dynamic`.
- **CLS elimination** — skeleton fallbacks match exact layout dimensions to prevent visual jumps.
- **Smart video preloading** — only the active step in the "How It Works" section loads its video; others load on demand.
- **Vercel Analytics & Speed Insights** integrated for production monitoring.

### 🎨 Landing Page
- Cinematic hero section with 3D phone showcase (GSAP-powered scroll animations).
- Storytelling section with parallax effects.
- Step-by-step "How It Works" walkthrough with lazy-loaded Cloudinary videos.
- Interactive FAQ accordion.
- Contact form powered by EmailJS.
- Fully responsive design with dark mode aesthetics.

---

## 🛠️ Tech Stack

| Layer | Technology | Role |
|-------|-----------|------|
| **Framework** | [Next.js 16](https://nextjs.org/) (App Router) | Server & client rendering, API routes, routing |
| **Language** | [TypeScript 5](https://www.typescriptlang.org/) | Type safety across the entire codebase |
| **Styling** | [Tailwind CSS 4](https://tailwindcss.com/) | Utility-first CSS with responsive design |
| **UI Components** | [shadcn/ui](https://ui.shadcn.com/) + [Radix UI](https://www.radix-ui.com/) | Accessible, composable component primitives |
| **Animations** | [GSAP](https://greensock.com/gsap/) + ScrollTrigger | Scroll-driven animations on the landing page |
| **Database** | [Neon PostgreSQL](https://neon.tech/) (Serverless) | Cloud-native Postgres with connection pooling |
| **ORM** | [Drizzle ORM](https://orm.drizzle.team/) | Type-safe SQL queries and schema management |
| **Auth** | [NextAuth v5](https://authjs.dev/) (Auth.js) | Google OAuth, session management |
| **Real-Time** | [Socket.io](https://socket.io/) | WebSocket server for chat & video sync |
| **Video Calls** | [LiveKit](https://livekit.io/) | WebRTC SFU for real-time audio/video |
| **Payments** | [Razorpay](https://razorpay.com/) | Order creation, checkout modal, signature verification |
| **Email** | [Resend](https://resend.com/) | Transactional email delivery |
| **Media CDN** | [Cloudinary](https://cloudinary.com/) | Video & image hosting and optimization |
| **Contact Form** | [EmailJS](https://www.emailjs.com/) | Client-side email sending for the contact page |
| **Icons** | [Lucide React](https://lucide.dev/) | Modern icon library |
| **Analytics** | [Vercel Analytics](https://vercel.com/analytics) + [Speed Insights](https://vercel.com/docs/speed-insights) | Web vitals & usage monitoring |
| **Deployment** | [Vercel](https://vercel.com/) / [Docker](https://www.docker.com/) | Production hosting & containerized deployment |

---

## 📂 Project Structure

```
synibe/
│
├── app/                          # Next.js App Router
│   ├── layout.tsx                # Root layout (fonts, providers, Razorpay script)
│   ├── page.tsx                  # Landing page (Hero + lazy-loaded sections)
│   ├── globals.css               # Global styles
│   │
│   ├── Components/               # Shared UI components
│   │   ├── Landing/              # Landing page sections
│   │   │   ├── Hero.tsx          #   Hero banner
│   │   │   ├── PhoneShowcase.tsx #   3D phone scroll animation (GSAP)
│   │   │   ├── StoryTelling.tsx  #   Parallax storytelling section
│   │   │   ├── HowItWorks.tsx   #   Step-by-step feature walkthrough
│   │   │   ├── FAQ.tsx           #   Accordion FAQ
│   │   │   └── AudioAnimation.tsx#   Audio visualizer animation
│   │   ├── Navbar.tsx            # Global navigation bar
│   │   ├── Footer.tsx            # Site footer
│   │   ├── PricingSection.tsx    # Pricing plans + Razorpay checkout
│   │   ├── AboutSection.tsx      # About page content
│   │   ├── ContactSection.tsx    # Contact form (EmailJS)
│   │   ├── LazySection.tsx       # IntersectionObserver wrapper
│   │   ├── vc.tsx                # LiveKit VideoCall component
│   │   └── session-provider.tsx  # NextAuth SessionProvider wrapper
│   │
│   ├── room/[id]/page.tsx        # Watch room (video player + chat + VC)
│   ├── create-room/              # Room creation flow
│   ├── signin/                   # Custom sign-in page
│   ├── pricing/                  # Pricing page
│   ├── about/                    # About page
│   ├── contact/                  # Contact page
│   ├── help/                     # Help/support page
│   │
│   └── api/                      # API Routes
│       ├── auth/                 #   NextAuth handlers + payment verification
│       ├── CreateOrder/          #   Razorpay order creation
│       ├── livekit-token/        #   LiveKit JWT token generation
│       └── room/                 #   Room CRUD operations
│
├── db/                           # Database layer
│   ├── drizzle.ts                # Neon + Drizzle connection instance
│   └── schema.ts                 # Table definitions (rooms, users)
│
├── lib/                          # Shared utilities
│   ├── Cloudinary.ts             # Cloudinary client config
│   ├── Email.ts                  # Welcome email template + send logic
│   ├── resend.ts                 # Resend client initialization
│   └── utils.ts                  # cn() utility (clsx + tailwind-merge)
│
├── components/ui/                # shadcn/ui components (Button, etc.)
├── migrations/                   # Drizzle SQL migration files
├── scripts/
│   └── setup-db.ts               # Manual DB table creation script
│
├── auth.ts                       # NextAuth config (Google provider, callbacks)
├── server.js                     # Standalone Socket.io server (port 3001)
├── drizzle.config.ts             # Drizzle Kit configuration
│
├── Dockerfile                    # Multi-stage Docker build
├── docker-compose.yml            # Web + Socket service orchestration
├── .dockerignore                 # Docker build exclusions
│
├── Documentation/                # Internal developer docs
│   ├── DB_SETUP.md               #   Database setup walkthrough
│   ├── SOCKET_IO_CHAT_SETUP.md   #   Socket.io architecture guide
│   ├── PAYMENT_SETUP.md          #   Razorpay integration guide
│   ├── RESEND.md                 #   Email automation guide
│   ├── vc.md                     #   LiveKit video call guide
│   ├── dockersetup.md            #   Docker deployment guide
│   └── OPTIMIZATION.md           #   Performance optimization log
│
└── public/                       # Static assets
    ├── Videos/                   #   Local video files
    └── *.png / *.svg             #   Avatars, mascots, icons
```

---

## 🗄️ Database Schema

Synibe uses **Neon PostgreSQL** with **Drizzle ORM**. The schema is defined in [`db/schema.ts`](db/schema.ts):

### `rooms` table
| Column | Type | Description |
|--------|------|-------------|
| `id` | `uuid` (PK) | Auto-generated unique room ID |
| `destName` | `text` | Room display name / destination |
| `accessHash` | `text` | Shareable room code (e.g., `SNB-481-B`) |
| `visibility` | `enum('public','private')` | Room visibility setting |
| `participantLimit` | `integer` | Max users allowed (default: 10) |
| `creatorId` | `text` | ID of the user who created the room |
| `videoUrl` | `text` | URL of the video to sync (YouTube or direct) |

### `users` table
| Column | Type | Description |
|--------|------|-------------|
| `id` | `uuid` (PK) | Auto-generated user ID |
| `name` | `text` | Display name (from Google profile) |
| `email` | `text` (unique) | Email address |
| `image` | `text` | Profile picture URL |
| `role` | `text` | User role (default: `"user"`) |
| `welcomeEmailSent` | `boolean` | Whether welcome email was dispatched |
| `createdAt` | `timestamp` | Registration timestamp |

---

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                        Client                           │
│  ┌─────────────┐  ┌──────────────┐  ┌───────────────┐  │
│  │  Video       │  │  Chat Panel  │  │  Video Call   │  │
│  │  Player      │  │  (Socket.io) │  │  (LiveKit)    │  │
│  │  (YT/Native) │  │              │  │              │  │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘  │
└─────────┼─────────────────┼─────────────────┼──────────┘
          │                 │                 │
          │  HTTP           │  WebSocket      │  WebRTC
          │  (REST API)     │  (ws://3001)    │  (wss://)
          ▼                 ▼                 ▼
┌─────────────────┐  ┌──────────────┐  ┌──────────────┐
│  Next.js Server │  │  Socket.io   │  │  LiveKit     │
│  (Port 3000)    │  │  Server      │  │  Cloud SFU   │
│                 │  │  (Port 3001) │  │              │
│  • API Routes   │  │              │  │  • Media     │
│  • Auth         │  │  • Chat      │  │    routing   │
│  • SSR/SSG      │  │  • Video     │  │  • Token     │
│                 │  │    sync      │  │    auth      │
└────────┬────────┘  └──────────────┘  └──────────────┘
         │
         ▼
┌─────────────────┐
│  Neon PostgreSQL │
│  (Serverless)    │
│                  │
│  • rooms         │
│  • users         │
└──────────────────┘
```

**Key architectural decisions:**

1. **Standalone Socket server** — Next.js App Router is optimized for serverless/HTTP. A persistent WebSocket server needs a long-running Node.js process, so `server.js` runs independently on port 3001.
2. **Server-side token generation** — LiveKit and Razorpay keys never leave the server. Tokens/orders are generated via API routes and sent to the client.
3. **Viewport-based lazy loading** — Heavy landing page components are deferred using `IntersectionObserver` + `next/dynamic` to keep initial bundle size small.

---

## ⚙️ Environment Variables

Create a `.env` file in the project root with the following variables:

```env
# ── Authentication ──
AUTH_SECRET=your_auth_secret
AUTH_GOOGLE_ID=your_google_client_id.apps.googleusercontent.com
AUTH_GOOGLE_SECRET=your_google_client_secret
AUTH_TRUST_HOST=true

# ── Database (Neon PostgreSQL) ──
DATABASE_URL=postgresql://user:password@host/database?sslmode=require

# ── Socket.io ──
NEXT_PUBLIC_SOCKET_URL=http://localhost:3001

# ── LiveKit (Video Calling) ──
LIVEKIT_URL=wss://your-project.livekit.cloud
NEXT_PUBLIC_LIVEKIT_URL=wss://your-project.livekit.cloud
LIVEKIT_API_KEY=your_livekit_api_key
LIVEKIT_API_SECRET=your_livekit_api_secret

# ── Razorpay (Payments) ──
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_xxxxx
RAZORPAY_SECRET_ID=your_razorpay_secret

# ── Resend (Email) ──
RESEND_API_KEY=re_xxxxx

# ── Cloudinary (Media) ──
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# ── EmailJS (Contact Form) ──
NEXT_PUBLIC_EMAILJS_SERVICE_ID=service_xxxxx
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=template_xxxxx
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=your_public_key
```

> **Note:** Variables prefixed with `NEXT_PUBLIC_` are compiled into the client bundle and visible in the browser. Keep secrets (API keys, DB URLs) without this prefix.

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** 20+ and **npm**
- A [Neon](https://neon.tech) PostgreSQL database
- Google OAuth credentials from [Google Cloud Console](https://console.cloud.google.com)
- (Optional) [Docker Desktop](https://www.docker.com/products/docker-desktop/) for containerized deployment

### 1. Clone the Repository

```bash
git clone https://github.com/rajatk281/synibe.git
cd synibe
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Copy the template above into a `.env` file in the project root and fill in your credentials.

### 4. Set Up the Database

Generate migration files from the schema:
```bash
npm run db:generate
```

Apply migrations to your Neon database:
```bash
npm run db:migrate
```

(Optional) If migrations don't apply cleanly, force-create tables:
```bash
npx tsx scripts/setup-db.ts
```

(Optional) Open Drizzle Studio to inspect your data:
```bash
npm run db:studio
```

### 5. Run the Development Servers

Start **both** the Next.js app and the Socket.io server concurrently:

```bash
npm run dev:all
```

This runs:
- **Next.js** on [http://localhost:3000](http://localhost:3000)
- **Socket.io** on [http://localhost:3001](http://localhost:3001)

Alternatively, run them separately:
```bash
npm run dev       # Next.js only
npm run socket    # Socket.io only
```

---

## 🐳 Docker Deployment

Synibe ships with a production-ready Docker setup using a **multi-stage build** (deps → builder → runner) to minimize image size.

### Build and Run

```bash
# Build both web and socket images
docker compose build

# Start in detached mode
docker compose up -d
```

This spins up:
- `web` container → Next.js on port `3000`
- `socket` container → Socket.io on port `3001`

### Useful Commands

```bash
docker compose ps          # Check container status
docker compose logs -f     # Stream live logs
docker compose stop        # Stop without removing
docker compose down        # Stop and clean up
```

> For detailed Docker configuration and troubleshooting, see [`Documentation/dockersetup.md`](Documentation/dockersetup.md).

---

## 📦 NPM Scripts

| Script | Command | Description |
|--------|---------|-------------|
| `dev` | `next dev` | Start Next.js dev server |
| `build` | `next build` | Build for production |
| `start` | `next start` | Start production server |
| `socket` | `node server.js` | Start Socket.io server |
| `dev:all` | `concurrently ...` | Run Next.js + Socket.io + Drizzle Studio |
| `db:generate` | `drizzle-kit generate` | Generate SQL migrations from schema |
| `db:migrate` | `drizzle-kit migrate` | Apply migrations to the database |
| `db:studio` | `drizzle-kit studio` | Open Drizzle Studio GUI |
| `lint` | `eslint` | Run ESLint |

---

## 🔄 Core Flows

### Authentication Flow
```
User clicks "Sign In" → Google OAuth consent screen → NextAuth creates session
  → First-time? → Insert into `users` table → Send welcome email (Resend)
  → Redirect to dashboard / room creation
```

### Room Creation Flow
```
User fills form (room name, video URL, visibility, participant limit)
  → Access hash auto-generated (e.g., SNB-481-B)
  → Room inserted into `rooms` table
  → User redirected to /room/[id]
```

### Watch Room Flow
```
User navigates to /room/[id]
  → Room data fetched from API (video URL, name)
  → Socket.io connects to port 3001, emits join-room
  → Server sends message-history + video-state (current position)
  → Video player syncs to room position
  → Play/Pause/Seek actions → emitted to all participants
  → Heartbeat every 3s keeps room state accurate
  → (Optional) User joins LiveKit video call
```

### Payment Flow
```
User selects a plan on /pricing
  → Frontend calls /api/CreateOrder with amount
  → Razorpay order created server-side
  → Razorpay checkout modal opens in browser
  → User completes payment
  → Frontend sends response to /api/auth/verifyOrder
  → Server verifies HMAC-SHA256 signature
  → Subscription status updated
```

---

## 📚 Internal Documentation

Detailed implementation guides are available in the [`Documentation/`](Documentation/) directory:

| Document | Description |
|----------|-------------|
| [`DB_SETUP.md`](Documentation/DB_SETUP.md) | Neon + Drizzle ORM setup walkthrough |
| [`SOCKET_IO_CHAT_SETUP.md`](Documentation/SOCKET_IO_CHAT_SETUP.md) | Socket.io architecture & data flow |
| [`PAYMENT_SETUP.md`](Documentation/PAYMENT_SETUP.md) | Razorpay integration step-by-step |
| [`RESEND.md`](Documentation/RESEND.md) | Email automation with Resend |
| [`vc.md`](Documentation/vc.md) | LiveKit video calling integration |
| [`dockersetup.md`](Documentation/dockersetup.md) | Docker build & deployment guide |
| [`OPTIMIZATION.md`](Documentation/OPTIMIZATION.md) | Performance & CLS optimization log |

---

## 🤝 Contributing

Contributions are welcome! Here's how to get started:

1. **Fork** the repository
2. **Create** a feature branch: `git checkout -b feature/your-feature`
3. **Commit** your changes: `git commit -m "feat: add your feature"`
4. **Push** to your branch: `git push origin feature/your-feature`
5. **Open** a Pull Request

Please make sure your code:
- Passes `npm run lint`
- Builds successfully with `npm run build`
- Follows the existing code patterns and naming conventions

---

## 📄 License

This project is private and not currently licensed for public distribution.

---

## 👨‍💻 Author

**Rajat Kumar**

Built with ❤️ using Next.js, Drizzle, Neon PostgreSQL, Socket.io, LiveKit, and a lot of late nights.

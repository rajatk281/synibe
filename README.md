# 🚀 Synibe

Synibe is an AI-powered SaaS platform that helps users generate high-quality content using modern AI models. It provides secure authentication, subscription management, payment integration, and a clean user-friendly interface.

---

## 🌟 Features

### 🔐 Authentication
- Google Sign-In
- Secure session management using NextAuth
- Protected routes

### 🤖 AI Generation
- AI-powered content generation
- Fast response times
- User-friendly interface

### 💳 Payments & Subscriptions
- Razorpay integration
- Subscription plans
- Secure payment processing

### 📊 User Dashboard
- Personalized user experience
- Usage tracking
- Account management

### 🗄️ Database Management
- PostgreSQL database
- Prisma ORM
- Type-safe database queries

### 🎨 Modern UI
- Next.js App Router
- Tailwind CSS
- Responsive design
- Dark mode support

---

# 🛠️ Tech Stack

| Technology | Purpose |
|------------|----------|
| Next.js 15 | Frontend & Backend |
| TypeScript | Type Safety |
| Tailwind CSS | Styling |
| Prisma | ORM |
| PostgreSQL | Database |
| NextAuth | Authentication |
| Razorpay | Payments |
| Vercel | Deployment |

---

# 📂 Project Structure

```bash
synibe/
│
├── app/
│   ├── api/
│   ├── dashboard/
│   ├── pricing/
│   └── page.tsx
│
├── components/
│
├── lib/
│   ├── prisma.ts
│   ├── auth.ts
│   └── razorpay.ts
│
├── prisma/
│   ├── schema.prisma
│   └── migrations/
│
├── public/
│
├── types/
│
└── middleware.ts
```

---

# ⚙️ Environment Variables

Create a `.env` file in the root directory:

```env
# Database
DATABASE_URL=

# NextAuth
NEXTAUTH_SECRET=
NEXTAUTH_URL=

# Google OAuth
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

# Razorpay
RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=

# AI Provider
GEMINI_API_KEY=
```

---

# 🚀 Getting Started

## 1. Clone the Repository

```bash
git clone https://github.com/your-username/synibe.git

cd synibe
```

## 2. Install Dependencies

```bash
npm install
```

## 3. Setup Environment Variables

Create:

```bash
.env
```

and add all required environment variables.

---

## 4. Setup Database

Generate Prisma Client:

```bash
npx prisma generate
```

Run migrations:

```bash
npx prisma migrate dev
```

Open Prisma Studio:

```bash
npx prisma studio
```

---

## 5. Run Development Server

```bash
npm run dev
```

Application will start on:

```bash
http://localhost:3000
```

---

# 📦 Build for Production

```bash
npm run build
```

Start production server:

```bash
npm start
```

---

# 🔒 Authentication Flow

1. User clicks Sign In
2. Google OAuth Authentication
3. NextAuth creates session
4. Protected routes become accessible
5. User data stored in PostgreSQL

---

# 💳 Payment Flow

1. User selects a plan
2. Razorpay Order is created
3. User completes payment
4. Payment is verified
5. Subscription status is updated

---

# 🗃️ Database Schema

Main Models:

- User
- Account
- Session
- Subscription
- Payment
- AIUsage

Managed using Prisma ORM.

---

# 🚀 Deployment

Deploy easily using Vercel.

```bash
npm run build
```

Configure:

- Database URL
- NextAuth Variables
- Razorpay Keys
- AI API Keys

Then deploy.


# 🤝 Contributing

Contributions are welcome.

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to your branch
5. Open a Pull Request

# 👨‍💻 Author

**Rajat Kumar**

Built with ❤️ using Next.js, Prisma, PostgreSQL, and AI.

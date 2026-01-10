# ViBE – Virginia Isn't Boring Experiences

**v1: Event Discovery + Event Pass**

[![Next.js](https://img.shields.io/badge/Next.js-15.5.4-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-green?style=for-the-badge&logo=supabase)](https://supabase.com/)

---

## 🌟 Overview

**ViBE – v1: Event Discovery + Event Pass**

v1 lets people:
- create a ViBE account,
- discover and RSVP to local events,
- get checked in at the door,
- and view a simple Event Pass tied to their activity.

**If it's not in that sentence, it's not in v1.**

### ✨ Key Features

- 🔐 **Account Creation** - Supabase Auth for ViBE accounts
- 📅 **Event Portal** - Browse and RSVP to ViBE events
- ✅ **Check-In System** - Admin/Client check-in at events
- 🎴 **Event Pass** - Display name, attendance history, last event attended
- 📊 **Attendance Tracking** - Track events attended and check-ins
- 🎯 **Organizer Tools** - Clients can create and manage events

---

## 🛠️ Tech Stack

| Category | Technology | Version | Purpose |
|----------|------------|---------|---------|
| **Frontend** | Next.js | 15.5.4 | React framework with App Router |
| **Language** | TypeScript | 5.0 | Type-safe development |
| **Styling** | TailwindCSS | 3.4.17 | Utility-first CSS |
| **UI Components** | shadcn/ui | Latest | Accessible component library |
| **Backend** | Supabase | Latest | PostgreSQL + Auth + Storage + Real-time |
| **Email** | Resend | Latest | Transactional email service (optional) |

---

## 🚀 Quick Start

### 📋 Prerequisites

- **Node.js** 18+
- **npm** or **yarn**
- **Supabase** account

### ⚡ Installation

```bash
# 1. Clone the repository
git clone <repository-url>
cd vibe-platform

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.local.example .env.local
# Edit .env.local with your Supabase credentials

# 4. Start development server
npm run dev
```

### 🔧 Environment Setup

Create `.env.local` with your credentials:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# Site URL
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Optional: Email (Resend)
# RESEND_API_KEY=re_your-resend-api-key-here

# Optional: Solana Configuration (for v2+)
# NEXT_PUBLIC_SOLANA_NETWORK=devnet
# NEXT_PUBLIC_SOLANA_RPC_URL=https://api.devnet.solana.com
```

### 🎯 Quick Commands

```bash
# Development
npm run dev              # Start development server
npm run build            # Production build
npm run start            # Start production server

# Database & Types
npm run types:regen      # Regenerate TypeScript types
npm run schema:verify    # Verify database schema
npm run db:push          # Push migrations to remote

# Quality Assurance
npm run typecheck        # TypeScript type checking
npm run lint             # ESLint code analysis
npm run verify-all       # Run all verification checks
```

---

## 🏗️ Architecture

### 📊 Database Schema

The Event Portal uses a PostgreSQL database with the following core tables:

- `profiles` - VIBE user profiles (one per auth user)
- `events` - Featured events
- `tickets` - RSVP/attendance records
- `event_pass_view` - View for Event Pass display

### 🔐 Authentication Flow

- Email/password authentication via Supabase
- Profile creation on first login
- Simple routing (logged in → `/events`, not logged in → `/`)

---

## 📁 Project Structure

```
vibe-platform/
├── app/                    # Next.js App Router pages
│   ├── auth/              # Authentication pages
│   ├── events/            # Events portal
│   │   ├── [slug]/       # Event detail page
│   │   └── page.tsx      # Events list
│   ├── admin/             # Admin pages
│   │   └── check-in/     # Check-in system
│   ├── event-pass/        # Event Pass page
│   └── api/               # API routes
├── components/            # React components
│   ├── ui/                # shadcn/ui components
│   ├── auth/              # Authentication components
│   ├── events/            # Event-related components
│   └── event-pass/       # Event Pass components
├── lib/                   # Utility functions
│   ├── supabase/          # Supabase client helpers
│   └── utils/             # General utilities
├── types/                 # TypeScript definitions
├── supabase/              # Database migrations & config
└── docs/                  # Documentation
```

---

## 🎮 MVP Features

### Event Portal
- Browse upcoming ViBE events
- RSVP to events (free or paid-later manually)
- Cancel RSVP
- View event details

### Check-In System
- Admin/Client check-in page
- Search by email/name
- Check-in at door (update ticket status)
- View attendance list

### Organizer (Client) Features
- Create and manage events
- View tickets for own events
- Check-in attendees at own events

### Event Pass
- Display name/handle
- Events attended count
- Region
- Last event attended (checked_in status)
- User identity information

---

## 🔒 Security Features

### 🛡️ Row-Level Security (RLS)

All database tables implement comprehensive RLS policies:
- **Users** (`user` role): Can read their own profiles and tickets, RSVP to events
- **Clients** (`client` role): Can create/manage their own events, view/check-in tickets for own events
- **Admins** (`admin` role): Full system access, can manage all events and users
- **Public**: Published events are visible to all

### 🔑 Authentication Security

- Email verification (optional)
- Password protection
- Secure session management
- CSRF protection

---

## 🚀 Deployment

### 🌐 Production Deployment

#### **Vercel (Recommended)**

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy to production
vercel --prod

# Set environment variables in Vercel dashboard
```

---

## 📚 Documentation

### 📖 Essential Files

- **`README.md`** - This guide
- **`docs/digital-builders/EXTRACTION_PLAN.md`** - Extraction from TOTL template
- **`docs/digital-builders/ARCHITECTURE.md`** - Architecture documentation
- **`docs/digital-builders/MVP_ROADMAP.md`** - MVP roadmap

---

## 🎯 MVP Status

**v1 MVP: Event Discovery + Event Pass** ✅ **COMPLETE**
- ✅ Email/password authentication (Supabase)
- ✅ Role system (`user`, `client`, `admin`)
- ✅ Event Portal (RSVP, check-in)
- ✅ Event Pass (attendance history via `event_pass_view`)
- ✅ Client role features (event creation, ticket scanning)
- ✅ No wallet connection required
- ✅ No gamification (XP, levels, badges removed)
- ✅ Simple event discovery and attendance tracking
- ✅ ViBE brand identity (colors, typography, naming)

**Next Phases (v1.1+):**
- ⏳ Phase 5: Product polish & identity cleanup
- ⏳ Phase 6: Enhanced event discovery
- ⏳ Phase 7: Organizer experience improvements
- ⏳ Phase 8: Trust & safety basics
- ⏳ Phase 9: Metrics & readiness

---

## 🤝 Contributing

### 🚀 Getting Started

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### 📋 Development Guidelines

- ✅ Follow TypeScript best practices
- ✅ Use proper error handling
- ✅ Write meaningful commit messages
- ✅ Test thoroughly before submitting PRs
- ✅ Follow established component patterns
- ✅ Keep game logic server-side only

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 🆘 Support

### 🆘 Need Help?

- 📖 **Documentation**: Check `docs/` folder
- 🐛 **Issues**: Open an issue on GitHub
- 💬 **Discussions**: Use GitHub Discussions for questions

---

<div align="center">

## 🌟 **Built for Virginia's Creative Tech Community**

**ViBE** - Virginia Isn't Boring Experiences

[🚀 **Get Started**](#-quick-start) • [📖 **Learn More**](#-documentation) • [🤝 **Contribute**](#-contributing)

---

*Last updated: January 2026 | Version: 0.1.0 | Status: MVP Complete, Phases 5-9 In Planning*

</div>

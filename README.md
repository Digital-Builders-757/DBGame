# Digital Builders

**Text-based MMO for the creative tech community**

[![Next.js](https://img.shields.io/badge/Next.js-15.5.4-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-green?style=for-the-badge&logo=supabase)](https://supabase.com/)

---

## 🌟 Overview

Digital Builders is a text-based MMO where players build their careers in the creative tech industry. Start as a freelancer, take on jobs, complete actions, and progress through different career tracks while interacting with other players in a shared virtual city.

### ✨ Key Features

- 🎮 **Character Creation** - Choose your handle, career track, and starting district
- 💼 **Job System** - Take on jobs with 5-minute cooldown timers
- ⚡ **Action System** - Perform freelance actions and PVP-lite interactions
- 📈 **Progression** - Earn XP, level up, and unlock new career paths
- 🏙️ **City System** - Explore districts and see online players
- 💰 **DB Cred Ledger** - Off-chain currency system (v1 MVP)

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
cd digital-builders-game

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

The game uses a PostgreSQL database with the following core tables:

- `profiles` - User accounts (from Supabase Auth)
- `game_accounts` - Digital Builders account data
- `characters` - Player characters with stats
- `cities` / `districts` - Location system
- `jobs` / `character_jobs` - Job system with timers
- `actions` / `character_actions` - Action system with timers
- `db_cred_balances` / `db_cred_transactions` - Off-chain currency ledger (v1)
- `interaction_logs` - PVP-lite interaction history

### 🔐 Authentication Flow

- Email/password authentication via Supabase
- Character creation on first login
- Game-based routing (has character → dashboard, no character → create)

---

## 📁 Project Structure

```
digital-builders-game/
├── app/                    # Next.js App Router pages
│   ├── auth/              # Authentication pages
│   ├── character/         # Character creation
│   ├── dashboard/         # Game dashboard
│   ├── jobs/              # Job system
│   ├── actions/           # Action system
│   ├── city/              # City/district views
│   └── api/               # API routes
├── components/            # React components
│   ├── ui/                # shadcn/ui components
│   ├── auth/              # Authentication components
│   ├── character/         # Character-related components
│   ├── jobs/              # Job-related components
│   └── timers/            # Timer components
├── lib/                   # Utility functions
│   ├── supabase/          # Supabase client helpers
│   ├── game/              # Game logic modules
│   └── utils/             # General utilities
├── types/                 # TypeScript definitions
├── supabase/              # Database migrations & config
└── docs/                  # Documentation
```

---

## 🎮 Game Systems

### Character System
- Handle selection (unique username)
- Career track selection (Designer, Developer, Marketer, etc.)
- Starting district selection
- Character stats and progression

### Job System
- Browse available jobs in your district
- Apply for jobs (5-minute cooldown)
- Complete jobs to earn DB Cred and XP
- Job timers tracked server-side

### Action System
- Freelance actions (solo work)
- PVP-lite interactions (underbid, idea poach, collab challenge)
- Action timers tracked server-side
- Risk/reward mechanics

### Progression System
- XP and leveling
- Builder levels (tiers)
- Career path unlocks
- Skill progression

---

## 🔒 Security Features

### 🛡️ Row-Level Security (RLS)

All database tables implement comprehensive RLS policies:
- Users can only access their own character data
- Players can view online players in their district
- All game logic runs server-side

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

**v1 MVP is Web2-only:**
- ✅ Email/password authentication
- ✅ Off-chain DB Cred ledger
- ✅ No wallet connection required
- ✅ No Solana dependencies in core flows

**v2+ Future Integration:**
- ⏳ Solana wallet connection (optional)
- ⏳ On-chain tokens (DB Cred → SPL token, Builder Power → governance token)
- ⏳ NFT achievements

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

## 🌟 **Built for the Creative Tech Community**

**Digital Builders** - Where creativity meets career progression

[🚀 **Get Started**](#-quick-start) • [📖 **Learn More**](#-documentation) • [🤝 **Contribute**](#-contributing)

---

*Last updated: December 2025 | Version: 0.1.0 | Status: In Development*

</div>

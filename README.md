# NextCRM - CRM Clone Built with Next.js

A modern CRM (Customer Relationship Management) system built with Next.js 15, PostgreSQL, and Prisma. Inspired by Krayin Laravel CRM.

## Features

- 🎯 **Dashboard** - Overview with stats cards and recent activity
- 📊 **Leads Management** - Kanban board with drag-and-drop + table view
- 👥 **Contacts** - Person and organization management
- 📦 **Products** - Product/service catalog
- ✅ **Activities** - Track calls, meetings, tasks, notes
- 📧 **Mail** - Email integration (coming soon)
- 📝 **Quotes** - Sales quotations (coming soon)
- ⚙️ **Settings** - User profile and preferences

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: NextAuth.js v5
- **Styling**: Tailwind CSS
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL (running locally or remote)

### Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment variables:**
   
   Copy the template and update with your PostgreSQL credentials:
   ```bash
   cp env.template .env
   ```
   
   Edit `.env` with your database connection:
   ```env
   DATABASE_URL="postgresql://YOUR_USER:YOUR_PASSWORD@localhost:5432/crm_nextjs?schema=public"
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="your-secret-key-here"
   ```

3. **Create the database:**
   ```bash
   # Using psql
   createdb crm_nextjs
   
   # Or using SQL
   CREATE DATABASE crm_nextjs;
   ```

4. **Run database migrations:**
   ```bash
   npx prisma db push
   ```

5. **Seed the database (optional):**
   ```bash
   npx tsx prisma/seed.ts
   ```

6. **Start the development server:**
   ```bash
   npm run dev
   ```

7. **Open in browser:**
   http://localhost:3000

### Demo Credentials

After seeding the database:
- **Email**: admin@example.com
- **Password**: admin123

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── (dashboard)/        # Protected dashboard routes
│   │   ├── dashboard/      # Dashboard page
│   │   ├── leads/          # Leads management
│   │   ├── contacts/       # Contacts management
│   │   ├── products/       # Products catalog
│   │   ├── activities/     # Activity tracking
│   │   ├── quotes/         # Quotations
│   │   ├── mail/           # Email (coming soon)
│   │   └── settings/       # User settings
│   ├── api/                # API routes
│   ├── login/              # Login page
│   └── register/           # Registration page
├── components/             # React components
│   ├── ui/                 # Base UI components
│   ├── layout/             # Layout components
│   ├── leads/              # Lead-specific components
│   ├── contacts/           # Contact components
│   ├── products/           # Product components
│   ├── activities/         # Activity components
│   └── dashboard/          # Dashboard components
├── lib/                    # Utilities
│   ├── prisma.ts           # Prisma client
│   ├── utils.ts            # Helper functions
│   └── actions/            # Server actions
└── types/                  # TypeScript types
```

## Database Schema

- **User** - Authentication and user management
- **Lead** - Sales opportunities with status pipeline
- **Contact** - Individual contact information
- **Organization** - Company/business information
- **Product** - Product/service catalog
- **Activity** - Calls, meetings, notes, tasks
- **Quote** - Sales quotations

## Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npx prisma studio    # Open Prisma Studio
npx prisma db push   # Sync schema to database
```

## License

MIT

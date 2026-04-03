# VibeKit Studio

**"Generate a theme, build a mini-site, publish it."**

VibeKit Studio is a robust, production-ready web application that enables users to visually construct responsive mini-sites using beautiful, predefined layout sections and globally synchronized design tokens (Vibes). Built with React and powered by a serverless Netlify backend using PostgreSQL.

## Features
- **Frontend Site Builder**: Interactively assemble and re-order page sections (Hero, Features, Gallery, Contact) in real-time.
- **Vibe Themes System**: Hot-swap between 6 premium, custom-curated design aesthetics (Minimal, Neo-brutal, Dark/Neon, Pastel, Luxury, Retro) utilizing dynamic CSS Variable tokens. Identical styling applied on both Editor Preview and Live site.
- **Instant Publishing & Live Viewports**: Toggle instantly between Mobile, Tablet, and Desktop preview widths, and publish via isolated public slugs tracking view metrics.
- **Serverless PostgreSQL**: Lightning-fast endpoints operating as cleanly exposed Netlify Serverless Functions, piped into a transactional Supabase pool via Drizzle ORM.

## Tech Stack
- **Frontend**: Vite + React, React Router Dom, Vanilla CSS Modules
- **Backend**: Express.js wrapped with `serverless-http` deployed to Netlify Functions
- **Database**: PostgreSQL (Supabase) + Drizzle ORM
- **Authentication**: JWT paired with HTTP-Only Cookies + bcryptjs

---

## Authentication Flow Explained

Per project requirements, this application implements a highly secure, **Cookie-based JWT Auth** mechanism over standard local storage setups to guard against XSS vulnerabilities.

1. **Generation:** When a user logs in or signs up, the backend hashes the password utilizing `bcryptjs` and asserts a secure session signature via `jsonwebtoken`.
2. **Transportation:** The generated JWT is *not* sent as a JSON payload body. It is appended strictly to an `httpOnly` cookie with an expiration of 7 days.
3. **Validation:** Every request to an authenticated endpoint (`/api/pages/*`) intercepts the `httpOnly` cookies via Express `cookie-parser`, cryptographically validates the token against the `JWT_SECRET` environment variable, and extracts the `userId` attached to the transaction context.
4. **Lifecycle:** Hitting the `/logout` route securely clears the cookie header, severing the session.

---

## Getting Started Locally

### 1. Requirements
Ensure you have Node.js 18+ and `npm` installed. You will also need a PostgreSQL database (like Supabase).

### 2. Installation
Clone the repository, then install necessary dependencies:
```bash
npm install
```

### 3. Environment Setup
Create a `.env` file at the root of the project to map your backend connections. Notice: **Be sure to use your Transaction Pooler URL (IPv4) from your providers to guarantee Netlify compatibility.**

```env
# Your connection pooling PostgreSQL URL
DATABASE_URL="postgresql://postgres:[PASSWORD]@aws-0-REGION.pooler.supabase.com:6543/postgres"

# Required for signing Session Tokens
JWT_SECRET="any_secure_randomly_generated_string"
```

### 4. Database Schema Sync
Before you boot up the app, run standard Drizzle-Kit utilities to safely push your SQL Table Schemas (`users`, `pages`, `contactSubmissions`) up to your cloud Database:
```bash
npx drizzle-kit push
```

### 5. Running the App
Netlify CLI elegantly binds our Express function router to our Vite frontend. Start the developer proxy environments by running:
```bash
npx netlify dev
```
Navigate to `http://localhost:8888` to explore VibeKit locally!

## Deployment (Production)
Import this repository directly into Netlify. Before finalizing deployment, declare `DATABASE_URL` and `JWT_SECRET` inside your Netlify Dashboard **Environment Variables** (Site Configuration -> Environment Variables). The `netlify.toml` automatically scripts build commands appropriately!

# Library-Reimagined

> A modern web app for university library management. Search, borrow, and track books from your collection — everything in one place.

Library-Reimagined is a reinvention of my old university project "Biblioteca-Library", rebuilt from scratch as a full-stack web application with modern tools and best practices.

**Live Demo:** [library-reimagined.vercel.app](https://library-reimagined.vercel.app)

---

## Features

### For Users

- Secure authentication with email/password and forgot password recovery
- Browse and search the library catalog
- Filter books by category
- View loan history and current active loans
- Manage personal profile and preferences
- Dark mode support with persistent preference

### For Admins

- Full book management (create, read, update, delete)
- User management and role assignments
- Loan administration and tracking
- Query tracking (store and review user searches)
- Row-level security (RLS) for data protection

### Security

- JWT-based authentication via Supabase
- Row-level security policies on all tables
- Protected routes with role-based access control
- Password reset via secure email links
- Automatic session management across tabs

---

## Tech Stack

**Frontend**

- React 19 with Hooks
- Vite (build tool)
- React Router (navigation)
- CSS Modules (scoped styling)
- Responsive design (mobile-first)

**Backend & Database**

- Supabase (PostgreSQL + Auth + RLS)
- RESTful API via Supabase
- Row-level security policies

**Deployment**

- Vercel (frontend hosting)
- Supabase (backend & database)

**Development**

- pnpm (package manager)
- ES6+ JavaScript
- Git & GitHub

---

## Quick Start

### Prerequisites

- Node.js 16+ and pnpm installed
- A Supabase account (free tier works perfectly)
- Git

### 1. Clone & Install

```bash
git clone https://github.com/Zermeno-Jonathan/Library-Reimagined.git
cd Library-Reimagined/frontend
pnpm install
```

### 2. Supabase Setup

#### Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign up
2. Create a new project (free tier)
3. Wait for the database to initialize

#### Get Your Credentials

From your Supabase project dashboard:

1. Go to **Settings → API**
2. Copy your **Project URL** and **Anon Public Key**

#### Set Up Database Schema

In your Supabase project, go to **SQL Editor** and run these queries:

```sql
-- Users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    auth_id UUID NOT NULL UNIQUE REFERENCES auth.users(id),
    email TEXT NOT NULL UNIQUE,
    rol TEXT NOT NULL DEFAULT 'user' CHECK (rol IN ('user', 'admin')),
    created_at TIMESTAMP DEFAULT NOW()
);

-- Books table
CREATE TABLE books (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    author TEXT NOT NULL,
    year DATE,
    isbn TEXT UNIQUE NOT NULL,
    stock INTEGER NOT NULL DEFAULT 0,
    category TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Loans table
CREATE TABLE loans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    book_id UUID NOT NULL REFERENCES books(id) ON DELETE CASCADE,
    loan_date DATE DEFAULT TODAY(),
    return_date DATE,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'returned')),
    created_at TIMESTAMP DEFAULT NOW()
);

-- Queries table (for tracking user searches)
CREATE TABLE queries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    query TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE books ENABLE ROW LEVEL SECURITY;
ALTER TABLE loans ENABLE ROW LEVEL SECURITY;
ALTER TABLE queries ENABLE ROW LEVEL SECURITY;
```

#### Set Up Row-Level Security (RLS)

**Users table:**

```sql
-- Users can view their own record
CREATE POLICY "Users can view own profile"
    ON users FOR SELECT
    USING (auth.uid() = auth_id);

-- Admins can view all users
CREATE POLICY "Admins can view all users"
    ON users FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM users WHERE auth_id = auth.uid() AND rol = 'admin'
        )
    );
```

**Books table:**

```sql
-- Everyone can read books
CREATE POLICY "Everyone can read books"
    ON books FOR SELECT
    USING (true);

-- Only admins can insert/update/delete
CREATE POLICY "Only admins can manage books"
    ON books FOR INSERT
    USING (
        EXISTS (
            SELECT 1 FROM users WHERE auth_id = auth.uid() AND rol = 'admin'
        )
    );

CREATE POLICY "Only admins can update books"
    ON books FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM users WHERE auth_id = auth.uid() AND rol = 'admin'
        )
    );

CREATE POLICY "Only admins can delete books"
    ON books FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM users WHERE auth_id = auth.uid() AND rol = 'admin'
        )
    );
```

**Loans table:**

```sql
-- Users can view their own loans
CREATE POLICY "Users can view own loans"
    ON loans FOR SELECT
    USING (user_id = (SELECT id FROM users WHERE auth_id = auth.uid()));

-- Admins can view all loans
CREATE POLICY "Admins can view all loans"
    ON loans FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM users WHERE auth_id = auth.uid() AND rol = 'admin'
        )
    );

-- Users can create loans (borrow books)
CREATE POLICY "Users can create loans"
    ON loans FOR INSERT
    WITH CHECK (user_id = (SELECT id FROM users WHERE auth_id = auth.uid()));

-- Admins can manage all loans
CREATE POLICY "Admins can manage loans"
    ON loans FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM users WHERE auth_id = auth.uid() AND rol = 'admin'
        )
    );
```

**Queries table:**

```sql
-- Users can view their own queries
CREATE POLICY "Users can view own queries"
    ON queries FOR SELECT
    USING (user_id = (SELECT id FROM users WHERE auth_id = auth.uid()));

-- Users can create queries
CREATE POLICY "Users can create queries"
    ON queries FOR INSERT
    WITH CHECK (user_id = (SELECT id FROM users WHERE auth_id = auth.uid()));

-- Admins can view all queries
CREATE POLICY "Admins can view all queries"
    ON queries FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM users WHERE auth_id = auth.uid() AND rol = 'admin'
        )
    );
```

#### Verify JWT Expiry

In Supabase, go to **Authentication → Settings → JWT expiry** and confirm it's set to `3600` (1 hour) or your preferred duration.

### 3. Environment Setup

Create a `.env.local` file in `/frontend`:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Replace with your actual Supabase credentials from step 2.

**Note:** Never commit `.env.local` to version control. It's in `.gitignore` by default.

### 4. Run Locally

```bash
pnpm dev
```

Open [http://localhost:5173](http://localhost:5173) and start developing.

---

## Testing on Mobile (Local Development)

To test the app on your phone while developing:

1. Run Vite with `--host`:

    ```bash
    pnpm dev --host
    ```

2. Get your local IP:

    ```bash
    ip addr show
    ```

    Look for an address like `192.168.1.x`

3. On your phone (same WiFi network), open:
    ```
    http://192.168.1.x:5173
    ```

---

## Deployment

### Deploy to Vercel

1. **Push to GitHub**

    ```bash
    git push origin main
    ```

2. **Import to Vercel**
    - Go to [vercel.com](https://vercel.com)
    - Click "Add New" → "Project"
    - Import your GitHub repository
    - Set **Root Directory** to `./frontend`

3. **Add Environment Variables**
   In Vercel project settings → "Environment Variables":

    ```
    VITE_SUPABASE_URL = your_supabase_url
    VITE_SUPABASE_ANON_KEY = your_supabase_anon_key
    ```

4. **Deploy**
   Click "Deploy" and wait for the build to complete.

5. **Configure Supabase Redirects**
   In Supabase → Authentication → URL Configuration → Redirect URLs:
    ```
    https://your-vercel-app.vercel.app/resetpassword
    ```

---

## Project Structure

```
Library-Reimagined/
├── frontend/
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   ├── pages/            # Page components
│   │   ├── context/          # React Context (Auth, Theme)
│   │   ├── config/           # Supabase client config
│   │   ├── App.jsx           # Main app component
│   │   └── main.jsx          # Entry point
│   ├── .env.local            # Local env vars (not committed)
│   ├── vite.config.js        # Vite configuration
│   └── package.json
├── vercel.json               # Vercel SPA routing config
└── README.md
```

---

## Security Notes

### Authentication

- Uses Supabase's JWT-based authentication
- Tokens automatically refresh via `onAuthStateChange`
- Sessions persist across browser tabs and window closes

### Database Access

- All tables have Row-Level Security (RLS) enabled
- Users can only access their own data (by design)
- Admins can access all data via RLS policies
- No sensitive data is stored client-side beyond JWT tokens

### Best Practices

- Environment variables are never committed to Git (see `.gitignore`)
- Passwords are hashed by Supabase (bcrypt)
- All API calls go through Supabase's secure endpoint
- Dark mode preference is stored locally (no sensitive data)

---

## Contributing

Contributions are welcome! To contribute:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m "feat: add your feature"`
4. Push to the branch: `git push origin feature/your-feature`
5. Open a Pull Request

Please follow these conventions:

- Use descriptive commit messages
- Keep CSS organized in CSS Modules
- Test changes on both mobile and desktop
- Ensure dark/light mode works for new components

---

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

## Questions?

If you have questions or run into issues:

1. Check the Supabase documentation: [docs.supabase.com](https://docs.supabase.com)
2. Check the Vercel documentation: [vercel.com/docs](https://vercel.com/docs)
3. Open an issue in this repository

---

**Built with ❤️ by Jonathan Zermeño**

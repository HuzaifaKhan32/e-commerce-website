
# ⚠️ FINAL AUTH SETUP

Run this SQL in your **Supabase SQL Editor** to ensure everything works (Google Login + 2FA).

```sql
-- 1. Custom 2FA Table
CREATE TABLE IF NOT EXISTS public.two_factor_codes (
  email TEXT PRIMARY KEY,
  code TEXT NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL
);

-- 2. Standard NextAuth Tables
CREATE TABLE IF NOT EXISTS public.accounts (
  id UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
  "userId" UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  provider TEXT NOT NULL,
  "providerAccountId" TEXT NOT NULL,
  refresh_token TEXT,
  access_token TEXT,
  expires_at BIGINT,
  token_type TEXT,
  scope TEXT,
  id_token TEXT,
  session_state TEXT,
  CONSTRAINT accounts_provider_providerAccountId_unique UNIQUE (provider, "providerAccountId")
);

CREATE TABLE IF NOT EXISTS public.sessions (
  id UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
  "userId" UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  expires TIMESTAMP WITH TIME ZONE NOT NULL,
  "sessionToken" TEXT NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS public.verification_tokens (
  identifier TEXT,
  token TEXT UNIQUE,
  expires TIMESTAMP WITH TIME ZONE,
  PRIMARY KEY (identifier, token)
);

-- 3. Core Tables Extensions
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS "emailVerified" TIMESTAMP WITH TIME ZONE;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS image TEXT;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS password TEXT;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'user';
```

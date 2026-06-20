# Neon DB Setup Runbook

## Important

If you see:

```txt
ERROR: relation "User" does not exist
```

it means you ran `db/neon-seed.sql` before running the schema creation SQL.

## Recommended for a fresh Neon database

Use this single file:

```txt
db/neon-complete-setup.sql
```

It contains:

```txt
schema first
seed second
```

Do not run `db/neon-seed.sql` alone on an empty database.

## Correct order if running separately

### Step 1: Run schema

```txt
db/neon-schema.sql
```

### Step 2: Verify tables exist

Run this in Neon SQL Editor:

```sql
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_name IN ('User', 'Tenant', 'Website', 'GenerationJob', 'AIProviderConfig', 'OnboardingState')
ORDER BY table_name;
```

You should see:

```txt
AIProviderConfig
GenerationJob
OnboardingState
Tenant
User
Website
```

### Step 3: Run seed

```txt
db/neon-seed.sql
```

## Do not paste markdown-rendered email links

Use this plain SQL value:

```sql
'founder@aurelia.ai'
```

Do not use this markdown-rendered value:

```txt
[founder@aurelia.ai](mailto:founder@aurelia.ai)
```

## If your Neon DB is fresh and empty

Just run:

```txt
db/neon-complete-setup.sql
```

## If you already partially ran seed and it failed

No problem. Run:

```txt
db/neon-schema.sql
```

Then run:

```txt
db/neon-seed.sql
```

The seed uses `ON CONFLICT` where needed, so it is safe to rerun.

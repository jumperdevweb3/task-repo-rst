## Start Development

1. `docker compose up`
2. `bun prisma db pull` (new console tab)
3. `bun prisma generate`
4. `bun dev`

### Deployment to Vercel

Before deploying to Vercel, set up your database connection string and run the migration:

1. `bun prisma migrate dev --name init`

Vercel deployment command is defined in `package.json`.
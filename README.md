This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Weekly LinkedIn Refresh

This repo includes a weekly LinkedIn snapshot workflow at [`.github/workflows/refresh-linkedin-data.yml`](.github/workflows/refresh-linkedin-data.yml) and a local helper script at [`scripts/fetch-linkedin-data.mjs`](scripts/fetch-linkedin-data.mjs).

### Required secrets

- `LINKEDIN_ACCESS_TOKEN`
- `LINKEDIN_REFRESH_TOKEN` (optional, but recommended)
- `LINKEDIN_CLIENT_ID`
- `LINKEDIN_CLIENT_SECRET`
- `LINKEDIN_ANALYTICS_ENDPOINTS` (optional, pipe-delimited list of extra API endpoints)

### Local run

```bash
npm run fetch:linkedin
```

The script writes a snapshot to `src/data/live-linkedin-snapshot.json` by default. If LinkedIn returns only partial data for a given account or permission set, the snapshot still preserves the raw responses so you can extend the transform later.

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

## LinkedIn Data Refresh (Daily Updates)

This project automatically refreshes LinkedIn analytics data daily using **two complementary approaches** for reliability:

### 1. Vercel Cron Job (Real-time API)
- **Runs daily at midnight UTC** via Vercel's cron feature
- Fetches fresh data from LinkedIn API on-demand
- Data is cached for 24 hours with stale-while-revalidate
- Best for always-current data without needing git commits

### 2. GitHub Actions (Static Backup)
- **Runs daily at midnight UTC** via GitHub Actions workflow
- Commits data to repository as `public/live-linkedin-data.json`
- Serves as fallback if API route fails
- Workflow at [`.github/workflows/refresh-linkedin-data.yml`](.github/workflows/refresh-linkedin-data.yml)

### Setup Instructions

#### Vercel Environment Variables
Add these in your Vercel project settings (required for API route):
- `LINKEDIN_ACCESS_TOKEN` - Your LinkedIn access token
- `LINKEDIN_REFRESH_TOKEN` - (Optional but recommended) For auto-renewal
- `LINKEDIN_CLIENT_ID` - Your LinkedIn app client ID
- `LINKEDIN_CLIENT_SECRET` - Your LinkedIn app client secret
- `CRON_SECRET` - (Optional) Secret token to secure the cron endpoint

#### GitHub Secrets
Add these in your repository settings under Settings → Secrets and variables → Actions:
- `LINKEDIN_ACCESS_TOKEN`
- `LINKEDIN_REFRESH_TOKEN` 
- `LINKEDIN_CLIENT_ID`
- `LINKEDIN_CLIENT_SECRET`
- `LINKEDIN_ANALYTICS_ENDPOINTS` - (Optional) Pipe-delimited list of extra API endpoints

#### Vercel Cron Configuration
The `vercel.json` file configures the daily cron job:
```json
{
  "crons": [
    {
      "path": "/api/cron",
      "schedule": "0 0 * * *"
    }
  ]
}
```

### Data Flow
1. **Primary**: User visits site → API route `/api/linkedin-data` is called → Fresh data fetched from LinkedIn (cached 24h)
2. **Vercel Cron**: At midnight → `/api/cron` triggers → Refreshes cache
3. **GitHub Actions**: At midnight → Fetch script runs → Commits to `public/live-linkedin-data.json` → Fallback data
4. **Fallback**: If API fails → Frontend loads static `public/live-linkedin-data.json`

### Timestamp Display
The dashboard shows "Data refreshed Xh ago" at the top, using the `fetchedAt` timestamp from the API response.

### Local Development

To fetch LinkedIn data locally for testing:

```bash
npm run fetch:linkedin
```

The script writes a snapshot to `public/live-linkedin-data.json` by default.

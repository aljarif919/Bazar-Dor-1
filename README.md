# বাজার দর (BazarDor)

বাংলাদেশের নিত্যপ্রয়োজনীয় পণ্যের বাজারদর এক নজরে দেখার জন্য responsive Bengali-language web application.

## Technologies
- Next.js App Router + React + TypeScript
- Tailwind CSS v4 and custom responsive styles
- Better Auth (email/password, optional Google and GitHub OAuth)
- PostgreSQL via `pg` (persistent database for serverless deployment)
- `react-hot-toast` for feedback
- Lucide React icons
- BazarDor product API with alternate API fallback

## Key features
1. Responsive homepage with a slower, continuously scrolling API-backed price ticker and the basket illustration extracted from the supplied Figma file.
2. Rising/falling product sections and category-based browsing.
3. Product detail route with summary, minimum/maximum/average prices and market comparison.
4. Category sorting: default, low-to-high and high-to-low numeric price sorting.
5. Better Auth sign up/sign in/sign out, optional Google/GitHub OAuth, protected profile and update-name page.
6. Loading skeletons, toast notifications and friendly 404 page.
7. Bengali digits and currency formatting.
8. Vercel-compatible Next.js App Router dynamic routes.

## Run locally
1. Install Node.js 22 LTS or Node.js 24 LTS (64-bit Windows).
2. Extract `BazarDor-API-Integrated.zip` and open the folder containing `package.json` in VS Code.
3. Run `npm install`.
4. Copy `.env.example` to `.env.local` and set your PostgreSQL `DATABASE_URL`.
5. Set a unique `BETTER_AUTH_SECRET` and `BETTER_AUTH_URL=http://localhost:3000`.
6. Run `npx @better-auth/cli migrate` to create the authentication schema.
7. Run `npm run dev` and open `http://localhost:3000`.

## Better Auth OAuth setup
Email/password works without OAuth credentials. To enable Google and GitHub:
- Create OAuth apps in the Google Cloud Console and GitHub Developer settings.
- Set `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET`.
- Configure the callback URL to `http://localhost:3000/api/auth/callback/google` and `http://localhost:3000/api/auth/callback/github`; use your production URL after deployment.
- For production, configure PostgreSQL and the same three environment variables in Netlify. Run the Better Auth migration once against the production database before testing sign-up.

## Product API
Primary: `https://api.api-store.workers.dev/api/bazardor`
Alternative: `https://api.abcz.workers.dev/api/bazardor`
Expected endpoints: `/products`, `/products?category=chal`, `/products/:id`, `/categories`, `/categories/:slug`. The UI does not substitute sample prices when the API is unavailable. It shows a clear unavailable/empty state instead of presenting made-up values as real market prices. Product images and market/district price rows are shown when the API provides them; missing values are not invented.

## Deployment
Push to GitHub and import the repository into Netlify. Add `DATABASE_URL`, `BETTER_AUTH_URL`, and `BETTER_AUTH_SECRET` in Netlify Environment Variables. Confirm auth callback URLs and use a persistent database before production deployment. Then fill in:
- Live Link: `https://your-project.vercel.app`
- GitHub Repository Link: `https://github.com/your-username/bazardor`


## Authentication note
See `START-HERE-BN.md`. Email/password authentication needs a real PostgreSQL `DATABASE_URL` and a one-time Better Auth migration. Do not deploy with placeholder credentials.

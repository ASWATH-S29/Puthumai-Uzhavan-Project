# Puthumai Uzhavan

AI-assisted smart-farming dashboard built with React, Vite, and Supabase.

## Local setup

1. Copy `.env.example` to `.env` and add your Supabase project URL and public anon key.
2. Install dependencies with `npm ci`.
3. Apply the SQL files in `supabase/migrations` to your Supabase project, deploy the `weather` Edge Function, and configure `OPENWEATHER_API_KEY` if live weather is required.
4. Start the app with `npm run dev`.

Before deploying to Vercel, add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in the project's environment variables. Also add the deployed `/reset-password` URL to Supabase Auth redirect URLs.

## Quality checks

Run `npm run typecheck`, `npm run lint`, and `npm run build` before deployment.

# 김누누 — Poetry collection

An intentionally minimal Next.js poetry site with a protected editorial area.

## Run locally

1. Copy `.env.example` to `.env.local` and choose strong values for `AUTH_SECRET` and `ADMIN_PASSWORD`.
2. Install dependencies: `npm install`.
3. Start the development server: `npm run dev`.

Poems live in `data/poems.json`, with each poem represented by an `id`, title, publication date, publishing flag, and array of text lines. The editor at `/admin` creates, edits, drafts, publishes, and deletes poems directly in this file. Published poems automatically appear on the home page and poems index; navigation and random selection are calculated from the published set.

## Deployment note

File-backed editing requires a long-lived, writable filesystem. Deploy to a Node server or container with `data/poems.json` on persistent storage. It is not compatible with read-only/serverless filesystems such as a standard Vercel deployment; migrate the content adapter in `lib/poems.ts` to a database or CMS before using that kind of hosting.

# Fyropy 🔥

**Catch it. Keep it.** A fast "second brain" for capturing any thought, link, or task — and letting AI sort it for you.

🔗 **Live:** fyropy.vercel.app
💻 **Repo:** github.com/angelinetipa/fyropy

> An honest portfolio / learning project. Built to practice real product engineering — auth, a typed data layer, AI integration, and a considered design system — not to be a finished commercial app. Tech choices and scope reflect that.

---

## What it does

Drop a thought into the capture bar in about two seconds. Fyropy saves it, then AI quietly fills in the details — what kind of thing it is, a few tags, a one-line summary, and a topic group — so your inbox organizes itself instead of you doing it by hand.

It's opinionated and quick, not a blank-canvas note tool.

## Features

- **Quick capture** — one bar, paste anything, it's saved instantly.
- **AI triage** — each capture is auto-sorted into a type (note / task / idea), tags, summary, and topic group.
- **Organize text** — tidy a single messy note into clean grouped bullets, in place, without changing its meaning.
- **Three views** — Inbox (flat stream), Tasks, and Notes (grouped into collapsible topic sections).
- **Live search** across text, tags, group, and summary.
- **Item detail** — tap a card to edit, re-sort with AI, mark done, or delete (with a confirm step).
- **Pull-to-refresh** on every list.
- **Responsive nav** — collapsible sidebar on web, bottom tabs on phone.
- **Bring your own AI key** — Groq or Gemini free tier, stored per user.

## Tech stack

- **App:** React Native + Expo (SDK 54), Expo Router, TypeScript
- **Web-first**, also runs in Expo Go
- **Backend:** Supabase — Postgres, Auth, Row Level Security
- **AI:** BYOK via Groq (`llama-3.1-8b-instant`) or Gemini (`1.5-flash`)
- **Hosting:** Vercel (web, auto-deploys on push to `main`)
- **Design:** "fire-opal" theme — claymorphism, amber accents. Fonts: Space Grotesk, Manrope, JetBrains Mono.

> Honest note on skill level: I'm proficient in Python, SQL, and HTML/CSS. TypeScript, React, and React Native are areas I'm actively building — this project is part of that growth.

## Project structure

```
app/        Expo Router routes only (auth, tabs, layout)
src/
  components/   UI building blocks (cards, lists, modals, capture bar)
  hooks/        State + reusable logic (useItems, useItemDetail, useAuth, ...)
  services/     Data + AI calls (items, ai, settings)
  constants/    Colors and theme tokens
  lib/          Supabase client, time helpers
  types/        Shared TypeScript types
```

Components, hooks, and services are kept in separate files so logic stays reusable and easy to read.

## Data model (Supabase)

- **`items`** — `id`, `user_id`, `raw_text`, `type`, `tags[]`, `summary`, `url`, `group_name`, `done`, `created_at`
- **`settings`** — `user_id`, `ai_provider`, `ai_key`
- **`summaries`** — reserved for a future weekly digest

All tables use Row Level Security so each user only sees their own data.

## Getting started

```bash
# 1. Install
npm install

# 2. Add your Supabase keys (.env)
EXPO_PUBLIC_SUPABASE_URL=your-url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# 3. Run
npx expo start        # phone (Expo Go) or web
```

Then sign up, open **Settings**, and paste a free **Groq** or **Gemini** API key to enable AI sorting.

## Roadmap

- Link previews (page title instead of raw URL)
- Analytics dashboard — captures per day, completion rate, tag trends
- Postgres views/functions + `pgvector` semantic search
- Nightly Supabase Edge Function pipeline → `summaries`
- AI weekly digest and natural-language capture ("call mom friday" → task with due date)
- Android build via EAS

## Author

**Ma. Angeline T. Tipa** — BS Computer Engineering, PUP Manila
GitHub: [@angelinetipa](https://github.com/angelinetipa) · Portfolio: opal-portfolio.vercel.app
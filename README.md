# GiftVerse 🎁✨

> Create and send unforgettable digital gifts — games, cards, and invitations.

## Overview

GiftVerse is a mobile app for creating personalized digital gifts powered by AI. Choose from three gift types, customize the experience, and share with anyone via a link.

### Gift Types

| Type | Description | Price |
|------|-------------|-------|
| 🎮 Gift Game | Interactive quiz game gift | $2.99 |
| 🎂 Birthday Card | Beautiful digital birthday card | Free |
| 💌 Invitation | Event invitation with RSVP tracking | $1.99 |

## Tech Stack

- **Frontend**: Expo SDK 52, React Native 0.76, TypeScript
- **Backend**: Supabase (Auth, Database, Edge Functions)
- **AI**: OpenAI gpt-4o-mini via Supabase Edge Function
- **Payments**: Stripe via Supabase Edge Function
- **State**: Zustand + AsyncStorage

## Getting Started

```bash
npm install
npx expo start
```

### Environment Setup

Copy `.env.example` and fill in your keys:

```bash
cp .env.example .env
```

Required variables:
- `SUPABASE_URL` — Your Supabase project URL
- `SUPABASE_ANON_KEY` — Supabase anonymous key
- `OPENAI_API_KEY` — For the generate-gift edge function
- `STRIPE_SECRET_KEY` — For the create-checkout edge function

## Project Structure

```
src/
├── screens/          # Home, History, Settings, Onboarding, Wizard, Preview, View
├── navigation/       # Stack + Tab navigator
├── services/         # Supabase client, AI proxy, Payment service
├── stores/           # Zustand gift store
├── components/       # Reusable UI components
├── contexts/         # Theme context (dark/light, seasonal, emotional)
├── design-tokens/    # Spacing, typography, colors
├── types/            # TypeScript types & display labels
supabase/
├── migrations/       # SQL schema (profiles, gifts, payments, rsvps)
├── functions/        # Edge functions (generate-gift, create-checkout)
```

## Architecture

```
Mobile App → Supabase Edge Functions → OpenAI / Stripe
                    ↓
         Supabase Database (Postgres + RLS)
```

- No API secrets on the client
- Row-Level Security on all tables
- Deep linking: giftverse://gift/:giftId

## Scripts

```bash
npm start              # Expo dev server
npm run typecheck      # TypeScript check
npm run lint           # ESLint
npm test               # Jest tests
npm run build:web      # Export for web
```

## License

MIT

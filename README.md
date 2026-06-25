# Hamba — Moves & Removals

A mobile web app (installable PWA) for booking **long-distance moves**, **local removals** and **rubble removal** — with in-app card payment for all SA banks. A minimal **black-and-white** interface built on an Apple "liquid glass" material with soft, animated lighting.

> *Hamba* — "go" in Zulu/Xhosa.

## What's in it

- **Pick a service** — Long Distance Move, Local Removal, or Rubble Removal.
- **Build the booking** — pickup & drop-off, date/time, load size, helpers, notes. A **live quote** updates as you type.
- **Pay** — Tap-to-pay (card machine), Card, or Instant EFT, with a frosted processing overlay and an itemised receipt incl. VAT.
- **Track** — animated confirmation, route map and live status steps.
- **Installable** — "Add to Home Screen" on iPhone/Android; runs full-screen like a native app, works offline.

## Run it

```bash
npm install
npm run dev      # open the printed URL on your phone (same Wi-Fi) or laptop
```

Build for hosting:

```bash
npm run build    # outputs to dist/  — deploy to Vercel, Netlify, Cloudflare Pages, etc.
npm run preview  # preview the production build
```

## Tech

- **React + TypeScript + Vite**
- **vite-plugin-pwa** for the installable / offline app shell
- Pure CSS liquid-glass design system (`src/styles.css`) — monochrome palette, `backdrop-filter` glass, soft animated ambient lighting

```
src/
  components/Icon.tsx             monochrome SF Symbols-style line icons
  components/ProcessingOverlay.tsx frosted payment-processing overlay
  screens/Home.tsx               service picker
  screens/Booking.tsx            address / date / load / helpers + live quote
  screens/Payment.tsx            method picker + Yoco-style tap flow + receipt
  screens/Tracking.tsx           confirmation, map, status steps
  lib/quote.ts                   pricing & distance estimate (see below)
  lib/data.ts                    services, load sizes, rates
```

## Pricing

Quote = `call-out + (km × per-km rate)`, scaled by load size, plus helpers, plus 15% VAT.
Rates live in `src/lib/data.ts` — edit `base`, `perKm`, `multiplier` and `HELPER_RATE` to match your real pricing.

## What's stubbed (and how to make it real)

This is a complete, working front end. Two pieces use placeholders so the app runs end-to-end today:

1. **Distance** — `estimateDistance()` in `src/lib/quote.ts` produces a plausible distance from the addresses. Replace it with a **Google Distance Matrix** or **Mapbox Directions** call for real km, and add address autocomplete to the pickup/drop-off fields.
2. **Payments** — the Payment screen simulates the charge. To take real money with **Yoco** (chosen for SA, accepts all major banks):
   - **Online card / EFT:** create an [Online Checkout](https://developer.yoco.com/online/) on your server (keep the secret key server-side), then redirect the customer to the returned `redirectUrl`. Wire this into `pay()` in `src/screens/Payment.tsx`.
   - **Tap-to-pay machine:** pair a **Yoco card reader** and start the charge from the app — the customer taps their card/phone on the reader. Use Yoco's POS/reader integration for this flow.
   - Never put your Yoco **secret key** in this front-end; charges must be created from a small backend.

A simple backend (one endpoint to create a Yoco checkout + a webhook to confirm payment) is the natural next step — say the word and I'll add it.

## Going live — the free path

The app runs today on **local storage** (bookings save to the device, no account needed). To turn on a real cloud database so bookings/customers are stored centrally, with **no code changes**:

1. Create a free project at [supabase.com](https://supabase.com).
2. Open **SQL Editor**, paste [`supabase/schema.sql`](supabase/schema.sql), and **Run** it.
3. In **Project Settings → API**, copy the **Project URL** and **anon public key**.
4. Copy `.env.example` to `.env` and paste them in:
   ```
   VITE_SUPABASE_URL=https://xxxx.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJ...
   ```
   (On Vercel, add these two as Environment Variables instead.)
5. Redeploy. Bookings now mirror to Supabase; nothing breaks if the keys are absent.

The anon key is **safe in the frontend** — Row Level Security (in the schema) only allows creating rows, never listing other people's data.

### Real payments (Yoco)
Taking real money needs a tiny server endpoint (Supabase Edge Function) that creates a Yoco **Online Checkout** with your **secret** key — which must never live in the frontend — plus a webhook to confirm payment. This is the one piece that needs your Yoco account; ask and I'll add the function + wire `Payment.tsx` to it.

### Distance-based pricing
Pricing currently uses a built-in suburb list (free, no API). For exact road distances, plug in **Google Distance Matrix** (≈US$0.005/lookup, covered by Google's standing **$200/month free credit** — ~40k quotes/month free) or **Mapbox** (100k free/month). Free-only alternatives: a hand-built suburb-to-suburb zone table, or the open-source **OSRM / OpenRouteService** APIs.

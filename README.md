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

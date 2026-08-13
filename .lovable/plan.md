# Auth flow, responsiveness, and third theme

## 1. Real auth routes (replace the static mockup behavior)

The current sign-in/sign-up lives in `public/screens/page1.html`, which has that jumpy "moves when you click" interaction and a fixed non-responsive layout. Replace it with proper React routes so we control layout, validation, and the flow:

- `src/routes/sign-in.tsx` — headline **"Welcome back."** (with "back" as the blue pill, matching the hero style). Email + password fields, "Sign in" button. On submit: read stored name from `localStorage` (`sg.user`), then navigate to `/dashboard`.
- `src/routes/sign-up.tsx` — headline **"Start your future here."** Full name + email + password fields, "Create account" button. On submit: store `{ name, email }` in `localStorage`, then navigate to `/sign-in` (with a small "Account created — sign in to continue" banner).
- `src/routes/dashboard.tsx` — thin wrapper that greets the user by name pulled from `localStorage`, then embeds the existing dashboard mockup (`/screens/page2.html`) in a full-viewport iframe, or redirects to it with the name in the URL hash so the greeting shows above it. If no stored user, redirect to `/sign-in`.

No jumpy motion, no role-picker carousel — just a single clean centered card:
- max-w-md card, generous padding, semantic tokens (`bg-card`, `border`, `text-foreground`), fluid type (`clamp()`), stacks to full-width on mobile.
- Inputs use existing shadcn styling patterns (border, focus ring, rounded-xl).
- Primary button uses `bg-primary text-primary-foreground` — no gradient, no bounce.
- Subtle blob background reused from the homepage for continuity, but static (no scale-on-click).

## 2. Homepage header

- Rename the header CTA from "Sign in to dashboard" (or similar) to just **"Sign in"**, linking to `/sign-in`.
- Add a secondary "Try now" that goes to `/sign-up` (keep existing hero CTA behavior consistent).

## 3. Third theme: Glass

Add a `glass` theme alongside `light` and `dark`:

- In `src/styles.css`, add a `.glass` selector block that sets tokens to a translucent/frosted palette (light foreground, semi-transparent card = `oklch(1 0 0 / 12%)`, stronger blob opacity, brighter primary).
- Wrap `body` in a fixed gradient background so cards read as frosted glass over it.
- Add `.bento-card`, header, and auth-card variants under `:where(.glass) &` to apply `backdrop-filter: blur(20px) saturate(140%)` + translucent surfaces (standard property only, per Tailwind v4 backdrop rule).
- Update the `useTheme` hook in `src/routes/index.tsx` to cycle **light → dark → glass** and show three icons in the toggle (sun / moon / sparkles). Persist to `localStorage`. Apply by toggling `classList` (`light`/`dark`/`glass`) on `<html>`.
- Same hook + toggle is reused on `/sign-in`, `/sign-up`, `/dashboard` via a small shared `ThemeToggle` component in `src/components/theme-toggle.tsx`.

## 4. Responsiveness pass (whole site)

Audit `src/routes/index.tsx` and the new auth routes:
- Replace fixed pixel widths / large fixed font sizes with `clamp()` where headings currently jump.
- Ensure every row uses the responsive grid pattern (`grid-cols-[minmax(0,1fr)_auto]` on mobile, promote to flex at `sm:`), `min-w-0` on text containers, `shrink-0` on icons.
- Bento grid: 1 col on mobile, 2 cols at `md:`, keep the 5th card full-width via `md:col-span-2`.
- Hero: reduce top padding and use `clamp(2.5rem, 8vw, 6rem)` for the headline; buttons stack vertically < 480px.
- Scroll-video section: cap width at `100vw - padding`, keep aspect-video, works down to 360px.

## 5. Files touched

- **New:** `src/routes/sign-in.tsx`, `src/routes/sign-up.tsx`, `src/routes/dashboard.tsx`, `src/components/theme-toggle.tsx`.
- **Edit:** `src/routes/index.tsx` (header CTA rename, link to `/sign-in`, extract theme hook, responsive tweaks).
- **Edit:** `src/styles.css` (add `.glass` tokens + backdrop utilities, fluid type helpers).

## Out of scope

- Real authentication / backend. This is still a mockup flow — name is stored client-side in `localStorage`. If you want real auth later, we'd enable Lovable Cloud.
- Rewriting the other 15 prototype screens; dashboard remains the existing HTML mockup, just entered through the new gated route.

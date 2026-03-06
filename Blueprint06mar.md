# BLUEPRINT 06 MARCH 2026 — ChronoProtein Platform
### Planning document | No code changes until this is complete
*Session: March 6, 2026 | Model: Claude Sonnet 4.6*

---

## OVERVIEW OF ISSUES AND NEW DIRECTIONS

This blueprint captures everything discussed before touching a single line of code.
Four major areas have been identified: navigation, user accounts, diet communication, and brand repositioning.

---

## PART 1 — NAVIGATION: IN-APP MOVEMENT

### Problem
The metabolic-windows.html page (and potentially others) has no way to return to the main app. Once a user clicks "See the Science" from index.html they are stranded — no back button, no header nav link.

### What needs to be added

**Global navigation bar** — present on all pages:
- Back/Home button (left side): returns to index.html
- App name/logo (center): clickable, goes to index.html
- Language toggle (right side): already exists, keep it

**Per-page back context:**
- `metabolic-windows.html` → back to index.html ("Back to Home")
- `dashboard.html` → "Edit Profile" button already exists; add "Home" link
- `onboarding.html` → first step already has "Back" to index.html; keep as-is

**Implementation approach:**
- Create a shared `nav.html` snippet OR duplicate a small `<nav>` block on each page
- Since this is pure HTML (no build system), duplicate a 4-line nav block on each page
- Style: fixed top-left, minimal, dark background matching design system

---

## PART 2 — USER PROFILES WITH SUPABASE

### Problem
Currently all data lives in `localStorage` — it is device-specific, lost on browser clear, and has no server-side persistence. There is no concept of a registered user, no admin panel, no cross-device sync.

### What we want

#### 2A — Authentication
- **Google OAuth (Gmail login)**: primary login method — reduces friction, no password to manage
- **Email + password**: fallback for users without Google
- **Guest mode**: keep localStorage-based flow for anonymous users who don't want to register

#### 2B — User profiles in the database
When a user registers/logs in:
- Profile data (weight, age, chronotype, goal, diet, activity) saved to Supabase `profiles` table
- Plan data saved to `plans` table (training day + rest day windows)
- Device fingerprint/session stored so mobile users auto-recognize on return

#### 2C — Admin panel
- Admin access via a secret key (env variable or hardcoded Supabase role)
- Admin can view: list of registered users, their profiles, creation date
- Admin can NOT see passwords (handled by Supabase Auth)
- Access at `/admin.html` — protected by Supabase session + role check

#### 2D — Future: health app integration (noted, not built yet)
- Apple HealthKit (iOS Safari PWA) — read steps, active energy, heart rate
- Google Fit / Health Connect (Android) — same data
- Use these inputs to auto-adjust protein recommendations dynamically
- **Flag for future sprint — do not build now**

### Supabase setup required

**Tables:**
```sql
-- profiles
id          uuid references auth.users
created_at  timestamptz
weight_kg   numeric
age         integer
sex         text
body_fat    numeric
chronotype  text
goal        text
activity    text
diet        text
training_time text
training_days integer

-- plans (optional, can re-calculate from profile)
id          uuid
user_id     uuid references profiles(id)
created_at  timestamptz
plan_json   jsonb  -- full ChronoCalculator output

-- admin_roles (simple)
user_id     uuid references auth.users
role        text  -- 'admin'
```

**Auth providers to enable in Supabase dashboard:**
- Google OAuth (requires Google Cloud Console app)
- Email (built-in)

**Files to create:**
- `js/supabase-client.js` — initialize Supabase client with project URL + anon key
- `auth.html` — login page (Google button + email form)
- `admin.html` — admin dashboard (list users, view profiles)
- Update `onboarding.html` → after `generatePlan()`, if user is logged in, save to DB
- Update `dashboard.html` → on load, if logged in, pull profile from DB (fallback to localStorage)

**Environment variables (for Vercel):**
```
SUPABASE_URL=https://xxxx.supabase.co
SUPABASE_ANON_KEY=eyJhbGci...
```
Since this is a static site, these are injected at build time OR put directly in `supabase-client.js` (anon key is safe to expose publicly — row-level security protects data).

### User flow with accounts

```
Landing page (index.html)
    |
    ├─ [guest]  → onboarding → dashboard (localStorage only)
    |
    └─ [login]  → auth.html → Google OAuth or email
                    |
                    ├─ new user  → onboarding → save profile to DB → dashboard
                    └─ returning → load profile from DB → dashboard (skip onboarding)
```

---

## PART 3 — DIET COMMUNICATION: FILLING THE PROTEIN GAPS

### Problem (critical UX issue)
The current protein windows show, for example:
- 07:00 — Breakfast: 35g protein
- 13:00 — Lunch: 40g protein
- 17:00 — Post-workout: 38g protein
- 22:00 — Pre-sleep: 40g protein

This leaves a **6-hour gap from 7am to 1pm** and a **5-hour gap from 1pm to 5pm** with NOTHING shown. A normal person reads this as "don't eat anything in between." That is wrong and potentially harmful.

### What we actually want to communicate

The protein windows are **minimum protein anchors**, not the full daily diet. Between windows, the user eats normally. The app tells them WHEN and HOW MUCH protein to hit at each anchor — not that they starve in between.

### Solutions

#### 3A — Copy/messaging fix (immediate, no code)
Change the section subtitle from:
> "Tap any window for food suggestions and leucine check"

To something like:
> "These are your protein anchors. Eat normally between windows — hit these targets at each marked time."

Add a small info card above the windows:
> "Your protein plan shows minimum protein targets per window. Between windows, continue your normal eating habits. Total daily food intake should meet your calorie needs — protein timing optimizes when you build muscle, not how much you eat overall."

#### 3B — Add "between windows" context to each card (medium effort)
Between consecutive window cards, show a subtle spacer with:
> "Eat normally between 08:30 and 13:00 — no protein minimum required in this window"

#### 3C — Full daily meal planner (future sprint)
A more ambitious view that shows a complete 24h eating schedule:
- Protein anchor windows (as now)
- "Free eating" zones between them with calorie guidance
- Optional: suggested meal templates per zone
- **Flag for future sprint — do not build now**

### Immediate actions (this sprint)
1. Update `windowsDesc` text in i18n.js (EN + ES)
2. Add an info banner above the window cards in dashboard.html
3. Consider adding a small note inside each window card: "Protein target for this meal. Continue normal eating between windows."

---

## PART 4 — BRAND REPOSITIONING: HIDING "SCIENCE"

### Problem
The word "Science" appears prominently:
- `index.html` eyebrow: "Chrono-Nutrition Science"
- `metabolic-windows.html` eyebrow: "Chrono-Nutrition · Post-Exercise Science"
- Button: "See the Science"
- Multiple footer references: "Built on 113 scientific references"

From a marketing perspective, the word "science" can:
- Sound academic/cold to casual users
- Imply complexity and intimidation
- Reduce perceived accessibility

The science IS there and IS important — but it should be the **foundation**, not the **pitch**.

### What to keep vs. what to change

| Element | Current | Change to |
|---|---|---|
| eyebrow on landing | "Chrono-Nutrition Science" | "Personalized Protein Timing" |
| CTA button | "See the Science" | "How It Works" |
| metabolic-windows eyebrow | "Post-Exercise Science" | "Post-Exercise Guide" |
| Section: metabolic-windows | title stays | keep — it's a deep-dive page |
| Evidence footer | "113 scientific references" | Keep but smaller, less prominent |
| metabolic-windows page name | `metabolic-windows.html` | consider `how-it-works.html` (or keep URL, change display) |

### What to replace "Science" with
The emotional hook is **results and personalization**, not the mechanism:
- "Built for YOUR body clock"
- "Protein timing, personalized"
- "Know when to eat. Know what to eat."
- "Turn training into muscle — automatically"

### Tone shift
- Current tone: Educational, academic, evidence-heavy
- Target tone: Confident, personal, results-focused — with science as the trust signal in the background

---

## PART 5 — CURRENT FILE INVENTORY (as of March 6)

```
APP-PROT-NUTRI-CHRONO/
├── index.html                  — Landing page
├── onboarding.html             — 5-step wizard
├── dashboard.html              — Main plan view
├── metabolic-windows.html      — Science deep-dive
├── css/
│   └── design-system.css       — Design tokens + components
├── js/
│   ├── i18n.js                 — EN/ES translations (~300+ keys)
│   ├── calculator.js           — Protein engine
│   ├── chronotype.js           — Chronotype quiz
│   ├── protein-classes.js      — 5 protein classes (A-E)
│   └── schedule-builder.js     — Timeline + window card renderer
├── data/
│   ├── protein-foods.json      — 33 foods with leucine data
│   └── chronotype-schedules.json — 3 chronotypes x training/rest
├── Blueprint05mar.md
├── Blueprint06mar.md           ← THIS FILE
├── blueprint04mar.md
└── log05mar.md
```

---

## PART 6 — SPRINT PLAN (ORDERED BY PRIORITY)

### Sprint 1 — Navigation + Messaging fixes (small, immediate)
1. Add global nav/back button to `metabolic-windows.html`
2. Add nav link to `dashboard.html` (Home)
3. Update dashboard protein windows subtitle — add info about "eating between windows"
4. Add an info banner above window cards in dashboard
5. Brand copy changes: replace "Science" with warmer language in index.html and metabolic-windows.html
6. Update i18n.js (EN + ES) for all text changes

### Sprint 2 — Supabase integration (medium, requires external setup)
1. Create Supabase project (manual step by Juan)
2. Create tables via Supabase SQL editor (script provided)
3. Enable Google OAuth in Supabase dashboard (manual step by Juan)
4. Create `js/supabase-client.js`
5. Create `auth.html` — login page
6. Update `onboarding.html` — save profile to DB on generate
7. Update `dashboard.html` — load profile from DB if logged in
8. Add login/profile button to nav
9. Create `admin.html` — basic admin panel

### Sprint 3 — Full diet context (future)
1. Design "24h eating guide" view
2. Add calorie targets alongside protein targets
3. Add "between windows" meal suggestions
4. Health app integration research

---

## PART 7 — TECHNICAL DECISIONS

### Supabase vs alternatives
- **Supabase**: open-source, PostgreSQL, free tier generous, built-in auth with Google OAuth, good JS SDK → **CHOSEN**
- Firebase: Google-owned, good auth, NoSQL → skip (JSON db less flexible)
- Clerk: auth only, no DB → skip (need both)

### Static site + Supabase pattern
Since this is a static HTML/JS/CSS site on Vercel:
- No server-side rendering needed
- Supabase JS client (`@supabase/supabase-js`) loaded via CDN
- Anon key is safe to expose (row-level security restricts data access)
- Admin key NEVER in frontend code — admin panel uses row-level security + role check

### Mobile / device association
- On mobile, after Google login, session persists in localStorage (Supabase handles this)
- No native app required — responsive web works
- PWA manifest can be added later for "Add to Home Screen" on iOS/Android

---

## PART 8 — ANSWERS TO OPEN QUESTIONS (resolved March 6)

1. **Supabase project**: YES — URL: `https://mayiumggfhhenyvueyos.supabase.co` (project created)
   - **Pending**: retrieve the `anon` key from Supabase Dashboard → Settings → API → Project API keys
2. **Google OAuth**: Juan does NOT have a Google Cloud Console project yet.
   - **Required for Google login**: Yes — Supabase needs Google OAuth credentials (client ID + secret) from GCP.
   - **How to set it up** (step-by-step):
     1. Go to https://console.cloud.google.com/ and sign in with the Gmail you want to use
     2. Create a new project (name: "ChronoProtein" or similar)
     3. Go to **APIs & Services → OAuth consent screen** → choose "External" → fill app name, email
     4. Go to **APIs & Services → Credentials** → Create Credentials → **OAuth 2.0 Client ID**
     5. Application type: **Web application**
     6. Authorized redirect URI: `https://mayiumggfhhenyvueyos.supabase.co/auth/v1/callback`
     7. Copy the **Client ID** and **Client Secret**
     8. In Supabase Dashboard → Authentication → Providers → Google → paste Client ID + Secret → Enable
   - **Alternative**: We can start with email/password login only and add Google OAuth later when GCP is configured.
3. **Admin email**: `chronotherapyapp@gmail.com`
4. **App name**: Keep "ChronoProtein" for now, change only the "science" language. Naming alternatives considered:

### App Naming Ideas (for future consideration)

| Name | Vibe | Notes |
|---|---|---|
| **ChronoProtein** (current) | Technical, clear | Works well, recognizable. Keep it. |
| **ChronoFuel** | Action-oriented | "Fuel your body at the right time" |
| **ProteinClock** | Simple, memorable | "Your protein, on the clock" |
| **MuscleSync** | Results-focused | "Sync your nutrition with your body" |
| **ChronoGains** | Gym culture | More casual, appeals to fitness crowd |
| **NutriChrono** | Scientific but softer | Inverts the emphasis — nutrition first |
| **TimeFuel** | Broad, brandable | "The right fuel, at the right time" |
| **AnaboliClock** | Niche, powerful | "Know your anabolic window" |
| **ProTiming** | Clean, modern | "Protein timing, simplified" |
| **BodyClock Nutrition** | Accessible | Easy to understand for any audience |

**Decision**: Stay with **ChronoProtein** — change taglines and marketing language only (remove "Science", add warmth).

5. **Languages**: EN/ES translations are complete. Supabase integration starts now in parallel.

---

## PART 9 — GOOGLE CLOUD CONSOLE EXPLAINED

**Why it's needed**: Supabase Auth delegates Google login to Google's own OAuth system. Google requires you to register your app in their Cloud Console so they know which app is requesting user data.

**What it costs**: FREE — Google Cloud Console has no charge for OAuth credentials.

**What users see**: When someone clicks "Sign in with Google" in the app, they see Google's official login screen (the one they already trust). After they sign in, Google sends a token back to Supabase, which creates the user account.

**Can we skip it for now?** YES — we can launch with email/password login only. Google OAuth can be added any time later without changing the app structure. The code will be ready for both; only the Supabase dashboard toggle needs to be flipped once GCP credentials exist.

---

## NEXT STEP

Sprint 1 (navigation + messaging + brand copy) and Sprint 2 (Supabase integration) begin now in parallel.
- Supabase client created with project URL
- Auth page (email/password) ready immediately
- Google OAuth added when Juan completes GCP setup
- Admin panel protected by role check on `chronotherapyapp@gmail.com`

---

*Blueprint written by Claude Sonnet 4.6 | March 6, 2026*
*Updated with Juan's answers | March 6, 2026*
*This document is a planning guide — no code has been changed.*

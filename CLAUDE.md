# ChronoProtein — Project Instructions

## Project
Chrono-nutrition web app: personalized protein timing based on chronotype.
Static HTML/JS/CSS site deployed on Vercel. Supabase backend for auth, profiles, plans, feedback.

## Architecture
- **Pages:** index.html, onboarding.html, dashboard.html, metabolic-windows.html, auth.html, admin.html
- **JS modules (IIFE pattern):** calculator.js, chronotype.js, protein-classes.js, schedule-builder.js, i18n.js, supabase-client.js, feedback.js
- **CSS:** css/design-system.css (dark theme, gradient tokens, Bebas Neue / DM Sans / DM Mono)
- **Data:** localStorage (chronoProfile, chronoPlan, chronoLang) + Supabase tables
- **Supabase:** URL `mayiumggfhhenyvueyos.supabase.co`, client variable is `sb` (not `supabase` — avoids CDN conflict)
- **i18n:** EN/ES via js/i18n.js, `data-i18n` and `data-i18n-html` attributes
- **Deploy:** Vercel auto-deploy from GitHub `juanenla/chrono-protein-app` on push to main

## Supabase Tables
- `profiles` — user profile data (weight, age, chronotype, goal, etc.)
- `plans` — JSON plan output linked to user
- `admin_roles` — admin role check (user_id + role='admin')
- `feedback` — bug/improvement/positive entries from widget (anyone can INSERT, only admins can SELECT)

## Conventions
- Commits: conventional style (feat:, fix:, docs:) — NO co-authored-by lines
- Log format: logXXmar.md with EXCHANGE ## / JUAN / CLAUDE MODEL sections — include FULL verbatim prompts, never summarize
- Log workflow: on receiving a prompt, IMMEDIATELY update log with Juan's prompt. On finishing tasks, copy FULL response text to log and add summary of what was done.
- Blueprint format: BlueprintXXmar.md with numbered parts
- i18n keys: camelCase, organized by page section
- Bilingual: all user-facing text must have EN + ES translations in js/i18n.js

## User Preferences
- Name: Juan
- Language: Spanish (Argentine)
- Admin email: chronotherapyapp@gmail.com
- Prefers blueprint-first approach (plan before code)
- Wants complete verbatim logs of all exchanges
- No co-authored-by in commits

## Current State (March 6, 2026)

### Completed
- Sprint 1: Navigation, brand repositioning, diet communication (DONE)
- Feedback widget: js/feedback.js — FAB + modal, saves to Supabase with localStorage fallback (DONE)
- Supabase integration: CDN + client on all pages, profiles/plans save on onboarding, load on dashboard (DONE)
- Admin panel: user list + feedback viewer + markdown export (Copy/Download/Preview) (DONE)
- Dynamic user nav on index.html: shows email, My Plan, Admin link, Sign Out when logged in (DONE)
- Auth page: email/password sign in/up + Google OAuth button (code ready, needs GCP setup) (DONE)

### Pending / Blocked
- **Google OAuth:** Button exists but needs Google Cloud Console project + Supabase provider config (Juan must do)
- **Admin user setup:** Juan registered with chronotherapyapp@gmail.com but email confirmation link expired. Needs to either:
  1. Confirm user manually in Supabase Dashboard > Authentication > Users > (...) > Confirm user
  2. Or re-register and click the link faster (OTP expiration should be increased to 600s in Supabase Auth settings)
- After confirming, run SQL: `INSERT INTO admin_roles (user_id, role) VALUES ('UUID-HERE', 'admin');`
- **Sprint 3 (future):** Full diet context, calorie targets, between-windows meal suggestions, health app integration

## Key Files
- `Blueprint06mar.md` — Full planning document (nav, auth, diet communication, brand)
- `plancursor06mar.md` — App radiography + feedback system design (created by Cursor)
- `feedbackv01.md` — Feedback entry JSON format template
- `data/supabase-setup.sql` — All table creation SQL (profiles, plans, admin_roles, feedback)
- `log06mar.md` — Session log with verbatim exchanges

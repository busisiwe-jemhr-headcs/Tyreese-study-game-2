# TYR3ESE QUEST HQ 🎮📚

A Grade 5 Term 3 gamified study app for Tyreese.

## What is included

- 7 subject quest tracks: Maths, Geography, History, NST, isiZulu, English, Coding & Robotics
- 30–60 minute mission tracks with 12 concept/application challenges per subject
- Concept-first feedback rather than answer memorisation
- XP, levels and streaks
- 80% target
- Parent HQ with subject mastery, recent results and practical coaching suggestions
- Original illustrated avatar: cool African Grade 5 gamer aesthetic, not based on a real person's image
- LocalStorage works immediately
- Optional Supabase sync allows Tyreese's laptop and the parent's device to share progress
- Supabase Realtime can push completed quests into the parent dashboard without a manual refresh

## Run locally

```bash
npm install
npm run dev
```

## Deploy to Vercel

1. Push this folder to GitHub.
2. Import the repo into Vercel.
3. Add environment variables from `.env.example`.
4. For cross-device sync, create a Supabase project and run `supabase.sql` in SQL Editor.
5. Set:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `VITE_FAMILY_CODE=TYREESE-2026`
6. Redeploy.

## Important

The starter app intentionally does not require a photo. The avatar is an original SVG illustration.

The curriculum map is designed around South African Grade 5 Term 3 CAPS themes and the supplied revision memo. The supplied Maths memo specifically covers fractions, angles, turns/directions, parallel/perpendicular lines, squares/rectangles and quadrilaterals.

For school-specific assessment scope, always prioritise the school's teacher memo/assessment notice if it differs from general CAPS.

## Suggested next build

Add larger question banks per topic, spaced repetition, timed boss battles, short-answer "teach it back" prompts, and a proper parent authentication flow before using this beyond a private family deployment.

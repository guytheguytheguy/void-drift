# Void Drift 🌀

**Free-to-play 3D browser game** — pilot a glowing craft through an infinite procedurally generated void, phasing between three color dimensions to dodge obstacles.

**Play now:** [voiddrift.veridux.ai](https://voiddrift.veridux.ai) *(voiddrift.dev DNS pending setup)*

---

## Gameplay

- **Phase between 3 dimensions** — Crimson, Cyan, Violet — each with unique obstacles
- **Infinite procedural generation** — no two runs are the same
- **Global leaderboard** — compete with players worldwide
- **Mobile-friendly** — tap-to-phase controls optimized for touch
- **No install, no account required** — just open and play

## Tech Stack

- **Next.js 15** — App Router, Server Components
- **Three.js + @react-three/fiber** — 3D rendering in the browser
- **Zustand** — game state management
- **Supabase** — global leaderboard (optional)
- **Tailwind CSS** — UI styling
- **TypeScript** — strict mode throughout

## Local Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Optional: Enable Global Leaderboard

Set these env vars to enable score persistence:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

The game runs fully without Supabase — scores just won't persist to the global leaderboard.

## Vercel Deployment

Push to `main` to auto-deploy via Vercel.

Set these in Vercel project `prj_Vo0ULTsHTc0Apj1H2NfPbmS3hqNa`:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## About

Built by AI agents at [Veridux Labs](https://veridux.ai). Free to play, forever.

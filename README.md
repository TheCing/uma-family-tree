# Paddock

A web app for planning [Uma Musume](https://umamusume.jp/) breeding trees — pick
characters for each slot in a pedigree and see parent/grandparent **affinity**
totals and **inspiration (spark) proc chances** update live. Trees can be saved
locally and shared via URL.

Live site: [umamily.moe](https://umamily.moe)

> Fork of [shelune/uma3](https://github.com/shelune/uma3).

## Tech stack

- **React 19** + **TypeScript**, bundled with **Vite**
- **Tailwind CSS v4** with **Radix UI** / shadcn-style components
- State persisted in `localStorage`; no backend — it's a static SPA
- Deployed on **Netlify**

## Repository layout

```
.
├── frontend/          # The React SPA (the only npm workspace)
│   └── src/
│       ├── ui/        # base (Radix/shadcn) → components → composite
│       ├── hooks/     # tree data, localStorage, URL sharing, …
│       ├── utils/     # affinity & inspiration (spark) math
│       └── assets/home/   # generated game data the app ships with
├── data/              # Offline scripts that turn game data into the JSON above
├── scripts/           # Shell helpers that drive the data pipeline
├── universal-assets/  # Drop master.db here (git-ignored) for data refreshes
└── build.sh           # Netlify build entry point
```

## Getting started

Requires **Node.js 22+** (see `.nvmrc`).

```bash
npm install          # installs the frontend workspace
npm run dev          # start the Vite dev server (http://localhost:5173)
```

Other root scripts:

| Command | Description |
| --- | --- |
| `npm run build` | Type-check and build the frontend into `frontend/dist/` |
| `npm run lint` | Run ESLint across the workspace |

## Deployment

Netlify is configured via [`netlify.toml`](./netlify.toml) and
[`build.sh`](./build.sh): it runs `npm ci` then `npm run build:frontend` and
publishes `frontend/dist/`. See [`NETLIFY_DEPLOYMENT.md`](./NETLIFY_DEPLOYMENT.md)
for details.

## Refreshing game data

The character list, affinity tables, and skills the app ships with are generated
from the game's master database (`master.db`, the SQLite export of the client's
`master.mdb`). After a game patch adds new characters, regenerate them:

1. Place the latest `master.db` in `./universal-assets/`.
2. Run the pipeline, which exports the SQLite tables, then builds the character
   names, affinity tables, affinity combinations, and downloads character images:

   ```bash
   ./scripts/run-when-new-char.sh
   ```

3. Copy the generated JSON and images into the frontend assets:

   ```bash
   ./scripts/move-data-to-frontend.sh
   ```

### Data sources

| File | Source | Notes |
| --- | --- | --- |
| `all-texts.json` | `master.db` → `text_data` | Uma names & UI texts |
| `dress-data.json` | `master.db` → `dress_data` | Uma ID & name references |
| `succession-relation-member.json` | `master.db` → `succession_relation_member` | Uma affinity groups |
| `succession-relation.json` | `master.db` → `succession_relation` | Affinity points per group |
| `skills.json` | `master.db` → `text_data` (cat 47) + `skill_data` | Skill names for the white-spark search. Historically pulled from the tracenacademy API, but that endpoint now returns 403, so the list is rebuilt from `master.db` instead. |

Each `master.db` table is exported with, e.g.:

```bash
sqlite3 -json master.db "SELECT * FROM text_data;" > all-texts.json
```

`run-when-new-char.sh` performs the character/affinity exports for you; the
table-to-file mapping above matches what that script produces.

Skills are rebuilt separately (the frontend only needs `name_en`): join the
English skill names (`text_data` category 47) to `skill_data`, drop the `×`/`◎`
variants via `skills-simplifier.ts`, then copy `skills-simplified.json` into the
frontend assets (the move script doesn't handle skills).

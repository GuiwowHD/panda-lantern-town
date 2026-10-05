# Architecture

English | [简体中文](./architecture.md)

This document describes the structure, module responsibilities, and data flow of
Panda Lantern Town, so new contributors can find their way around quickly.

## Design principles

- **Static site**: the build output is plain static files — deployable on any
  static host, no backend, no database.
- **Small and complete**: no router, state-management, or UI framework
  dependencies; the entire core is roughly 2,000 lines of TypeScript.
- **Content separated from logic**: all curriculum content (words, tones,
  sentences, unit config) lives in `src/data.ts`. Game components consume the
  data; no Chinese content is hard-coded in them.

## Technology choices

| Layer | Choice | Notes |
|-------|--------|-------|
| UI | React 19 + TypeScript 7 (strict) | Function components + hooks only |
| Build | Vite 8 | Dev server and bundler; `tsc -b` handles type checking |
| Routing | Hand-rolled hash router | See `parseRoute` / `routeHash` in `src/App.tsx` |
| Persistence | `localStorage` | Progress and settings, with a v1 → v2 migration |
| Icons | lucide-react | The only runtime UI dependency |
| Voice | Pre-generated Edge TTS | `scripts/generate-audio.mjs` → `public/audio/*.mp3` |

## Layout and module responsibilities

```
src/
├── main.tsx               # Entry: mounts the React root
├── App.tsx                # Route parsing, global state (progress/settings/result), page dispatch
├── types.ts               # Domain types: Word / ToneRound / OrderRound / Unit / GameProgress…
├── data.ts                # Curriculum: 24 words, 4 units, tone & sentence rounds, listen-round builder
├── progress.ts            # Pure functions: star ratings, unlocks, totals, continue-unit pick
├── audio.ts               # useAudio hook: voice playback (Audio element) + correct/wrong SFX (WebAudio)
├── random.ts              # Fisher–Yates shuffle
└── components/
    ├── Home.tsx           # Home: panda guide, unit map, star total
    ├── UnitScreen.tsx     # Unit: vocabulary strip, three challenge cards, unit stars
    ├── ListenGame.tsx     # Lantern Market: hear a word, pick the picture
    ├── ToneGame.tsx       # Tone Slide: identify the tone
    ├── OrderGame.tsx      # Sentence Bridge: order the word tiles
    ├── GameShell.tsx      # Shared game chrome: header, round progress, replay button
    ├── FinishPanel.tsx    # Results: stars, replay, back to map
    └── GrownUpsPanel.tsx  # Grown-ups: progress table, pinyin toggle, reset
```

`public/assets/` (illustrations, word cards) and `public/audio/` (pre-generated
speech) are static resources referenced by absolute paths `/assets/...` and
`/audio/...`.

## Routing

Hash routing, with `window.location.hash` as the single source of truth:

| Hash | Screen |
|------|--------|
| (empty) | Home |
| `#/grownups` | Grown-ups panel |
| `#/unit/:unitId` | Unit screen |
| `#/unit/:unitId/:gameId` | `ListenGame` / `ToneGame` / `OrderGame` |

`parseRoute()` runs on every `hashchange` and validates parameters (unknown
`unitId`/`gameId` values fall back to Home). `navigate()` updates both React
state and the hash so browser back/forward keep working.

## State management

All global state lives in `App.tsx` and flows down as props:

- **`progress: GameProgress`** — best star rating (0–3) per challenge per unit.
  Written to the `panda-lantern-progress-v2` localStorage key on every change;
  on first load, a legacy `panda-lantern-progress` key (v1, unit one only) is
  migrated into the new shape.
- **`settings: GameSettings`** — currently just `showPinyin`, persisted to
  `panda-lantern-settings`.
- **`result`** — the current finish-screen payload (unit, game, score), used
  only to render `FinishPanel`.

Every read/write is wrapped in try/catch: if `localStorage` is unavailable or
corrupted, the app falls back to empty progress.

## Key data flow

A listening challenge end to end:

```
Home ──tap unit──▶ UnitScreen ──tap challenge──▶ ListenGame
                                                   │
                        data.ts: getListenRounds(unit)
                        (6 words → 6 rounds, 3 options each, positions rotated)
                                                   │
                        target word audio auto-plays each round (audio.ts / public/audio)
                                                   │
                        child taps ──▶ correct: +2 pts (+1 if missed earlier) ──▶ next round
                                   └──▶ wrong: retry prompt, mark missedThisRound
                                                   │
                        final round ──▶ onComplete(score, total)
                                                   │
                        App.completeGame ──▶ progress.ts:getRating → stars (keep best)
                                           ──▶ setResult ──▶ FinishPanel
```

## Scoring and unlock rules

- First-try correct answers score +2 points; correct after a miss scores +1.
  Max score = rounds × 2 (listening 6 rounds / 12 pts, tones 4 / 8, order 3 / 6).
- Stars (`getRating`): ≥ 90% of max → 3 stars, ≥ 65% → 2 stars, finishing at
  all → at least 1 star.
- Unit N unlocks once at least 2 challenges in unit N−1 have stars > 0
  (`isUnitUnlocked`).
- Grand total: 4 units × 3 challenges × 3 stars = 36 stars.

## Audio pipeline

```
scripts/generate-audio.mjs
  ├─ 56 scripts (24 words + 20 tone syllables + 12 sentences)
  ├─ synthesizes each via Python edge_tts (zh-CN-XiaoxiaoNeural) to mp3
  ├─ skips files that already exist (FORCE_AUDIO=1 to overwrite)
  └─ writes to public/audio/
Runtime:
  useAudio().play(src)  ──▶ new Audio(src); only one voice clip plays at a time
  useAudio().playSfx()  ──▶ WebAudio oscillators: rising triad (correct) / falling pair (wrong)
```

Speech is frozen into static mp3 files at build time; the app never makes a
network speech request at runtime.

## Styling

All styles live in `src/styles.css` (~1,700 lines) with no CSS framework.
Theming uses CSS custom properties: each unit defines `color` and `surface`,
components write them into `--unit-color` / `--unit-surface`, and cards and
buttons recolor automatically.

## Error handling and edge cases

- Invalid route params → fall back to Home instead of a blank error screen.
- Direct URL access to a locked unit → renders Home.
- `localStorage` failures → silently fall back to empty progress; the game stays fully playable.
- Voice autoplay blocked → `.catch(() => undefined)`; the child can tap
  "Play sound" to replay.
- A suspended `AudioContext` is `resume()`d before the SFX is synthesized.

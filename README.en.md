# Panda Lantern Town · 熊猫灯笼镇

English | [简体中文](./README.md)

A bite-sized Mandarin listening game for English-speaking kids. A panda guide
leads children through four lantern-lit towns where real Mandarin audio powers
three kinds of short challenges — word listening, tone recognition, and sentence
building — one lantern at a time.

- **Zero friction**: open the page and play. No accounts, no sign-ups.
- **Privacy first**: nothing is collected; progress lives only in the browser's `localStorage`.
- **Offline voice**: every Mandarin clip is pre-generated with Edge TTS and served
  as static files — the app never calls a speech service at runtime.

[![Version](https://img.shields.io/badge/version-1.0.0-blue)](./package.json)
[![License](https://img.shields.io/badge/license-ISC-green)](./LICENSE)

## How it plays

The game ships **4 course units** and **3 listening challenges**. Finish any two
challenges in a unit to unlock the next stop. Each challenge awards 1–3 stars
based on performance — 36 stars in total.

| # | Unit | Theme | Sample words |
|---|------|-------|--------------|
| 01 | Morning Market 早餐集市 | Food and drinks | apple, banana, fish, water, bread, rice |
| 02 | Bamboo Friends 竹林朋友 | Animals and actions | cat, dog, bird, rabbit, horse, panda |
| 03 | Rainbow Garden 彩虹花园 | Colors and shapes | red, blue, yellow, green, circle, star |
| 04 | Warm Home 温暖一家 | Family and daily life | mom, dad, me, love, run, eat |

| Challenge | Chinese | Gameplay |
|-----------|---------|----------|
| Lantern Market | 灯笼市场 | Hear a Mandarin word, tap the matching picture |
| Tone Slide | 声调滑梯 | Hear a syllable, pick which of the four tones it uses |
| Sentence Bridge | 句子小桥 | Hear a full sentence, tap word tiles in the right order |

The `Grown-ups` panel shows the best star rating for every activity, toggles
pinyin hints, and can reset all progress.

## Getting started

Requirements: Node.js 20+. Regenerating the voice clips additionally needs
Python 3.14 with [edge-tts](https://pypi.org/project/edge-tts/).

```powershell
npm install
npm run audio   # generates the 56 clips in public/audio (optional — the repo ships them)
npm run dev
```

Dev server: <http://127.0.0.1:4173>

```powershell
npm run check   # TypeScript type check
npm run build   # type check + production build (outputs to dist/)
npm run preview # preview the production build locally
```

## Voice generation

Speech is synthesized with the Edge TTS voice `zh-CN-XiaoxiaoNeural` by
`scripts/generate-audio.mjs` and written to `public/audio/`. Existing clips are
skipped; force a full regeneration with:

```powershell
$env:FORCE_AUDIO = "1"
npm run audio
```

If your default `python` is not 3.14, point the script at another interpreter:

```powershell
$env:PYTHON = "python"
npm run audio
```

## Tech stack

- [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/) (strict mode)
- [Vite 8](https://vite.dev/) for dev server and bundling
- [lucide-react](https://lucide.dev/) icons
- No router / state libraries: hash routing and progress persistence are small
  hand-rolled implementations

## Project layout

```
├── docs/                  # Project docs (architecture · development · curriculum, bilingual)
├── public/
│   ├── assets/            # Illustrations and vocabulary card images
│   └── audio/             # Pre-generated Mandarin speech (Edge TTS)
├── scripts/
│   └── generate-audio.mjs # Voice generation script
├── src/
│   ├── components/        # Screens and game components
│   ├── data.ts            # Curriculum: words, tones, sentences, unit config
│   ├── progress.ts        # Stars, unlocks, progress math
│   ├── audio.ts           # Voice playback and correct/wrong sound effects
│   ├── types.ts           # Domain type definitions
│   └── App.tsx            # Routing and global state
└── index.html
```

## Documentation

| Doc | 中文 | English |
|-----|------|---------|
| Architecture | [docs/architecture.md](./docs/architecture.md) | [docs/architecture.en.md](./docs/architecture.en.md) |
| Development guide | [docs/development.md](./docs/development.md) | [docs/development.en.md](./docs/development.en.md) |
| Curriculum & vocabulary | [docs/curriculum.md](./docs/curriculum.md) | [docs/curriculum.en.md](./docs/curriculum.en.md) |

## License

[ISC](./LICENSE)

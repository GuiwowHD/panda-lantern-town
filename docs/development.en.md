# Development Guide

English | [简体中文](./development.md)

This guide is for developers who want to run, modify, or extend Panda Lantern
Town locally.

## Requirements

| Tool | Version | Purpose |
|------|---------|---------|
| Node.js | 20+ | Installing deps, dev server, builds |
| npm | ships with Node | Package management |
| Python | 3.14 (or set `PYTHON`) | Only needed to regenerate voice clips |
| edge-tts | latest | Python speech package, `pip install edge-tts` |

## Common commands

```powershell
npm install        # install dependencies
npm run dev        # dev server, http://127.0.0.1:4173
npm run check      # TypeScript type check (strict mode)
npm run build      # type check + Vite production build, outputs dist/
npm run preview    # preview the production build locally
npm run audio      # generate/fill in the voice clips in public/audio
```

Both the dev server and preview bind to `127.0.0.1:4173`, matching the README.

## Voice generation

`scripts/generate-audio.mjs` walks a built-in list of 56 scripts and synthesizes
each one via `python -m edge_tts` into `public/audio/<name>.mp3`:

- Existing files are skipped, so day-to-day development only needs one run;
- Set `FORCE_AUDIO=1` after changing any script text or for a full regeneration;
- The script invokes Python as `py -3.14` by default; override with the
  `PYTHON` environment variable:

```powershell
$env:PYTHON = "python"        # or an absolute path
$env:FORCE_AUDIO = "1"        # optional: force full regeneration
npm run audio
```

> The repo already ships all 56 finished clips. You only need this when the
> curriculum changes.

## Adding curriculum content

All curriculum content lives in `src/data.ts`; no component hard-codes Chinese.
To extend it:

### Adding a word (e.g. "moon")

1. `src/types.ts`: add `"moon"` to the `WordId` union.
2. `src/data.ts`: add an entry to `WORDS` (hanzi, pinyin, English, audio path,
   image path, theme color).
3. Assets: drop in `public/assets/items/moon.png` (the word card image).
4. Voice: append `["moon", "月亮"]` to the `clips` array in
   `scripts/generate-audio.mjs`, then run `npm run audio`.
5. Add the word id to a unit's `words` array — listening rounds and options are
   derived automatically (`getListenRounds`), nothing else to configure.

### Adding a sentence round

Append an entry to the target unit's `orderRounds`:

- `audio`: the sentence clip path, plus a matching `order-*` line in
  `generate-audio.mjs`;
- `english`: the hint the child sees;
- `answer`: the correct tile id sequence;
- `tiles`: the shuffled bank (answer + distractors, 5–6 tiles recommended).

### Adding a unit

Append a `Unit` to the `UNITS` array: `id` (also extend `UnitId` in
`types.ts`), number, titles, description, theme `color` and `surface`, words,
4 `toneRounds`, and 3 `orderRounds`. Unlock rules (two challenges in the
previous unit) and the progress shape adapt automatically — `progress.ts`
needs no changes.

Tone rounds need clips named `tone-<unit>-1..4`, one character per tone
(first through fourth).

## Code conventions

- TypeScript strict; `npm run check` must pass with zero errors;
- Function components only; game state uses `useState` plus timer refs;
- Any math involving progress, stars, or unlocks belongs in `progress.ts` as a
  testable pure function;
- Curriculum data is read-only inside components — never mutate `WORDS` / `UNITS`;
- New styles go into `src/styles.css`, reusing existing classes and theme
  variables like `--unit-color` where possible.

## Release checklist

1. `npm run check && npm run build` — must pass;
2. `npm run preview` and manually walk all four units and three games;
3. Bump `version` in `package.json`, commit, and tag.

`dist/` is gitignored; deploy by uploading the build output to any static host.

## Known limitations

- Progress lives only in the browser's `localStorage`; clearing browser data
  clears it (an intentional privacy choice).
- Voice is pre-generated: new script text requires `npm run audio` before the
  clip exists.
- `tone-ma-1..4` (妈/麻/马/骂) in `generate-audio.mjs` are spare material —
  the curriculum doesn't reference them yet, but the script still produces them.

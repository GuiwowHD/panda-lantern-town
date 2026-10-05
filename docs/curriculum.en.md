# Curriculum & Vocabulary

English | [简体中文](./curriculum.md)

This document lists the complete teaching content of Panda Lantern Town: unit
structure, the 24 core words, 16 tone exercises, 12 sentence exercises, and the
scoring and unlock rules. Source of truth is `src/data.ts`; if this document
and the code disagree, the code wins.

## Teaching design

- **Listening first**: every challenge starts with the ear. Children are never
  asked to read characters; hanzi and pinyin only ever appear as support.
- **Tone awareness**: each unit includes four tone exercises. Pitch-path
  diagrams (high / rising / dipping / falling) help children map "the shape of
  a sound" onto the four Mandarin tones.
- **Small steps**: each round of challenges takes 3–6 quick trials and about
  1–2 minutes. Wrong answers cost nothing and can be retried instantly, keeping
  frustration low.
- **Sentence templates**: all 12 sentences come from a handful of simple
  patterns (我要 / 我想 / 我喜欢 / 是 / 爱 / 会) plus measure words
  (一个 / 一只 / 一条), so basic word order is absorbed naturally.

## Units and unlocking

| # | Unit | Chinese | Theme | Words |
|---|------|---------|-------|-------|
| 01 | Morning Market | 早餐集市 | Food and drinks | 6 |
| 02 | Bamboo Friends | 竹林朋友 | Animals and actions | 6 |
| 03 | Rainbow Garden | 彩虹花园 | Colors and shapes | 6 |
| 04 | Warm Home | 温暖一家 | Family and daily life | 6 |

Unit 1 is unlocked from the start; unit N unlocks after **any 2 challenges in
unit N−1 are completed**. Each unit contains three challenges (Lantern Market /
Tone Slide / Sentence Bridge); finishing all three "lights up" the town.

## Vocabulary (24 words)

### Unit 01 · Morning Market 早餐集市

| Hanzi | Pinyin | English |
|-------|--------|---------|
| 苹果 | píng guǒ | apple |
| 香蕉 | xiāng jiāo | banana |
| 鱼 | yú | fish |
| 水 | shuǐ | water |
| 面包 | miàn bāo | bread |
| 米饭 | mǐ fàn | rice |

### Unit 02 · Bamboo Friends 竹林朋友

| Hanzi | Pinyin | English |
|-------|--------|---------|
| 猫 | māo | cat |
| 狗 | gǒu | dog |
| 鸟 | niǎo | bird |
| 兔子 | tù zi | rabbit |
| 马 | mǎ | horse |
| 熊猫 | xióng māo | panda |

### Unit 03 · Rainbow Garden 彩虹花园

| Hanzi | Pinyin | English |
|-------|--------|---------|
| 红色 | hóng sè | red |
| 蓝色 | lán sè | blue |
| 黄色 | huáng sè | yellow |
| 绿色 | lǜ sè | green |
| 圆形 | yuán xíng | circle |
| 星星 | xīng xing | star |

### Unit 04 · Warm Home 温暖一家

| Hanzi | Pinyin | English |
|-------|--------|---------|
| 妈妈 | mā ma | mom |
| 爸爸 | bà ba | dad |
| 我 | wǒ | me |
| 爱 | ài | love |
| 跑 | pǎo | run |
| 吃 | chī | eat |

## Tone exercises (4 units × 4 tones)

Each unit's Tone Slide challenge has 4 rounds, one per tone, in random order:

| Unit | Tone 1 · High and steady | Tone 2 · Rising | Tone 3 · Dips, then rises | Tone 4 · Falling |
|------|--------------------------|------------------|----------------------------|-------------------|
| 01 Morning Market | 猫 māo | 鱼 yú | 水 shuǐ | 饭 fàn |
| 02 Bamboo Friends | 猫 māo | 牛 niú | 马 mǎ | 兔 tù |
| 03 Rainbow Garden | 方 fāng | 圆 yuán | 紫 zǐ | 绿 lǜ |
| 04 Warm Home | 妈 mā | 人 rén | 我 wǒ | 爱 ài |

## Sentence exercises (4 units × 3 sentences)

Each round plays the full sentence and shows an English hint (hideable); the
child rebuilds it by tapping tiles in order:

| Unit | Sentence | English | Tiles |
|------|----------|---------|-------|
| 01 | 我要一个苹果。 | I want one apple. | 4 |
| 01 | 我要一条鱼。 | I want one fish. | 4 |
| 01 | 我想喝水。 | I want to drink water. | 4 |
| 02 | 我要一只猫。 | I want one cat. | 4 |
| 02 | 我要一只兔子。 | I want one rabbit. | 4 |
| 02 | 我想看熊猫。 | I want to see a panda. | 4 |
| 03 | 我喜欢红色。 | I like red. | 3 |
| 03 | 我喜欢绿色。 | I like green. | 3 |
| 03 | 星星是黄色的。 | The star is yellow. | 3 |
| 04 | 我爱妈妈。 | I love Mom. | 3 |
| 04 | 我爱爸爸。 | I love Dad. | 3 |
| 04 | 我会跑。 | I can run. | 3 |

Every round's tile bank includes the answer tiles plus 2 distractors
(measure-word contrasts like 一个 / 一只 / 一条, near-noun contrasts, etc.).

## Challenge rules and scoring

### Lantern Market (listen and pick)

- 6 rounds per unit = the unit's 6 words; each round plays one word and shows
  3 pictures;
- Option positions rotate between rounds so children can't just memorize a spot;
- A wrong answer does not end the round — the child retries and the round is
  worth 1 point instead of 2.

### Tone Slide (identify the tone)

- 4 rounds per unit in random order;
- Each round plays one syllable; the child picks one of 4 tone cards, each with
  its pitch-path curve;
- A correct answer reveals the pinyin and a tone description, reinforcing the
  sound-shape connection.

### Sentence Bridge (build the sentence)

- 3 rounds per unit; tiles are tapped in order into sentence slots;
- Judgment is automatic once the slots are full; a wrong order clears the
  slots for a retry worth 1 point;
- The English hint shows by default and can be hidden to raise difficulty.

### Scoring and stars

| Rule | Value |
|------|-------|
| Correct on first try | +2 points |
| Correct after a miss | +1 point |
| Lantern Market max | 6 rounds × 2 = 12 points |
| Tone Slide max | 4 rounds × 2 = 8 points |
| Sentence Bridge max | 3 rounds × 2 = 6 points |
| ★★★ | score rate ≥ 90% |
| ★★ | score rate ≥ 65% |
| ★ | awarded for finishing |

Stars keep the historical best and can be improved by replaying. The game has
4 units × 3 challenges × 3 stars = **36 stars** in total.

## Grown-ups panel

- Shows the best stars and unlock state for every unit and challenge, out of
  36 total;
- The "Pinyin helpers" toggle: when off, unit word strips and tiles show
  English instead of pinyin;
- "Reset all progress" wipes everything after a confirmation;
- The panel states plainly: no accounts, no ads, no remote profiles — progress
  lives only in this browser.

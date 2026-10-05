# 架构说明

[English](./architecture.en.md) | 简体中文

本文描述 Panda Lantern Town 的整体结构、模块职责与数据流，帮助新贡献者快速定位代码。

## 总体设计原则

- **静态站点**：构建后是纯静态文件，可部署到任意静态托管服务，无后端、无数据库。
- **小而完整**：不引入路由库、状态管理库或 UI 框架，全部核心逻辑约 2000 行 TypeScript。
- **内容与逻辑分离**：课程内容（词汇、声调、句子、单元配置）集中在 `src/data.ts`，
  游戏逻辑只消费数据，不硬编码任何中文内容。

## 技术选型

| 层 | 选择 | 说明 |
|----|------|------|
| UI | React 19 + TypeScript 7（strict） | 函数组件 + Hooks，无 class 组件 |
| 构建 | Vite 8 | 开发服务器与产物构建；`tsc -b` 负责类型检查 |
| 路由 | 手写 hash 路由 | 见 `src/App.tsx` 的 `parseRoute` / `routeHash` |
| 持久化 | `localStorage` | 进度与设置，含 v1 → v2 迁移逻辑 |
| 图标 | lucide-react | 唯一的运行时 UI 依赖 |
| 语音 | Edge TTS 预生成 | `scripts/generate-audio.mjs` → `public/audio/*.mp3` |

## 目录结构与模块职责

```
src/
├── main.tsx               # 入口：挂载 React 根节点
├── App.tsx                # 路由解析、全局状态（进度/设置/结算结果）、页面分发
├── types.ts               # 领域类型：Word / ToneRound / OrderRound / Unit / GameProgress 等
├── data.ts                # 课程内容：24 个词汇、4 个单元、声调与句子关卡、单元内听力轮次生成
├── progress.ts            # 纯函数：星级计算、单元解锁、总星数、继续单元推荐
├── audio.ts               # useAudio Hook：语音播放（Audio 元素）+ 正确/错误音效（WebAudio 合成）
├── random.ts              # Fisher–Yates 洗牌
└── components/
    ├── Home.tsx           # 主页：熊猫向导、单元地图、总星数
    ├── UnitScreen.tsx     # 单元页：词汇条、三个挑战入口、单元星数
    ├── ListenGame.tsx     # 灯笼市场：听词选图
    ├── ToneGame.tsx       # 声调滑梯：辨四声
    ├── OrderGame.tsx      # 句子小桥：词块排序
    ├── GameShell.tsx      # 游戏页共用外壳：头部、进度、重播按钮
    ├── FinishPanel.tsx    # 结算面板：星数、重玩、返回
    └── GrownUpsPanel.tsx  # 家长面板：进度总览、拼音开关、重置
```

`public/` 下的 `assets/`（插图、词汇卡片）与 `audio/`（预生成语音）均为静态资源，
通过绝对路径 `/assets/...`、`/audio/...` 引用。

## 路由

采用 hash 路由，`window.location.hash` 即单一事实来源：

| hash | 页面 |
|------|------|
| （空） | 主页 `Home` |
| `#/grownups` | 家长面板 `GrownUpsPanel` |
| `#/unit/:unitId` | 单元页 `UnitScreen` |
| `#/unit/:unitId/:gameId` | 游戏页 `ListenGame` / `ToneGame` / `OrderGame` |

`parseRoute()` 在每次 `hashchange` 时解析并校验参数（未知 `unitId`/`gameId` 一律回落主页）。
导航时 `navigate()` 同时更新 React state 与 hash，保证前进/后退可用。

## 状态管理

全局状态全部位于 `App.tsx`，以 props 下发：

- **`progress: GameProgress`** —— 每个单元每个挑战的最佳星级（0–3）。
  变化时自动写入 `localStorage` 键 `panda-lantern-progress-v2`；
  首次加载时若存在旧键 `panda-lantern-progress`（v1，仅单元一），会迁移到新结构。
- **`settings: GameSettings`** —— 目前仅 `showPinyin`（是否显示拼音），持久化到
  `panda-lantern-settings`。
- **`result`** —— 当前结算信息（单元、挑战、得分），仅用于渲染 `FinishPanel`。

所有读写均有 try/catch 兜底：`localStorage` 不可用或数据损坏时回落到空进度。

## 关键数据流

以一次听力挑战为例：

```
Home ──点击单元──▶ UnitScreen ──点击挑战──▶ ListenGame
                                              │
                     data.ts: getListenRounds(unit)
                              （6 个词 → 6 轮，每轮 3 个选项并轮换位置）
                                              │
                     每轮进入时自动播放目标词汇音频（audio.ts / public/audio）
                                              │
                     孩子点图 ──▶ 正确：+2 分（本轮答错过则 +1）──▶ 下一轮
                              └─▶ 错误：提示重试，标记 missedThisRound
                                              │
                     最后一轮 ──▶ onComplete(score, total)
                                              │
                     App.completeGame ──▶ progress.ts:getRating 折算星级（取历史最高）
                                       ──▶ setResult ──▶ FinishPanel
```

## 计分与解锁规则

- 每轮首次答对 +2 分，答错后答对 +1 分；满分 = 轮数 × 2
  （听力 6 轮 12 分、声调 4 轮 8 分、排序 3 轮 6 分）。
- 星级（`getRating`）：得分率 ≥ 90% 得 3 星，≥ 65% 得 2 星，完成即至少 1 星。
- 单元 N 解锁条件：单元 N-1 中至少 2 个挑战星级 > 0（`isUnitUnlocked`）。
- 全游戏总星数上限：4 单元 × 3 挑战 × 3 星 = 36。

## 音频管线

```
scripts/generate-audio.mjs
  ├─ 56 条文案（24 词汇 + 20 声调音节 + 12 句子）
  ├─ 调用 Python edge_tts（zh-CN-XiaoxiaoNeural）逐条合成 mp3
  ├─ 已存在的文件默认跳过（FORCE_AUDIO=1 强制覆盖）
  └─ 输出到 public/audio/
运行时：
  useAudio().play(src)  ──▶ new Audio(src) 播放，同一时刻只保留一个语音
  useAudio().playSfx()  ──▶ WebAudio 振荡器实时合成上行三音（正确）/ 下行两音（错误）
```

语音在构建期即固化为静态 mp3，运行时不发起任何网络语音请求。

## 样式

全部样式位于 `src/styles.css`（约 1700 行），无 CSS 框架。主题化通过 CSS 自定义属性实现：
每个单元定义 `color`（主色）与 `surface`（底色），组件将其写入
`--unit-color` / `--unit-surface`，卡片、按钮等样式据此自动换色。

## 错误处理与边界情况

- 路由参数非法 → 回落主页（而非报错白屏）。
- 单元未解锁却通过 URL 直达 → 直接渲染主页。
- `localStorage` 异常 → 静默回落空进度，游戏仍可完整进行。
- 语音播放被浏览器自动播放策略拦截 → `.catch(() => undefined)` 静默失败，可手动点
  「Play sound」重播。
- 音效 `AudioContext` 处于 suspended 状态时先 `resume()` 再合成。

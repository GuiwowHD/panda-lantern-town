# 开发指南

[English](./development.en.md) | 简体中文

本文面向想要本地运行、修改或扩展 Panda Lantern Town 的开发者。

## 环境要求

| 工具 | 版本 | 用途 |
|------|------|------|
| Node.js | 20+ | 安装依赖、开发与构建 |
| npm | 随 Node 附带 | 包管理 |
| Python | 3.14（或通过 `PYTHON` 指定） | 仅重新生成语音时需要 |
| edge-tts | 最新 | Python 语音合成包，`pip install edge-tts` |

## 常用命令

```powershell
npm install        # 安装依赖
npm run dev        # 开发服务器，http://127.0.0.1:4173
npm run check      # TypeScript 类型检查（strict 模式）
npm run build      # 类型检查 + Vite 产物构建，输出 dist/
npm run preview    # 本地预览构建产物
npm run audio      # 生成/补齐 public/audio 语音
```

开发服务器与预览均绑定 `127.0.0.1:4173`，与 README 中的说明保持一致。

## 语音生成

语音脚本 `scripts/generate-audio.mjs` 读取内置的 56 条文案清单，逐条调用
`python -m edge_tts` 合成到 `public/audio/<名称>.mp3`：

- 已存在的文件自动跳过，因此日常开发只需运行一次；
- 修改了文案或想整体重新生成时，设置 `FORCE_AUDIO=1`；
- 默认使用 `py -3.14` 调用 Python，可通过 `PYTHON` 环境变量换成其他解释器：

```powershell
$env:PYTHON = "python"        # 或绝对路径
$env:FORCE_AUDIO = "1"        # 可选：强制全部重新生成
npm run audio
```

> 仓库已包含全部 56 段成品语音。除非改动课程内容，否则无需重新生成。

## 如何添加课程内容

课程内容全部集中在 `src/data.ts`，页面组件不会硬编码中文。新增内容按以下步骤：

### 新增词汇（例如「月亮」）

1. `src/types.ts`：在 `WordId` 联合类型中加入 `"moon"`。
2. `src/data.ts`：在 `WORDS` 中添加条目（汉字、拼音、英文、音频路径、图片路径、主题色）。
3. 放置资源：`public/assets/items/moon.png`（词汇卡片图）。
4. 生成语音：在 `scripts/generate-audio.mjs` 的 `clips` 数组中加入
   `["moon", "月亮"]`，然后 `npm run audio`。
5. 将该词加入某个单元的 `words` 数组——听力挑战的轮数与选项自动由单元词汇派生
   （`getListenRounds`），无需额外配置。

### 新增句子关卡

在目标单元的 `orderRounds` 中追加一关：

- `audio`：句子语音路径，并在 `generate-audio.mjs` 中补一条 `order-*` 文案；
- `english`：孩子看到的英文提示；
- `answer`：正确词块 id 顺序；
- `tokens`：打乱展示的词块（正确答案 + 干扰项，建议 5–6 个）。

### 新增单元

在 `UNITS` 数组中追加一个 `Unit`：`id`（同时补进 `types.ts` 的 `UnitId`）、编号、
中英标题、描述、主题色 `color` 与底色 `surface`、词汇、4 条 `toneRounds`、
3 条 `orderRounds`。解锁规则（完成前一单元 2 个挑战即解锁）与进度结构会自动适应，
无需改动 `progress.ts`。

声调关卡需要对应语音：`tone-<单元>-1..4`，按「一声 / 二声 / 三声 / 四声」各配一个单字。

## 代码约定

- TypeScript strict 模式，`npm run check` 必须零错误；
- 组件为纯函数组件，游戏状态用 `useState` + 定时器 ref 管理；
- 涉及进度、星级、解锁的计算放在 `progress.ts`，保持为可独立测试的纯函数；
- 课程数据只进不改：组件不得修改 `WORDS` / `UNITS` 的内容；
- 新样式加入 `src/styles.css`，优先复用现有 class 与 `--unit-color` 等主题变量。

## 发布

1. `npm run check && npm run build`，确认无错误；
2. `npm run preview` 人工过一遍四个单元与三个游戏；
3. 更新 `package.json` 的 `version`，提交并打 tag。

`dist/` 在 `.gitignore` 中，不会被提交；部署时把构建产物上传到任意静态托管即可。

## 已知限制

- 进度只存在浏览器 `localStorage`，清除浏览器数据即丢失（产品上是有意的隐私设计）；
- 语音为预生成文件，新增文案后必须运行 `npm run audio` 才有对应音频；
- `scripts/generate-audio.mjs` 中的 `tone-ma-1..4`（妈/麻/马/骂）为备用素材，
  当前课程数据未引用，生成脚本仍会产出它们。

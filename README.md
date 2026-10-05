# Panda Lantern Town · 熊猫灯笼镇

[English](./README.en.md) | 简体中文

一款面向英语母语儿童的普通话听力启蒙网页小游戏。孩子跟随熊猫向导穿过四座灯笼小镇，
在真实普通话语音的引导下完成听词、辨调、拼句三类短关卡，一点一点点亮自己的中文之旅。

- **零门槛**：打开网页即玩，无需注册账号。
- **隐私优先**：不收集任何数据，进度只保存在浏览器 `localStorage` 中。
- **离线语音**：全部普通话音频由 Edge TTS 预先生成并随站点静态分发，运行时不依赖任何在线服务。

[![Version](https://img.shields.io/badge/version-1.0.0-blue)](./package.json)
[![License](https://img.shields.io/badge/license-ISC-green)](./LICENSE)

## 玩法一览

游戏包含 **4 个课程单元** 和 **3 种听力挑战**。完成当前单元中的任意两个挑战，
即可解锁下一站；每个挑战按表现获得 1–3 颗星，全游戏共 36 颗星。

| # | 单元 | 主题 | 词汇示例 |
|---|------|------|----------|
| 01 | 早餐集市 Morning Market | 食物与饮品 | 苹果、香蕉、鱼、水、面包、米饭 |
| 02 | 竹林朋友 Bamboo Friends | 动物与动作 | 猫、狗、鸟、兔子、马、熊猫 |
| 03 | 彩虹花园 Rainbow Garden | 颜色与形状 | 红色、蓝色、黄色、绿色、圆形、星星 |
| 04 | 温暖一家 Warm Home | 家人与日常 | 妈妈、爸爸、我、爱、跑、吃 |

| 挑战 | 中文名 | 玩法 |
|------|--------|------|
| Lantern Market | 灯笼市场 | 听中文词，从图片中选出对应的一张 |
| Tone Slide | 声调滑梯 | 听一个音节，判断它是哪一声（高平 / 上升 / 降升 / 下降） |
| Sentence Bridge | 句子小桥 | 听完整句子，按顺序点击词块把它拼出来 |

`Grown-ups` 家长面板中可以查看每项活动的最佳星级、切换拼音提示开关，或一键重置进度。

## 快速开始

环境要求：Node.js 20+；重新生成语音时另需 Python 3.14 与 [edge-tts](https://pypi.org/project/edge-tts/)。

```powershell
npm install
npm run audio   # 首次运行生成 public/audio 下的 56 段语音（可跳过，仓库已包含成品）
npm run dev
```

开发地址：<http://127.0.0.1:4173>

```powershell
npm run check   # TypeScript 类型检查
npm run build   # 类型检查 + 产物构建（输出到 dist/）
npm run preview # 本地预览构建产物
```

## 语音生成

语音由 Edge TTS 的 `zh-CN-XiaoxiaoNeural` 音色合成，脚本位于
`scripts/generate-audio.mjs`，生成结果保存在 `public/audio/`。
脚本会自动跳过已存在的音频；如需强制重新生成：

```powershell
$env:FORCE_AUDIO = "1"
npm run audio
```

如果 `python` 命令不是 3.14 版本，可通过 `PYTHON` 环境变量指定解释器：

```powershell
$env:PYTHON = "python"
npm run audio
```

## 技术栈

- [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)（strict 模式）
- [Vite 8](https://vite.dev/) 构建与开发服务器
- [lucide-react](https://lucide.dev/) 图标
- 无路由库 / 无状态库：hash 路由与进度持久化均为轻量手写实现

## 项目结构

```
├── docs/                  # 项目文档（架构 · 开发 · 课程内容，中英双语）
├── public/
│   ├── assets/            # 插图与词汇卡片图片
│   └── audio/             # Edge TTS 预生成的普通话语音
├── scripts/
│   └── generate-audio.mjs # 语音生成脚本
├── src/
│   ├── components/        # 页面与游戏组件
│   ├── data.ts            # 课程内容：词汇、声调、句子、单元配置
│   ├── progress.ts        # 星级、解锁、进度计算
│   ├── audio.ts           # 播放语音与正确/错误音效
│   ├── types.ts           # 领域类型定义
│   └── App.tsx            # 路由与全局状态
└── index.html
```

## 文档

| 文档 | 中文 | English |
|------|------|---------|
| 架构说明 | [docs/architecture.md](./docs/architecture.md) | [docs/architecture.en.md](./docs/architecture.en.md) |
| 开发指南 | [docs/development.md](./docs/development.md) | [docs/development.en.md](./docs/development.en.md) |
| 课程内容与词汇表 | [docs/curriculum.md](./docs/curriculum.md) | [docs/curriculum.en.md](./docs/curriculum.en.md) |

## 许可证

[ISC](./LICENSE)

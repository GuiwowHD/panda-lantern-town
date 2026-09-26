import { existsSync, mkdirSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const outputDir = resolve(root, "public", "audio");
const python = process.env.PYTHON ?? "py";
const pythonArgs = process.env.PYTHON ? [] : ["-3.14"];
const voice = "zh-CN-XiaoxiaoNeural";

const clips = [
  ["apple", "苹果"],
  ["banana", "香蕉"],
  ["cat", "猫"],
  ["dog", "狗"],
  ["fish", "鱼"],
  ["bird", "鸟"],
  ["water", "水"],
  ["bread", "面包"],
  ["rice", "米饭"],
  ["rabbit", "兔子"],
  ["horse", "马"],
  ["panda", "熊猫"],
  ["red", "红色"],
  ["blue", "蓝色"],
  ["yellow", "黄色"],
  ["green", "绿色"],
  ["circle", "圆形"],
  ["star", "星星"],
  ["mom", "妈妈"],
  ["dad", "爸爸"],
  ["me", "我"],
  ["love", "爱"],
  ["run", "跑"],
  ["eat", "吃"],
  ["tone-ma-1", "妈"],
  ["tone-ma-2", "麻"],
  ["tone-ma-3", "马"],
  ["tone-ma-4", "骂"],
  ["tone-market-1", "猫"],
  ["tone-market-2", "鱼"],
  ["tone-market-3", "水"],
  ["tone-market-4", "饭"],
  ["tone-friends-1", "猫"],
  ["tone-friends-2", "牛"],
  ["tone-friends-3", "马"],
  ["tone-friends-4", "兔"],
  ["tone-garden-1", "方"],
  ["tone-garden-2", "圆"],
  ["tone-garden-3", "紫"],
  ["tone-garden-4", "绿"],
  ["tone-home-1", "妈"],
  ["tone-home-2", "人"],
  ["tone-home-3", "我"],
  ["tone-home-4", "爱"],
  ["order-apple", "我要一个苹果。"],
  ["order-cat", "我要一只猫。"],
  ["order-fish", "我要一条鱼。"],
  ["order-water", "我想喝水。"],
  ["order-rabbit", "我要一只兔子。"],
  ["order-panda", "我想看熊猫。"],
  ["order-red", "我喜欢红色。"],
  ["order-green", "我喜欢绿色。"],
  ["order-star", "星星是黄色的。"],
  ["order-mom", "我爱妈妈。"],
  ["order-dad", "我爱爸爸。"],
  ["order-run", "我会跑。"],
];

mkdirSync(outputDir, { recursive: true });

for (const [name, text] of clips) {
  const output = resolve(outputDir, `${name}.mp3`);
  if (existsSync(output) && process.env.FORCE_AUDIO !== "1") {
    console.log(`skip ${name}.mp3`);
    continue;
  }

  console.log(`generate ${name}.mp3`);
  const result = spawnSync(
    python,
    [
      ...pythonArgs,
      "-m",
      "edge_tts",
      "--voice",
      voice,
      "--text",
      text,
      "--write-media",
      output,
    ],
    {
      cwd: root,
      stdio: "inherit",
    },
  );

  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

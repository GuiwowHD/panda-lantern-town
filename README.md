# Panda Lantern Town

面向英语母语儿童的中文听力小游戏。当前版本包含四个课程单元和三个短关卡：

- `Lantern Market`：听中文后选择正确图片
- `Tone Slide`：辨认普通话四声的音高走向
- `Sentence Bridge`：按顺序拼出简单句子

四个单元依次是 `早餐集市`、`竹林朋友`、`彩虹花园` 和 `温暖一家`，共
24 个核心词汇与 12 组短句练习。完成前一个单元中的任意两个挑战即可解锁下一站。

进度和设置只保存在浏览器 `localStorage`。`Grown-ups` 页面可以查看每项活动的最佳
星级、切换拼音提示或重置进度。

## 运行

```powershell
npm install
npm run audio
npm run dev
```

开发地址为 `http://127.0.0.1:4173`。

## 语音

语音由 `Edge TTS` 的 `zh-CN-XiaoxiaoNeural` 音色生成，脚本为
`scripts/generate-audio.mjs`。生成结果保存在 `public/audio`，网页运行时不依赖
Edge TTS 服务。

强制重新生成：

```powershell
$env:FORCE_AUDIO = "1"
npm run audio
```


## 检查

```powershell
npm run check
npm run build
```

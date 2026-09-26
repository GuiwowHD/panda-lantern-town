$ErrorActionPreference = "Stop"

$root = Split-Path -Parent $PSScriptRoot
$basePath = Join-Path $root "comfy\qwen_quick_api.json"
$outputDir = Join-Path $root "comfy\generated"
New-Item -ItemType Directory -Force -Path $outputDir | Out-Null

$base = Get-Content -Raw -LiteralPath $basePath | ConvertFrom-Json
$items = @(
  @{ name = "water"; seed = 33001; prompt = "Single clear glass cup filled with water, children picture dictionary illustration, centered, simple clear silhouette, hand-painted 2D storybook cartoon, flat pale sky blue background, no text, no letters, no watermark, no border, no shadow, one object only." },
  @{ name = "bread"; seed = 33002; prompt = "Single round loaf of golden bread, children picture dictionary illustration, centered, simple clear silhouette, hand-painted 2D storybook cartoon, flat pale blue background, no text, no letters, no watermark, no border, no shadow, one object only." },
  @{ name = "rice"; seed = 33003; prompt = "Single white ceramic bowl filled with cooked white rice, children picture dictionary illustration, centered, simple clear silhouette, hand-painted 2D storybook cartoon, flat pale green background, no text, no letters, no watermark, no border, no shadow, one object only." },
  @{ name = "rabbit"; seed = 33004; prompt = "Single friendly white rabbit sitting upright with pink ears, children picture dictionary illustration, centered, clear silhouette, hand-painted 2D storybook cartoon, flat pale mint background, no text, no letters, no watermark, no border, no shadow, one animal only." },
  @{ name = "horse"; seed = 33005; prompt = "Single friendly chestnut brown horse standing side view facing right, children picture dictionary illustration, centered, clear silhouette, hand-painted 2D storybook cartoon, flat pale sky blue background, no text, no letters, no watermark, no border, no shadow, one animal only." },
  @{ name = "panda"; seed = 33006; prompt = "Single cute panda cub sitting and waving, no clothing, children picture dictionary illustration, centered, clear silhouette, hand-painted 2D storybook cartoon, flat pale yellow background, no text, no letters, no watermark, no border, no shadow, one animal only." },
  @{ name = "red"; seed = 33007; prompt = "Single large bright red tulip flower, children picture dictionary illustration, centered, simple clear silhouette, hand-painted 2D storybook cartoon, flat pale cream background, no text, no letters, no watermark, no border, no shadow, one object only." },
  @{ name = "blue"; seed = 33008; prompt = "Single bright blue balloon on a thin string, children picture dictionary illustration, centered, simple clear silhouette, hand-painted 2D storybook cartoon, flat pale peach background, no text, no letters, no watermark, no border, no shadow, one object only." },
  @{ name = "yellow"; seed = 33009; prompt = "Single cheerful yellow sunflower, children picture dictionary illustration, centered, simple clear silhouette, hand-painted 2D storybook cartoon, flat pale lavender background, no text, no letters, no watermark, no border, no shadow, one object only." },
  @{ name = "green"; seed = 33010; prompt = "Single bright green maple leaf, children picture dictionary illustration, centered, simple clear silhouette, hand-painted 2D storybook cartoon, flat pale blue background, no text, no letters, no watermark, no border, no shadow, one object only." },
  @{ name = "circle"; seed = 33011; prompt = "Single large turquoise circle shape with a soft painted texture, children picture dictionary illustration, centered, simple clear silhouette, flat pale cream background, no text, no letters, no watermark, no border, no shadow, one shape only." },
  @{ name = "star"; seed = 33012; prompt = "Single large golden five-pointed star with a soft painted texture, children picture dictionary illustration, centered, simple clear silhouette, flat deep blue background, no text, no letters, no watermark, no border, no shadow, one shape only." },
  @{ name = "mom"; seed = 33013; prompt = "Single friendly adult woman with dark hair and warm smile, simple modern casual clothes, full upper body, children picture dictionary illustration, centered, clear silhouette, hand-painted 2D storybook cartoon, flat pale yellow background, no text, no letters, no watermark, no border, no shadow, one person only." },
  @{ name = "dad"; seed = 33014; prompt = "Single friendly adult man with short dark hair and warm smile, simple modern casual clothes, full upper body, children picture dictionary illustration, centered, clear silhouette, hand-painted 2D storybook cartoon, flat pale green background, no text, no letters, no watermark, no border, no shadow, one person only." },
  @{ name = "me"; seed = 33015; prompt = "Single cheerful young child pointing with both hands toward themselves, simple modern casual clothes, full body, children picture dictionary illustration, centered, clear silhouette, hand-painted 2D storybook cartoon, flat pale pink background, no text, no letters, no watermark, no border, no shadow, one person only." },
  @{ name = "love"; seed = 33016; prompt = "Single large warm red heart symbol with a soft painted texture, children picture dictionary illustration, centered, simple clear silhouette, flat pale cream background, no text, no letters, no watermark, no border, no shadow, one symbol only." },
  @{ name = "run"; seed = 33017; prompt = "Single cartoon child running in profile, legs clearly separated, simple modern casual clothes, full body, children picture dictionary illustration, centered, clear silhouette, hand-painted 2D storybook cartoon, flat pale sky blue background, no text, no letters, no watermark, no border, no shadow, one child only." },
  @{ name = "eat"; seed = 33018; prompt = "Single cheerful cartoon child holding a rice bowl and spoon, simple modern casual clothes, upper body, children picture dictionary illustration, centered, clear silhouette, hand-painted 2D storybook cartoon, flat pale orange background, no text, no letters, no watermark, no border, no shadow, one child and one bowl only." }
)

$utf8 = New-Object System.Text.UTF8Encoding($false)

foreach ($item in $items) {
  $workflow = $base | ConvertTo-Json -Depth 100 | ConvertFrom-Json
  $workflow."6".inputs.prompt = $item.prompt
  $workflow."7".inputs.width = 768
  $workflow."7".inputs.height = 768
  $workflow."8".inputs.seed = $item.seed
  $workflow."10".inputs.filename_prefix = "panda-lantern/full/$($item.name)"
  $json = $workflow | ConvertTo-Json -Depth 100
  $path = Join-Path $outputDir "full-$($item.name).json"
  [System.IO.File]::WriteAllText($path, $json, $utf8)
}

Write-Host "Wrote $($items.Count) full-version item workflows to $outputDir"

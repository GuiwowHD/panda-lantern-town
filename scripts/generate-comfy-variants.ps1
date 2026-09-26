$ErrorActionPreference = "Stop"

$root = Split-Path -Parent $PSScriptRoot
$basePath = Join-Path $root "comfy\qwen_quick_api.json"
$outputDir = Join-Path $root "comfy\generated"
New-Item -ItemType Directory -Force -Path $outputDir | Out-Null

$base = Get-Content -Raw -LiteralPath $basePath | ConvertFrom-Json
$assets = @(
  @{
    name = "lantern-town"
    prompt = "Wide panoramic 2D storybook game background illustration of Lantern Town at blue hour, colorful paper lanterns, winding market street, tiled roofs, bamboo, small bridge, warm shop windows, whimsical child-friendly hand-painted cartoon, clear depth for a side-scrolling game background, empty center-right area for interface text, no characters, no people, no text, no letters, no watermark, no border."
    width = 1536
    height = 1024
    seed = 11001
  },
  @{
    name = "panda-guide"
    prompt = "Full-body original panda mascot game character, standing and waving, friendly smile, small teal scarf, mustard satchel, bright vermilion vest accents, clean cel-shaded 2D storybook cartoon, centered, feet fully visible, plain flat solid bright electric blue background, strong clean edge against the background, no text, no letters, no watermark, no border, one single character, no ground shadow."
    width = 1024
    height = 1024
    seed = 11002
  },
  @{
    name = "apple"
    prompt = "Single red apple, children picture dictionary illustration, centered, simple clear silhouette, hand-painted 2D storybook cartoon, flat pale butter yellow background, no text, no letters, no watermark, no border, no shadow, one object only."
    width = 768
    height = 768
    seed = 11003
  },
  @{
    name = "banana"
    prompt = "Single ripe yellow banana, children picture dictionary illustration, centered, simple clear silhouette, hand-painted 2D storybook cartoon, flat pale blue background, no text, no letters, no watermark, no border, no shadow, one object only."
    width = 768
    height = 768
    seed = 11004
  },
  @{
    name = "cat"
    prompt = "Single friendly orange tabby cat sitting upright and looking forward, children picture dictionary illustration, centered, clear silhouette, hand-painted 2D storybook cartoon, flat pale mint background, no text, no letters, no watermark, no border, no shadow, one animal only."
    width = 768
    height = 768
    seed = 11005
  },
  @{
    name = "dog"
    prompt = "Single friendly golden-brown dog sitting upright and looking forward, children picture dictionary illustration, centered, clear silhouette, hand-painted 2D storybook cartoon, flat pale pink background, no text, no letters, no watermark, no border, no shadow, one animal only."
    width = 768
    height = 768
    seed = 11006
  },
  @{
    name = "fish"
    prompt = "Single blue freshwater fish side view facing right, children picture dictionary illustration, centered, clear silhouette, hand-painted 2D storybook cartoon, flat pale peach background, no text, no letters, no watermark, no border, no shadow, one animal only."
    width = 768
    height = 768
    seed = 11007
  },
  @{
    name = "bird"
    prompt = "Single small green songbird side view facing right, children picture dictionary illustration, centered, clear silhouette, hand-painted 2D storybook cartoon, flat pale lavender background, no text, no letters, no watermark, no border, no shadow, one animal only."
    width = 768
    height = 768
    seed = 11008
  }
)

$utf8 = New-Object System.Text.UTF8Encoding($false)

foreach ($asset in $assets) {
  $workflow = $base | ConvertTo-Json -Depth 100 | ConvertFrom-Json
  $workflow."6".inputs.prompt = $asset.prompt
  $workflow."7".inputs.width = $asset.width
  $workflow."7".inputs.height = $asset.height
  $workflow."8".inputs.seed = $asset.seed
  $workflow."10".inputs.filename_prefix = "panda-lantern/$($asset.name)"
  $json = $workflow | ConvertTo-Json -Depth 100
  $path = Join-Path $outputDir "$($asset.name).json"
  [System.IO.File]::WriteAllText($path, $json, $utf8)
}

Write-Host "Wrote $($assets.Count) workflows to $outputDir"

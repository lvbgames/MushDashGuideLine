[CmdletBinding()]
param()

$ErrorActionPreference = 'Stop'

$repoRoot = Split-Path -Parent $PSScriptRoot
$sourceRoot = Join-Path $repoRoot 'references\LvbResult\press-kit'
$outputRoot = Join-Path $repoRoot 'site\public\press\downloads'
$contentPath = Join-Path $PSScriptRoot 'press-kit-content.json'
$factsPath = Join-Path $repoRoot 'site\src\data\siteFacts.json'

Add-Type -AssemblyName System.IO.Compression
Add-Type -AssemblyName System.IO.Compression.FileSystem

if (-not (Test-Path -LiteralPath $contentPath -PathType Leaf)) {
  throw "Press Kit text source is missing: $contentPath"
}
if (-not (Test-Path -LiteralPath $factsPath -PathType Leaf)) {
  throw "Canonical site facts are missing: $factsPath"
}

$pressCopy = Get-Content -Raw -Encoding utf8 -LiteralPath $contentPath | ConvertFrom-Json
$siteFacts = Get-Content -Raw -Encoding utf8 -LiteralPath $factsPath | ConvertFrom-Json
$textEncoding = [System.Text.UTF8Encoding]::new($true)
$emDash = [char]0x2014

function Join-TextLines {
  param([Parameter(Mandatory = $true)][object[]]$Lines)

  return (($Lines | ForEach-Object { [string]$_ }) -join "`r`n") + "`r`n"
}

function Get-LocaleValue {
  param(
    [Parameter(Mandatory = $true)][object]$Object,
    [Parameter(Mandatory = $true)][string]$Locale
  )

  $property = $Object.PSObject.Properties[$Locale]
  if ($null -eq $property) { throw "Press Kit locale is missing: $Locale" }
  return $property.Value
}

function Get-AbsoluteSiteUrl {
  param([Parameter(Mandatory = $true)][string]$Path)

  return $siteFacts.studio.website.TrimEnd('/') + $Path
}

function Get-GameFacts {
  param([Parameter(Mandatory = $true)][string]$GameKey)

  $property = $siteFacts.games.PSObject.Properties[$GameKey]
  if ($null -eq $property) { throw "Canonical game facts are missing: $GameKey" }
  return $property.Value
}

function Get-GameCopy {
  param([Parameter(Mandatory = $true)][string]$GameKey)

  $property = $pressCopy.gameCopy.PSObject.Properties[$GameKey]
  if ($null -eq $property) { throw "Press Kit game copy is missing: $GameKey" }
  return $property.Value
}

function New-BrandReadme {
  $gameNames = @($siteFacts.games.PSObject.Properties | ForEach-Object { $_.Value.name }) -join ', '
  return Join-TextLines @(
    'Lv.B Brand Assets'
    '================='
    ''
    'These assets are provided for editorial and media coverage of Lv.B and its games.'
    ''
    "Official Studio Name: $($siteFacts.studio.name)"
    "Website: $($siteFacts.studio.website)"
    "Press Contact: $($siteFacts.studio.pressEmail)"
    "Official Game Names: $gameNames"
    ''
    'Included Assets:'
    "- Logo/lvb-logo-horizontal-transparent.png $emDash transparent horizontal logo"
    "- Logo/lvb-logo-stacked-transparent.png $emDash transparent stacked logo"
    "- Symbol/lvb-symbol-transparent.png $emDash transparent Lv.B symbol"
    "- Preview/lvb-brand-card-yellow.png $emDash brand card preview"
    "- Preview/lvb-brand-press-preview.png $emDash press presentation preview"
    "- BRAND_GUIDE.txt $emDash concise name, color and logo-use guidance"
    ''
    'Use the assets in connection with Lv.B, MushHero or MushDash coverage. Keep logo proportions unchanged and choose a background with sufficient contrast.'
  )
}

function New-BrandGuide {
  $lines = [System.Collections.Generic.List[string]]::new()
  foreach ($line in @(
    'Lv.B Brand Guide'
    '================'
    ''
    'Official Name'
    '-------------'
    $siteFacts.studio.name
    ''
    'Primary Colors'
    '--------------'
  )) { $lines.Add([string]$line) }
  foreach ($color in $pressCopy.brand.colors) {
    $lines.Add("- $($color.name): $($color.hex)")
  }
  foreach ($line in @(
    ''
    'Logo Usage'
    '----------'
    '- Keep the original proportions.'
    '- Do not stretch, compress or distort the logo or symbol.'
    '- Use the transparent logo files on an approved light or dark background with sufficient contrast.'
    '- Do not recolor, redraw or separate elements of the supplied artwork.'
    ''
    'Game Names'
    '----------'
    '- MushHero'
    '- MushDash'
    ''
    'Website'
    '-------'
    $siteFacts.studio.website
    ''
    'Contact'
    '-------'
    $siteFacts.studio.pressEmail
  )) { $lines.Add([string]$line) }
  return Join-TextLines $lines
}

function New-GameReadme {
  param([Parameter(Mandatory = $true)][string]$GameKey)

  $game = Get-GameFacts $GameKey
  $gamePage = Get-AbsoluteSiteUrl $game.gamePath
  $included = if ($GameKey -eq 'mushhero') {
    @(
      "- Key-Art/ $emDash official key art"
      "- Logo/ $emDash official transparent game logo"
      "- Press-Image/ $emDash official wide press image"
      "- Screenshots/ $emDash official gameplay screenshots"
    )
  } else {
    @(
      "- Key-Art/ $emDash official key art"
      "- Logo/ $emDash official transparent game logo"
      "- Press-Image/ $emDash official wide press image"
      "- Promotional-Images/ $emDash official promotional images"
    )
  }

  return Join-TextLines @(
    "$($game.name) Press Kit"
    ('=' * ($game.name.Length + 10))
    ''
    "These assets are provided for editorial and media coverage of $($game.name)."
    ''
    "Official Game Name: $($game.name)"
    "Developer: $($game.developer)"
    "Official Website: $($siteFacts.studio.website)"
    "Game Page: $gamePage"
    "Press Contact: $($siteFacts.studio.pressEmail)"
    ''
    'Included Files:'
    $included
    "- FACT_SHEET_EN.txt $emDash English fact sheet"
    "- FACT_SHEET_KO.txt $emDash Korean fact sheet"
    "- FACT_SHEET_JA.txt $emDash Japanese fact sheet"
    "- FACT_SHEET_ZH-CN.txt $emDash Simplified Chinese fact sheet"
    ''
    "Use the supplied logo and images only in connection with $($game.name) or Lv.B coverage. Keep artwork proportions unchanged and do not present edited material as official artwork."
  )
}

function New-FactSheet {
  param(
    [Parameter(Mandatory = $true)][string]$GameKey,
    [Parameter(Mandatory = $true)][string]$Locale
  )

  $game = Get-GameFacts $GameKey
  $copy = Get-GameCopy $GameKey
  $localizedFacts = Get-LocaleValue $game.localizedFacts $Locale
  $localizedCopy = Get-LocaleValue $copy.locales $Locale
  $labels = Get-LocaleValue $pressCopy.labels $Locale
  $gamePage = Get-AbsoluteSiteUrl $game.gamePath
  $pressKit = Get-AbsoluteSiteUrl $game.pressKitPath
  $lines = [System.Collections.Generic.List[string]]::new()
  $lines.Add($game.name)
  $lines.Add('=' * $game.name.Length)
  $lines.Add('')
  $lines.Add("$($labels.developer): $($game.developer)")
  $lines.Add("$($labels.publisher): $($game.publisher)")
  $lines.Add("$($labels.officialWebsite): $($siteFacts.studio.website)")
  $lines.Add("$($labels.gamePage): $gamePage")
  $lines.Add("Steam: $($game.steamStoreUrl)")
  if ($null -ne $game.epicStoreUrl -and -not [string]::IsNullOrWhiteSpace($game.epicStoreUrl)) {
    $lines.Add("Epic Games Store: $($game.epicStoreUrl)")
  }
  $lines.Add("$($labels.genre): $($localizedFacts.genre)")
  $lines.Add("$($labels.platform): $($game.platforms -join ', ')")
  $lines.Add("$($labels.release): $($localizedFacts.release)")
  if ($null -ne $localizedFacts.players -and -not [string]::IsNullOrWhiteSpace($localizedFacts.players)) {
    $lines.Add("$($labels.players): $($localizedFacts.players)")
  }
  $lines.Add('')
  $lines.Add($labels.about)
  $lines.Add('-' * $labels.about.Length)
  $lines.Add($localizedCopy.about)
  $lines.Add('')
  $lines.Add($labels.keyFeatures)
  $lines.Add('-' * $labels.keyFeatures.Length)
  foreach ($feature in $localizedCopy.features) { $lines.Add("- $feature") }
  $lines.Add('')
  $lines.Add("$($labels.pressContact): $($siteFacts.studio.pressEmail)")
  $lines.Add("$($labels.pressKit): $pressKit")
  $lines.Add('')
  $lines.Add($labels.social)
  $lines.Add('-' * $labels.social.Length)
  foreach ($socialLink in $siteFacts.studio.socialLinks | Where-Object { $_.enabled }) {
    $lines.Add("- $($socialLink.label): $($socialLink.url)")
  }
  return Join-TextLines $lines
}

function New-PressText {
  param([Parameter(Mandatory = $true)][string]$TextId)

  switch -Regex ($TextId) {
    '^brand-readme$' { return New-BrandReadme }
    '^brand-guide$' { return New-BrandGuide }
    '^game-readme:(mushhero|mushdash)$' { return New-GameReadme $Matches[1] }
    '^fact-sheet:(mushhero|mushdash):(en|ko|ja|zh-cn)$' { return New-FactSheet $Matches[1] $Matches[2] }
    default { throw "Unknown Press Kit text template: $TextId" }
  }
}

$archives = @(
  [PSCustomObject]@{
    Name = 'lvb-brand-assets.zip'
    Root = 'LvB-Brand-Assets'
    Files = [ordered]@{
      'Logo/lvb-logo-horizontal-transparent.png' = 'brand\lvb-logo-horizontal-transparent.png'
      'Logo/lvb-logo-stacked-transparent.png' = 'brand\lvb-logo-stacked-transparent.png'
      'Preview/lvb-brand-card-yellow.png' = 'brand\lvb-brand-card-yellow.png'
      'Preview/lvb-brand-press-preview.png' = 'brand\lvb-brand-press-preview.png'
      'Symbol/lvb-symbol-transparent.png' = 'brand\lvb-symbol-transparent.png'
    }
    Text = [ordered]@{
      'README.txt' = 'brand-readme'
      'BRAND_GUIDE.txt' = 'brand-guide'
    }
  },
  [PSCustomObject]@{
    Name = 'mushhero-press-kit.zip'
    Root = 'MushHero-Press-Kit'
    Files = [ordered]@{
      'Key-Art/mushhero-keyart-alt-01.jpg' = 'mushhero\mushhero-keyart-alt-01.jpg'
      'Key-Art/mushhero-keyart-primary.jpg' = 'mushhero\mushhero-keyart-primary.jpg'
      'Logo/mushhero-logo-transparent.png' = 'mushhero\mushhero-logo-transparent.png'
      'Press-Image/mushhero-press-wide-1920.jpg' = 'mushhero\mushhero-press-wide-1920.jpg'
      'Screenshots/mushhero-screenshot-01.jpg' = 'mushhero\mushhero-screenshot-01.jpg'
      'Screenshots/mushhero-screenshot-02.jpg' = 'mushhero\mushhero-screenshot-02.jpg'
      'Screenshots/mushhero-screenshot-03.jpg' = 'mushhero\mushhero-screenshot-03.jpg'
    }
    Text = [ordered]@{
      'README.txt' = 'game-readme:mushhero'
      'FACT_SHEET_EN.txt' = 'fact-sheet:mushhero:en'
      'FACT_SHEET_KO.txt' = 'fact-sheet:mushhero:ko'
      'FACT_SHEET_JA.txt' = 'fact-sheet:mushhero:ja'
      'FACT_SHEET_ZH-CN.txt' = 'fact-sheet:mushhero:zh-cn'
    }
  },
  [PSCustomObject]@{
    Name = 'mushdash-press-kit.zip'
    Root = 'MushDash-Press-Kit'
    Files = [ordered]@{
      'Key-Art/mushdash-keyart-primary.jpg' = 'mushdash\mushdash-keyart-primary.jpg'
      'Logo/mushdash-logo-transparent.png' = 'mushdash\mushdash-logo-transparent.png'
      'Press-Image/mushdash-press-wide-1920.jpg' = 'mushdash\mushdash-press-wide-1920.jpg'
      'Promotional-Images/mushdash-promo-01.jpg' = 'mushdash\mushdash-promo-01.jpg'
      'Promotional-Images/mushdash-promo-02.jpg' = 'mushdash\mushdash-promo-02.jpg'
      'Promotional-Images/mushdash-promo-03.jpg' = 'mushdash\mushdash-promo-03.jpg'
    }
    Text = [ordered]@{
      'README.txt' = 'game-readme:mushdash'
      'FACT_SHEET_EN.txt' = 'fact-sheet:mushdash:en'
      'FACT_SHEET_KO.txt' = 'fact-sheet:mushdash:ko'
      'FACT_SHEET_JA.txt' = 'fact-sheet:mushdash:ja'
      'FACT_SHEET_ZH-CN.txt' = 'fact-sheet:mushdash:zh-cn'
    }
  }
)

if (-not (Test-Path -LiteralPath $sourceRoot)) {
  throw "Press Kit source directory is missing: $sourceRoot"
}

New-Item -ItemType Directory -Force -Path $outputRoot | Out-Null
$fixedTimestamp = [DateTimeOffset]::Parse('2026-08-25T00:00:00+00:00')

foreach ($archiveSpec in $archives) {
  $outputPath = Join-Path $outputRoot $archiveSpec.Name
  if (Test-Path -LiteralPath $outputPath) {
    Remove-Item -LiteralPath $outputPath -Force
  }

  $stream = [System.IO.File]::Open($outputPath, [System.IO.FileMode]::CreateNew)
  try {
    $archive = [System.IO.Compression.ZipArchive]::new(
      $stream,
      [System.IO.Compression.ZipArchiveMode]::Create,
      $false,
      [System.Text.Encoding]::UTF8
    )
    try {
      foreach ($entryName in $archiveSpec.Files.Keys) {
        $sourcePath = Join-Path $sourceRoot $archiveSpec.Files[$entryName]
        if (-not (Test-Path -LiteralPath $sourcePath -PathType Leaf)) {
          throw "Press Kit source file is missing: $sourcePath"
        }

        $entryPath = "$($archiveSpec.Root)/$entryName"
        $entry = $archive.CreateEntry($entryPath, [System.IO.Compression.CompressionLevel]::Optimal)
        $entry.LastWriteTime = $fixedTimestamp
        $input = [System.IO.File]::OpenRead($sourcePath)
        $output = $entry.Open()
        try {
          $input.CopyTo($output)
        } finally {
          $output.Dispose()
          $input.Dispose()
        }
      }
      foreach ($entryName in $archiveSpec.Text.Keys) {
        $entryPath = "$($archiveSpec.Root)/$entryName"
        $entry = $archive.CreateEntry($entryPath, [System.IO.Compression.CompressionLevel]::Optimal)
        $entry.LastWriteTime = $fixedTimestamp
        $preamble = $textEncoding.GetPreamble()
        $textBytes = $textEncoding.GetBytes((New-PressText $archiveSpec.Text[$entryName]))
        $output = $entry.Open()
        try {
          $output.Write($preamble, 0, $preamble.Length)
          $output.Write($textBytes, 0, $textBytes.Length)
        } finally {
          $output.Dispose()
        }
      }
    } finally {
      $archive.Dispose()
    }
  } finally {
    $stream.Dispose()
  }

  $item = Get-Item -LiteralPath $outputPath
  $hash = (Get-FileHash -Algorithm SHA256 -LiteralPath $outputPath).Hash
  Write-Host "$($archiveSpec.Name): $($item.Length) bytes / $hash"
}

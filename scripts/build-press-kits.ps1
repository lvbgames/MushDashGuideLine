[CmdletBinding()]
param()

$ErrorActionPreference = 'Stop'

$repoRoot = Split-Path -Parent $PSScriptRoot
$sourceRoot = Join-Path $repoRoot 'references\LvbResult\press-kit'
$outputRoot = Join-Path $repoRoot 'site\public\press\downloads'

Add-Type -AssemblyName System.IO.Compression
Add-Type -AssemblyName System.IO.Compression.FileSystem

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

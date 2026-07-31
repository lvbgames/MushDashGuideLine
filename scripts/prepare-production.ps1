[CmdletBinding()]
param()

$ErrorActionPreference = 'Stop'
Set-StrictMode -Version Latest

$expectedRoot = 'E:\Codex\LvB\Homepage'
$expectedBranch = 'main'
$expectedOrigin = 'https://github.com/lvbgames/MushDashGuideLine'
$expectedPrivacyHash = '95CA28BD2313111606DDAE18492BEB7C785152911F14CA60618DF88D8FF36F29'
$naverVerification = 'f821633783a66dd8edb7025cb1d83caee98641aa'
$obsoleteNaverFile = 'naver799482ce0e5e513c37daff06412293c5.html'
$repoRoot = [System.IO.Path]::GetFullPath((Join-Path $PSScriptRoot '..'))
$siteRoot = Join-Path $repoRoot 'site'

function Invoke-NativeChecked {
  param(
    [Parameter(Mandatory = $true)][string]$FilePath,
    [Parameter(Mandatory = $true)][string[]]$ArgumentList,
    [Parameter(Mandatory = $true)][string]$WorkingDirectory
  )

  Push-Location $WorkingDirectory
  try {
    & $FilePath @ArgumentList
    if ($LASTEXITCODE -ne 0) {
      throw "$FilePath exited with code $LASTEXITCODE."
    }
  }
  finally {
    Pop-Location
  }
}

function Get-NativeText {
  param(
    [Parameter(Mandatory = $true)][string]$FilePath,
    [Parameter(Mandatory = $true)][string[]]$ArgumentList,
    [Parameter(Mandatory = $true)][string]$WorkingDirectory
  )

  Push-Location $WorkingDirectory
  try {
    $output = & $FilePath @ArgumentList
    if ($LASTEXITCODE -ne 0) {
      throw "$FilePath exited with code $LASTEXITCODE."
    }
    return (($output | Out-String).Trim())
  }
  finally {
    Pop-Location
  }
}

function Assert-Equal {
  param(
    [Parameter(Mandatory = $true)]$Actual,
    [Parameter(Mandatory = $true)]$Expected,
    [Parameter(Mandatory = $true)][string]$Label
  )

  if ($Actual -ne $Expected) {
    throw "$Label mismatch. Expected '$Expected', got '$Actual'."
  }
}

$gitTopLevel = [System.IO.Path]::GetFullPath((Get-NativeText 'git' @('rev-parse', '--show-toplevel') $repoRoot))
Assert-Equal $gitTopLevel $expectedRoot 'Git top-level'
Assert-Equal $repoRoot $expectedRoot 'Script repository root'

$branch = Get-NativeText 'git' @('branch', '--show-current') $repoRoot
$origin = Get-NativeText 'git' @('remote', 'get-url', 'origin') $repoRoot
Assert-Equal $branch $expectedBranch 'Git branch'
Assert-Equal $origin $expectedOrigin 'Git origin'

$preDeployHead = Get-NativeText 'git' @('rev-parse', 'HEAD') $repoRoot
Invoke-NativeChecked 'git' @('fetch', 'origin') $repoRoot

$localMain = Get-NativeText 'git' @('rev-parse', 'main') $repoRoot
$originMain = Get-NativeText 'git' @('rev-parse', 'origin/main') $repoRoot
$mergeBase = Get-NativeText 'git' @('merge-base', 'main', 'origin/main') $repoRoot
$ahead = [int](Get-NativeText 'git' @('rev-list', '--count', 'origin/main..main') $repoRoot)
$behind = [int](Get-NativeText 'git' @('rev-list', '--count', 'main..origin/main') $repoRoot)

if ($behind -ne 0 -or $mergeBase -ne $originMain) {
  throw "origin/main contains commits not present in local main or the branches diverged. Pull, merge, rebase, reset and force push are intentionally disabled."
}

$netlifyPath = Join-Path $repoRoot 'netlify.toml'
$netlify = Get-Content -Raw -Encoding utf8 $netlifyPath
if ($netlify -notmatch '(?m)^\s*base\s*=\s*"site"\s*$') { throw 'netlify.toml base must be "site".' }
if ($netlify -notmatch '(?m)^\s*command\s*=\s*"npm run build"\s*$') { throw 'netlify.toml command must be "npm run build".' }
if ($netlify -notmatch '(?m)^\s*publish\s*=\s*"dist"\s*$') { throw 'netlify.toml publish must be "dist".' }
if ($netlify -match '(?im)@netlify/plugin-nextjs|^\s*\[functions\]|^\s*\[edge_functions\]') {
  throw 'Next.js Runtime, Functions or Edge Functions configuration is not allowed.'
}

$astroConfig = Get-Content -Raw -Encoding utf8 (Join-Path $siteRoot 'astro.config.mjs')
Assert-Equal ([bool]($astroConfig -match "output:\s*'static'")) $true 'Astro static output'
if ($astroConfig -match 'adapter') { throw 'An Astro server adapter is not allowed for production.' }

if (-not (Test-Path -LiteralPath (Join-Path $siteRoot 'package-lock.json'))) {
  throw 'site/package-lock.json is required.'
}

Invoke-NativeChecked 'npm.cmd' @('ci') $siteRoot
Invoke-NativeChecked 'npm.cmd' @('run', 'check') $siteRoot
Invoke-NativeChecked 'npm.cmd' @('run', 'build') $siteRoot

$privacyFiles = @(
  (Join-Path $repoRoot 'legacy-site\public\privacy.html'),
  (Join-Path $siteRoot 'public\privacy.html'),
  (Join-Path $siteRoot 'dist\privacy.html')
)
foreach ($privacyFile in $privacyFiles) {
  $hash = (Get-FileHash -Algorithm SHA256 -LiteralPath $privacyFile).Hash
  Assert-Equal $hash $expectedPrivacyHash "Privacy SHA-256: $privacyFile"
}

$publicNaverPath = Join-Path $siteRoot "public\$obsoleteNaverFile"
$distNaverPath = Join-Path $siteRoot "dist\$obsoleteNaverFile"
if (Test-Path -LiteralPath $publicNaverPath) { throw "Obsolete Naver verification file exists: $publicNaverPath" }
if (Test-Path -LiteralPath $distNaverPath) { throw "Obsolete Naver verification file exists: $distNaverPath" }

$indexPath = Join-Path $siteRoot 'dist\index.html'
$indexHtml = Get-Content -Raw -Encoding utf8 $indexPath
$metaPattern = '<meta\s+name="naver-site-verification"\s+content="' + [regex]::Escape($naverVerification) + '"\s*/?>'
$metaMatches = [regex]::Matches($indexHtml, $metaPattern, [System.Text.RegularExpressions.RegexOptions]::IgnoreCase)
Assert-Equal $metaMatches.Count 1 'Naver verification meta count'
$head = [regex]::Match($indexHtml, '<head>[\s\S]*?</head>', [System.Text.RegularExpressions.RegexOptions]::IgnoreCase).Value
if (-not $head -or -not [regex]::IsMatch($head, $metaPattern, [System.Text.RegularExpressions.RegexOptions]::IgnoreCase)) {
  throw 'Naver verification meta is not inside the homepage head.'
}

$requiredFiles = @(
  'dist\index.html',
  'dist\404.html',
  'dist\privacy.html',
  'dist\ko\index.html',
  'dist\ja\index.html',
  'dist\zh-cn\index.html',
  'dist\games\index.html',
  'dist\about\index.html',
  'dist\news\index.html',
  'dist\contact\index.html',
  'dist\games\mushhero\index.html',
  'dist\games\mushdash\index.html',
  'dist\team\profiles\park-jaemin.png',
  'dist\team\profiles\jeong-bogeon.png',
  'dist\robots.txt',
  'dist\sitemap-index.xml',
  'dist\sitemap-0.xml'
)
foreach ($relativePath in $requiredFiles) {
  $path = Join-Path $siteRoot $relativePath
  if (-not (Test-Path -LiteralPath $path)) { throw "Required production file is missing: $relativePath" }
}

$htmlFiles = @(Get-ChildItem -LiteralPath (Join-Path $siteRoot 'dist') -Recurse -File -Filter '*.html')
$regularHtml = @($htmlFiles | Where-Object { $_.Name -notin @('404.html', 'privacy.html') })
Assert-Equal $htmlFiles.Count 30 'Total production HTML count'
Assert-Equal $regularHtml.Count 28 'Regular production HTML count'

$sitemap = Get-Content -Raw -Encoding utf8 (Join-Path $siteRoot 'dist\sitemap-0.xml')
$sitemapCount = ([regex]::Matches($sitemap, '<url>')).Count
Assert-Equal $sitemapCount 28 'Sitemap URL count'

$profilePairs = @(
  [PSCustomObject]@{
    SourceHash = '07474A7A298AB062DAECF3C288C3F477AE269FF29B71CD7502BA9E4CDD7FDD4F'
    Public = 'site\public\team\profiles\park-jaemin.png'
    Dist = 'site\dist\team\profiles\park-jaemin.png'
  },
  [PSCustomObject]@{
    SourceHash = '88CB418F0857597E54CFFF84BB9B560779B18CB293A2D71A482E574A826FF0BF'
    Public = 'site\public\team\profiles\jeong-bogeon.png'
    Dist = 'site\dist\team\profiles\jeong-bogeon.png'
  }
)
$sourceProfileFiles = @(Get-ChildItem -LiteralPath (Join-Path $repoRoot 'references\Profile') -File)
foreach ($pair in $profilePairs) {
  $sourceMatches = @($sourceProfileFiles | Where-Object {
      (Get-FileHash -Algorithm SHA256 -LiteralPath $_.FullName).Hash -eq $pair.SourceHash
    })
  Assert-Equal $sourceMatches.Count 1 "Profile source count for $($pair.Public)"
  $publicHash = (Get-FileHash -Algorithm SHA256 -LiteralPath (Join-Path $repoRoot $pair.Public)).Hash
  $distHash = (Get-FileHash -Algorithm SHA256 -LiteralPath (Join-Path $repoRoot $pair.Dist)).Hash
  Assert-Equal $publicHash $pair.SourceHash "Public profile hash: $($pair.Public)"
  Assert-Equal $distHash $pair.SourceHash "Built profile hash: $($pair.Dist)"
}

$teamSource = Get-Content -Raw -Encoding utf8 (Join-Path $siteRoot 'src\data\team.ts')
if ($teamSource -match 'programming\.png') { throw 'The unused programming profile image is connected to team data.' }
if ($teamSource -notmatch "responsibilities:\s*\['programming',\s*'project-management',\s*'marketing'\]") {
  throw 'The studio director responsibilities must contain exactly programming, project management and marketing.'
}

$unusedProfileHash = '793504887DDCB524FA3D96379AE501BBA1DBDFFF92DC9F4ACB215C3DE5CD21DA'
$unusedSourceMatches = @($sourceProfileFiles | Where-Object {
    (Get-FileHash -Algorithm SHA256 -LiteralPath $_.FullName).Hash -eq $unusedProfileHash
  })
Assert-Equal $unusedSourceMatches.Count 1 'Unused programming source profile count'
$publishedProfileFiles = @(
  Get-ChildItem -LiteralPath (Join-Path $siteRoot 'public\team\profiles') -File |
    Where-Object { $_.Extension -ne '.md' }
)
foreach ($publishedProfile in $publishedProfileFiles) {
  $publishedHash = (Get-FileHash -Algorithm SHA256 -LiteralPath $publishedProfile.FullName).Hash
  if ($publishedHash -eq $unusedProfileHash) {
    throw "The unused programming profile was published: $($publishedProfile.FullName)"
  }
}

$status = Get-NativeText 'git' @('status', '--short', '--untracked-files=all') $repoRoot
Write-Host ''
Write-Host 'Production preparation passed.' -ForegroundColor Green
Write-Host "preDeployHead: $preDeployHead"
Write-Host "main: $localMain"
Write-Host "origin/main: $originMain"
Write-Host "ahead/behind: $ahead/$behind"
Write-Host 'Planned repository changes:'
if ($status) { Write-Host $status } else { Write-Host '(none)' }
Write-Host ''
Write-Host 'No commit or push was performed by prepare-production.ps1.'

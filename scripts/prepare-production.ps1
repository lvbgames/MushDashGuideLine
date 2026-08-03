[CmdletBinding()]
param()

$ErrorActionPreference = 'Stop'
Set-StrictMode -Version Latest

$expectedRoot = 'E:\Codex\LvB\Homepage'
$expectedBranch = 'main'
$expectedOrigin = 'https://github.com/lvbgames/MushDashGuideLine'
$expectedLegacyPrivacyHash = '95CA28BD2313111606DDAE18492BEB7C785152911F14CA60618DF88D8FF36F29'
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

function ConvertFrom-Utf8Base64 {
  param([Parameter(Mandatory = $true)][string]$Value)

  return [System.Text.Encoding]::UTF8.GetString([System.Convert]::FromBase64String($Value))
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
$privacyHtmlRedirectIndex = $netlify.IndexOf('from = "/privacy.html"')
$genericIndexRedirectIndex = $netlify.IndexOf('from = "/:one/index.html"')
if ($privacyHtmlRedirectIndex -lt 0) { throw 'The /privacy.html compatibility redirect is missing.' }
if ($genericIndexRedirectIndex -lt 0 -or $privacyHtmlRedirectIndex -gt $genericIndexRedirectIndex) {
  throw 'The /privacy.html compatibility redirect must precede generic index.html redirects.'
}
if ($netlify -notmatch '(?ms)from\s*=\s*"/privacy\.html".*?to\s*=\s*"/privacy/".*?status\s*=\s*301.*?force\s*=\s*true') {
  throw 'The /privacy.html compatibility redirect must force a 301 to /privacy/.'
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

$legacyPrivacyPath = Join-Path $repoRoot 'legacy-site\public\privacy.html'
$legacyPrivacyHash = (Get-FileHash -Algorithm SHA256 -LiteralPath $legacyPrivacyPath).Hash
Assert-Equal $legacyPrivacyHash $expectedLegacyPrivacyHash 'Legacy Privacy SHA-256'

if (Test-Path -LiteralPath (Join-Path $siteRoot 'public\privacy.html')) {
  throw 'The obsolete site/public/privacy.html must not exist after the Astro Privacy migration.'
}

$privacySectionIds = @(
  'scope',
  'controller',
  'purposes',
  'data-categories',
  'email-inquiries',
  'games-platforms',
  'retention',
  'deletion',
  'third-party-disclosure',
  'processors',
  'external-services',
  'international-processing',
  'automatic-data',
  'children',
  'rights',
  'security',
  'contact',
  'remedies',
  'changes'
)

$privacyRoutes = @(
  [PSCustomObject]@{ Locale = 'en'; Path = 'dist\privacy\index.html'; Canonical = 'https://lvb.kr/privacy/'; FooterPath = '/privacy/' },
  [PSCustomObject]@{ Locale = 'ko'; Path = 'dist\ko\privacy\index.html'; Canonical = 'https://lvb.kr/ko/privacy/'; FooterPath = '/ko/privacy/' },
  [PSCustomObject]@{ Locale = 'ja'; Path = 'dist\ja\privacy\index.html'; Canonical = 'https://lvb.kr/ja/privacy/'; FooterPath = '/ja/privacy/' },
  [PSCustomObject]@{ Locale = 'zh-cn'; Path = 'dist\zh-cn\privacy\index.html'; Canonical = 'https://lvb.kr/zh-cn/privacy/'; FooterPath = '/zh-cn/privacy/' }
)

$expectedLanguagePaths = @('/privacy/', '/ko/privacy/', '/ja/privacy/', '/zh-cn/privacy/')
$disallowedPrivacyCopy = @(
  'EIK',
  'lvbgames.store',
  'raw.githubusercontent.com',
  'Main Project: MushDash',
  'Epic Games Store content guidelines',
  'brand requirements',
  '2026-07-31',
  'pending',
  (ConvertFrom-Utf8Base64 '66+47KCV'),
  'TODO',
  'FIXME',
  'placeholder',
  'PlayerProfile.json',
  'PlayerMoney.json',
  'PlayerInventory.json',
  'PlayerEvent.json',
  'PlayerChallenge.json',
  'TransactionIds.json',
  'MushDashCloudValidation.json',
  'FS_PlayerProfile',
  'FS_PlayerMoney',
  'FS_PlayerInventory',
  'FS_WeeklyChallengeProgress',
  'DeleteUserFile',
  'ClearFile',
  'ClearFiles'
)
$requiredPrivacyFacts = @{
  en = @(
    'Last updated:',
    'Effective date:',
    'August 3, 2026',
    'Epic Online Services(EOS)',
    'Lobby',
    'Session',
    'P2P',
    'EOS UserCloud',
    'one year',
    'Netlify Web Analytics',
    'Real User Monitoring',
    'Log Drains',
    'does not automatically send crash reports',
    'The department responsible for privacy inquiries is Lv.B',
    'selected profile icon, nameplate and avatar settings',
    'in-game currency balances',
    'owned customization items and inventory',
    'weekly challenge ID, progress, completion, reward-claim status and week number',
    'transaction identifiers used to prevent duplicate purchase processing',
    'Graphics, audio, language and matchmaking-region settings',
    'does not trigger deletion when the game is uninstalled or an account is unlinked'
  )
  ko = @(
    (ConvertFrom-Utf8Base64 '7LWc7KKFIOyImOygleydvDo='),
    (ConvertFrom-Utf8Base64 '7Iuc7ZaJ7J28Og=='),
    (ConvertFrom-Utf8Base64 'MjAyNuuFhCA47JuUIDPsnbw='),
    'Epic Online Services(EOS)',
    'Lobby',
    'Session',
    'P2P',
    'EOS UserCloud',
    '1',
    'Netlify Web Analytics',
    'Real User Monitoring',
    'Log Drains',
    'lvb909@naver.com',
    (ConvertFrom-Utf8Base64 '7KO86rCEIOuPhOyghCDsi53rs4TsnpDCt+ynhO2WieqwksK37JmE66OMIOyXrOu2gMK367O07IOBIOyImOuguSDsl6zrtoDCt+yjvOywqA=='),
    (ConvertFrom-Utf8Base64 '7KSR67O1IOq1rOunpCDsspjrpqzrpbwg67Cp7KeA7ZWY6riwIOychO2VnCDqsbDrnpgg7Iud67OE7J6Q'),
    (ConvertFrom-Utf8Base64 '6re4656Y7ZS9wrfsmKTrlJTsmKTCt+yWuOyWtMK366ek7LmtIOyngOyXrSDshKTsoJU='),
    (ConvertFrom-Utf8Base64 '6rKM7J6EIOyCreygnCDrmJDripQg6rOE7KCVIOyXsOuPmSDtlbTsoJzrp4zsnLzroZwg7J6Q64+ZIOyCreygnOuQmOuKlCDquLDriqXrj4Qg7JeG7Iq164uI64uk')
  )
  ja = @(
    (ConvertFrom-Utf8Base64 '5pyA57WC5pu05paw5pel77ya'),
    (ConvertFrom-Utf8Base64 '5pa96KGM5pel77ya'),
    (ConvertFrom-Utf8Base64 'MjAyNuW5tDjmnIgz5pel'),
    'Epic Online Services(EOS)',
    'Lobby',
    'Session',
    'P2P',
    'EOS UserCloud',
    '1',
    'Netlify Web Analytics',
    'Real User Monitoring',
    'Log Drains',
    'lvb909@naver.com',
    (ConvertFrom-Utf8Base64 '44Km44Kj44O844Kv44Oq44O844OB44Oj44Os44Oz44K444GuSUTjg7vpgLLooYzlgKTjg7vlrozkuobnirbms4Hjg7vloLHphazlj5flj5bnirbms4Hjg7vpgLHnlarlj7c='),
    (ConvertFrom-Utf8Base64 '6LO85YWl5Yem55CG44Gu6YeN6KSH44KS6Ziy5q2i44GZ44KL44Gf44KB44Gu5Y+W5byV6K2Y5Yil5a2Q'),
    (ConvertFrom-Utf8Base64 '44Kw44Op44OV44Kj44OD44Kv44CB44Kq44O844OH44Kj44Kq44CB6KiA6Kqe44CB44Oe44OD44OB44Oh44Kk44Kt44Oz44Kw5Zyw5Z+f44Gu6Kit5a6a'),
    (ConvertFrom-Utf8Base64 '56K66KqN44GX44Gf44Ky44O844Og44Kz44O844OJ44Gr44Gv6Ieq5YuV5pyJ5Yq55pyf6ZmQ44KE5a6a5pyf5YmK6Zmk5pyf6ZaT44GM44Gq44GP44CB44Ky44O844Og44Gu44Ki44Oz44Kk44Oz44K544OI44O844Or44KE44Ki44Kr44Km44Oz44OI6YCj5pC644Gu6Kej6Zmk44KS5aWR5qmf44Gr6Ieq5YuV5YmK6Zmk44GZ44KL5Yem55CG44KC44GC44KK44G+44Gb44KT44CC')
  )
  'zh-cn' = @(
    (ConvertFrom-Utf8Base64 '5pyA5ZCO5pu05paw5pel5pyf77ya'),
    (ConvertFrom-Utf8Base64 '55Sf5pWI5pel5pyf77ya'),
    (ConvertFrom-Utf8Base64 'MjAyNuW5tDjmnIgz5pel'),
    'Epic Online Services(EOS)',
    'Lobby',
    'Session',
    'P2P',
    'EOS UserCloud',
    '1',
    'Netlify Web Analytics',
    'Real User Monitoring',
    'Log Drains',
    'lvb909@naver.com',
    (ConvertFrom-Utf8Base64 '5q+P5ZGo5oyR5oiYSUTjgIHov5vluqbjgIHlrozmiJDnirbmgIHjgIHlpZblirHpooblj5bnirbmgIHkuI7lkajmrKE='),
    (ConvertFrom-Utf8Base64 '55So5LqO6Ziy5q2i6YeN5aSN5aSE55CG6LSt5Lmw5Lqk5piT55qE5Lqk5piT5qCH6K+G56ym'),
    (ConvertFrom-Utf8Base64 '55S76Z2i44CB6Z+z6aKR44CB6K+t6KiA5ZKM5Yy56YWN5Zyw5Yy66K6+572u'),
    (ConvertFrom-Utf8Base64 '57uP5qC45p+l77yM5ri45oiP5Luj56CB5pyq6K6+572u6Ieq5Yqo5Yiw5pyf5oiW5a6a5pyf5Yig6Zmk5pyf6ZmQ77yM5Lmf5LiN5YyF5ZCr5Lul5Y246L295ri45oiP5oiW6Kej6Zmk6LSm5oi35YWz6IGU5Li66Kem5Y+R5p2h5Lu255qE6Ieq5Yqo5Yig6Zmk5rWB56iL44CC')
  )
}
$supersededPrivacyCopy = @(
  'This Policy does not state an unverified fixed period',
  'If enabled, they are governed by Netlify'
)

foreach ($route in $privacyRoutes) {
  $privacyPath = Join-Path $siteRoot $route.Path
  if (-not (Test-Path -LiteralPath $privacyPath)) {
    throw "Privacy route output is missing: $($route.Path)"
  }

  $privacyHtml = Get-Content -Raw -Encoding utf8 $privacyPath
  $sectionPositions = @()
  foreach ($sectionId in $privacySectionIds) {
    $matches = [regex]::Matches($privacyHtml, 'id="' + [regex]::Escape($sectionId) + '"')
    Assert-Equal $matches.Count 1 "Privacy section '$sectionId' count: $($route.Locale)"
    $sectionPositions += $matches[0].Index
  }
  for ($sectionIndex = 1; $sectionIndex -lt $sectionPositions.Count; $sectionIndex++) {
    if ($sectionPositions[$sectionIndex] -le $sectionPositions[$sectionIndex - 1]) {
      throw "Privacy section order mismatch: $($route.Locale)"
    }
  }

  Assert-Equal ([regex]::Matches($privacyHtml, '<h1(?:\s|>)').Count) 1 "Privacy H1 count: $($route.Locale)"
  Assert-Equal ([regex]::Matches($privacyHtml, '<main(?:\s|>)').Count) 1 "Privacy main count: $($route.Locale)"
  Assert-Equal ([regex]::Matches($privacyHtml, '<meta name="robots" content="noindex, follow">').Count) 1 "Privacy robots meta: $($route.Locale)"
  Assert-Equal ([regex]::Matches($privacyHtml, '<link rel="canonical" href="' + [regex]::Escape($route.Canonical) + '">').Count) 1 "Privacy canonical: $($route.Locale)"
  Assert-Equal ([regex]::Matches($privacyHtml, 'rel="alternate" hreflang=').Count) 5 "Privacy hreflang count: $($route.Locale)"
  Assert-Equal ([regex]::Matches($privacyHtml, 'hreflang="x-default" href="https://lvb\.kr/privacy/"').Count) 1 "Privacy x-default: $($route.Locale)"
  Assert-Equal ([regex]::Matches($privacyHtml, '<html lang="' + [regex]::Escape($route.Locale) + '">').Count) 1 "Privacy html lang: $($route.Locale)"
  Assert-Equal ([regex]::Matches($privacyHtml, 'application/ld\+json').Count) 0 "Privacy JSON-LD count: $($route.Locale)"
  Assert-Equal ([regex]::Matches($privacyHtml, 'datetime="2026-08-03"').Count) 2 "Privacy policy date count: $($route.Locale)"

  foreach ($languagePath in $expectedLanguagePaths) {
    if ($privacyHtml -notmatch 'href="' + [regex]::Escape($languagePath) + '"') {
      throw "Privacy language path '$languagePath' is missing: $($route.Locale)"
    }
  }
  if ($privacyHtml -notmatch 'href="' + [regex]::Escape($route.FooterPath) + '"[^>]*aria-current="page"') {
    throw "Privacy Footer active link is missing: $($route.Locale)"
  }
  foreach ($disallowed in $disallowedPrivacyCopy) {
    if ($privacyHtml.IndexOf($disallowed, [System.StringComparison]::OrdinalIgnoreCase) -ge 0) {
      throw "Disallowed Privacy text '$disallowed' found: $($route.Locale)"
    }
  }
  foreach ($requiredFact in $requiredPrivacyFacts[$route.Locale]) {
    if ($privacyHtml.IndexOf($requiredFact, [System.StringComparison]::OrdinalIgnoreCase) -lt 0) {
      throw "Required Privacy fact '$requiredFact' is missing: $($route.Locale)"
    }
  }
  foreach ($superseded in $supersededPrivacyCopy) {
    if ($privacyHtml.IndexOf($superseded, [System.StringComparison]::OrdinalIgnoreCase) -ge 0) {
      throw "Superseded Privacy text '$superseded' found: $($route.Locale)"
    }
  }
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
  'dist\privacy\index.html',
  'dist\ko\privacy\index.html',
  'dist\ja\privacy\index.html',
  'dist\zh-cn\privacy\index.html',
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
$regularHtml = @($htmlFiles | Where-Object { $_.Name -ne '404.html' })
Assert-Equal $htmlFiles.Count 33 'Total production HTML count'
Assert-Equal $regularHtml.Count 32 'Regular production HTML count'

$sitemap = Get-Content -Raw -Encoding utf8 (Join-Path $siteRoot 'dist\sitemap-0.xml')
$sitemapCount = ([regex]::Matches($sitemap, '<url>')).Count
Assert-Equal $sitemapCount 28 'Sitemap URL count'
if ($sitemap -match '/privacy/') { throw 'Privacy routes must be excluded from the sitemap.' }

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

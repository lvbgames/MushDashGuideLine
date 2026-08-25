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
if ($netlify -match '(?im)^\s*from\s*=\s*"/robots\.txt/?"\s*$') {
  throw 'robots.txt must be served directly from site/public without a redirect or rewrite.'
}
$privacyHtmlRedirectIndex = $netlify.IndexOf('from = "/privacy.html"')
$termsHtmlRedirectIndex = $netlify.IndexOf('from = "/terms.html"')
$genericIndexRedirectIndex = $netlify.IndexOf('from = "/:one/index.html"')
if ($privacyHtmlRedirectIndex -lt 0) { throw 'The /privacy.html compatibility redirect is missing.' }
if ($genericIndexRedirectIndex -lt 0 -or $privacyHtmlRedirectIndex -gt $genericIndexRedirectIndex) {
  throw 'The /privacy.html compatibility redirect must precede generic index.html redirects.'
}
if ($netlify -notmatch '(?ms)from\s*=\s*"/privacy\.html".*?to\s*=\s*"/privacy/".*?status\s*=\s*301.*?force\s*=\s*true') {
  throw 'The /privacy.html compatibility redirect must force a 301 to /privacy/.'
}
if ($termsHtmlRedirectIndex -lt 0) { throw 'The /terms.html compatibility redirect is missing.' }
if ($genericIndexRedirectIndex -lt 0 -or $termsHtmlRedirectIndex -gt $genericIndexRedirectIndex) {
  throw 'The /terms.html compatibility redirect must precede generic index.html redirects.'
}
if ($netlify -notmatch '(?ms)from\s*=\s*"/terms\.html".*?to\s*=\s*"/terms/".*?status\s*=\s*301.*?force\s*=\s*true') {
  throw 'The /terms.html compatibility redirect must force a 301 to /terms/.'
}

$astroConfig = Get-Content -Raw -Encoding utf8 (Join-Path $siteRoot 'astro.config.mjs')
Assert-Equal ([bool]($astroConfig -match "output:\s*'static'")) $true 'Astro static output'
if ($astroConfig -match 'adapter') { throw 'An Astro server adapter is not allowed for production.' }

if (-not (Test-Path -LiteralPath (Join-Path $siteRoot 'package-lock.json'))) {
  throw 'site/package-lock.json is required.'
}

$expectedRobots = "User-agent: *`nAllow: /`n`nUser-agent: Yeti`nAllow: /`n`nSitemap: https://lvb.kr/sitemap-index.xml`n"
$publicRobotsPath = Join-Path $siteRoot 'public\robots.txt'
if (-not (Test-Path -LiteralPath $publicRobotsPath)) {
  throw 'site/public/robots.txt is required.'
}
$publicRobotsBytes = [System.IO.File]::ReadAllBytes($publicRobotsPath)
if ($publicRobotsBytes.Length -ge 3 -and $publicRobotsBytes[0] -eq 0xEF -and $publicRobotsBytes[1] -eq 0xBB -and $publicRobotsBytes[2] -eq 0xBF) {
  throw 'site/public/robots.txt must be UTF-8 without BOM.'
}
$publicRobots = [System.Text.Encoding]::UTF8.GetString($publicRobotsBytes)
Assert-Equal $publicRobots $expectedRobots 'Public robots.txt content'
Assert-Equal ([regex]::Matches($publicRobots, '(?m)^User-agent: \*$').Count) 1 'Public robots wildcard user-agent count'
Assert-Equal ([regex]::Matches($publicRobots, '(?m)^User-agent: Yeti$').Count) 1 'Public robots Yeti user-agent count'
Assert-Equal ([regex]::Matches($publicRobots, '(?m)^Allow: /$').Count) 2 'Public robots allow count'
Assert-Equal ([regex]::Matches($publicRobots, '(?m)^Sitemap: https://lvb\.kr/sitemap-index\.xml$').Count) 1 'Public robots sitemap count'
Assert-Equal ([regex]::Matches($publicRobots, '(?im)^Disallow:\s*/').Count) 0 'Public robots root disallow count'
Assert-Equal ([regex]::Matches($publicRobots, '<[^>]+>').Count) 0 'Public robots HTML tag count'

Invoke-NativeChecked 'npm.cmd' @('ci') $siteRoot
Invoke-NativeChecked 'npm.cmd' @('run', 'check') $siteRoot
Invoke-NativeChecked 'npm.cmd' @('run', 'build') $siteRoot

$distRobotsPath = Join-Path $siteRoot 'dist\robots.txt'
if (-not (Test-Path -LiteralPath $distRobotsPath)) {
  throw 'site/dist/robots.txt is required after build.'
}
$distRobotsBytes = [System.IO.File]::ReadAllBytes($distRobotsPath)
if ($distRobotsBytes.Length -ge 3 -and $distRobotsBytes[0] -eq 0xEF -and $distRobotsBytes[1] -eq 0xBB -and $distRobotsBytes[2] -eq 0xBF) {
  throw 'site/dist/robots.txt must be UTF-8 without BOM.'
}
$distRobots = [System.Text.Encoding]::UTF8.GetString($distRobotsBytes)
Assert-Equal $distRobots $expectedRobots 'Built robots.txt content'
Assert-Equal ([System.Convert]::ToBase64String($distRobotsBytes)) ([System.Convert]::ToBase64String($publicRobotsBytes)) 'Public and built robots.txt bytes'

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
  $termsFooterPath = if ($route.Locale -eq 'en') { '/terms/' } else { "/$($route.Locale)/terms/" }
  if ($privacyHtml -notmatch 'href="' + [regex]::Escape($termsFooterPath) + '"') {
    throw "Privacy-to-Terms Footer link is missing: $($route.Locale)"
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

$termsSectionIds = @(
  'scope',
  'definitions',
  'notice-changes',
  'platform-terms',
  'license-ip',
  'accounts-online',
  'user-obligations',
  'service-changes',
  'online-termination',
  'game-data',
  'purchases-refunds',
  'external-services',
  'privacy',
  'restrictions-liability',
  'law-disputes',
  'contact-dates'
)
$termsRoutes = @(
  [PSCustomObject]@{ Locale = 'en'; Path = 'dist\terms\index.html'; Canonical = 'https://lvb.kr/terms/'; FooterPath = '/terms/'; PrivacyPath = '/privacy/' },
  [PSCustomObject]@{ Locale = 'ko'; Path = 'dist\ko\terms\index.html'; Canonical = 'https://lvb.kr/ko/terms/'; FooterPath = '/ko/terms/'; PrivacyPath = '/ko/privacy/' },
  [PSCustomObject]@{ Locale = 'ja'; Path = 'dist\ja\terms\index.html'; Canonical = 'https://lvb.kr/ja/terms/'; FooterPath = '/ja/terms/'; PrivacyPath = '/ja/privacy/' },
  [PSCustomObject]@{ Locale = 'zh-cn'; Path = 'dist\zh-cn\terms\index.html'; Canonical = 'https://lvb.kr/zh-cn/terms/'; FooterPath = '/zh-cn/terms/'; PrivacyPath = '/zh-cn/privacy/' }
)
$expectedTermsLanguagePaths = @('/terms/', '/ko/terms/', '/ja/terms/', '/zh-cn/terms/')
$disallowedTermsCopy = @(
  'Nintendo',
  '2 hours',
  ([regex]::Unescape('2\uC2DC\uAC04')),
  ([regex]::Unescape('2\u6642\u9593')),
  'DLC',
  'season pass',
  ([regex]::Unescape('\uC2DC\uC98C \uD328\uC2A4')),
  ([regex]::Unescape('\u30B7\u30FC\u30BA\u30F3\u30D1\u30B9')),
  ([regex]::Unescape('\u5B63\u7968')),
  'permanent ban',
  ([regex]::Unescape('\uC601\uAD6C \uC774\uC6A9 \uC81C\uD55C')),
  ([regex]::Unescape('\u6C38\u4E45\u5229\u7528\u505C\u6B62')),
  ([regex]::Unescape('\u6C38\u4E45\u5C01\u7981')),
  'exclusive jurisdiction',
  ([regex]::Unescape('\uC804\uC18D \uAD00\uD560')),
  ([regex]::Unescape('\u5C02\u5C5E\u7BA1\u8F44')),
  ([regex]::Unescape('\u4E13\u5C5E\u7BA1\u8F96')),
  'TODO',
  'FIXME',
  'placeholder'
)

foreach ($route in $termsRoutes) {
  $termsPath = Join-Path $siteRoot $route.Path
  if (-not (Test-Path -LiteralPath $termsPath)) {
    throw "Terms route output is missing: $($route.Path)"
  }
  $termsHtml = Get-Content -Raw -Encoding utf8 $termsPath
  $sectionPositions = @()
  foreach ($sectionId in $termsSectionIds) {
    $matches = [regex]::Matches($termsHtml, 'id="' + [regex]::Escape($sectionId) + '"')
    Assert-Equal $matches.Count 1 "Terms section '$sectionId' count: $($route.Locale)"
    $sectionPositions += $matches[0].Index
  }
  for ($sectionIndex = 1; $sectionIndex -lt $sectionPositions.Count; $sectionIndex++) {
    if ($sectionPositions[$sectionIndex] -le $sectionPositions[$sectionIndex - 1]) {
      throw "Terms section order mismatch: $($route.Locale)"
    }
  }

  Assert-Equal ([regex]::Matches($termsHtml, '<h1(?:\s|>)').Count) 1 "Terms H1 count: $($route.Locale)"
  Assert-Equal ([regex]::Matches($termsHtml, '<main(?:\s|>)').Count) 1 "Terms main count: $($route.Locale)"
  Assert-Equal ([regex]::Matches($termsHtml, '<meta name="robots" content="noindex, follow">').Count) 1 "Terms robots meta: $($route.Locale)"
  Assert-Equal ([regex]::Matches($termsHtml, '<link rel="canonical" href="' + [regex]::Escape($route.Canonical) + '">').Count) 1 "Terms canonical: $($route.Locale)"
  Assert-Equal ([regex]::Matches($termsHtml, 'rel="alternate" hreflang=').Count) 5 "Terms hreflang count: $($route.Locale)"
  Assert-Equal ([regex]::Matches($termsHtml, 'hreflang="x-default" href="https://lvb\.kr/terms/"').Count) 1 "Terms x-default: $($route.Locale)"
  Assert-Equal ([regex]::Matches($termsHtml, '<html lang="' + [regex]::Escape($route.Locale) + '">').Count) 1 "Terms html lang: $($route.Locale)"
  Assert-Equal ([regex]::Matches($termsHtml, 'application/ld\+json').Count) 0 "Terms JSON-LD count: $($route.Locale)"
  Assert-Equal ([regex]::Matches($termsHtml, 'datetime="2026-08-12"').Count) 2 "Terms approved date count: $($route.Locale)"
  Assert-Equal ([regex]::Matches($termsHtml, 'Effective date|\uC2DC\uD589\uC77C|\u65BD\u884C\u65E5|\u751F\u6548\u65E5\u671F').Count) 1 "Terms effective-date copy count: $($route.Locale)"
  Assert-Equal ([regex]::Matches($termsHtml, '2026-08-11').Count) 0 "Terms obsolete date count: $($route.Locale)"
  foreach ($languagePath in $expectedTermsLanguagePaths) {
    if ($termsHtml -notmatch 'href="' + [regex]::Escape($languagePath) + '"') {
      throw "Terms language path '$languagePath' is missing: $($route.Locale)"
    }
  }
  if ($termsHtml -notmatch 'href="' + [regex]::Escape($route.FooterPath) + '"[^>]*aria-current="page"') {
    throw "Terms Footer active link is missing: $($route.Locale)"
  }
  if ($termsHtml -notmatch 'href="' + [regex]::Escape($route.PrivacyPath) + '"') {
    throw "Terms-to-Privacy link is missing: $($route.Locale)"
  }
  foreach ($disallowed in $disallowedTermsCopy) {
    if ($termsHtml.IndexOf($disallowed, [System.StringComparison]::OrdinalIgnoreCase) -ge 0) {
      throw "Disallowed Terms text '$disallowed' found: $($route.Locale)"
    }
  }
  foreach ($requiredFact in @('Steam', 'Epic Games Store', 'Epic Online Services(EOS)', 'EOS UserCloud')) {
    if ($termsHtml.IndexOf($requiredFact, [System.StringComparison]::OrdinalIgnoreCase) -lt 0) {
      throw "Required Terms fact '$requiredFact' is missing: $($route.Locale)"
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
  'dist\terms\index.html',
  'dist\ko\terms\index.html',
  'dist\ja\terms\index.html',
  'dist\zh-cn\terms\index.html',
  'dist\ko\index.html',
  'dist\ja\index.html',
  'dist\zh-cn\index.html',
  'dist\games\index.html',
  'dist\about\index.html',
  'dist\news\index.html',
  'dist\news\page\2\index.html',
  'dist\ko\news\page\2\index.html',
  'dist\ja\news\page\2\index.html',
  'dist\zh-cn\news\page\2\index.html',
  'dist\press\index.html',
  'dist\ko\press\index.html',
  'dist\ja\press\index.html',
  'dist\zh-cn\press\index.html',
  'dist\news\bic-2026-mushhero-first-public-playtest\index.html',
  'dist\ko\news\bic-2026-mushhero-first-public-playtest\index.html',
  'dist\ja\news\bic-2026-mushhero-first-public-playtest\index.html',
  'dist\zh-cn\news\bic-2026-mushhero-first-public-playtest\index.html',
  'dist\contact\index.html',
  'dist\games\mushhero\index.html',
  'dist\games\mushdash\index.html',
  'dist\team\profiles\park-jaemin.png',
  'dist\team\profiles\jeong-bogeon.png',
  'dist\team\profiles\park-jaemin-640.webp',
  'dist\team\profiles\park-jaemin-1024.webp',
  'dist\team\profiles\jeong-bogeon-640.webp',
  'dist\team\profiles\jeong-bogeon-1024.webp',
  'dist\press\assets\mushhero\mushhero-01.jpg',
  'dist\press\assets\mushhero\mushhero-02.jpg',
  'dist\press\assets\mushhero\mushhero-03.jpg',
  'dist\press\assets\mushdash\mushdash-01.jpg',
  'dist\press\assets\mushdash\mushdash-02.jpg',
  'dist\press\assets\mushdash\mushdash-03.jpg',
  'dist\press\downloads\lvb-brand-assets.zip',
  'dist\press\downloads\mushhero-press-kit.zip',
  'dist\press\downloads\mushdash-press-kit.zip',
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
Assert-Equal $htmlFiles.Count 49 'Total production HTML count'
Assert-Equal $regularHtml.Count 48 'Regular production HTML count'

$sitemap = Get-Content -Raw -Encoding utf8 (Join-Path $siteRoot 'dist\sitemap-0.xml')
$sitemapCount = ([regex]::Matches($sitemap, '<url>')).Count
Assert-Equal $sitemapCount 40 'Sitemap URL count'
if ($sitemap -match '/privacy/') { throw 'Privacy routes must be excluded from the sitemap.' }
if ($sitemap -match '/terms/') { throw 'Terms routes must be excluded from the sitemap.' }
foreach ($requiredSitemapPath in @('/press/', '/ko/press/', '/ja/press/', '/zh-cn/press/', '/news/page/2/', '/ko/news/page/2/', '/ja/news/page/2/', '/zh-cn/news/page/2/', '/news/bic-2026-mushhero-first-public-playtest/', '/ko/news/bic-2026-mushhero-first-public-playtest/', '/ja/news/bic-2026-mushhero-first-public-playtest/', '/zh-cn/news/bic-2026-mushhero-first-public-playtest/')) {
  if ($sitemap -notmatch [regex]::Escape($requiredSitemapPath)) {
    throw "Indexed route is missing from the sitemap: $requiredSitemapPath"
  }
}

$jsonLdPattern = '<script[^>]+type="application/ld\+json"[^>]*>([\s\S]*?)</script>'
$rootJsonMatches = [regex]::Matches($indexHtml, $jsonLdPattern)
Assert-Equal $rootJsonMatches.Count 1 'Root JSON-LD script count'
$rootStructuredData = $rootJsonMatches[0].Groups[1].Value | ConvertFrom-Json
Assert-Equal $rootStructuredData.'@graph'.Count 2 'Root JSON-LD graph node count'

$articleRoutes = @(
  [PSCustomObject]@{ Locale = 'en'; Path = 'dist\news\bic-2026-mushhero-first-public-playtest\index.html'; Canonical = 'https://lvb.kr/news/bic-2026-mushhero-first-public-playtest/' },
  [PSCustomObject]@{ Locale = 'ko'; Path = 'dist\ko\news\bic-2026-mushhero-first-public-playtest\index.html'; Canonical = 'https://lvb.kr/ko/news/bic-2026-mushhero-first-public-playtest/' },
  [PSCustomObject]@{ Locale = 'ja'; Path = 'dist\ja\news\bic-2026-mushhero-first-public-playtest\index.html'; Canonical = 'https://lvb.kr/ja/news/bic-2026-mushhero-first-public-playtest/' },
  [PSCustomObject]@{ Locale = 'zh-cn'; Path = 'dist\zh-cn\news\bic-2026-mushhero-first-public-playtest\index.html'; Canonical = 'https://lvb.kr/zh-cn/news/bic-2026-mushhero-first-public-playtest/' }
)
$articleFullPaths = @()
foreach ($route in $articleRoutes) {
  $articlePath = Join-Path $siteRoot $route.Path
  $articleFullPaths += (Resolve-Path -LiteralPath $articlePath).Path
  $articleHtml = Get-Content -Raw -Encoding utf8 $articlePath
  $articleJsonMatches = [regex]::Matches($articleHtml, $jsonLdPattern)
  Assert-Equal $articleJsonMatches.Count 1 "Article JSON-LD script count: $($route.Locale)"
  $articleData = $articleJsonMatches[0].Groups[1].Value | ConvertFrom-Json
  Assert-Equal $articleData.'@type' 'Article' "Article JSON-LD type: $($route.Locale)"
  Assert-Equal $articleData.datePublished '2026-08-21' "Article published date: $($route.Locale)"
  Assert-Equal $articleData.dateModified '2026-08-21' "Article modified date: $($route.Locale)"
  Assert-Equal $articleData.mainEntityOfPage.'@id' $route.Canonical "Article main entity: $($route.Locale)"
  Assert-Equal ([regex]::Matches($articleHtml, '<meta property="og:type" content="article">').Count) 1 "Article Open Graph type: $($route.Locale)"
  Assert-Equal ([regex]::Matches($articleHtml, '<link rel="canonical" href="' + [regex]::Escape($route.Canonical) + '">').Count) 1 "Article canonical: $($route.Locale)"
  Assert-Equal ([regex]::Matches($articleHtml, 'rel="alternate" hreflang=').Count) 5 "Article hreflang count: $($route.Locale)"
}

foreach ($htmlFile in $htmlFiles) {
  $isRoot = $htmlFile.FullName -eq (Resolve-Path -LiteralPath $indexPath).Path
  $isArticle = $articleFullPaths -contains $htmlFile.FullName
  if (-not $isRoot -and -not $isArticle) {
    $pageHtml = Get-Content -Raw -Encoding utf8 $htmlFile.FullName
    Assert-Equal ([regex]::Matches($pageHtml, $jsonLdPattern).Count) 0 "Unexpected JSON-LD: $($htmlFile.FullName)"
  }
}

$ogRouteSpecs = @(
  [PSCustomObject]@{ Path = 'dist\index.html'; Image = 'https://lvb.kr/og/lvb-og-primary.png'; Type = 'image/png' },
  [PSCustomObject]@{ Path = 'dist\ko\index.html'; Image = 'https://lvb.kr/og/lvb-og-primary.png'; Type = 'image/png' },
  [PSCustomObject]@{ Path = 'dist\ja\index.html'; Image = 'https://lvb.kr/og/lvb-og-primary.png'; Type = 'image/png' },
  [PSCustomObject]@{ Path = 'dist\zh-cn\index.html'; Image = 'https://lvb.kr/og/lvb-og-primary.png'; Type = 'image/png' },
  [PSCustomObject]@{ Path = 'dist\about\index.html'; Image = 'https://lvb.kr/og/lvb-og-primary.png'; Type = 'image/png' },
  [PSCustomObject]@{ Path = 'dist\games\index.html'; Image = 'https://lvb.kr/og/lvb-og-primary.png'; Type = 'image/png' },
  [PSCustomObject]@{ Path = 'dist\news\index.html'; Image = 'https://lvb.kr/og/lvb-og-primary.png'; Type = 'image/png' },
  [PSCustomObject]@{ Path = 'dist\news\page\2\index.html'; Image = 'https://lvb.kr/og/lvb-og-primary.png'; Type = 'image/png' },
  [PSCustomObject]@{ Path = 'dist\press\index.html'; Image = 'https://lvb.kr/og/lvb-og-primary.png'; Type = 'image/png' },
  [PSCustomObject]@{ Path = 'dist\contact\index.html'; Image = 'https://lvb.kr/og/lvb-og-primary.png'; Type = 'image/png' }
)
foreach ($localePrefix in @('', 'ko\', 'ja\', 'zh-cn\')) {
  $ogRouteSpecs += [PSCustomObject]@{ Path = "dist\${localePrefix}games\mushhero\index.html"; Image = 'https://lvb.kr/og/mushhero-og-primary.jpg'; Type = 'image/jpeg' }
  $ogRouteSpecs += [PSCustomObject]@{ Path = "dist\${localePrefix}games\mushdash\index.html"; Image = 'https://lvb.kr/og/mushdash-og-primary.jpg'; Type = 'image/jpeg' }
  $ogRouteSpecs += [PSCustomObject]@{ Path = "dist\${localePrefix}news\bic-2026-mushhero-first-public-playtest\index.html"; Image = 'https://lvb.kr/og/mushhero-og-primary.jpg'; Type = 'image/jpeg' }
}
foreach ($route in $ogRouteSpecs) {
  $html = Get-Content -Raw -Encoding utf8 (Join-Path $siteRoot $route.Path)
  Assert-Equal ([regex]::Matches($html, '<title>[^<]+</title>').Count) 1 "OG page title: $($route.Path)"
  Assert-Equal ([regex]::Matches($html, '<meta name="description" content="[^"]+">').Count) 1 "OG page description: $($route.Path)"
  Assert-Equal ([regex]::Matches($html, '<link rel="canonical" href="https://lvb\.kr/[^"]*">').Count) 1 "OG page canonical: $($route.Path)"
  Assert-Equal ([regex]::Matches($html, '<meta property="og:title" content="[^"]+">').Count) 1 "Open Graph title: $($route.Path)"
  Assert-Equal ([regex]::Matches($html, '<meta property="og:description" content="[^"]+">').Count) 1 "Open Graph description: $($route.Path)"
  Assert-Equal ([regex]::Matches($html, '<meta property="og:image" content="' + [regex]::Escape($route.Image) + '">').Count) 1 "Open Graph image: $($route.Path)"
  Assert-Equal ([regex]::Matches($html, '<meta property="og:image:width" content="1200">').Count) 1 "Open Graph image width: $($route.Path)"
  Assert-Equal ([regex]::Matches($html, '<meta property="og:image:height" content="630">').Count) 1 "Open Graph image height: $($route.Path)"
  Assert-Equal ([regex]::Matches($html, '<meta property="og:image:type" content="' + [regex]::Escape($route.Type) + '">').Count) 1 "Open Graph image type: $($route.Path)"
  Assert-Equal ([regex]::Matches($html, '<meta property="og:image:alt" content="[^"]+">').Count) 1 "Open Graph image alt: $($route.Path)"
  Assert-Equal ([regex]::Matches($html, '<meta name="twitter:image" content="' + [regex]::Escape($route.Image) + '">').Count) 1 "Twitter image: $($route.Path)"
  Assert-Equal ([regex]::Matches($html, '<meta name="twitter:image:alt" content="[^"]+">').Count) 1 "Twitter image alt: $($route.Path)"
}

$newsListRoutes = @(
  [PSCustomObject]@{ Locale = 'en'; Page1 = 'dist\news\index.html'; Page2 = 'dist\news\page\2\index.html'; Canonical1 = 'https://lvb.kr/news/'; Canonical2 = 'https://lvb.kr/news/page/2/'; Next = '/news/page/2/'; Previous = '/news/' },
  [PSCustomObject]@{ Locale = 'ko'; Page1 = 'dist\ko\news\index.html'; Page2 = 'dist\ko\news\page\2\index.html'; Canonical1 = 'https://lvb.kr/ko/news/'; Canonical2 = 'https://lvb.kr/ko/news/page/2/'; Next = '/ko/news/page/2/'; Previous = '/ko/news/' },
  [PSCustomObject]@{ Locale = 'ja'; Page1 = 'dist\ja\news\index.html'; Page2 = 'dist\ja\news\page\2\index.html'; Canonical1 = 'https://lvb.kr/ja/news/'; Canonical2 = 'https://lvb.kr/ja/news/page/2/'; Next = '/ja/news/page/2/'; Previous = '/ja/news/' },
  [PSCustomObject]@{ Locale = 'zh-cn'; Page1 = 'dist\zh-cn\news\index.html'; Page2 = 'dist\zh-cn\news\page\2\index.html'; Canonical1 = 'https://lvb.kr/zh-cn/news/'; Canonical2 = 'https://lvb.kr/zh-cn/news/page/2/'; Next = '/zh-cn/news/page/2/'; Previous = '/zh-cn/news/' }
)
$englishNewsHrefs = @()
$englishNewsDates = @()
foreach ($route in $newsListRoutes) {
  $page1Html = Get-Content -Raw -Encoding utf8 (Join-Path $siteRoot $route.Page1)
  $page2Html = Get-Content -Raw -Encoding utf8 (Join-Path $siteRoot $route.Page2)
  foreach ($pageSpec in @(
      [PSCustomObject]@{ Name = $route.Page1; Html = $page1Html; Canonical = $route.Canonical1; External = 5; Internal = 1 },
      [PSCustomObject]@{ Name = $route.Page2; Html = $page2Html; Canonical = $route.Canonical2; External = 6; Internal = 0 }
    )) {
    $canonicalPattern = '<link rel="canonical" href="' + [regex]::Escape($pageSpec.Canonical) + '">'
    Assert-Equal ([regex]::Matches($pageSpec.Html, '<a class="news-card news-card--').Count) 6 "News page size: $($pageSpec.Name)"
    Assert-Equal ([regex]::Matches($pageSpec.Html, 'class="news-card news-card--external"').Count) $pageSpec.External "External News card count: $($pageSpec.Name)"
    Assert-Equal ([regex]::Matches($pageSpec.Html, 'class="news-card news-card--internal"').Count) $pageSpec.Internal "Internal News card count: $($pageSpec.Name)"
    Assert-Equal ([regex]::Matches($pageSpec.Html, 'class="news-card news-card--external" href="https?://[^\"]+" target="_blank" rel="noopener noreferrer"').Count) $pageSpec.External "External News link security: $($pageSpec.Name)"
    Assert-Equal ([regex]::Matches($pageSpec.Html, 'class="news-card news-card--internal" href="/[^"]+"').Count) $pageSpec.Internal "Internal News same-tab link: $($pageSpec.Name)"
    Assert-Equal ([regex]::Matches($pageSpec.Html, '<nav class="news-pagination"').Count) 1 "News pagination count: $($pageSpec.Name)"
    Assert-Equal ([regex]::Matches($pageSpec.Html, $canonicalPattern).Count) 1 "News canonical: $($pageSpec.Name)"
    Assert-Equal ([regex]::Matches($pageSpec.Html, 'rel="alternate" hreflang=').Count) 5 "News hreflang count: $($pageSpec.Name)"
    Assert-Equal ([regex]::Matches($pageSpec.Html, 'class="news-card__byline"').Count) 6 "News metadata first row: $($pageSpec.Name)"
    Assert-Equal ([regex]::Matches($pageSpec.Html, '<time class="news-card__date" datetime="').Count) 6 "News date second row: $($pageSpec.Name)"
    Assert-Equal ([regex]::Matches($pageSpec.Html, 'news-card__cta|news-card__internal-cta').Count) 0 "Removed News text CTA: $($pageSpec.Name)"
  }
  $nextPattern = 'href="' + [regex]::Escape($route.Next) + '" rel="next"'
  $previousPattern = 'href="' + [regex]::Escape($route.Previous) + '" rel="prev"'
  Assert-Equal ([regex]::Matches($page1Html, $nextPattern).Count) 1 "News next link: $($route.Locale)"
  Assert-Equal ([regex]::Matches($page2Html, $previousPattern).Count) 1 "News previous link: $($route.Locale)"
  Assert-Equal ([regex]::Matches($page1Html, 'class="news-pagination__page" aria-current="page"').Count) 1 "News page 1 current state: $($route.Locale)"
  Assert-Equal ([regex]::Matches($page2Html, 'class="news-pagination__page" aria-current="page"').Count) 1 "News page 2 current state: $($route.Locale)"
  if ($route.Locale -eq 'en') {
    $newsHrefPattern = '<a class="news-card news-card--[^"]+" href="([^"]+)"'
    foreach ($html in @($page1Html, $page2Html)) {
      $englishNewsHrefs += [regex]::Matches($html, $newsHrefPattern) | ForEach-Object { $_.Groups[1].Value }
      $englishNewsDates += [regex]::Matches($html, '<time class="news-card__date" datetime="([^"]+)"') | ForEach-Object { $_.Groups[1].Value }
    }
  }
}
Assert-Equal $englishNewsHrefs.Count 12 'News data count'
Assert-Equal (@($englishNewsHrefs | Sort-Object -Unique).Count) 12 'Unique News destination count'
Assert-Equal ($englishNewsDates -join '|') (($englishNewsDates | Sort-Object -Descending) -join '|') 'News published date order'
Assert-Equal (Test-Path -LiteralPath (Join-Path $siteRoot 'dist\news\page\3\index.html')) $false 'Unexpected News page 3 route'
$newsSource = Get-Content -Raw -Encoding utf8 (Join-Path $siteRoot 'src\data\news.ts')
Assert-Equal ([regex]::Matches($newsSource, "type:\s*'internal'").Count) 1 'Internal News source count'
Assert-Equal ([regex]::Matches($newsSource, "type:\s*'external'").Count) 11 'External News source count'
Assert-Equal ([regex]::Matches($newsSource, "kind:\s*'blog-review'").Count) 5 'Blog review source count'
foreach ($approvedBlogUrl in @(
    'https://blog.naver.com/kuromi01/223567525541',
    'https://blog.naver.com/ko_castle/223969678143',
    'https://blog.naver.com/djaakek00/223978126463',
    'https://blog.naver.com/tunacanzorim/223565100540'
  )) {
  Assert-Equal ([regex]::Matches($newsSource, [regex]::Escape($approvedBlogUrl)).Count) 1 "Approved Naver blog source: $approvedBlogUrl"
}
$newsCardSource = Get-Content -Raw -Encoding utf8 (Join-Path $siteRoot 'src\components\news\NewsItemCard.astro')
Assert-Equal ([regex]::Matches($newsCardSource, '<a[\s\S]*?class:list=\{\[').Count) 1 'Whole News card link source'
Assert-Equal ([regex]::Matches($newsCardSource, '<a(?:\s|>)', [System.Text.RegularExpressions.RegexOptions]::IgnoreCase).Count) 1 'Nested News card link count'
Assert-Equal ([regex]::Matches($newsCardSource, 'sourceCta|internalCta').Count) 0 'Removed News CTA translation references'
Assert-Equal ([regex]::Matches($newsCardSource, 'class="news-card__byline"').Count) 1 'News metadata first-row source'
Assert-Equal ([regex]::Matches($newsCardSource, 'class="news-card__date"').Count) 1 'News date second-row source'
$newsStyles = Get-Content -Raw -Encoding utf8 (Join-Path $siteRoot 'src\styles\news.css')
Assert-Equal ([regex]::Matches($newsStyles, '-webkit-line-clamp:\s*2').Count) 1 'News summary two-line clamp'
Assert-Equal ([regex]::Matches($newsStyles, '\.news-card__meta\s*\{[^}]*display:\s*grid', [System.Text.RegularExpressions.RegexOptions]::Singleline).Count) 1 'News two-row metadata layout'

$homeSourceScreenshotFiles = @(
  [PSCustomObject]@{ Path = 'press\assets\mushhero\mushhero-01.jpg'; Hash = '484B07E40D88556C53425222C1FCE4A9953DAA8A21AEA83CE33964060E106077' },
  [PSCustomObject]@{ Path = 'press\assets\mushhero\mushhero-02.jpg'; Hash = '13741FE3995FBC4FB8D84453BAB191B700AAF0823C4DA3D44E62CD3ED7CD37AF' },
  [PSCustomObject]@{ Path = 'press\assets\mushhero\mushhero-03.jpg'; Hash = '3CE54AC177C4A2D4CC7578B39904E97CB5C62CD995532DA8B4BDBBE193C50E90' },
  [PSCustomObject]@{ Path = 'press\assets\mushdash\mushdash-01.jpg'; Hash = '6B22EE5A5218B4EFA03ED05F86ABC5D5104995CD84CCE53B8877F7511165C4E4' },
  [PSCustomObject]@{ Path = 'press\assets\mushdash\mushdash-02.jpg'; Hash = '3F7E7C093C0430F7E87DB2ECF9E3C64E88D8DE081C2A6843F15774EC434D55F9' },
  [PSCustomObject]@{ Path = 'press\assets\mushdash\mushdash-03.jpg'; Hash = '10D6AD2513F92DE008B61BA969B4FD8D7C293D90199E151383E6B01FB698BADB' }
)
foreach ($asset in $homeSourceScreenshotFiles) {
  $publicAsset = Join-Path $siteRoot "public\$($asset.Path)"
  $distAsset = Join-Path $siteRoot "dist\$($asset.Path)"
  Assert-Equal (Get-FileHash -Algorithm SHA256 -LiteralPath $publicAsset).Hash $asset.Hash "Home source screenshot hash: $($asset.Path)"
  Assert-Equal (Get-FileHash -Algorithm SHA256 -LiteralPath $distAsset).Hash $asset.Hash "Built Home source screenshot hash: $($asset.Path)"
}

Add-Type -AssemblyName System.Drawing
$socialImageFiles = @(
  [PSCustomObject]@{ Path = 'og\lvb-og-primary.png'; Hash = 'F07E9FECEF39CB37A7FE1523D6E9EBFD56C3FD1247AE67C90819DC608F816FBA'; Width = 1200; Height = 630 },
  [PSCustomObject]@{ Path = 'og\mushhero-og-primary.jpg'; Hash = '558408C081859B7B345344FD203C806D4DD16E714DB2EF4FEDB5F4B0232F6481'; Width = 1200; Height = 630 },
  [PSCustomObject]@{ Path = 'og\mushdash-og-primary.jpg'; Hash = '8C90AA12908B9222FB1CF7DD0136FF5CB4C390DB9A88A6166D21CC8CB9E2C215'; Width = 1200; Height = 630 }
)
foreach ($asset in $socialImageFiles) {
  $publicAsset = Join-Path $siteRoot "public\$($asset.Path)"
  $distAsset = Join-Path $siteRoot "dist\$($asset.Path)"
  if ((Get-Item -LiteralPath $publicAsset).Length -le 0) { throw "Social image is empty: $($asset.Path)" }
  Assert-Equal (Get-FileHash -Algorithm SHA256 -LiteralPath $publicAsset).Hash $asset.Hash "Social image source hash: $($asset.Path)"
  Assert-Equal (Get-FileHash -Algorithm SHA256 -LiteralPath $distAsset).Hash $asset.Hash "Built social image hash: $($asset.Path)"
  $image = [System.Drawing.Image]::FromFile($publicAsset)
  try {
    Assert-Equal $image.Width $asset.Width "Social image width: $($asset.Path)"
    Assert-Equal $image.Height $asset.Height "Social image height: $($asset.Path)"
  } finally {
    $image.Dispose()
  }
}

$pressFinalFiles = @(
  [PSCustomObject]@{ Path = 'press\assets\brand\lvb-brand-card-yellow.png'; Hash = '6C9E13C002CA61BDA104392542EE6CEA33E9EB4EC09E7CFDC70D9B888DE28CE3' },
  [PSCustomObject]@{ Path = 'press\assets\brand\lvb-brand-press-preview.png'; Hash = '60137D3041246091AEA53D178BBF86AF9DD4174050BAA555A843990564CE8E54' },
  [PSCustomObject]@{ Path = 'press\assets\brand\lvb-logo-horizontal-transparent.png'; Hash = '349DE31265DDEB443651FE017AF31CB392069D94DA47FD559F8DB1856C45DA8D' },
  [PSCustomObject]@{ Path = 'press\assets\brand\lvb-logo-stacked-transparent.png'; Hash = 'AF926288880882B2002B66FEAB8C9FCACDC23D05799B0E3FBEE4E87AB56201EC' },
  [PSCustomObject]@{ Path = 'press\assets\brand\lvb-symbol-transparent.png'; Hash = '26A4284E8AB254294D9A5A5B0775EDD06AD86A8F96EA6EB225502DE66B3EA754' },
  [PSCustomObject]@{ Path = 'press\assets\mushhero\mushhero-keyart-alt-01.jpg'; Hash = 'D4406D0CF6ACE86D137EC08294D655D04058F553269DC672B3E15F4E123BC288' },
  [PSCustomObject]@{ Path = 'press\assets\mushhero\mushhero-keyart-primary.jpg'; Hash = '028EC8FFA2FFE42682D8D1AD3C7684BFB4EC675DB63FE62A6D02266CF4D81376' },
  [PSCustomObject]@{ Path = 'press\assets\mushhero\mushhero-logo-transparent.png'; Hash = 'C8A49CE599F7CCF249561FEB95FF593E7C2E9C3C1744C7AEBFDAA78D448263BA' },
  [PSCustomObject]@{ Path = 'press\assets\mushhero\mushhero-press-wide-1920.jpg'; Hash = 'F1DC15B8AA03B9B56E54D32011B2F64292FD809515883C3AA4FA33DBB0DD395E' },
  [PSCustomObject]@{ Path = 'press\assets\mushhero\mushhero-screenshot-01.jpg'; Hash = '88A96824E6769553EE9C74EE2EBB0F64B0D52A95807A6213AB849DD7B2CF2DAD' },
  [PSCustomObject]@{ Path = 'press\assets\mushhero\mushhero-screenshot-02.jpg'; Hash = 'B126E858CBE7FC025311C756138C1C344937441D9DA65DE52C901C3852BF26EB' },
  [PSCustomObject]@{ Path = 'press\assets\mushhero\mushhero-screenshot-03.jpg'; Hash = '86ABE54FAE0BD873492426CB03D5D7F686C37E23F3C0127DF0B4151EC6416190' },
  [PSCustomObject]@{ Path = 'press\assets\mushdash\mushdash-keyart-primary.jpg'; Hash = '82C2529AE443F29BC1CDD8F9EB6A65BBFD8B49012D686195933D2C9177FBDD65' },
  [PSCustomObject]@{ Path = 'press\assets\mushdash\mushdash-logo-transparent.png'; Hash = 'F682FF99F832CEB8BDDDFC8E6700F5E98FD72ABA0691AF61CE050FC577198516' },
  [PSCustomObject]@{ Path = 'press\assets\mushdash\mushdash-press-wide-1920.jpg'; Hash = 'BB07BC36DA6412C7F728AF8D08B8A2E6DFB0CFA7DAC33BCB878FEFC3CC21B3A9' },
  [PSCustomObject]@{ Path = 'press\assets\mushdash\mushdash-promo-01.jpg'; Hash = '2A57A43FBCDA4B194B984E894812CC6E2DEF51465942B3AB6E82C5EB7B9F6B39' },
  [PSCustomObject]@{ Path = 'press\assets\mushdash\mushdash-promo-02.jpg'; Hash = '066C37C5FEFC6D866DAA0CF98533CEEB5EB544C7B2B221F798AAD580A37F6D30' },
  [PSCustomObject]@{ Path = 'press\assets\mushdash\mushdash-promo-03.jpg'; Hash = '2418780B7F0A04005553803190F1FD228C7325F0E73CF0602C54D1BD7318F7DB' }
)
foreach ($asset in $pressFinalFiles) {
  $publicAsset = Join-Path $siteRoot "public\$($asset.Path)"
  $distAsset = Join-Path $siteRoot "dist\$($asset.Path)"
  Assert-Equal (Get-FileHash -Algorithm SHA256 -LiteralPath $publicAsset).Hash $asset.Hash "Final Press asset hash: $($asset.Path)"
  Assert-Equal (Get-FileHash -Algorithm SHA256 -LiteralPath $distAsset).Hash $asset.Hash "Built final Press asset hash: $($asset.Path)"
}

$homeResponsiveFiles = @(
  [PSCustomObject]@{ Path = 'home\assets\mushhero-01-640.webp'; Hash = 'E875C7ECF44AB1732C97573C086FBE1C576AD0FC03E2282BE0939F52E412DDCA' },
  [PSCustomObject]@{ Path = 'home\assets\mushhero-01-1280.webp'; Hash = '462059C60B0D1B327243135A41242401107D6D40D5A0A26BE8FB1C194414E106' },
  [PSCustomObject]@{ Path = 'home\assets\mushhero-02-640.webp'; Hash = 'C720F1A943FD9C386A3CD9E9E8CB18D7BD1852A72420667B24B1E08204CBD988' },
  [PSCustomObject]@{ Path = 'home\assets\mushhero-02-1280.webp'; Hash = '304C98A425301688518272898641D5405ACFC2EB9620B0C09135E9F539808F42' },
  [PSCustomObject]@{ Path = 'home\assets\mushhero-03-640.webp'; Hash = 'EC7D61100B41D79881E2F9940ABAE3544D3A2A5485A181FB02FC54E8465FA884' },
  [PSCustomObject]@{ Path = 'home\assets\mushhero-03-1280.webp'; Hash = '501B6913D0307F1CA814E5A67B3157D729CE1B00652EF65E60443389D6A53D5F' },
  [PSCustomObject]@{ Path = 'home\assets\mushdash-01-640.webp'; Hash = 'CDCA3A488C2B6A58E4C498383D618F4164BBC8806D156352892E16D1A8530353' },
  [PSCustomObject]@{ Path = 'home\assets\mushdash-01-1280.webp'; Hash = 'E3342F00EC0C7075CB135C58E374C39D582A39E757B3323B5260E13A8C13F5B6' },
  [PSCustomObject]@{ Path = 'home\assets\mushdash-02-640.webp'; Hash = '6F8EE82D56DA8698E1A60DC351AF22D2222EFD51336010F14EA8B98F4BD9BF70' },
  [PSCustomObject]@{ Path = 'home\assets\mushdash-02-1280.webp'; Hash = 'CB14D9402AFDCEEFDCFB679508527FC2F6F38DF75E6082591F8C8CF359210A28' }
)
foreach ($asset in $homeResponsiveFiles) {
  $publicAsset = Join-Path $siteRoot "public\$($asset.Path)"
  $distAsset = Join-Path $siteRoot "dist\$($asset.Path)"
  Assert-Equal (Get-FileHash -Algorithm SHA256 -LiteralPath $publicAsset).Hash $asset.Hash "Home responsive source hash: $($asset.Path)"
  Assert-Equal (Get-FileHash -Algorithm SHA256 -LiteralPath $distAsset).Hash $asset.Hash "Built Home responsive hash: $($asset.Path)"
}

Add-Type -AssemblyName System.IO.Compression.FileSystem
$pressArchives = @(
  [PSCustomObject]@{ Name = 'lvb-brand-assets.zip'; Bytes = 255565; Hash = '035DEF47F8B06BF19ABC5855475FC4EC44D12DAC0C78584C711E2C1E19A6367F'; Entries = @('LvB-Brand-Assets/Logo/lvb-logo-horizontal-transparent.png', 'LvB-Brand-Assets/Logo/lvb-logo-stacked-transparent.png', 'LvB-Brand-Assets/Preview/lvb-brand-card-yellow.png', 'LvB-Brand-Assets/Preview/lvb-brand-press-preview.png', 'LvB-Brand-Assets/Symbol/lvb-symbol-transparent.png') },
  [PSCustomObject]@{ Name = 'mushhero-press-kit.zip'; Bytes = 2300078; Hash = 'CC05D7A934288FF39BC5902AAA4AB35A346C9AF817AF1ABCD3E3BEBA973CCE2C'; Entries = @('MushHero-Press-Kit/Key-Art/mushhero-keyart-alt-01.jpg', 'MushHero-Press-Kit/Key-Art/mushhero-keyart-primary.jpg', 'MushHero-Press-Kit/Logo/mushhero-logo-transparent.png', 'MushHero-Press-Kit/Press-Image/mushhero-press-wide-1920.jpg', 'MushHero-Press-Kit/Screenshots/mushhero-screenshot-01.jpg', 'MushHero-Press-Kit/Screenshots/mushhero-screenshot-02.jpg', 'MushHero-Press-Kit/Screenshots/mushhero-screenshot-03.jpg') },
  [PSCustomObject]@{ Name = 'mushdash-press-kit.zip'; Bytes = 914628; Hash = 'FA846A03159BCE14DA55BA9604A5AD509AED49DA7394E36EAFE3555C82093890'; Entries = @('MushDash-Press-Kit/Key-Art/mushdash-keyart-primary.jpg', 'MushDash-Press-Kit/Logo/mushdash-logo-transparent.png', 'MushDash-Press-Kit/Press-Image/mushdash-press-wide-1920.jpg', 'MushDash-Press-Kit/Promotional-Images/mushdash-promo-01.jpg', 'MushDash-Press-Kit/Promotional-Images/mushdash-promo-02.jpg', 'MushDash-Press-Kit/Promotional-Images/mushdash-promo-03.jpg') }
)
foreach ($archiveSpec in $pressArchives) {
  $publicArchive = Join-Path $siteRoot "public\press\downloads\$($archiveSpec.Name)"
  $distArchive = Join-Path $siteRoot "dist\press\downloads\$($archiveSpec.Name)"
  if ((Get-Item -LiteralPath $publicArchive).Length -le 0) { throw "Press archive is empty: $($archiveSpec.Name)" }
  Assert-Equal (Get-Item -LiteralPath $publicArchive).Length $archiveSpec.Bytes "Press archive size: $($archiveSpec.Name)"
  Assert-Equal (Get-FileHash -Algorithm SHA256 -LiteralPath $publicArchive).Hash $archiveSpec.Hash "Press archive hash: $($archiveSpec.Name)"
  Assert-Equal (Get-FileHash -Algorithm SHA256 -LiteralPath $distArchive).Hash $archiveSpec.Hash "Built Press archive hash: $($archiveSpec.Name)"
  $archive = [System.IO.Compression.ZipFile]::OpenRead($publicArchive)
  try {
    $actualEntries = @($archive.Entries | Where-Object { -not $_.FullName.EndsWith('/') } | ForEach-Object { $_.FullName })
    Assert-Equal ($actualEntries -join '|') ($archiveSpec.Entries -join '|') "Press archive entries: $($archiveSpec.Name)"
    Assert-Equal (@($actualEntries | Sort-Object -Unique).Count) $actualEntries.Count "Unique Press archive entries: $($archiveSpec.Name)"
    Assert-Equal (@($actualEntries | Where-Object { $_ -match '(?i)(contact-sheet|^docs/|/docs/|^previews/|/previews/)' }).Count) 0 "Excluded Press archive working files: $($archiveSpec.Name)"
    foreach ($entry in $archive.Entries) {
      if ($entry.Length -le 0) { continue }
      $entryStream = $entry.Open()
      try { $entryStream.CopyTo([System.IO.Stream]::Null) } finally { $entryStream.Dispose() }
    }
  } finally {
    $archive.Dispose()
  }
}

foreach ($pressPath in @('dist\press\index.html', 'dist\ko\press\index.html', 'dist\ja\press\index.html', 'dist\zh-cn\press\index.html')) {
  $pressHtml = Get-Content -Raw -Encoding utf8 (Join-Path $siteRoot $pressPath)
  Assert-Equal ([regex]::Matches($pressHtml, 'class="press-download-card"').Count) 3 "Press download card count: $pressPath"
  Assert-Equal ([regex]::Matches($pressHtml, 'href="/press/downloads/[^"]+\.zip" download="[^"]+\.zip"').Count) 3 "Press ZIP download links: $pressPath"
  Assert-Equal ([regex]::Matches($pressHtml, 'href="/press/assets/brand/[^"]+\.png" download="[^"]+\.png"').Count) 3 "Press brand downloads: $pressPath"
  Assert-Equal ([regex]::Matches($pressHtml, 'class="media-gallery__item"').Count) 10 "Press gallery item count: $pressPath"
  Assert-Equal ([regex]::Matches($pressHtml, 'src="/press/assets/(?:mushhero|mushdash)/[^"]+\.(?:jpg|png)"').Count) 12 "Press final game image count: $pressPath"
  Assert-Equal ([regex]::Matches($pressHtml, 'src="/press/assets/brand/[^"]+\.png"').Count) 4 "Press final brand image count: $pressPath"
  Assert-Equal ([regex]::Matches($pressHtml, 'press-recent|press-recent-title|class="news-card"').Count) 0 "Removed Press recent coverage UI: $pressPath"
}

Assert-Equal ([regex]::Matches($indexHtml, '<button[^>]+data-hero-game-tab').Count) 0 'Removed Home Hero game selector count'
Assert-Equal ([regex]::Matches($indexHtml, '<div[^>]+data-hero-background-slide').Count) 4 'Home Hero background slide count'
Assert-Equal ([regex]::Matches($indexHtml, '<div[^>]+data-hero-background-slide[^>]+data-slide-game="mushhero"').Count) 2 'Home MushHero background slide count'
Assert-Equal ([regex]::Matches($indexHtml, '<div[^>]+data-hero-background-slide[^>]+data-slide-game="mushdash"').Count) 2 'Home MushDash background slide count'
Assert-Equal ([regex]::Matches($indexHtml, '<div[^>]+data-hero-content-panel').Count) 2 'Home Hero game content count'
Assert-Equal ([regex]::Matches($indexHtml, 'data-hero-previous|data-hero-next|data-hero-counter').Count) 0 'Removed Home Hero legacy carousel controls'
Assert-Equal ([regex]::Matches($indexHtml, '<button[^>]+data-hero-dot').Count) 4 'Home Hero pagination count'
Assert-Equal ([regex]::Matches($indexHtml, '<button[^>]+data-hero-playback').Count) 1 'Home Hero playback control count'
Assert-Equal ([regex]::Matches($indexHtml, 'data-home-hero[^>]+data-hero-autoplay="true"').Count) 1 'Home Hero autoplay marker'
Assert-Equal ([regex]::Matches($indexHtml, '<img[^>]+src="/press/assets/mushhero/mushhero-01\.jpg"[^>]+loading="eager"[^>]+fetchpriority="high"').Count) 1 'Home Hero eager image'
Assert-Equal ([regex]::Matches($indexHtml, '<img[^>]+data-src="/press/assets/(?:mushhero|mushdash)/[^"]+\.jpg"').Count) 3 'Home deferred Hero image count'
Assert-Equal ([regex]::Matches($indexHtml, 'data-home-game-showcase|home-game-showcase').Count) 0 'Removed Home game showcase output'
Assert-Equal ([regex]::Matches($indexHtml, 'class="featured-game page-section"').Count) 1 'Restored Home featured section'
Assert-Equal ([regex]::Matches($indexHtml, 'class="games-overview page-section"').Count) 1 'Restored Home games overview'
Assert-Equal ([regex]::Matches($indexHtml, 'mushdash-section').Count) 0 'Removed duplicate Home MushDash section'
Assert-Equal (Test-Path -LiteralPath (Join-Path $siteRoot 'src\components\home\MushDashSection.astro')) $false 'Removed Home MushDash component'
Assert-Equal ([bool]($indexHtml -match 'href="/games/mushdash/"')) $true 'Home MushDash detail route'
$homeLocalePaths = @(
  @{ Path = 'dist\index.html'; Detail = '/games/mushhero/' },
  @{ Path = 'dist\ko\index.html'; Detail = '/ko/games/mushhero/' },
  @{ Path = 'dist\ja\index.html'; Detail = '/ja/games/mushhero/' },
  @{ Path = 'dist\zh-cn\index.html'; Detail = '/zh-cn/games/mushhero/' }
)
foreach ($homeLocale in $homeLocalePaths) {
  $homeLocaleHtml = Get-Content -Raw -Encoding utf8 (Join-Path $siteRoot $homeLocale.Path)
  Assert-Equal ([regex]::Matches($homeLocaleHtml, '<h2 id="featured-game-title" class="featured-game__title">MushHero</h2>').Count) 1 "Home Featured MushHero title: $($homeLocale.Path)"
  Assert-Equal ([regex]::Matches($homeLocaleHtml, 'class="featured-game__meta"').Count) 1 "Home Featured genre and release meta: $($homeLocale.Path)"
  Assert-Equal ([regex]::Matches($homeLocaleHtml, 'class="featured-game__actions"').Count) 1 "Home Featured CTA group: $($homeLocale.Path)"
  Assert-Equal ([bool]($homeLocaleHtml -match ('href="' + [regex]::Escape($homeLocale.Detail) + '"'))) $true "Home Featured internal detail CTA: $($homeLocale.Path)"
  Assert-Equal ([bool]($homeLocaleHtml -match 'href="https://store\.steampowered\.com/app/4711200/MushHero/"')) $true "Home Featured Steam CTA: $($homeLocale.Path)"
}
$featuredSectionIndex = $indexHtml.IndexOf('class="featured-game page-section"')
$gamesOverviewIndex = $indexHtml.IndexOf('class="games-overview page-section"')
$aboutPreviewIndex = $indexHtml.IndexOf('class="about-preview page-section"')
if ($featuredSectionIndex -lt 0 -or $gamesOverviewIndex -le $featuredSectionIndex -or $aboutPreviewIndex -le $gamesOverviewIndex) {
  throw 'Home section order must be Hero, Featured Game, Games Overview, About Preview.'
}
Assert-Equal ([regex]::Matches($indexHtml, '<img[^>]+(?:src|data-src)="https://').Count) 0 'Home external image hotlink count'
Assert-Equal ([regex]::Matches($indexHtml, '/home/assets/(?:mushhero|mushdash)-\d{2}-640\.webp 640w, /home/assets/(?:mushhero|mushdash)-\d{2}-1280\.webp 1280w').Count) 7 'Home responsive image source-set count'
$homeStyles = Get-Content -Raw -Encoding utf8 (Join-Path $siteRoot 'src\styles\home.css')
Assert-Equal ([regex]::Matches($homeStyles, 'home-game-showcase').Count) 0 'Removed Home game showcase styles'
Assert-Equal ([regex]::Matches($homeStyles, 'home-hero__selector|home-hero__track|home-hero__viewport|home-hero__arrow|home-hero__counter').Count) 0 'Removed Home Hero selector and legacy carousel styles'
Assert-Equal ([regex]::Matches($homeStyles, '(?s)\.home-hero\s*\{[^}]*overflow:\s*clip').Count) 1 'Home Hero full-bleed overflow clipping'
Assert-Equal ([regex]::Matches($homeStyles, '(?s)\.home-hero__background\s*\{[^}]*opacity:\s*0').Count) 1 'Home Hero background crossfade base'
Assert-Equal ([regex]::Matches($homeStyles, '(?s)\.home-hero__background img\s*\{[^}]*width:\s*100%[^}]*height:\s*100%[^}]*object-fit:\s*cover').Count) 1 'Home Hero full-bleed background image sizing'
Assert-Equal ([regex]::Matches($homeStyles, 'margin-top:\s*clamp\(1\.75rem,\s*calc\(1\.25rem\s*\+\s*1\.5vw\),\s*2\.25rem\)').Count) 1 'Home Hero CTA-to-indicator responsive spacing'
$homeHeroSource = Get-Content -Raw -Encoding utf8 (Join-Path $siteRoot 'src\components\home\HomeHero.astro')
Assert-Equal ([regex]::Matches($homeHeroSource, 'const autoPlayDelay = 6500;').Count) 1 'Home Hero autoplay interval'
Assert-Equal ([regex]::Matches($homeHeroSource, "matchMedia\('\(prefers-reduced-motion: reduce\)'\)").Count) 1 'Home Hero reduced-motion autoplay guard'
Assert-Equal ([regex]::Matches($homeHeroSource, "root\.addEventListener\('pointerenter'").Count) 1 'Home Hero pointer pause'
Assert-Equal ([regex]::Matches($homeHeroSource, "root\.addEventListener\('focusin'").Count) 1 'Home Hero focus pause'
Assert-Equal ([regex]::Matches($homeHeroSource, 'preloadLeadTime').Count) 2 'Home Hero progressive preload strategy'
$globalStyles = Get-Content -Raw -Encoding utf8 (Join-Path $siteRoot 'src\styles\global.css')
Assert-Equal ([regex]::Matches($globalStyles, 'mushdash-section').Count) 0 'Removed Home MushDash section styles'
Assert-Equal ([regex]::Matches($globalStyles, '(?s)\.about-preview\s*\{[^}]*border-block:\s*1px solid var\(--color-border\)').Count) 1 'Home Games-to-About divider'
Assert-Equal ([regex]::Matches($globalStyles, '--color-brand-bg:\s*#0f0d0c').Count) 1 'Deepest charcoal token'
Assert-Equal ([regex]::Matches($globalStyles, '--color-page:\s*#1a1714').Count) 1 'Warm bright charcoal page token'
Assert-Equal ([regex]::Matches($globalStyles, '--color-brand-surface:\s*#221e19').Count) 1 'Warm bright charcoal surface token'
Assert-Equal ([regex]::Matches($globalStyles, '--color-brand-surface-raised:\s*#29241e').Count) 1 'Warm bright charcoal raised token'
Assert-Equal ([regex]::Matches($globalStyles, '--color-brand-surface-warm:\s*#302a22').Count) 1 'Warm bright charcoal warm token'
Assert-Equal ([regex]::Matches($globalStyles, '--color-brand-border-strong:\s*#82725c').Count) 1 'Interactive border contrast token'
Assert-Equal ([regex]::Matches($globalStyles, '--color-brand-text-muted:\s*#bdb2a2').Count) 1 'Readable muted text token'
Assert-Equal ([regex]::Matches($homeStyles, 'filter:\s*brightness').Count) 0 'Home Hero artificial image brightness filter count'

foreach ($aboutPath in @('dist\about\index.html', 'dist\ko\about\index.html', 'dist\ja\about\index.html', 'dist\zh-cn\about\index.html')) {
  $aboutHtml = Get-Content -Raw -Encoding utf8 (Join-Path $siteRoot $aboutPath)
  $principlesBlock = [regex]::Match($aboutHtml, '(?s)<ol class="about-capabilities__grid">(.*?)</ol>')
  Assert-Equal $principlesBlock.Success $true "About philosophy block: $aboutPath"
  Assert-Equal ([regex]::Matches($principlesBlock.Groups[1].Value, '<h3>').Count) 3 "About philosophy principle count: $aboutPath"
  Assert-Equal ([regex]::Matches($aboutHtml, 'about-approach').Count) 0 "Removed duplicate About philosophy block: $aboutPath"
  Assert-Equal ([regex]::Matches($aboutHtml, 'class="about-team page-section"').Count) 1 "About team section: $aboutPath"
  Assert-Equal ([regex]::Matches($aboutHtml, 'class="about-location page-section"').Count) 1 "About location section: $aboutPath"
}
foreach ($gameDetailPath in @('dist\games\mushhero\index.html', 'dist\games\mushdash\index.html')) {
  $gameDetailHtml = Get-Content -Raw -Encoding utf8 (Join-Path $siteRoot $gameDetailPath)
  Assert-Equal ([regex]::Matches($gameDetailHtml, 'class="media-gallery__item"').Count) 3 "Game gallery item count: $gameDetailPath"
  Assert-Equal ([regex]::Matches($gameDetailHtml, '<dialog class="media-lightbox"').Count) 1 "Game lightbox count: $gameDetailPath"
  Assert-Equal ([regex]::Matches($gameDetailHtml, '<iframe').Count) 0 "Unverified video iframe count: $gameDetailPath"
}
foreach ($legalPath in @('dist\privacy\index.html', 'dist\terms\index.html')) {
  $legalHtml = Get-Content -Raw -Encoding utf8 (Join-Path $siteRoot $legalPath)
  Assert-Equal ([regex]::Matches($legalHtml, '<(?:main|article|div|section)[^>]*\sdata-motion-page(?:\s|=|>)').Count) 0 "Legal motion opt-in count: $legalPath"
}
$legalPaths = @(
  'dist\privacy\index.html', 'dist\ko\privacy\index.html', 'dist\ja\privacy\index.html', 'dist\zh-cn\privacy\index.html',
  'dist\terms\index.html', 'dist\ko\terms\index.html', 'dist\ja\terms\index.html', 'dist\zh-cn\terms\index.html'
)
foreach ($legalPath in $legalPaths) {
  $legalHtml = Get-Content -Raw -Encoding utf8 (Join-Path $siteRoot $legalPath)
  Assert-Equal ([regex]::Matches($legalHtml, 'class="privacy-toc privacy-toc--desktop"').Count) 1 "Legal desktop TOC count: $legalPath"
  Assert-Equal ([regex]::Matches($legalHtml, '<details class="privacy-toc privacy-toc--mobile">').Count) 1 "Legal mobile TOC count: $legalPath"
}
$legalStyles = Get-Content -Raw -Encoding utf8 (Join-Path $siteRoot 'src\styles\privacy.css')
$legalBaseStyles = $legalStyles.Substring(0, $legalStyles.IndexOf('@media'))
Assert-Equal ([regex]::Matches($legalBaseStyles, '(?s)\.privacy-layout__aside\s*\{[^}]*display:\s*none').Count) 1 'Legal desktop TOC hidden below desktop breakpoint'
Assert-Equal ([regex]::Matches($legalStyles, '(?s)@media \(min-width:\s*64rem\).*?\.privacy-toc--mobile\s*\{[^}]*display:\s*none').Count) 1 'Legal mobile TOC hidden at desktop breakpoint'
Assert-Equal ([regex]::Matches($legalStyles, '(?s)@media \(min-width:\s*64rem\).*?\.privacy-layout__aside\s*\{[^}]*display:\s*block').Count) 1 'Legal desktop TOC visible at desktop breakpoint'

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

$profileVariants = @(
  [PSCustomObject]@{ Original = 'park-jaemin.png'; Variant = 'park-jaemin-640.webp' },
  [PSCustomObject]@{ Original = 'park-jaemin.png'; Variant = 'park-jaemin-1024.webp' },
  [PSCustomObject]@{ Original = 'jeong-bogeon.png'; Variant = 'jeong-bogeon-640.webp' },
  [PSCustomObject]@{ Original = 'jeong-bogeon.png'; Variant = 'jeong-bogeon-1024.webp' }
)
foreach ($variant in $profileVariants) {
  $originalPath = Join-Path $siteRoot "public\team\profiles\$($variant.Original)"
  $publicVariantPath = Join-Path $siteRoot "public\team\profiles\$($variant.Variant)"
  $distVariantPath = Join-Path $siteRoot "dist\team\profiles\$($variant.Variant)"
  if ((Get-Item -LiteralPath $publicVariantPath).Length -ge (Get-Item -LiteralPath $originalPath).Length) {
    throw "Optimized profile is not smaller than its PNG original: $($variant.Variant)"
  }
  Assert-Equal (Get-FileHash -Algorithm SHA256 -LiteralPath $publicVariantPath).Hash (Get-FileHash -Algorithm SHA256 -LiteralPath $distVariantPath).Hash "Built WebP hash: $($variant.Variant)"
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

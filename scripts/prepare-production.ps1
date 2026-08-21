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
Assert-Equal $htmlFiles.Count 45 'Total production HTML count'
Assert-Equal $regularHtml.Count 44 'Regular production HTML count'

$sitemap = Get-Content -Raw -Encoding utf8 (Join-Path $siteRoot 'dist\sitemap-0.xml')
$sitemapCount = ([regex]::Matches($sitemap, '<url>')).Count
Assert-Equal $sitemapCount 36 'Sitemap URL count'
if ($sitemap -match '/privacy/') { throw 'Privacy routes must be excluded from the sitemap.' }
if ($sitemap -match '/terms/') { throw 'Terms routes must be excluded from the sitemap.' }
foreach ($requiredSitemapPath in @('/press/', '/ko/press/', '/ja/press/', '/zh-cn/press/', '/news/bic-2026-mushhero-first-public-playtest/', '/ko/news/bic-2026-mushhero-first-public-playtest/', '/ja/news/bic-2026-mushhero-first-public-playtest/', '/zh-cn/news/bic-2026-mushhero-first-public-playtest/')) {
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

foreach ($newsListPath in @('dist\news\index.html', 'dist\ko\news\index.html', 'dist\ja\news\index.html', 'dist\zh-cn\news\index.html')) {
  $newsListHtml = Get-Content -Raw -Encoding utf8 (Join-Path $siteRoot $newsListPath)
  Assert-Equal ([regex]::Matches($newsListHtml, '<article class="news-card"').Count) 8 "News item count: $newsListPath"
  Assert-Equal ([regex]::Matches($newsListHtml, 'class="news-card__internal-link"').Count) 1 "Internal News link count: $newsListPath"
  Assert-Equal ([regex]::Matches($newsListHtml, 'class="external-link" href="https?://[^\"]+" target="_blank" rel="noopener noreferrer"').Count -ge 7) $true "External News link security: $newsListPath"
}

$pressScreenshotFiles = @(
  [PSCustomObject]@{ Path = 'press\assets\mushhero\mushhero-01.jpg'; Hash = '484B07E40D88556C53425222C1FCE4A9953DAA8A21AEA83CE33964060E106077' },
  [PSCustomObject]@{ Path = 'press\assets\mushhero\mushhero-02.jpg'; Hash = '13741FE3995FBC4FB8D84453BAB191B700AAF0823C4DA3D44E62CD3ED7CD37AF' },
  [PSCustomObject]@{ Path = 'press\assets\mushhero\mushhero-03.jpg'; Hash = '3CE54AC177C4A2D4CC7578B39904E97CB5C62CD995532DA8B4BDBBE193C50E90' },
  [PSCustomObject]@{ Path = 'press\assets\mushdash\mushdash-01.jpg'; Hash = '6B22EE5A5218B4EFA03ED05F86ABC5D5104995CD84CCE53B8877F7511165C4E4' },
  [PSCustomObject]@{ Path = 'press\assets\mushdash\mushdash-02.jpg'; Hash = '3F7E7C093C0430F7E87DB2ECF9E3C64E88D8DE081C2A6843F15774EC434D55F9' },
  [PSCustomObject]@{ Path = 'press\assets\mushdash\mushdash-03.jpg'; Hash = '10D6AD2513F92DE008B61BA969B4FD8D7C293D90199E151383E6B01FB698BADB' }
)
foreach ($asset in $pressScreenshotFiles) {
  $publicAsset = Join-Path $siteRoot "public\$($asset.Path)"
  $distAsset = Join-Path $siteRoot "dist\$($asset.Path)"
  Assert-Equal (Get-FileHash -Algorithm SHA256 -LiteralPath $publicAsset).Hash $asset.Hash "Press screenshot source hash: $($asset.Path)"
  Assert-Equal (Get-FileHash -Algorithm SHA256 -LiteralPath $distAsset).Hash $asset.Hash "Built Press screenshot hash: $($asset.Path)"
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
  [PSCustomObject]@{ Name = 'lvb-brand-assets.zip'; Hash = 'B9281432DD14EDB034B3691D32262F9A07A86B9055B911C0EA1DE8427D3A696B'; Entries = @('brand/lvb-logo.png', 'brand/lvb-symbol.png', 'USAGE.txt') },
  [PSCustomObject]@{ Name = 'mushhero-press-kit.zip'; Hash = 'F46E37BFFF886D72187F470DA998E000FE64B9F99C8622FCAF9B701B07560496'; Entries = @('brand/lvb-logo.png', 'brand/lvb-symbol.png', 'screenshots/mushhero-01.jpg', 'screenshots/mushhero-02.jpg', 'screenshots/mushhero-03.jpg', 'FACT_SHEET_EN.txt', 'FACT_SHEET_JA.txt', 'FACT_SHEET_KO.txt', 'FACT_SHEET_ZH-CN.txt') },
  [PSCustomObject]@{ Name = 'mushdash-press-kit.zip'; Hash = '61BBE31E60C9E68B7513139D02D94998A2782E94E1605D29D9FF77D4025800ED'; Entries = @('brand/lvb-logo.png', 'brand/lvb-symbol.png', 'screenshots/mushdash-01.jpg', 'screenshots/mushdash-02.jpg', 'screenshots/mushdash-03.jpg', 'FACT_SHEET_EN.txt', 'FACT_SHEET_JA.txt', 'FACT_SHEET_KO.txt', 'FACT_SHEET_ZH-CN.txt') }
)
foreach ($archiveSpec in $pressArchives) {
  $publicArchive = Join-Path $siteRoot "public\press\downloads\$($archiveSpec.Name)"
  $distArchive = Join-Path $siteRoot "dist\press\downloads\$($archiveSpec.Name)"
  if ((Get-Item -LiteralPath $publicArchive).Length -le 0) { throw "Press archive is empty: $($archiveSpec.Name)" }
  Assert-Equal (Get-FileHash -Algorithm SHA256 -LiteralPath $publicArchive).Hash $archiveSpec.Hash "Press archive hash: $($archiveSpec.Name)"
  Assert-Equal (Get-FileHash -Algorithm SHA256 -LiteralPath $distArchive).Hash $archiveSpec.Hash "Built Press archive hash: $($archiveSpec.Name)"
  $archive = [System.IO.Compression.ZipFile]::OpenRead($publicArchive)
  try {
    $actualEntries = @($archive.Entries | Where-Object { -not $_.FullName.EndsWith('/') } | ForEach-Object { $_.FullName })
    Assert-Equal ($actualEntries -join '|') ($archiveSpec.Entries -join '|') "Press archive entries: $($archiveSpec.Name)"
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
  Assert-Equal ([regex]::Matches($pressHtml, 'href="/brand/[^"]+\.png" download="[^"]+\.png"').Count) 2 "Press brand downloads: $pressPath"
  Assert-Equal ([regex]::Matches($pressHtml, 'class="media-gallery__item"').Count) 6 "Press gallery item count: $pressPath"
  Assert-Equal ([regex]::Matches($pressHtml, 'src="/press/assets/(?:mushhero|mushdash)/[^"]+\.jpg"').Count) 8 "Press local screenshot count: $pressPath"
  Assert-Equal ([regex]::Matches($pressHtml, 'press-recent|press-recent-title|class="news-card"').Count) 0 "Removed Press recent coverage UI: $pressPath"
}

Assert-Equal ([regex]::Matches($indexHtml, '<img[^>]+data-hero-slide').Count) 3 'Home Hero slide count'
Assert-Equal ([regex]::Matches($indexHtml, '<button[^>]+data-hero-dot').Count) 3 'Home Hero pagination count'
Assert-Equal ([regex]::Matches($indexHtml, '<button[^>]+data-hero-playback').Count) 1 'Home Hero playback control count'
Assert-Equal ([regex]::Matches($indexHtml, 'loading="eager" decoding="async" fetchpriority="high"').Count -ge 1) $true 'Home Hero eager image'
$homeMushHeroShowcase = [regex]::Match($indexHtml, '(?s)<section[^>]+data-home-game-showcase="mushhero".*?</section>').Value
$homeMushDashShowcase = [regex]::Match($indexHtml, '(?s)<section[^>]+data-home-game-showcase="mushdash".*?</section>').Value
Assert-Equal ([bool]$homeMushHeroShowcase) $true 'Home MushHero showcase'
Assert-Equal ([bool]$homeMushDashShowcase) $true 'Home Mush Dash showcase'
Assert-Equal ([regex]::Matches($homeMushHeroShowcase, 'data-home-game-image').Count) 2 'Home MushHero showcase image count'
Assert-Equal ([regex]::Matches($homeMushDashShowcase, 'data-home-game-image').Count) 2 'Home Mush Dash showcase image count'
Assert-Equal ([regex]::Matches($homeMushHeroShowcase + $homeMushDashShowcase, 'src="/press/assets/(?:mushhero|mushdash)/[^"]+\.jpg"').Count) 4 'Home local showcase image count'
Assert-Equal ([regex]::Matches($indexHtml, '/home/assets/(?:mushhero|mushdash)-\d{2}-640\.webp 640w, /home/assets/(?:mushhero|mushdash)-\d{2}-1280\.webp 1280w').Count) 7 'Home responsive image source-set count'
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

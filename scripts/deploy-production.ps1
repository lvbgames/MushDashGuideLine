[CmdletBinding()]
param(
  [switch]$ConfirmProduction,
  [string]$CommitMessage = 'feat: launch new Lv.B website'
)

$ErrorActionPreference = 'Stop'
Set-StrictMode -Version Latest

if (-not $ConfirmProduction) {
  throw 'Production deployment is blocked. Re-run with -ConfirmProduction.'
}
if ([string]::IsNullOrWhiteSpace($CommitMessage)) {
  throw 'CommitMessage must not be empty.'
}

$expectedRoot = 'E:\Codex\LvB\Homepage'
$expectedBranch = 'main'
$expectedOrigin = 'https://github.com/lvbgames/MushDashGuideLine'
$repoRoot = [System.IO.Path]::GetFullPath((Join-Path $PSScriptRoot '..'))
$prepareScript = Join-Path $PSScriptRoot 'prepare-production.ps1'

function Get-GitText {
  param([Parameter(Mandatory = $true)][string[]]$ArgumentList)

  Push-Location $repoRoot
  try {
    $output = & git @ArgumentList
    if ($LASTEXITCODE -ne 0) { throw "git exited with code $LASTEXITCODE." }
    return (($output | Out-String).Trim())
  }
  finally {
    Pop-Location
  }
}

function Invoke-GitChecked {
  param([Parameter(Mandatory = $true)][string[]]$ArgumentList)

  Push-Location $repoRoot
  try {
    & git @ArgumentList
    if ($LASTEXITCODE -ne 0) { throw "git exited with code $LASTEXITCODE." }
  }
  finally {
    Pop-Location
  }
}

function Clear-ProductionStage {
  $staged = Get-GitText @('diff', '--cached', '--name-only')
  if ($staged) {
    Invoke-GitChecked @('restore', '--staged', '--', '.')
  }
}

$initialStagedFiles = Get-GitText @('diff', '--cached', '--name-only')
if ($initialStagedFiles) {
  throw "Production deployment requires an empty stage before validation:`n$initialStagedFiles"
}

& powershell.exe -NoProfile -ExecutionPolicy Bypass -File $prepareScript
if ($LASTEXITCODE -ne 0) {
  throw 'prepare-production.ps1 failed. Commit and push were not attempted.'
}

$gitTopLevel = [System.IO.Path]::GetFullPath((Get-GitText @('rev-parse', '--show-toplevel')))
$branch = Get-GitText @('branch', '--show-current')
$origin = Get-GitText @('remote', 'get-url', 'origin')
if ($gitTopLevel -ne $expectedRoot) { throw "Unexpected Git top-level: $gitTopLevel" }
if ($branch -ne $expectedBranch) { throw "Unexpected branch: $branch" }
if ($origin -ne $expectedOrigin) { throw "Unexpected origin: $origin" }

Invoke-GitChecked @('fetch', 'origin')
$originMain = Get-GitText @('rev-parse', 'origin/main')
$mergeBase = Get-GitText @('merge-base', 'main', 'origin/main')
$behind = [int](Get-GitText @('rev-list', '--count', 'main..origin/main'))
if ($behind -ne 0 -or $mergeBase -ne $originMain) {
  throw 'origin/main contains commits not present locally or the branches diverged. Deployment stopped without pull, merge, rebase, reset or force push.'
}

$preDeployHead = Get-GitText @('rev-parse', 'HEAD')
$stagingStarted = $false
try {
  $stagingStarted = $true
  Invoke-GitChecked @('add', '-A', '--', '.')

  $stagedFilesText = Get-GitText @('diff', '--cached', '--name-only', '--diff-filter=ACDMRTUXB')
  if (-not $stagedFilesText) {
    throw 'No deployable changes are staged. Commit and push were not attempted.'
  }
  $stagedFiles = @($stagedFilesText -split "`r?`n" | Where-Object { $_ })

  $forbiddenStagedPattern = '^(references/(?:lvb|LvbResult|reviews)/|site/(?:node_modules|dist)/|analytics/(?:node_modules|\.wrangler|\.dev\.vars(?:\.|$)|\.wrangler-qa-.+\.jsonc$)/|\.tmp-verification/|\.codex/.+\.log$|\.codex/.+qa-runtime(?:/|$)|(?:.+/)?(?:lighthouse[^/]*|temp|tmp)(?:/|$)|.+\.log$)'
  $forbiddenStaged = @($stagedFiles | Where-Object { $_ -match $forbiddenStagedPattern })
  if ($forbiddenStaged.Count -gt 0) {
    throw "Production staging contains forbidden reference or generated files. All staged changes will be removed; the working tree is preserved:`n$($forbiddenStaged -join "`n")"
  }

  $secretFilePattern = '(^|/)\.env($|\.)|(^|/)\.npmrc$|(^|/)(id_rsa|id_ed25519)$|\.(pem|key|p12|pfx)$'
  $secretFiles = @($stagedFiles | Where-Object { $_ -match $secretFilePattern })
  if ($secretFiles.Count -gt 0) {
    throw "Potential secret files are staged: $($secretFiles -join ', ')"
  }

  $stagedDiff = Get-GitText @('diff', '--cached', '--no-ext-diff', '--unified=0', '--', '.')
  $stagedAddedText = @(
    $stagedDiff -split "`r?`n" |
      Where-Object { $_ -match '^\+(?!\+\+\+)' } |
      ForEach-Object { $_.Substring(1) }
  ) -join "`n"
  $placeholder = '(?:<[^>]+>|YOUR_[A-Z0-9_]+|example(?:[-_][A-Z0-9_-]+)?|redacted|placeholder|local-(?:qa-)?[A-Z0-9_-]+|test(?:[-_][A-Z0-9_-]+)?|\$\{[A-Z0-9_]+\})'
  $secretAssignmentPattern = ('(?i)(?:ANALYTICS_HASH_SECRET|ANALYTICS_ADMIN_PASSWORD(?:_HASH|_SALT|_INPUT)?|CLOUDFLARE_API_TOKEN|CF_API_TOKEN|CF_API_KEY|NETLIFY_AUTH_TOKEN|NPM_TOKEN|NODE_AUTH_TOKEN|github_token|client_secret|private_key|api[_-]?secret)\s*[:=]\s*["'']?(?!{0})[A-Za-z0-9_./+=:-]{{12,}}' -f $placeholder)
  $npmAuthTokenPattern = ('(?i)(?:^|/):?_authToken\s*=\s*(?!{0})[^\s#;]{{8,}}' -f $placeholder)
  $bearerPattern = ('(?i)Authorization\s*:\s*Bearer\s+(?!{0})[A-Za-z0-9._~+/-]{{12,}}' -f $placeholder)
  $secretPatterns = @(
    'gh[pousr]_[A-Za-z0-9]{30,}',
    'github_pat_[A-Za-z0-9_]{20,}',
    'ntl_[A-Za-z0-9]{20,}',
    'npm_[A-Za-z0-9]{30,}',
    '-----BEGIN (?:RSA |OPENSSH |EC |DSA )?PRIVATE KEY-----',
    $secretAssignmentPattern,
    $npmAuthTokenPattern,
    $bearerPattern
  )
  foreach ($pattern in $secretPatterns) {
    if ($stagedAddedText -match $pattern) {
      throw "Potential secret material matched the staged added-lines pattern: $pattern"
    }
  }

  Write-Host 'Files staged for the production commit:'
  $stagedFiles | ForEach-Object { Write-Host "  $_" }

  Invoke-GitChecked @('commit', '-m', $CommitMessage)
  $commitSha = Get-GitText @('rev-parse', 'HEAD')
  Invoke-GitChecked @('push', 'origin', 'main')
}
catch {
  if ($stagingStarted) {
    try {
      Clear-ProductionStage
    }
    catch {
      Write-Warning "Failed to clear the production stage after an error: $($_.Exception.Message)"
    }
  }
  throw
}

Write-Host ''
Write-Host 'Production Git deployment completed.' -ForegroundColor Green
Write-Host "preDeployHead: $preDeployHead"
Write-Host "commitSha: $commitSha"
Write-Host 'push: origin/main'
Write-Host 'force push: not used'

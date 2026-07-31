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
Invoke-GitChecked @('add', '-A', '--', '.')

$stagedFilesText = Get-GitText @('diff', '--cached', '--name-only', '--diff-filter=ACDMRTUXB')
if (-not $stagedFilesText) {
  throw 'No deployable changes are staged. Commit and push were not attempted.'
}
$stagedFiles = @($stagedFilesText -split "`r?`n" | Where-Object { $_ })

$excludedPattern = '^(site/(node_modules|dist)/|references/reviews/|\.codex/.+\.log$|\.codex/.+qa-runtime|.+\.log$)'
$excludedStaged = @($stagedFiles | Where-Object { $_ -match $excludedPattern })
if ($excludedStaged.Count -gt 0) {
  foreach ($path in $excludedStaged) {
    Invoke-GitChecked @('restore', '--staged', '--', $path)
  }
  throw "Excluded generated files were staged and have been removed from the index: $($excludedStaged -join ', '). Review before retrying."
}

$secretFilePattern = '(^|/)\.env($|\.)|(^|/)(id_rsa|id_ed25519)$|\.(pem|key|p12|pfx)$'
$secretFiles = @($stagedFiles | Where-Object { $_ -match $secretFilePattern })
if ($secretFiles.Count -gt 0) {
  throw "Potential secret files are staged: $($secretFiles -join ', ')"
}

$stagedDiff = Get-GitText @('diff', '--cached', '--no-ext-diff', '--unified=0', '--', '.')
$secretPatterns = @(
  'gh[pousr]_[A-Za-z0-9]{30,}',
  'github_pat_[A-Za-z0-9_]{20,}',
  'ntl_[A-Za-z0-9]{20,}',
  '-----BEGIN (?:RSA |OPENSSH |EC |DSA )?PRIVATE KEY-----',
  '(?i)(github_token|netlify_auth_token|client_secret|private_key|api[_-]?secret)\s*[:=]\s*["''][^"'']{12,}["'']'
)
foreach ($pattern in $secretPatterns) {
  if ($stagedDiff -match $pattern) {
    throw "Potential secret material matched the staged diff pattern: $pattern"
  }
}

Write-Host 'Files staged for the production commit:'
$stagedFiles | ForEach-Object { Write-Host "  $_" }

Invoke-GitChecked @('commit', '-m', $CommitMessage)
$commitSha = Get-GitText @('rev-parse', 'HEAD')
Invoke-GitChecked @('push', 'origin', 'main')

Write-Host ''
Write-Host 'Production Git deployment completed.' -ForegroundColor Green
Write-Host "preDeployHead: $preDeployHead"
Write-Host "commitSha: $commitSha"
Write-Host 'push: origin/main'
Write-Host 'force push: not used'

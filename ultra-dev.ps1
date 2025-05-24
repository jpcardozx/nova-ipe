# Nova-IPE Performance Development Environment
# This script configures an optimized development environment
# that significantly improves dev server startup and refresh times

# Console colors for better readability
$Green = @{ ForegroundColor = 'Green' }
$Yellow = @{ ForegroundColor = 'Yellow' }
$Cyan = @{ ForegroundColor = 'Cyan' }
$Red = @{ ForegroundColor = 'Red' }

Write-Host "🚀 Nova-IPE High Performance Development Environment" @Cyan
Write-Host

# Function to optimize the development environment
function Optimize-DevEnvironment {
    # Create temporary turbo.json if it doesn't exist
    $turboPath = Join-Path $PSScriptRoot "turbo.json"
    if (-not (Test-Path $turboPath)) {
        Write-Host "📝 Creating optimized Turbo configuration..." @Yellow
        $turboConfig = @"
{
  "pipeline": {
    "dev": {
      "cache": false,
      "persistent": true
    }
  }
}
"@
        Set-Content -Path $turboPath -Value $turboConfig -Force
        Write-Host "✓ Turbo configuration created" @Green
    }

    # Check if Next.js cache exists and is old
    $nextCachePath = Join-Path $PSScriptRoot ".next" "cache"
    if (Test-Path $nextCachePath) {
        $cacheAge = (Get-Date) - (Get-Item $nextCachePath).LastWriteTime
        if ($cacheAge.TotalDays -gt 7) {
            Write-Host "🧹 Next.js cache is older than 7 days. Cleaning..." @Yellow
            Remove-Item -Path (Join-Path $PSScriptRoot ".next" "cache") -Recurse -Force
            Write-Host "✓ Cache cleaned" @Green
        }
    }
}

function Stop-RunningDevServers {
    Write-Host "🔍 Checking for already running Next.js dev servers..." @Yellow
    
    # Find and kill any existing Next.js development servers
    $nextProcesses = Get-Process | Where-Object { $_.ProcessName -eq "node" -and $_.CommandLine -match "next dev" }
    
    if ($nextProcesses.Count -gt 0) {
        Write-Host "🛑 Found running Next.js processes. Stopping..." @Red
        foreach ($process in $nextProcesses) {
            try {
                Stop-Process -Id $process.Id -Force
                Write-Host "  ✓ Stopped process $($process.Id)" @Green
            }
            catch {
                Write-Host "  ✗ Failed to stop process $($process.Id): $_" @Red
            }
        }
    }
    else {
        Write-Host "✓ No running Next.js servers found" @Green
    }
}

# Set performance-focused environment variables
$env:NEXT_TELEMETRY_DISABLED = "1"
$env:FAST_DEV = "true"
$env:NODE_OPTIONS = "--max-old-space-size=4096 --no-warnings"
$env:NEXT_DISABLE_SOURCEMAPS = "true"
$env:NEXT_PUBLIC_ENABLE_WEB_VITALS = "false"
$env:ANALYZE_BUNDLE = "false"

Write-Host "⚙️ Environment configured for high performance:" @Cyan
Write-Host "  • Memory limit increased to 4GB"
Write-Host "  • Source maps disabled"
Write-Host "  • Web Vitals reporting disabled"
Write-Host "  • Fast dev mode enabled"
Write-Host "  • TypeScript checking disabled during development"
Write-Host

# Stop any running dev servers first
Stop-RunningDevServers

# Run optimization routines
Optimize-DevEnvironment

Write-Host "🚀 Starting optimized development server..." @Cyan
Write-Host

# Run Next.js with turbo mode
npm run dev -- --turbo

# Cleanup on exit
if (Test-Path (Join-Path $PSScriptRoot "turbo.json.temp")) {
    Remove-Item -Path (Join-Path $PSScriptRoot "turbo.json.temp") -Force
}

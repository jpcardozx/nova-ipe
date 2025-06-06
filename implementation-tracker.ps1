# Nova IPE - Implementation Tracker
# ===================================

$ErrorActionPreference = "Stop"
$ProgressPreference = "Continue"

# Colors for output
$Red = [System.ConsoleColor]::Red
$Green = [System.ConsoleColor]::Green
$Yellow = [System.ConsoleColor]::Yellow
$Cyan = [System.ConsoleColor]::Cyan
$White = [System.ConsoleColor]::White

function Write-ColorText {
    param($Text, $Color)
    Write-Host $Text -ForegroundColor $Color
}

function Show-Header {
    Clear-Host
    Write-ColorText "🚀 NOVA IPE - TECHNICAL ARCHITECTURE IMPLEMENTATION" $Cyan
    Write-ColorText "=================================================" $Cyan
    Write-ColorText "TAR Document: TECHNICAL_ARCHITECTURE_RECORD.md" $White
    Write-ColorText "Date: $(Get-Date -Format 'yyyy-MM-dd HH:mm')" $White
    Write-ColorText "" $White
}

function Test-Prerequisites {
    Write-ColorText "🔍 Checking Prerequisites..." $Yellow
    
    # Check if we're in the right directory
    if (-not (Test-Path "next.config.js")) {
        Write-ColorText "❌ Error: Not in Nova IPE project directory" $Red
        exit 1
    }
    
    # Check Node.js version
    try {
        $nodeVersion = node --version
        Write-ColorText "✅ Node.js: $nodeVersion" $Green
    } catch {
        Write-ColorText "❌ Error: Node.js not found" $Red
        exit 1
    }
    
    # Check if pnpm is installed
    try {
        $pnpmVersion = pnpm --version
        Write-ColorText "✅ pnpm: $pnpmVersion" $Green
    } catch {
        Write-ColorText "⚠️ pnpm not installed - will install during migration" $Yellow
    }
    
    Write-ColorText "" $White
}

function Show-CurrentMetrics {
    Write-ColorText "📊 CURRENT PROJECT METRICS" $Yellow
    Write-ColorText "=========================" $Yellow
    
    # Bundle size analysis
    if (Test-Path ".next") {
        $nextSize = (Get-ChildItem .next -Recurse | Measure-Object -Property Length -Sum).Sum / 1MB
        Write-ColorText "📦 .next directory: $([math]::Round($nextSize, 2)) MB" $White
    } else {
        Write-ColorText "📦 .next directory: Not built yet" $White
    }
    
    # Node modules size
    if (Test-Path "node_modules") {
        $nodeModulesSize = (Get-ChildItem node_modules -Recurse -ErrorAction SilentlyContinue | Measure-Object -Property Length -Sum).Sum / 1MB
        Write-ColorText "📁 node_modules: $([math]::Round($nodeModulesSize, 2)) MB" $White
    } else {
        Write-ColorText "📁 node_modules: Not installed" $White
    }
    
    # Dependencies count
    if (Test-Path "package.json") {
        $packageJson = Get-Content "package.json" | ConvertFrom-Json
        $depsCount = ($packageJson.dependencies | Get-Member -MemberType NoteProperty).Count
        $devDepsCount = ($packageJson.devDependencies | Get-Member -MemberType NoteProperty).Count
        $totalDeps = $depsCount + $devDepsCount
        Write-ColorText "📋 Dependencies: $totalDeps total ($depsCount prod + $devDepsCount dev)" $White
    }
    
    # Config complexity
    if (Test-Path "next.config.js") {
        $configLines = (Get-Content "next.config.js").Count
        Write-ColorText "⚙️ next.config.js: $configLines lines" $White
    }
    
    Write-ColorText "" $White
}

function Show-ImplementationMenu {
    Write-ColorText "🎯 IMPLEMENTATION OPTIONS" $Yellow
    Write-ColorText "========================" $Yellow
    Write-ColorText "1. 📦 Phase 1: Package Manager Migration (pnpm)" $White
    Write-ColorText "2. ⚙️ Phase 1: Next.js Configuration Cleanup" $White
    Write-ColorText "3. 🧹 Phase 1: Dependency Audit & Cleanup" $White
    Write-ColorText "4. 🏗️ Phase 2: Component Architecture Standardization" $White
    Write-ColorText "5. 🎨 Phase 2: Styling Cleanup" $White
    Write-ColorText "6. ⚡ Phase 3: Performance Optimization" $White
    Write-ColorText "7. 📊 Phase 3: Monitoring Setup" $White
    Write-ColorText "8. 🚀 FULL MIGRATION (All phases)" $White
    Write-ColorText "9. 📋 Show Current Status" $White
    Write-ColorText "10. 📚 Update TAR Document" $White
    Write-ColorText "0. ❌ Exit" $White
    Write-ColorText "" $White
}

function Update-TARDocument {
    param($Phase, $Status, $Notes = "")
    
    $tarFile = "TECHNICAL_ARCHITECTURE_RECORD.md"
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm"
    
    # Add implementation log entry
    $logEntry = @"

### **Implementation Log - $timestamp**
**Phase:** $Phase  
**Status:** $Status  
**Notes:** $Notes  

"@
    
    Add-Content -Path $tarFile -Value $logEntry
    Write-ColorText "✅ TAR document updated" $Green
}

function Invoke-PackageManagerMigration {
    Write-ColorText "📦 PHASE 1: Package Manager Migration" $Cyan
    Write-ColorText "=====================================" $Cyan
    
    try {
        # Install pnpm if not available
        if (-not (Get-Command pnpm -ErrorAction SilentlyContinue)) {
            Write-ColorText "⬇️ Installing pnpm..." $Yellow
            npm install -g pnpm
        }
        
        # Backup current state
        Write-ColorText "🔄 Creating backups..." $Yellow
        if (Test-Path "package.json") {
            Copy-Item "package.json" "package.json.backup.$(Get-Date -Format 'yyyyMMdd')"
        }
        if (Test-Path "package-lock.json") {
            Copy-Item "package-lock.json" "package-lock.json.backup.$(Get-Date -Format 'yyyyMMdd')"
        }
        
        # Clean npm artifacts
        Write-ColorText "🧹 Cleaning npm artifacts..." $Yellow
        if (Test-Path "node_modules") {
            Remove-Item "node_modules" -Recurse -Force
        }
        if (Test-Path "package-lock.json") {
            Remove-Item "package-lock.json" -Force
        }
        
        # Create pnpm configuration
        Write-ColorText "⚙️ Configuring pnpm..." $Yellow
        @"
auto-install-peers=true
strict-peer-dependencies=false
shamefully-hoist=false
shared-workspace-lockfile=true
prefer-workspace-packages=true
save-exact=true
"@ | Out-File -FilePath ".npmrc" -Encoding UTF8
        
        # Install dependencies with pnpm
        Write-ColorText "📦 Installing dependencies with pnpm..." $Yellow
        pnpm install
        
        Write-ColorText "✅ Package manager migration completed!" $Green
        Update-TARDocument "Package Manager Migration" "COMPLETED" "Successfully migrated from npm to pnpm"
        
    } catch {
        Write-ColorText "❌ Error during package manager migration: $($_.Exception.Message)" $Red
        Update-TARDocument "Package Manager Migration" "FAILED" $_.Exception.Message
    }
    
    Write-ColorText "Press any key to continue..." $White
    $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
}

function Invoke-NextConfigCleanup {
    Write-ColorText "⚙️ PHASE 1: Next.js Configuration Cleanup" $Cyan
    Write-ColorText "=========================================" $Cyan
    
    try {
        # Backup current config
        Write-ColorText "🔄 Backing up current next.config.js..." $Yellow
        Copy-Item "next.config.js" "next.config.js.backup.$(Get-Date -Format 'yyyyMMdd')"
        
        # Apply enterprise config
        Write-ColorText "⚡ Applying enterprise configuration..." $Yellow
        
        $enterpriseConfig = @'
/** @type {import('next').NextConfig} */

// Critical: SSR polyfill maintained (necessary for Sanity)
if (typeof globalThis !== 'undefined' && typeof globalThis.self === 'undefined') {
  globalThis.self = globalThis;
}

const nextConfig = {
  // Core settings
  reactStrictMode: true,
  swcMinify: true,
  
  // Performance optimizations
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
    styledComponents: true,
  },
  
  // Essential experimental features only
  experimental: {
    serverComponentsExternalPackages: ['@sanity/client', 'sharp'],
    optimizePackageImports: [
      'lucide-react', 
      'framer-motion'
    ],
  },

  // Optimized images
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
      },
    ],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  
  // Minimal webpack config (only essentials)
  webpack: (config, { isServer }) => {
    // SSR polyfills only
    if (isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }
    
    return config;
  },
};

module.exports = nextConfig;
'@
        
        $enterpriseConfig | Out-File -FilePath "next.config.js" -Encoding UTF8
        
        # Test the new configuration
        Write-ColorText "🔨 Testing new configuration..." $Yellow
        $buildResult = & npm run build 2>&1
        
        if ($LASTEXITCODE -eq 0) {
            Write-ColorText "✅ Next.js configuration cleanup completed!" $Green
            $oldLines = (Get-Content "next.config.js.backup.$(Get-Date -Format 'yyyyMMdd')").Count
            $newLines = (Get-Content "next.config.js").Count
            $reduction = [math]::Round((($oldLines - $newLines) / $oldLines) * 100, 1)
            Update-TARDocument "Next.js Config Cleanup" "COMPLETED" "Reduced from $oldLines to $newLines lines ($reduction% reduction)"
        } else {
            Write-ColorText "❌ Build failed with new configuration" $Red
            Copy-Item "next.config.js.backup.$(Get-Date -Format 'yyyyMMdd')" "next.config.js"
            Update-TARDocument "Next.js Config Cleanup" "FAILED" "Build failed, reverted to backup"
        }
        
    } catch {
        Write-ColorText "❌ Error during Next.js config cleanup: $($_.Exception.Message)" $Red
        Update-TARDocument "Next.js Config Cleanup" "FAILED" $_.Exception.Message
    }
    
    Write-ColorText "Press any key to continue..." $White
    $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
}

function Show-CurrentStatus {
    Write-ColorText "📋 CURRENT IMPLEMENTATION STATUS" $Cyan
    Write-ColorText "================================" $Cyan
    
    # Check TAR document for completed phases
    if (Test-Path "TECHNICAL_ARCHITECTURE_RECORD.md") {
        $tarContent = Get-Content "TECHNICAL_ARCHITECTURE_RECORD.md" -Raw
        
        # Check each phase
        $phases = @(
            "Package Manager Migration",
            "Next.js Config Cleanup", 
            "Dependency Audit",
            "Component Standardization",
            "Styling Cleanup",
            "Performance Optimization",
            "Monitoring Setup"
        )
        
        foreach ($phase in $phases) {
            if ($tarContent -match "$phase.*COMPLETED") {
                Write-ColorText "✅ $phase" $Green
            } elseif ($tarContent -match "$phase.*FAILED") {
                Write-ColorText "❌ $phase" $Red
            } elseif ($tarContent -match "$phase.*IN_PROGRESS") {
                Write-ColorText "🔄 $phase" $Yellow
            } else {
                Write-ColorText "⏳ $phase - Pending" $White
            }
        }
    }
    
    Write-ColorText "" $White
    Write-ColorText "📊 Current Metrics:" $Yellow
    Show-CurrentMetrics
    
    Write-ColorText "Press any key to continue..." $White
    $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
}

# Main execution
function Start-ImplementationTracker {
    do {
        Show-Header
        Test-Prerequisites
        Show-CurrentMetrics
        Show-ImplementationMenu
        
        $choice = Read-Host "Select option (0-10)"
        
        switch ($choice) {
            "1" { Invoke-PackageManagerMigration }
            "2" { Invoke-NextConfigCleanup }
            "3" { Write-ColorText "🧹 Dependency Audit - Coming soon..." $Yellow; pause }
            "4" { Write-ColorText "🏗️ Component Standardization - Coming soon..." $Yellow; pause }
            "5" { Write-ColorText "🎨 Styling Cleanup - Coming soon..." $Yellow; pause }
            "6" { Write-ColorText "⚡ Performance Optimization - Coming soon..." $Yellow; pause }
            "7" { Write-ColorText "📊 Monitoring Setup - Coming soon..." $Yellow; pause }
            "8" { Write-ColorText "🚀 Full Migration - Coming soon..." $Yellow; pause }
            "9" { Show-CurrentStatus }
            "10" { 
                Write-ColorText "📚 Opening TAR document..." $Yellow
                Start-Process "TECHNICAL_ARCHITECTURE_RECORD.md"
            }
            "0" { 
                Write-ColorText "👋 Goodbye!" $Green
                break
            }
            default { 
                Write-ColorText "❌ Invalid option. Please select 0-10." $Red
                Start-Sleep -Seconds 2
            }
        }
    } while ($choice -ne "0")
}

# Start the application
Start-ImplementationTracker

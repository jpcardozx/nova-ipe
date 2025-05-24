@echo off
REM Fast Development Starter Script
REM This script runs Next.js in fast development mode

echo Starting Next.js in fast development mode...
set FAST_DEV=true

REM Disable unnecessary features for faster development
set NEXT_TELEMETRY_DISABLED=1
set NEXT_DISABLE_SOURCEMAPS=true
set NEXT_MINIMAL_LOGGING=1

REM Fix placeholder image issue
echo Ensuring placeholder images exist...
node scripts\create-simple-placeholder.js

REM Run Next.js with the turbo option
call pnpm run dev:turbo

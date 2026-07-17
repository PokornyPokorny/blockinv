@echo off
setlocal
title Blockinv Down - git pull
cd /d "%~dp0.."

REM ============================================================
REM  Blockinv-Down: bring local up to date with the remote mainline.
REM  --ff-only means it will REFUSE to auto-create a messy merge
REM  commit; if local has drifted it stops and tells you, instead
REM  of silently merging (which is how conflict markers used to
REM  land in notes). Push your local work via Blockinv-Up first.
REM ============================================================

set "BASE="
for /f "delims=" %%b in ('git rev-parse --abbrev-ref HEAD') do set "BASE=%%b"
if not defined BASE (
    echo ERROR: could not determine the current git branch.
    pause
    exit /b 1
)

git pull --ff-only origin %BASE%
if errorlevel 1 (
    echo.
    echo ***** PULL DID NOT FAST-FORWARD *****
    echo Your local %BASE% has drifted from origin ^(local commits or a conflict^).
    echo Nothing was merged. Push your local work with Blockinv-Up ^(it opens a PR^),
    echo then pull again.
)

echo.
echo Done. Press any key to close.
pause >nul

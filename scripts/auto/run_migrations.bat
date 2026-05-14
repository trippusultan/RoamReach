@echo off
REM Run Supabase migrations on Windows PowerShell / CMD
REM Usage: scripts\auto\run-migrations.bat 002_incremental_additions.sql

setlocal enabledelayedexpansion

REM Get project root (two levels up from this script)
for %%I in ("%~dp0..\..") do set "ROOT=%%~fI"

REM Load .env variables
if exist "%ROOT%\.env" (
    for /f "tokens=1,2 delims==" %%A in ('findstr /v "^#" "%ROOT%\.env"') do (
        set "%%A=%%B"
    )
)

set "URL=!EXPO_PUBLIC_SUPABASE_URL!"
set "KEY=!EXPO_PUBLIC_SUPABASE_ANON_KEY!"

if "!URL!"=="" (
    echo ERROR: EXPO_PUBLIC_SUPABASE_URL not set in .env
    exit /b 1
)
if "!KEY!"=="" (
    echo ERROR: EXPO_PUBLIC_SUPABASE_ANON_KEY not set in .env
    exit /b 1
)

REM Extract project ref from URL (last path segment)
for %%F in ("!URL!") do set "PROJECT_REF=%%~nF"

set "MIGRATION=%~1"
if "%MIGRATION%"=="" (
    echo Usage: run-migrations.bat [all^|002_incremental_additions.sql]
    echo Example: run-migrations.bat all
    echo          run-migrations.bat 002_incremental_additions.sql
    exit /b 1
)

if "%MIGRATION%"=="all" (
    echo Running all migrations in supabase\migrations\...
    for %%F in ("%ROOT%\supabase\migrations\*.sql") do (
        call :RUN "%%F"
    )
) else (
    call :RUN "%ROOT%\supabase\migrations\%MIGRATION%"
)
exit /b 0

:RUN
echo.
echo Applying: %~1
npx supabase db query --file "%~1" --project-ref %PROJECT_REF%
if errorlevel 1 (
    echo [ERROR] Migration failed
    exit /b 1
)
echo [OK] Applied
exit /b 0

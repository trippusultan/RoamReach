@echo off
setlocal enabledelayedexpansion

set SCRIPT_DIR=%~dp0

for /f "usebackq tokens=1,2 delims==" %%a in ("%SCRIPT_DIR%\.env") do (
  set "key=%%a"
  set "val=%%b"
  if not "!key:~0,1!"=="#" if not "!key!"=="" (
    set "%%a=%%b"
  )
)

echo env: load .env
echo env: export SUPPORTED_VARS
echo.

call npx expo %*

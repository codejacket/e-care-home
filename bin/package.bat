@echo off
echo.
echo package
echo.

%~d0
cd %~dp0

cd ..
pnpm build

pause

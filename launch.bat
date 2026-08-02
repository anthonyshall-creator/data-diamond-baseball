@echo off
title Data Diamond Baseball
cd /d "%~dp0"
echo Starting Data Diamond Baseball dev server...
call npm run dev -- --open
pause

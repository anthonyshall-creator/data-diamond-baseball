@echo off
title Baseball Sim
cd /d "%~dp0"
echo Starting Baseball Sim dev server...
call npm run dev -- --open
pause

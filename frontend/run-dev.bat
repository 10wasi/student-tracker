@echo off
set "PATH=C:\Program Files\nodejs;%PATH%"
cd /d "%~dp0"
echo Open http://localhost:5173 in your browser when ready.
npm run dev
pause

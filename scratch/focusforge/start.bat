@echo off
echo.
echo ==========================================
echo   FocusForge - Starting...
echo ==========================================
echo.

:: Check Python
python --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Python not found!
    echo Please install Python 3.8+ from https://python.org
    echo Make sure to check "Add Python to PATH" during install.
    pause
    exit /b 1
)

:: Install deps if needed
echo Checking dependencies...
pip install -q -r requirements.txt

echo.
echo Starting FocusForge on http://localhost:5000
echo Press Ctrl+C to stop.
echo.
python app.py
pause

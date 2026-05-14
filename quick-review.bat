@echo off
REM Quick Review Script - Start Expo Development Server for Instant Review
REM This script starts the Expo development server so you can scan a QR code
REM and instantly review the app on your phone using Expo Go

echo ========================================
echo 🚀 GameForge Mobile - Quick Review Setup
echo ========================================
echo.

REM Check if node_modules exists
if not exist "node_modules\" (
    echo 📦 Installing dependencies...
    call npm install
    echo.
)

echo ✅ Starting Expo development server...
echo.
echo 📱 Next steps:
echo    1. Install 'Expo Go' app on your phone:
echo       - iOS: https://apps.apple.com/app/expo-go/id982107779
echo       - Android: https://play.google.com/store/apps/details?id=host.exp.exponent
echo.
echo    2. Scan the QR code that appears below with Expo Go
echo.
echo    3. The app will load on your phone instantly!
echo.
echo 🔄 Any changes you make will hot-reload automatically
echo.
echo ========================================
echo.

REM Start Expo with tunnel mode for better connectivity
call npx expo start --tunnel

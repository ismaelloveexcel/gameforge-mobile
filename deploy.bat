@echo off
REM GameForge Mobile - One-Click Deployment Script for Windows
REM This script automates deployment for non-technical users

setlocal enabledelayedexpansion

echo.
echo ╔═══════════════════════════════════════════════════════════╗
echo ║   🎮 GameForge Mobile - One-Click Deployment  🚀          ║
echo ╚═══════════════════════════════════════════════════════════╝
echo.

REM Check if configuration exists
set CONFIG_FILE=.deployment-config

if not exist "%CONFIG_FILE%" (
    echo [INFO] First-time setup detected. Running configuration wizard...
    echo.
    
    REM Ask user what they want to deploy
    echo What would you like to deploy?
    echo 1^) Web version ^(fastest, free^)
    echo 2^) Android app ^(free, takes longer^)
    echo 3^) Both web and Android
    echo.
    set /p DEPLOY_CHOICE="Choose option (1-3): "
    
    REM Save configuration
    echo DEPLOY_CHOICE=!DEPLOY_CHOICE!> "%CONFIG_FILE%"
    
    REM Check required tools
    echo [INFO] Checking required tools...
    
    where node >nul 2>&1
    if %ERRORLEVEL% NEQ 0 (
        echo [ERROR] Node.js is not installed. Please install from https://nodejs.org/
        pause
        exit /b 1
    )
    echo [OK] Node.js is installed
    
    where npm >nul 2>&1
    if %ERRORLEVEL% NEQ 0 (
        echo [ERROR] npm is not installed. Please install npm
        pause
        exit /b 1
    )
    echo [OK] npm is installed
    
    REM Check deployment tools based on choice
    if "!DEPLOY_CHOICE!"=="1" (
        where vercel >nul 2>&1
        if !ERRORLEVEL! NEQ 0 (
            echo [INFO] Installing Vercel CLI...
            call npm install -g vercel
        )
        echo [OK] Vercel CLI is ready
    )
    
    if "!DEPLOY_CHOICE!"=="2" (
        where eas >nul 2>&1
        if !ERRORLEVEL! NEQ 0 (
            echo [INFO] Installing EAS CLI...
            call npm install -g eas-cli
        )
        echo [OK] EAS CLI is ready
    )
    
    if "!DEPLOY_CHOICE!"=="3" (
        where vercel >nul 2>&1
        if !ERRORLEVEL! NEQ 0 (
            echo [INFO] Installing Vercel CLI...
            call npm install -g vercel
        )
        echo [OK] Vercel CLI is ready
        
        where eas >nul 2>&1
        if !ERRORLEVEL! NEQ 0 (
            echo [INFO] Installing EAS CLI...
            call npm install -g eas-cli
        )
        echo [OK] EAS CLI is ready
    )
    
    echo [OK] Configuration complete!
    echo.
) else (
    REM Load existing configuration
    for /f "tokens=2 delims==" %%a in ('type "%CONFIG_FILE%"') do set DEPLOY_CHOICE=%%a
    echo [INFO] Using saved configuration
    echo.
)

REM Install dependencies if needed
if not exist "node_modules\" (
    echo [INFO] Installing dependencies...
    call npm install
    if %ERRORLEVEL% NEQ 0 (
        echo [ERROR] Failed to install dependencies
        pause
        exit /b 1
    )
    echo [OK] Dependencies installed
    echo.
)

REM Execute deployment based on configuration
if "%DEPLOY_CHOICE%"=="1" (
    REM Web deployment
    echo [INFO] Building web application...
    call npm run build:web
    if %ERRORLEVEL% NEQ 0 (
        echo [ERROR] Build failed
        pause
        exit /b 1
    )
    echo [OK] Web build complete
    echo.
    
    echo [INFO] Deploying to Vercel...
    call vercel --prod
    if %ERRORLEVEL% NEQ 0 (
        echo [ERROR] Deployment failed. Please check your Vercel configuration.
        pause
        exit /b 1
    )
    echo [OK] Web deployment successful!
    echo.
    echo [OK] Your app is now live!
    echo.
    echo [INFO] Check your Vercel dashboard for the URL
)

if "%DEPLOY_CHOICE%"=="2" (
    REM Android deployment
    echo [INFO] Building Android app with EAS...
    echo [WARNING] This may take 10-20 minutes...
    echo.
    
    call eas build --platform android --profile production --non-interactive
    if %ERRORLEVEL% NEQ 0 (
        echo [ERROR] Build failed. Please check your EAS configuration.
        pause
        exit /b 1
    )
    echo [OK] Android build started successfully!
    echo.
    echo [INFO] You'll receive an email when the build is complete
    echo [INFO] Or check: https://expo.dev
)

if "%DEPLOY_CHOICE%"=="3" (
    REM Both web and Android
    echo [INFO] Deploying web application first...
    call npm run build:web
    if %ERRORLEVEL% NEQ 0 (
        echo [ERROR] Web build failed
        pause
        exit /b 1
    )
    echo [OK] Web build complete
    echo.
    
    echo [INFO] Deploying to Vercel...
    call vercel --prod
    if %ERRORLEVEL% NEQ 0 (
        echo [ERROR] Web deployment failed
        pause
        exit /b 1
    )
    echo [OK] Web deployment successful!
    echo.
    
    echo [INFO] Starting Android build...
    echo [WARNING] This may take 10-20 minutes...
    echo.
    
    call eas build --platform android --profile production --non-interactive
    if %ERRORLEVEL% NEQ 0 (
        echo [ERROR] Android build failed
        pause
        exit /b 1
    )
    echo [OK] Android build started!
    echo.
    echo [INFO] You'll receive an email when the build is complete
)

echo.
echo ╔═══════════════════════════════════════════════════════════╗
echo ║   ✨ Deployment Complete!  🎉                             ║
echo ╚═══════════════════════════════════════════════════════════╝
echo.
echo [INFO] Next steps:
echo   - For web: Check your Vercel dashboard
echo   - For mobile: Check your email or EAS dashboard
echo.
echo [INFO] To change deployment options, delete .deployment-config and run again
echo.
pause

#!/bin/bash

# Quick Review Script - Start Expo Development Server for Instant Review
# This script starts the Expo development server so you can scan a QR code
# and instantly review the app on your phone using Expo Go

echo "🚀 GameForge Mobile - Quick Review Setup"
echo "=========================================="
echo ""

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
    echo ""
fi

# Check if Expo CLI is available
if ! command -v npx &> /dev/null; then
    echo "❌ npx is not available. Please install Node.js first."
    exit 1
fi

echo "✅ Starting Expo development server..."
echo ""
echo "📱 Next steps:"
echo "   1. Install 'Expo Go' app on your phone:"
echo "      - iOS: https://apps.apple.com/app/expo-go/id982107779"
echo "      - Android: https://play.google.com/store/apps/details?id=host.exp.exponent"
echo ""
echo "   2. Scan the QR code that appears below with Expo Go"
echo ""
echo "   3. The app will load on your phone instantly!"
echo ""
echo "🔄 Any changes you make will hot-reload automatically"
echo ""
echo "=========================================="
echo ""

# Start Expo with tunnel mode for better connectivity
npx expo start --tunnel

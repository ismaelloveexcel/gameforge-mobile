#!/bin/bash

# GameForge Mobile - Deployment Troubleshooting Script
# This script helps diagnose common deployment issues

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo ""
echo "╔═══════════════════════════════════════════════════════════╗"
echo "║   🔍 GameForge Mobile - Deployment Diagnostics           ║"
echo "╚═══════════════════════════════════════════════════════════╝"
echo ""

# Function to check command
check_command() {
    if command -v $1 &> /dev/null; then
        echo -e "${GREEN}✓${NC} $1 is installed ($(command -v $1))"
        if [ ! -z "$2" ]; then
            VERSION=$($1 $2 2>&1 | head -1)
            echo -e "  ${BLUE}Version:${NC} $VERSION"
        fi
        return 0
    else
        echo -e "${RED}✗${NC} $1 is NOT installed"
        return 1
    fi
}

echo "Checking System Requirements..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Check Node.js
check_command "node" "--version"
NODE_INSTALLED=$?
echo ""

# Check npm
check_command "npm" "--version"
NPM_INSTALLED=$?
echo ""

# Check Vercel
check_command "vercel" "--version"
VERCEL_INSTALLED=$?
echo ""

# Check EAS
check_command "eas" "--version"
EAS_INSTALLED=$?
echo ""

# Check git
check_command "git" "--version"
GIT_INSTALLED=$?
echo ""

# Check for node_modules
echo "Checking Project Dependencies..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

if [ -d "node_modules" ]; then
    echo -e "${GREEN}✓${NC} node_modules directory exists"
    SIZE=$(du -sh node_modules 2>/dev/null | cut -f1)
    echo -e "  ${BLUE}Size:${NC} $SIZE"
else
    echo -e "${RED}✗${NC} node_modules directory NOT found"
    echo -e "  ${YELLOW}Run:${NC} npm install"
fi
echo ""

# Check for configuration file
if [ -f ".deployment-config" ]; then
    echo -e "${GREEN}✓${NC} Deployment configuration exists"
    echo -e "  ${BLUE}Contents:${NC}"
    cat .deployment-config | sed 's/^/  /'
else
    echo -e "${YELLOW}ℹ${NC} No deployment configuration (first-time setup needed)"
fi
echo ""

# Check package.json
if [ -f "package.json" ]; then
    echo -e "${GREEN}✓${NC} package.json exists"
else
    echo -e "${RED}✗${NC} package.json NOT found (are you in the right directory?)"
fi
echo ""

# Check internet connectivity
echo "Checking Internet Connectivity..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

if ping -c 1 google.com &> /dev/null; then
    echo -e "${GREEN}✓${NC} Internet connection is working"
else
    echo -e "${RED}✗${NC} No internet connection detected"
fi
echo ""

# Summary and recommendations
echo "Summary & Recommendations"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

ISSUES_FOUND=0

if [ $NODE_INSTALLED -ne 0 ]; then
    echo -e "${RED}⚠${NC} Install Node.js from: https://nodejs.org/"
    ISSUES_FOUND=$((ISSUES_FOUND + 1))
fi

if [ $NPM_INSTALLED -ne 0 ]; then
    echo -e "${RED}⚠${NC} npm should be installed with Node.js"
    ISSUES_FOUND=$((ISSUES_FOUND + 1))
fi

if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}⚠${NC} Run 'npm install' to install dependencies"
    ISSUES_FOUND=$((ISSUES_FOUND + 1))
fi

if [ $VERCEL_INSTALLED -ne 0 ]; then
    echo -e "${YELLOW}ℹ${NC} For web deployment, install Vercel: npm install -g vercel"
fi

if [ $EAS_INSTALLED -ne 0 ]; then
    echo -e "${YELLOW}ℹ${NC} For mobile deployment, install EAS: npm install -g eas-cli"
fi

echo ""

if [ $ISSUES_FOUND -eq 0 ]; then
    echo -e "${GREEN}✅ Your system is ready for deployment!${NC}"
    echo ""
    echo "Run the deployment script:"
    echo "  ./deploy.sh"
else
    echo -e "${RED}❌ Please fix the issues above before deploying${NC}"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "For more help, see DEPLOY.md or docs/ folder"
echo ""

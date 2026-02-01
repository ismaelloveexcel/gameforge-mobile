#!/bin/bash

# GameForge Mobile - One-Click Deployment Script
# This script automates deployment for non-technical users

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

# Banner
echo ""
echo "╔═══════════════════════════════════════════════════════════╗"
echo "║   🎮 GameForge Mobile - One-Click Deployment  🚀          ║"
echo "╚═══════════════════════════════════════════════════════════╝"
echo ""

# Check if .deployment-config exists
CONFIG_FILE=".deployment-config"

if [ ! -f "$CONFIG_FILE" ]; then
    print_info "First-time setup detected. Running configuration wizard..."
    echo ""
    
    # Ask user what they want to deploy
    echo "What would you like to deploy?"
    echo "1) Web version (fastest, free)"
    echo "2) Android app (free, takes longer)"
    echo "3) Both web and Android"
    echo ""
    read -p "Choose option (1-3): " deploy_choice
    
    # Save configuration
    echo "DEPLOY_CHOICE=$deploy_choice" > "$CONFIG_FILE"
    
    # Check if required tools are installed
    print_info "Checking required tools..."
    
    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed. Please install Node.js from https://nodejs.org/"
        exit 1
    fi
    print_success "Node.js is installed"
    
    if ! command -v npm &> /dev/null; then
        print_error "npm is not installed. Please install npm"
        exit 1
    fi
    print_success "npm is installed"
    
    # Check for deployment tools based on choice
    if [ "$deploy_choice" == "1" ] || [ "$deploy_choice" == "3" ]; then
        if ! command -v vercel &> /dev/null; then
            print_warning "Vercel CLI not found. Installing..."
            npm install -g vercel
        fi
        print_success "Vercel CLI is ready"
    fi
    
    if [ "$deploy_choice" == "2" ] || [ "$deploy_choice" == "3" ]; then
        if ! command -v eas &> /dev/null; then
            print_warning "EAS CLI not found. Installing..."
            npm install -g eas-cli
        fi
        print_success "EAS CLI is ready"
    fi
    
    print_success "Configuration complete!"
    echo ""
else
    # Load existing configuration
    source "$CONFIG_FILE"
    print_info "Using saved configuration"
    echo ""
fi

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    print_info "Installing dependencies..."
    npm install
    print_success "Dependencies installed"
    echo ""
fi

# Execute deployment based on configuration
case $DEPLOY_CHOICE in
    1)
        # Web deployment
        print_info "Building web application..."
        npm run build:web
        print_success "Web build complete"
        echo ""
        
        print_info "Deploying to Vercel..."
        if vercel --prod; then
            print_success "Web deployment successful!"
            echo ""
            print_success "Your app is now live!"
            echo ""
            print_info "Check your Vercel dashboard for the URL"
        else
            print_error "Deployment failed. Please check your Vercel configuration."
            exit 1
        fi
        ;;
    
    2)
        # Android deployment
        print_info "Building Android app with EAS..."
        print_warning "This may take 10-20 minutes..."
        echo ""
        
        if eas build --platform android --profile production --non-interactive; then
            print_success "Android build started successfully!"
            echo ""
            print_info "You'll receive an email when the build is complete"
            print_info "Or check: https://expo.dev"
        else
            print_error "Build failed. Please check your EAS configuration."
            exit 1
        fi
        ;;
    
    3)
        # Both web and Android
        print_info "Deploying web application first..."
        npm run build:web
        print_success "Web build complete"
        echo ""
        
        print_info "Deploying to Vercel..."
        if vercel --prod; then
            print_success "Web deployment successful!"
        else
            print_error "Web deployment failed"
            exit 1
        fi
        echo ""
        
        print_info "Starting Android build..."
        print_warning "This may take 10-20 minutes..."
        echo ""
        
        if eas build --platform android --profile production --non-interactive; then
            print_success "Android build started!"
            echo ""
            print_info "You'll receive an email when the build is complete"
        else
            print_error "Android build failed"
            exit 1
        fi
        ;;
    
    *)
        print_error "Invalid configuration. Please delete .deployment-config and run again."
        exit 1
        ;;
esac

echo ""
echo "╔═══════════════════════════════════════════════════════════╗"
echo "║   ✨ Deployment Complete!  🎉                             ║"
echo "╚═══════════════════════════════════════════════════════════╝"
echo ""
print_info "Next steps:"
echo "  - For web: Check your Vercel dashboard"
echo "  - For mobile: Check your email or EAS dashboard"
echo ""
print_info "To change deployment options, delete .deployment-config and run again"
echo ""

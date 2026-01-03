# Replit Nix configuration for GameForge Mobile
# This file specifies the system-level dependencies and environment

{ pkgs }: {
  deps = [
    # Node.js LTS for running the Expo/React Native app
    pkgs.nodejs_20
    
    # Package managers
    pkgs.nodePackages.npm
    pkgs.yarn
    
    # TypeScript language server for IDE support
    pkgs.nodePackages.typescript-language-server
    pkgs.nodePackages.typescript
    
    # Git for version control
    pkgs.git
    
    # Useful utilities
    pkgs.jq
    pkgs.watchman
  ];
  
  # Environment variables
  env = {
    # Increase Node.js memory for larger builds
    NODE_OPTIONS = "--max-old-space-size=4096";
    
    # Expo configuration
    EXPO_USE_METRO_WORKSPACE_ROOT = "true";
    
    # Disable CI mode for interactive development
    CI = "false";
  };
}

# PlayGift Assets

These are placeholder assets for the PlayGift branding.

## Color Palette - Nocturnal Romance Theme

- Primary (Deep Plum): #4A1E5A
- Accent (Gold): #D4AF37
- Background (Dark Midnight Blue): #0A1931
- Secondary (Rose Gold): #B76E79

## Theme Application

The Nocturnal Romance theme is available in:
- ThemeContext: Select 'nocturnal-romance' theme
- ArtStyleService: Use 'nocturnal-romance' art style
- Logo Generator: PlayGiftLogoScene renders with these colors

## Required Assets

- icon.png (1024x1024) - Main app icon
- adaptive-icon.png (1024x1024) - Android adaptive icon
- favicon.png (32x32) - Web favicon
- splash.png (1080x1920) - Splash screen

## Generating High-Quality Assets

To render actual 3D logo assets:
1. Use the PlayGiftLogoScene.ts in src/engines/logo-generator/
2. Render in browser with Babylon.js
3. Export images at required resolutions
4. Replace placeholder files in assets/

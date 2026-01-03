# Assets Directory

This directory contains all game assets including:

- `/icons` - App icons and UI icons
- `/templates` - Template preview images
- `/fonts` - Custom fonts
- `/sounds` - Sound effects and music
- `/models` - 3D models for Babylon.js and A-Frame

## Asset Guidelines

### Images
- Use PNG for transparency
- Use JPG for photographs
- Optimize with tools like TinyPNG
- Recommended max size: 2048x2048px

### Audio
- Format: MP3 or AAC
- Sample rate: 44.1kHz
- Bitrate: 128-192 kbps

### 3D Models
- Format: GLTF/GLB preferred
- Keep poly count reasonable for mobile
- Include textures in power-of-2 sizes

## Adding Assets

```typescript
import myImage from './assets/myImage.png';

// Use in component
<Image source={myImage} />

// Use in game engine
engine.loadAsset({
  id: 'myImage',
  type: 'image',
  url: myImage,
  size: 1024
});
```

# VR Development Guide

Create immersive VR experiences with GameForge Mobile.

## VR Templates

GameForge includes 4 VR templates:
1. VR Escape Room
2. AR Treasure Hunt
3. Virtual Museum
4. Shooting Gallery

## Getting Started

### Setup

```typescript
import { EngineFactory } from '@/engines/IGameEngine';

// Create A-Frame engine for VR
const engine = await EngineFactory.createEngine('aframe');
await engine.initialize(container);
```

### VR Scene Creation

```typescript
const vrScene: Scene = {
  id: 'vr-scene',
  name: 'My VR Scene',
  type: 'vr',
  objects: [
    {
      id: 'floor',
      name: 'Floor',
      type: 'plane',
      position: { x: 0, y: 0, z: 0 },
      rotation: { x: -90, y: 0, z: 0 },
      properties: {
        width: 10,
        height: 10,
        color: '#7BC8A4'
      }
    }
  ]
};

await engine.loadScene(vrScene);
```

## VR Best Practices

### Performance
- Keep draw calls low
- Optimize textures
- Use LOD systems
- Target 72+ FPS

### Comfort
- Avoid fast camera movements
- Provide teleportation
- Include comfort vignette
- Test for motion sickness

### Interaction
- Clear visual feedback
- Intuitive controls
- Hand tracking support
- Controller haptics

## Platform Support

### Meta Quest
- Resolution: 1832x1920 per eye
- Refresh: 72Hz (90Hz Quest 2+)
- Controllers: Touch controllers

### PSVR
- Resolution: 1920x1080 total
- Refresh: 120Hz
- Controllers: Move or DualShock

### WebXR
- Browser-based VR
- Cross-platform
- No installation needed

## Testing VR

```bash
# Run on device
npm start

# Scan QR code with VR device
# Or visit URL in VR browser
```

---

For more VR resources, ask Genie's Technical Expert personality!

import { IGameEngine } from './IGameEngine';
import { Scene as GameScene, GameObject, Asset } from '../types';

/**
 * A-Frame Engine Implementation
 * Handles VR/AR rendering using A-Frame
 */
export class AFrameEngine implements IGameEngine {
  private container: HTMLElement | null = null;
  private aframeScene: HTMLElement | null = null;
  private currentScene: GameScene | null = null;
  private gameObjects: Map<string, HTMLElement> = new Map();
  private assets: Map<string, HTMLElement> = new Map();
  private eventCallbacks: Map<string, Function[]> = new Map();
  private isPaused: boolean = false;

  async initialize(container: HTMLElement): Promise<void> {
    this.container = container;

    // Create A-Frame scene
    const sceneEl = document.createElement('a-scene');
    sceneEl.setAttribute('embedded', '');
    sceneEl.setAttribute('vr-mode-ui', 'enabled: true');
    
    // Create assets container
    const assets = document.createElement('a-assets');
    sceneEl.appendChild(assets);

    // Create default camera rig
    const cameraRig = document.createElement('a-entity');
    cameraRig.setAttribute('id', 'cameraRig');
    
    const camera = document.createElement('a-entity');
    camera.setAttribute('id', 'camera');
    camera.setAttribute('camera', '');
    camera.setAttribute('position', '0 1.6 0');
    camera.setAttribute('look-controls', '');
    cameraRig.appendChild(camera);
    
    sceneEl.appendChild(cameraRig);

    // Add default lighting
    const ambientLight = document.createElement('a-entity');
    ambientLight.setAttribute('light', 'type: ambient; color: #BBB');
    sceneEl.appendChild(ambientLight);

    const directionalLight = document.createElement('a-entity');
    directionalLight.setAttribute('light', 'type: directional; color: #FFF; intensity: 0.6');
    directionalLight.setAttribute('position', '-0.5 1 1');
    sceneEl.appendChild(directionalLight);

    this.aframeScene = sceneEl;
    container.appendChild(sceneEl);

    // Wait for scene to load
    await new Promise<void>((resolve) => {
      sceneEl.addEventListener('loaded', () => {
        console.log('A-Frame engine initialized');
        resolve();
      });
    });
  }

  dispose(): void {
    if (this.aframeScene && this.container) {
      this.container.removeChild(this.aframeScene);
    }
    this.gameObjects.clear();
    this.assets.clear();
    this.aframeScene = null;
    this.currentScene = null;
  }

  async loadScene(scene: GameScene): Promise<void> {
    this.clearScene();
    this.currentScene = scene;

    if (!this.aframeScene) return;

    // Set sky/background
    if (scene.background) {
      let sky = this.aframeScene.querySelector('a-sky');
      if (!sky) {
        sky = document.createElement('a-sky');
        this.aframeScene.appendChild(sky);
      }
      sky.setAttribute('color', scene.background);
    }

    // Create game objects
    for (const gameObject of scene.objects) {
      this.createGameObject(gameObject);
    }

    this.emit('sceneLoaded', scene);
  }

  getCurrentScene(): GameScene | null {
    return this.currentScene;
  }

  clearScene(): void {
    if (!this.aframeScene) return;

    // Remove all entities except camera, lights, and sky
    const entities = Array.from(this.aframeScene.children);
    entities.forEach((entity) => {
      if (
        entity.tagName.toLowerCase().startsWith('a-') &&
        !entity.id.includes('camera') &&
        !entity.getAttribute('light') &&
        entity.tagName.toLowerCase() !== 'a-sky' &&
        entity.tagName.toLowerCase() !== 'a-assets'
      ) {
        this.aframeScene?.removeChild(entity);
      }
    });

    this.gameObjects.clear();
    this.currentScene = null;
  }

  createGameObject(gameObject: GameObject): void {
    if (!this.aframeScene) return;

    let entity: HTMLElement;

    // Create entity based on type
    switch (gameObject.type) {
      case 'box':
        entity = document.createElement('a-box');
        entity.setAttribute('width', gameObject.properties.width || '1');
        entity.setAttribute('height', gameObject.properties.height || '1');
        entity.setAttribute('depth', gameObject.properties.depth || '1');
        break;
      case 'sphere':
        entity = document.createElement('a-sphere');
        entity.setAttribute('radius', gameObject.properties.radius || '0.5');
        break;
      case 'cylinder':
        entity = document.createElement('a-cylinder');
        entity.setAttribute('radius', gameObject.properties.radius || '0.5');
        entity.setAttribute('height', gameObject.properties.height || '1');
        break;
      case 'plane':
        entity = document.createElement('a-plane');
        entity.setAttribute('width', gameObject.properties.width || '1');
        entity.setAttribute('height', gameObject.properties.height || '1');
        break;
      case 'text':
        entity = document.createElement('a-text');
        entity.setAttribute('value', gameObject.properties.text || '');
        entity.setAttribute('align', 'center');
        break;
      default:
        entity = document.createElement('a-entity');
    }

    // Set common attributes
    entity.setAttribute('id', gameObject.id);
    
    // Position
    entity.setAttribute(
      'position',
      `${gameObject.position.x} ${gameObject.position.y} ${gameObject.position.z || 0}`
    );

    // Rotation
    if (gameObject.rotation) {
      entity.setAttribute(
        'rotation',
        `${gameObject.rotation.x} ${gameObject.rotation.y} ${gameObject.rotation.z}`
      );
    }

    // Scale
    if (gameObject.scale) {
      entity.setAttribute(
        'scale',
        `${gameObject.scale.x} ${gameObject.scale.y} ${gameObject.scale.z || 1}`
      );
    }

    // Color
    if (gameObject.properties.color && gameObject.type !== 'text') {
      entity.setAttribute('color', gameObject.properties.color);
    }

    this.gameObjects.set(gameObject.id, entity);
    this.aframeScene.appendChild(entity);
  }

  updateGameObject(id: string, updates: Partial<GameObject>): void {
    const entity = this.gameObjects.get(id);
    if (!entity) return;

    if (updates.position) {
      entity.setAttribute(
        'position',
        `${updates.position.x} ${updates.position.y} ${updates.position.z || 0}`
      );
    }

    if (updates.rotation) {
      entity.setAttribute(
        'rotation',
        `${updates.rotation.x} ${updates.rotation.y} ${updates.rotation.z}`
      );
    }

    if (updates.scale) {
      entity.setAttribute(
        'scale',
        `${updates.scale.x} ${updates.scale.y} ${updates.scale.z || 1}`
      );
    }
  }

  removeGameObject(id: string): void {
    const entity = this.gameObjects.get(id);
    if (entity && this.aframeScene) {
      this.aframeScene.removeChild(entity);
      this.gameObjects.delete(id);
    }
  }

  getGameObject(id: string): GameObject | null {
    return null; // Would return actual GameObject data
  }

  async loadAsset(asset: Asset): Promise<void> {
    if (!this.aframeScene) return;

    const assetsContainer = this.aframeScene.querySelector('a-assets');
    if (!assetsContainer) return;

    try {
      if (asset.type === 'image') {
        const img = document.createElement('img');
        img.setAttribute('id', asset.id);
        img.setAttribute('src', asset.url);
        assetsContainer.appendChild(img);
        this.assets.set(asset.id, img);
      } else if (asset.type === '3dmodel') {
        const model = document.createElement('a-asset-item');
        model.setAttribute('id', asset.id);
        model.setAttribute('src', asset.url);
        assetsContainer.appendChild(model);
        this.assets.set(asset.id, model);
      } else if (asset.type === 'audio') {
        const audio = document.createElement('audio');
        audio.setAttribute('id', asset.id);
        audio.setAttribute('src', asset.url);
        assetsContainer.appendChild(audio);
        this.assets.set(asset.id, audio);
      }
    } catch (error) {
      console.error('Error loading asset:', error);
    }
  }

  unloadAsset(id: string): void {
    const asset = this.assets.get(id);
    if (asset) {
      const assetsContainer = this.aframeScene?.querySelector('a-assets');
      if (assetsContainer) {
        assetsContainer.removeChild(asset);
      }
      this.assets.delete(id);
    }
  }

  render(): void {
    // A-Frame handles rendering automatically
  }

  setBackgroundColor(color: string): void {
    if (!this.aframeScene) return;

    let sky = this.aframeScene.querySelector('a-sky');
    if (!sky) {
      sky = document.createElement('a-sky');
      this.aframeScene.appendChild(sky);
    }
    sky.setAttribute('color', color);
  }

  setCameraPosition(x: number, y: number, z?: number): void {
    const cameraRig = this.aframeScene?.querySelector('#cameraRig');
    if (cameraRig) {
      cameraRig.setAttribute('position', `${x} ${y} ${z || 0}`);
    }
  }

  setCameraTarget(x: number, y: number, z?: number): void {
    const camera = this.aframeScene?.querySelector('#camera');
    if (camera) {
      // Set look-at target
      camera.setAttribute('look-at', `${x} ${y} ${z || 0}`);
    }
  }

  enablePhysics(config: any): void {
    if (this.aframeScene) {
      // A-Frame physics would be configured here
      this.aframeScene.setAttribute('physics', `gravity: ${config.gravity?.y || -9.81}`);
    }
  }

  disablePhysics(): void {
    if (this.aframeScene) {
      this.aframeScene.removeAttribute('physics');
    }
  }

  on(event: string, handler: Function): void {
    if (!this.eventCallbacks.has(event)) {
      this.eventCallbacks.set(event, []);
    }
    this.eventCallbacks.get(event)?.push(handler);
  }

  off(event: string, handler: Function): void {
    const handlers = this.eventCallbacks.get(event);
    if (handlers) {
      const index = handlers.indexOf(handler);
      if (index > -1) {
        handlers.splice(index, 1);
      }
    }
  }

  emit(event: string, data?: any): void {
    const handlers = this.eventCallbacks.get(event);
    if (handlers) {
      handlers.forEach((handler) => handler(data));
    }
  }

  resize(width: number, height: number): void {
    // A-Frame handles resizing automatically
  }

  pause(): void {
    this.isPaused = true;
    this.emit('paused');
  }

  resume(): void {
    this.isPaused = false;
    this.emit('resumed');
  }

  getEngineType(): 'pixi' | 'babylon' | 'aframe' {
    return 'aframe';
  }
}

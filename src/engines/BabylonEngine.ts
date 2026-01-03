import * as BABYLON from 'babylonjs';
import { IGameEngine } from './IGameEngine';
import { Scene as GameScene, GameObject, Asset } from '../types';

/**
 * Babylon.js Engine Implementation
 * Handles 3D game rendering using Babylon.js
 */
export class BabylonEngine implements IGameEngine {
  private engine: BABYLON.Engine | null = null;
  private scene: BABYLON.Scene | null = null;
  private camera: BABYLON.Camera | null = null;
  private currentScene: GameScene | null = null;
  private gameObjects: Map<string, BABYLON.Mesh | BABYLON.TransformNode> = new Map();
  private assets: Map<string, any> = new Map();
  private eventCallbacks: Map<string, Function[]> = new Map();
  private isPaused: boolean = false;

  async initialize(container: HTMLElement | any): Promise<void> {
    const canvas = document.createElement('canvas');
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    
    if (container) {
      container.appendChild(canvas);
    }

    this.engine = new BABYLON.Engine(canvas, true, {
      preserveDrawingBuffer: true,
      stencil: true,
    });

    this.scene = new BABYLON.Scene(this.engine);
    this.scene.clearColor = new BABYLON.Color4(0.1, 0.1, 0.18, 1);

    // Create default camera
    this.camera = new BABYLON.ArcRotateCamera(
      'camera',
      Math.PI / 2,
      Math.PI / 4,
      10,
      BABYLON.Vector3.Zero(),
      this.scene
    );
    this.camera.attachControl(canvas, true);

    // Create default light
    const light = new BABYLON.HemisphericLight(
      'light',
      new BABYLON.Vector3(0, 1, 0),
      this.scene
    );
    light.intensity = 0.7;

    // Run render loop
    this.engine.runRenderLoop(() => {
      if (!this.isPaused && this.scene) {
        this.scene.render();
        this.emit('render');
      }
    });

    // Handle resize
    window.addEventListener('resize', () => {
      this.engine?.resize();
    });

    console.log('Babylon.js engine initialized');
  }

  dispose(): void {
    if (this.scene) {
      this.scene.dispose();
      this.scene = null;
    }
    if (this.engine) {
      this.engine.dispose();
      this.engine = null;
    }
    this.gameObjects.clear();
    this.assets.clear();
    this.currentScene = null;
  }

  async loadScene(scene: GameScene): Promise<void> {
    this.clearScene();
    this.currentScene = scene;

    // Set background
    if (scene.background && this.scene) {
      const color = this.hexToRgb(scene.background);
      this.scene.clearColor = new BABYLON.Color4(color.r, color.g, color.b, 1);
    }

    // Setup camera
    if (scene.camera && this.camera) {
      const { position, target } = scene.camera;
      this.setCameraPosition(position.x, position.y, position.z);
      if (target) {
        this.setCameraTarget(target.x, target.y, target.z);
      }
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
    if (this.scene) {
      // Remove all meshes except camera and lights
      this.scene.meshes.forEach((mesh) => {
        if (!mesh.name.startsWith('camera') && !mesh.name.startsWith('light')) {
          mesh.dispose();
        }
      });
    }
    this.gameObjects.clear();
    this.currentScene = null;
  }

  createGameObject(gameObject: GameObject): void {
    if (!this.scene) return;

    let mesh: BABYLON.Mesh | null = null;

    // Create mesh based on type
    switch (gameObject.type) {
      case 'box':
        mesh = BABYLON.MeshBuilder.CreateBox(gameObject.id, {
          width: gameObject.properties.width || 1,
          height: gameObject.properties.height || 1,
          depth: gameObject.properties.depth || 1,
        }, this.scene);
        break;
      case 'sphere':
        mesh = BABYLON.MeshBuilder.CreateSphere(gameObject.id, {
          diameter: gameObject.properties.diameter || 1,
        }, this.scene);
        break;
      case 'cylinder':
        mesh = BABYLON.MeshBuilder.CreateCylinder(gameObject.id, {
          diameter: gameObject.properties.diameter || 1,
          height: gameObject.properties.height || 2,
        }, this.scene);
        break;
      case 'plane':
        mesh = BABYLON.MeshBuilder.CreatePlane(gameObject.id, {
          width: gameObject.properties.width || 1,
          height: gameObject.properties.height || 1,
        }, this.scene);
        break;
      case 'ground':
        mesh = BABYLON.MeshBuilder.CreateGround(gameObject.id, {
          width: gameObject.properties.width || 10,
          height: gameObject.properties.height || 10,
        }, this.scene);
        break;
      default:
        // Default to box
        mesh = BABYLON.MeshBuilder.CreateBox(gameObject.id, { size: 1 }, this.scene);
    }

    if (mesh) {
      // Set position
      mesh.position = new BABYLON.Vector3(
        gameObject.position.x,
        gameObject.position.y,
        gameObject.position.z || 0
      );

      // Set rotation
      if (gameObject.rotation) {
        mesh.rotation = new BABYLON.Vector3(
          gameObject.rotation.x,
          gameObject.rotation.y,
          gameObject.rotation.z
        );
      }

      // Set scale
      if (gameObject.scale) {
        mesh.scaling = new BABYLON.Vector3(
          gameObject.scale.x,
          gameObject.scale.y,
          gameObject.scale.z || 1
        );
      }

      // Apply material
      if (gameObject.properties.color) {
        const material = new BABYLON.StandardMaterial(gameObject.id + '_mat', this.scene);
        const color = this.hexToRgb(gameObject.properties.color);
        material.diffuseColor = new BABYLON.Color3(color.r, color.g, color.b);
        mesh.material = material;
      }

      this.gameObjects.set(gameObject.id, mesh);
    }
  }

  updateGameObject(id: string, updates: Partial<GameObject>): void {
    const mesh = this.gameObjects.get(id);
    if (!mesh) return;

    if (updates.position) {
      mesh.position = new BABYLON.Vector3(
        updates.position.x,
        updates.position.y,
        updates.position.z || 0
      );
    }

    if (updates.rotation) {
      mesh.rotation = new BABYLON.Vector3(
        updates.rotation.x,
        updates.rotation.y,
        updates.rotation.z
      );
    }

    if (updates.scale) {
      mesh.scaling = new BABYLON.Vector3(
        updates.scale.x,
        updates.scale.y,
        updates.scale.z || 1
      );
    }
  }

  removeGameObject(id: string): void {
    const mesh = this.gameObjects.get(id);
    if (mesh) {
      mesh.dispose();
      this.gameObjects.delete(id);
    }
  }

  getGameObject(id: string): GameObject | null {
    return null; // Would return actual GameObject data
  }

  async loadAsset(asset: Asset): Promise<void> {
    if (!this.scene) return;

    try {
      if (asset.type === '3dmodel') {
        // Load 3D model
        const result = await BABYLON.SceneLoader.ImportMeshAsync(
          '',
          '',
          asset.url,
          this.scene
        );
        this.assets.set(asset.id, result.meshes);
      }
      // Handle other asset types
    } catch (error) {
      console.error('Error loading asset:', error);
    }
  }

  unloadAsset(id: string): void {
    const asset = this.assets.get(id);
    if (Array.isArray(asset)) {
      asset.forEach((mesh) => mesh.dispose());
    }
    this.assets.delete(id);
  }

  render(): void {
    // Babylon handles rendering in runRenderLoop
  }

  setBackgroundColor(color: string): void {
    if (this.scene) {
      const rgb = this.hexToRgb(color);
      this.scene.clearColor = new BABYLON.Color4(rgb.r, rgb.g, rgb.b, 1);
    }
  }

  setCameraPosition(x: number, y: number, z?: number): void {
    if (this.camera) {
      this.camera.position = new BABYLON.Vector3(x, y, z || 10);
    }
  }

  setCameraTarget(x: number, y: number, z?: number): void {
    if (this.camera && this.camera instanceof BABYLON.ArcRotateCamera) {
      this.camera.setTarget(new BABYLON.Vector3(x, y, z || 0));
    }
  }

  enablePhysics(config: any): void {
    if (this.scene) {
      const gravity = new BABYLON.Vector3(
        config.gravity?.x || 0,
        config.gravity?.y || -9.81,
        config.gravity?.z || 0
      );
      this.scene.enablePhysics(gravity, new BABYLON.CannonJSPlugin());
    }
  }

  disablePhysics(): void {
    if (this.scene) {
      this.scene.disablePhysicsEngine();
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
    this.engine?.resize();
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
    return 'babylon';
  }

  private hexToRgb(hex: string): { r: number; g: number; b: number } {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16) / 255,
          g: parseInt(result[2], 16) / 255,
          b: parseInt(result[3], 16) / 255,
        }
      : { r: 1, g: 1, b: 1 };
  }
}

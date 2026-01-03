import * as PIXI from 'pixi.js';
import { IGameEngine } from './IGameEngine';
import { Scene, GameObject, Asset } from '../types';

/**
 * Pixi.js Engine Implementation
 * Handles 2D game rendering using Pixi.js
 */
export class PixiEngine implements IGameEngine {
  private app: PIXI.Application | null = null;
  private currentScene: Scene | null = null;
  private gameObjects: Map<string, PIXI.Container> = new Map();
  private assets: Map<string, any> = new Map();
  private eventEmitter: PIXI.utils.EventEmitter = new PIXI.utils.EventEmitter();
  private isPaused: boolean = false;

  async initialize(container: HTMLElement): Promise<void> {
    this.app = new PIXI.Application({
      width: 800,
      height: 600,
      backgroundColor: 0x1a1a2e,
      antialias: true,
      resolution: window.devicePixelRatio || 1,
    });

    if (container) {
      container.appendChild(this.app.view as HTMLCanvasElement);
    }

    // Setup ticker
    this.app.ticker.add(() => {
      if (!this.isPaused) {
        this.render();
      }
    });

    console.log('Pixi.js engine initialized');
  }

  dispose(): void {
    if (this.app) {
      this.app.destroy(true, { children: true, texture: true, baseTexture: true });
      this.app = null;
    }
    this.gameObjects.clear();
    this.assets.clear();
    this.currentScene = null;
  }

  async loadScene(scene: Scene): Promise<void> {
    this.clearScene();
    this.currentScene = scene;

    // Load scene background
    if (scene.background) {
      const background = new PIXI.Graphics();
      background.beginFill(parseInt(scene.background.replace('#', '0x')));
      background.drawRect(0, 0, this.app?.screen.width || 800, this.app?.screen.height || 600);
      background.endFill();
      this.app?.stage.addChild(background);
    }

    // Create game objects
    for (const gameObject of scene.objects) {
      this.createGameObject(gameObject);
    }

    this.emit('sceneLoaded', scene);
  }

  getCurrentScene(): Scene | null {
    return this.currentScene;
  }

  clearScene(): void {
    if (this.app) {
      this.app.stage.removeChildren();
    }
    this.gameObjects.clear();
    this.currentScene = null;
  }

  createGameObject(gameObject: GameObject): void {
    const container = new PIXI.Container();
    container.position.set(gameObject.position.x, gameObject.position.y);

    if (gameObject.scale) {
      container.scale.set(gameObject.scale.x, gameObject.scale.y);
    }

    // Create sprite based on type
    if (gameObject.type === 'sprite') {
      const sprite = this.createSprite(gameObject);
      if (sprite) {
        container.addChild(sprite);
      }
    } else if (gameObject.type === 'rectangle') {
      const rect = this.createRectangle(gameObject);
      container.addChild(rect);
    } else if (gameObject.type === 'circle') {
      const circle = this.createCircle(gameObject);
      container.addChild(circle);
    } else if (gameObject.type === 'text') {
      const text = this.createText(gameObject);
      container.addChild(text);
    }

    this.gameObjects.set(gameObject.id, container);
    this.app?.stage.addChild(container);
  }

  private createSprite(gameObject: GameObject): PIXI.Sprite | null {
    const texturePath = gameObject.properties.texture;
    if (!texturePath) return null;

    try {
      const texture = PIXI.Texture.from(texturePath);
      const sprite = new PIXI.Sprite(texture);
      sprite.anchor.set(0.5);
      return sprite;
    } catch (error) {
      console.error('Error creating sprite:', error);
      return null;
    }
  }

  private createRectangle(gameObject: GameObject): PIXI.Graphics {
    const graphics = new PIXI.Graphics();
    const color = parseInt((gameObject.properties.color || '#ffffff').replace('#', '0x'));
    const width = gameObject.properties.width || 100;
    const height = gameObject.properties.height || 100;

    graphics.beginFill(color);
    graphics.drawRect(-width / 2, -height / 2, width, height);
    graphics.endFill();

    return graphics;
  }

  private createCircle(gameObject: GameObject): PIXI.Graphics {
    const graphics = new PIXI.Graphics();
    const color = parseInt((gameObject.properties.color || '#ffffff').replace('#', '0x'));
    const radius = gameObject.properties.radius || 50;

    graphics.beginFill(color);
    graphics.drawCircle(0, 0, radius);
    graphics.endFill();

    return graphics;
  }

  private createText(gameObject: GameObject): PIXI.Text {
    const style = new PIXI.TextStyle({
      fontFamily: gameObject.properties.fontFamily || 'Arial',
      fontSize: gameObject.properties.fontSize || 24,
      fill: gameObject.properties.color || '#ffffff',
      align: gameObject.properties.align || 'center',
    });

    const text = new PIXI.Text(gameObject.properties.text || '', style);
    text.anchor.set(0.5);

    return text;
  }

  updateGameObject(id: string, updates: Partial<GameObject>): void {
    const container = this.gameObjects.get(id);
    if (!container) return;

    if (updates.position) {
      container.position.set(updates.position.x, updates.position.y);
    }

    if (updates.scale) {
      container.scale.set(updates.scale.x, updates.scale.y);
    }

    if (updates.rotation) {
      container.rotation = updates.rotation.z || 0;
    }
  }

  removeGameObject(id: string): void {
    const container = this.gameObjects.get(id);
    if (container) {
      this.app?.stage.removeChild(container);
      container.destroy({ children: true });
      this.gameObjects.delete(id);
    }
  }

  getGameObject(id: string): GameObject | null {
    // This would return the actual GameObject data, not the Pixi container
    // In a full implementation, we'd maintain a separate data structure
    return null;
  }

  async loadAsset(asset: Asset): Promise<void> {
    try {
      if (asset.type === 'image') {
        const texture = await PIXI.Assets.load(asset.url);
        this.assets.set(asset.id, texture);
      }
      // Handle other asset types as needed
    } catch (error) {
      console.error('Error loading asset:', error);
    }
  }

  unloadAsset(id: string): void {
    const asset = this.assets.get(id);
    if (asset && asset.destroy) {
      asset.destroy(true);
    }
    this.assets.delete(id);
  }

  render(): void {
    // Pixi handles rendering automatically via ticker
    this.emit('render');
  }

  setBackgroundColor(color: string): void {
    if (this.app) {
      this.app.renderer.background.color = parseInt(color.replace('#', '0x'));
    }
  }

  setCameraPosition(x: number, y: number, z?: number): void {
    if (this.app) {
      this.app.stage.position.set(-x, -y);
    }
  }

  setCameraTarget(x: number, y: number, z?: number): void {
    // For 2D, camera target is similar to position
    this.setCameraPosition(x, y);
  }

  enablePhysics(config: any): void {
    // Physics would be integrated here (e.g., Matter.js)
    console.log('Physics enabled with config:', config);
  }

  disablePhysics(): void {
    console.log('Physics disabled');
  }

  on(event: string, handler: Function): void {
    this.eventEmitter.on(event, handler as any);
  }

  off(event: string, handler: Function): void {
    this.eventEmitter.off(event, handler as any);
  }

  emit(event: string, data?: any): void {
    this.eventEmitter.emit(event, data);
  }

  resize(width: number, height: number): void {
    if (this.app) {
      this.app.renderer.resize(width, height);
    }
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
    return 'pixi';
  }
}

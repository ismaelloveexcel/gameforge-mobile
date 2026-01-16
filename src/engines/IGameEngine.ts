import { Scene, GameObject, Asset } from '../types';

/**
 * Base Game Engine Interface
 * All engine implementations must implement this interface
 */
export interface IGameEngine {
  // Initialization
  initialize(container: HTMLElement | any): Promise<void>;
  dispose(): void;

  // Scene Management
  loadScene(scene: Scene): Promise<void>;
  getCurrentScene(): Scene | null;
  clearScene(): void;

  // GameObject Management
  createGameObject(gameObject: GameObject): void;
  updateGameObject(id: string, updates: Partial<GameObject>): void;
  removeGameObject(id: string): void;
  getGameObject(id: string): GameObject | null;

  // Asset Management
  loadAsset(asset: Asset): Promise<void>;
  unloadAsset(id: string): void;

  // Rendering
  render(): void;
  setBackgroundColor(color: string): void;
  
  // Camera
  setCameraPosition(x: number, y: number, z?: number): void;
  setCameraTarget(x: number, y: number, z?: number): void;

  // Physics
  enablePhysics(config: any): void;
  disablePhysics(): void;

  // Events
  on(event: string, handler: Function): void;
  off(event: string, handler: Function): void;
  emit(event: string, data?: any): void;

  // Utilities
  resize(width: number, height: number): void;
  pause(): void;
  resume(): void;
  getEngineType(): 'pixi' | 'babylon' | 'aframe';
}

/**
 * Engine Factory
 * Creates the appropriate engine instance based on type
 */
export class EngineFactory {
  static async createEngine(type: 'pixi' | 'babylon' | 'aframe'): Promise<IGameEngine> {
    switch (type) {
      case 'pixi': {
        const { PixiEngine } = await import('./PixiEngine');
        return new PixiEngine();
      }
      case 'babylon': {
        const { BabylonEngine } = await import('./BabylonEngine');
        return new BabylonEngine();
      }
      case 'aframe': {
        const { AFrameEngine } = await import('./AFrameEngine');
        return new AFrameEngine();
      }
      default:
        throw new Error(`Unknown engine type: ${type}`);
    }
  }
}

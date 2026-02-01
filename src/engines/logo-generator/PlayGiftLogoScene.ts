/**
 * PlayGift Logo Scene Generator
 * Creates a 3D logo using Babylon.js with the Nocturnal Romance aesthetic
 */
import * as BABYLON from 'babylonjs';
import { artStyleService } from '../../services/ArtStyleService';

export interface LogoSceneConfig {
  concept: string;
  cameraPosition?: BABYLON.Vector3;
  cameraRotation?: number;
  renderWidth?: number;
  renderHeight?: number;
  backgroundColor?: string;
}

export class PlayGiftLogoScene {
  private engine: BABYLON.Engine | null = null;
  private scene: BABYLON.Scene | null = null;
  private camera: BABYLON.ArcRotateCamera | null = null;

  /**
   * Render the PlayGift logo scene
   */
  async renderLogoScene(canvas: HTMLCanvasElement, config: LogoSceneConfig): Promise<void> {
    // Initialize engine
    this.engine = new BABYLON.Engine(canvas, true, {
      preserveDrawingBuffer: true,
      stencil: true,
    });

    // Create scene
    this.scene = new BABYLON.Scene(this.engine);
    
    // Get Nocturnal Romance colors
    const style = artStyleService.getStyleById('nocturnal-romance');
    const colors = style?.colors || {
      primary: '#4A1E5A',
      accent: '#D4AF37',
      background: '#0A1931',
      secondary: '#B76E79',
    };

    // Set background
    const bgColor = config.backgroundColor || colors.background;
    const rgb = this.hexToRgb(bgColor);
    this.scene.clearColor = new BABYLON.Color4(rgb.r, rgb.g, rgb.b, 1);

    // Setup camera
    this.setupCamera(config);

    // Setup three-point lighting
    this.setupThreePointLighting();

    // Create logo geometry based on concept
    this.createLogoGeometry(config.concept, colors);

    // Add post-processing for premium feel
    this.addPostProcessing();

    // Render
    this.engine.runRenderLoop(() => {
      if (this.scene) {
        this.scene.render();
      }
    });
  }

  /**
   * Setup camera with professional positioning
   */
  private setupCamera(config: LogoSceneConfig): void {
    if (!this.scene) return;

    const position = config.cameraPosition || new BABYLON.Vector3(0, 2, -8);
    const rotation = config.cameraRotation || 0;

    this.camera = new BABYLON.ArcRotateCamera(
      'logoCamera',
      rotation,
      Math.PI / 4,
      8,
      BABYLON.Vector3.Zero(),
      this.scene
    );

    this.camera.position = position;
    this.camera.setTarget(BABYLON.Vector3.Zero());
    this.camera.attachControl(this.scene.getEngine().getRenderingCanvas()!, false);
  }

  /**
   * Setup three-point lighting for professional look
   */
  private setupThreePointLighting(): void {
    if (!this.scene) return;

    // Key light (main light)
    const keyLight = new BABYLON.DirectionalLight(
      'keyLight',
      new BABYLON.Vector3(-1, -2, -1),
      this.scene
    );
    keyLight.intensity = 1.2;
    keyLight.position = new BABYLON.Vector3(5, 8, -5);

    // Fill light (softer, opposite side)
    const fillLight = new BABYLON.HemisphericLight(
      'fillLight',
      new BABYLON.Vector3(1, 1, 1),
      this.scene
    );
    fillLight.intensity = 0.5;

    // Rim/back light (creates depth)
    const rimLight = new BABYLON.SpotLight(
      'rimLight',
      new BABYLON.Vector3(0, 5, 5),
      new BABYLON.Vector3(0, -1, -1),
      Math.PI / 3,
      2,
      this.scene
    );
    rimLight.intensity = 0.8;
  }

  /**
   * Create logo geometry - gift box with play button
   */
  private createLogoGeometry(concept: string, colors: any): void {
    if (!this.scene) return;

    // Create gift box base
    const box = BABYLON.MeshBuilder.CreateBox(
      'giftBox',
      { size: 2, height: 1.5 },
      this.scene
    );

    // Create sophisticated material for the box
    const boxMaterial = new BABYLON.PBRMetallicRoughnessMaterial('boxMaterial', this.scene);
    const plumColor = this.hexToColor3(colors.primary);
    boxMaterial.baseColor = plumColor;
    boxMaterial.metallic = 0.3;
    boxMaterial.roughness = 0.4;
    box.material = boxMaterial;

    // Create ribbon (horizontal and vertical bands)
    const ribbonH = BABYLON.MeshBuilder.CreateBox(
      'ribbonH',
      { width: 2.2, height: 0.3, depth: 0.3 },
      this.scene
    );
    ribbonH.position.y = 0.5;

    const ribbonV = BABYLON.MeshBuilder.CreateBox(
      'ribbonV',
      { width: 0.3, height: 2, depth: 0.3 },
      this.scene
    );
    ribbonV.position.y = 0.25;

    // Gold ribbon material
    const ribbonMaterial = new BABYLON.PBRMetallicRoughnessMaterial('ribbonMaterial', this.scene);
    const goldColor = this.hexToColor3(colors.accent);
    ribbonMaterial.baseColor = goldColor;
    ribbonMaterial.metallic = 0.9;
    ribbonMaterial.roughness = 0.2;
    ribbonH.material = ribbonMaterial;
    ribbonV.material = ribbonMaterial;

    // Create play button triangle integrated into ribbon
    const triangle = BABYLON.MeshBuilder.CreateCylinder(
      'playButton',
      { diameterTop: 0, diameterBottom: 0.8, height: 0.1, tessellation: 3 },
      this.scene
    );
    triangle.rotation.z = Math.PI / 2;
    triangle.rotation.y = Math.PI / 6;
    triangle.position = new BABYLON.Vector3(0, 0.5, 0.3);

    // Rose gold material for play button
    const playMaterial = new BABYLON.PBRMetallicRoughnessMaterial('playMaterial', this.scene);
    const roseColor = this.hexToColor3(colors.secondary);
    playMaterial.baseColor = roseColor;
    playMaterial.metallic = 0.7;
    playMaterial.roughness = 0.3;
    playMaterial.emissiveColor = roseColor.scale(0.2);
    triangle.material = playMaterial;

    // Add bow on top
    const bow = this.createBow(colors.accent);
    bow.position.y = 0.9;

    // Group all elements
    const logoGroup = new BABYLON.TransformNode('logoGroup', this.scene);
    box.parent = logoGroup;
    ribbonH.parent = logoGroup;
    ribbonV.parent = logoGroup;
    triangle.parent = logoGroup;
    bow.parent = logoGroup;

    // Add subtle rotation animation
    this.scene.registerBeforeRender(() => {
      if (logoGroup) {
        logoGroup.rotation.y += 0.005;
      }
    });
  }

  /**
   * Create decorative bow
   */
  private createBow(color: string): BABYLON.Mesh {
    if (!this.scene) throw new Error('Scene not initialized');

    const bow = BABYLON.MeshBuilder.CreateSphere(
      'bow',
      { diameter: 0.4, segments: 8 },
      this.scene
    );

    const bowMaterial = new BABYLON.PBRMetallicRoughnessMaterial('bowMaterial', this.scene);
    const bowColor = this.hexToColor3(color);
    bowMaterial.baseColor = bowColor;
    bowMaterial.metallic = 0.8;
    bowMaterial.roughness = 0.3;
    bow.material = bowMaterial;

    return bow;
  }

  /**
   * Add post-processing effects for premium look
   */
  private addPostProcessing(): void {
    if (!this.scene || !this.camera) return;

    // Add bloom effect for glow
    const pipeline = new BABYLON.DefaultRenderingPipeline(
      'defaultPipeline',
      true,
      this.scene,
      [this.camera]
    );

    pipeline.bloomEnabled = true;
    pipeline.bloomThreshold = 0.5;
    pipeline.bloomWeight = 0.6;
    pipeline.bloomKernel = 64;

    // Add subtle vignette
    pipeline.imageProcessingEnabled = true;
    if (pipeline.imageProcessing) {
      pipeline.imageProcessing.vignetteEnabled = true;
      pipeline.imageProcessing.vignetteWeight = 1.5;
      pipeline.imageProcessing.vignetteColor = new BABYLON.Color4(0.04, 0.1, 0.19, 1);
    }
  }

  /**
   * Capture screenshot
   */
  async captureScreenshot(width: number, height: number): Promise<string> {
    if (!this.engine) throw new Error('Engine not initialized');

    return new Promise((resolve) => {
      BABYLON.Tools.CreateScreenshot(
        this.engine!,
        this.camera!,
        { width, height },
        (data) => resolve(data)
      );
    });
  }

  /**
   * Dispose scene and engine
   */
  dispose(): void {
    if (this.scene) {
      this.scene.dispose();
      this.scene = null;
    }
    if (this.engine) {
      this.engine.dispose();
      this.engine = null;
    }
  }

  /**
   * Convert hex color to RGB
   */
  private hexToRgb(hex: string): { r: number; g: number; b: number } {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16) / 255,
          g: parseInt(result[2], 16) / 255,
          b: parseInt(result[3], 16) / 255,
        }
      : { r: 0, g: 0, b: 0 };
  }

  /**
   * Convert hex color to Babylon Color3
   */
  private hexToColor3(hex: string): BABYLON.Color3 {
    const rgb = this.hexToRgb(hex);
    return new BABYLON.Color3(rgb.r, rgb.g, rgb.b);
  }
}

/**
 * Helper function to render logo scene
 */
export async function renderLogoScene(
  canvas: HTMLCanvasElement,
  config: LogoSceneConfig = { concept: 'Elegant Fusion' }
): Promise<PlayGiftLogoScene> {
  const logoScene = new PlayGiftLogoScene();
  await logoScene.renderLogoScene(canvas, config);
  return logoScene;
}

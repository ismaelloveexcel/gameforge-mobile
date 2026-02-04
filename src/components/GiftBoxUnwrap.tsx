/**
 * GiftBoxUnwrap - Interactive 3D unboxing in a WebView (Babylon.js)
 */
import React, { useMemo, useRef } from 'react';
import { View, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';

let HapticsModule: any = null;
let ExpoAV: any = null;
try {
  HapticsModule = require('expo-haptics');
} catch (error) {
  HapticsModule = null;
}
try {
  ExpoAV = require('expo-av');
} catch (error) {
  ExpoAV = null;
}

interface GiftBoxUnwrapProps {
  height?: number;
  onUnwrap?: () => void;
}

export default function GiftBoxUnwrap({ height = 220, onUnwrap }: GiftBoxUnwrapProps) {
  const webRef = useRef<WebView>(null);

  const html = useMemo(
    () => `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1" />
    <style>
      html, body { margin: 0; padding: 0; width: 100%; height: 100%; overflow: hidden; background: transparent; }
      canvas { width: 100%; height: 100%; touch-action: none; }
    </style>
  </head>
  <body>
    <canvas id="renderCanvas"></canvas>
    <script src="https://cdn.babylonjs.com/babylon.js"></script>
    <script>
      const canvas = document.getElementById('renderCanvas');
      const engine = new BABYLON.Engine(canvas, true, { preserveDrawingBuffer: true, stencil: true });
      const scene = new BABYLON.Scene(engine);
      scene.clearColor = new BABYLON.Color4(0, 0, 0, 0);
      const camera = new BABYLON.ArcRotateCamera('camera', Math.PI / 2, Math.PI / 2.6, 6, BABYLON.Vector3.Zero(), scene);
      camera.attachControl(canvas, true);
      camera.lowerRadiusLimit = 5;
      camera.upperRadiusLimit = 9;
      const light = new BABYLON.HemisphericLight('light', new BABYLON.Vector3(0, 1, 0), scene);
      light.intensity = 0.9;

      const boxMat = new BABYLON.StandardMaterial('boxMat', scene);
      boxMat.diffuseColor = new BABYLON.Color3(0.91, 0.72, 0.35);
      boxMat.specularColor = new BABYLON.Color3(0.9, 0.9, 0.9);

      const lidMat = new BABYLON.StandardMaterial('lidMat', scene);
      lidMat.diffuseColor = new BABYLON.Color3(0.98, 0.85, 0.55);

      const base = BABYLON.MeshBuilder.CreateBox('base', { width: 2, height: 1.4, depth: 2 }, scene);
      base.material = boxMat;
      base.position.y = 0.2;

      const lid = BABYLON.MeshBuilder.CreateBox('lid', { width: 2.05, height: 0.4, depth: 2.05 }, scene);
      lid.material = lidMat;
      lid.position.y = 1.1;
      lid.setPivotPoint(new BABYLON.Vector3(0, -0.2, -1));

      let isOpen = false;
      let hasUnwrapped = false;

      function animateLid(open) {
        const target = open ? -Math.PI / 1.7 : 0;
        BABYLON.Animation.CreateAndStartAnimation(
          'lidOpen',
          lid,
          'rotation.x',
          60,
          20,
          lid.rotation.x,
          target,
          BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT
        );
      }

      window.toggleUnwrap = function() {
        isOpen = !isOpen;
        animateLid(isOpen);
        if (isOpen && !hasUnwrapped) {
          hasUnwrapped = true;
          if (window.ReactNativeWebView) {
            window.ReactNativeWebView.postMessage('unwrapped');
          }
        }
      };

      canvas.addEventListener('pointerdown', () => window.toggleUnwrap());

      engine.runRenderLoop(() => scene.render());
      window.addEventListener('resize', () => engine.resize());
    </script>
  </body>
</html>
`,
    []
  );

  const handleMessage = async () => {
    if (HapticsModule?.impactAsync) {
      try {
        await HapticsModule.impactAsync(HapticsModule.ImpactFeedbackStyle.Medium);
      } catch {}
    }
    if (ExpoAV?.Audio) {
      try {
        const sound = new ExpoAV.Audio.Sound();
        await sound.loadAsync({
          uri: 'https://actions.google.com/sounds/v1/cartoon/concussive_hit_guitar_boing.ogg',
        });
        await sound.playAsync();
      } catch {}
    }
    onUnwrap?.();
  };

  const triggerUnwrap = () => {
    webRef.current?.injectJavaScript('window.toggleUnwrap && window.toggleUnwrap(); true;');
  };

  return (
    <View style={[styles.container, { height }]}>
      <WebView
        ref={webRef}
        originWhitelist={['*']}
        source={{ html }}
        style={styles.webview}
        onMessage={handleMessage}
        javaScriptEnabled
        allowsInlineMediaPlayback
        scrollEnabled={false}
        onTouchStart={triggerUnwrap}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  webview: {
    backgroundColor: 'transparent',
  },
});

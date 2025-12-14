/**
 * Расширение типов для React Three Fiber
 * Позволяет использовать JSX элементы из three.js
 */

import '@react-three/fiber';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      group: any;
      mesh: any;
      sphereGeometry: any;
      meshStandardMaterial: any;
      meshBasicMaterial: any;
      ringGeometry: any;
      torusGeometry: any;
      points: any;
      bufferGeometry: any;
      bufferAttribute: any;
      pointsMaterial: any;
      ambientLight: any;
      pointLight: any;
      directionalLight: any;
    }
  }
}

/**
 * Расширение типов для React Three Fiber
 * Позволяет использовать JSX элементы из three.js
 */

import { ThreeElements } from '@react-three/fiber';

declare global {
  namespace JSX {
    interface IntrinsicElements extends ThreeElements {
      // Все элементы из three.js уже включены через ThreeElements
    }
  }
}

import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';

/**
 * Soft studio lighting: a procedural "room" environment for glossy reflections (no HDR file),
 * a warm key light, a teal rim light and a gentle hemisphere fill.
 */
export function createLights(renderer, scene, colors) {
  const pmrem = new THREE.PMREMGenerator(renderer);
  const room = new RoomEnvironment();
  const envRT = pmrem.fromScene(room, 0.04);
  scene.environment = envRT.texture;
  scene.environmentIntensity = 0.9;

  const hemi = new THREE.HemisphereLight(0xffffff, new THREE.Color(colors.surfaceLow), 0.55);
  const key = new THREE.DirectionalLight(0xffffff, 1.6);
  key.position.set(3, 4, 5);
  const rim = new THREE.DirectionalLight(new THREE.Color(colors.primaryFixed), 1.4);
  rim.position.set(-4, 2, -3);
  const fill = new THREE.PointLight(new THREE.Color(colors.primaryContainer), 12, 14, 2);
  fill.position.set(-2.5, -2, 3);
  scene.add(hemi, key, rim, fill);

  return {
    /** @param {number} glow 0..1 (scroll driven) */
    update(glow, time) {
      rim.intensity = 1.1 + glow * 1.2;
      fill.intensity = 10 + Math.sin(time * 0.6) * 2 + glow * 6;
    },
    dispose() {
      envRT.dispose();
      pmrem.dispose();
      room.traverse((o) => {
        o.geometry?.dispose?.();
        const m = o.material;
        if (Array.isArray(m)) m.forEach((x) => x.dispose());
        else m?.dispose?.();
      });
      scene.environment = null;
      [hemi, key, rim, fill].forEach((l) => { scene.remove(l); l.dispose?.(); });
    },
  };
}

import * as THREE from 'three';
import { createTooth } from './tooth.js';

/**
 * Hero object factory.
 * Contract: returns { object: THREE.Object3D, update(dt, ctx), dispose() }.
 * Whatever is returned gets auto-normalised to 1 unit tall by scene.js.
 * To use a GLTF model, set `three.modelUrl` in config.js. Falls back to the procedural tooth.
 */
export async function createHeroObject({ modelUrl, colors }) {
  if (modelUrl) {
    try {
      const { loadGltfObject } = await import('./gltfObject.js');
      return await loadGltfObject(modelUrl);
    } catch (err) {
      console.warn('[3D] Could not load model, using procedural tooth instead.', err);
    }
  }
  return createTooth(colors);
}

/** Returns a normalising wrapper: object centred at origin and exactly 1 unit tall. */
export function normalise(object) {
  const box = new THREE.Box3().setFromObject(object);
  const size = box.getSize(new THREE.Vector3());
  const center = box.getCenter(new THREE.Vector3());
  const holder = new THREE.Group();
  object.position.sub(center);
  holder.add(object);
  holder.scale.setScalar(1 / (size.y || 1));
  const outer = new THREE.Group();
  outer.add(holder);
  return outer;
}

import * as THREE from 'three';

/**
 * Loads a GLTF/GLB model and adapts it to the hero-object contract used by scene.js.
 * Enable by setting `three.modelUrl` in src/config.js (e.g. '/models/tooth.glb').
 * The model is auto-centred and normalised, so any scale or origin works.
 * For Draco/KTX2-compressed files, add the matching loaders here.
 */
export async function loadGltfObject(url) {
  const { GLTFLoader } = await import('three/examples/jsm/loaders/GLTFLoader.js');
  const gltf = await new GLTFLoader().loadAsync(url);
  const object = gltf.scene;
  const box = new THREE.Box3().setFromObject(object);
  const center = box.getCenter(new THREE.Vector3());
  object.position.sub(center);
  const holder = new THREE.Group();
  holder.add(object);
  return {
    object: holder,
    update() {},
    dispose() {
      object.traverse((o) => {
        o.geometry?.dispose?.();
        const mats = Array.isArray(o.material) ? o.material : [o.material];
        mats.forEach((m) => {
          if (!m) return;
          Object.values(m).forEach((val) => val?.isTexture && val.dispose());
          m.dispose();
        });
      });
    },
  };
}

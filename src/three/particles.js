import * as THREE from 'three';

/** Soft round sprite texture generated on a canvas (no image files). */
function makeSprite() {
  const c = document.createElement('canvas');
  c.width = c.height = 64;
  const g = c.getContext('2d');
  const grd = g.createRadialGradient(32, 32, 0, 32, 32, 32);
  grd.addColorStop(0, 'rgba(255,255,255,1)');
  grd.addColorStop(0.4, 'rgba(255,255,255,0.55)');
  grd.addColorStop(1, 'rgba(255,255,255,0)');
  g.fillStyle = grd;
  g.fillRect(0, 0, 64, 64);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

/** Subtle floating teal motes that drift upward and parallax with scroll. */
export function createParticles({ count, colors, pixelRatio }) {
  const geo = new THREE.BufferGeometry();
  const base = new Float32Array(count * 3);   // x, y, z home positions (unit box, -0.5..0.5)
  const speed = new Float32Array(count);
  const pos = new Float32Array(count * 3);
  const col = new Float32Array(count * 3);
  const palette = [new THREE.Color(colors.primaryContainer), new THREE.Color(colors.primaryFixedDim), new THREE.Color(colors.secondaryContainer)];
  for (let i = 0; i < count; i++) {
    base[i * 3] = Math.random() - 0.5;
    base[i * 3 + 1] = Math.random();
    base[i * 3 + 2] = Math.random() - 0.5;
    speed[i] = 0.015 + Math.random() * 0.03;
    const c = palette[i % palette.length];
    col.set([c.r, c.g, c.b], i * 3);
  }
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  geo.setAttribute('color', new THREE.BufferAttribute(col, 3));
  const map = makeSprite();
  const mat = new THREE.PointsMaterial({
    size: 9 * pixelRatio, map, vertexColors: true, transparent: true, opacity: 0.4,
    depthWrite: false, sizeAttenuation: false,
  });
  const points = new THREE.Points(geo, mat);
  points.frustumCulled = false;

  return {
    points,
    /**
     * @param {number} time seconds
     * @param {number} scrollWorld scroll offset in world units (parallax)
     * @param {{w:number,h:number}} view visible world size at z=0
     * @param {number} opacity 0..1
     */
    update(time, scrollWorld, view, opacity, animate = true) {
      mat.opacity = 0.4 * opacity;
      const t = animate ? time : 0;
      for (let i = 0; i < count; i++) {
        const depth = base[i * 3 + 2] + 0.5; // 0..1 parallax factor
        const y = (((base[i * 3 + 1] + t * speed[i] + scrollWorld * (0.04 + depth * 0.08) / view.h) % 1) + 1) % 1;
        pos[i * 3] = base[i * 3] * view.w * 1.05 + Math.sin(t * 0.4 + i) * 0.12;
        pos[i * 3 + 1] = (0.5 - y) * view.h * 1.05;
        pos[i * 3 + 2] = (base[i * 3 + 2]) * 3 - 1;
      }
      geo.attributes.position.needsUpdate = true;
    },
    dispose() {
      geo.dispose();
      mat.dispose();
      map.dispose();
    },
  };
}

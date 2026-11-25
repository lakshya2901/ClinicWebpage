import * as THREE from 'three';

/**
 * Procedural glossy tooth matching the Stitch hero illustration: a rounded crown that tapers
 * into two short roots, shaded white → mint → teal → deep teal, with a clearcoat finish.
 *
 * Hero-object contract (see objects/index.js):
 *   { object: THREE.Object3D, update(dt, ctx), dispose() }
 * Anything that honours it (e.g. a GLTF model) can replace this file's output.
 */
const smoothstep = (a, b, x) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

function buildBody(colors) {
  // Half-profile (radius, height) of a pear-shaped crown tapering to the root base.
  const profile = [
    [0.0, 1.0], [0.3, 0.98], [0.6, 0.9], [0.84, 0.74], [0.97, 0.5], [1.0, 0.22], [0.97, -0.05],
    [0.88, -0.32], [0.74, -0.58], [0.6, -0.82], [0.48, -1.0], [0.4, -1.22], [0.34, -1.4], [0.0, -1.46],
  ].map(([r, y]) => new THREE.Vector2(r, y));
  // Resample the coarse profile with a spline so the root notch has enough vertices to stay smooth.
  const smoothProfile = new THREE.SplineCurve(profile).getPoints(160);
  const geo = new THREE.LatheGeometry(smoothProfile, 128, 0, Math.PI * 2);
  // LatheGeometry has no UV-aligned smoothing at the seam; rebuild smooth indexed normals later.
  const p = geo.attributes.position;
  const v = new THREE.Vector3();
  for (let i = 0; i < p.count; i++) {
    v.fromArray(p.array, i * 3);
    let { x, y, z } = v;
    const ang = Math.atan2(z, x);
    const r = Math.hypot(x, z);

    // Slim, slightly flattened front-to-back like a real tooth (design is ~0.65 wide : 1 tall)
    x *= 0.74;
    z *= 0.66;

    // Gentle cusps / fossa on the crown top
    const top = smoothstep(0.55, 1.0, v.y);
    y += top * (0.05 * Math.cos(2 * ang + 0.7) * r) - top * 0.1 * Math.exp(-(r * r) / 0.05);

    // Split the base into two short roots: carve a notch up the middle of the lower end
    const base = smoothstep(-0.75, -1.35, v.y);
    const notch = Math.exp(-(x * x) / (2 * 0.07 * 0.07));
    y += base * notch * 0.62;
    // Narrow each root toward a rounded tip
    const tipPinch = smoothstep(-1.0, -1.46, v.y);
    x *= 1 - 0.28 * tipPinch;
    z *= 1 - 0.18 * tipPinch;
    // Lean the roots slightly outward
    x += Math.sign(x || 1) * 0.07 * base;

    p.setXYZ(i, x, y, z);
  }
  geo.computeVertexNormals();

  // Vertex colour gradient, top-left (white) → bottom-right (deep teal), as in the SVG.
  const stops = [
    [0.0, new THREE.Color('#ffffff')],
    [0.35, new THREE.Color(colors.primaryFixed)],
    [0.7, new THREE.Color(colors.primaryContainer)],
    [1.0, new THREE.Color('#006a67')],
  ];
  const col = new Float32Array(p.count * 3);
  const c = new THREE.Color();
  for (let i = 0; i < p.count; i++) {
    const t = Math.min(1, Math.max(0, ((-p.getX(i)) * 0.55 + (1.0 - p.getY(i)) * 0.5) / 1.5 + 0.22));
    let k = 0;
    while (k < stops.length - 2 && t > stops[k + 1][0]) k++;
    const [t0, c0] = stops[k];
    const [t1, c1] = stops[k + 1];
    c.copy(c0).lerp(c1, Math.min(1, Math.max(0, (t - t0) / (t1 - t0))));
    col.set([c.r, c.g, c.b], i * 3);
  }
  geo.setAttribute('color', new THREE.BufferAttribute(col, 3));
  return geo;
}

export function createTooth(colors) {
  const group = new THREE.Group();
  const geo = buildBody(colors);
  const material = new THREE.MeshPhysicalMaterial({
    color: 0xffffff,
    vertexColors: true,
    roughness: 0.2,
    metalness: 0,
    clearcoat: 1,
    clearcoatRoughness: 0.05,
    iridescence: 0.5,
    iridescenceIOR: 1.3,
    iridescenceThicknessMinimum: 180,
    iridescenceThicknessMaximum: 480,
    sheen: 0.5,
    sheenColor: new THREE.Color(colors.primaryFixed),
    sheenRoughness: 0.35,
    envMapIntensity: 0.85,
  });
  const body = new THREE.Mesh(geo, material);
  group.add(body);

  // Faint teal shell for a soft inner-glow feel
  const glowMat = new THREE.MeshBasicMaterial({ color: new THREE.Color(colors.primaryFixed), transparent: true, opacity: 0.07, side: THREE.BackSide, depthWrite: false });
  const glow = new THREE.Mesh(geo, glowMat);
  glow.scale.setScalar(1.07);
  group.add(glow);

  return {
    object: group,
    update(dt, ctx) {
      glowMat.opacity = 0.05 + ctx.glow * 0.08;
    },
    dispose() {
      geo.dispose();
      material.dispose();
      glowMat.dispose();
    },
  };
}

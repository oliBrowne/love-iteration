import type * as THREE from 'three';
import { mix } from '../../ascii/helpers';
import type { SceneSetup } from '../../three/stage';
import {
  SKY,
  hillHeight,
  lanternPose,
  makeLanterns,
  nightAt,
  noNudge,
  pushNudge,
  stepNudge,
  type Nudge,
} from './lanterns';

type Three = typeof THREE;

const FOV_TAN = Math.tan((50 / 2) * (Math.PI / 180));
const CAMERA_Z = 5;
const halfHeightAt = (z: number) => (CAMERA_Z - z) * FOV_TAN;

/** A soft round glow, drawn once on a small canvas so no image has to be downloaded. */
function glowTexture(three: Three): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = 64;
  const g = canvas.getContext('2d');
  if (g) {
    const gradient = g.createRadialGradient(32, 32, 0, 32, 32, 32);
    gradient.addColorStop(0, 'rgba(255,255,255,1)');
    gradient.addColorStop(0.25, 'rgba(255,255,255,0.45)');
    gradient.addColorStop(1, 'rgba(255,255,255,0)');
    g.fillStyle = gradient;
    g.fillRect(0, 0, 64, 64);
  }
  return new three.CanvasTexture(canvas);
}

/** The scene: dusk sky and stars, a moon, three hills with one lit window, and the lanterns. */
export const setupLanterns: SceneSetup = ({
  three,
  scene,
  camera,
  renderer,
}) => {
  const glow = glowTexture(three);
  const seeds = makeLanterns();
  const nudges: Nudge[] = seeds.map(noNudge);
  const tmp = new three.Color();
  const topA = new three.Color(SKY.duskTop);
  const topB = new three.Color(SKY.nightTop);
  const horA = new three.Color(SKY.duskHorizon);
  const horB = new three.Color(SKY.nightHorizon);

  // Sky: one plane at the back with a colour at each corner.
  const skyGeometry = new three.PlaneGeometry(2, 2);
  skyGeometry.setAttribute(
    'color',
    new three.BufferAttribute(new Float32Array(12), 3),
  );
  const sky = new three.Mesh(
    skyGeometry,
    new three.MeshBasicMaterial({ vertexColors: true, depthWrite: false }),
  );
  sky.position.z = -22;
  scene.add(sky);

  // Stars: a scatter of points that arrive with the night and twinkle a little.
  const starCount = 170;
  const starPositions = new Float32Array(starCount * 3);
  const starColors = new Float32Array(starCount * 3);
  for (let i = 0; i < starCount; i++) {
    const a = Math.sin(i * 12.9898) * 43758.5453;
    const b = Math.sin(i * 78.233) * 12345.678;
    starPositions[i * 3] = (a - Math.floor(a)) * 2 - 1;
    starPositions[i * 3 + 1] = (b - Math.floor(b)) * 0.95 - 0.05;
    starPositions[i * 3 + 2] = -20;
  }
  const starGeometry = new three.BufferGeometry();
  starGeometry.setAttribute(
    'position',
    new three.BufferAttribute(starPositions, 3),
  );
  starGeometry.setAttribute('color', new three.BufferAttribute(starColors, 3));
  const stars = new three.Points(
    starGeometry,
    new three.PointsMaterial({
      size: 2.2,
      sizeAttenuation: false,
      vertexColors: true,
      transparent: true,
      blending: three.AdditiveBlending,
      depthWrite: false,
    }),
  );
  scene.add(stars);

  // Moon with a halo.
  const moon = new three.Group();
  moon.position.z = -19;
  const halo = new three.Sprite(
    new three.SpriteMaterial({
      map: glow,
      color: 0xfff1c9,
      transparent: true,
      blending: three.AdditiveBlending,
      depthWrite: false,
    }),
  );
  halo.scale.set(5.5, 5.5, 1);
  moon.add(halo);
  moon.add(
    new three.Mesh(
      new three.CircleGeometry(0.62, 32),
      new three.MeshBasicMaterial({ color: 0xfff6dc }),
    ),
  );
  scene.add(moon);

  // Hills: three dark silhouettes, nearer ones darker and taller on the page.
  const hillDepths = [-14, -9, -5];
  const hillColors = [0x4a3563, 0x2d2447, 0x17142e];
  const hills = hillDepths.map((z, layer) => {
    const points = 48;
    const positions: number[] = [];
    const indices: number[] = [];
    for (let i = 0; i <= points; i++) {
      const x = (i / points) * 2 - 1;
      positions.push(x, hillHeight(x * 1.5, layer), 0, x, -1.2, 0);
      if (i < points) {
        const k = i * 2;
        indices.push(k, k + 1, k + 2, k + 1, k + 3, k + 2);
      }
    }
    const geometry = new three.BufferGeometry();
    geometry.setAttribute(
      'position',
      new three.Float32BufferAttribute(positions, 3),
    );
    geometry.setIndex(indices);
    const mesh = new three.Mesh(
      geometry,
      new three.MeshBasicMaterial({
        color: hillColors[layer] ?? 0,
        side: three.DoubleSide,
      }),
    );
    mesh.position.z = z;
    scene.add(mesh);
    return mesh;
  });

  // A tiny cottage window glowing on the middle hill. A scene, not anyone's house.
  const window_ = new three.Sprite(
    new three.SpriteMaterial({
      map: glow,
      color: 0xffc977,
      transparent: true,
      blending: three.AdditiveBlending,
      depthWrite: false,
    }),
  );
  window_.position.z = -8.9;
  scene.add(window_);

  // Lanterns: a paper body shaded from a bright base to a dim top, with a flame glow.
  const bodyGeometry = new three.CylinderGeometry(0.19, 0.27, 0.46, 4, 3, true);
  bodyGeometry.rotateY(Math.PI / 4);
  const bodyShade: number[] = [];
  const bodyPositions = bodyGeometry.getAttribute('position');
  for (let i = 0; i < bodyPositions.count; i++) {
    const h = (bodyPositions.getY(i) + 0.23) / 0.46; // 0 base, 1 top
    const shade = mix(1, 0.38, h);
    bodyShade.push(shade, shade, shade);
  }
  bodyGeometry.setAttribute(
    'color',
    new three.Float32BufferAttribute(bodyShade, 3),
  );
  const rimGeometry = new three.BoxGeometry(0.2, 0.025, 0.2);

  const lanterns = seeds.map((seed) => {
    const group = new three.Group();
    const honey = tmp.setHSL(mix(0.095, 0.03, seed.warmth), 0.9, 0.62).clone();
    const body = new three.Mesh(
      bodyGeometry,
      new three.MeshBasicMaterial({
        color: honey,
        vertexColors: true,
        transparent: true,
        side: three.DoubleSide,
        depthWrite: false,
      }),
    );
    const rim = new three.Mesh(
      rimGeometry,
      new three.MeshBasicMaterial({ color: 0x5a3b2e, transparent: true }),
    );
    rim.position.y = 0.235;
    const flame = new three.Sprite(
      new three.SpriteMaterial({
        map: glow,
        color: honey,
        transparent: true,
        blending: three.AdditiveBlending,
        depthWrite: false,
      }),
    );
    flame.position.y = -0.04;
    group.add(body, rim, flame);
    group.scale.setScalar(seed.size * 0.68);
    scene.add(group);
    return { group, body, rim, flame };
  });

  // Embers: two sparks per lantern that drift down and fade as they fall.
  const emberCount = seeds.length * 2;
  const emberPositions = new Float32Array(emberCount * 3);
  const emberColors = new Float32Array(emberCount * 3);
  const emberGeometry = new three.BufferGeometry();
  emberGeometry.setAttribute(
    'position',
    new three.BufferAttribute(emberPositions, 3),
  );
  emberGeometry.setAttribute(
    'color',
    new three.BufferAttribute(emberColors, 3),
  );
  const embers = new three.Points(
    emberGeometry,
    new three.PointsMaterial({
      size: 3,
      sizeAttenuation: false,
      vertexColors: true,
      transparent: true,
      blending: three.AdditiveBlending,
      depthWrite: false,
    }),
  );
  embers.frustumCulled = false;
  scene.add(embers);

  // Touch: a swipe nudges nearby lanterns and a tap puffs them away from the finger.
  const canvas = renderer.domElement;
  canvas.style.touchAction = 'none';
  let aspect = 1;
  let last: { x: number; y: number } | null = null;
  const toScreen = (event: PointerEvent) => {
    const rect = canvas.getBoundingClientRect();
    return {
      x: ((event.clientX - rect.left) / rect.width) * 2 - 1,
      y: 1 - ((event.clientY - rect.top) / rect.height) * 2,
    };
  };
  const nudgeAt = (
    pointer: { x: number; y: number },
    move: { dx: number; dy: number },
  ) => {
    seeds.forEach((seed, i) => {
      const pose = lanternPose(seed, currentTime);
      const base = nudges[i];
      if (!pose.visible || !base) return;
      nudges[i] = pushNudge(
        base,
        { x: pose.x + base.ox, y: pose.y + base.oy },
        pointer,
        move,
        aspect,
      );
    });
  };
  const onDown = (event: PointerEvent) => {
    last = toScreen(event);
    nudgeAt(last, { dx: 0, dy: 0 });
  };
  const onMove = (event: PointerEvent) => {
    const now = toScreen(event);
    if (last && (event.buttons || event.pointerType === 'touch')) {
      nudgeAt(now, { dx: now.x - last.x, dy: now.y - last.y });
    }
    last = now;
  };
  const onLeave = () => {
    last = null;
  };
  canvas.addEventListener('pointerdown', onDown);
  canvas.addEventListener('pointermove', onMove);
  canvas.addEventListener('pointerup', onLeave);
  canvas.addEventListener('pointerleave', onLeave);

  let currentTime = 0;

  function update(t: number, dt: number) {
    currentTime = t;
    aspect = Math.max(camera.aspect, 0.2);
    const night = nightAt(t);
    const w = (z: number) => halfHeightAt(z) * aspect;

    // Sky colours at the four corners.
    const color = skyGeometry.getAttribute('color');
    tmp.copy(topA).lerp(topB, night);
    for (const i of [0, 1]) color.setXYZ(i, tmp.r, tmp.g, tmp.b);
    tmp.copy(horA).lerp(horB, night);
    for (const i of [2, 3]) color.setXYZ(i, tmp.r, tmp.g, tmp.b);
    color.needsUpdate = true;
    sky.scale.set(w(-22) * 1.02, halfHeightAt(-22) * 1.02, 1);

    // Stars arrive with the night.
    const starColor = starGeometry.getAttribute('color');
    const starPosition = starGeometry.getAttribute('position');
    for (let i = 0; i < starCount; i++) {
      const twinkle = 0.65 + 0.35 * Math.sin(t * (0.8 + (i % 7) * 0.35) + i);
      const level =
        Math.max(
          0,
          night * 1.25 - 0.3 - (starPosition.getY(i) < 0.1 ? 0.25 : 0),
        ) * twinkle;
      starColor.setXYZ(i, level, level * 0.95, level * 0.85);
      starPosition.setXY(
        i,
        (starPositions[i * 3] ?? 0) * w(-20),
        (starPositions[i * 3 + 1] ?? 0) * halfHeightAt(-20),
      );
    }
    starColor.needsUpdate = true;
    starPosition.needsUpdate = true;

    moon.position.set(w(-19) * 0.58, halfHeightAt(-19) * 0.52, -19);
    moon.scale.setScalar(0.8 + 0.2 * night);
    const moonLevel = 0.25 + 0.75 * night;
    (halo.material as THREE.SpriteMaterial).opacity = 0.35 * moonLevel;
    moon.children[1]?.scale.setScalar(1);
    ((moon.children[1] as THREE.Mesh).material as THREE.MeshBasicMaterial).color
      .setRGB(1, 0.96, 0.86)
      .multiplyScalar(0.55 + 0.45 * night);

    // Hills darken a little with the night.
    hills.forEach((hill, layer) => {
      const z = hillDepths[layer] ?? -10;
      hill.scale.set(w(z) * 1.05, halfHeightAt(z), 1);
      const base = hillColors[layer] ?? 0;
      (hill.material as THREE.MeshBasicMaterial).color
        .setHex(base)
        .multiplyScalar(1 - 0.35 * night);
    });
    window_.position.set(
      w(-8.9) * -0.55,
      halfHeightAt(-8.9) * (hillHeight(-0.55 * 1.5, 1) + 0.045),
      -8.9,
    );
    window_.scale.setScalar(0.28 + 0.03 * Math.sin(t * 3));
    (window_.material as THREE.SpriteMaterial).opacity = 0.35 + 0.65 * night;

    // Lanterns.
    seeds.forEach((seed, i) => {
      const item = lanterns[i];
      let nudge = nudges[i];
      if (!item || !nudge) return;
      nudge = stepNudge(nudge, dt);
      nudges[i] = nudge;
      const pose = lanternPose(seed, t);
      item.group.visible = pose.visible;
      if (!pose.visible) return;
      const z = mix(-6, 0.4, seed.depth);
      const half = halfHeightAt(z);
      item.group.position.set(
        (pose.x + nudge.ox) * half * aspect,
        (pose.y + nudge.oy) * half,
        z,
      );
      item.group.rotation.z = pose.tilt + nudge.vx * 0.25;
      const bright = Math.min(1.4, pose.glow + nudge.flare * 0.5);
      const body = item.body.material as THREE.MeshBasicMaterial;
      body.opacity = pose.alpha * (0.55 + 0.45 * Math.min(1, bright));
      (item.rim.material as THREE.MeshBasicMaterial).opacity = pose.alpha;
      const flame = item.flame.material as THREE.SpriteMaterial;
      flame.opacity = pose.alpha * Math.min(1, bright) * (0.4 + 0.3 * night);
      item.flame.scale.setScalar(1.5 + 0.5 * nudge.flare + 0.1 * bright);

      for (let k = 0; k < 2; k++) {
        const e = i * 2 + k;
        const phase = (t * 0.35 + seed.swayPhase * 0.3 + k * 0.5) % 1;
        const drift = Math.sin(t * 1.3 + k * 3 + i) * 0.04;
        emberPositions[e * 3] =
          item.group.position.x + drift + (k ? 0.05 : -0.05);
        emberPositions[e * 3 + 1] =
          item.group.position.y - 0.25 - phase * 0.7 * seed.size;
        emberPositions[e * 3 + 2] = z;
        const level = (1 - phase) * pose.alpha * Math.min(1, pose.glow) * 0.8;
        emberColors[e * 3] = level;
        emberColors[e * 3 + 1] = level * 0.62;
        emberColors[e * 3 + 2] = level * 0.3;
      }
    });
    // Hidden lanterns leave their embers dark.
    seeds.forEach((seed, i) => {
      if (lanternPose(seed, t).visible) return;
      for (let k = 0; k < 2; k++) {
        const e = (i * 2 + k) * 3;
        emberColors[e] = emberColors[e + 1] = emberColors[e + 2] = 0;
      }
    });
    emberGeometry.getAttribute('position').needsUpdate = true;
    emberGeometry.getAttribute('color').needsUpdate = true;
  }

  return {
    update,
    dispose() {
      canvas.removeEventListener('pointerdown', onDown);
      canvas.removeEventListener('pointermove', onMove);
      canvas.removeEventListener('pointerup', onLeave);
      canvas.removeEventListener('pointerleave', onLeave);
      bodyGeometry.dispose();
      rimGeometry.dispose();
      glow.dispose();
    },
  };
};

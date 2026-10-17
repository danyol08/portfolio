import { clamp, lerp, smoothstep } from "../hooks/scrollBus.js";

/**
 * Hero scene: the portfolio's real project screenshots as lit, glossy screens.
 *
 *  - p = 0  : the screens are stacked like a cascading deck, angled toward the copy
 *  - p -> 1 : the deck separates and fans out while the camera pushes in
 *
 * `progressRef.current` is { p: 0..1, active: boolean } and is written by the Hero
 * section on scroll. Nothing here goes through React state, so scrolling never
 * triggers a re-render.
 *
 * Three.js is imported dynamically so it stays out of the main bundle.
 */

const SCREEN_W = 3.6;
const SCREEN_ASPECT = 2.03; // the screenshots are ~1913 x 940
const SCREEN_H = SCREEN_W / SCREEN_ASPECT;
const BEZEL = 0.055;
const FLOOR_Y = -2.5;
const FOV = 32;

/* ---- target poses ------------------------------------------------------ */

function deckPose(i) {
  return { x: -0.55 + i * 0.36, y: -0.35 + i * 0.34, z: -i * 0.9, ry: -0.36, rx: 0.04 };
}

const FAN_LANDSCAPE = [
  { x: -2.15, y: -0.85, z: 0.6, ry: 0.2, rx: 0.02 },
  { x: 2.15, y: -1.05, z: 0.0, ry: -0.2, rx: 0.02 },
  { x: -2.0, y: 1.25, z: -1.0, ry: 0.18, rx: 0.02 },
  { x: 2.1, y: 1.1, z: -1.4, ry: -0.18, rx: 0.02 },
];
const FAN_PORTRAIT = [
  { x: -0.3, y: -1.9, z: 0.9, ry: 0.16, rx: 0.02 },
  { x: 0.3, y: -0.65, z: 0.3, ry: -0.16, rx: 0.02 },
  { x: -0.3, y: 0.6, z: -0.3, ry: 0.16, rx: 0.02 },
  { x: 0.3, y: 1.85, z: -0.9, ry: -0.16, rx: 0.02 },
];

const damp = (current, target, lambda, dt) => lerp(current, target, 1 - Math.exp(-lambda * dt));

export async function createHeroScene({ mount, covers, progressRef, coarse, onReady, onFail }) {
  const THREE = await import("three");
  const { RoomEnvironment } = await import("three/examples/jsm/environments/RoomEnvironment.js");

  /* ---- renderer ------------------------------------------------------- */
  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({
      antialias: !coarse,
      alpha: true,
      powerPreference: "high-performance",
    });
  } catch {
    onFail?.();
    return () => {};
  }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, coarse ? 1.5 : 2));
  renderer.setClearColor(0x000000, 0);
  const canvas = renderer.domElement;
  mount.appendChild(canvas);

  let disposed = false;
  let raf = 0;
  let ro = null;
  let onPointerMove = null;
  const disposables = [];
  const track = (obj) => (disposables.push(obj), obj);

  const onContextLost = (e) => {
    e.preventDefault();
    if (!disposed) onFail?.();
  };
  canvas.addEventListener("webglcontextlost", onContextLost);

  /* ---- scene, camera, studio lighting --------------------------------- */
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(FOV, 1, 0.1, 60);
  camera.position.set(0, 1.6, 11);

  // Procedural "photo studio" environment: gives the bezels real reflections.
  const pmrem = new THREE.PMREMGenerator(renderer);
  const roomEnv = new RoomEnvironment();
  const envRT = pmrem.fromScene(roomEnv, 0.04);
  scene.environment = envRT.texture;
  scene.environmentIntensity = 0.85;
  roomEnv.traverse((o) => {
    o.geometry?.dispose?.();
    o.material?.dispose?.();
  });
  pmrem.dispose();

  const key = new THREE.DirectionalLight(0xffffff, 1.1);
  key.position.set(3, 5, 6);
  scene.add(key);

  /* ---- geometry helpers ----------------------------------------------- */
  function roundedRect(w, h, r) {
    const s = new THREE.Shape();
    const x = -w / 2;
    const y = -h / 2;
    s.moveTo(x + r, y);
    s.lineTo(x + w - r, y);
    s.absarc(x + w - r, y + r, r, -Math.PI / 2, 0, false);
    s.lineTo(x + w, y + h - r);
    s.absarc(x + w - r, y + h - r, r, 0, Math.PI / 2, false);
    s.lineTo(x + r, y + h);
    s.absarc(x + r, y + h - r, r, Math.PI / 2, Math.PI, false);
    s.lineTo(x, y + r);
    s.absarc(x + r, y + r, r, Math.PI, Math.PI * 1.5, false);
    return s;
  }

  const curveSegments = coarse ? 6 : 12;

  const screenGeo = track(new THREE.ShapeGeometry(roundedRect(SCREEN_W, SCREEN_H, 0.09), curveSegments));
  {
    // ShapeGeometry UVs are in shape units; remap to 0..1 so the screenshot fills the screen.
    const pos = screenGeo.attributes.position;
    const uv = screenGeo.attributes.uv;
    for (let i = 0; i < pos.count; i++) {
      uv.setXY(i, pos.getX(i) / SCREEN_W + 0.5, pos.getY(i) / SCREEN_H + 0.5);
    }
    uv.needsUpdate = true;
  }

  const bezelGeo = track(
    new THREE.ExtrudeGeometry(roundedRect(SCREEN_W + BEZEL * 2, SCREEN_H + BEZEL * 2, 0.13), {
      depth: 0.07,
      bevelEnabled: true,
      bevelThickness: 0.012,
      bevelSize: 0.012,
      bevelSegments: 2,
      curveSegments,
    })
  );
  bezelGeo.translate(0, 0, -0.07);

  const bezelMat = track(
    new THREE.MeshStandardMaterial({ color: 0x111a2e, metalness: 0.75, roughness: 0.3 })
  );

  /* ---- textures ------------------------------------------------------- */
  function loadScreenTexture(src) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.decoding = "async";
      img.onload = () => {
        const maxW = coarse ? 1024 : 1600;
        const scale = Math.min(1, maxW / img.naturalWidth);
        const c = document.createElement("canvas");
        c.width = Math.round(img.naturalWidth * scale);
        c.height = Math.round(img.naturalHeight * scale);
        c.getContext("2d").drawImage(img, 0, 0, c.width, c.height);
        const t = track(new THREE.CanvasTexture(c));
        t.colorSpace = THREE.SRGBColorSpace;
        t.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());
        resolve(t);
      };
      img.onerror = reject;
      img.src = src;
    });
  }

  function makeSheenTexture() {
    const c = document.createElement("canvas");
    c.width = 256;
    c.height = 128;
    const g = c.getContext("2d");
    g.translate(128, 64);
    g.rotate(-0.5);
    g.translate(-128, -64);
    const grad = g.createLinearGradient(0, 0, 256, 0);
    grad.addColorStop(0, "rgba(255,255,255,0)");
    grad.addColorStop(0.36, "rgba(255,255,255,0)");
    grad.addColorStop(0.5, "rgba(255,255,255,0.5)");
    grad.addColorStop(0.64, "rgba(255,255,255,0)");
    grad.addColorStop(1, "rgba(255,255,255,0)");
    g.fillStyle = grad;
    g.fillRect(-120, -120, 500, 360);
    const t = track(new THREE.CanvasTexture(c));
    t.colorSpace = THREE.SRGBColorSpace;
    return t;
  }

  function makeShadowTexture() {
    const c = document.createElement("canvas");
    c.width = c.height = 128;
    const g = c.getContext("2d");
    const grad = g.createRadialGradient(64, 64, 0, 64, 64, 64);
    grad.addColorStop(0, "rgba(11,18,32,0.6)");
    grad.addColorStop(0.45, "rgba(11,18,32,0.24)");
    grad.addColorStop(1, "rgba(11,18,32,0)");
    g.fillStyle = grad;
    g.fillRect(0, 0, 128, 128);
    return track(new THREE.CanvasTexture(c));
  }

  let screenTextures;
  try {
    screenTextures = await Promise.all(covers.map((c) => loadScreenTexture(c.src)));
  } catch {
    if (!disposed) onFail?.();
    cleanup();
    return () => {};
  }
  if (disposed) {
    cleanup();
    return () => {};
  }

  /* ---- assemble ------------------------------------------------------- */
  const rig = new THREE.Group(); // position + scale of the whole composition
  const tilt = new THREE.Group(); // cursor-driven rotation
  rig.add(tilt);
  scene.add(rig);

  const sheenBase = makeSheenTexture();
  const shadowTex = makeShadowTexture();
  const shadowGeo = track(new THREE.PlaneGeometry(1, 1));

  const items = screenTextures.map((tex, i) => {
    const group = new THREE.Group();

    const bezel = new THREE.Mesh(bezelGeo, bezelMat);
    const screen = new THREE.Mesh(
      screenGeo,
      track(new THREE.MeshBasicMaterial({ map: tex, toneMapped: false }))
    );
    screen.position.z = 0.016;

    const sheenTex = track(sheenBase.clone());
    sheenTex.needsUpdate = true;
    const sheen = new THREE.Mesh(
      screenGeo,
      track(
        new THREE.MeshBasicMaterial({
          map: sheenTex,
          transparent: true,
          opacity: 0.4,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
          toneMapped: false,
        })
      )
    );
    sheen.position.z = 0.0175;
    sheen.renderOrder = 2;

    group.add(bezel, screen, sheen);
    tilt.add(group);

    const shadow = new THREE.Mesh(
      shadowGeo,
      track(new THREE.MeshBasicMaterial({ map: shadowTex, transparent: true, depthWrite: false, opacity: 0.3 }))
    );
    shadow.rotation.x = -Math.PI / 2;
    shadow.position.y = FLOOR_Y;
    shadow.renderOrder = -1;
    rig.add(shadow);

    return { group, shadow, sheenTex, phase: i * 1.37 };
  });

  /* ---- layout (responsive composition) -------------------------------- */
  const layoutState = { portrait: false, baseScale: 1, baseX: 0, baseY: 0, fanScale: 1, fanY: 0, aspect: 1 };

  function layout() {
    const w = Math.max(1, mount.clientWidth);
    const h = Math.max(1, mount.clientHeight);
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();

    const aspect = w / h;
    const dist = 11;
    const halfH = Math.tan((FOV * Math.PI) / 360) * dist;
    const halfW = halfH * aspect;
    const portrait = aspect < 0.95;
    layoutState.aspect = aspect;
    layoutState.portrait = portrait;

    if (!portrait) {
      layoutState.baseScale = Math.min(1.2, (halfW * 2 * 0.54) / 4.9);
      layoutState.baseX = halfW * 0.4;
      layoutState.baseY = 0.25;
      layoutState.fanScale = Math.min(1, (halfW * 2 * 0.84) / 7.9, (halfH * 2 * 0.8) / 3.9);
      layoutState.fanY = 0;
    } else {
      layoutState.baseScale = Math.min(1, (halfW * 2 * 0.8) / 4.7);
      layoutState.baseX = 0;
      layoutState.baseY = halfH * 0.3;
      layoutState.fanScale = Math.min(1, (halfW * 2 * 0.86) / 4.2);
      layoutState.fanY = halfH * 0.12;
    }
  }
  layout();
  ro = new ResizeObserver(layout);
  ro.observe(mount);

  /* ---- pointer (mouse only; touch devices get a gentle autonomous sway) */
  const pointer = { x: 0, y: 0, sx: 0, sy: 0 };
  onPointerMove = (e) => {
    pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
    pointer.y = (e.clientY / window.innerHeight) * 2 - 1;
  };
  if (!coarse) window.addEventListener("pointermove", onPointerMove, { passive: true });

  /* ---- render loop ---------------------------------------------------- */
  const smooth = { p: progressRef.current?.p ?? 0 };
  let last = performance.now();
  let t = 0;
  let announced = false;

  const n = items.length;

  function frame(now) {
    raf = requestAnimationFrame(frame);
    const state = progressRef.current || { p: 0, active: true };
    if (disposed) return;
    if (!state.active || document.hidden) {
      last = now;
      return;
    }

    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    t += dt;

    smooth.p = damp(smooth.p, state.p, 7, dt);
    const p = smooth.p;

    if (coarse) {
      pointer.x = Math.sin(t * 0.35) * 0.5;
      pointer.y = Math.cos(t * 0.27) * 0.3;
    }
    pointer.sx = damp(pointer.sx, pointer.x, 3.5, dt);
    pointer.sy = damp(pointer.sy, pointer.y, 3.5, dt);

    const L = layoutState;
    const eGroup = smoothstep(clamp(p));

    // camera: slow push-in and drop toward eye level as the deck opens
    camera.position.set(0, lerp(1.6, 0.7, eGroup), lerp(11, 10.2, eGroup));
    camera.lookAt(0, lerp(-0.1, 0, eGroup), 0);

    rig.position.set(
      lerp(L.baseX, 0, eGroup),
      lerp(L.baseY, L.fanY, eGroup),
      0
    );
    const scale = lerp(L.baseScale, L.fanScale, eGroup);
    rig.scale.setScalar(scale);

    tilt.rotation.y = pointer.sx * 0.14;
    tilt.rotation.x = pointer.sy * 0.06;

    const fan = L.portrait ? FAN_PORTRAIT : FAN_LANDSCAPE;

    for (let i = 0; i < n; i++) {
      const it = items[i];
      const e = smoothstep(clamp((p - i * 0.05) / 0.8));
      const a = deckPose(i);
      const b = fan[i % fan.length];

      // nearer screens drift further with the cursor than distant ones
      const depthFactor = 1 - i / n;
      const bob = Math.sin(t * 0.8 + it.phase) * 0.06;

      const x = lerp(a.x, b.x, e) + pointer.sx * 0.38 * depthFactor;
      const y = lerp(a.y, b.y, e) + bob - pointer.sy * 0.14 * depthFactor;
      const z = lerp(a.z, b.z, e);

      it.group.position.set(x, y, z);
      it.group.rotation.set(
        lerp(a.rx, b.rx, e),
        lerp(a.ry, b.ry, e),
        Math.sin(t * 0.5 + it.phase) * 0.008
      );

      // reflection sweeps across the glass as the view angle changes
      const yaw = it.group.rotation.y + tilt.rotation.y;
      it.sheenTex.offset.x = clamp(-yaw * 1.9 - pointer.sx * 0.25 + Math.sin(t * 0.3 + it.phase) * 0.06, -0.95, 0.95);

      // contact shadow tracks the screen, softens as it rises
      const height = y - FLOOR_Y;
      const spread = 1 + height * 0.05;
      it.shadow.position.set(x, FLOOR_Y, z - 0.3);
      it.shadow.scale.set(SCREEN_W * 1.45 * spread, SCREEN_H * 1.75 * spread, 1);
      it.shadow.material.opacity = clamp(0.5 - height * 0.075, 0.07, 0.34);
    }

    renderer.render(scene, camera);

    if (!announced) {
      announced = true;
      onReady?.();
    }
  }
  raf = requestAnimationFrame(frame);

  /* ---- teardown ------------------------------------------------------- */
  function cleanup() {
    disposed = true;
    cancelAnimationFrame(raf);
    ro?.disconnect();
    if (onPointerMove) window.removeEventListener("pointermove", onPointerMove);
    canvas.removeEventListener("webglcontextlost", onContextLost);
    disposables.forEach((d) => d.dispose?.());
    envRT?.dispose?.();
    renderer.dispose();
    renderer.forceContextLoss?.();
    if (canvas.parentNode === mount) mount.removeChild(canvas);
  }

  return cleanup;
}

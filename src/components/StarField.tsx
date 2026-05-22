"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

const STAR_COUNT = 9000;
const MILKY_WAY_COUNT = 2200;
const ASTEROID_COUNT = 3600;
const METEOR_COUNT = 5;

type Meteor = {
  mesh: THREE.Line;
  speed: number;
  baseX: number;
  baseY: number;
  offset: number;
};

type CStarData = {
  sprite: THREE.Sprite;
  basePos: THREE.Vector3;
};

function makeCircleTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 64;
  canvas.height = 64;

  const context = canvas.getContext("2d");
  if (!context) return null;

  const gradient = context.createRadialGradient(32, 32, 0, 32, 32, 32);
  gradient.addColorStop(0, "rgba(255,255,255,1)");
  gradient.addColorStop(0.12, "rgba(242,246,255,0.82)");
  gradient.addColorStop(0.28, "rgba(176,198,238,0.18)");
  gradient.addColorStop(1, "rgba(176,198,238,0)");

  context.fillStyle = gradient;
  context.fillRect(0, 0, 64, 64);

  return new THREE.CanvasTexture(canvas);
}

function makeConstellationStarTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 48;
  canvas.height = 48;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  const grad = ctx.createRadialGradient(24, 24, 0, 24, 24, 24);
  grad.addColorStop(0, "rgba(255,230,140,1)");
  grad.addColorStop(0.25, "rgba(255,210,100,0.72)");
  grad.addColorStop(0.55, "rgba(240,180,60,0.22)");
  grad.addColorStop(1, "rgba(200,150,40,0)");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 48, 48);

  return new THREE.CanvasTexture(canvas);
}

function makeGalaxyTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 1024;

  const context = canvas.getContext("2d");
  if (!context) return null;

  const image = context.createImageData(canvas.width, canvas.height);
  const centerX = canvas.width * 0.5;
  const centerY = canvas.height * 0.5;

  for (let y = 0; y < canvas.height; y += 1) {
    for (let x = 0; x < canvas.width; x += 1) {
      const dx = (x - centerX) / canvas.width;
      const dy = (y - centerY) / canvas.height;
      const band = Math.exp(-(dx * dx * 8 + dy * dy * 72));
      const dust = Math.random() * band;
      const warm = Math.exp(-((dx + 0.08) * (dx + 0.08) * 18 + dy * dy * 48));
      const cool = Math.exp(-((dx - 0.12) * (dx - 0.12) * 14 + dy * dy * 58));
      const alpha = Math.min(255, (band * 70 + dust * 120) | 0);
      const i = (y * canvas.width + x) * 4;

      image.data[i] = Math.min(255, 130 + warm * 90 + dust * 110);
      image.data[i + 1] = Math.min(255, 145 + band * 80 + dust * 90);
      image.data[i + 2] = Math.min(255, 190 + cool * 65 + dust * 65);
      image.data[i + 3] = alpha;
    }
  }

  context.putImageData(image, 0, 0);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function createStarField(texture: THREE.Texture | null) {
  const positions = new Float32Array(STAR_COUNT * 3);
  const colors = new Float32Array(STAR_COUNT * 3);
  const sizes = new Float32Array(STAR_COUNT);
  const palette = [
    new THREE.Color("#ffffff"),
    new THREE.Color("#dbe8ff"),
    new THREE.Color("#9fbfff"),
    new THREE.Color("#ffe2b8"),
  ];

  for (let index = 0; index < STAR_COUNT; index += 1) {
    const radius = 44 + Math.random() * 150;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(THREE.MathUtils.randFloatSpread(2));
    const i = index * 3;

    positions[i] = radius * Math.sin(phi) * Math.cos(theta);
    positions[i + 1] = radius * Math.sin(phi) * Math.sin(theta) * 0.68;
    positions[i + 2] = -Math.abs(radius * Math.cos(phi)) - 10;

    const color = palette[Math.floor(Math.random() * palette.length)].clone();
    color.multiplyScalar(0.55 + Math.random() * 0.55);
    colors[i] = color.r;
    colors[i + 1] = color.g;
    colors[i + 2] = color.b;
    sizes[index] = Math.random() > 0.965 ? 1.2 + Math.random() * 0.65 : 0.3 + Math.random() * 0.42;
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
  geometry.setAttribute("size", new THREE.BufferAttribute(sizes, 1));

  const material = new THREE.PointsMaterial({
    size: 0.42,
    map: texture ?? undefined,
    vertexColors: true,
    transparent: true,
    opacity: 0.9,
    depthWrite: false,
    blending: THREE.NormalBlending,
  });

  return new THREE.Points(geometry, material);
}

function createMilkyWay(texture: THREE.Texture | null) {
  const positions = new Float32Array(MILKY_WAY_COUNT * 3);
  const colors = new Float32Array(MILKY_WAY_COUNT * 3);
  const palette = [new THREE.Color("#6f8fff"), new THREE.Color("#ffffff"), new THREE.Color("#ffd8a8")];

  for (let index = 0; index < MILKY_WAY_COUNT; index += 1) {
    const i = index * 3;
    const band = THREE.MathUtils.randFloatSpread(112);
    const thickness = THREE.MathUtils.randFloatSpread(5.5);
    const depth = -56 - Math.random() * 58;
    const wave = Math.sin(band * 0.08) * 3.4;

    positions[i] = band;
    positions[i + 1] = thickness + wave;
    positions[i + 2] = depth + THREE.MathUtils.randFloatSpread(10);

    const color = palette[Math.floor(Math.random() * palette.length)].clone();
    color.multiplyScalar(0.2 + Math.random() * 0.34);
    colors[i] = color.r;
    colors[i + 1] = color.g;
    colors[i + 2] = color.b;
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

  const material = new THREE.PointsMaterial({
    size: 0.78,
    map: texture ?? undefined,
    vertexColors: true,
    transparent: true,
    opacity: 0.42,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });

  const points = new THREE.Points(geometry, material);
  points.rotation.z = -0.32;
  points.rotation.x = 0.08;
  return points;
}

function createGalaxyPlane(texture: THREE.Texture | null) {
  const material = new THREE.MeshBasicMaterial({
    map: texture ?? undefined,
    transparent: true,
    opacity: 0.86,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    side: THREE.DoubleSide,
  });
  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(92, 156), material);
  mesh.position.set(14, 0, -88);
  mesh.rotation.z = -0.28;
  mesh.rotation.y = -0.08;
  return mesh;
}

function createAsteroidBelt(texture: THREE.Texture | null) {
  const positions = new Float32Array(ASTEROID_COUNT * 3);
  const colors = new Float32Array(ASTEROID_COUNT * 3);
  const palette = [new THREE.Color("#7aa8ff"), new THREE.Color("#d4defa"), new THREE.Color("#f0c28b")];

  for (let index = 0; index < ASTEROID_COUNT; index += 1) {
    const i = index * 3;
    const angle = Math.random() * Math.PI * 2;
    const radius = 20 + Math.random() * 70;
    const eccentricity = 0.26 + Math.random() * 0.14;
    const wobble = THREE.MathUtils.randFloatSpread(1.9);

    positions[i] = Math.cos(angle) * radius * 1.55;
    positions[i + 1] = Math.sin(angle) * radius * eccentricity + wobble;
    positions[i + 2] = -32 - Math.random() * 48 + THREE.MathUtils.randFloatSpread(5);

    const color = palette[Math.floor(Math.random() * palette.length)].clone();
    color.multiplyScalar(0.5 + Math.random() * 0.48);
    colors[i] = color.r;
    colors[i + 1] = color.g;
    colors[i + 2] = color.b;
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

  const material = new THREE.PointsMaterial({
    size: 0.46,
    map: texture ?? undefined,
    vertexColors: true,
    transparent: true,
    opacity: 0.84,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });

  const belt = new THREE.Points(geometry, material);
  belt.rotation.x = 0.18;
  belt.rotation.z = -0.22;
  return belt;
}

function createOrbitRings() {
  const group = new THREE.Group();

  [12, 20, 31, 44, 61, 82, 108].forEach((radius, index) => {
    const curve = new THREE.EllipseCurve(0, 0, radius * 1.85, radius * 0.5, 0, Math.PI * 2);
    const points = curve.getPoints(240).map((point) => new THREE.Vector3(point.x - 4, point.y - 2, -38));
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const line = new THREE.LineLoop(
      geometry,
      new THREE.LineDashedMaterial({
        color: ["#7b40ff", "#00b7df", "#ff8b21", "#b750ff", "#2d6cff", "#e4592a", "#6dd3ff"][index],
        transparent: true,
        opacity: index < 4 ? 0.62 : 0.46,
        dashSize: 2.2 + index * 0.35,
        gapSize: 1.8 + index * 0.2,
        blending: THREE.AdditiveBlending,
      })
    );
    line.computeLineDistances();
    line.rotation.z = -0.18 + index * 0.045;
    line.rotation.x = 0.1;
    group.add(line);
  });

  return group;
}

function createSolarCore(texture: THREE.Texture | null) {
  const group = new THREE.Group();
  const core = new THREE.Mesh(
    new THREE.SphereGeometry(3.2, 48, 48),
    new THREE.MeshBasicMaterial({ color: "#fff8e8", transparent: true, opacity: 1 })
  );
  const makeHalo = (color: string, opacity: number, scale: number) => {
    const halo = new THREE.Sprite(
      new THREE.SpriteMaterial({
        map: texture ?? undefined,
        color,
        transparent: true,
        opacity,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      })
    );
    halo.scale.set(scale, scale, 1);
    return halo;
  };

  const position = new THREE.Vector3(-4, -2, -38);
  core.position.copy(position);
  const blueHalo = makeHalo("#9094ff", 0.85, 42);
  const goldHalo = makeHalo("#f0c544", 0.56, 68);
  const redHalo = makeHalo("#c84d35", 0.34, 106);
  blueHalo.position.copy(position);
  goldHalo.position.copy(position);
  redHalo.position.copy(position);
  group.add(redHalo, goldHalo, blueHalo, core);
  return group;
}

function createMeteors() {
  const meteors: Meteor[] = [];

  for (let index = 0; index < METEOR_COUNT; index += 1) {
    const geometry = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(-8 - index * 0.8, 3 + index * 0.35, 0),
    ]);
    const material = new THREE.LineBasicMaterial({
      color: index % 2 === 0 ? "#ffffff" : "#9fc0ff",
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
    });
    const mesh = new THREE.Line(geometry, material);
    mesh.position.z = -28 - index * 9;

    meteors.push({
      mesh,
      speed: 0.26 + Math.random() * 0.2,
      baseX: 66 + Math.random() * 48,
      baseY: 31 - Math.random() * 44,
      offset: Math.random() * 260,
    });
  }

  return meteors;
}

// ── Constellation definitions ─────────────────────────────────────────────────

const CONSTELLATION_DEFS: { stars: [number, number, number][]; lines: [number, number][] }[] = [
  // Celestial Crown — top center
  { stars: [[-3,28,-52],[4,32,-52],[9,28,-52],[6,23,-52],[0,23,-52]], lines: [[0,1],[1,2],[2,3],[3,4],[4,0]] },
  // The Hunter — upper right
  { stars: [[24,22,-50],[20,18,-50],[26,18,-50],[22,13,-50],[24,9,-50],[20,7,-50],[28,7,-50]], lines: [[0,1],[0,2],[1,3],[2,3],[3,4],[4,5],[4,6]] },
  // The Lyre — upper left
  { stars: [[-24,25,-48],[-20,22,-48],[-28,22,-48],[-22,17,-48],[-26,17,-48]], lines: [[0,1],[0,2],[1,3],[2,4],[3,4]] },
  // The Arrow — lower right
  { stars: [[30,-10,-55],[24,-10,-55],[18,-10,-55],[20,-7,-55],[20,-13,-55]], lines: [[0,1],[1,2],[2,3],[2,4]] },
  // The Vessel — lower left
  { stars: [[-32,-8,-50],[-28,-12,-50],[-24,-8,-50],[-28,-4,-50],[-26,-15,-50],[-30,-15,-50]], lines: [[0,1],[1,2],[2,3],[3,0],[1,4],[1,5],[4,5]] },
  // Southern Cross — far left
  { stars: [[-38,2,-52],[-38,8,-52],[-38,-4,-52],[-35,2,-52],[-41,2,-52]], lines: [[0,1],[0,2],[0,3],[0,4]] },
  // The Triangle — top right
  { stars: [[15,30,-49],[20,26,-49],[10,26,-49]], lines: [[0,1],[1,2],[2,0]] },
];

function createConstellations(cStarTex: THREE.Texture | null) {
  const group = new THREE.Group();
  const cStars: CStarData[] = [];
  const cLines: THREE.Line[] = [];

  CONSTELLATION_DEFS.forEach((def) => {
    const positions = def.stars.map(([x, y, z]) => new THREE.Vector3(x, y, z));

    positions.forEach((pos) => {
      const mat = new THREE.SpriteMaterial({
        map: cStarTex ?? undefined,
        transparent: true,
        opacity: 0.55,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        color: new THREE.Color("#ffd080"),
      });
      const sprite = new THREE.Sprite(mat);
      sprite.scale.set(1.8, 1.8, 1);
      sprite.position.copy(pos);
      group.add(sprite);
      cStars.push({ sprite, basePos: pos.clone() });
    });

    def.lines.forEach(([a, b]) => {
      const lineGeo = new THREE.BufferGeometry().setFromPoints([positions[a], positions[b]]);
      const lineMat = new THREE.LineBasicMaterial({
        color: new THREE.Color("#9070d8"),
        transparent: true,
        opacity: 0.18,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      });
      const line = new THREE.Line(lineGeo, lineMat);
      group.add(line);
      cLines.push(line);
    });
  });

  return { group, cStars, cLines };
}

export default function StarField() {
  const mountRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2("#030511", 0.01);

    const camera = new THREE.PerspectiveCamera(58, window.innerWidth / window.innerHeight, 0.1, 260);
    camera.position.set(0, 0, 42);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.8));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x050711, 1);
    mount.appendChild(renderer.domElement);

    const texture = makeCircleTexture();
    const galaxyTexture = makeGalaxyTexture();
    const cStarTex = makeConstellationStarTexture();

    const root = new THREE.Group();
    const stars = createStarField(texture);
    const milkyWay = createMilkyWay(texture);
    const galaxyPlane = createGalaxyPlane(galaxyTexture);
    const asteroidBelt = createAsteroidBelt(texture);
    const rings = createOrbitRings();
    const solarCore = createSolarCore(texture);
    const meteors = createMeteors();
    const { group: constellationGroup, cStars, cLines } = createConstellations(cStarTex);

    root.add(stars, galaxyPlane, milkyWay, asteroidBelt, rings, solarCore, constellationGroup, ...meteors.map((m) => m.mesh));
    scene.add(root);

    const mouse = new THREE.Vector2(0, 0);
    const target = new THREE.Vector2(0, 0);
    const startTime = performance.now();
    let prevTime = performance.now();

    const dragRot = { x: 0, y: 0 };
    let isDragging = false;
    let lastDragX = 0;
    let lastDragY = 0;

    const handlePointerDown = (event: PointerEvent) => {
      const el = event.target as Element;
      if (el.closest('button, a, input, select, [role="button"]')) return;
      isDragging = true;
      lastDragX = event.clientX;
      lastDragY = event.clientY;
    };

    const handlePointerUp = () => { isDragging = false; };

    const handlePointerMove = (event: PointerEvent) => {
      if (isDragging) {
        dragRot.y += (event.clientX - lastDragX) * 0.006;
        dragRot.x += (event.clientY - lastDragY) * 0.003;
        dragRot.x = Math.max(-1.4, Math.min(1.4, dragRot.x));
        lastDragX = event.clientX;
        lastDragY = event.clientY;
      } else {
        target.x = (event.clientX / window.innerWidth - 0.5) * 2;
        target.y = (event.clientY / window.innerHeight - 0.5) * 2;
      }
    };

    const handleTouchStart = (event: TouchEvent) => {
      isDragging = true;
      lastDragX = event.touches[0].clientX;
      lastDragY = event.touches[0].clientY;
    };
    const handleTouchEnd = () => { isDragging = false; };
    const handleTouchMove = (event: TouchEvent) => {
      if (!isDragging) return;
      dragRot.y += (event.touches[0].clientX - lastDragX) * 0.006;
      dragRot.x += (event.touches[0].clientY - lastDragY) * 0.003;
      dragRot.x = Math.max(-1.4, Math.min(1.4, dragRot.x));
      lastDragX = event.touches[0].clientX;
      lastDragY = event.touches[0].clientY;
    };

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener("pointerdown", handlePointerDown);
    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);
    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: true });
    window.addEventListener("touchend", handleTouchEnd);
    window.addEventListener("resize", handleResize);

    const tmpVec3 = new THREE.Vector3();
    let animationId = 0;

    const animate = () => {
      animationId = window.requestAnimationFrame(animate);
      const now = performance.now();
      const elapsed = (now - startTime) / 1000;
      const delta = (now - prevTime) / 1000;
      prevTime = now;

      mouse.lerp(target, 0.035);
      root.rotation.y = dragRot.y + mouse.x * 0.09 + elapsed * 0.032;
      root.rotation.x = dragRot.x - mouse.y * 0.045 + Math.sin(elapsed * 0.3) * 0.018;
      galaxyPlane.rotation.z = -0.28 + Math.sin(elapsed * 0.08) * 0.018;
      milkyWay.rotation.z = -0.32 + Math.sin(elapsed * 0.14) * 0.018;
      stars.rotation.z += delta * 0.003;
      stars.rotation.y += delta * 0.003;
      asteroidBelt.rotation.z += delta * 0.13;
      asteroidBelt.rotation.y += delta * 0.022;
      rings.rotation.z += delta * 0.075;

      meteors.forEach((meteor, index) => {
        const cycle = (elapsed * 54 * meteor.speed + meteor.offset) % 190;
        const material = meteor.mesh.material as THREE.LineBasicMaterial;
        meteor.mesh.position.x = meteor.baseX - cycle;
        meteor.mesh.position.y = meteor.baseY + cycle * 0.33;
        meteor.mesh.rotation.z = -0.36;
        material.opacity = cycle > 18 && cycle < 88 ? 0.82 - Math.abs(cycle - 52) / 100 : 0;
        meteor.mesh.scale.setScalar(0.8 + index * 0.08);
      });

      // ── Constellation mouse-proximity glow ────────────────────────────────
      const mouseScreenX = (mouse.x * 0.5 + 0.5) * window.innerWidth;
      const mouseScreenY = (-mouse.y * 0.5 + 0.5) * window.innerHeight;

      cStars.forEach((cStar, i) => {
        cStar.sprite.getWorldPosition(tmpVec3);
        tmpVec3.project(camera);
        const sx = (tmpVec3.x * 0.5 + 0.5) * window.innerWidth;
        const sy = (-tmpVec3.y * 0.5 + 0.5) * window.innerHeight;
        const dist = Math.sqrt((sx - mouseScreenX) ** 2 + (sy - mouseScreenY) ** 2);
        const proximity = Math.max(0, 1 - dist / 140);
        const twinkle = 0.48 + 0.16 * Math.sin(elapsed * 1.7 + cStar.basePos.x * 0.38 + i * 0.4);
        const mat = cStar.sprite.material as THREE.SpriteMaterial;
        mat.opacity = Math.min(0.95, twinkle + proximity * 0.52);
        cStar.sprite.scale.setScalar(1.8 + proximity * 2.2);
      });

      cLines.forEach((line, i) => {
        const mat = line.material as THREE.LineBasicMaterial;
        mat.opacity = 0.16 + 0.09 * Math.sin(elapsed * 0.65 + i * 0.6);
      });

      const orbitX = Math.sin(elapsed * 0.16) * 4.8;
      const orbitY = Math.cos(elapsed * 0.13) * 2.4;
      const orbitZ = 40 + Math.sin(elapsed * 0.11) * 4;
      camera.position.x += (orbitX + mouse.x * 3.4 - camera.position.x) * 0.03;
      camera.position.y += (orbitY - mouse.y * 2.2 - camera.position.y) * 0.03;
      camera.position.z += (orbitZ - camera.position.z) * 0.025;
      camera.lookAt(Math.sin(elapsed * 0.12) * 3, Math.cos(elapsed * 0.1) * 1.4, -34);

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      window.cancelAnimationFrame(animationId);
      window.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
      window.removeEventListener("resize", handleResize);
      mount.removeChild(renderer.domElement);

      root.traverse((object) => {
        if (
          object instanceof THREE.Points ||
          object instanceof THREE.Line ||
          object instanceof THREE.Mesh ||
          object instanceof THREE.Sprite
        ) {
          object.geometry.dispose();
          const material = object.material;
          if (Array.isArray(material)) material.forEach((item) => item.dispose());
          else material.dispose();
        }
      });

      texture?.dispose();
      galaxyTexture?.dispose();
      cStarTex?.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-[#030511]">
      {/* Nebula gradients */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 18% 24%, rgba(52,70,165,0.18), transparent 28%), radial-gradient(circle at 72% 18%, rgba(255,187,112,0.08), transparent 22%), radial-gradient(circle at 52% 76%, rgba(86,255,214,0.05), transparent 31%)",
        }}
      />

      {/* Three.js canvas */}
      <div ref={mountRef} className="absolute inset-0" />

      {/* Artist silhouettes — positioned near center sides */}
      <div
        className="absolute inset-0"
        style={{ pointerEvents: "none" }}
      >
        {/* Right side — image 2 flipped X */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          className="performer-right"
          src="/bat-right.jpg"
          alt=""
          draggable={false}
          onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
          style={{
            position: "absolute",
            bottom: 0,
            right: "12%",
            height: "85vh",
            width: "auto",
            objectFit: "cover",
            objectPosition: "center top",
            transform: "scaleX(-1)",
            opacity: 0.35,
            filter: "brightness(1.5) contrast(1.3) saturate(0.15)",
            maskImage: "radial-gradient(ellipse 55% 65% at 50% 45%, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.4) 50%, transparent 80%)",
            WebkitMaskImage: "radial-gradient(ellipse 55% 65% at 50% 45%, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.4) 50%, transparent 80%)",
            pointerEvents: "none",
            userSelect: "none",
            animation: "performer-breathe 8s ease-in-out infinite",
          }}
        />

        {/* Left side — image 1 */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          className="performer-left"
          src="/bat-left.jpg"
          alt=""
          draggable={false}
          onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
          style={{
            position: "absolute",
            bottom: 0,
            left: "12%",
            height: "85vh",
            width: "auto",
            objectFit: "cover",
            objectPosition: "center top",
            opacity: 0.28,
            filter: "brightness(1.3) contrast(1.3) saturate(0.15)",
            maskImage: "radial-gradient(ellipse 55% 65% at 50% 45%, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.4) 50%, transparent 80%)",
            WebkitMaskImage: "radial-gradient(ellipse 55% 65% at 50% 45%, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.4) 50%, transparent 80%)",
            pointerEvents: "none",
            userSelect: "none",
            animation: "performer-breathe 8s ease-in-out infinite 4s",
          }}
        />
      </div>

      {/* Grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(142,184,255,0.32) 1px, transparent 1px), linear-gradient(90deg, rgba(142,184,255,0.26) 1px, transparent 1px)",
          backgroundSize: "92px 92px",
          maskImage: "radial-gradient(circle at center, black 0 48%, transparent 82%)",
        }}
      />
    </div>
  );
}

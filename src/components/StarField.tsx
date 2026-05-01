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
        opacity: index < 4 ? 0.44 : 0.3,
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
    new THREE.SphereGeometry(2.1, 48, 48),
    new THREE.MeshBasicMaterial({ color: "#fffaf1", transparent: true, opacity: 1 })
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
  const blueHalo = makeHalo("#9094ff", 0.7, 28);
  const goldHalo = makeHalo("#f0c544", 0.42, 46);
  const redHalo = makeHalo("#c84d35", 0.22, 76);
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
    const root = new THREE.Group();
    const stars = createStarField(texture);
    const milkyWay = createMilkyWay(texture);
    const galaxyPlane = createGalaxyPlane(galaxyTexture);
    const asteroidBelt = createAsteroidBelt(texture);
    const rings = createOrbitRings();
    const solarCore = createSolarCore(texture);
    const meteors = createMeteors();

    root.add(stars, galaxyPlane, milkyWay, asteroidBelt, rings, solarCore, ...meteors.map((meteor) => meteor.mesh));
    scene.add(root);

    const mouse = new THREE.Vector2(0, 0);
    const target = new THREE.Vector2(0, 0);
    const clock = new THREE.Clock();

    const handlePointerMove = (event: PointerEvent) => {
      target.x = (event.clientX / window.innerWidth - 0.5) * 2;
      target.y = (event.clientY / window.innerHeight - 0.5) * 2;
    };

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("resize", handleResize);

    let animationId = 0;

    const animate = () => {
      animationId = window.requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();
      const delta = clock.getDelta();

      mouse.lerp(target, 0.035);
      root.rotation.y = mouse.x * 0.09 + elapsed * 0.032;
      root.rotation.x = -mouse.y * 0.045 + Math.sin(elapsed * 0.3) * 0.018;
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
      window.removeEventListener("pointermove", handlePointerMove);
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
      renderer.dispose();
    };
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-[#030511]">
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 18% 24%, rgba(52,70,165,0.18), transparent 28%), radial-gradient(circle at 72% 18%, rgba(255,187,112,0.08), transparent 22%), radial-gradient(circle at 52% 76%, rgba(86,255,214,0.05), transparent 31%)",
        }}
      />
      <div ref={mountRef} className="absolute inset-0" />
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

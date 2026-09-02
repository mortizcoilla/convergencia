// Convergencia — hero WebGL
// Red de nodos conectados: partículas que convergen + líneas tenues entre vecinos.
// Comunica visualmente: "comunidades educativas que convergen".

import * as THREE from "three";

interface Options {
  container: HTMLElement;
  reducedMotion: boolean;
}

export function initConvergenciaCanvas({ container, reducedMotion }: Options): () => void {
  const scene = new THREE.Scene();

  const w = container.clientWidth;
  const h = container.clientHeight;

  const camera = new THREE.PerspectiveCamera(55, w / h, 0.1, 100);
  camera.position.z = 7;

  const renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: true,
    powerPreference: "high-performance",
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(w, h);
  renderer.setClearColor(0x000000, 0);
  container.appendChild(renderer.domElement);

  // ---------------------------------------------------------
  // Partículas
  // ---------------------------------------------------------
  const COUNT = 1400;
  const positions = new Float32Array(COUNT * 3);
  const seeds = new Float32Array(COUNT);
  const sizes = new Float32Array(COUNT);
  // Vectores "home" para la oscilación de cada partícula
  const homes = new Float32Array(COUNT * 3);

  for (let i = 0; i < COUNT; i++) {
    const r = Math.pow(Math.random(), 0.7) * 5 + 0.3;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);

    const x = r * Math.sin(phi) * Math.cos(theta);
    const y = r * Math.sin(phi) * Math.sin(theta) * 0.55;
    const z = r * Math.cos(phi) * 0.4;

    positions[i * 3]     = x;
    positions[i * 3 + 1] = y;
    positions[i * 3 + 2] = z;
    homes[i * 3]     = x;
    homes[i * 3 + 1] = y;
    homes[i * 3 + 2] = z;

    seeds[i] = Math.random();
    sizes[i] = Math.random() * 1.6 + 0.5;
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute("aSeed",    new THREE.BufferAttribute(seeds, 1));
  geometry.setAttribute("aSize",    new THREE.BufferAttribute(sizes, 1));

  // ---------------------------------------------------------
  // Shader de puntos
  // ---------------------------------------------------------
  const pointsVertex = /* glsl */ `
    attribute float aSeed;
    attribute float aSize;
    uniform float uTime;
    uniform vec2  uMouse;
    uniform float uPixelRatio;
    varying float vAlpha;
    varying float vSeed;
    varying float vDist;

    void main() {
      vSeed = aSeed;
      vec3 pos = position;

      float breath = sin(uTime * 0.25 + aSeed * 6.28) * 0.5 + 0.5;
      vec3 toCenter = normalize(-pos + vec3(0.001));
      pos += toCenter * breath * 0.20;

      float t = uTime * 0.15;
      pos.x += sin(t + aSeed * 12.0 + pos.y * 1.2) * 0.10;
      pos.y += cos(t * 0.9 + aSeed * 8.0 + pos.x * 0.8) * 0.10;
      pos.z += sin(t * 0.7 + aSeed * 4.0) * 0.06;

      pos.x += uMouse.x * 0.25 * (0.4 + aSeed * 0.6);
      pos.y += uMouse.y * 0.25 * (0.4 + aSeed * 0.6);

      vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
      gl_Position = projectionMatrix * mvPosition;

      vDist = length(pos);
      vAlpha = smoothstep(5.0, 0.4, vDist) * 0.92 + 0.08;

      gl_PointSize = aSize * uPixelRatio * (260.0 / -mvPosition.z);
      gl_PointSize *= 0.7 + 0.3 * sin(uTime * 0.4 + aSeed * 10.0);
    }
  `;

  const pointsFragment = /* glsl */ `
    precision highp float;
    uniform vec3  uColorCore;
    uniform vec3  uColorEdge;
    uniform vec3  uColorHalo;
    varying float vAlpha;
    varying float vSeed;

    void main() {
      vec2 uv = gl_PointCoord - 0.5;
      float d = length(uv);
      if (d > 0.5) discard;

      float core = smoothstep(0.5, 0.0, d);
      float halo = smoothstep(0.5, 0.10, d) * 0.45;

      vec3 col = mix(uColorEdge, uColorCore, step(0.7, vSeed));
      col = mix(col, vec3(1.0, 1.0, 1.0), core * 0.7);
      col = mix(col, uColorHalo, halo * 0.6);

      float a = (core * 0.9 + halo) * vAlpha;
      gl_FragColor = vec4(col, a);
    }
  `;

  const pointsUniforms = {
    uTime:        { value: 0 },
    uMouse:       { value: new THREE.Vector2(0, 0) },
    uPixelRatio:  { value: Math.min(window.devicePixelRatio, 2) },
    uColorCore:   { value: new THREE.Color("#E07B58") }, // terracota brillante
    uColorEdge:   { value: new THREE.Color("#F3E8DC") }, // crema
    uColorHalo:   { value: new THREE.Color("#C96B4B") }, // terracota base
  };

  const pointsMaterial = new THREE.ShaderMaterial({
    uniforms: pointsUniforms,
    vertexShader: pointsVertex,
    fragmentShader: pointsFragment,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });

  const points = new THREE.Points(geometry, pointsMaterial);
  scene.add(points);

  // ---------------------------------------------------------
  // Red de líneas — vecinos cercanos
  // ---------------------------------------------------------
  // Subconjunto de partículas que actúan como "nodos" principales.
  // Para cada nodo, encontramos sus K vecinos más cercanos y dibujamos líneas.
  const NODE_COUNT = 60;
  const NEIGHBORS_PER_NODE = 3;
  const MAX_LINES = NODE_COUNT * NEIGHBORS_PER_NODE * 2; // bidireccional
  const linePositions = new Float32Array(MAX_LINES * 2 * 3);
  const lineAlphas = new Float32Array(MAX_LINES * 2);

  const lineGeometry = new THREE.BufferGeometry();
  lineGeometry.setAttribute("position", new THREE.BufferAttribute(linePositions, 3));
  lineGeometry.setAttribute("aAlpha",   new THREE.BufferAttribute(lineAlphas, 1));
  lineGeometry.setDrawRange(0, 0);

  const lineVertex = /* glsl */ `
    attribute float aAlpha;
    varying float vAlpha;
    void main() {
      vAlpha = aAlpha;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `;

  const lineFragment = /* glsl */ `
    precision highp float;
    uniform vec3 uColor;
    varying float vAlpha;
    void main() {
      gl_FragColor = vec4(uColor, vAlpha);
    }
  `;

  const lineMaterial = new THREE.ShaderMaterial({
    uniforms: { uColor: { value: new THREE.Color("#5F7FA3") } }, // azul gris tenue
    vertexShader: lineVertex,
    fragmentShader: lineFragment,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });

  const lines = new THREE.LineSegments(lineGeometry, lineMaterial);
  scene.add(lines);

  // Pre-calcular índices de nodos
  const nodeIndices: number[] = [];
  const used = new Set<number>();
  while (nodeIndices.length < NODE_COUNT) {
    const idx = Math.floor(Math.random() * COUNT);
    if (!used.has(idx)) { used.add(idx); nodeIndices.push(idx); }
  }

  // ---------------------------------------------------------
  // Interacción
  // ---------------------------------------------------------
  const targetMouse = new THREE.Vector2(0, 0);
  const currentMouse = new THREE.Vector2(0, 0);

  const onPointerMove = (e: PointerEvent) => {
    const rect = container.getBoundingClientRect();
    targetMouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    targetMouse.y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
  };
  container.addEventListener("pointermove", onPointerMove);

  // ---------------------------------------------------------
  // Resize
  // ---------------------------------------------------------
  const onResize = () => {
    const w2 = container.clientWidth;
    const h2 = container.clientHeight;
    camera.aspect = w2 / h2;
    camera.updateProjectionMatrix();
    renderer.setSize(w2, h2);
  };
  window.addEventListener("resize", onResize);

  // ---------------------------------------------------------
  // Loop
  // ---------------------------------------------------------
  const clock = new THREE.Clock();
  let rafId = 0;
  let running = !reducedMotion;
  let lineUpdateCounter = 0;

  // Calcular las K partículas más cercanas a un nodo en una posición dada
  function updateLines() {
    const posAttr = geometry.getAttribute("position") as THREE.BufferAttribute;
    const posArr = posAttr.array as Float32Array;
    const NEIGHBOR_RADIUS = 1.4;
    const NEIGHBOR_RADIUS_SQ = NEIGHBOR_RADIUS * NEIGHBOR_RADIUS;

    let lineIdx = 0;

    for (const nodeIdx of nodeIndices) {
      const nx = posArr[nodeIdx * 3];
      const ny = posArr[nodeIdx * 3 + 1];
      const nz = posArr[nodeIdx * 3 + 2];

      // Encontrar vecinos
      const neighbors: { idx: number; d: number }[] = [];
      for (let i = 0; i < COUNT; i++) {
        if (i === nodeIdx) continue;
        const dx = posArr[i * 3]     - nx;
        const dy = posArr[i * 3 + 1] - ny;
        const dz = posArr[i * 3 + 2] - nz;
        const dsq = dx * dx + dy * dy + dz * dz;
        if (dsq < NEIGHBOR_RADIUS_SQ) {
          neighbors.push({ idx: i, d: dsq });
        }
      }
      neighbors.sort((a, b) => a.d - b.d);

      // Top-K vecinos
      const topK = neighbors.slice(0, NEIGHBORS_PER_NODE);
      for (const n of topK) {
        if (lineIdx >= MAX_LINES) break;
        // Punto A: nodo
        linePositions[lineIdx * 6]     = nx;
        linePositions[lineIdx * 6 + 1] = ny;
        linePositions[lineIdx * 6 + 2] = nz;
        // Punto B: vecino
        linePositions[lineIdx * 6 + 3] = posArr[n.idx * 3];
        linePositions[lineIdx * 6 + 4] = posArr[n.idx * 3 + 1];
        linePositions[lineIdx * 6 + 5] = posArr[n.idx * 3 + 2];
        // Alpha según distancia
        const distRatio = Math.sqrt(n.d) / NEIGHBOR_RADIUS;
        const alpha = (1 - distRatio) * 0.45;
        lineAlphas[lineIdx * 2]     = alpha;
        lineAlphas[lineIdx * 2 + 1] = alpha;
        lineIdx++;
      }
      if (lineIdx >= MAX_LINES) break;
    }

    lineGeometry.setDrawRange(0, lineIdx * 2);
    (lineGeometry.getAttribute("position") as THREE.BufferAttribute).needsUpdate = true;
    (lineGeometry.getAttribute("aAlpha") as THREE.BufferAttribute).needsUpdate = true;
  }

  const tick = () => {
    rafId = requestAnimationFrame(tick);
    if (!running) return;

    const t = clock.getElapsedTime();
    pointsUniforms.uTime.value = t;

    currentMouse.lerp(targetMouse, 0.06);
    pointsUniforms.uMouse.value.copy(currentMouse);

    // Rotación sutil del grupo
    points.rotation.y = Math.sin(t * 0.08) * 0.15;
    points.rotation.x = Math.cos(t * 0.06) * 0.08;
    lines.rotation.copy(points.rotation);

    // Actualizar líneas cada 3 frames para performance
    lineUpdateCounter++;
    if (lineUpdateCounter % 3 === 0) {
      updateLines();
    }

    renderer.render(scene, camera);
  };

  const onVisibility = () => {
    running = !document.hidden && !reducedMotion;
  };
  document.addEventListener("visibilitychange", onVisibility);

  tick();

  // ---------------------------------------------------------
  // Cleanup
  // ---------------------------------------------------------
  return () => {
    cancelAnimationFrame(rafId);
    container.removeEventListener("pointermove", onPointerMove);
    window.removeEventListener("resize", onResize);
    document.removeEventListener("visibilitychange", onVisibility);
    geometry.dispose();
    pointsMaterial.dispose();
    lineGeometry.dispose();
    lineMaterial.dispose();
    renderer.dispose();
    if (renderer.domElement.parentNode) {
      renderer.domElement.parentNode.removeChild(renderer.domElement);
    }
  };
}

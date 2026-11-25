/* 3D particle background. Shape + colour follow the active section
   (see `shape` and `colors` in SECTIONS). All motion runs on the GPU. */
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { CONFIG } from "../config";
import { SECTIONS } from "../data/portfolio";
import { prefersReducedMotion } from "../lib/utils";

const SHAPE_TILT = { sphere: 0.15, wave: 0.6, knot: 0.35, cube: 0.4, helix: 0.1, galaxy: 1.05 };

const VERT = `
attribute vec3 aFrom;
attribute vec3 aTo;
attribute float aMix;
attribute float aPhase;
uniform float uProgress;
uniform float uTime;
uniform float uPulse;
uniform float uSize;
uniform float uPixelRatio;
varying float vMix;
void main() {
  vec3 pos = mix(aFrom, aTo, uProgress);
  pos *= 1.0 + uPulse * aMix * 0.5;
  pos.x += sin(uTime * 0.9 + aPhase) * 0.045;
  pos.y += cos(uTime * 0.7 + aPhase) * 0.045;
  vec4 mv = modelViewMatrix * vec4(pos, 1.0);
  gl_Position = projectionMatrix * mv;
  gl_PointSize = uSize * uPixelRatio * (10.0 / -mv.z);
  vMix = aMix;
}`;

const FRAG = `
uniform vec3 uColorA;
uniform vec3 uColorB;
varying float vMix;
void main() {
  float d = length(gl_PointCoord - vec2(0.5));
  float a = 1.0 - smoothstep(0.0, 0.5, d);
  gl_FragColor = vec4(mix(uColorA, uColorB, vMix), a * 0.9);
}`;

function hexToVec3(hex) {
  let h = hex.replace("#", "");
  if (h.length === 3) h = h.split("").map((c) => c + c).join("");
  const n = parseInt(h, 16);
  return new THREE.Vector3(((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255);
}

function buildShape(name, N) {
  const a = new Float32Array(N * 3);
  const r = () => Math.random() - 0.5;
  const golden = Math.PI * (3 - Math.sqrt(5));
  const side = Math.ceil(Math.sqrt(N));
  for (let i = 0; i < N; i++) {
    const u = i / N;
    let p;
    switch (name) {
      case "wave": {
        const x = ((i % side) / side - 0.5) * 10;
        const z = (Math.floor(i / side) / side - 0.5) * 10;
        p = [x, Math.sin(x * 0.9) * 0.55 + Math.cos(z * 0.75) * 0.55, z];
        break;
      }
      case "knot": {
        const t = u * Math.PI * 2;
        const rr = Math.cos(3 * t) + 2;
        p = [rr * Math.cos(2 * t) * 1.05 + r() * 0.3, rr * Math.sin(2 * t) * 1.05 + r() * 0.3, -Math.sin(3 * t) * 1.05 + r() * 0.3];
        break;
      }
      case "cube": {
        const s = 2.3;
        const g = (v) => Math.round(v / 0.46) * 0.46;
        const b1 = g((Math.random() * 2 - 1) * s);
        const b2 = g((Math.random() * 2 - 1) * s);
        p = [[s, b1, b2], [-s, b1, b2], [b1, s, b2], [b1, -s, b2], [b1, b2, s], [b1, b2, -s]][Math.floor(Math.random() * 6)];
        break;
      }
      case "helix": {
        const t = u * Math.PI * 9;
        const y = (u - 0.5) * 8.5;
        const R = 1.6;
        if (i % 9 === 0) {
          const f = Math.random() * 2 - 1;
          p = [Math.cos(t) * R * f, y, Math.sin(t) * R * f];
        } else {
          const ang = t + (i % 2) * Math.PI;
          p = [Math.cos(ang) * R + r() * 0.15, y + r() * 0.1, Math.sin(ang) * R + r() * 0.15];
        }
        break;
      }
      case "galaxy": {
        const rr = Math.pow(Math.random(), 0.65) * 3.8;
        const ang = ((i % 3) / 3) * Math.PI * 2 + rr * 1.25;
        const sp = 0.35 * (0.4 + rr * 0.25);
        p = [Math.cos(ang) * rr + r() * sp, r() * 0.3 * (1.2 - rr / 4), Math.sin(ang) * rr + r() * sp];
        break;
      }
      default: {
        const y = 1 - 2 * u;
        const rad = Math.sqrt(1 - y * y);
        const th = golden * i;
        const R = 3 + r() * 0.15;
        p = [Math.cos(th) * rad * R, y * R, Math.sin(th) * rad * R];
      }
    }
    a[i * 3] = p[0];
    a[i * 3 + 1] = p[1];
    a[i * 3 + 2] = p[2];
  }
  return a;
}

export default function Background3D({ activeIndex }) {
  const canvasRef = useRef(null);
  const indexRef = useRef(activeIndex);

  useEffect(() => {
    indexRef.current = activeIndex;
  }, [activeIndex]);

  useEffect(() => {
    if (!CONFIG.background3D) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: false, powerPreference: "high-performance" });
    } catch {
      return; // no WebGL — page still works
    }
    const reduce = prefersReducedMotion();
    const mobile = window.matchMedia("(max-width: 767px)").matches;
    const N = mobile ? CONFIG.particles.mobile : CONFIG.particles.desktop;
    const dpr = Math.min(window.devicePixelRatio || 1, CONFIG.maxPixelRatio);
    renderer.setPixelRatio(dpr);
    renderer.setClearColor(0x000000, 0);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(55, 1, 0.1, 100);
    camera.position.z = 10;

    const cache = {};
    const shapeOf = (idx) => {
      const name = (SECTIONS[idx] && SECTIONS[idx].shape) || "sphere";
      if (!cache[name]) cache[name] = buildShape(name, N);
      return cache[name];
    };

    const from = new Float32Array(shapeOf(0));
    const to = new Float32Array(shapeOf(0));
    const mixes = new Float32Array(N);
    const phases = new Float32Array(N);
    for (let i = 0; i < N; i++) {
      mixes[i] = Math.random();
      phases[i] = Math.random() * Math.PI * 2;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(new Float32Array(from), 3));
    geo.setAttribute("aFrom", new THREE.BufferAttribute(from, 3));
    geo.setAttribute("aTo", new THREE.BufferAttribute(to, 3));
    geo.setAttribute("aMix", new THREE.BufferAttribute(mixes, 1));
    geo.setAttribute("aPhase", new THREE.BufferAttribute(phases, 1));

    const colorSets = SECTIONS.map((s) => [hexToVec3(s.colors[0]), hexToVec3(s.colors[1])]);
    const uniforms = {
      uProgress: { value: 1 },
      uTime: { value: 0 },
      uPulse: { value: 0 },
      uSize: { value: mobile ? 3.2 : 3.6 },
      uPixelRatio: { value: dpr },
      uColorA: { value: colorSets[0][0].clone() },
      uColorB: { value: colorSets[0][1].clone() },
    };
    const mat = new THREE.ShaderMaterial({ vertexShader: VERT, fragmentShader: FRAG, uniforms, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending });
    const points = new THREE.Points(geo, mat);
    points.frustumCulled = false;
    const group = new THREE.Group();
    group.add(points);
    scene.add(group);

    let vw = 1;
    let sideX = 3;
    const resize = () => {
      vw = window.innerWidth;
      const vh = window.innerHeight;
      renderer.setSize(vw, vh, false);
      camera.aspect = vw / vh;
      camera.updateProjectionMatrix();
      const halfW = Math.tan((camera.fov * Math.PI) / 360) * 10 * camera.aspect;
      const frac = Math.min(1280, vw) / vw;
      sideX = vw >= 1600 ? ((1 + frac) / 2) * halfW : 0.42 * halfW;
      group.scale.setScalar(mobile ? 0.72 : vw >= 1600 ? 0.85 : 1);
    };
    resize();

    const mouse = { x: 0, y: 0 };
    const onPointer = (e) => {
      mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -((e.clientY / window.innerHeight) * 2 - 1);
    };
    let lastY = window.scrollY;
    let spin = 0;
    const onScroll = () => {
      const y = window.scrollY;
      spin = Math.max(-0.05, Math.min(0.05, spin + (y - lastY) * 0.0003));
      lastY = y;
    };
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onPointer, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });

    const MORPH_MS = 1400;
    const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
    let current = 0;
    let morphStart = 0;
    let morphing = false;

    const startMorph = (next, now) => {
      const p = uniforms.uProgress.value;
      for (let i = 0; i < N * 3; i++) from[i] += (to[i] - from[i]) * p;
      to.set(shapeOf(next));
      geo.attributes.aFrom.needsUpdate = true;
      geo.attributes.aTo.needsUpdate = true;
      uniforms.uProgress.value = 0;
      uniforms.uPulse.value = 0.6;
      morphStart = now;
      morphing = true;
      current = next;
    };

    let raf;
    const tick = (now) => {
      raf = requestAnimationFrame(tick);
      if (document.hidden) return;
      const idx = Math.max(0, Math.min(SECTIONS.length - 1, indexRef.current || 0));
      if (idx !== current) startMorph(idx, now);
      if (morphing) {
        const t = Math.min(1, (now - morphStart) / MORPH_MS);
        uniforms.uProgress.value = reduce ? 1 : ease(t);
        if (t >= 1) morphing = false;
      }
      uniforms.uTime.value = reduce ? 0 : now / 1000;
      uniforms.uPulse.value *= 0.94;

      const colors = colorSets[CONFIG.sectionColors ? idx : 0];
      uniforms.uColorA.value.lerp(colors[0], 0.05);
      uniforms.uColorB.value.lerp(colors[1], 0.05);

      const sec = SECTIONS[idx];
      const targetX = mobile ? 0 : (sec.side || 0) * sideX;
      group.position.x += (targetX - group.position.x) * 0.04;
      if (!reduce) group.rotation.y += 0.0022 + spin;
      spin *= 0.93;
      const tilt = SHAPE_TILT[sec.shape] ?? 0.2;
      group.rotation.x += (tilt + mouse.y * 0.25 - group.rotation.x) * 0.04;
      camera.position.x += (mouse.x * 0.5 - camera.position.x) * 0.03;
      camera.position.y += (mouse.y * 0.3 - camera.position.y) * 0.03;
      camera.lookAt(0, 0, 0);
      renderer.render(scene, camera);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onPointer);
      window.removeEventListener("scroll", onScroll);
      geo.dispose();
      mat.dispose();
      renderer.dispose();
    };
  }, []);

  if (!CONFIG.background3D) return null;
  return <canvas ref={canvasRef} aria-hidden className="pointer-events-none fixed inset-0 h-full w-full" style={{ zIndex: 0 }} />;
}
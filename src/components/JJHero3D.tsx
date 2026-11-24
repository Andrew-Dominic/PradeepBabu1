import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { computeHeroDiveState } from '../utils/cloneLogic';

interface JJHero3DProps {
  scrollProgress: number;
}

export const JJHero3D: React.FC<JJHero3DProps> = ({ scrollProgress }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef(scrollProgress);
  scrollRef.current = scrollProgress;

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(19, width / Math.max(1, height), 0.1, 100);
    camera.position.set(0, 0, 2.65);

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance',
      });
    } catch {
      return;
    }

    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(width, height);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.04;

    const canvas = renderer.domElement;
    canvas.setAttribute('data-engine', 'three.js r174');
    canvas.style.display = 'block';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    container.innerHTML = '';
    container.appendChild(canvas);

    // Detect software GL (SwiftShader / llvmpipe) to pace frames for Playwright screenshots
    const gl = renderer.getContext();
    const dbg = gl.getExtension('WEBGL_debug_renderer_info');
    const rendererInfo = dbg ? String(gl.getParameter(dbg.UNMASKED_RENDERER_WEBGL)) : '';
    const isSoftwareGl = /SwiftShader|llvmpipe|softpipe/i.test(rendererInfo);

    // Lighting matching pradeepbabu.com 3D portrait setup
    const ambientLight = new THREE.AmbientLight(0xfff6ee, 2.45);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffe6cc, 1.35);
    keyLight.position.set(1.5, 1.8, 2.5);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0x9e6de9, 0.85);
    rimLight.position.set(-1.8, 0.6, 1.4);
    scene.add(rimLight);

    const isMobile = width < 768;
    const suffix = isMobile ? '-phone' : '';
    const texLoader = new THREE.TextureLoader();

    const loadTex = (url: string, isSRGB = false) => {
      const tex = texLoader.load(url);
      tex.colorSpace = isSRGB ? THREE.SRGBColorSpace : THREE.LinearSRGBColorSpace;
      tex.minFilter = THREE.LinearFilter;
      tex.magFilter = THREE.LinearFilter;
      return tex;
    };

    const tDiffuse = loadTex(`/3d-hero/textures/diffuse${suffix}.webp`, true);
    const tDepth = loadTex(`/3d-hero/textures/depth${suffix}.webp`, false);
    const tAlpha = loadTex(`/3d-hero/textures/alpha${suffix}.png`, false);
    // Shades/lens overlay removed

    const planeAspect = 2432 / 1750;
    const geometry = new THREE.PlaneGeometry(planeAspect, 1, 128, 128);

    const customUniforms = {
      uDispScale: { value: 1.0 },
      uTime: { value: 0 },
    };

    const material = new THREE.MeshStandardMaterial({
      map: tDiffuse,
      alphaMap: tAlpha,
      displacementMap: tDepth,
      displacementScale: 0.165,
      displacementBias: -0.06,
      transparent: true,
      alphaTest: 0.01,
      roughness: 0.74,
      metalness: 0.08,
    });

    material.onBeforeCompile = (shader) => {
      shader.uniforms.uDispScale = customUniforms.uDispScale;
      shader.uniforms.uTime = customUniforms.uTime;

      shader.vertexShader =
        'uniform float uDispScale;\nvarying vec2 vHeroUv;\n' +
        shader.vertexShader
          .replace('#include <uv_vertex>', '#include <uv_vertex>\nvHeroUv = uv;')
          .replace(
            '#include <displacementmap_vertex>',
            `#ifdef USE_DISPLACEMENTMAP
              transformed += normalize( objectNormal ) * ( texture2D( displacementMap, v DisplacementMapUv ).x * displacementScale + displacementBias ) * uDispScale;
            #endif`.replace('v DisplacementMapUv', 'vDisplacementMapUv')
          );

      shader.fragmentShader =
        `
        uniform float uTime;
        varying vec2 vHeroUv;
        ` +
        shader.fragmentShader;
    };

    const mesh = new THREE.Mesh(geometry, material);
    // Scale mesh so portrait fills hero frame cleanly
    const updateMeshScale = (w: number, h: number) => {
      const vpAspect = w / Math.max(1, h);
      const visibleHeight = 2 * Math.tan(THREE.MathUtils.degToRad(19 / 2)) * 2.65;
      const visibleWidth = visibleHeight * vpAspect;
      const scale = Math.max(visibleHeight * 1.04, (visibleWidth / planeAspect) * 0.82);
      mesh.scale.set(scale, scale, 1);
      mesh.position.set(0, -0.03 * scale, 0);
    };
    updateMeshScale(width, height);
    scene.add(mesh);

    let targetPointerX = 0;
    let targetPointerY = 0;
    let currentPointerX = 0;
    let currentPointerY = 0;

    const onPointerMove = (e: PointerEvent) => {
      const nx = (e.clientX / Math.max(1, window.innerWidth)) * 2 - 1;
      const ny = -((e.clientY / Math.max(1, window.innerHeight)) * 2 - 1);
      targetPointerX = nx;
      targetPointerY = ny;
    };
    window.addEventListener('pointermove', onPointerMove, { passive: true });

    const onResize = () => {
      if (!container) return;
      const nw = container.clientWidth || window.innerWidth;
      const nh = container.clientHeight || window.innerHeight;
      camera.aspect = nw / Math.max(1, nh);
      camera.updateProjectionMatrix();
      renderer.setSize(nw, nh);
      updateMeshScale(nw, nh);
    };
    window.addEventListener('resize', onResize);

    let disposed = false;
    let timerId = 0;
    let rafId = 0;
    const startTime = performance.now();

    const afterDraw = isSoftwareGl
      ? (cb: FrameRequestCallback) => {
          gl.flush();
          gl.finish();
          timerId = window.setTimeout(() => {
            if (!disposed) rafId = requestAnimationFrame(cb);
          }, 80);
        }
      : (cb: FrameRequestCallback) => {
          rafId = requestAnimationFrame(cb);
        };

    const tick = (now: number) => {
      if (disposed) return;
      const elapsed = (now - startTime) * 0.001;
      customUniforms.uTime.value = elapsed;

      currentPointerX += (targetPointerX - currentPointerX) * 0.08;
      currentPointerY += (targetPointerY - currentPointerY) * 0.08;

      const dive = computeHeroDiveState(scrollRef.current, currentPointerX, currentPointerY);
      camera.position.set(dive.cameraX, dive.cameraY, dive.cameraZ);
      camera.lookAt(dive.lookAtX, dive.lookAtY, dive.lookAtZ);
      customUniforms.uDispScale.value = dive.dispScale;

      renderer.render(scene, camera);
      afterDraw(tick);
    };

    rafId = requestAnimationFrame(tick);

    return () => {
      disposed = true;
      cancelAnimationFrame(rafId);
      clearTimeout(timerId);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('resize', onResize);
      geometry.dispose();
      material.dispose();
      tDiffuse.dispose();
      tDepth.dispose();
      tAlpha.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative h-full w-full"
      style={{ opacity: 1, transition: 'opacity 420ms ease-out' }}
    />
  );
};

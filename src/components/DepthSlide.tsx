import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface DepthSlideProps {
  src: string;
  depthSrc?: string | null;
  alt?: string;
  className?: string;
  intensity?: number;
}

export const DepthSlide: React.FC<DepthSlideProps> = ({
  src,
  depthSrc,
  alt = '',
  className = '',
  intensity = 0.028,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || !depthSrc) return;

    const width = container.clientWidth || 400;
    const height = container.clientHeight || 400;

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-0.5, 0.5, 0.5, -0.5, 0.01, 10);
    camera.position.z = 1;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    } catch {
      return;
    }

    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(width, height);
    renderer.outputColorSpace = THREE.SRGBColorSpace;

    const canvas = renderer.domElement;
    canvas.setAttribute('data-engine', 'three.js r174');
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.display = 'block';
    container.innerHTML = '';
    container.appendChild(canvas);

    const gl = renderer.getContext();
    const dbg = gl.getExtension('WEBGL_debug_renderer_info');
    const rendererInfo = dbg ? String(gl.getParameter(dbg.UNMASKED_RENDERER_WEBGL)) : '';
    const isSoftwareGl = /SwiftShader|llvmpipe|softpipe/i.test(rendererInfo);

    const loader = new THREE.TextureLoader();
    const tDiffuse = loader.load(src);
    tDiffuse.colorSpace = THREE.SRGBColorSpace;
    const tDepth = loader.load(depthSrc);

    const uniforms = {
      tDiffuse: { value: tDiffuse },
      tDepth: { value: tDepth },
      uMouse: { value: new THREE.Vector2(0, 0) },
      uIntensity: { value: intensity },
      uTime: { value: 0 },
    };

    const material = new THREE.ShaderMaterial({
      transparent: true,
      uniforms,
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform sampler2D tDiffuse;
        uniform sampler2D tDepth;
        uniform vec2 uMouse;
        uniform float uIntensity;
        uniform float uTime;
        varying vec2 vUv;
        void main() {
          float depth = texture2D(tDepth, vUv).r;
          vec2 breathe = vec2(cos(uTime * 1.4) * 0.15, sin(uTime * 1.1) * 0.15);
          vec2 offset = (uMouse + breathe) * (depth - 0.5) * uIntensity;
          vec2 sampleUv = clamp(vUv + offset, 0.002, 0.998);
          vec4 col = texture2D(tDiffuse, sampleUv);
          gl_FragColor = col;
        }
      `,
    });

    const geometry = new THREE.PlaneGeometry(1, 1);
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    let targetX = 0;
    let targetY = 0;

    const onPointerMove = (e: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;
      targetX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      targetY = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
    };
    window.addEventListener('pointermove', onPointerMove, { passive: true });

    let disposed = false;
    let rafId = 0;
    let timerId = 0;
    const start = performance.now();

    const afterDraw = isSoftwareGl
      ? (cb: FrameRequestCallback) => {
          gl.flush();
          gl.finish();
          timerId = window.setTimeout(() => {
            if (!disposed) rafId = requestAnimationFrame(cb);
          }, 90);
        }
      : (cb: FrameRequestCallback) => {
          rafId = requestAnimationFrame(cb);
        };

    const animate = (now: number) => {
      if (disposed) return;
      uniforms.uTime.value = (now - start) * 0.001;
      uniforms.uMouse.value.x += (targetX - uniforms.uMouse.value.x) * 0.08;
      uniforms.uMouse.value.y += (targetY - uniforms.uMouse.value.y) * 0.08;
      renderer.render(scene, camera);
      afterDraw(animate);
    };

    rafId = requestAnimationFrame(animate);

    return () => {
      disposed = true;
      cancelAnimationFrame(rafId);
      clearTimeout(timerId);
      window.removeEventListener('pointermove', onPointerMove);
      geometry.dispose();
      material.dispose();
      tDiffuse.dispose();
      tDepth.dispose();
      renderer.dispose();
    };
  }, [src, depthSrc, intensity]);

  if (!depthSrc) {
    return <img src={src} alt={alt} className={`h-full w-full object-contain ${className}`} />;
  }

  return (
    <div ref={containerRef} className={`relative h-full w-full ${className}`} aria-label={alt}>
      <img src={src} alt={alt} className="h-full w-full object-contain" />
    </div>
  );
};

export interface HeroCameraDiveState {
  cameraX: number;
  cameraY: number;
  cameraZ: number;
  lookAtX: number;
  lookAtY: number;
  lookAtZ: number;
  dispScale: number;
  lensGlow: number;
  videoRevealProgress: number;
  wordmarkOpacity: number;
}

export function clamp01(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.max(0, Math.min(1, value));
}

export function smoothstep(edge0: number, edge1: number, x: number): number {
  if (edge1 === edge0) return x >= edge1 ? 1 : 0;
  const t = clamp01((x - edge0) / (edge1 - edge0));
  return t * t * (3 - 2 * t);
}

/**
 * Computes the exact 3D camera trajectory and shader uniforms for JJHero3D
 * matching pradeepbabu.com's sunglasses-lens dive choreography.
 */
export function computeHeroDiveState(
  scrollProgress: number,
  pointerX = 0,
  pointerY = 0
): HeroCameraDiveState {
  const p = clamp01(scrollProgress);
  const px = Math.max(-1, Math.min(1, Number.isFinite(pointerX) ? pointerX : 0));
  const py = Math.max(-1, Math.min(1, Number.isFinite(pointerY) ? pointerY : 0));

  // Dive curve: from 0.25 to 0.85 scroll progress, camera dives toward the right lens
  const diveT = smoothstep(0.18, 0.86, p);
  const parallaxAttenuation = 1 - diveT * 0.92;

  const baseCamZ = 2.65;
  const targetCamZ = 0.565;
  const targetLensX = 0.088;
  const targetLensY = 0.149;

  const cameraX = targetLensX * diveT + px * 0.14 * parallaxAttenuation;
  const cameraY = targetLensY * diveT + py * 0.09 * parallaxAttenuation;
  const cameraZ = baseCamZ + (targetCamZ - baseCamZ) * diveT;

  const lookAtX = targetLensX * diveT;
  const lookAtY = targetLensY * diveT;
  const lookAtZ = 0;

  const dispScale = 1 - smoothstep(0.45, 0.85, p) * 0.88;
  const lensGlow = smoothstep(0.25, 0.78, p);
  const videoRevealProgress = smoothstep(0.62, 0.92, p);
  const wordmarkOpacity = 1 - smoothstep(0.05, 0.38, p);

  return {
    cameraX: Number(cameraX.toFixed(5)),
    cameraY: Number(cameraY.toFixed(5)),
    cameraZ: Number(cameraZ.toFixed(5)),
    lookAtX: Number(lookAtX.toFixed(5)),
    lookAtY: Number(lookAtY.toFixed(5)),
    lookAtZ,
    dispScale: Number(dispScale.toFixed(5)),
    lensGlow: Number(lensGlow.toFixed(5)),
    videoRevealProgress: Number(videoRevealProgress.toFixed(5)),
    wordmarkOpacity: Number(wordmarkOpacity.toFixed(5)),
  };
}

export interface RouteThemeConfig {
  dataTheme: string;
  themeBg: string;
  themeFg: string;
  themeAccent: string;
  themeSurface: string;
  logoColor: string;
  footerKey: 'home' | 'onField' | 'offField' | 'foundation' | 'partnerships';
}

export function resolveRouteTheme(pathname: string): RouteThemeConfig {
  const clean = (pathname || '/').split('?')[0].replace(/\/+$/, '') || '/';
  switch (clean) {
    case '/on-field':
      return {
        dataTheme: 'on-field',
        themeBg: '#0b0a0f',
        themeFg: '#f4efe6',
        themeAccent: '#d4a24a',
        themeSurface: '#1e1a2a',
        logoColor: '#f6f3ef',
        footerKey: 'onField',
      };
    case '/off-field':
      return {
        dataTheme: 'off-field',
        themeBg: '#2d2d2d',
        themeFg: '#f4efe6',
        themeAccent: '#9e6de9',
        themeSurface: '#1e1a2a',
        logoColor: '#f6f3ef',
        footerKey: 'offField',
      };
    case '/foundation':
      return {
        dataTheme: 'foundation',
        themeBg: '#dfd9d0',
        themeFg: '#171220',
        themeAccent: '#9e6de9',
        themeSurface: '#f4efe6',
        logoColor: '#171220',
        footerKey: 'foundation',
      };
    case '/partnerships':
      return {
        dataTheme: 'partnerships',
        themeBg: '#dfd9d0',
        themeFg: '#171220',
        themeAccent: '#3d246c',
        themeSurface: '#f4efe6',
        logoColor: '#171220',
        footerKey: 'partnerships',
      };
    case '/journal':
      return {
        dataTheme: 'journal',
        themeBg: '#dfd9d0',
        themeFg: '#171220',
        themeAccent: '#3d246c',
        themeSurface: '#f4efe6',
        logoColor: '#171220',
        footerKey: 'partnerships',
      };
    case '/inquiries':
      return {
        dataTheme: 'inquiries',
        themeBg: '#1e1035',
        themeFg: '#f4efe6',
        themeAccent: '#d4a24a',
        themeSurface: '#171220',
        logoColor: '#f6f3ef',
        footerKey: 'partnerships',
      };
    default:
      return {
        dataTheme: 'home',
        themeBg: '#0b0a0f',
        themeFg: '#f4efe6',
        themeAccent: '#d4a24a',
        themeSurface: '#1e1a2a',
        logoColor: '#f6f3ef',
        footerKey: 'home',
      };
  }
}

export function getYardlineMarkers(): number[] {
  return [10, 20, 30, 40, 50, 40, 30, 20, 10];
}

export function getDepthAssetsForPartner(slug: string): {
  diffuse: string;
  depth: string | null;
} {
  switch (slug) {
    case 'under-armour':
      return {
        diffuse: '/placeholders/partnerships-carousel-ua-3d.webp',
        depth: '/placeholders/partnerships-carousel-ua-depth.png',
      };
    case 'oakley':
      return {
        diffuse: '/placeholders/partnerships-carousel-oakley-3d.webp',
        depth: '/placeholders/partnerships-carousel-oakley-depth.png',
      };
    case 'raising-canes':
      return {
        diffuse: '/partners/raising-canes-3d.webp',
        depth: '/partners/raising-canes-depth.png',
      };
    default:
      return {
        diffuse: '/placeholders/partnerships-carousel-ua-3d.webp',
        depth: null,
      };
  }
}

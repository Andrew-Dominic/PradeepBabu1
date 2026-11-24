import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  clamp01,
  smoothstep,
  computeHeroDiveState,
  resolveRouteTheme,
  getYardlineMarkers,
  getDepthAssetsForPartner,
} from './cloneLogic.ts';

describe('cloneLogic pure functions', () => {
  it('clamps values to [0, 1] and handles NaN/Infinity safely', () => {
    assert.equal(clamp01(-5), 0);
    assert.equal(clamp01(0.45), 0.45);
    assert.equal(clamp01(10), 1);
    assert.equal(clamp01(Number.NaN), 0);
  });

  it('computes smoothstep interpolation accurately', () => {
    assert.equal(smoothstep(0.2, 0.8, 0.1), 0);
    assert.ok(Math.abs(smoothstep(0.2, 0.8, 0.5) - 0.5) < 1e-9);
    assert.equal(smoothstep(0.2, 0.8, 0.9), 1);
  });

  it('computes JJHero3D camera dive trajectory from resting portrait to sunglasses lens', () => {
    const start = computeHeroDiveState(0, 0, 0);
    assert.equal(start.cameraZ, 2.65);
    assert.equal(start.cameraX, 0);
    assert.equal(start.cameraY, 0);
    assert.equal(start.dispScale, 1);
    assert.equal(start.videoRevealProgress, 0);
    assert.equal(start.wordmarkOpacity, 1);

    const end = computeHeroDiveState(1, 0, 0);
    assert.equal(end.cameraZ, 0.565);
    assert.equal(end.lookAtX, 0.088);
    assert.equal(end.lookAtY, 0.149);
    assert.ok(end.dispScale < 0.2);
    assert.equal(end.videoRevealProgress, 1);
    assert.equal(end.wordmarkOpacity, 0);
  });

  it('resolves route themes and footer keys accurately for all routes', () => {
    const home = resolveRouteTheme('/');
    assert.equal(home.dataTheme, 'home');
    assert.equal(home.themeBg, '#0b0a0f');
    assert.equal(home.footerKey, 'home');

    const foundation = resolveRouteTheme('/foundation');
    assert.equal(foundation.dataTheme, 'foundation');
    assert.equal(foundation.themeBg, '#dfd9d0');
    assert.equal(foundation.footerKey, 'foundation');

    const journal = resolveRouteTheme('/journal?item=cleat-lv');
    assert.equal(journal.dataTheme, 'journal');
  });

  it('returns regulation yardline markers and partner depth assets', () => {
    assert.deepEqual(getYardlineMarkers(), [10, 20, 30, 40, 50, 40, 30, 20, 10]);
    const ua = getDepthAssetsForPartner('under-armour');
    assert.equal(ua.diffuse, '/placeholders/partnerships-carousel-ua-3d.webp');
    assert.equal(ua.depth, '/placeholders/partnerships-carousel-ua-depth.png');
  });
});

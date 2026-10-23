import { AREAS } from "@/live/events";

export const WORLD_SIZE = 900;
export const WATER_LEVEL = -1.2;

const smooth = (a: number, b: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

function raw(x: number, z: number) {
  return (
    Math.sin(x * 0.011 + 0.4) * Math.cos(z * 0.013) * 9 +
    Math.sin(x * 0.031 + 1.3) * Math.sin(z * 0.027 + 0.7) * 3.2 +
    Math.sin((x - z) * 0.07) * 0.6 +
    Math.cos(z * 0.006 - 1) * 5 + 2
  );
}

/** Ground height anywhere in the open world. Event areas are flattened. */
export function heightAt(x: number, z: number) {
  let h = raw(x, z);
  const r = Math.hypot(x - 60, z);
  h += Math.pow(Math.max(0, r - 300) * 0.12, 1.6); // mountain ring at the edge
  for (const a of Object.values(AREAS)) {
    const d = Math.hypot(x - a.x, z * 0.9);
    const k = smooth(a.size * 0.8, a.size * 0.8 + 28, d);
    h = h * k + 0.05 * (1 - k);
  }
  return h;
}

/** Deterministic random so every player sees the same trees. */
export function rng(seed: number) {
  let s = seed >>> 0;
  return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296);
}

export function nearArea(x: number, z: number, pad = 12) {
  return Object.values(AREAS).some((a) => Math.hypot(x - a.x, z) < a.size + pad);
}

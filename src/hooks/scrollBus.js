import { useLayoutEffect, useRef } from "react";

/**
 * One passive scroll/resize listener shared by every scroll-linked effect.
 * Subscribers run once per animation frame with (scrollY, viewportHeight).
 */
const subscribers = new Set();
let ticking = false;
let attached = false;

function frame() {
  ticking = false;
  const y = window.scrollY;
  const vh = window.innerHeight;
  subscribers.forEach((fn) => fn(y, vh));
}

function schedule() {
  if (ticking) return;
  ticking = true;
  requestAnimationFrame(frame);
}

function attach() {
  if (attached) return;
  window.addEventListener("scroll", schedule, { passive: true });
  window.addEventListener("resize", schedule);
  attached = true;
}

function detach() {
  if (!attached) return;
  window.removeEventListener("scroll", schedule);
  window.removeEventListener("resize", schedule);
  attached = false;
}

export function subscribeScroll(fn) {
  subscribers.add(fn);
  attach();
  fn(window.scrollY, window.innerHeight);
  return () => {
    subscribers.delete(fn);
    if (subscribers.size === 0) detach();
  };
}

/** Layout effect so the first values land before paint (no flash of un-styled state). */
export function useScrollSubscription(handler, enabled = true) {
  const ref = useRef(handler);
  ref.current = handler;
  useLayoutEffect(() => {
    if (!enabled) return;
    return subscribeScroll((y, vh) => ref.current(y, vh));
  }, [enabled]);
}

export const clamp = (v, min = 0, max = 1) => Math.min(max, Math.max(min, v));
export const lerp = (a, b, t) => a + (b - a) * t;
export const smoothstep = (t) => t * t * (3 - 2 * t);

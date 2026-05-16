import { useEffect, useRef } from 'react';

/**
 * useReveal – attaches an IntersectionObserver to a ref.
 * When the element enters the viewport, it adds the 'visible' class.
 *
 * @param {Object} options – IntersectionObserver options
 * @returns { ref } – attach to the element you want to animate
 */
export function useReveal(options = {}) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('visible');
          observer.unobserve(el); // animate once
        }
      },
      { threshold: 0.15, ...options }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return ref;
}

/**
 * useRevealChildren – staggered reveal for a list of children.
 * Adds 'visible' class with increasing delay to each child.
 *
 * @param {number} stagger – ms between each child reveal (default 100)
 */
export function useRevealChildren(stagger = 100) {
  const ref = useRef(null);

  useEffect(() => {
    const parent = ref.current;
    if (!parent) return;

    const children = Array.from(parent.children);
    children.forEach((child, i) => {
      child.style.transitionDelay = `${i * stagger}ms`;
    });

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          children.forEach(child => child.classList.add('visible'));
          observer.unobserve(parent);
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(parent);
    return () => observer.disconnect();
  }, [stagger]);

  return ref;
}
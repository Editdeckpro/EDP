// hooks/useInView.ts
import { useState, useEffect, useRef, useCallback } from "react";

interface UseInViewOptions {
  root?: Element | null;
  rootMargin?: string;
  threshold?: number | number[];
  triggerOnce?: boolean;
}

export function useInView({
  root = null,
  rootMargin = "0px",
  threshold = 0,
  triggerOnce = false,
}: UseInViewOptions = {}) {
  const [inView, setInView] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const elementRef = useRef<HTMLElement | null>(null);

  const setRef = useCallback(
    (node: HTMLElement | null) => {
      if (observerRef.current) observerRef.current.disconnect();
      if (!node) return;

      observerRef.current = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setInView(true);
            if (triggerOnce) {
              observerRef.current?.disconnect();
            }
          } else if (!triggerOnce) {
            setInView(false);
          }
        },
        { root, rootMargin, threshold }
      );

      observerRef.current.observe(node);
      elementRef.current = node;
    },
    [root, rootMargin, threshold, triggerOnce]
  );

  useEffect(() => {
    return () => observerRef.current?.disconnect();
  }, []);

  return { inView, setRef };
}

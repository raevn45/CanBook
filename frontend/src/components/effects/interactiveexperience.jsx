import { useEffect } from "react";

const TILT_TARGETS = ".live-menu-card, .menu-tile, .order-card, .analytics-stat-grid article, .analytics-panel-new, .canteen-menu-row, .auth-panel, .order-ticket";
const MAGNETIC_TARGETS = ".hero-cta, .hero-secondary, .giant-submit, .floating-cart, .ticket-button, .menu-add-button, .nav-pill, .nav-logout";

export default function InteractiveExperience() {
  useEffect(() => {
    const root = document.documentElement;
    let frame = 0;
    let pointer = { x: window.innerWidth / 2, y: window.innerHeight / 2 };

    const updatePointer = (event) => {
      pointer = { x: event.clientX, y: event.clientY };
      root.style.setProperty("--pointer-x", `${event.clientX}px`);
      root.style.setProperty("--pointer-y", `${event.clientY}px`);
    };

    const resetTilt = (element) => {
      element.style.setProperty("--tilt-x", "0deg");
      element.style.setProperty("--tilt-y", "0deg");
      element.style.setProperty("--glow-x", "50%");
      element.style.setProperty("--glow-y", "50%");
    };

    const onMove = (event) => {
      updatePointer(event);
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        const target = event.target instanceof Element ? event.target.closest(TILT_TARGETS) : null;
        if (!target) return;
        const rect = target.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width;
        const y = (event.clientY - rect.top) / rect.height;
        const tiltX = (0.5 - y) * 5;
        const tiltY = (x - 0.5) * 6;
        target.style.setProperty("--tilt-x", `${tiltX.toFixed(2)}deg`);
        target.style.setProperty("--tilt-y", `${tiltY.toFixed(2)}deg`);
        target.style.setProperty("--glow-x", `${(x * 100).toFixed(1)}%`);
        target.style.setProperty("--glow-y", `${(y * 100).toFixed(1)}%`);
      });
    };

    const onPointerOver = (event) => {
      const target = event.target instanceof Element ? event.target.closest(MAGNETIC_TARGETS) : null;
      if (!target || !target.contains(event.relatedTarget)) return;
      target.dataset.magnetic = "true";
    };

    const onClick = (event) => {
      const target = event.target instanceof Element ? event.target.closest("button, a") : null;
      if (!target || target.disabled) return;
      target.classList.remove("is-pressed");
      void target.offsetWidth;
      target.classList.add("is-pressed");
      window.setTimeout(() => target.classList.remove("is-pressed"), 260);
    };

    const onPointerLeave = (event) => {
      const target = event.target instanceof Element ? event.target.closest(TILT_TARGETS) : null;
      if (target && !target.contains(event.relatedTarget)) resetTilt(target);
    };

    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const progress = max > 0 ? window.scrollY / max : 0;
      root.style.setProperty("--scroll-progress", progress.toFixed(4));
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerover", onPointerOver, { passive: true });
    document.addEventListener("pointerout", onPointerLeave, { passive: true });
    document.addEventListener("click", onClick);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    return () => {
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerover", onPointerOver);
      document.removeEventListener("pointerout", onPointerLeave);
      document.removeEventListener("click", onClick);
      window.removeEventListener("scroll", onScroll);
      if (frame) cancelAnimationFrame(frame);
      void pointer;
    };
  }, []);

  return (
    <>
      <div className="interaction-cursor" aria-hidden="true" />
      <div className="scroll-progress" aria-hidden="true" />
      <div className="pointer-spotlight" aria-hidden="true" />
    </>
  );
}

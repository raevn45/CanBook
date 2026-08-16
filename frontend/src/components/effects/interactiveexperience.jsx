import { useEffect } from "react";

const TILT_TARGETS = ".live-menu-card, .menu-tile, .order-card, .analytics-stat-grid article, .analytics-panel-new, .canteen-menu-row, .auth-panel, .order-ticket, .queue-card, .staff-command-card, .staff-panel, .order-detail-ticket, .detail-side-panel";

export default function InteractiveExperience() {
  useEffect(() => {
    const root = document.documentElement;
    let frame = 0;

    const updatePointer = (event) => {
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
        if (!rect.width || !rect.height) return;
        const x = (event.clientX - rect.left) / rect.width;
        const y = (event.clientY - rect.top) / rect.height;
        target.style.setProperty("--tilt-x", `${((0.5 - y) * 2.5).toFixed(2)}deg`);
        target.style.setProperty("--tilt-y", `${((x - 0.5) * 3).toFixed(2)}deg`);
        target.style.setProperty("--glow-x", `${(x * 100).toFixed(1)}%`);
        target.style.setProperty("--glow-y", `${(y * 100).toFixed(1)}%`);
      });
    };

    const onPointerOut = (event) => {
      const target = event.target instanceof Element ? event.target.closest(TILT_TARGETS) : null;
      if (target && !target.contains(event.relatedTarget)) resetTilt(target);
    };

    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      root.style.setProperty("--scroll-progress", (max > 0 ? window.scrollY / max : 0).toFixed(4));
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerout", onPointerOut, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    return () => {
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerout", onPointerOut);
      window.removeEventListener("scroll", onScroll);
      if (frame) cancelAnimationFrame(frame);
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

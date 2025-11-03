// script.js – generelle sidefunktioner (uden accordion)
document.addEventListener("DOMContentLoaded", () => {
  console.log("✅ script.js loaded (clean)");

  // === Auto-opdater årstal ===
  const year = document.getElementById("current-year");
  if (year) year.textContent = new Date().getFullYear();

  // === Scroll-fade animationer (inkl. vandrette/lodrette varianter) ===
  // === Scroll-fade (Safari-proof) ===
(function () {
  const targets = Array.from(
    document.querySelectorAll(
      ".fade-section, .fade-in-child, .fade-left, .fade-right, .fade-up"
    )
  );
  if (!targets.length) return;

  const reveal = (el) => el.classList.add("visible");

  // Immediate pass for elements already on screen (Safari sometimes misses first IO tick)
  const preReveal = () => {
    const vh = window.innerHeight || document.documentElement.clientHeight;
    targets.forEach((el) => {
      const r = el.getBoundingClientRect();
      if (r.top < vh * 0.9 && r.bottom > 0) reveal(el);
    });
  };

  // IntersectionObserver with generous margins (helps on iOS/Safari)
  let io;
  try {
    io = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            reveal(e.target);
            obs.unobserve(e.target);
          }
        });
      },
      {
        root: null,
        threshold: 0.1,
        rootMargin: "0px 0px -10% 0px", // reveal a bit earlier
      }
    );
    targets.forEach((el) => io.observe(el));
  } catch {
    io = null;
  }

  // Fallback: throttle scroll/resize for browsers/environments where IO is flaky
  let ticking = false;
  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      preReveal();
      ticking = false;
    });
  };

  // Initial passes (double rAF helps Safari after layout settles)
  requestAnimationFrame(() => {
    preReveal();
    requestAnimationFrame(preReveal);
  });

  // Attach fallback listeners (lightweight)
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll, { passive: true });

  // Also re-check after images/fonts load
  window.addEventListener("load", () => {
    preReveal();
    setTimeout(preReveal, 0);
  });
})();
});
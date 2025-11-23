// script.js – generelle sidefunktioner (uden accordion)
document.addEventListener("DOMContentLoaded", () => {
  console.log("✅ script.js loaded (smooth scroll + fade)");

  // === Auto-opdater årstal ===
  const year = document.getElementById("current-year");
  if (year) year.textContent = new Date().getFullYear();

  // === Scroll-fade animationer ===
  (function () {
    const targets = Array.from(document.querySelectorAll(
      ".fade-section, .fade-in-child, .fade-left, .fade-right, .fade-up"
    ));
    if (!targets.length) return;

    const reveal = (el) => el.classList.add("visible");
    const preReveal = () => {
      const vh = window.innerHeight || document.documentElement.clientHeight;
      targets.forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.top < vh * 0.9 && r.bottom > 0) reveal(el);
      });
    };

    let io;
    try {
      io = new IntersectionObserver((entries, obs) => {
        entries.forEach(e => {
          if (e.isIntersecting) {
            reveal(e.target);
            obs.unobserve(e.target);
          }
        });
      }, { root: null, threshold: 0.1, rootMargin: "0px 0px -10% 0px" });
      targets.forEach(el => io.observe(el));
    } catch { io = null; }

    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => { preReveal(); ticking = false; });
    };

    requestAnimationFrame(() => { preReveal(); requestAnimationFrame(preReveal); });
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    window.addEventListener("load", () => { preReveal(); setTimeout(preReveal, 0); });
  })();

  // === Smooth scroll med offset (hero → beregner / beregner → FAQ) ===
  const OFFSET = 80; // justér så overskriften ikke skjules

  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener("click", (e) => {
      const targetID = link.getAttribute("href");
      if (!targetID || targetID === "#") return;
      const target = document.querySelector(targetID);
      if (!target) return;

      e.preventDefault();

      // Opdater hash uden jump
      history.pushState(null, "", targetID);

      // Smooth scroll
      const offsetTop = target.getBoundingClientRect().top + window.scrollY - OFFSET;
      window.scrollTo({ top: offsetTop, behavior: "smooth" });
    });
  });
});

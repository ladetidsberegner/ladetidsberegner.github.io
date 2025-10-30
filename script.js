// script.js – generelle sidefunktioner (uden accordion)
document.addEventListener("DOMContentLoaded", () => {
  console.log("✅ script.js loaded (clean)");

  // === Auto-opdater årstal ===
  const year = document.getElementById("current-year");
  if (year) year.textContent = new Date().getFullYear();

  // === Scroll-fade animationer ===
  const fades = document.querySelectorAll(".fade-section, .fade-in-child");
  const io = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("visible");
        obs.unobserve(entry.target);
      });
    },
    { threshold: 0.15 }
  );
  fades.forEach(el => io.observe(el));

  // === Anti-overlay fix ===
  const hero = document.querySelector(".hero");
  if (hero) hero.style.pointerEvents = "auto";

  console.log("✅ Fade + årstal + anti-overlay aktiv");
});

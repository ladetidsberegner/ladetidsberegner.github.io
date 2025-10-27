// script.js – generelle sidefunktioner (ikke cookies)
document.addEventListener("DOMContentLoaded", function () {

  console.log("✅ script.js loaded");

  // === Auto-opdater årstal i footer ===
  const yearSpan = document.getElementById("current-year");
  if (yearSpan) {
    const year = new Date().getFullYear();
    yearSpan.textContent = year;
  }

  // === Scroll fade animationer ===
  const faders = document.querySelectorAll(".fade-section, .fade-in-child");
  const options = { threshold: 0.15 };

  const appearOnScroll = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("visible");
      observer.unobserve(entry.target);
    });
  }, options);

  faders.forEach(el => appearOnScroll.observe(el));

  // === Beregner-sektion toggle (accordion) ===
  const sections = document.querySelectorAll(".calc-section, .advanced-section");

  sections.forEach(section => {
    const button = section.querySelector("button");
    const content = section.querySelector(".calc-answer, .advanced-answer");
    if (!button || !content) return;

    button.addEventListener("click", () => {
      const isOpen = button.getAttribute("aria-expanded") === "true";

      // Luk alle andre
      sections.forEach(s => {
        const b = s.querySelector("button");
        const c = s.querySelector(".calc-answer, .advanced-answer");
        if (b && c) {
          b.setAttribute("aria-expanded", "false");
          c.setAttribute("aria-hidden", "true");
          c.style.height = "0";
        }
      });

      // Åbn den valgte, hvis den ikke allerede er åben
      if (!isOpen) {
        button.setAttribute("aria-expanded", "true");
        content.setAttribute("aria-hidden", "false");
        content.style.height = content.scrollHeight + "px";
      }
    });
  });

  // === Bookmark-knap (smartphone "tilføj til hjemmeskærm") ===
  const bookmarkBtn = document.getElementById("bookmark-btn");
  if (bookmarkBtn) {
    let promptShown = false;

    function showBookmarkPrompt() {
      if (promptShown) return;
      promptShown = true;
      bookmarkBtn.classList.add("show");
    }

    // Vis efter 8 sekunder
    setTimeout(showBookmarkPrompt, 8000);

    bookmarkBtn.addEventListener("click", function () {
      alert("📲 Tip: Tryk på 'Del' og vælg 'Føj til hjemmeskærm' for at gemme appen.");
      bookmarkBtn.classList.remove("show");
    });
  }

  // === Anti-overlay fix: gør hero klikbar ===
  const hero = document.querySelector(".hero::before");
  if (hero) hero.style.pointerEvents = "none";

  console.log("✅ Fade + årstal + beregner-toggles aktiveret");
});

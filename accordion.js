(function () {
  "use strict";

  function setOpen(container, panel, open) {
    if (!container || !panel) return;

    if (open) {
      container.classList.add("open");
      panel.style.height = panel.scrollHeight + "px";
      container.querySelector("button")?.setAttribute("aria-expanded", "true");
      panel.setAttribute("aria-hidden", "false");
    } else {
      container.classList.remove("open");
      panel.style.height = panel.scrollHeight + "px";
      panel.offsetHeight;
      panel.style.height = "0px";
      container.querySelector("button")?.setAttribute("aria-expanded", "false");
      panel.setAttribute("aria-hidden", "true");
    }
  }

  function onTransitionEnd(e) {
    if (e.propertyName !== "height") return;
    const panel = e.target;
    const container = panel.closest(".calc-section, .advanced-section, .faq-item");
    if (!container) return;
    panel.style.height = container.classList.contains("open") ? "auto" : "0px";
  }

  document.addEventListener("DOMContentLoaded", () => {
    const calcSections = [...document.querySelectorAll(".calc-section")];
    const faqItems = [...document.querySelectorAll(".faq-item")];
    const advancedSection = document.querySelector(".advanced-section");

    // ---------- CALC ----------
    calcSections.forEach(sec => {
      const btn = sec.querySelector(".calc-question");
      const panel = sec.querySelector(".calc-answer");
      if (!btn || !panel) return;

      panel.style.height = "0px";
      panel.setAttribute("aria-hidden", "true");
      btn.setAttribute("aria-expanded", "false");
      panel.addEventListener("transitionend", onTransitionEnd);

      btn.addEventListener("click", e => {
        e.preventDefault();
        const isOpen = sec.classList.contains("open");

        calcSections.forEach(other => {
          if (other !== sec) {
            setOpen(other, other.querySelector(".calc-answer"), false);
          }
        });

        setOpen(sec, panel, !isOpen);
      });
    });

    // ---------- ADVANCED (ÅBEN SOM STANDARD) ----------
    if (advancedSection) {
      const btn = advancedSection.querySelector(".advanced-question");
      const panel = advancedSection.querySelector(".advanced-answer");
      if (panel) {
        panel.style.height = "auto";
        panel.setAttribute("aria-hidden", "false");
        advancedSection.classList.add("open");
        panel.addEventListener("transitionend", onTransitionEnd);

        btn?.addEventListener("click", e => {
          e.preventDefault();
          setOpen(
            advancedSection,
            panel,
            !advancedSection.classList.contains("open")
          );
        });
      }
    }

    // ---------- FAQ ----------
    faqItems.forEach(item => {
      const btn = item.querySelector(".faq-question");
      const panel = item.querySelector(".faq-answer");
      if (!btn || !panel) return;

      panel.style.height = "0px";
      panel.setAttribute("aria-hidden", "true");
      btn.setAttribute("aria-expanded", "false");
      panel.addEventListener("transitionend", onTransitionEnd);

      btn.addEventListener("click", e => {
        e.preventDefault();
        const isOpen = item.classList.contains("open");

        faqItems.forEach(other => {
          if (other !== item) {
            setOpen(other, other.querySelector(".faq-answer"), false);
          }
        });

        setOpen(item, panel, !isOpen);
      });
    });

    // ---------- SCROLL.JS → ACCORDION ----------
    window.addEventListener("anchor:scrolled", e => {
      const id = e.detail?.id;
      if (!id) return;

      const target = document.getElementById(id);
      if (!target) return;

      const container = target.closest(".faq-item, .calc-section");
      if (!container) return;

      const panel =
        container.querySelector(".faq-answer") ||
        container.querySelector(".calc-answer");

      if (!panel) return;

      if (container.classList.contains("faq-item")) {
        faqItems.forEach(other => {
          if (other !== container) {
            setOpen(other, other.querySelector(".faq-answer"), false);
          }
        });
      }

      if (container.classList.contains("calc-section")) {
        calcSections.forEach(other => {
          if (other !== container) {
            setOpen(other, other.querySelector(".calc-answer"), false);
          }
        });
      }

      setOpen(container, panel, true);
    });
  });
})();


document.addEventListener('DOMContentLoaded', () => {
  const firstSection = document.querySelector('.calc-section');
  if (!firstSection) return;

  const answer = firstSection.querySelector('.calc-answer');
  if (!answer) return;

  firstSection.classList.add('open');
  answer.setAttribute('aria-hidden', 'false');
  answer.style.height = answer.scrollHeight + 'px';
});


const hash = window.location.hash;
if (hash) {
  const section = document.querySelector(hash);
  if (section && section.classList.contains("calc-section")) {
    section.classList.add("open");
    section.querySelector(".calc-answer")?.setAttribute("aria-hidden", "false");
  }
}

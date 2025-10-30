// accordion.js — Én kilde til sandhed for alle fold-ud
document.addEventListener("DOMContentLoaded", () => {
  function setupGroup({ root, itemSel, btnSel, pnlSel, exclusive = true, persistKey = null }) {
    const container = document.querySelector(root);
    if (!container) return;
    const items = Array.from(container.querySelectorAll(itemSel));

    // Init
    items.forEach((item) => {
      const btn = item.querySelector(btnSel);
      const pnl = item.querySelector(pnlSel);
      if (!btn || !pnl) return;

      let isOpen = item.classList.contains("open") || btn.getAttribute("aria-expanded") === "true";

      // Persistens kun for advanced-section
      if (persistKey && item.matches(".advanced-section")) {
        const saved = localStorage.getItem(persistKey);
        if (saved === "true") isOpen = true;
        if (saved === "false") isOpen = false;
      }

      item.classList.toggle("open", isOpen);
      btn.setAttribute("aria-expanded", isOpen ? "true" : "false");
      pnl.setAttribute("aria-hidden", isOpen ? "false" : "true");
      pnl.style.height = isOpen ? "auto" : "0px";
    });

    // Klik-delegation
    container.addEventListener("click", (e) => {
      const btn = e.target.closest(btnSel);
      if (!btn) return;
      e.preventDefault();

      const item = btn.closest(itemSel);
      const pnl  = item?.querySelector(pnlSel);
      if (!item || !pnl) return;

      const wasOpen = item.classList.contains("open");

      // Eksklusiv: luk andre først
      if (exclusive) {
        items.forEach((other) => {
          if (other === item || !other.classList.contains("open")) return;
          const obtn = other.querySelector(btnSel);
          const opnl = other.querySelector(pnlSel);
          other.classList.remove("open");
          obtn?.setAttribute("aria-expanded", "false");
          if (opnl) {
            opnl.setAttribute("aria-hidden", "true");
            opnl.style.height = opnl.scrollHeight + "px";
            void opnl.offsetHeight;
            opnl.style.height = "0px";
          }
        });
      }

      // Toggle current
      if (wasOpen) {
        item.classList.remove("open");
        btn.setAttribute("aria-expanded", "false");
        pnl.setAttribute("aria-hidden", "true");
        pnl.style.height = pnl.scrollHeight + "px";
        void pnl.offsetHeight;
        pnl.style.height = "0px";
      } else {
        item.classList.add("open");
        btn.setAttribute("aria-expanded", "true");
        pnl.setAttribute("aria-hidden", "false");
        pnl.style.height = "0px";
        requestAnimationFrame(() => {
          pnl.style.height = pnl.scrollHeight + "px";
        });
      }

      // Persistér kun advanced-section
      if (persistKey && item.matches(".advanced-section")) {
        localStorage.setItem(persistKey, String(!wasOpen));
      }
    });

    // Efter transition: auto-højde på åbne
    container.addEventListener("transitionend", (ev) => {
      if (ev.propertyName !== "height") return;
      const pnl  = ev.target;
      const item = pnl.closest(itemSel);
      if (!item) return;
      pnl.style.height = item.classList.contains("open") ? "auto" : "0px";
    });
  }

  // Spor 1–3: eksklusiv
  setupGroup({
    root: ".beregner-container",
    itemSel: ".calc-section",
    btnSel: ".calc-question",
    pnlSel: ".calc-answer",
    exclusive: true
  });

  // Indstillinger: uafhængig + husk tilstand
  setupGroup({
    root: ".beregner-container",
    itemSel: ".advanced-section",
    btnSel: ".advanced-question",
    pnlSel: ".advanced-answer",
    exclusive: false,
    persistKey: "calc-adv-open"
  });

  // FAQ: eksklusiv
  setupGroup({
    root: ".faq",
    itemSel: ".faq-item",
    btnSel: ".faq-question",
    pnlSel: ".faq-answer",
    exclusive: true
  });
});

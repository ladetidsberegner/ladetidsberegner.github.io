/* =========================
   LOAD COMMON <HEAD>
   ========================= */
fetch("/includes/head-common.html")
  .then(r => r.text())
  .then(html => document.head.insertAdjacentHTML("beforeend", html));

console.log("includes-menu.js loaded");

/* =========================
   LOAD HEADER
   ========================= */
fetch("/includes/header.html")
  .then(r => r.text())
  .then(html => {
    const mount = document.getElementById("site-header");
    if (!mount) return;

    mount.innerHTML = html;
    console.log("header inserted");

    // Kør alt header-logik EFTER HTML er indsat
    initHeader(mount);
  });

/* =========================
   HEADER LOGIC
   ========================= */
function initHeader(headerRoot) {
  const header = headerRoot.querySelector(".site-header") || headerRoot;
  const toggle = headerRoot.querySelector(".menu-toggle");
  const nav = headerRoot.querySelector(".site-nav");
  const items = nav ? nav.querySelectorAll("li") : [];

  if (!header || !toggle || !nav) return;

  /* === Sticky header === */
  window.addEventListener("scroll", () => {
    header.classList.toggle("is-sticky", window.scrollY > 80);
  });

  /* === Burger toggle (mobil) === */
  toggle.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    toggle.classList.toggle("active");

    // reset animation
    items.forEach(li => li.classList.remove("is-visible"));

    if (open) {
      items.forEach((li, i) => {
        setTimeout(() => li.classList.add("is-visible"), i * 120);
      });
    }
  });

  /* === Luk menu ved klik på link === */
  nav.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
      nav.classList.remove("open");
      toggle.classList.remove("active");
      items.forEach(li => li.classList.remove("is-visible"));
    });
  });

  /* === FAQ Accordion (mobil) === */
  const faqItem = nav.querySelector(".has-submenu");
  const faqToggle = nav.querySelector(".faq-toggle");

  if (faqItem && faqToggle) {
    faqToggle.addEventListener("click", e => {
      if (window.innerWidth <= 768) {
        e.preventDefault();
        faqItem.classList.toggle("open");
      }
    });
  }
}

fetch("includes/head-common.html")
  .then(r => r.text())
  .then(h => document.head.insertAdjacentHTML("beforeend", h));

console.log("includes-menu.js loaded");

fetch("includes/header.html")
  .then(r => r.text())
  .then(html => {
    const mount = document.getElementById("site-header");
    if (!mount) return;
    mount.innerHTML = html;
    console.log("header inserted");
  });
/* =========================
   LOAD COMMON <HEAD>
   ========================= */
fetch("includes/head-common.html")
  .then(r => r.text())
  .then(html => document.head.insertAdjacentHTML("beforeend", html));

console.log("includes-menu.js loaded");

/* =========================
   LOAD HEADER
   ========================= */
fetch("includes/header.html")
  .then(r => r.text())
  .then(html => {
    const mount = document.getElementById("site-header");
    if (!mount) return;

    mount.innerHTML = html;
    console.log("header inserted");

    // ⚡ Kør først når header er i DOM
    requestAnimationFrame(initHeader);
  });

/* =========================
   HEADER LOGIC – BURGER + ANIMATION
   ========================= */
function initHeader() {
  const header = document.querySelector(".site-header");
  const toggle = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".site-nav");
  if (!header || !toggle || !nav) return;

  const items = nav.querySelectorAll("li");

  /* === Sticky header === */
  window.addEventListener("scroll", () => {
    header.classList.toggle("is-sticky", window.scrollY > 80);
  });

  /* === Burger toggle / slide-in === */
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

  /* === Luk menu ved klik på et link === */
  nav.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
      nav.classList.remove("open");
      toggle.classList.remove("active");
      items.forEach(li => li.classList.remove("is-visible"));
    });
  });
}

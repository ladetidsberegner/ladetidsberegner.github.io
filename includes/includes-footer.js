console.log("includes-footer.js loaded");

/* =========================
   LOAD FOOTER
========================= */
fetch("/includes/footer.html")
  .then(r => r.text())
  .then(html => {
    const mount = document.getElementById("site-footer");
    if (!mount) return;

    mount.innerHTML = html;
    console.log("footer inserted");

    // init fade animation
    initFadeAnimations();

    // init Buy Me a Coffee
    initBuyMeACoffee();

    // Fortæl master.js at footeren er klar
    document.dispatchEvent(new Event("footerLoaded"));
  });

  console.log("includes-footer.js loaded");

fetch("/includes/footer.html")
  .then(r => r.text())
  .then(html => {
    const mount = document.getElementById("site-footer");
    if (!mount) return;

    mount.innerHTML = html;
    console.log("footer inserted");

    initFadeAnimations();
    initMail();
    initBuyMeACoffee();
  });

/* =========================
   MAIL (ANTI-SPAM)
   ========================= */
function initMail() {
  const mailSpan = document.getElementById("kontakt-mail");
  if (!mailSpan) return;

  const user = "chargeme";
  const domain = "outlook.com";
  const email = `${user}@${domain}`;

  mailSpan.innerHTML = `<a href="mailto:${email}">${email}</a>`;
  console.log("📧 Mail initialized");
}


/* =========================
   FADE ANIMATIONS
========================= */
function initFadeAnimations() {
  const elements = document.querySelectorAll(".fade-left, .fade-right, .fade-up");
  if (!elements.length) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  elements.forEach(el => observer.observe(el));
}



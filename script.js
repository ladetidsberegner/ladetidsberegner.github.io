// Beskyt e-mail mod spambots
document.addEventListener("DOMContentLoaded", () => {
  const kontaktEl = document.getElementById("kontakt-mail");
  if (kontaktEl) {
    const user = "chargeme";
    const domain = "outlook.dk";
    const mail = `${user}@${domain}`;
    kontaktEl.innerHTML = `<a href="mailto:${mail}">${mail}</a>`;
  }
});


// Smooth scroll til #bereger — virker i Safari/Chrome/Firefox + fallback
document.addEventListener("DOMContentLoaded", () => {
  const TARGET_ID = "bereger";

  function getScrollTop() {
    return window.scrollY || document.documentElement.scrollTop || document.body.scrollTop || 0;
  }

  function animateTo(y, duration = 1400) {//sæt frt her
    const start = getScrollTop();
    const dist = y - start;
    const ease = t => 1 - Math.pow(1 - t, 3); // easeOutCubic
    let t0 = null;

    function step(ts) {
      if (!t0) t0 = ts;
      const p = Math.min((ts - t0) / duration, 1);
      const cur = start + dist * ease(p);
      window.scrollTo(0, cur);
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  document.addEventListener("click", (e) => {
    const a = e.target.closest('a[href="#bereger"]');
    if (!a) return;

    const el = document.getElementById(TARGET_ID);
    if (!el) return;

    e.preventDefault();

    // 1) Prøv native scrollIntoView (respekterer CSS: #bereger { scroll-margin-top: 70px; })
    const before = getScrollTop();
    try {
      el.scrollIntoView({ behavior: "smooth", block: "start", inline: "nearest" });
    } catch (_) {
      // ignorer
    }

    // 2) Hvis vi ikke flytter os (Safari der “hopper”/ignorerer), kør fallback-animation
    setTimeout(() => {
      const after = getScrollTop();
      if (Math.abs(after - before) < 2) {
        // Beregn mål uden at stole på smooth behavior
        const rect = el.getBoundingClientRect();
        const targetY = rect.top + getScrollTop() - 70; // samme offset som din CSS scroll-margin-top
        animateTo(targetY, 1400);//sæt fart her
      }
    }, 120);
  });
});

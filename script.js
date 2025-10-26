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

// === Scroll animationer ===
document.addEventListener("DOMContentLoaded", () => {
  const fadeSections = document.querySelectorAll(".fade-section");

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");

        // Find børneelementer, der skal fade ind separat
        const children = entry.target.querySelectorAll("h1, h2, h3, p, li, .calc-section, .faq-item");
        children.forEach((child, i) => {
          child.classList.add("fade-in-child");
          setTimeout(() => child.classList.add("visible"), i * 120);
        });

        sectionObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.2
  });

  fadeSections.forEach(sec => sectionObserver.observe(sec));
});
// === Bookmark-knap – vis altid (også efter reload) ===
document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("bookmark-btn");
  if (!btn) return;

  // Vis altid efter 2 sekunder
  setTimeout(() => {
    btn.classList.add("show");
  }, 2000);

  // Klikhåndtering
  btn.addEventListener("click", () => {
    alert("📱 Tilføj Ladetidsberegner.dk til din hjemmeskærm via din browsers menu.");
    // Skjul kun midlertidigt
    btn.classList.remove("show");
    setTimeout(() => btn.classList.add("show"), 5000);
  });
});


// === Fjern uønskede Google-overlays løbende (Safari fix) ===
// setInterval(() => {
//   document.querySelectorAll(
//     'iframe[src*="fundingchoicesmessages.google.com"], ' +
//     'iframe[src*="consent.google.com"], ' +
//     'iframe[src*="googleads.g.doubleclick.net"], ' +
//     'iframe[style*="z-index: 2147483647"]'
//   ).forEach(el => {
//     el.remove();
//   });
// }, 3000);


// === 👻 Safari Spøgelsesdetektor ===
document.addEventListener("DOMContentLoaded", () => {
  // 1️⃣ Tjek for manifest-link i <head>
  const manifest = document.querySelector('link[rel="manifest"], link[rel="webmanifest"]');
  if (manifest) {
    console.warn("⚠️ Der er stadig et manifest-link i <head>:", manifest.href);
  } else {
    console.log("✅ Ingen manifest fundet – godt tegn!");
  }

  // 2️⃣ Tjek for registreret Service Worker
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.getRegistrations().then(regs => {
      if (regs.length > 0) {
        console.warn("👻 Advarsel: Service Worker registreret!", regs);
      } else {
        console.log("✅ Ingen aktive Service Workers fundet.");
      }
    }).catch(err => {
      console.error("Fejl under SW-tjek:", err);
    });
  } else {
    console.log("ℹ️ Browseren understøtter ikke Service Workers (eller de er slået fra).");
  }

  // 3️⃣ Ekstra: advar, hvis Safari opretter en PWADataStore i runtime
  if (navigator.standalone || window.matchMedia('(display-mode: standalone)').matches) {
    console.warn("👀 Safari kører i 'standalone' tilstand — mulig gammel PWA-cache.");
  }
});


// Automatisk opdatering af årstal i footer
document.addEventListener("DOMContentLoaded", function () {
  const yearEl = document.getElementById("current-year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
});

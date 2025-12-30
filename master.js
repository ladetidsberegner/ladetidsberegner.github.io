document.addEventListener('DOMContentLoaded', () => {
  console.log('master.js loaded');

  /* =======================
     FADE-IN SECTIONS
  ======================= */
  const faders = document.querySelectorAll('.fade-section, .fade-left, .fade-right, .fade-up, .fade-in-child');
  const appearOptions = { threshold: 0.1 };
  const appearOnScroll = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, appearOptions);
  faders.forEach(fader => appearOnScroll.observe(fader));
  console.log(`fade observer initialized for – ${faders.length} – "elements"`);

  /* =======================
     BOOKMARK BUTTON
  ======================= */
  const bookmarkBtn = document.querySelector('.bookmark-btn');
  if (bookmarkBtn) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 400) bookmarkBtn.classList.add('show');
      else bookmarkBtn.classList.remove('show');
    });
    bookmarkBtn.addEventListener('click', () => {
      const bookmarkURL = window.location.href;
      const bookmarkTitle = document.title;
      try {
        if (window.sidebar && window.sidebar.addPanel) window.sidebar.addPanel(bookmarkTitle, bookmarkURL, '');
        else if (window.external && ('AddFavorite' in window.external)) window.external.AddFavorite(bookmarkURL, bookmarkTitle);
        else alert('Tilføj vores side til din startskærm for hurtig adgang til ladetidsberegneren.');
      } catch (err) {
        alert('Tilføj vores side til din startskærm for hurtig adgang til ladetidsberegneren.');
      }
    });
  }

  /* =======================
     COOKIE BANNER
  ======================= */
  const cookieBanner = document.querySelector('.cookie-banner');
  const cookieAcceptBtn = document.querySelector('#cookie-accept, #accept-cookies');
  const cookieDeclineBtn = document.querySelector('#cookie-decline, #reject-cookies');
  const changeConsentBtn = document.querySelector('#change-cookie-consent, .change-cookie-consent');
  function hideBanner() { if (cookieBanner) cookieBanner.style.display = 'none'; }
  if (cookieAcceptBtn) cookieAcceptBtn.addEventListener('click', hideBanner);
  if (cookieDeclineBtn) cookieDeclineBtn.addEventListener('click', hideBanner);
  if (changeConsentBtn) changeConsentBtn.addEventListener('click', () => {
    const popup = document.querySelector('.cookie-policy-popup');
    if (popup) popup.style.display = 'block';
  });
  document.querySelectorAll('.cookie-policy-content .close').forEach(btn => {
    btn.addEventListener('click', () => {
      const popup = btn.closest('.cookie-policy-popup');
      if (popup) popup.style.display = 'none';
    });
  });

  /* =======================
     ÅRSTAL (automatisk)
  ======================= */
  const yearElems = document.querySelectorAll('.js-year');
  const thisYear = new Date().getFullYear();
  yearElems.forEach(el => el.textContent = thisYear);
});


//Bookmark
document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("bookmark-btn");
  if (!btn) return;

  let deferredPrompt = null;

  // Lyt efter PWA / install-event
  window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault();
    deferredPrompt = e;

    // Vis knappen
    btn.classList.add("show");
  });

  // Klik på knappen → vis systemets installation-popup
  btn.addEventListener("click", async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();

    const choice = await deferredPrompt.userChoice;
    if (choice.outcome === "accepted") {
      console.log("Bruger installerede appen");
    } else {
      console.log("Bruger afslog installationen");
    }

    deferredPrompt = null;
  });
});

(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", () => {
    const input = document.getElementById("ladetab");
    const radioBeregnet = document.getElementById("ladetab-beregnet");
    const radioTastet = document.getElementById("ladetab-tastet");
    const info = document.getElementById("beregnet-ladetab-info");

    if (!input || !radioBeregnet || !radioTastet) return;

    // Gem beregnet værdi separat
    let beregnetVærdi = null;

    // Når beregneren sætter en værdi (kaldes fra spor4)
    window.setBeregnetLadetab = function (værdi) {
      beregnetVærdi = værdi;

      radioBeregnet.disabled = false;
      radioBeregnet.checked = true;
      radioTastet.checked = false;

      input.value = værdi;
      input.readOnly = true;

      if (info) info.textContent = `(Beregnet: ${værdi} %)`;
    };

    // Vælg beregnet
    radioBeregnet.addEventListener("change", () => {
      if (!radioBeregnet.checked || beregnetVærdi === null) return;

      input.value = beregnetVærdi;
      input.readOnly = true;
    });

    // Vælg tastet
    radioTastet.addEventListener("change", () => {
      if (!radioTastet.checked) return;

      input.readOnly = false;
      input.focus();
    });
  });
})();


(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", () => {
    const kapacitetEl = document.getElementById("kapacitet");
    const ladetabInput = document.getElementById("ladetab");
    const radioBeregnet = document.getElementById("ladetab-beregnet");
    const radioTastet = document.getElementById("ladetab-tastet");

    /* ========= BATTERIKAPACITET ========= */
    if (kapacitetEl) {
      const savedKap = localStorage.getItem("batteri_kapacitet");
      if (savedKap !== null) kapacitetEl.value = savedKap;

      kapacitetEl.addEventListener("input", () => {
        localStorage.setItem("batteri_kapacitet", kapacitetEl.value);
      });
    }

    /* ========= LADETAB – TYPE & VÆRDI ========= */
    const savedType = localStorage.getItem("ladetab_type"); // "beregnet" | "tastet"
    const savedValue = localStorage.getItem("ladetab_tastet");

    if (radioTastet && radioBeregnet && ladetabInput) {
      // Gendan valg
      if (savedType === "tastet") {
        radioTastet.checked = true;
        ladetabInput.readOnly = false;
        if (savedValue !== null) ladetabInput.value = savedValue;
      } else {
        radioBeregnet.checked = true;
        ladetabInput.readOnly = true;
      }

      // Skift → beregnet
      radioBeregnet.addEventListener("change", () => {
        if (!radioBeregnet.checked) return;
        ladetabInput.readOnly = true;
        localStorage.setItem("ladetab_type", "beregnet");
      });

      // Skift → tastet
      radioTastet.addEventListener("change", () => {
        if (!radioTastet.checked) return;
        ladetabInput.readOnly = false;
        ladetabInput.focus();
        localStorage.setItem("ladetab_type", "tastet");
      });

      // Gem tastet værdi
      ladetabInput.addEventListener("input", () => {
        if (radioTastet.checked) {
          localStorage.setItem("ladetab_tastet", ladetabInput.value);
        }
      });
    }
  });
})();

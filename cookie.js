/*
  cookie.js
  Dynamisk loader Google Analytics (gtag) og AdSense EFTER brugeraccept.
  Forudsætning: De statiske <script> tags til gtag/adsbygoogle i HTML er kommenteret ud.
*/

document.addEventListener("DOMContentLoaded", function () {
  // --- Elementer (defensive) ---
  const banner = document.getElementById("cookie-banner");
  const acceptBtn = document.getElementById("cookie-accept");
  const declineBtn = document.getElementById("cookie-decline");
  const policyLink = document.getElementById("cookie-policy-link");
  const policyPopup = document.getElementById("cookie-policy-popup");
  const policyClose = document.getElementById("cookie-policy-close");
  const changeBtn = document.getElementById("change-cookie-consent");

  const STORAGE_KEY = "cookie-consent";
  const GA_ID = "G-ELGNQRMN1X";
  const ADSENSE_CLIENT = "ca-pub-4322732012925287";

  // Show/hide banner helpers
  function showBanner() { if (banner) banner.style.display = "flex"; }
  function hideBanner() { if (banner) banner.style.display = "none"; }

  // Read previous choice
  const consent = localStorage.getItem(STORAGE_KEY);
  if (!consent) {
    showBanner();
  } else {
    hideBanner();
    if (consent === "accepted") {
      enableTracking();
    }
  }

  // Accept
  if (acceptBtn) {
    acceptBtn.addEventListener("click", function () {
      try {
        localStorage.setItem(STORAGE_KEY, "accepted");
        hideBanner();
        enableTracking();
      } catch (err) {
        console.error("cookie: kunne ikke gemme accept", err);
      }
    });
  }

  // Decline
  if (declineBtn) {
    declineBtn.addEventListener("click", function () {
      try {
        localStorage.setItem(STORAGE_KEY, "declined");
        hideBanner();
        // Do not load tracking
      } catch (err) {
        console.error("cookie: kunne ikke gemme afvis", err);
      }
    });
  }

  // Policy popup toggle
  if (policyLink && policyPopup) {
    policyLink.addEventListener("click", function (e) {
      e.preventDefault();
      policyPopup.style.display = "block";
    });
  }
  if (policyClose && policyPopup) {
    policyClose.addEventListener("click", function () {
      policyPopup.style.display = "none";
    });
  }
  window.addEventListener("click", function (e) {
    if (policyPopup && e.target === policyPopup) policyPopup.style.display = "none";
  });

  // Change consent button (footer)
  if (changeBtn) {
    changeBtn.addEventListener("click", function () {
      showBanner();
    });
  }

  // --- Dynamic loader helpers ---
  function loadScriptOnce(src, attrs = {}, cb) {
    if (document.querySelector('script[src="' + src + '"]')) {
      if (typeof cb === "function") setTimeout(cb, 50);
      return;
    }
    const s = document.createElement("script");
    s.src = src;
    if (attrs.async) s.async = true;
    if (attrs.crossorigin) s.setAttribute("crossorigin", attrs.crossorigin);
    s.onload = function () { if (typeof cb === "function") cb(); };
    s.onerror = function () { console.error("Kunne ikke loade:", src); if (typeof cb === "function") cb(); };
    document.head.appendChild(s);
  }

  let _trackingActivated = false;

  function enableTracking() {
    if (_trackingActivated) return;
    _trackingActivated = true;

    // 1) Load gtag.js and init
    const gaSrc = "https://www.googletagmanager.com/gtag/js?id=" + GA_ID;
    loadScriptOnce(gaSrc, { async: true }, function () {
      try {
        window.dataLayer = window.dataLayer || [];
        function gtag(){ window.dataLayer.push(arguments); }
        window.gtag = window.gtag || gtag;
        gtag('js', new Date());
        // Update consent + config
        gtag('consent', 'update', { analytics_storage: 'granted', ad_storage: 'granted' });
        gtag('config', GA_ID, { anonymize_ip: true });
      } catch (err) {
        console.warn("gtag-init warning:", err);
      }
    });

    // 2) Load AdSense script
    const adsSrc = "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=" + ADSENSE_CLIENT;
    loadScriptOnce(adsSrc, { async: true, crossorigin: "anonymous" }, function () {
      try {
        window.adsbygoogle = window.adsbygoogle || [];
        // Trigger a push so ins.adsbygoogle elements get rendered
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (err) {
        console.warn("adsbygoogle push fejlede:", err);
      }
    });
  } // end enableTracking()

}); // end DOMContentLoaded

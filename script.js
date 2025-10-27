document.addEventListener("DOMContentLoaded", function () {
  // 🔒 Singleton-guard: kør kun én gang, uanset hvor mange gange filen er inkluderet
  if (window.__cookieInit) return;
  window.__cookieInit = true;

  // === Elementer ===
  const banner = document.getElementById("cookie-banner");
  const acceptBtn = document.getElementById("cookie-accept");
  const rejectBtn = document.getElementById("cookie-decline");
  const policyLink = document.getElementById("cookie-policy-link");
  const policyPopup = document.getElementById("cookie-policy-popup");
  const policyClose = document.getElementById("cookie-policy-close");
  const changeBtn = document.getElementById("change-cookie-consent");

  if (changeBtn) changeBtn.style.display = "none";

  // Google Consent Mode initial setup
  window.dataLayer = window.dataLayer || [];
  function gtag(){ dataLayer.push(arguments); }
  gtag('consent', 'default', { ad_storage: 'denied', analytics_storage: 'denied' });
  gtag('js', new Date());

  // === Tidligere valg ===
  const consent = localStorage.getItem("cookie-consent");
  if (!consent) {
    if (banner) banner.style.display = "flex";
  } else {
    if (banner) banner.style.display = "none";
    if (changeBtn) changeBtn.style.display = "inline-flex";
    if (consent === "accepted") enableTracking();
    else disableTracking();
  }

  // === Accepter ===
  acceptBtn?.addEventListener("click", function () {
    localStorage.setItem("cookie-consent", "accepted");
    if (banner) banner.style.display = "none";
    if (changeBtn) changeBtn.style.display = "inline-flex";
    enableTracking();
  }, { once: true }); // <- undgå dobbelt-kald

  // === Afvis ===
  rejectBtn?.addEventListener("click", function () {
    localStorage.setItem("cookie-consent", "declined");
    if (banner) banner.style.display = "none";
    if (changeBtn) changeBtn.style.display = "inline-flex";
    disableTracking();
  }, { once: true });

  // === Åbn/Luk cookie popup ===
  policyLink?.addEventListener("click", function (e) {
    e.preventDefault();
    if (policyPopup) policyPopup.style.display = "block";
  });
  policyClose?.addEventListener("click", function () {
    if (policyPopup) policyPopup.style.display = "none";
  });
  window.addEventListener("click", function (e) {
    if (e.target === policyPopup) policyPopup.style.display = "none";
  });

  // === Ændr samtykke-knap ===
  changeBtn?.addEventListener("click", function () {
    if (banner) banner.style.display = "flex";
  });

  // 🚦 sørg for idempotens
  let trackingEnabled = false;

  function enableTracking() {
    if (trackingEnabled) return; // <- vigtig idempotens
    trackingEnabled = true;

    gtag('consent', 'update', { ad_storage: 'granted', analytics_storage: 'granted' });

    // === Load GA4 script dynamisk ===
    if (!document.getElementById("ga4-script")) {
      const gaScript = document.createElement("script");
      gaScript.id = "ga4-script";
      gaScript.src = "https://www.googletagmanager.com/gtag/js?id=G-X3CW94LC7E";
      gaScript.async = true;
      gaScript.onload = function () {
        gtag('config', 'G-X3CW94LC7E', { anonymize_ip: true });
      };
      document.head.appendChild(gaScript);
    }

    // === Load AdSense script dynamisk ===
    if (!document.getElementById("adsense-script")) {
      const adsScript = document.createElement("script");
      adsScript.id = "adsense-script";
      adsScript.src = "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4322732012925287";
      adsScript.async = true;
      adsScript.crossOrigin = "anonymous";
      adsScript.onload = function () { renderAds(); };
      adsScript.onerror = function () { console.error("Kunne ikke loade AdSense scriptet."); };
      document.head.appendChild(adsScript);
    } else {
      renderAds();
    }
  }

  function disableTracking() {
    gtag('consent', 'update', { ad_storage: 'denied', analytics_storage: 'denied' });
  }

  // === Rendér kun slots der IKKE allerede er "done"
  function renderAds() {
    try {
      window.adsbygoogle = window.adsbygoogle || [];
      const slots = document.querySelectorAll('ins.adsbygoogle');
      let pushed = 0;
      slots.forEach((slot) => {
        const status = slot.getAttribute('data-adsbygoogle-status');
        if (status !== 'done') {
          try { window.adsbygoogle.push({}); pushed++; }
          catch (e) { console.warn("adsbygoogle.push error:", e); }
        }
      });
      // console.log("AdSense render forsøgt på", pushed, "nye slots (ud af", slots.length, ")");
    } catch (err) {
      console.error("AdSense render error:", err);
    }
  }
});

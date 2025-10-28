document.addEventListener("DOMContentLoaded", function () {
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

  // Nye knapper inde i cookiepolitikken
  const policyAccept = document.getElementById("policy-accept");
  const policyDecline = document.getElementById("policy-decline");

  if (changeBtn) changeBtn.style.display = "none";

  // === Google Consent Mode setup ===
  window.dataLayer = window.dataLayer || [];
  function gtag() { dataLayer.push(arguments); }
  gtag('consent', 'default', { ad_storage: 'denied', analytics_storage: 'denied' });
  gtag('js', new Date());

  // === Tjek tidligere valg ===
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
  }, { once: true });

  // === Afvis ===
  rejectBtn?.addEventListener("click", function () {
    localStorage.setItem("cookie-consent", "declined");
    if (banner) banner.style.display = "none";
    if (changeBtn) changeBtn.style.display = "inline-flex";
    disableTracking();
    setTimeout(() => location.reload(), 500); // 🔁 opdater side efter afvisning
  }, { once: true });

  // === Cookiepolitik-knapper ===
  policyAccept?.addEventListener("click", function () {
    localStorage.setItem("cookie-consent", "accepted");
    if (policyPopup) policyPopup.style.display = "none";
    if (banner) banner.style.display = "none";
    if (changeBtn) changeBtn.style.display = "inline-flex";
    enableTracking();
  });

  policyDecline?.addEventListener("click", function () {
    localStorage.setItem("cookie-consent", "declined");
    if (policyPopup) policyPopup.style.display = "none";
    if (banner) banner.style.display = "none";
    if (changeBtn) changeBtn.style.display = "inline-flex";
    disableTracking();
    setTimeout(() => location.reload(), 500);
  });

  // === Åbn/Luk cookiepolitik-popup ===
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
    if (changeBtn) changeBtn.style.display = "none";
  });

  // === Trackingfunktioner ===
  let trackingEnabled = false;

  function enableTracking() {
    if (trackingEnabled) return;
    trackingEnabled = true;

    gtag('consent', 'update', { ad_storage: 'granted', analytics_storage: 'granted' });

    // === GA4 ===
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

    // === AdSense ===
    if (!document.getElementById("adsense-script")) {
      const adsScript = document.createElement("script");
      adsScript.id = "adsense-script";
      adsScript.src = "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4322732012925287";
      adsScript.async = true;
      adsScript.crossOrigin = "anonymous";
      adsScript.onload = renderAds;
      adsScript.onerror = () => console.error("Kunne ikke loade AdSense scriptet.");
      document.head.appendChild(adsScript);
    } else {
      renderAds();
    }
  }

  function disableTracking() {
    gtag('consent', 'update', { ad_storage: 'denied', analytics_storage: 'denied' });
  }

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
      console.log("✅ AdSense re-rendered:", pushed, "nye slots");
    } catch (err) {
      console.error("AdSense render error:", err);
    }
  }
});

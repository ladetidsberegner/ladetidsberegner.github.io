document.addEventListener("DOMContentLoaded", function() {
  // === Elementer ===
  const banner = document.getElementById("cookie-banner");
  const acceptBtn = document.getElementById("cookie-accept");
  const rejectBtn = document.getElementById("cookie-decline");
  const policyLink = document.getElementById("cookie-policy-link");
  const policyPopup = document.getElementById("cookie-policy-popup");
  const policyClose = document.getElementById("cookie-policy-close");
  const changeBtn = document.getElementById("change-cookie-consent");

  // === Start med Ændr samtykke skjult ===
  if (changeBtn) changeBtn.style.display = "none";

  // === Google Consent Mode setup ===
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}

  gtag('consent', 'default', {
    'ad_storage': 'denied',
    'analytics_storage': 'denied'
  });
  gtag('js', new Date());

  // === Helper: safe localStorage ===
  function getConsent() {
    try { return localStorage.getItem("cookie-consent"); } 
    catch(e) { return null; }
  }
  function setConsent(value) {
    try { localStorage.setItem("cookie-consent", value); } 
    catch(e) {}
  }

  // === Tidligere valg ===
  const consent = getConsent();
  if (!consent) {
    if (banner) banner.style.display = "flex";
  } else {
    if (banner) banner.style.display = "none";
    if (changeBtn) changeBtn.style.display = "inline-flex";
    if (consent === "accepted") enableTracking();
    else disableTracking();
  }

  // === Accepter ===
  if (acceptBtn) acceptBtn.addEventListener("click", function() {
    setConsent("accepted");
    if (banner) banner.style.display = "none";
    if (changeBtn) changeBtn.style.display = "inline-flex";
    enableTracking();
  });

  // === Afvis ===
  if (rejectBtn) rejectBtn.addEventListener("click", function() {
    setConsent("declined");
    if (banner) banner.style.display = "none";
    if (changeBtn) changeBtn.style.display = "inline-flex";
    disableTracking();
  });

  // === Åbn/Luk cookie popup ===
  if (policyLink && policyPopup) {
    policyLink.addEventListener("click", function(e) {
      e.preventDefault();
      policyPopup.style.display = "block";
    });
  }
  if (policyClose && policyPopup) {
    policyClose.addEventListener("click", function() {
      policyPopup.style.display = "none";
    });
  }
  window.addEventListener("click", function(e) {
    if (policyPopup && e.target === policyPopup) policyPopup.style.display = "none";
  });

  // === Ændr samtykke-knap ===
  if (changeBtn && banner) {
    changeBtn.addEventListener("click", function() {
      banner.style.display = "flex";
    });
  }

  // === Consent funktioner ===
  function enableTracking() {
    if (window.gtag) {
      gtag('consent', 'update', {
        'ad_storage': 'granted',
        'analytics_storage': 'granted'
      });
    }

    // === Load GA4 script dynamisk ===
    if (!document.getElementById("ga4-script")) {
      const gaScript = document.createElement("script");
      gaScript.id = "ga4-script";
      gaScript.src = "https://www.googletagmanager.com/gtag/js?id=G-X3CW94LC7E";
      gaScript.async = true;
      document.head.appendChild(gaScript);

      gaScript.onload = function() {
        if (window.gtag) {
          gtag('config', 'G-X3CW94LC7E', { 'anonymize_ip': true });
        }
      }
    }

    // === Load AdSense script dynamisk ===
    if (!document.getElementById("adsense-script")) {
      const adsScript = document.createElement("script");
      adsScript.id = "adsense-script";
      adsScript.src = "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4322732012925287";
      adsScript.async = true;
      adsScript.crossOrigin = "anonymous";
      document.head.appendChild(adsScript);

      adsScript.onload = function() {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      }
    }
  }

  function disableTracking() {
    if (window.gtag) {
      gtag('consent', 'update', {
        'ad_storage': 'denied',
        'analytics_storage': 'denied'
      });
    }
  }
});

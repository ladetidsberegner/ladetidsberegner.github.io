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

  // === Google Consent Mode initialiseres kun ved accept ===
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}

  // === Tjek tidligere valg ===
  const consent = localStorage.getItem("cookie-consent");
  if (!consent) {
    if (banner) banner.style.display = "flex";
  } else {
    if (banner) banner.style.display = "none";
    if (changeBtn) changeBtn.style.display = "inline-flex"; // vis knappen
    if (consent === "accepted") enableTracking();
    else disableTracking();
  }

  // === Accepter ===
  if (acceptBtn) acceptBtn.addEventListener("click", function() {
    localStorage.setItem("cookie-consent", "accepted");
    if (banner) banner.style.display = "none";
    if (changeBtn) changeBtn.style.display = "inline-flex";
    enableTracking();
  });

  // === Afvis ===
  if (rejectBtn) rejectBtn.addEventListener("click", function() {
    localStorage.setItem("cookie-consent", "declined");
    if (banner) banner.style.display = "none";
    if (changeBtn) changeBtn.style.display = "inline-flex";
    disableTracking();
  });

  // === Åbn/Luk cookie popup ===
  if (policyLink) policyLink.addEventListener("click", function(e) {
    e.preventDefault();
    if (policyPopup) policyPopup.style.display = "block";
  });
  if (policyClose) policyClose.addEventListener("click", function() {
    if (policyPopup) policyPopup.style.display = "none";
  });
  window.addEventListener("click", function(e) {
    if (e.target === policyPopup) policyPopup.style.display = "none";
  });

  // === Ændr samtykke-knap ===
  if (changeBtn) changeBtn.addEventListener("click", function() {
    if (banner) banner.style.display = "flex";
  });

  // === Consent funktioner ===
  function enableTracking() {
    gtag('consent', 'update', {
      'ad_storage': 'granted',
      'analytics_storage': 'granted'
    });

    // === Load GA4 script dynamisk ===
    if (!document.getElementById("ga4-script")) {
      const gaScript = document.createElement("script");
      gaScript.id = "ga4-script";
      gaScript.src = "https://www.googletagmanager.com/gtag/js?id=G-X3CW94LC7E";
      gaScript.async = true;
      document.head.appendChild(gaScript);

      gaScript.onload = function() {
        gtag('js', new Date());
        gtag('config', 'G-X3CW94LC7E', { 'anonymize_ip': true });
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
        (adsbygoogle = window.adsbygoogle || []).push({});
      }
    }
  }

  function disableTracking() {
    gtag('consent', 'update', {
      'ad_storage': 'denied',
      'analytics_storage': 'denied'
    });
  }
});

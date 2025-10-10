document.addEventListener("DOMContentLoaded", function() {
  // === Elementer ===
  const banner = document.getElementById("cookie-banner");
  const acceptBtn = document.getElementById("cookie-accept");
  const rejectBtn = document.getElementById("cookie-decline");
  const policyLink = document.getElementById("cookie-policy-link");
  const policyPopup = document.getElementById("cookie-policy-popup");
  const policyClose = document.getElementById("cookie-policy-close");
  const changeBtn = document.getElementById("change-cookie-consent");

  // === Google Consent Mode setup ===
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}

  gtag('consent', 'default', {
    'ad_storage': 'denied',
    'analytics_storage': 'denied'
  });

  gtag('js', new Date());

  // === Tidligere valg ===
  const consent = localStorage.getItem("cookie-consent");
  if (!consent) {
    banner.style.display = "flex";
  } else {
    banner.style.display = "none";
    if (consent === "accepted") enableTracking();
    else disableTracking();
  }

  // === Accepter ===
  acceptBtn.addEventListener("click", function() {
    localStorage.setItem("cookie-consent", "accepted");
    banner.style.display = "none";
    enableTracking();
  });

  // === Afvis ===
  rejectBtn.addEventListener("click", function() {
    localStorage.setItem("cookie-consent", "declined");
    banner.style.display = "none";
    disableTracking();
  });

  // === Åbn/Luk cookie popup ===
  policyLink.addEventListener("click", function(e) {
    e.preventDefault();
    policyPopup.style.display = "block";
  });
  policyClose.addEventListener("click", function() {
    policyPopup.style.display = "none";
  });
  window.addEventListener("click", function(e) {
    if (e.target === policyPopup) policyPopup.style.display = "none";
  });

  // === Ændr samtykke-knap ===
  changeBtn.addEventListener("click", function() {
    banner.style.display = "flex";
  });

  // === Consent funktioner ===
  function enableTracking() {
    gtag('consent', 'update', {
      'ad_storage': 'granted',
      'analytics_storage': 'granted'
    });

    // === Load GA4 script dynamically ===
    if (!document.getElementById("ga4-script")) {
      const gaScript = document.createElement("script");
      gaScript.id = "ga4-script";
      gaScript.src = "https://www.googletagmanager.com/gtag/js?id=G-X3CW94LC7E";
      gaScript.async = true;
      document.head.appendChild(gaScript);

      gaScript.onload = function() {
        gtag('config', 'G-X3CW94LC7E', { 'anonymize_ip': true });
      }
    }

    // === Load AdSense script dynamically ===
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

// ==============================
// cookie.js – stabil AdSense + GA4 version (tilbage til oprindelig struktur)
// ==============================

document.addEventListener("DOMContentLoaded", function() {
  console.log("🧩 Cookie.js initialiseret");

  // === Elementer ===
  const banner = document.getElementById("cookie-banner");
  const acceptBtn = document.getElementById("cookie-accept");
  const rejectBtn = document.getElementById("cookie-decline");
  const changeBtn = document.getElementById("change-cookie-consent");
  const policyLink = document.getElementById("cookie-policy-link");
  const policyPopup = document.getElementById("cookie-policy-popup");
  const policyClose = document.getElementById("cookie-policy-close");

  // Skjul ændr-knap i starten
  if (changeBtn) changeBtn.style.display = "none";

  // === Google Consent Mode standard ===
  window.dataLayer = window.dataLayer || [];
  function gtag(){ dataLayer.push(arguments); }

  gtag("consent", "default", {
    ad_storage: "denied",
    analytics_storage: "denied"
  });
  gtag("js", new Date());

  // === Tidligere valg ===
  const consent = localStorage.getItem("cookie-consent");
  if (!consent) {
    banner.style.display = "flex";
  } else {
    banner.style.display = "none";
    if (changeBtn) changeBtn.style.display = "inline-flex";
    if (consent === "accepted") enableTracking();
  }

  // === Klik på accepter ===
  if (acceptBtn) {
    acceptBtn.addEventListener("click", () => {
      console.log("✅ Klik: accepter cookies");
      localStorage.setItem("cookie-consent", "accepted");
      banner.style.display = "none";
      if (changeBtn) changeBtn.style.display = "inline-flex";
      enableTracking();
    });
  }

  // === Klik på afvis ===
  if (rejectBtn) {
    rejectBtn.addEventListener("click", () => {
      console.log("❌ Klik: afvis cookies");
      localStorage.setItem("cookie-consent", "declined");
      banner.style.display = "none";
      if (changeBtn) changeBtn.style.display = "inline-flex";
      disableTracking();
    });
  }

  if (changeBtn) {
    changeBtn.addEventListener("click", () => {
      banner.style.display = "flex";
    });
  }

  if (policyLink && policyPopup && policyClose) {
    policyLink.addEventListener("click", e => {
      e.preventDefault();
      policyPopup.style.display = "block";
    });
    policyClose.addEventListener("click", () => policyPopup.style.display = "none");
    window.addEventListener("click", e => {
      if (e.target === policyPopup) policyPopup.style.display = "none";
    });
  }

  // === Aktiver tracking ===
  function enableTracking() {
    console.log("🚀 enableTracking()");
    gtag("consent", "update", {
      ad_storage: "granted",
      analytics_storage: "granted"
    });

    // GA4
    if (!document.getElementById("ga4-script")) {
      const s = document.createElement("script");
      s.id = "ga4-script";
      s.async = true;
      s.src = "https://www.googletagmanager.com/gtag/js?id=G-ELGNQRMN1X";
      s.onload = () => {
        gtag("config", "G-ELGNQRMN1X", { anonymize_ip: true });
      };
      document.head.appendChild(s);
    }

    // AdSense (ingen re-render, kun initial push)
    if (!document.getElementById("adsense-script")) {
      const adScript = document.createElement("script");
      adScript.id = "adsense-script";
      adScript.async = true;
      adScript.crossOrigin = "anonymous";
      adScript.src = "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4322732012925287";
      document.head.appendChild(adScript);
      adScript.onload = () => {
        console.log("📢 AdSense script loaded");
        try {
          (adsbygoogle = window.adsbygoogle || []).push({});
        } catch(e){ console.warn(e); }
      };
    } else {
      try {
        (adsbygoogle = window.adsbygoogle || []).push({});
      } catch(e){ console.warn(e); }
    }
  }

  // === Deaktiver tracking ===
  function disableTracking() {
    console.log("🛑 disableTracking()");
    gtag("consent", "update", {
      ad_storage: "denied",
      analytics_storage: "denied"
    });
  }
});

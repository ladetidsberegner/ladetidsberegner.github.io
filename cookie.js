// ==============================
// cookie.js – Stabil version (fungerende model + GA4 opdateret)
// ==============================

document.addEventListener("DOMContentLoaded", function() {
  console.log("🧩 Cookie.js initialiseret");

  // === Elementer ===
  const banner = document.getElementById("cookie-banner");
  const acceptBtn = document.getElementById("cookie-accept");
  const rejectBtn = document.getElementById("cookie-decline");
  const policyLink = document.getElementById("cookie-policy-link");
  const policyPopup = document.getElementById("cookie-policy-popup");
  const policyClose = document.getElementById("cookie-policy-close");
  const changeBtn = document.getElementById("change-cookie-consent");

  if (!banner) {
    console.warn("⚠️ Cookie-banner ikke fundet i DOM.");
    return;
  }

  if (changeBtn) changeBtn.style.display = "none";

  // === Google Consent Mode (default: denied) ===
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
    if (changeBtn) changeBtn.style.display = "inline-flex";
    if (consent === "accepted") enableTracking();
    else disableTracking();
  }

  // === Klik-håndtering ===
  if (acceptBtn) {
    acceptBtn.addEventListener("click", function() {
      console.log("✅ Klik: accepter cookies");
      localStorage.setItem("cookie-consent", "accepted");
      banner.style.display = "none";
      if (changeBtn) changeBtn.style.display = "inline-flex";
      enableTracking();
    });
  }

  if (rejectBtn) {
    rejectBtn.addEventListener("click", function() {
      console.log("❌ Klik: afvis cookies");
      localStorage.setItem("cookie-consent", "declined");
      banner.style.display = "none";
      if (changeBtn) changeBtn.style.display = "inline-flex";
      disableTracking();
    });
  }

  if (changeBtn) {
    changeBtn.addEventListener("click", function() {
      banner.style.display = "flex";
    });
  }

  // === Cookiepolitik popup ===
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

  // === Aktiver tracking og annoncer ===
  function enableTracking() {
    console.log("🚀 enableTracking()");
    gtag('consent', 'update', {
      'ad_storage': 'granted',
      'analytics_storage': 'granted'
    });

    // === Load GA4 script dynamisk ===
    if (!document.getElementById("ga4-script")) {
      const gaScript = document.createElement("script");
      gaScript.id = "ga4-script";
      gaScript.async = true;
      gaScript.src = "https://www.googletagmanager.com/gtag/js?id=G-ELGNQRMN1X";
      document.head.appendChild(gaScript);

      gaScript.onload = function() {
        console.log("📡 GA4 script indlæst, sender config...");
        gtag('config', 'G-ELGNQRMN1X', { 'anonymize_ip': true });
        console.log("📈 GA4 tracking aktiveret og page_view sendt");
      };
    }

    // === Load AdSense script dynamisk ===
    if (!document.getElementById("adsense-script")) {
      const adsScript = document.createElement("script");
      adsScript.id = "adsense-script";
      adsScript.async = true;
      adsScript.crossOrigin = "anonymous";
      adsScript.src = "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4322732012925287";
      document.head.appendChild(adsScript);

      adsScript.onload = function() {
        console.log("📢 AdSense script indlæst – klar til render");
        renderAds();
      };

      adsScript.onerror = function() {
        console.error("⚠️ Kunne ikke loade AdSense scriptet.");
      };
    } else {
      renderAds();
    }
  }

  function disableTracking() {
    console.log("🛑 disableTracking()");
    gtag('consent', 'update', {
      'ad_storage': 'denied',
      'analytics_storage': 'denied'
    });
  }

  // === Render alle AdSense-slots ===
  function renderAds() {
    try {
      window.adsbygoogle = window.adsbygoogle || [];
      const slots = document.querySelectorAll('ins.adsbygoogle');
      console.log(`🧩 Fundet ${slots.length} AdSense-slots – forsøger at rendere...`);
      slots.forEach(() => {
        try {
          window.adsbygoogle.push({});
        } catch (e) {
          console.warn("adsbygoogle.push fejl:", e);
        }
      });
      console.log("✅ AdSense re-rendered:", slots.length);
    } catch (err) {
      console.error("⚠️ AdSense render fejl:", err);
    }
  }
});

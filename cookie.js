// === cookie.js – komplet version (27. oktober 2025) ===
document.addEventListener("DOMContentLoaded", function () {
  // 🔒 Undgå at initialisere flere gange
  if (window.__cookieInit) return;
  window.__cookieInit = true;

  console.log("🧩 Cookie.js initialiseret");

  // === Elementer ===
  const banner = document.getElementById("cookie-banner");
  const acceptBtn = document.getElementById("cookie-accept");
  const rejectBtn = document.getElementById("cookie-decline");
  const policyLink = document.getElementById("cookie-policy-link");
  const policyPopup = document.getElementById("cookie-policy-popup");
  const policyClose = document.getElementById("cookie-policy-close");
  const changeBtn = document.getElementById("change-cookie-consent");

  if (changeBtn) changeBtn.style.display = "none";

  // === Google Consent Mode standard ===
  window.dataLayer = window.dataLayer || [];
  function gtag(){ dataLayer.push(arguments); }
  gtag('consent', 'default', { ad_storage: 'denied', analytics_storage: 'denied' });
  gtag('js', new Date());

  // === Tidligere valg ===
  const consent = localStorage.getItem("cookie-consent");
  let firstLoad = !consent;

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
    console.log("✅ Klik: accepter cookies");
    localStorage.setItem("cookie-consent", "accepted");
    if (banner) banner.style.display = "none";
    if (changeBtn) changeBtn.style.display = "inline-flex";
    enableTracking();
  }, { once: true });

  // === Afvis ===
  rejectBtn?.addEventListener("click", function () {
    console.log("🚫 Klik: afvis cookies");
    const previouslyAccepted = localStorage.getItem("cookie-consent") === "accepted";
    localStorage.setItem("cookie-consent", "declined");
    if (banner) banner.style.display = "none";
    if (changeBtn) changeBtn.style.display = "inline-flex";
    disableTracking(previouslyAccepted);
  }, { once: true });

  // === Åbn/luk cookie politik ===
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

  // === Ændr samtykke ===
  changeBtn?.addEventListener("click", function () {
    if (banner) banner.style.display = "flex";
  });

  // === GA & Ads funktioner ===
  let trackingEnabled = false;

  function enableTracking() {
    if (trackingEnabled) return;
    trackingEnabled = true;

    console.log("🚀 enableTracking()");
    gtag('consent', 'update', { ad_storage: 'granted', analytics_storage: 'granted' });

    // --- GA4 ---
    if (!document.getElementById("ga4-script")) {
      console.log("📡 Indlæser GA4 script...");
      const gaScript = document.createElement("script");
      gaScript.id = "ga4-script";
      gaScript.src = "https://www.googletagmanager.com/gtag/js?id=G-X3CW94LC7E";
      gaScript.async = true;
      gaScript.onload = function () {
        console.log("📈 GA4 script indlæst, sender config...");
        gtag('config', 'G-X3CW94LC7E', { anonymize_ip: true });
      };
      document.head.appendChild(gaScript);
    }

    // --- AdSense ---
    if (!document.getElementById("adsense-script")) {
      console.log("📢 Indlæser AdSense script...");
      const adsScript = document.createElement("script");
      adsScript.id = "adsense-script";
      adsScript.src = "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4322732012925287";
      adsScript.async = true;
      adsScript.crossOrigin = "anonymous";
      adsScript.onload = function () {
        console.log("📢 AdSense script indlæst – klar til render");
        renderAds();
      };
      adsScript.onerror = function () {
        console.error("Kunne ikke loade AdSense scriptet.");
      };
      document.head.appendChild(adsScript);
    } else {
      renderAds();
    }
  }

  function disableTracking(previouslyAccepted = false) {
    gtag('consent', 'update', { ad_storage: 'denied', analytics_storage: 'denied' });
    console.log("🚫 disableTracking()");

    // Hvis man tidligere har accepteret, reload for at fjerne annoncer
    if (previouslyAccepted) {
      console.log("🔁 Genindlæser side for at skjule annoncer...");
      setTimeout(() => location.reload(), 500);
    }
  }

  // === Render Ads ===
  function renderAds() {
    try {
      window.adsbygoogle = window.adsbygoogle || [];
      const slots = document.querySelectorAll('ins.adsbygoogle');
      console.log(`🧩 Fundet – ${slots.length} – "AdSense-slots – forsøger at rendere..."`);
      let rendered = 0;
      slots.forEach((slot) => {
        const status = slot.getAttribute("data-adsbygoogle-status");
        if (status !== "done") {
          try {
            window.adsbygoogle.push({});
            rendered++;
            console.log(`✅ Slot renderet (${rendered})`);
          } catch (e) {
            console.warn("⚠️ adsbygoogle.push fejl –", e);
          }
        }
      });
      console.log(`✅ AdSense re-rendered: – ${rendered}`);
    } catch (err) {
      console.error("AdSense render error:", err);
    }
  }
});

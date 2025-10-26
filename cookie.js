// ==============================
// cookie.js – Stabil version (Consent Mode v2 + GA4 fix + debug logging)
// ==============================
(function () {
  console.log("🧩 Cookie.js initialiseret");

  const $ = id => document.getElementById(id);
  const banner = $("cookie-banner");
  const acceptBtn = $("cookie-accept");
  const rejectBtn = $("cookie-decline");
  const changeBtn = $("change-cookie-consent");
  const policyLink = $("cookie-policy-link");
  const policyPopup = $("cookie-policy-popup");
  const policyClose = $("cookie-policy-close");

  if (!banner) {
    console.warn("⚠️ Intet cookie-banner fundet i DOM.");
    return;
  }

  if (changeBtn) changeBtn.style.display = "none";

  // --- Consent Mode init ---
  window.dataLayer = window.dataLayer || [];
  function gtag(){ dataLayer.push(arguments); }

  gtag("consent", "default", {
    ad_storage: "denied",
    analytics_storage: "denied",
    wait_for_update: 500
  });
  gtag("js", new Date());

  // --- Læs tidligere samtykke ---
  const consent = localStorage.getItem("cookie-consent");
  if (!consent) {
    banner.style.display = "flex";
  } else {
    banner.style.display = "none";
    if (changeBtn) changeBtn.style.display = "inline-flex";
    if (consent === "accepted") enableTracking();
  }

  // --- Knapper ---
  if (acceptBtn) acceptBtn.addEventListener("click", () => {
    console.log("✅ Klik: accepter cookies");
    localStorage.setItem("cookie-consent", "accepted");
    banner.style.display = "none";
    if (changeBtn) changeBtn.style.display = "inline-flex";
    enableTracking();
  });

  if (rejectBtn) rejectBtn.addEventListener("click", () => {
    console.log("❌ Klik: afvis cookies");
    localStorage.setItem("cookie-consent", "declined");
    banner.style.display = "none";
    if (changeBtn) changeBtn.style.display = "inline-flex";
    disableTracking();
  });

  if (changeBtn) changeBtn.addEventListener("click", () => {
    banner.style.display = "flex";
  });

  // --- Cookiepolitik popup ---
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

  // --- Aktiver tracking ---
  function enableTracking() {
    console.log("🚀 enableTracking()");
    gtag("consent", "update", {
      ad_storage: "granted",
      analytics_storage: "granted"
    });

    // === GA4 INITIALISERING ===
    if (!document.getElementById("ga4-script")) {
      const s = document.createElement("script");
      s.id = "ga4-script";
      s.async = true;
      s.src = "https://www.googletagmanager.com/gtag/js?id=G-ELGNQRMN1X";
      s.onload = () => {
        console.log("📡 GA4 script indlæst, sender config...");
        window.dataLayer = window.dataLayer || [];
        function gtag(){ dataLayer.push(arguments); }
        gtag("js", new Date());
        gtag("config", "G-ELGNQRMN1X", { anonymize_ip: true, debug_mode: true });
        gtag("event", "page_view");
        console.log("📈 GA4 tracking aktiveret og page_view sendt");
        setupTrackingEvents();
      };
      document.head.appendChild(s);
    } else {
      console.log("📡 GA4-script allerede til stede, sender config igen...");
      gtag("config", "G-ELGNQRMN1X", { anonymize_ip: true, debug_mode: true });
      gtag("event", "page_view");
      console.log("📈 GA4 reaktiveret og page_view sendt");
      setupTrackingEvents();
    }

    // === AdSense ===
    renderAds();
  }

  function disableTracking() {
    console.log("🛑 disableTracking()");
    gtag("consent", "update", {
      ad_storage: "denied",
      analytics_storage: "denied"
    });
  }

  // --- Tracking events ---
  function setupTrackingEvents() {
    console.log("📊 setupTrackingEvents()");
    const btns = [
      { id: "beregn-soc-btn", label: "Beregn ladetid" },
      { id: "beregn-tid-btn", label: "Beregn start/sluttidspunkt" },
      { id: "beregn-soc-tid-btn", label: "Beregn SoC-stigning" }
    ];
    btns.forEach(b => {
      const el = $(b.id);
      if (el)
        el.addEventListener("click", () => {
          gtag("event", "klik_beregn_knap", {
            event_category: "Beregner",
            event_label: b.label
          });
          console.log("📈 GA4 event sendt:", b.label);
        });
    });
  }

  // --- AdSense render ---
  function renderAds() {
    try {
      window.adsbygoogle = window.adsbygoogle || [];
      const slots = document.querySelectorAll("ins.adsbygoogle");
      if (slots.length === 0) {
        console.log("ℹ️ Ingen adsbygoogle-slots fundet.");
        return;
      }
      setTimeout(() => {
        slots.forEach(slot => {
          slot.removeAttribute("data-adsbygoogle-status");
          delete slot.dataset.adsbygoogleStatus;
          window.adsbygoogle.push({});
        });
        console.log("✅ AdSense re-rendered efter accept:", slots.length);
      }, 1000);
    } catch (err) {
      console.warn("⚠️ AdSense fejl:", err);
    }
  }
})();

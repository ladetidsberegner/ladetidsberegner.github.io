// ==============================
// cookie-debug.js — med detaljeret logning af GA4 og AdSense
// ==============================

document.addEventListener("DOMContentLoaded", function() {
  console.log("🧩 [cookie.js] initialiseret");

  const banner = document.getElementById("cookie-banner");
  const acceptBtn = document.getElementById("cookie-accept");
  const rejectBtn = document.getElementById("cookie-decline");
  const changeBtn = document.getElementById("change-cookie-consent");
  const policyLink = document.getElementById("cookie-policy-link");
  const policyPopup = document.getElementById("cookie-policy-popup");
  const policyClose = document.getElementById("cookie-policy-close");

  if (changeBtn) changeBtn.style.display = "none";

  // --- Google Consent Mode default ---
  window.dataLayer = window.dataLayer || [];
  function gtag(){ dataLayer.push(arguments); }

  gtag("consent", "default", {
    ad_storage: "denied",
    analytics_storage: "denied"
  });
  gtag("js", new Date());

  const consent = localStorage.getItem("cookie-consent");
  if (!consent) {
    banner.style.display = "flex";
  } else {
    banner.style.display = "none";
    if (changeBtn) changeBtn.style.display = "inline-flex";
    if (consent === "accepted") enableTracking();
  }

  acceptBtn?.addEventListener("click", () => {
    console.log("✅ Klik: accepter cookies");
    localStorage.setItem("cookie-consent", "accepted");
    banner.style.display = "none";
    if (changeBtn) changeBtn.style.display = "inline-flex";
    enableTracking();
  });

  rejectBtn?.addEventListener("click", () => {
    console.log("❌ Klik: afvis cookies");
    localStorage.setItem("cookie-consent", "declined");
    banner.style.display = "none";
    if (changeBtn) changeBtn.style.display = "inline-flex";
    disableTracking();
  });

  changeBtn?.addEventListener("click", () => {
    banner.style.display = "flex";
  });

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
      document.head.appendChild(s);
      s.onload = () => {
        console.log("📡 GA4 script indlæst, sender config...");
        gtag("config", "G-ELGNQRMN1X", { anonymize_ip: true });
        console.log("📈 GA4 tracking aktiveret og page_view sendt");
      };
    }

    // AdSense
    if (!document.getElementById("adsense-script")) {
      const adScript = document.createElement("script");
      adScript.id = "adsense-script";
      adScript.async = true;
      adScript.crossOrigin = "anonymous";
      adScript.src = "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4322732012925287";
      console.log("📢 Indlæser AdSense script...");
      document.head.appendChild(adScript);

      adScript.onload = () => {
        console.log("📢 AdSense script indlæst – klar til render");
        renderAds();
      };

      adScript.onerror = () => {
        console.error("❌ Kunne ikke loade AdSense scriptet!");
      };
    } else {
      console.log("♻️ AdSense script allerede indlæst – forsøger re-render");
      renderAds();
    }
  }

  function disableTracking() {
    console.log("🛑 disableTracking()");
    gtag("consent", "update", {
      ad_storage: "denied",
      analytics_storage: "denied"
    });
  }

  function renderAds() {
    try {
      const slots = document.querySelectorAll("ins.adsbygoogle");
      console.log(`🧩 Fundet ${slots.length} AdSense-slots – forsøger at rendere...`);
      window.adsbygoogle = window.adsbygoogle || [];

      slots.forEach((slot, i) => {
        try {
          window.adsbygoogle.push({});
          console.log(`✅ Slot ${i + 1}: adsbygoogle.push() OK`);
        } catch (err) {
          console.warn(`⚠️ Slot ${i + 1}: push-fejl –`, err);
        }
      });

      console.log(`✅ AdSense re-rendered: – ${slots.length}`);
    } catch (err) {
      console.error("❌ AdSense render fejl:", err);
    }
  }
});

document.addEventListener("DOMContentLoaded", function () {
  // === 🔒 Singleton-guard: sikrer scriptet kun kører én gang ===
  if (window.__cookieInit) return;
  window.__cookieInit = true;

  // === 🧩 Elementer ===
  const banner = document.getElementById("cookie-banner");
  const acceptBtn = document.getElementById("cookie-accept");
  const rejectBtn = document.getElementById("cookie-decline");
  const policyLink = document.getElementById("cookie-policy-link");
  const policyPopup = document.getElementById("cookie-policy-popup");
  const policyClose = document.getElementById("cookie-policy-close");
  const changeBtn = document.getElementById("change-cookie-consent");
  const policyButtons = document.getElementById("cookie-policy-buttons");

  if (changeBtn) changeBtn.style.display = "none";

  // === 📦 Google Consent Mode initial setup ===
  window.dataLayer = window.dataLayer || [];
  function gtag() { dataLayer.push(arguments); }
  gtag('consent', 'default', { ad_storage: 'denied', analytics_storage: 'denied' });
  gtag('js', new Date());

  // === 🔍 Tjek tidligere samtykke ===
  const consent = localStorage.getItem("cookie-consent");
  if (!consent) {
    if (banner) banner.style.display = "flex";
  } else {
    if (banner) banner.style.display = "none";
    if (changeBtn) changeBtn.style.display = "inline-flex";
    if (consent === "accepted") enableTracking();
    else disableTracking();
  }

  // === ✅ Accepter cookies ===
  acceptBtn?.addEventListener("click", function () {
    localStorage.setItem("cookie-consent", "accepted");
    if (banner) banner.style.display = "none";
    if (changeBtn) changeBtn.style.display = "inline-flex";
    enableTracking();
  }, { once: true });

  // === ❌ Afvis cookies ===
  rejectBtn?.addEventListener("click", function () {
    localStorage.setItem("cookie-consent", "declined");
    if (banner) banner.style.display = "none";
    if (changeBtn) changeBtn.style.display = "inline-flex";
    disableTracking();
    location.reload(); // <- refresher siden for at fjerne reklamer
  }, { once: true });

  // === 📜 Cookiepolitik (popup) ===
  policyLink?.addEventListener("click", function (e) {
    e.preventDefault();
    if (policyPopup) policyPopup.style.display = "block";
    if (policyButtons) policyButtons.style.display = "flex"; // viser knapper i popup
  });

  policyClose?.addEventListener("click", function () {
    if (policyPopup) policyPopup.style.display = "none";
  });

  window.addEventListener("click", function (e) {
    if (e.target === policyPopup) policyPopup.style.display = "none";
  });

  // === ⚙️ Ændr cookieindstillinger ===
  changeBtn?.addEventListener("click", function () {
    if (banner) banner.style.display = "flex";
  });

  // === 🧠 Idempotent tracking flag ===
  let trackingEnabled = false;

  // === 🚀 Aktivér tracking ===
  function enableTracking() {
    if (trackingEnabled) return;
    trackingEnabled = true;

    gtag('consent', 'update', { ad_storage: 'granted', analytics_storage: 'granted' });

    // --- Google Analytics 4 ---
    if (!document.getElementById("ga4-script")) {
      const gaScript = document.createElement("script");
      gaScript.id = "ga4-script";
      gaScript.src = "https://www.googletagmanager.com/gtag/js?id=G-ELGNQRMN1X";
      gaScript.async = true;
      gaScript.onload = function () {
        gtag('config', 'G-ELGNQRMN1X', { anonymize_ip: true });
      };
      document.head.appendChild(gaScript);
    }

    // --- AdSense ---
    if (!document.getElementById("adsense-script")) {
      const adsScript = document.createElement("script");
      adsScript.id = "adsense-script";
      adsScript.src = "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4322732012925287";
      adsScript.async = true;
      adsScript.crossOrigin = "anonymous";
      adsScript.onload = function () { renderAds(); };
      adsScript.onerror = function () { console.error("Kunne ikke loade AdSense-scriptet."); };
      document.head.appendChild(adsScript);
    } else {
      renderAds();
    }
  }

  // === 🚫 Deaktivér tracking ===
  function disableTracking() {
    gtag('consent', 'update', { ad_storage: 'denied', analytics_storage: 'denied' });
    // skjul alle reklameslots
    document.querySelectorAll('.adsense-slot').forEach(slot => slot.style.display = "none");
  }

  // === 📢 Rendér kun nye AdSense-slots ===
  function renderAds() {
    try {
      window.adsbygoogle = window.adsbygoogle || [];
      const slots = document.querySelectorAll('ins.adsbygoogle');
      let pushed = 0;
      slots.forEach(slot => {
        const status = slot.getAttribute('data-adsbygoogle-status');
        if (status !== 'done') {
          try { window.adsbygoogle.push({}); pushed++; }
          catch (e) { console.warn("adsbygoogle.push fejl:", e); }
        }
      });
      console.log(`✅ AdSense re-rendered: ${pushed}/${slots.length}`);
    } catch (err) {
      console.error("AdSense render error:", err);
    }
  }

  // === 🧠 Ejer-filter: Ekskluder dine egne besøg fra GA4 ===
  const url = new URL(window.location.href);

  if (url.searchParams.get("me") === "true") {
    localStorage.setItem("paw-test", "true");
    alert("✅ Du er nu markeret som ejer – din trafik bliver sorteret fra i Analytics fremover.");
  }

  if (url.searchParams.get("me") === "off") {
    localStorage.removeItem("paw-test");
    alert("❌ Ejermærke fjernet. Dine besøg tælles nu igen i Analytics.");
  }

  if (typeof gtag === "function" && localStorage.getItem("paw-test") === "true") {
    gtag('set', { 'user_properties': { 'is_owner': 'true' } });
  }
});

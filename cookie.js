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

  if (changeBtn) changeBtn.style.display = "none";

  // === Google Consent Mode standard ===
  window.dataLayer = window.dataLayer || [];
  function gtag(){ dataLayer.push(arguments); }
  gtag("consent", "default", { ad_storage: "denied", analytics_storage: "denied" });
  gtag("js", new Date());

  let trackingEnabled = false;

  function enableTracking() {
    if (trackingEnabled) return;
    trackingEnabled = true;
    gtag("consent", "update", { ad_storage: "granted", analytics_storage: "granted" });

    if (!document.getElementById("ga4-script")) {
      const gaScript = document.createElement("script");
      gaScript.id = "ga4-script";
      gaScript.src = "https://www.googletagmanager.com/gtag/js?id=G-ELGNQRMN1X";
      gaScript.async = true;
      gaScript.onload = () => gtag("config", "G-ELGNQRMN1X", { anonymize_ip: true });
      document.head.appendChild(gaScript);
    }

    if (!document.getElementById("adsense-script")) {
      const adsScript = document.createElement("script");
      adsScript.id = "adsense-script";
      adsScript.src = "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4322732012925287";
      adsScript.async = true;
      adsScript.crossOrigin = "anonymous";
      adsScript.onload = renderAds;
      adsScript.onerror = () => console.error("Kunne ikke loade AdSense-scriptet.");
      document.head.appendChild(adsScript);
    } else {
      renderAds();
    }
  }

  function disableTracking(forceReload = false) {
    gtag("consent", "update", { ad_storage: "denied", analytics_storage: "denied" });
    if (forceReload) setTimeout(() => location.reload(), 500);
  }

  function renderAds() {
    try {
      window.adsbygoogle = window.adsbygoogle || [];
      document.querySelectorAll("ins.adsbygoogle").forEach((slot) => {
        if (slot.getAttribute("data-adsbygoogle-status") !== "done") {
          window.adsbygoogle.push({});
        }
      });
    } catch (err) { console.error("AdSense render error:", err); }
  }

  function addPolicyButtons() {
    const popup = document.querySelector(".cookie-policy-content");
    if (!popup || popup.querySelector(".policy-actions")) return;

    const btns = document.createElement("div");
    btns.className = "policy-actions";
    btns.style.marginTop = "20px";
    btns.innerHTML = `
      <button id="policy-accept" style="background:#55ca1c;color:#fff;border:none;padding:8px 14px;border-radius:6px;cursor:pointer;font-weight:600;margin-right:10px;">Accepter</button>
      <button id="policy-decline" style="background:#666;color:#fff;border:none;padding:8px 14px;border-radius:6px;cursor:pointer;font-weight:600;">Afvis</button>
    `;
    popup.appendChild(btns);

    document.getElementById("policy-accept").addEventListener("click", () => {
      localStorage.setItem("cookie-consent", "accepted");
      policyPopup.style.display = "none";
      enableTracking();
      hideBanner();
    });

    document.getElementById("policy-decline").addEventListener("click", () => {
      localStorage.setItem("cookie-consent", "declined");
      policyPopup.style.display = "none";
      disableTracking(true);
      hideBanner();
    });
  }

  function hideBanner() {
    if (banner) banner.style.display = "none";
    if (changeBtn) changeBtn.style.display = "inline-flex";
  }

  const consent = localStorage.getItem("cookie-consent");

  if (!consent) {
    if (banner) banner.style.display = "flex";
  } else {
    hideBanner();
    if (consent === "accepted") enableTracking();
    else disableTracking();
  }

  acceptBtn?.addEventListener("click", () => { localStorage.setItem("cookie-consent", "accepted"); hideBanner(); enableTracking(); });
  rejectBtn?.addEventListener("click", () => { localStorage.setItem("cookie-consent", "declined"); hideBanner(); disableTracking(true); });

  policyLink?.addEventListener("click", (e) => {
    e.preventDefault();
    if (policyPopup) { policyPopup.style.display = "block"; addPolicyButtons(); }
  });

  policyClose?.addEventListener("click", () => { if (policyPopup) policyPopup.style.display = "none"; });
  window.addEventListener("click", (e) => { if (e.target === policyPopup) policyPopup.style.display = "none"; });

  // Ændr cookieknap åbner popup direkte
  if (changeBtn) {
    changeBtn.style.display = "inline-flex";
    changeBtn.addEventListener("click", () => {
      if (policyPopup) { policyPopup.style.display = "block"; addPolicyButtons(); }
    });
  }
});

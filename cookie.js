// cookie-global.js
(function () {
  if (window.__cookieSystemInit) return;
  window.__cookieSystemInit = true;

  document.addEventListener("DOMContentLoaded", init);

  function init() {
    const banner = document.getElementById("cookie-banner");
    const acceptBtn = document.getElementById("cookie-accept");
    const rejectBtn = document.getElementById("cookie-decline");
    const policyLink = document.getElementById("cookie-policy-link");
    const policyPopup = document.getElementById("cookie-policy-popup");
    const policyClose = document.getElementById("cookie-policy-close");
    const changeBtn = document.getElementById("change-cookie-consent");

    if (!banner || !acceptBtn || !rejectBtn || !policyLink || !policyPopup || !policyClose) {
      return;
    }

    window.dataLayer = window.dataLayer || [];
    function gtag() { dataLayer.push(arguments); }

    gtag("consent", "default", {
      ad_storage: "denied",
      analytics_storage: "denied"
    });

    let trackingEnabled = false;

    function enableTracking() {
      if (trackingEnabled) return;
      trackingEnabled = true;

      gtag("consent", "update", {
        ad_storage: "granted",
        analytics_storage: "granted"
      });

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
        document.head.appendChild(adsScript);
      } else {
        renderAds();
      }
    }

    function disableTracking() {
      gtag("consent", "update", {
        ad_storage: "denied",
        analytics_storage: "denied"
      });
    }

    function renderAds() {
      try {
        window.adsbygoogle = window.adsbygoogle || [];
        document.querySelectorAll("ins.adsbygoogle").forEach(slot => {
          if (!slot.dataset.loaded) {
            window.adsbygoogle.push({});
            slot.dataset.loaded = "true";
          }
        });
      } catch (e) {
        console.error("AdSense error:", e);
      }
    }

    function hideBanner() {
      banner.style.display = "none";
      if (changeBtn) changeBtn.style.display = "inline-flex";
    }

    function showBanner() {
      banner.style.display = "flex";
      if (changeBtn) changeBtn.style.display = "none";
    }

    function addPolicyButtons() {
      const popupContent = document.querySelector(".cookie-policy-content");
      if (!popupContent || popupContent.querySelector(".policy-actions")) return;

      const btns = document.createElement("div");
      btns.className = "policy-actions";
      btns.style.marginTop = "20px";
      btns.style.display = "flex";
      btns.style.gap = "10px";

      btns.innerHTML = `
        <button id="policy-accept" style="background:#55ca1c;color:#fff;border:none;padding:8px 14px;border-radius:6px;cursor:pointer;font-weight:600;">
          Accepter
        </button>
        <button id="policy-decline" style="background:#666;color:#fff;border:none;padding:8px 14px;border-radius:6px;cursor:pointer;font-weight:600;">
          Afvis
        </button>
      `;

      popupContent.appendChild(btns);

      document.getElementById("policy-accept").addEventListener("click", () => {
        localStorage.setItem("cookie-consent", "accepted");
        policyPopup.style.display = "none";
        hideBanner();
        enableTracking();
      });

      document.getElementById("policy-decline").addEventListener("click", () => {
        localStorage.setItem("cookie-consent", "declined");
        policyPopup.style.display = "none";
        hideBanner();
        disableTracking();
      });
    }

    const consent = localStorage.getItem("cookie-consent");

    if (!consent) {
      showBanner();
    } else {
      hideBanner();
      consent === "accepted" ? enableTracking() : disableTracking();
    }

    acceptBtn.addEventListener("click", () => {
      localStorage.setItem("cookie-consent", "accepted");
      hideBanner();
      enableTracking();
    });

    rejectBtn.addEventListener("click", () => {
      localStorage.setItem("cookie-consent", "declined");
      hideBanner();
      disableTracking();
    });

    policyLink.addEventListener("click", (e) => {
      e.preventDefault();
      policyPopup.style.display = "block";
      addPolicyButtons();
    });

    policyClose.addEventListener("click", () => {
      policyPopup.style.display = "none";
    });

    window.addEventListener("click", (e) => {
      if (e.target === policyPopup) {
        policyPopup.style.display = "none";
      }
    });

    if (changeBtn) {
      changeBtn.style.display = "inline-flex";
      changeBtn.addEventListener("click", () => {
        policyPopup.style.display = "block";
        addPolicyButtons();
      });
    }
  }
})();

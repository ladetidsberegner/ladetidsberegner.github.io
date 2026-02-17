// cookie-global.js
(function () {
  if (window.__cookieSystemInit) return;
  window.__cookieSystemInit = true;

  function waitForElements() {
    const banner = document.getElementById("cookie-banner");
    const acceptBtn = document.getElementById("cookie-accept");
    const rejectBtn = document.getElementById("cookie-decline");
    const policyLink = document.getElementById("cookie-policy-link");
    const policyPopup = document.getElementById("cookie-policy-popup");
    const policyClose = document.getElementById("cookie-policy-close");
    const changeBtn = document.getElementById("change-cookie-consent");

    if (!banner || !acceptBtn || !rejectBtn || !policyLink || !policyPopup || !policyClose || !changeBtn) {
      setTimeout(waitForElements, 50);
      return;
    }

    initCookieSystem(
      banner,
      acceptBtn,
      rejectBtn,
      policyLink,
      policyPopup,
      policyClose,
      changeBtn
    );
  }

  waitForElements();

  function initCookieSystem(
    banner,
    acceptBtn,
    rejectBtn,
    policyLink,
    policyPopup,
    policyClose,
    changeBtn
  ) {

    /* =========================
       CONSENT DEFAULT
       ========================= */
    window.dataLayer = window.dataLayer || [];
    function gtag() { dataLayer.push(arguments); }

    gtag("consent", "default", {
      ad_storage: "denied",
      analytics_storage: "denied"
    });

    gtag("js", new Date());

    let trackingEnabled = false;

    /* =========================
       ENABLE TRACKING
       ========================= */
    function enableTracking() {
      if (trackingEnabled) return;
      trackingEnabled = true;

      gtag("consent", "update", {
        ad_storage: "granted",
        analytics_storage: "granted"
      });

      /* Load GA4 */
      if (!document.getElementById("ga4-script")) {
        const gaScript = document.createElement("script");
        gaScript.id = "ga4-script";
        gaScript.src = "https://www.googletagmanager.com/gtag/js?id=G-ELGNQRMN1X";
        gaScript.async = true;
        gaScript.onload = () =>
          gtag("config", "G-ELGNQRMN1X", { anonymize_ip: true });
        document.head.appendChild(gaScript);
      }

      /* Load AdSense */
      if (!document.getElementById("adsense-script")) {
        const adsScript = document.createElement("script");
        adsScript.id = "adsense-script";
        adsScript.src =
          "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4322732012925287";
        adsScript.async = true;
        adsScript.crossOrigin = "anonymous";
        adsScript.onload = renderAds;
        document.head.appendChild(adsScript);
      } else {
        renderAds();
      }
    }

    /* =========================
       RENDER ADS (FIXED)
       ========================= */
    function renderAds() {
      window.adsbygoogle = window.adsbygoogle || [];

      document.querySelectorAll("ins.adsbygoogle").forEach((slot) => {

        if (slot.getAttribute("data-adsbygoogle-status") === "done") return;

        function tryPush(attempts = 0) {
          if (slot.offsetWidth > 0) {
            try {
              window.adsbygoogle.push({});
            } catch (e) {
              console.error("Ad push error:", e);
            }
          } else if (attempts < 15) {
            setTimeout(() => tryPush(attempts + 1), 200);
          }
        }

        tryPush();
      });
    }

    /* =========================
       DISABLE TRACKING
       ========================= */
    function disableTracking(forceReload = false) {
      gtag("consent", "update", {
        ad_storage: "denied",
        analytics_storage: "denied"
      });

      if (forceReload) setTimeout(() => location.reload(), 400);
    }

    /* =========================
       UI HELPERS
       ========================= */
    function hideBanner() {
      banner.style.display = "none";
      changeBtn.style.display = "inline-flex";
    }

    function showBanner() {
      banner.style.display = "flex";
      changeBtn.style.display = "none";
    }

    function openPolicy() {
      policyPopup.style.display = "block";
    }

    function closePolicy() {
      policyPopup.style.display = "none";
    }

    /* =========================
       INITIAL STATE
       ========================= */
    const consent = localStorage.getItem("cookie-consent");

    if (!consent) {
      showBanner();
    } else {
      hideBanner();
      if (consent === "accepted") enableTracking();
      else disableTracking();
    }

    /* =========================
       BUTTON EVENTS
       ========================= */
    acceptBtn.addEventListener("click", () => {
      localStorage.setItem("cookie-consent", "accepted");
      hideBanner();
      enableTracking();
    });

    rejectBtn.addEventListener("click", () => {
      localStorage.setItem("cookie-consent", "declined");
      hideBanner();
      disableTracking(true);
    });

    policyLink.addEventListener("click", (e) => {
      e.preventDefault();
      openPolicy();
    });

    policyClose.addEventListener("click", closePolicy);

    window.addEventListener("click", (e) => {
      if (e.target === policyPopup) closePolicy();
    });

    changeBtn.addEventListener("click", () => {
      openPolicy();
    });

  }
})();

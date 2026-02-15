// global-cookie-ads.js
(function () {
  if (window.__cookieSystemInit) return;
  window.__cookieSystemInit = true;

  document.addEventListener("DOMContentLoaded", function () {

    const banner = document.getElementById("cookie-banner");
    const acceptBtn = document.getElementById("cookie-accept");
    const declineBtn = document.getElementById("cookie-decline");
    const policyLink = document.getElementById("cookie-policy-link");
    const policyPopup = document.getElementById("cookie-policy-popup");
    const policyClose = document.getElementById("cookie-policy-close");
    const changeBtn = document.getElementById("change-cookie-consent");

    const adSlots = document.querySelectorAll("ins.adsbygoogle");
    const allFields = document.querySelectorAll("#beregner input, #beregner select");

    if (!banner || !acceptBtn || !declineBtn) return;

    /* -------------------------------------------------- */
    /*  GOOGLE CONSENT MODE DEFAULT (DENIED)              */
    /* -------------------------------------------------- */

    window.dataLayer = window.dataLayer || [];
    function gtag(){ dataLayer.push(arguments); }

    gtag("consent", "default", {
      ad_storage: "denied",
      analytics_storage: "denied"
    });

    let trackingLoaded = false;

    /* -------------------------------------------------- */
    /*  ENABLE TRACKING                                   */
    /* -------------------------------------------------- */

    function enableTracking() {

      if (trackingLoaded) return;
      trackingLoaded = true;

      gtag("consent", "update", {
        ad_storage: "granted",
        analytics_storage: "granted"
      });

      // Load GA4
      if (!document.getElementById("ga4-script")) {
        const ga = document.createElement("script");
        ga.id = "ga4-script";
        ga.async = true;
        ga.src = "https://www.googletagmanager.com/gtag/js?id=G-ELGNQRMN1X";
        document.head.appendChild(ga);

        ga.onload = function () {
          gtag("js", new Date());
          gtag("config", "G-ELGNQRMN1X", { anonymize_ip: true });
        };
      }

      // Load AdSense
      if (!document.getElementById("adsense-script")) {
        const ads = document.createElement("script");
        ads.id = "adsense-script";
        ads.async = true;
        ads.crossOrigin = "anonymous";
        ads.src = "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4322732012925287";
        document.head.appendChild(ads);

        ads.onload = function () {
          renderAds();
        };
      } else {
        renderAds();
      }
    }

    /* -------------------------------------------------- */
    /*  DISABLE TRACKING                                  */
    /* -------------------------------------------------- */

    function disableTracking() {
      gtag("consent", "update", {
        ad_storage: "denied",
        analytics_storage: "denied"
      });
    }

    /* -------------------------------------------------- */
    /*  RENDER ADS                                        */
    /* -------------------------------------------------- */

    function renderAds() {
      try {
        window.adsbygoogle = window.adsbygoogle || [];
        adSlots.forEach(function (slot) {
          if (!slot.dataset.adRendered) {
            window.adsbygoogle.push({});
            slot.dataset.adRendered = "true";
          }
        });
      } catch (e) {
        console.error("AdSense error:", e);
      }
    }

    /* -------------------------------------------------- */
    /*  COOKIE STORAGE                                    */
    /* -------------------------------------------------- */

    function saveConsent(value) {
      localStorage.setItem("cookie-consent", value);
    }

    function getConsent() {
      return localStorage.getItem("cookie-consent");
    }

    function showBanner() {
      banner.style.display = "flex";
      if (changeBtn) changeBtn.style.display = "none";
    }

    function hideBanner() {
      banner.style.display = "none";
      if (changeBtn) changeBtn.style.display = "inline-flex";
    }

    /* -------------------------------------------------- */
    /*  FORM SAVE / RESTORE                               */
    /* -------------------------------------------------- */

    function saveField(el) {
      if (getConsent() !== "accepted") return;

      if (el.type === "checkbox" || el.type === "radio") {
        localStorage.setItem(el.id, el.checked);
      } else {
        localStorage.setItem(el.id, el.value);
      }
    }

    function restoreFields() {
      allFields.forEach(function (el) {
        const stored = localStorage.getItem(el.id);
        if (stored !== null) {
          if (el.type === "checkbox" || el.type === "radio") {
            el.checked = stored === "true";
          } else {
            el.value = stored;
          }
        }
      });
    }

    allFields.forEach(function (el) {
      el.addEventListener("input", function () { saveField(el); });
      el.addEventListener("change", function () { saveField(el); });
    });

    /* -------------------------------------------------- */
    /*  BUTTON EVENTS                                     */
    /* -------------------------------------------------- */

    acceptBtn.addEventListener("click", function () {
      saveConsent("accepted");
      hideBanner();
      enableTracking();
      restoreFields();
    });

    declineBtn.addEventListener("click", function () {
      saveConsent("declined");
      hideBanner();
      disableTracking();
    });

    if (policyLink && policyPopup) {
      policyLink.addEventListener("click", function (e) {
        e.preventDefault();
        policyPopup.style.display = "block";
      });
    }

    if (policyClose && policyPopup) {
      policyClose.addEventListener("click", function () {
        policyPopup.style.display = "none";
      });
    }

    if (changeBtn && policyPopup) {
      changeBtn.addEventListener("click", function () {
        policyPopup.style.display = "block";
      });
    }

    /* -------------------------------------------------- */
    /*  INITIAL LOAD                                      */
    /* -------------------------------------------------- */

    const consent = getConsent();

    if (!consent) {
      showBanner();
    } else {
      hideBanner();
      if (consent === "accepted") {
        enableTracking();
        restoreFields();
      } else {
        disableTracking();
      }
    }

  });
})();

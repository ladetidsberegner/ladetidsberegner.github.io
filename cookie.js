javascript
/**
 * cookie.js – stabil version uden syntaksfejl
 * Viser eget cookie-banner, husker valg og aktiverer GA/Ads efter accept.
 */

(function () {
  "use strict";

  const STORAGE_KEY = "cookie-consent"; // 'accepted' | 'declined'
  const GA_ID = "G-ELGNQRMN1X";

  function el(id) {
    return document.getElementById(id);
  }
  function show(elem) {
    if (elem) elem.style.display = "flex";
  }
  function hide(elem) {
    if (elem) elem.style.display = "none";
  }

  document.addEventListener("DOMContentLoaded", function () {
    const banner = el("cookie-banner");
    const acceptBtn = el("cookie-accept");
    const declineBtn = el("cookie-decline");
    const policyLink = el("cookie-policy-link");
    const policyPopup = el("cookie-policy-popup");
    const policyClose = el("cookie-policy-close");
    const changeBtn = el("change-cookie-consent");

    // Sørg for GA er deaktiveret indtil accept
    try {
      if (localStorage.getItem(STORAGE_KEY) !== "accepted") {
        window["ga-disable-" + GA_ID] = true;
      }
    } catch (err) {
      console.warn("cookie.js: localStorage utilgængelig", err);
      window["ga-disable-" + GA_ID] = true;
    }

    const stored = (function () {
      try {
        return localStorage.getItem(STORAGE_KEY);
      } catch (e) {
        return null;
      }
    })();

    if (!stored) {
      show(banner);
    } else if (stored === "accepted") {
      hide(banner);
      enableTracking();
    } else {
      hide(banner);
      window["ga-disable-" + GA_ID] = true;
    }

    if (acceptBtn) {
      acceptBtn.addEventListener("click", function () {
        try {
          localStorage.setItem(STORAGE_KEY, "accepted");
        } catch (e) {}
        hide(banner);
        enableTracking();
      });
    }

    if (declineBtn) {
      declineBtn.addEventListener("click", function () {
        try {
          localStorage.setItem(STORAGE_KEY, "declined");
        } catch (e) {}
        hide(banner);
        window["ga-disable-" + GA_ID] = true;
      });
    }

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

    window.addEventListener("click", function (e) {
      if (policyPopup && e.target === policyPopup) {
        policyPopup.style.display = "none";
      }
    });

    if (changeBtn) {
      changeBtn.addEventListener("click", function () {
        show(banner);
      });
    }
  });

  let trackingActivated = false;

  function enableTracking() {
    if (trackingActivated) return;
    trackingActivated = true;

    window["ga-disable-" + GA_ID] = false;

    function runGtagUpdate() {
      try {
        if (typeof gtag === "function") {
          gtag("consent", "update", {
            analytics_storage: "granted",
            ad_storage: "granted",
          });
          gtag("config", GA_ID, { anonymize_ip: true });
        } else {
          window.dataLayer = window.dataLayer || [];
          window.gtag = function () {
            window.dataLayer.push(arguments);
          };
          gtag("js", new Date());
          gtag("consent", "update", {
            analytics_storage: "granted",
            ad_storage: "granted",
          });
          gtag("config", GA_ID, { anonymize_ip: true });
        }
      } catch (err) {
        console.error("cookie.js: runGtagUpdate fejl:", err);
      }
    }

    if (typeof gtag === "function") {
      runGtagUpdate();
    } else {
      const src = "https://www.googletagmanager.com/gtag/js?id=" + GA_ID;
      const existing = document.querySelector(`script[src="${src}"]`);
      if (!existing) {
        const s = document.createElement("script");
        s.async = true;
        s.src = src;
        s.onload = function () {
          window.dataLayer = window.dataLayer || [];
          function gtagLocal() {
            window.dataLayer.push(arguments);
          }
          window.gtag = gtagLocal;
          gtag("js", new Date());
          runGtagUpdate();
        };
        s.onerror = function () {
          console.error("cookie.js: kunne ikke loade gtag.js");
          runGtagUpdate();
        };
        document.head.appendChild(s);
      } else {
        let tries = 0;
        const iv = setInterval(function () {
          if (typeof gtag === "function" || tries > 50) {
            clearInterval(iv);
            runGtagUpdate();
          }
          tries++;
        }, 100);
      }
    }

    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (err) {
      // Ikke kritisk
    }
  }
})();


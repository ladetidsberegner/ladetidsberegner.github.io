document.addEventListener("DOMContentLoaded", function () {
  const banner = document.getElementById("cookie-banner");
  const acceptBtn = document.getElementById("cookie-accept");
  const rejectBtn = document.getElementById("cookie-decline");
  const changeBtn = document.getElementById("change-cookie-consent");
  const policyLink = document.getElementById("cookie-policy-link");
  const policyPopup = document.getElementById("cookie-policy-popup");
  const policyClose = document.getElementById("cookie-policy-close");

  changeBtn.style.display = "none";

  window.dataLayer = window.dataLayer || [];
  function gtag() { dataLayer.push(arguments); }
  gtag('consent', 'default', {
    'ad_storage': 'denied',
    'analytics_storage': 'denied'
  });
  gtag('js', new Date());

  const consent = localStorage.getItem("cookie-consent");
  if (!consent) {
    banner.style.display = "flex";
  } else {
    banner.style.display = "none";
    changeBtn.style.display = "inline-flex";
    if (consent === "accepted") enableTracking();
  }

  acceptBtn.addEventListener("click", function () {
    localStorage.setItem("cookie-consent", "accepted");
    banner.style.display = "none";
    changeBtn.style.display = "inline-flex";
    enableTracking();
  });

  rejectBtn.addEventListener("click", function () {
    localStorage.setItem("cookie-consent", "declined");
    banner.style.display = "none";
    changeBtn.style.display = "inline-flex";
    disableTracking();
  });

  policyLink?.addEventListener("click", function (e) {
    e.preventDefault();
    policyPopup.style.display = "block";
  });
  policyClose?.addEventListener("click", function () {
    policyPopup.style.display = "none";
  });
  window.addEventListener("click", function (e) {
    if (e.target === policyPopup) policyPopup.style.display = "none";
  });

  changeBtn.addEventListener("click", function () {
    banner.style.display = "flex";
  });

  function enableTracking() {
    gtag('consent', 'update', {
      'ad_storage': 'granted',
      'analytics_storage': 'granted'
    });

    if (!document.getElementById("ga4-script")) {
      const gaScript = document.createElement("script");
      gaScript.id = "ga4-script";
      gaScript.src = "https://www.googletagmanager.com/gtag/js?id=G-ELGNQRMN1X";
      gaScript.async = true;
      document.head.appendChild(gaScript);

      gaScript.onload = function () {
        gtag('config', 'G-ELGNQRMN1X', { anonymize_ip: true });
        setupInteractionTracking();
      };
    } else {
      setupInteractionTracking();
    }

    if (!document.getElementById("adsense-script")) {
      const adsScript = document.createElement("script");
      adsScript.id = "adsense-script";
      adsScript.src = "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4322732012925287";
      adsScript.async = true;
      adsScript.crossOrigin = "anonymous";
      document.head.appendChild(adsScript);
      adsScript.onload = renderAds;
    } else {
      renderAds();
    }
  }

  function disableTracking() {
    gtag('consent', 'update', {
      'ad_storage': 'denied',
      'analytics_storage': 'denied'
    });
  }

  function setupInteractionTracking() {
    // --- Beregn-knap ---
    const beregnKnap = document.getElementById("beregn-knap");
    if (beregnKnap) {
      beregnKnap.addEventListener("click", () => {
        gtag("event", "beregn_tryk", {
          event_category: "interaktion",
          event_label: "Ladetidsberegner",
        });
      });
    }

    // --- Bogmærke-knap ---
    const bookmarkBtn = document.getElementById("bookmark-btn");
    if (bookmarkBtn) {
      bookmarkBtn.addEventListener("click", () => {
        gtag("event", "bogmaerke_tryk", {
          event_category: "interaktion",
          event_label: "Bogmærke-knap",
        });
      });
    }

    // --- Scroll tracking for beregneren ---
    const beregnerSection = document.getElementById("beregner-section");
    let scrollTracked = false;
    if (beregnerSection) {
      window.addEventListener("scroll", () => {
        const rect = beregnerSection.getBoundingClientRect();
        const windowHeight = window.innerHeight || document.documentElement.clientHeight;
        if (!scrollTracked && rect.top <= windowHeight * 0.9) {
          scrollTracked = true;
          gtag("event", "beregner_synlig", {
            event_category: "interaktion",
            event_label: "Beregn sektion synlig",
          });
        }
      });
    }
  }

  function renderAds() {
    try {
      window.adsbygoogle = window.adsbygoogle || [];
      const slots = document.querySelectorAll('ins.adsbygoogle');
      slots.forEach(() => {
        try {
          window.adsbygoogle.push({});
        } catch (e) {
          console.warn("adsbygoogle.push fejl:", e);
        }
      });
      console.log("AdSense renderet:", slots.length);
    } catch (err) {
      console.error("Fejl ved AdSense-rendering:", err);
    }
  }
});

// cookie.js – med fuld GA4 tracking og korrekt AdSense-håndtering
document.addEventListener("DOMContentLoaded", function () {
  const banner = document.getElementById("cookie-banner");
  const acceptBtn = document.getElementById("cookie-accept");
  const rejectBtn = document.getElementById("cookie-decline");
  const changeBtn = document.getElementById("change-cookie-consent");
  const policyLink = document.getElementById("cookie-policy-link");
  const policyPopup = document.getElementById("cookie-policy-popup");
  const policyClose = document.getElementById("cookie-policy-close");

  changeBtn.style.display = "none";

  // --- Google Consent Mode standard ---
  window.dataLayer = window.dataLayer || [];
  function gtag() { dataLayer.push(arguments); }

  gtag("consent", "default", {
    ad_storage: "denied",
    analytics_storage: "denied"
  });
  gtag("js", new Date());

  // --- Check tidligere samtykke ---
  const consent = localStorage.getItem("cookie-consent");
  if (!consent) {
    banner.style.display = "flex";
  } else {
    banner.style.display = "none";
    changeBtn.style.display = "inline-flex";
    if (consent === "accepted") enableTracking();
  }

  // --- Acceptér cookies ---
  acceptBtn.addEventListener("click", function () {
    localStorage.setItem("cookie-consent", "accepted");
    banner.style.display = "none";
    changeBtn.style.display = "inline-flex";
    enableTracking();
  });

  // --- Afvis cookies ---
  rejectBtn.addEventListener("click", function () {
    localStorage.setItem("cookie-consent", "declined");
    banner.style.display = "none";
    changeBtn.style.display = "inline-flex";
    disableTracking();
  });

  // --- Cookiepolitik popup ---
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

  // --- Ændr samtykke ---
  changeBtn.addEventListener("click", function () {
    banner.style.display = "flex";
  });

  // --- Aktiver tracking ---
  function enableTracking() {
    gtag("consent", "update", {
      ad_storage: "granted",
      analytics_storage: "granted"
    });

    // Google Analytics 4
    if (!document.getElementById("ga4-script")) {
      const gaScript = document.createElement("script");
      gaScript.id = "ga4-script";
      gaScript.src = "https://www.googletagmanager.com/gtag/js?id=G-ELGNQRMN1X";
      gaScript.async = true;
      document.head.appendChild(gaScript);

      gaScript.onload = function () {
        gtag("config", "G-ELGNQRMN1X", { anonymize_ip: true });
        setupInteractionTracking();
      };
    } else {
      setupInteractionTracking();
    }

    // AdSense (renderer eksisterende slots)
    setTimeout(renderAds, 1000);
  }

  // --- Deaktiver tracking ---
  function disableTracking() {
    gtag("consent", "update", {
      ad_storage: "denied",
      analytics_storage: "denied"
    });
  }

  // --- Event-tracking ---
  function setupInteractionTracking() {
    const beregnKnapper = [
      { id: "beregn-soc-btn", label: "Beregn ladetid" },
      { id: "beregn-tid-btn", label: "Beregn start/sluttidspunkt" },
      { id: "beregn-soc-tid-btn", label: "Beregn SoC-stigning" }
    ];

    beregnKnapper.forEach(knap => {
      const element = document.getElementById(knap.id);
      if (element) {
        element.addEventListener("click", () => {
          gtag("event", "klik_beregn_knap", {
            event_category: "Beregner",
            event_label: knap.label,
            value: 1
          });
        });
      }
    });

    // Bogmærke-knap
    const bookmarkBtn = document.getElementById("bookmark-btn");
    if (bookmarkBtn) {
      bookmarkBtn.addEventListener("click", () => {
        gtag("event", "bogmaerke_tryk", {
          event_category: "Interaktion",
          event_label: "Bogmærke-knap"
        });
      });
    }

    // Scroll-tracking for beregner
    const beregnerSection = document.getElementById("bereger");
    let scrollTracked = false;
    if (beregnerSection) {
      window.addEventListener("scroll", () => {
        const rect = beregnerSection.getBoundingClientRect();
        const windowHeight = window.innerHeight || document.documentElement.clientHeight;
        if (!scrollTracked && rect.top <= windowHeight * 0.9) {
          scrollTracked = true;
          gtag("event", "beregner_synlig", {
            event_category: "Interaktion",
            event_label: "Beregner synlig på skærmen"
          });
        }
      });
    }
  }

  // --- AdSense renderer ---
  function renderAds() {
    try {
      window.adsbygoogle = window.adsbygoogle || [];
      const slots = document.querySelectorAll("ins.adsbygoogle");
      slots.forEach(slot => {
        // Fjern status så de kan rendere igen
        slot.removeAttribute("data-adsbygoogle-status");
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

// === Diagnostisk overvågning af AdSense-slots ===
window.addEventListener("load", function () {
  setTimeout(() => {
    const slots = document.querySelectorAll("ins.adsbygoogle");
    console.group("📊 AdSense-slotdiagnose");
    console.log("Fundne slots på siden:", slots.length);

    if (slots.length === 0) {
      console.warn("Ingen <ins class='adsbygoogle'> fundet – tjek HTML-strukturen.");
    } else {
      slots.forEach((slot, i) => {
        const client = slot.getAttribute("data-ad-client");
        const slotId = slot.getAttribute("data-ad-slot");
        const format = slot.getAttribute("data-ad-format");
        const display = getComputedStyle(slot).display;
        const size = `${slot.offsetWidth}x${slot.offsetHeight}`;

        console.log(
          `Slot #${i + 1}:`,
          "\n → data-ad-client:", client,
          "\n → data-ad-slot:", slotId,
          "\n → format:", format,
          "\n → display:", display,
          "\n → størrelse (px):", size,
          "\n → synlig i viewport:", isInViewport(slot)
        );
      });
    }

    // Test om AdSense-objekt er initialiseret korrekt
    if (window.adsbygoogle && window.adsbygoogle.push) {
      console.log("✅ adsbygoogle-objekt findes – klar til at vise annoncer");
    } else {
      console.warn("❌ adsbygoogle er ikke initialiseret – tjek samtykke og scriptindlæsning");
    }

    console.groupEnd();
  }, 2000); // vent et par sekunder efter load
});

// Hjælpefunktion: tjek om elementet er i viewport
function isInViewport(el) {
  const rect = el.getBoundingClientRect();
  return (
    rect.top < (window.innerHeight || document.documentElement.clientHeight) &&
    rect.bottom > 0
  );
}

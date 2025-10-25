// cookie.js – med GA4 tracking, forbedret AdSense og visuelle slot-markører (debug)
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

    // Render annoncer
    setTimeout(renderAds, 1500);
  }

  function disableTracking() {
    gtag("consent", "update", {
      ad_storage: "denied",
      analytics_storage: "denied"
    });
  }

  // === GA4 Event Tracking ===
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
            event_label: knap.label
          });
        });
      }
    });

    const bookmarkBtn = document.getElementById("bookmark-btn");
    if (bookmarkBtn) {
      bookmarkBtn.addEventListener("click", () => {
        gtag("event", "bogmaerke_tryk", {
          event_category: "Interaktion",
          event_label: "Bogmærke-knap"
        });
      });
    }
  }

  // === Forbedret AdSense renderer (debug med farvekoder) ===
  function renderAds() {
    try {
      window.adsbygoogle = window.adsbygoogle || [];
      const slots = document.querySelectorAll("ins.adsbygoogle");

      console.log("📊 AdSense-slotdiagnose");
      console.log("Fundne slots på siden:", slots.length);

      slots.forEach((slot, i) => {
        // Tilføj midlertidig debugramme
        slot.style.outline = "3px solid gray";
        slot.style.position = "relative";
        slot.insertAdjacentHTML("beforeend", `
          <div style="
            position:absolute;
            top:4px; right:4px;
            background:rgba(80,80,80,0.85);
            color:#fff;
            font-size:12px;
            padding:2px 6px;
            border-radius:4px;
            font-family:sans-serif;
          ">⏳ Slot ${i + 1}</div>`);

        setTimeout(() => {
          try {
            slot.removeAttribute("data-adsbygoogle-status");
            (window.adsbygoogle = window.adsbygoogle || []).push({});
            slot.style.outline = "3px solid #55ca1c";
            slot.querySelector("div").textContent = `✅ Slot ${i + 1}`;
            slot.querySelector("div").style.background = "#55ca1c";
            console.log(`✅ Slot ${i + 1} initialiseret`);
          } catch (e) {
            slot.style.outline = "3px solid red";
            slot.querySelector("div").textContent = `⚠️ Fejl i slot ${i + 1}`;
            slot.querySelector("div").style.background = "red";
            console.warn(`⚠️ Fejl ved slot ${i + 1}:`, e);
          }
        }, 1500 + i * 1000);
      });
    } catch (err) {
      console.error("Fejl ved AdSense-rendering:", err);
    }
  }
});

// === Diagnostisk overvågning ===
window.addEventListener("load", function () {
  setTimeout(() => {
    const slots = document.querySelectorAll("ins.adsbygoogle");
    console.group("📊 AdSense-slotdiagnose");
    console.log("Fundne slots på siden:", slots.length);

    slots.forEach((slot, i) => {
      const client = slot.getAttribute("data-ad-client");
      const slotId = slot.getAttribute("data-ad-slot");
      const format = slot.getAttribute("data-ad-format");
      const size = `${slot.offsetWidth}x${slot.offsetHeight}`;
      console.log(
        `Slot #${i + 1}:`,
        "\n → client:", client,
        "\n → slot:", slotId,
        "\n → format:", format,
        "\n → size:", size
      );
    });

    if (window.adsbygoogle && window.adsbygoogle.push) {
      console.log("✅ adsbygoogle-objekt findes – klar til at vise annoncer");
    } else {
      console.warn("❌ adsbygoogle ikke initialiseret");
    }

    console.groupEnd();
  }, 2500);
});

/**
 * cookie.js
 * Håndterer visning af eget cookie-banner, cookie-policy-popup og aktivering af Google Analytics/Ads efter accept.
 *
 * Forudsætning: <head> indeholder GA-scriptet som:
 * <script async src="https://www.googletagmanager.com/gtag/js?id=G-ELGNQRMN1X"></script>
 * og initialiserer consent som "denied" (se head-opsætning vi tidligere aftalte).
 *
 * Denne fil sørger for:
 * - Kun dit eget banner vises (ingen Google-banner).
 * - Analytics/config aktiveres først når brugeren accepterer.
 * - Robust (tjekker om elementer findes og håndterer hvis gtag ikke er loadet endnu).
 */

document.addEventListener("DOMContentLoaded", function () {
  // --- Elementer (defensive checks så script ikke fejler hvis et id mangler) ---
  const banner = document.getElementById("cookie-banner");
  const acceptBtn = document.getElementById("cookie-accept");
  const declineBtn = document.getElementById("cookie-decline");
  const policyLink = document.getElementById("cookie-policy-link");
  const policyPopup = document.getElementById("cookie-policy-popup");
  const policyClose = document.getElementById("cookie-policy-close");
  const changeBtn = document.getElementById("change-cookie-consent");

  // --- LocalStorage key ---
  const STORAGE_KEY = "cookie-consent";

  // --- Helper: vis/ skjul banner med fallback ---
  function showBanner() {
    if (!banner) return;
    banner.style.display = "flex";
  }
  function hideBanner() {
    if (!banner) return;
    banner.style.display = "none";
  }

  // --- Hent tidligere valg ---
  const consent = localStorage.getItem(STORAGE_KEY);
  if (!consent) {
    // Hvis intet valg: vis eget banner
    showBanner();
  } else {
    // Hvis tidligere valg: skjul banner og aktiver tracking hvis accepteret
    hideBanner();
    if (consent === "accepted") {
      enableTracking();
    }
  }

  // --- Event handlers (kun hvis elementerne findes) ---
  if (acceptBtn) {
    acceptBtn.addEventListener("click", function () {
      try {
        localStorage.setItem(STORAGE_KEY, "accepted");
        hideBanner();
        enableTracking();
      } catch (err) {
        console.error("Fejl ved gem af cookie-consent:", err);
      }
    });
  }

  if (declineBtn) {
    declineBtn.addEventListener("click", function () {
      try {
        localStorage.setItem(STORAGE_KEY, "declined");
        hideBanner();
        // Ingen tracking aktiveres
      } catch (err) {
        console.error("Fejl ved gem af cookie-consent:", err);
      }
    });
  }

  // Åbn / luk cookie policy-popup
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
  // Klik udenfor lukker
  window.addEventListener("click", function (e) {
    if (policyPopup && e.target === policyPopup) {
      policyPopup.style.display = "none";
    }
  });

  // Ændr samtykke-knap i footer (åbner banner igen)
  if (changeBtn) {
    changeBtn.addEventListener("click", function () {
      showBanner();
    });
  }

  // --- Tracking aktivering (sikret mod manglende gtag) ---
  let _trackingActivated = false;
  function enableTracking() {
    if (_trackingActivated) return;
    _trackingActivated = true;

    const GA_ID = "G-ELGNQRMN1X"; // holdes i sync med <head>

    // Opdater consent & init gtag config når gtag er klar.
    function doGtagUpdate() {
      try {
        if (typeof gtag === "function") {
          // Opdater consent og init config
          gtag("consent", "update", {
            analytics_storage: "granted",
            ad_storage: "granted",
          });
          // Konfigurer GA (anonymize ip for privacy)
          gtag("config", GA_ID, { anonymize_ip: true });
        } else {
          // Hvis gtag ikke er defineret - opret en midlertidig wrapper så kald ikke fejler
          window.dataLayer = window.dataLayer || [];
          window.gtag = function () {
            window.dataLayer.push(arguments);
          };
          // Push consent/config via wrapper (vil blive sendt hvis og når scriptet loades for real)
          gtag("consent", "update", {
            analytics_storage: "granted",
            ad_storage: "granted",
          });
          gtag("config", GA_ID, { anonymize_ip: true });
        }
      } catch (err) {
        console.error("doGtagUpdate fejl:", err);
      }
    }

    // Hvis gtag allerede er defineret -> opdater nu
    if (typeof gtag === "function") {
      doGtagUpdate();
    } else {
      // Hvis gtag ikke er defineret: prøv at finde / vente på script eller dynamisk loade det
      const scriptSrc = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;

      // Hvis script ikke er til stede i DOM, load det
      if (!document.querySelector(`script[src="${scriptSrc}"]`)) {
        const s = document.createElement("script");
        s.async = true;
        s.src = scriptSrc;
        s.onload = function () {
          // initialiser gtag globalt ligesom i head
          window.dataLayer = window.dataLayer || [];
          function gtagLocal() {
            window.dataLayer.push(arguments);
          }
          window.gtag = gtagLocal;
          gtag("js", new Date());
          doGtagUpdate();
        };
        s.onerror = function () {
          console.error("Kunne ikke loade gtag.js fra Google.");
          // Forsøg alligevel at køre wrapper-opdatering (vil blot pushe til dataLayer)
          doGtagUpdate();
        };
        document.head.appendChild(s);
      } else {
        // Script-tag findes, men gtag kan endnu ikke være initialiseret — vent et øjeblik
        let tries = 0;
        const wait = setInterval(function () {
          if (typeof gtag === "function") {
            clearInterval(wait);
            doGtagUpdate();
          } else if (tries++ > 50) {
            // timeout efter ~5s
            clearInterval(wait);
            doGtagUpdate();
          }
        }, 100);
      }
    }

    // --- Forsøg på at "aktivere" AdSense kald som allerede ligger i HTML (push) ---
    // Mange sider kører (adsbygoogle = window.adsbygoogle || []).push({}) inline.
    // Hvis adsbygoogle-array eksisterer, triggere en push så AdSense kan forsøge igen.
    try {
      if (window.adsbygoogle && Array.isArray(window.adsbygoogle)) {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      }
    } catch (err) {
      // Ikke kritisk
    }
  } // end enableTracking()

}); // end DOMContentLoaded

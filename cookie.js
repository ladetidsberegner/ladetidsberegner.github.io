// cookie.js

(function () {

  document.addEventListener("DOMContentLoaded", function () {

    const banner = document.getElementById("cookie-banner");
    const acceptBtn = document.getElementById("cookie-accept");
    const rejectBtn = document.getElementById("cookie-decline");
    const policyLink = document.getElementById("cookie-policy-link");
    const policyPopup = document.getElementById("cookie-policy-popup");
    const policyClose = document.getElementById("cookie-policy-close");
    const changeBtn = document.getElementById("change-cookie-consent");

    if (!banner) return;

    // Sørg for popup ALTID er skjult ved start
    if (policyPopup) {
      policyPopup.style.display = "none";
    }

    function showBanner() {
      banner.style.display = "flex";
    }

    function hideBanner() {
      banner.style.display = "none";
    }

    function showPopup() {
      if (policyPopup) {
        policyPopup.style.display = "flex";
      }
    }

    function hidePopup() {
      if (policyPopup) {
        policyPopup.style.display = "none";
      }
    }

    // === Tjek consent ===
    const consent = localStorage.getItem("cookie-consent");

    if (!consent) {
      showBanner();
    } else {
      hideBanner();
    }

    // === Accept ===
    if (acceptBtn) {
      acceptBtn.addEventListener("click", function () {
        localStorage.setItem("cookie-consent", "accepted");
        hideBanner();
      });
    }

    // === Afvis ===
    if (rejectBtn) {
      rejectBtn.addEventListener("click", function () {
        localStorage.setItem("cookie-consent", "declined");
        hideBanner();
      });
    }

    // === Åbn cookiepolitik ===
    if (policyLink) {
      policyLink.addEventListener("click", function (e) {
        e.preventDefault();
        showPopup();
      });
    }

    // === Luk popup (X) ===
    if (policyClose) {
      policyClose.addEventListener("click", function () {
        hidePopup();
      });
    }

    // === Ændr cookieindstillinger ===
    if (changeBtn) {
      changeBtn.addEventListener("click", function () {
        showPopup();
      });
    }

    // === Klik udenfor popup ===
    window.addEventListener("click", function (e) {
      if (e.target === policyPopup) {
        hidePopup();
      }
    });

  });

})();

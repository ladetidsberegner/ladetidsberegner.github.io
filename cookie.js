// cookie-global.js
document.addEventListener("DOMContentLoaded", function () {

  const banner = document.getElementById("cookie-banner");
  const acceptBtn = document.getElementById("cookie-accept");
  const rejectBtn = document.getElementById("cookie-decline");
  const policyLink = document.getElementById("cookie-policy-link");
  const policyPopup = document.getElementById("cookie-policy-popup");
  const policyClose = document.getElementById("cookie-policy-close");
  const changeBtn = document.getElementById("change-cookie-consent");

  if (!banner) return;

  // Sørg for popup altid er skjult ved start
  if (policyPopup) policyPopup.style.display = "none";

  function showBanner() {
    banner.style.display = "flex";
  }

  function hideBanner() {
    banner.style.display = "none";
  }

  function showPopup() {
    if (policyPopup) policyPopup.style.display = "flex";
  }

  function hidePopup() {
    if (policyPopup) policyPopup.style.display = "none";
  }

  // === CHECK CONSENT ===
  const consent = localStorage.getItem("cookie-consent");

  if (!consent) {
    showBanner();
  } else {
    hideBanner();
  }

  // === BUTTON EVENTS ===
  if (acceptBtn) {
    acceptBtn.addEventListener("click", function () {
      localStorage.setItem("cookie-consent", "accepted");
      hideBanner();
    });
  }

  if (rejectBtn) {
    rejectBtn.addEventListener("click", function () {
      localStorage.setItem("cookie-consent", "declined");
      hideBanner();
    });
  }

  if (policyLink) {
    policyLink.addEventListener("click", function (e) {
      e.preventDefault();
      showPopup();
    });
  }

  if (policyClose) {
    policyClose.addEventListener("click", function () {
      hidePopup();
    });
  }

  if (changeBtn) {
    changeBtn.addEventListener("click", function () {
      showPopup();
    });
  }

  // Luk popup ved klik udenfor
  window.addEventListener("click", function (e) {
    if (e.target === policyPopup) {
      hidePopup();
    }
  });

});

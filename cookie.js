document.addEventListener("DOMContentLoaded", function() {
  // Elements
  const banner = document.getElementById("cookie-banner");
  const acceptBtn = document.getElementById("cookie-accept");
  const declineBtn = document.getElementById("cookie-decline");
  const policyLink = document.getElementById("cookie-policy-link");
  const policyPopup = document.getElementById("cookie-policy-popup");
  const policyClose = document.getElementById("cookie-policy-close");
  const changeBtn = document.getElementById("change-cookie-consent");

  // --- Check tidligere valg ---
  const consent = localStorage.getItem("cookie-consent");
  if (!consent) {
    banner.style.display = "flex";
  } else {
    banner.style.display = "none";
    if (consent === "accepted") enableTracking();
  }

  // --- Accepter ---
  acceptBtn.addEventListener("click", function() {
    localStorage.setItem("cookie-consent", "accepted");
    banner.style.display = "none";
    enableTracking();
  });

  // --- Afvis ---
  declineBtn.addEventListener("click", function() {
    localStorage.setItem("cookie-consent", "declined");
    banner.style.display = "none";
  });

  // --- Åbn/Luk popup ---
  policyLink.addEventListener("click", function(e) {
    e.preventDefault();
    policyPopup.style.display = "block";
  });
  policyClose.addEventListener("click", function() { policyPopup.style.display = "none"; });
  window.addEventListener("click", function(e) {
    if (e.target === policyPopup) policyPopup.style.display = "none";
  });

  // --- Ændr samtykke-knap ---
  changeBtn.addEventListener("click", function() {
    banner.style.display = "flex";
  });

  // --- GA + AdSense ---
  function enableTracking() {
    gtag('consent', 'update', {
      'analytics_storage': 'granted',
      'ad_storage': 'granted'
    });
    gtag('config', 'G-ELGNQRMN1X');
  }
});

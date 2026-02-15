/* =========================
   COOKIE + ADSENSE CONTROL
========================= */

// Indsæt cookie banner automatisk
function insertCookieBanner() {
  if (document.getElementById("cookie-banner")) return;

  const banner = document.createElement("div");
  banner.id = "cookie-banner";
  banner.style.position = "fixed";
  banner.style.bottom = "0";
  banner.style.left = "0";
  banner.style.right = "0";
  banner.style.background = "#111";
  banner.style.color = "#fff";
  banner.style.padding = "15px";
  banner.style.textAlign = "center";
  banner.style.zIndex = "9999";
  banner.style.display = "none";

  banner.innerHTML = `
    Denne side bruger cookies til statistik og annoncering.
    <button id="accept-cookies" style="margin-left:15px;padding:6px 12px;">OK</button>
    <button id="decline-cookies" style="margin-left:10px;padding:6px 12px;">Afvis</button>
  `;

  document.body.appendChild(banner);

  document
    .getElementById("accept-cookies")
    .addEventListener("click", acceptCookies);

  document
    .getElementById("decline-cookies")
    .addEventListener("click", declineCookies);
}


// Accept / decline
function acceptCookies() {
  localStorage.setItem("cookieConsent", "accepted");
  document.getElementById("cookie-banner").style.display = "none";
  loadAdsWhenReady();
}

function declineCookies() {
  localStorage.setItem("cookieConsent", "declined");
  document.getElementById("cookie-banner").style.display = "none";
}


// Init ved load
window.addEventListener("load", () => {
  insertCookieBanner();

  const consent = localStorage.getItem("cookieConsent");

  if (!consent) {
    document.getElementById("cookie-banner").style.display = "block";
  }

  if (consent === "accepted") {
    loadAdsWhenReady();
  }
});


/* =========================
        ADSENSE FIX
========================= */

function loadAdsWhenReady() {
  const slots = document.querySelectorAll("ins.adsbygoogle");

  slots.forEach((slot) => {
    waitForWidth(slot);
  });
}

function waitForWidth(slot, attempts = 0) {
  if (slot.offsetWidth > 0) {
    try {
      (adsbygoogle = window.adsbygoogle || []).push({});
      console.log("Ad loaded");
    } catch (e) {
      console.log("AdSense push error:", e);
    }
  } else if (attempts < 20) {
    setTimeout(() => waitForWidth(slot, attempts + 1), 250);
  } else {
    console.log("Ad slot never received width.");
  }
}

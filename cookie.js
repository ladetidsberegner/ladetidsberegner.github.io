// cookie.js
(function() {
  if (window.__cookieSystemInit) return;
  window.__cookieSystemInit = true;

  /* ---------- Vent på at alle elementer er tilgængelige ---------- */
  function waitForElements() {
    const banner = document.getElementById("cookie-banner");
    const acceptBtn = document.getElementById("cookie-accept");
    const rejectBtn = document.getElementById("cookie-decline");
    const policyLink = document.getElementById("cookie-policy-link");
    const policyPopup = document.getElementById("cookie-policy-popup");
    const policyClose = document.getElementById("cookie-policy-close");
    const changeBtn = document.getElementById("change-cookie-consent");

    if (!banner || !acceptBtn || !rejectBtn || !policyLink || !policyPopup || !policyClose || !changeBtn) {
      setTimeout(waitForElements, 50);
      return;
    }

    initCookieSystem(banner, acceptBtn, rejectBtn, policyLink, policyPopup, policyClose, changeBtn);
  }

  waitForElements();

  /* ---------- Hovedfunktion ---------- */
  function initCookieSystem(banner, acceptBtn, rejectBtn, policyLink, policyPopup, policyClose, changeBtn) {

    // Start skjult
    banner.style.display = "none";
    policyPopup.style.display = "none";
    changeBtn.style.display = "none";

    window.dataLayer = window.dataLayer || [];
    function gtag(){ dataLayer.push(arguments); }
    gtag("consent", "default", {ad_storage:"denied", analytics_storage:"denied"});
    gtag("js", new Date());

    let trackingEnabled = false;

    /* ---------- Aktiver tracking og reklamer ---------- */
    function enableTracking() {
      if (trackingEnabled) return;
      trackingEnabled = true;

      gtag("consent","update",{ad_storage:"granted",analytics_storage:"granted"});

      // GA4
      if (!document.getElementById("ga4-script")) {
        const gaScript = document.createElement("script");
        gaScript.id = "ga4-script";
        gaScript.src = "https://www.googletagmanager.com/gtag/js?id=G-ELGNQRMN1X";
        gaScript.async = true;
        gaScript.onload = () => gtag("config","G-ELGNQRMN1X",{anonymize_ip:true});
        document.head.appendChild(gaScript);
      }

      // Adsense
      if (!document.getElementById("adsense-script")) {
        const adsScript = document.createElement("script");
        adsScript.id = "adsense-script";
        adsScript.src = "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4322732012925287";
        adsScript.async = true;
        adsScript.crossOrigin = "anonymous";
        adsScript.onload = renderAds;
        document.head.appendChild(adsScript);
      } else renderAds();
    }

    /* ---------- Deaktiver tracking ---------- */
    function disableTracking(forceReload=false) {
      gtag("consent","update",{ad_storage:"denied",analytics_storage:"denied"});
      if (forceReload) setTimeout(()=>location.reload(),500);
    }

    /* ---------- Render alle Adsense slots ---------- */
    function renderAds() {
      try {
        window.adsbygoogle = window.adsbygoogle || [];
        document.querySelectorAll("ins.adsbygoogle").forEach(slot => {
          function tryPush(attempts=0) {
            if (slot.offsetWidth > 0 || attempts > 10) window.adsbygoogle.push({});
            else setTimeout(()=>tryPush(attempts+1),200);
          }
          tryPush();
        });
      } catch(e){ console.error("AdSense render error:", e); }
    }

    /* ---------- Tilføj knapper til popup hvis ikke allerede ---------- */
    function addPolicyButtons() {
      const popupContent = policyPopup.querySelector(".co

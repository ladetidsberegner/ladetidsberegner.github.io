// cookie-system.js – global, komplet
(function() {
  if (window.__cookieSystemInit) return;
  window.__cookieSystemInit = true;

  function waitForBanner() {
    const banner = document.getElementById("cookie-banner");
    const acceptBtn = document.getElementById("cookie-accept");
    const declineBtn = document.getElementById("cookie-decline");
    const policyLink = document.getElementById("cookie-policy-link");
    const policyPopup = document.getElementById("cookie-policy-popup");
    const policyClose = document.getElementById("cookie-policy-close");
    const changeBtn = document.getElementById("change-cookie-consent");

    // Vent, hvis selve banneret ikke findes endnu
    if (!banner) {
      setTimeout(waitForBanner, 50);
      return;
    }

    initCookieSystem(banner, acceptBtn, declineBtn, policyLink, policyPopup, policyClose, changeBtn);
  }

  waitForBanner();

  function initCookieSystem(banner, acceptBtn, declineBtn, policyLink, policyPopup, policyClose, changeBtn) {
    const consent = localStorage.getItem("cookie-consent");

    // Funktion til GA + Ads
    window.dataLayer = window.dataLayer || [];
    function gtag(){ dataLayer.push(arguments); }
    gtag("consent","default",{ad_storage:"denied",analytics_storage:"denied"});
    gtag("js", new Date());

    let trackingEnabled = false;
    function enableTracking() {
      if (trackingEnabled) return;
      trackingEnabled = true;
      gtag("consent","update",{ad_storage:"granted",analytics_storage:"granted"});

      // GA4 script
      if (!document.getElementById("ga4-script")) {
        const gaScript = document.createElement("script");
        gaScript.id = "ga4-script";
        gaScript.src = "https://www.googletagmanager.com/gtag/js?id=G-ELGNQRMN1X";
        gaScript.async = true;
        gaScript.onload = () => gtag("config","G-ELGNQRMN1X",{anonymize_ip:true});
        document.head.appendChild(gaScript);
      }

      // AdSense script
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

    function disableTracking(forceReload=false) {
      gtag("consent","update",{ad_storage:"denied",analytics_storage:"denied"});
      if (forceReload) setTimeout(()=>location.reload(),500);
    }

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

    function hideBanner() {
      banner.style.display = "none";
      if (changeBtn) changeBtn.style.display = "inline-flex";
    }

    // Vis banner kun hvis intet samtykke
    if (!consent) banner.style.display = "flex";
    else hideBanner();

    // Knap events
    if (acceptBtn) acceptBtn.addEventListener("click", ()=>{
      localStorage.setItem("cookie-consent","accepted");
      hideBanner();
      enableTracking();
    });
    if (declineBtn) declineBtn.addEventListener("click", ()=>{
      localStorage.setItem("cookie-consent","declined");
      hideBanner();
      disableTracking(true);
    });

    if (policyLink) policyLink.addEventListener("click", e=>{
      e.preventDefault();
      if (policyPopup) policyPopup.style.display="block";
      addPolicyButtons(policyPopup);
    });
    if (policyClose) policyClose.addEventListener("click", ()=>{ if(policyPopup) policyPopup.style.display="none"; });
    window.addEventListener("click", e=>{ if(e.target===policyPopup) policyPopup.style.display="none"; });

    if (changeBtn) {
      changeBtn.style.display = "inline-flex";
      changeBtn.addEventListener("click", ()=>{
        if (policyPopup) policyPopup.style.display="block";
        addPolicyButtons(policyPopup);
      });
    }

    // Policy-knapper dynamisk
    function addPolicyButtons(popup) {
      if (!popup || popup.querySelector(".policy-actions")) return;
      const btns = document.createElement("div");
      btns.className = "policy-actions";
      btns.style.marginTop="20px";
      btns.innerHTML = `
        <button id="policy-accept" style="background:#55ca1c;color:#fff;border:none;padding:8px 14px;border-radius:6px;cursor:pointer;font-weight:600;margin-right:10px;">Accepter</button>
        <button id="policy-decline" style="background:#666;color:#fff;border:none;padding:8px 14px;border-radius:6px;cursor:pointer;font-weight:600;">Afvis</button>
      `;
      popup.appendChild(btns);

      document.getElementById("policy-accept").addEventListener("click", ()=>{
        localStorage.setItem("cookie-consent","accepted");
        if(policyPopup) policyPopup.style.display="none";
        hideBanner();
        enableTracking();
      });

      document.getElementById("policy-decline").addEventListener("click", ()=>{
        localStorage.setItem("cookie-consent","declined");
        if(policyPopup) policyPopup.style.display="none";
        disableTracking(true);
      });
    }
  }
})();

// cookie-global.js
(function() {
  if (window.__cookieSystemInit) return;
  window.__cookieSystemInit = true;

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

  function initCookieSystem(banner, acceptBtn, rejectBtn, policyLink, policyPopup, policyClose, changeBtn) {
    if (changeBtn) changeBtn.style.display = "none";

    // Popup er altid skjult som udgangspunkt
    if (policyPopup) policyPopup.style.display = "none";

    window.dataLayer = window.dataLayer || [];
    function gtag(){ dataLayer.push(arguments); }
    gtag("consent","default",{ad_storage:"denied",analytics_storage:"denied"});
    gtag("js", new Date());

    let trackingEnabled = false;

    function enableTracking() {
      if (trackingEnabled) return;
      trackingEnabled = true;
      gtag("consent","update",{ad_storage:"granted",analytics_storage:"granted"});

      if (!document.getElementById("ga4-script")) {
        const gaScript = document.createElement("script");
        gaScript.id = "ga4-script";
        gaScript.src = "https://www.googletagmanager.com/gtag/js?id=G-ELGNQRMN1X";
        gaScript.async = true;
        gaScript.onload = () => gtag("config","G-ELGNQRMN1X",{anonymize_ip:true});
        document.head.appendChild(gaScript);
      }

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

    function addPolicyButtons() {
      const popup = document.querySelector(".cookie-policy-content");
      if (!popup || popup.querySelector(".policy-actions")) return;

      const btns = document.createElement("div");
      btns.className = "policy-actions";
      btns.style.marginTop = "20px";
      btns.style.display = "flex";
      btns.style.justifyContent = "flex-start";
      btns.style.gap = "10px";
      btns.innerHTML = `
        <button id="policy-accept" style="background:#55ca1c;color:#fff;border:none;padding:8px 14px;border-radius:6px;cursor:pointer;font-weight:600;">Accepter</button>
        <button id="policy-decline" style="background:#666;color:#fff;border:none;padding:8px 14px;border-radius:6px;font-weight:600;cursor:pointer;">Afvis</button>
      `;
      popup.appendChild(btns);

      document.getElementById("policy-accept").addEventListener("click",()=>{
        localStorage.setItem("cookie-consent","accepted");
        policyPopup.style.display="none";
        enableTracking();
        hideBanner();
        restoreSavedFields();
      });
      document.getElementById("policy-decline").addEventListener("click",()=>{
        localStorage.setItem("cookie-consent","declined");
        policyPopup.style.display="none";
        disableTracking(true);
      });
    }

    function hideBanner() {
      if (banner) banner.style.display="none";
      if (changeBtn) changeBtn.style.display="inline-flex";
    }

    const consent = localStorage.getItem("cookie-consent");
    if (!consent) banner.style.display = "flex";
    else { hideBanner(); consent==="accepted"?enableTracking():disableTracking(); }

    acceptBtn.addEventListener("click",()=>{
      localStorage.setItem("cookie-consent","accepted");
      hideBanner();
      enableTracking();
      restoreSavedFields();
    });

    rejectBtn.addEventListener("click",()=>{
      localStorage.setItem("cookie-consent","declined");
      hideBanner();
      disableTracking(true);
    });

    policyLink.addEventListener("click",(e)=>{
      e.preventDefault();
      policyPopup.style.display="block";
      addPolicyButtons();
    });

    policyClose.addEventListener("click",()=>{ policyPopup.style.display="none"; });
    window.addEventListener("click",(e)=>{ if(e.target===policyPopup) policyPopup.style.display="none"; });

    if (changeBtn) {
      changeBtn.style.display = "inline-flex";
      changeBtn.addEventListener("click",()=>{
        policyPopup.style.display="block";
        addPolicyButtons();
      });
    }

    const allFields = document.querySelectorAll("#bereger input,#bereger select");
    function saveField(el){ if(localStorage.getItem("cookie-consent")!=="accepted") return; el.type==="radio"||el.type==="checkbox"?localStorage.setItem(el.id,el.checked):localStorage.setItem(el.id,el.value); }
    function restoreSavedFields(){ allFields.forEach(el=>{ const stored=localStorage.getItem(el.id); if(stored!==null){ el.type==="radio"||el.type==="checkbox"?el.checked=stored==="true":el.value=stored; } }); }
    if(consent==="accepted") restoreSavedFields();
    allFields.forEach(el=>{ el.addEventListener("input",()=>saveField(el)); el.addEventListener("change",()=>saveField(el)); });
  }
})();

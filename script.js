
document.addEventListener("DOMContentLoaded", function () {
  try {
    // --- Beregner ---
    const form = document.querySelector(".beregn-form");
    const resultatEl = document.getElementById("resultat");
    const toggleBtn = document.getElementById("toggle-advanced");
    const advancedFields = document.getElementById("advanced-fields");

    if (!form || !resultatEl) {
      console.error("Formular eller resultat-element ikke fundet");
      return;
    }

    // Vis/skjul avanceret panel
    if (toggleBtn && advancedFields) {
      toggleBtn.addEventListener("click", () => {
        advancedFields.classList.toggle("show");
        toggleBtn.textContent = advancedFields.classList.contains("show")
          ? "Skjul avancerede indstillinger"
          : "Vis avancerede indstillinger";
      });
    }

    // Beregn ladetid
    form.addEventListener("submit", function (e) {
      e.preventDefault();

      const socStart = parseFloat(document.getElementById("soc-start").value);
      const socSlut = parseFloat(document.getElementById("soc-slut").value);
      const kapacitet = parseFloat(document.getElementById("kapacitet").value);
      const ampere = parseFloat(document.getElementById("ampere").value);
      const volt = parseFloat(document.getElementById("volt").value);
      const faser = parseInt(document.getElementById("faser").value, 10);
      const ladetab = parseFloat(document.getElementById("ladetab").value);

      // Validering
      if (
        isNaN(socStart) || socStart < 0 || socStart > 100 ||
        isNaN(socSlut) || socSlut <= socStart || socSlut > 100
      ) {
        resultatEl.textContent = "Slut SoC skal være højere end start SoC, og begge mellem 0 og 100.";
        return;
      }
      if (isNaN(kapacitet) || kapacitet <= 0) {
        resultatEl.textContent = "Indtast en gyldig batterikapacitet.";
        return;
      }
      if (isNaN(ampere) || ampere <= 0 || isNaN(volt) || volt <= 0 || (faser !== 1 && faser !== 3)) {
        resultatEl.textContent = "Tjek de tekniske værdier.";
        return;
      }
      if (isNaN(ladetab) || ladetab < 0 || ladetab > 100) {
        resultatEl.textContent = "Ladetab skal være mellem 0 og 100%.";
        return;
      }

      // Beregning
      const energibehov = kapacitet * ((socSlut - socStart) / 100);
      const bruttoKWh = energibehov * (1 + ladetab / 100);
      const effektKW = (ampere * volt * faser) / 1000;

      if (effektKW <= 0) {
        resultatEl.textContent = "Effekten kan ikke være nul.";
        return;
      }

      const tidTimer = bruttoKWh / effektKW;
      const totalMin = Math.round(tidTimer * 60);
      let tekst = "Estimeret ladetid: ";

      if (totalMin <= 60) {
        tekst += `${totalMin} minutter`;
      } else {
        const dage = Math.floor(totalMin / 1440);
        const timer = Math.floor((totalMin % 1440) / 60);
        const minutter = totalMin % 60;

        if (dage > 0) tekst += `${dage} dag${dage > 1 ? "e" : ""} `;
        if (timer > 0) tekst += `${timer} timer `;
        if (minutter > 0) tekst += `${minutter} minutter`;
      }

      tekst += `<br>Energiforbrug: ${bruttoKWh.toFixed(2)} kWh`;
      resultatEl.innerHTML = tekst;
    });

    // --- Cookie consent og annoncer ---
    const cookieBanner = document.getElementById("cookie-banner");
    const acceptBtn = document.getElementById("accept-cookies");
    const afvisBtn = document.getElementById("afvis-cookies");

    function checkConsent() {
      return localStorage.getItem("cookiesAccepted");
    }

    function showAds() {
      const adContainers = document.querySelectorAll(".ads-box, #ads-container");
      adContainers.forEach(container => {
        container.style.display = "block";
        try {
          (adsbygoogle = window.adsbygoogle || []).push({});
        } catch (err) {
          console.warn("Annoncefejl:", err);
        }
      });
    }

    function acceptCookies() {
      localStorage.setItem("cookiesAccepted", "yes");
      if (cookieBanner) cookieBanner.style.display = "none";

      if (typeof gtag === "function") {
        gtag('consent', 'update', {
          'ad_storage': 'granted',
          'analytics_storage': 'granted'
        });
      }

      showAds();
    }

    function declineCookies() {
      localStorage.setItem("cookiesAccepted", "no");
      if (cookieBanner) cookieBanner.style.display = "none";

      if (typeof gtag === "function") {
        gtag('consent', 'update', {
          'ad_storage': 'denied',
          'analytics_storage': 'denied'
        });
      }

      showAds(); // Ikke-personlige annoncer
    }

    const consent = checkConsent();
    if (consent === "yes") {
      if (cookieBanner) cookieBanner.style.display = "none";
      acceptCookies();
    } else if (consent === "no") {
      if (cookieBanner) cookieBanner.style.display = "none";
      declineCookies();
    } else {
      if (cookieBanner) cookieBanner.style.display = "flex";
    }

    if (acceptBtn) acceptBtn.addEventListener("click", acceptCookies);
    if (afvisBtn) afvisBtn.addEventListener("click", declineCookies);
  } catch (err) {
    console.error("Fejl i JavaScript:", err);
  }
});


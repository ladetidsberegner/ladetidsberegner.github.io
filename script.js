document.addEventListener("DOMContentLoaded", function () {
  try {
    // --- Ladetidsberegner ---
    const form = document.querySelector(".beregn-form");
    const resultatEl = document.getElementById("resultat");

    if (!form) {
      console.error("Kunne ikke finde formularen .beregn-form");
      return;
    }
    if (!resultatEl) {
      console.error("Kunne ikke finde resultat elementet med id 'resultat'");
      return;
    }

    form.addEventListener("submit", function (e) {
      e.preventDefault();

      const socStart = parseFloat(document.getElementById("soc-start").value);
      const socSlut = parseFloat(document.getElementById("soc-slut").value);
      const kapacitet = parseFloat(document.getElementById("kapacitet").value);
      const ampere = parseFloat(document.getElementById("ampere").value);
      const volt = parseFloat(document.getElementById("volt").value);
      const faserEl = document.getElementById("faser");
      const ladetab = parseFloat(document.getElementById("ladetab").value);

      if (!faserEl) {
        console.error("Kunne ikke finde select #faser");
        resultatEl.textContent = "Fejl: Faser input ikke fundet.";
        return;
      }
      const faser = parseInt(faserEl.value, 10);

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
      if (isNaN(ampere) || ampere <= 0) {
        resultatEl.textContent = "Indtast en gyldig strømstyrke.";
        return;
      }
      if (isNaN(volt) || volt <= 0) {
        resultatEl.textContent = "Indtast en gyldig spænding.";
        return;
      }
      if (isNaN(faser) || (faser !== 1 && faser !== 3)) {
        resultatEl.textContent = "Antal faser skal være 1 eller 3.";
        return;
      }
      if (isNaN(ladetab) || ladetab < 0 || ladetab > 100) {
        resultatEl.textContent = "Ladetab skal være mellem 0 og 100%.";
        return;
      }

      // Beregning
      const procentDifferens = socSlut - socStart;
      const energibehovKWh = kapacitet * (procentDifferens / 100);
      const bruttoKWh = energibehovKWh * (1 + ladetab / 100);
      const effektKW = (ampere * volt * faser) / 1000;

      if (effektKW <= 0) {
        resultatEl.textContent = "Effekten kan ikke være nul.";
        return;
      }

      const tidITimer = bruttoKWh / effektKW;
      if (tidITimer <= 0) {
        resultatEl.textContent = "Ugyldig ladetid beregnet.";
        return;
      }

      // Format tid og visning
      const totalMinutter = Math.round(tidITimer * 60);
      let tekst = "Estimeret ladetid: ";

      if (totalMinutter <= 60) {
        tekst += `${totalMinutter} minutter`;
      } else {
        const dage = Math.floor(totalMinutter / (60 * 24));
        const timer = Math.floor((totalMinutter % (60 * 24)) / 60);
        const minutter = totalMinutter % 60;

        if (dage > 0) tekst += `${dage} dag${dage > 1 ? "e" : ""} `;
        if (timer > 0) tekst += `${timer} timer `;
        if (minutter > 0) tekst += `${minutter} minutter`;
      }

      tekst += `<br>Energiforbrug: ${bruttoKWh.toFixed(2)} kWh`;

      resultatEl.innerHTML = tekst;
    });

    // --- Cookie accept og reklamer ---
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

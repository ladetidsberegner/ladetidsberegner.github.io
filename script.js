document.addEventListener("DOMContentLoaded", function () {
  // --- Cookie-banner håndtering ---
  const cookieBanner = document.getElementById("cookie-banner");
  const acceptBtn = document.getElementById("accept-cookies");
  const afvisBtn = document.getElementById("afvis-cookies"); // hvis du har en afvis-knap

  // Tjek tidligere valg
  const consent = localStorage.getItem("cookiesAccepted");

  if (!consent) {
    cookieBanner.style.display = "flex"; // Vis banner hvis intet valg
  } else {
    cookieBanner.style.display = "none";
    handleConsent(consent === "yes");
  }

  // Klik på accept
  acceptBtn?.addEventListener("click", function () {
    localStorage.setItem("cookiesAccepted", "yes");
    cookieBanner.style.display = "none";
    handleConsent(true);
  });

  // Klik på afvis (hvis du har knap)
  afvisBtn?.addEventListener("click", function () {
    localStorage.setItem("cookiesAccepted", "no");
    cookieBanner.style.display = "none";
    handleConsent(false);
  });

  function handleConsent(isAccepted) {
    if (typeof gtag === "function") {
      gtag('consent', 'update', {
        'ad_storage': isAccepted ? 'granted' : 'denied',
        'analytics_storage': isAccepted ? 'granted' : 'denied'
      });
    }

    if (isAccepted) {
      // Trigger annonceindlæsning
      document.querySelectorAll(".adsbygoogle").forEach((ad) => {
        try {
          (adsbygoogle = window.adsbygoogle || []).push({});
        } catch (e) {
          console.warn("Annoncefejl:", e);
        }
      });
    }
  }

  // --- Toggle avancerede felter ---
  const toggleBtn = document.getElementById("toggle-advanced");
  const advancedFields = document.getElementById("advanced-fields");

  if (toggleBtn && advancedFields) {
    toggleBtn.addEventListener("click", function () {
      const shown = advancedFields.classList.toggle("show");
      advancedFields.setAttribute("aria-hidden", !shown);
      toggleBtn.textContent = shown
        ? "Skjul avancerede indstillinger"
        : "Vis avancerede indstillinger";
    });
  }

  // --- Beregning af ladetid ---
  const form = document.querySelector(".beregn-form");
  const resultatEl = document.getElementById("resultat");

  if (form && resultatEl) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();

      // Læs værdier, sæt default hvis tomt
      const socStart = parseFloat(document.getElementById("soc-start").value);
      const socSlut = parseFloat(document.getElementById("soc-slut").value);
      const kapacitet = parseFloat(document.getElementById("kapacitet").value);
      const ladetab = parseFloat(document.getElementById("ladetab").value);
      const ampere = parseFloat(document.getElementById("ampere").value) || 16;
      const volt = parseFloat(document.getElementById("volt").value) || 230;
      const faser = parseInt(document.getElementById("faser").value) || 3;

      // Validering
      if (isNaN(socStart) || isNaN(socSlut) || socStart < 0 || socStart >= socSlut || socSlut > 100) {
        resultatEl.textContent = "Start SoC skal være mindre end Slut SoC, begge mellem 0 og 100.";
        return;
      }
      if (isNaN(kapacitet) || kapacitet <= 0) {
        resultatEl.textContent = "Indtast en gyldig batteristørrelse.";
        return;
      }
      if (isNaN(ampere) || ampere <= 0 || isNaN(volt) || volt <= 0 || (faser !== 1 && faser !== 3)) {
        resultatEl.textContent = "Tjek de tekniske værdier (ampere, volt, faser).";
        return;
      }
      if (isNaN(ladetab) || ladetab < 0 || ladetab > 100) {
        resultatEl.textContent = "Ladetab skal være mellem 0 og 100%.";
        return;
      }

      // Beregning
      const andel = (socSlut - socStart) / 100;
      const energibehov = kapacitet * andel;
      const bruttoKWh = energibehov * (1 + ladetab / 100);
      const effektKW = (ampere * volt * faser) / 1000;

      if (effektKW <= 0) {
        resultatEl.textContent = "Effekten kan ikke være nul.";
        return;
      }

      const tidTimer = bruttoKWh / effektKW;
      const totalMinutter = Math.round(tidTimer * 60);

      let tekst = "Estimeret ladetid: ";

      if (totalMinutter < 60) {
        tekst += `${totalMinutter} minutter`;
      } else {
        const dage = Math.floor(totalMinutter / 1440);
        const timer = Math.floor((totalMinutter % 1440) / 60);
        const minutter = totalMinutter % 60;

        if (dage > 0) tekst += `${dage} dag${dage > 1 ? "e" : ""} `;
        if (timer > 0) tekst += `${timer} timer `;
        if (minutter > 0) tekst += `${minutter} minutter`;
      }

      tekst += `<br>Energiforbrug: ${bruttoKWh.toFixed(2)} kWh`;

      resultatEl.innerHTML = tekst;
    });
  }
});

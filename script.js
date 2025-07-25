// Ladetidsberegner
document.addEventListener("DOMContentLoaded", function () {
  const form = document.querySelector(".beregn-form");
  const resultatEl = document.getElementById("resultat");

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const socStart = parseFloat(document.getElementById("soc-start").value);
    const socSlut = parseFloat(document.getElementById("soc-slut").value);
    const kapacitet = parseFloat(document.getElementById("kapacitet").value);
    const ampere = parseFloat(document.getElementById("ampere").value);
    const volt = parseFloat(document.getElementById("volt").value);
    const faser = parseInt(document.getElementById("faser").value, 10);
    const ladetab = parseFloat(document.getElementById("ladetab").value);

    // Validering med feedback til bruger
    if (
      isNaN(socStart) || socStart < 0 || socStart > 100 ||
      isNaN(socSlut) || socSlut <= socStart || socSlut > 100
    ) {
      resultatEl.textContent = "Start- og slut SoC skal være tal mellem 0 og 100, og slut skal være højere end start.";
      return;
    }
    if (isNaN(kapacitet) || kapacitet <= 0) {
      resultatEl.textContent = "Indtast en gyldig batterikapacitet (større end 0).";
      return;
    }
    if (isNaN(ampere) || ampere <= 0) {
      resultatEl.textContent = "Indtast en gyldig strømstyrke (ampere, større end 0).";
      return;
    }
    if (isNaN(volt) || volt <= 0) {
      resultatEl.textContent = "Indtast en gyldig spænding (volt, større end 0).";
      return;
    }
    if (isNaN(faser) || (faser !== 1 && faser !== 3)) {
      resultatEl.textContent = "Vælg antal faser (1 eller 3).";
      return;
    }
    if (isNaN(ladetab) || ladetab < 0 || ladetab > 100) {
      resultatEl.textContent = "Indtast et gyldigt ladetab i procent (0-100).";
      return;
    }

    // Beregning
    const procentDifferens = socSlut - socStart;
    const energibehovKWh = kapacitet * (procentDifferens / 100);
    const bruttoKWh = energibehovKWh * (1 + ladetab / 100);
    const effektKW = (ampere * volt * faser) / 1000;

    if (effektKW <= 0) {
      resultatEl.textContent = "Ugyldig beregning: Effekt kan ikke være 0 eller negativ.";
      return;
    }

    const tidITimer = bruttoKWh / effektKW;
    if (tidITimer <= 0) {
      resultatEl.textContent = "Ugyldig ladetid beregnet.";
      return;
    }

    // Format tid (dage, timer, minutter)
    const totalMinutter = tidITimer * 60;
    const dage = Math.floor(totalMinutter / (60 * 24));
    const timer = Math.floor((totalMinutter % (60 * 24)) / 60);
    const minutter = Math.round(totalMinutter % 60);

    let resultatTekst = "Estimeret ladetid: ";
    if (dage > 0) resultatTekst += `${dage} dag${dage > 1 ? "e" : ""} `;
    if (timer > 0) resultatTekst += `${timer} timer `;
    if (minutter > 0) resultatTekst += `${minutter} minutter`;

    resultatEl.textContent = resultatTekst.trim();
  });
});

// Cookie-samtykke og dynamisk Google Analytics indlæsning
document.addEventListener('DOMContentLoaded', function () {
  const banner = document.getElementById('cookie-banner');
  const acceptBtn = document.getElementById('accept-cookies');

  function loadAnalytics() {
    if (window.analyticsLoaded) return; // undgå dobbeltindlæsning
    window.analyticsLoaded = true;

    // Erstat 'G-ELGNQRMN1X' med dit eget Google Analytics ID
    const GA_ID = 'G-ELGNQRMN1X';

    // Load gtag.js script
    const script1 = document.createElement('script');
    script1.async = true;
    script1.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
    document.head.appendChild(script1);

    // Init gtag
    const script2 = document.createElement('script');
    script2.innerHTML = `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', '${GA_ID}');
    `;
    document.head.appendChild(script2);
  }

  // Vis banner hvis ikke accepteret
  if (!localStorage.getItem('cookiesAccepted')) {
    banner.style.display = 'block';
  } else {
    loadAnalytics();
  }

  acceptBtn.addEventListener('click', function () {
    localStorage.setItem('cookiesAccepted', 'true');
    banner.style.display = 'none';
    loadAnalytics();
  });
});

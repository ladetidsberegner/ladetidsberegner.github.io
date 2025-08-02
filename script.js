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

    // Validering
    if (
      isNaN(socStart) || socStart < 0 || socStart > 100 ||
      isNaN(socSlut) || socSlut <= socStart || socSlut > 100
    ) {
      resultatEl.textContent = "Start- og slut SoC skal være mellem 0 og 100, og slut højere end start.";
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
});

document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("beregn-form");
  const resultatDiv = document.getElementById("resultat");

  // Load gemte værdier eller default
  document.getElementById("soc-start").value = localStorage.getItem("socStart") || 20;
  document.getElementById("soc-slut").value = localStorage.getItem("socSlut") || 80;
  document.getElementById("kapacitet").value = localStorage.getItem("kapacitet") || 57.5;
  document.getElementById("ladetab").value = localStorage.getItem("ladetab") || 12;
  document.getElementById("ladevalg").value = localStorage.getItem("ladevalg") || "11-3";

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const socStart = parseFloat(document.getElementById("soc-start").value);
    const socSlut = parseFloat(document.getElementById("soc-slut").value);
    const kapacitet = parseFloat(document.getElementById("kapacitet").value);
    const ladetab = parseFloat(document.getElementById("ladetab").value);
    let [effekt, faser] = document.getElementById("ladevalg").value.split("-");
    effekt = parseFloat(effekt);

    localStorage.setItem("socStart", socStart);
    localStorage.setItem("socSlut", socSlut);
    localStorage.setItem("kapacitet", kapacitet);
    localStorage.setItem("ladetab", ladetab);
    localStorage.setItem("ladevalg", document.getElementById("ladevalg").value);

    if (socSlut <= socStart) {
      resultatDiv.innerHTML = `<p style="color:red;">Slut SoC skal være større end start SoC.</p>`;
      return;
    }

    const procentAtLade = socSlut - socStart;
    const kWhAtLade = (kapacitet * (procentAtLade / 100)) * (1 + ladetab / 100);
    const tidTimer = kWhAtLade / effekt;

    let tidTekst = "";
    if (tidTimer < 1) {
      tidTekst = `${Math.round(tidTimer * 60)} minutter`;
    } else {
      const timer = Math.floor(tidTimer);
      const minutter = Math.round((tidTimer - timer) * 60);
      tidTekst = `${timer} timer${minutter > 0 ? ` og ${minutter} minutter` : ""}`;
    }

    resultatDiv.innerHTML = `
      <p>Du skal lade <strong>${kWhAtLade.toFixed(1)} kWh</strong>.</p>
      <p>Det vil tage cirka <strong>${tidTekst}</strong>.</p>
    `;
  });
});

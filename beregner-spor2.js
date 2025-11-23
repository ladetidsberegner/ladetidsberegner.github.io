document.addEventListener("DOMContentLoaded", function () {
  const socStartInput = document.getElementById("soc-start-2");
  const socSlutInput = document.getElementById("soc-slut-2");
  const tidValg = document.getElementById("beregn-tid-valg");
  const tidInput = document.getElementById("tidpunkt-input");
  const beregnBtn = document.getElementById("beregn-tid-btn");
  const resultatDiv = document.getElementById("resultat-tid");

  beregnBtn.addEventListener("click", function () {
    resultatDiv.innerHTML = "";

    const socStart = parseFloat(socStartInput.value);
    const socSlut = parseFloat(socSlutInput.value);
    const valg = tidValg.value;
    const tidStr = tidInput.value;

    if (!tidStr) {
      resultatDiv.textContent = "Indtast et klokkeslæt.";
      return;
    }

    if (
      isNaN(socStart) || isNaN(socSlut) ||
      socStart < 0 || socSlut > 100 || socStart >= socSlut
    ) {
      resultatDiv.textContent = "Indtast gyldige værdier for start og slut SoC (0–100, start < slut).";
      return;
    }

    // ——— BEREGNINGER ———
    const socDiff = socSlut - socStart;

    // Her kan du senere indsætte batterikapacitet & ladeeffekt fra brugerens felter
    const batteriKwh = 50;
    const ladeEffektKw = 11;
    const ladeTab = 0.05;

    const netto = (batteriKwh * socDiff) / 100;
    const brutto = netto * (1 + ladeTab);

    const tidTimerDecimal = brutto / ladeEffektKw;
    const tidTimer = Math.floor(tidTimerDecimal);
    const tidMinutter = Math.round((tidTimerDecimal - tidTimer) * 60);

    // Parse tid
    let [hour, minute] = tidStr.split(":").map(Number);

    const totalLadeMin = tidTimer * 60 + tidMinutter;

    let startH, startM, slutH, slutM;

    if (valg === "starter") {
      // Du har angivet START → vi beregner SLUT
      let totalMin = hour * 60 + minute + totalLadeMin;
      totalMin %= 1440;
      slutH = Math.floor(totalMin / 60);
      slutM = totalMin % 60;
    } else {
      // Du har angivet SLUT → vi beregner START
      let totalMin = hour * 60 + minute - totalLadeMin;
      if (totalMin < 0) totalMin += 1440;
      startH = Math.floor(totalMin / 60);
      startM = totalMin % 60;
    }

    const fmt = (v) => v.toString().padStart(2, "0");

// ——— OUTPUT ———
let html = "";

// Først: Starttid eller Sluttid
if (valg === "starter") {
  // bruger har tastet start → kun vis sluttid
  html += `<strong>Sluttid:</strong> ${fmt(slutH)}:${fmt(slutM)}<br>`;
} else {
  // bruger har tastet sluttid → kun vis starttid
  html += `<strong>Starttid:</strong> ${fmt(startH)}:${fmt(startM)}<br>`;
}

// Derefter: Ladetid
html += `<strong>Ladetid:</strong> ${tidTimer} timer ${tidMinutter} min<br>`;

// Til sidst: Bruttoforbrug
html += `<strong>Bruttoforbrug:</strong> ${brutto.toFixed(1)} kWh (inkl. tab)`;

resultatDiv.innerHTML = html;

  });
});

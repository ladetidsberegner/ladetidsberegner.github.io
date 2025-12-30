// beregner-spor4.js
(function () {
  "use strict";

  const LS_TYPE = "ladetab_type";       // "beregnet" | "tastet"
  const LS_VALUE = "ladetab_beregnet"; // number

  document.addEventListener("DOMContentLoaded", () => {
    const btn = document.getElementById("beregn-ladetab-btn");
    const resultatEl = document.getElementById("resultat-ladetab");

    const socStartEl = document.getElementById("ladetab-soc-start");
    const socSlutEl = document.getElementById("ladetab-soc-slut");
    const energiEl = document.getElementById("ladetab-energi");
    const kapacitetEl = document.getElementById("kapacitet");

    const ladetabInputEl = document.getElementById("ladetab");
    const radioBeregnet = document.getElementById("ladetab-beregnet");
    const radioTastet = document.getElementById("ladetab-tastet");
    const infoText = document.getElementById("beregnet-ladetab-info");

    function visFejl(msg) {
      resultatEl.innerHTML = `<span class="error-text">${msg}</span>`;
    }

    // ---------- RESTORE FRA localStorage ----------
    const savedType = localStorage.getItem(LS_TYPE);
    const savedValue = localStorage.getItem(LS_VALUE);

    if (savedValue && ladetabInputEl) {
      ladetabInputEl.value = savedValue;
      if (infoText) infoText.textContent = `(Beregnet: ${savedValue} %)`;
    }

    if (savedType === "tastet" && radioTastet) {
      radioTastet.checked = true;
    } else if (savedType === "beregnet" && radioBeregnet) {
      radioBeregnet.checked = true;
    }

    // ---------- RADIOBUTTONS ----------
    radioBeregnet?.addEventListener("change", () => {
      if (!radioBeregnet.checked) return;
      const v = localStorage.getItem(LS_VALUE);
      if (v && ladetabInputEl) ladetabInputEl.value = v;
      localStorage.setItem(LS_TYPE, "beregnet");
    });

    radioTastet?.addEventListener("change", () => {
      if (!radioTastet.checked) return;
      localStorage.setItem(LS_TYPE, "tastet");
    });

    ladetabInputEl?.addEventListener("input", () => {
      if (radioTastet?.checked) {
        localStorage.setItem(LS_TYPE, "tastet");
      }
    });

    // ---------- BEREGN LADETAB ----------
    btn?.addEventListener("click", () => {
      const socStart = parseFloat(socStartEl.value);
      const socSlut = parseFloat(socSlutEl.value);
      const energiFraLader = parseFloat(energiEl.value);
      const batteriKapacitet = parseFloat(kapacitetEl.value);

      if ([socStart, socSlut, energiFraLader].some(isNaN)) {
        visFejl("Udfyld venligst alle felter.");
        return;
      }
      if (isNaN(batteriKapacitet) || batteriKapacitet <= 0) {
        visFejl("Angiv batterikapacitet under Indstillinger.");
        return;
      }
      if (socSlut <= socStart) {
        visFejl("Slut SoC skal være højere end start SoC.");
        return;
      }
      if (energiFraLader <= 0) {
        visFejl("Energi fra lader skal være større end 0.");
        return;
      }

      const energiIBatteri =
        ((socSlut - socStart) / 100) * batteriKapacitet;
      const tabtEnergi = energiFraLader - energiIBatteri;

      if (tabtEnergi < 0) {
        visFejl("Beregningen giver et negativt ladetab.");
        return;
      }

      const procent = Math.round((tabtEnergi / energiFraLader) * 1000) / 10;

      resultatEl.innerHTML = `Dit beregnede ladetab er <strong>${procent} %</strong>.`;

      // skriv og gem
      if (ladetabInputEl) ladetabInputEl.value = procent;
      localStorage.setItem(LS_VALUE, procent);
      localStorage.setItem(LS_TYPE, "beregnet");

      if (radioBeregnet) {
        radioBeregnet.disabled = false;
        radioBeregnet.checked = true;
      }
      radioTastet && (radioTastet.checked = false);

      if (infoText) infoText.textContent = `(Beregnet: ${procent} %)`;
    });

    // ---------- SCROLL + ÅBN ----------
    const goBtn = document.getElementById("go-to-ladetab");
    goBtn?.addEventListener("click", e => {
      e.preventDefault();
      const sect = document.getElementById("calc-spor4");
      if (!sect) return;
      sect.scrollIntoView({ behavior: "smooth", block: "start" });
      setTimeout(() => {
        window.openCalcSection?.("calc-spor4");
      }, 120);
    });
  });
})();

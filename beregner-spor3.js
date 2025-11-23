// beregner-spor3.js — "Beregn SoC-stigning" (ens formatering + lokal fjernelse af hjælpetekst)

document.addEventListener("DOMContentLoaded", () => {
  const $ = (sel, root = document) => root.querySelector(sel);
  const btn = $("#beregn-soc-tid-btn");
  const out = $("#resultat-soc-tid");
  const modelSel = $("#soc-model");
  const sectionRoot = document.getElementById("calc-spor3"); // kun denne sektion

  const clamp = (v, min, max) => Math.max(min, Math.min(max, v));

  function parseTimeToMinutes(hhmm) {
    if (!hhmm || typeof hhmm !== "string") return NaN;
    const parts = hhmm.split(":");
    if (parts.length !== 2) return NaN;
    const h = parseInt(parts[0], 10);
    const m = parseInt(parts[1], 10);
    if (isNaN(h) || isNaN(m) || h < 0 || h > 23 || m < 0 || m > 59) return NaN;
    return h * 60 + m;
  }

  function formatHoursMinutes(hoursFloat) {
    const total = Math.round(hoursFloat * 60);
    const hh = Math.floor(total / 60);
    const mm = total % 60;
    return `${hh} timer og ${mm} minutter`;
  }

  function getAdv() {
    const kapInput = $("#kapacitet") || $("#batteri-kapacitet");
    const kap = parseFloat(kapInput?.value);
    const tab = parseFloat($("#ladetab")?.value);
    const effVal = $("#ladevalg")?.value || "";
    const eff = effVal ? parseFloat(effVal.split("-")[0]) : NaN;
    return { kap, tab, eff, kapInputId: kapInput ? kapInput.id : "kapacitet" };
  }

  function clearErrors() {
    [
      "spor3-soc-start",
      "varighed-timer",
      "varighed-minutter",
      "soc-starttid",
      "soc-sluttid",
      "kapacitet",
      "batteri-kapacitet",
      "ladetab",
      "ladevalg"
    ].forEach(id => document.getElementById(id)?.classList.remove("input-error"));
    out.textContent = "";
  }

  function syncModelUI() {
    const varDiv = sectionRoot?.querySelector(".soc-varighed");
    const tidDiv = sectionRoot?.querySelector(".soc-tidspunkter");
    if (!varDiv || !tidDiv) return;
    varDiv.style.display = "none";
    tidDiv.style.display = "none";
    ((modelSel?.value || "varighed") === "varighed" ? varDiv : tidDiv).style.display = "flex";
  }
  modelSel?.addEventListener("change", syncModelUI);
  syncModelUI();

  btn?.addEventListener("click", () => {
    clearErrors();

    const startSoC = parseFloat($("#spor3-soc-start")?.value);
    const model = modelSel?.value || "varighed";
    const { kap, tab, eff } = getAdv();

    // Fjern kun hjælpetekst i denne sektion
    const localHelp = sectionRoot?.querySelector(".calc-help.top");
    if (localHelp) localHelp.style.display = "none";

    try {
      if (isNaN(startSoC) || startSoC < 0 || startSoC > 100)
        throw new Error("Start SoC skal være mellem 0 og 100 %.");
      if (isNaN(kap) || kap <= 0)
        throw new Error("Ugyldig batterikapacitet (kWh).");
      if (isNaN(tab) || tab < 0)
        throw new Error("Ladetab skal være ≥ 0 %.");
      if (isNaN(eff) || eff <= 0)
        throw new Error("Vælg en gyldig ladeeffekt.");

      let durMinutes = 0;
      let showDurationTxt = "";

      if (model === "varighed") {
        const t = parseInt($("#varighed-timer")?.value || "0", 10) || 0;
        const m = parseInt($("#varighed-minutter")?.value || "0", 10) || 0;
        if (t < 0 || m < 0 || m > 59)
          throw new Error("Ugyldig varighed (timer/minutter).");
        durMinutes = t * 60 + m;
      } else {
        const sMin = parseTimeToMinutes($("#soc-starttid")?.value || "");
        const eMin = parseTimeToMinutes($("#soc-sluttid")?.value || "");
        if (isNaN(sMin) || isNaN(eMin))
          throw new Error("Ugyldigt start- eller sluttidspunkt.");
        durMinutes = eMin - sMin;
        if (durMinutes < 0) durMinutes += 24 * 60;
        showDurationTxt = `<p>Ladetid: <strong>${formatHoursMinutes(durMinutes / 60)}</strong></p>`;
      }

      if (durMinutes <= 0 || durMinutes > 24 * 60)
        throw new Error("Tidsrummet skal være mellem 1 minut og 24 timer.");

      const hours = durMinutes / 60;
      const bruttoDelivered = eff * hours;
      const netToBattery = bruttoDelivered * (1 - tab / 100);
      const socIncrease = (netToBattery / kap) * 100;
      const socPerHour = socIncrease / hours;
      const projectedSoC = clamp(startSoC + socIncrease, 0, 150);
      const varighedTxt = formatHoursMinutes(hours);

      let html = "";

      if (projectedSoC >= 100) {
        const netNeeded80 = ((80 - startSoC) / 100) * kap;
        const brutto80 = netNeeded80 / (1 - tab / 100);
        const tid80h = brutto80 / eff;
        const netNeeded100 = ((100 - startSoC) / 100) * kap;
        const brutto100 = netNeeded100 / (1 - tab / 100);
        const tid100h = brutto100 / eff;

        html = `
          <p>Med den valgte periode (${varighedTxt}) ender du over <strong>100 %</strong> SoC.</p>
          <p>Gennemsnitlig opladning pr. time: <strong>${socPerHour.toFixed(1)} %</strong></p>
          ${showDurationTxt}
          <p>Du kan nøjes med at lade i <strong>${formatHoursMinutes(tid80h)}</strong> for at nå <strong>80 %</strong>.</p>
          <p>Du kan nøjes med at lade i <strong>${formatHoursMinutes(tid100h)}</strong> for at nå <strong>100 %</strong>.</p>
          <p>Energi for at nå 80 % (brutto): <strong>${brutto80.toFixed(2)} kWh</strong></p>
          <p>Energi for at nå 100 % (brutto): <strong>${brutto100.toFixed(2)} kWh</strong></p>
        `;
      } else if (projectedSoC > 80 && projectedSoC < 100) {
        const netNeeded80 = ((80 - startSoC) / 100) * kap;
        const brutto80 = netNeeded80 / (1 - tab / 100);
        const tid80h = brutto80 / eff;

        html = `
          <p>Efter den valgte periode (${varighedTxt}) ender du på ca. <strong>${projectedSoC.toFixed(1)} %</strong>.</p>
          <p>Gennemsnitlig opladning pr. time: <strong>${socPerHour.toFixed(1)} %</strong></p>
          ${showDurationTxt}
          <p>Du kan nøjes med at lade i <strong>${formatHoursMinutes(tid80h)}</strong> for at nå <strong>80 %</strong>.</p>
          <p>Energi leveret (brutto): <strong>${bruttoDelivered.toFixed(2)} kWh</strong></p>
        `;
      } else {
        html = `
          <p>Forventet stigning i SoC: <strong>${socIncrease.toFixed(1)} %</strong> (til ca. <strong>${projectedSoC.toFixed(1)} %</strong>).</p>
          <p>Gennemsnitlig opladning pr. time: <strong>${socPerHour.toFixed(1)} %</strong></p>
          ${showDurationTxt}
          <p>Energi leveret (brutto): <strong>${bruttoDelivered.toFixed(2)} kWh</strong></p>
        `;
      }

      out.innerHTML = html;
    } catch (e) {
      out.textContent = `Fejl: ${e.message || e}`;
    }
  });
});

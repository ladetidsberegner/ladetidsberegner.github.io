(function() {
  function readNum(id) {
    const el = document.getElementById(id);
    if (!el) return NaN;
    return parseNum(el.value);
  }

  function calcEnergiOgTid(start, slut, kap, tab, amp, faser) {
    const ladeeffektKw = (amp * faser * 230) / 1000;
    const netto = beregnNettoKwh(kap, start, slut);
    const brutto = beregnBruttoKwh(netto, tab);
    const tidTimer = beregnLadetidTimer(brutto, ladeeffektKw);
    return { brutto, tidTimer };
  }

  function addHoursToClock(clockStr, hours) {
    if (!clockStr || !clockStr.includes(":")) return null;
    const [h, m] = clockStr.split(":").map(Number);
    if (isNaN(h) || isNaN(m)) return null;

    const totalMin = h * 60 + m + Math.round(hours * 60);
    const final = ((totalMin % 1440) + 1440) % 1440;

    const hh = String(Math.floor(final / 60)).padStart(2, "0");
    const mm = String(final % 60).padStart(2, "0");
    return `${hh}:${mm}`;
  }

  document.getElementById("beregn-tid-btn")?.addEventListener("click", () => {
    const out = document.getElementById("resultat-tid");
    out.innerHTML = "";

    const start = readNum("soc-start-2");
    const slut = readNum("soc-slut-2");
    const mode = document.getElementById("beregn-tid-valg")?.value;
    const klok = document.getElementById("tidpunkt-input")?.value;

    const kap = readNum("kapacitet");
    const ladetab = readNum("ladetab");
    const amp = readNum("ampere");
    const faser = readNum("faser");

    // Validering
    if (!klok) { out.textContent = "Indtast et tidspunkt."; return; }
    if (isNaN(start) || isNaN(slut) || start >= slut) { out.textContent = "Indtast gyldige start- og slut-SOC."; return; }
    if (isNaN(kap) || kap <= 0) { out.textContent = "Indtast en gyldig batterikapacitet."; return; }
    if (isNaN(ladetab) || ladetab < 0) { out.textContent = "Indtast et gyldigt ladetab."; return; }
    if (isNaN(amp) || amp <= 0) { out.textContent = "Indtast en gyldig strømstyrke (A)."; return; }
    if (isNaN(faser) || faser <= 0) { out.textContent = "Indtast et gyldigt antal faser."; return; }

    const { tidTimer } = calcEnergiOgTid(start, slut, kap, ladetab, amp, faser);

    let resultTid;
    if (mode === "skal-vaere-faerdig") {
      resultTid = addHoursToClock(klok, -tidTimer);
      out.innerHTML = `<p><strong>Start:</strong> ${resultTid}</p>`;
    } else {
      resultTid = addHoursToClock(klok, tidTimer);
      out.innerHTML = `<p><strong>Slut:</strong> ${resultTid}</p>`;
    }
  });
})();

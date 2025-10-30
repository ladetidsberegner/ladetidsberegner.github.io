// beregner-soc.js — KUN beregning (ingen accordion/toggle her)
(function () {
  const $ = (s, r = document) => r.querySelector(s);
  const ce = (t) => document.createElement(t);

  function readNumById(id) {
    const el = document.getElementById(id);
    if (!el) return NaN;
    if ("valueAsNumber" in el) {
      const n = el.valueAsNumber;
      if (Number.isFinite(n)) return n;
    }
    let v = (el.value ?? "").toString().trim().replace(/\s+/g, "").replace(",", ".");
    if (v === "") return NaN;
    const n = parseFloat(v);
    return Number.isFinite(n) ? n : NaN;
  }
  function toNumber(v) {
    if (v === null || v === undefined || v === "") return NaN;
    const n = typeof v === "number" ? v : parseFloat(String(v).replace(",", "."));
    return Number.isFinite(n) ? n : NaN;
  }
  function formatHoursMinutes(h) {
    const m = Math.round(h * 60), H = Math.floor(m / 60), M = m % 60;
    return `${H} t ${String(M).padStart(2, "0")} min`;
  }
  function validateInputs(start, slut, kap, tab, eff) {
    if (isNaN(start) || start < 0 || start > 100) throw new Error("Start SoC skal være mellem 0 og 100 %.");
    if (isNaN(slut) || slut < 0 || slut > 100) throw new Error("Slut SoC skal være mellem 0 og 100 %.");
    if (slut < start) throw new Error("Slut SoC skal være større end eller lig Start SoC.");
    if (isNaN(kap) || kap <= 0) throw new Error("Ugyldig batterikapacitet (kWh).");
    if (isNaN(tab) || tab < 0) throw new Error("Ladetab skal være ≥ 0 %.");
    if (isNaN(eff) || eff <= 0) throw new Error("Vælg en gyldig ladeeffekt.");
  }
  function calcEnergiOgTid(start, slut, kap, tab, eff) {
    const socDiff = slut - start;
    const net = (kap * socDiff) / 100;
    const loss = 1 - tab / 100;
    const brutto = loss > 0 ? net / loss : net;
    const tidTimer = brutto / eff;
    return { bruttoEnergi: brutto, tidTimer };
  }
  function ensureOut(id, afterEl) {
    let out = document.getElementById(id);
    if (!out) {
      out = ce("div");
      out.id = id;
      out.className = "resultat-output";
      afterEl?.insertAdjacentElement("afterend", out);
    }
    return out;
  }
  function clearErrors(ids) {
    ids.forEach((id) => document.getElementById(id)?.classList.remove("input-error"));
  }

  document.addEventListener("click", (e) => {
    const t = e.target;
    if (!(t instanceof HTMLElement) || t.id !== "beregn-soc-btn") return;

    const out = ensureOut("resultat-soc", t);
    clearErrors(["soc-start", "soc-slut", "kapacitet", "ladetab", "ladevalg"]);
    out.textContent = "";

    const start = readNumById("soc-start");
    const slut  = readNumById("soc-slut");
    const kap   = readNumById("kapacitet");
    const tab   = readNumById("ladetab");
    const effVal = $("#ladevalg")?.value || "";
    const eff   = effVal ? toNumber(effVal.split("-")[0]) : NaN;

    try {
      validateInputs(start, slut, kap, tab, eff);
      const { bruttoEnergi, tidTimer } = calcEnergiOgTid(start, slut, kap, tab, eff);
      out.innerHTML = `
        <p><strong>Varighed (brutto):</strong> ${formatHoursMinutes(tidTimer)}</p>
        <p><strong>Energi leveret (brutto):</strong> ${bruttoEnergi.toFixed(2)} kWh</p>
      `;
    } catch (err) {
      out.textContent = `Fejl: ${err.message || err}`;
      if (isNaN(start) || start < 0 || start > 100) $("#soc-start")?.classList.add("input-error");
      if (isNaN(slut)  || slut  < 0 || slut  > 100 || (!isNaN(start) && slut < start)) $("#soc-slut")?.classList.add("input-error");
      if (isNaN(kap)   || kap   <= 0) $("#kapacitet")?.classList.add("input-error");
      if (isNaN(tab)   || tab   <  0) $("#ladetab")?.classList.add("input-error");
      if (isNaN(eff)   || eff   <= 0) $("#ladevalg")?.classList.add("input-error");
    }
  });
})();

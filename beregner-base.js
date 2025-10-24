// beregner-base.js — fælles logik for alle beregnere
// Skal ligge i roden og indlæses før beregner-soc.js, beregner-spor2.js og beregner-spor3.js

window.ladeUtils = {
  // Konverter tekst til tal
  toNumber(v) {
    const n = parseFloat(v);
    return isNaN(n) ? 0 : n;
  },

  // Basisvalidering for felter
  validateCoreInputs(start, slut, kap, tab, eff) {
    if (isNaN(start) || start < 0 || start > 100)
      throw new Error("Start SoC skal være mellem 0 og 100 %.");
    if (isNaN(slut) || slut < 0 || slut > 100 || slut <= start)
      throw new Error("Slut SoC skal være større end start og mellem 0–100 %.");
    if (isNaN(kap) || kap <= 0)
      throw new Error("Ugyldig batterikapacitet. Indtast bilens netto-batterikapacitet i kWh.");
    if (isNaN(tab) || tab < 0)
      throw new Error("Ladetab skal være 0 eller derover.");
    if (isNaN(eff) || eff <= 0)
      throw new Error("Ugyldig ladeeffekt. Vælg fx 11 eller 22 kW.");
  },

  // Beregning af energi og tid
  calcEnergiOgTid(start, slut, kap, tab, eff) {
    const netto = ((slut - start) / 100) * kap;
    const brutto = netto / (1 - tab / 100);
    const tid = brutto / eff;
    return { bruttoEnergi: brutto, tidTimer: tid };
  },

  // Tid -> minutter
  parseTimeToMinutes(tid) {
    if (!tid || !tid.includes(":")) return NaN;
    const [h, m] = tid.split(":").map(Number);
    if (isNaN(h) || isNaN(m) || h < 0 || h > 23 || m < 0 || m > 59) return NaN;
    return h * 60 + m;
  },

  // Minutter -> klokkeslæt
  minutesToHHMM(mins) {
    mins = ((mins % (24 * 60)) + (24 * 60)) % (24 * 60);
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
  },

  // Timer -> format “X t Y min”
  formatHoursMinutes(tidTimer) {
    const t = Math.floor(tidTimer);
    const m = Math.round((tidTimer - t) * 60);
    return `${t} t ${m} min`;
  }
};

console.debug("[beregner-base] initialiseret korrekt");

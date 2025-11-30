//
// FÆLLES FUNKTIONER
//

// Netto kWh
function calcNetto(kap, start, slut) {
  return kap * ((slut - start) / 100);
}

// Brutto kWh
function calcBrutto(netto, tab) {
  return netto / (1 - tab / 100);
}

// Timer -> t + min
function decToHM(t) {
  const h = Math.floor(t);
  const m = Math.round((t - h) * 60);
  return { h, m };
}

// Hent ladeeffekt fra dropdown "ladevalg"
function hentLadeeffekt() {
  const v = document.getElementById("ladevalg").value;  // fx "11-3"
  if (!v || !v.includes("-")) return { kw: NaN, faser: NaN };

  const [kwStr, faseStr] = v.split("-");
  return {
    kw: Number(kwStr.replace(",", ".")),
    faser: Number(faseStr)
  };
}

//
// SPOR 1 – Beregn kWh & ladetid
//

document.getElementById("beregn-soc-btn").addEventListener("click", function () {
  
  const kap = Number(document.getElementById("kapacitet").value.replace(",", "."));
  const start = Number(document.getElementById("soc-start").value);
  const slut  = Number(document.getElementById("soc-slut").value);
  const tab   = Number(document.getElementById("ladetab").value.replace(",", "."));
  const res   = document.getElementById("resultat-soc");

  const { kw } = hentLadeeffekt();       // ← korrekt ladeeffekt
  const effekt = kw;

  res.innerHTML = "";

  if (!kap || kap <= 0) {
    res.textContent = "Indtast en gyldig batterikapacitet.";
    return;
  }
  if (isNaN(effekt) || effekt <= 0) {
    res.textContent = "Vælg en gyldig ladeeffekt.";
    return;
  }
  if (start >= slut) {
    res.textContent = "Slut-SOC skal være højere end start-SOC.";
    return;
  }

  const netto = calcNetto(kap, start, slut);
  const brutto = calcBrutto(netto, tab);
  const tid = brutto / effekt;
  const { h, m } = decToHM(tid);

  res.innerHTML = `
    <p><strong>Energiforbrug:</strong> ${brutto.toFixed(2)} kWh</p>
    <p><strong>Ladetid:</strong> ${h}t ${m}m</p>
  `;
});


//
// SPOR 2 – Beregn start/sluttidspunkt
//
//
// SPOR 2 – Beregn start/sluttidspunkt + ladetid + brutto kWh
//

document.getElementById("beregn-tid-btn").addEventListener("click", function () {

  const start = Number(document.getElementById("soc-start-2").value);
  const slut  = Number(document.getElementById("soc-slut-2").value);
  const kap   = Number(document.getElementById("kapacitet").value.replace(",", "."));
  const tab   = Number(document.getElementById("ladetab").value.replace(",", "."));
  const mode  = document.getElementById("beregn-tid-valg").value;
  const klok  = document.getElementById("tidpunkt-input").value;
  const out   = document.getElementById("resultat-tid");

  const { kw } = hentLadeeffekt();
  const effekt = kw;

  out.innerHTML = "";

  // Validering
  if (!klok) {
    out.textContent = "Indtast et tidspunkt.";
    return;
  }
  if (!kap || kap <= 0) {
    out.textContent = "Indtast en gyldig batterikapacitet.";
    return;
  }
  if (isNaN(effekt) || effekt <= 0) {
    out.textContent = "Vælg en gyldig ladeeffekt.";
    return;
  }
  if (start >= slut) {
    out.textContent = "Slut-SOC skal være højere end start-SOC.";
    return;
  }

  // Beregninger (samme som spor 1)
  const netto = calcNetto(kap, start, slut);
  const brutto = calcBrutto(netto, tab);
  const tidTimer = brutto / effekt;
  const { h, m } = decToHM(tidTimer);

  // Konverter ladetid til minutter
  const ladeMin = Math.round(tidTimer * 60);

  // Læs tidspunkt
  const [hh, mm] = klok.split(":").map(Number);
  let total = hh * 60 + mm;

  // Beregning:
  if (mode === "skal-vaere-faerdig") {
    total -= ladeMin;
  } else {
    total += ladeMin;
  }

  // Wrap rundt om midnat
  total = ((total % 1440) + 1440) % 1440;

  const H = String(Math.floor(total / 60)).padStart(2, "0");
  const M = String(total % 60).padStart(2, "0");

  //
  // ✔ Udskriv resultat + ladetid + brutto kWh
  //
  if (mode === "skal-vaere-faerdig") {
    out.innerHTML = `
      <p><strong>Start:</strong> ${H}:${M}</p>
      <p><strong>Ladetid:</strong> ${h}t ${m}m</p>
      <p><strong>Brutto energiforbrug:</strong> ${brutto.toFixed(2)} kWh</p>
    `;
  } else {
    out.innerHTML = `
      <p><strong>Slut:</strong> ${H}:${M}</p>
      <p><strong>Ladetid:</strong> ${h}t ${m}m</p>
      <p><strong>Brutto energiforbrug:</strong> ${brutto.toFixed(2)} kWh</p>
    `;
  }
});

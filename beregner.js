document.addEventListener("DOMContentLoaded", () => {
  const $ = id => document.getElementById(id);

  const form = $("beregn-form");
  const resultat = $("resultat");

  // Grundfelter
  const socStartEl = $("soc-start");
  const socSlutEl  = $("soc-slut");
  const kapEl       = $("kapacitet");
  const ladetabEl   = $("ladetab");
  const ladevalgEl  = $("ladevalg");

  // Spor 2 & 3
  const faqSections = Array.from(document.querySelectorAll(".faq-section")).filter(s => s.id !== "advanced-fields");
  const spor2Section = faqSections[0];
  const spor3Section = faqSections[1];

  // Avancerede felter
  const advSection = $("advanced-fields");
  const advAnswer = advSection.querySelector(".faq-answer");
  advAnswer.style.display = "block"; // default åben
  advSection.querySelector(".faq-question").addEventListener("click", () => {
    advAnswer.style.display = advAnswer.style.display === "block" ? "none" : "block";
  });

  // Skjul spor2 & spor3 som default
  [spor2Section, spor3Section].forEach(s => s.querySelector(".faq-answer").style.display = "none");

  // Kun ét spor åbent ad gangen
  faqSections.forEach(section => {
    const q = section.querySelector(".faq-question");
    const a = section.querySelector(".faq-answer");
    q.addEventListener("click", () => {
      faqSections.forEach(s => {
        if (s !== section) s.querySelector(".faq-answer").style.display = "none";
      });
      a.style.display = a.style.display === "block" ? "none" : "block";
    });
  });

  // Spor 3: varighed/tidspunkter toggle
  const socModelEl = $("soc-model");
  const varDiv = document.querySelector(".soc-varighed");
  const tidDiv = document.querySelector(".soc-tidspunkter");
  function updateSocModel() {
    if (socModelEl.value === "varighed") { varDiv.style.display="flex"; tidDiv.style.display="none"; }
    else { varDiv.style.display="none"; tidDiv.style.display="flex"; }
  }
  updateSocModel();
  socModelEl.addEventListener("change", updateSocModel);

  // Utility functions
  function parseTimeToMinutes(t) {
    if (!t) return NaN;
    const [hh, mm] = t.split(":").map(Number);
    return (isNaN(hh)||isNaN(mm)) ? NaN : hh*60 + mm;
  }
  function minutesToHHMM(mins) {
    mins = (mins + 24*60) % (24*60);
    const hh = Math.floor(mins/60).toString().padStart(2,"0");
    const mm = (mins%60).toString().padStart(2,"0");
    return `${hh}:${mm}`;
  }
  function formatHoursMinutes(hoursFloat) {
    const totalMin = Math.round(hoursFloat*60);
    return { hours: Math.floor(totalMin/60), minutes: totalMin%60, text:`${Math.floor(totalMin/60)} timer og ${totalMin%60} minutter` };
  }

  // Beregn
  form.addEventListener("submit", (ev) => {
    ev.preventDefault();
    computeAndShow();
  });

  function computeAndShow() {
    resultat.innerHTML = "";

    const startSoC = parseFloat(socStartEl.value);
    const slutSoC  = parseFloat(socSlutEl.value);
    const batteri  = parseFloat(kapEl.value);
    const ladetab  = parseFloat(ladetabEl.value);
    const ladevalg = ladevalgEl.value;
    const effekt = ladevalg ? parseFloat(ladevalg.split("-")[0]) : 0;

    // Validation
    if ([startSoC, slutSoC, batteri, ladetab, effekt].some(v => isNaN(v))) {
      resultat.innerHTML = `<p style="color:#c00">Indtast gyldige værdier.</p>`; return;
    }
    if (slutSoC < startSoC) {
      resultat.innerHTML = `<p style="color:#c00">Slut-SoC skal være ≥ start-SoC.</p>`; return;
    }

    const socDiff = slutSoC - startSoC;
    const energiNetto = batteri * socDiff/100;
    const lossFactor = 1 - ladetab/100;
    const energiBrutto = lossFactor>0 ? energiNetto/lossFactor : energiNetto;
    const tidTimer = energiBrutto/effekt;
    const tidFmt = formatHoursMinutes(tidTimer);

    // Tjek hvilket spor åbent
    const spor2Open = spor2Section.querySelector(".faq-answer").style.display==="block";
    const spor3Open = spor3Section.querySelector(".faq-answer").style.display==="block";

    function bruttoOutput(hours, bruttoKWh, extra="") {
      const fm = formatHoursMinutes(hours);
      return `<p><strong>Tid (brutto):</strong> ${fm.text}</p>
              <p><strong>Energi leveret af laderen (brutto):</strong> ${bruttoKWh.toFixed(2)} kWh</p>
              ${extra?`<p>${extra}</p>`:""}`;
    }

    let outHtml="";

    if (spor2Open) {
      const mode = $("beregn-tid-valg").value;
      const inputMin = parseTimeToMinutes($("tidpunkt-input").value);
      if (isNaN(inputMin)) { resultat.innerHTML=`<p style="color:#c00">Indtast tidspunkt (hh:mm).</p>`; return; }
      let computedMin = mode==="sluttid" ? inputMin+Math.round(tidTimer*60) : inputMin-Math.round(tidTimer*60);
      const hhmm = minutesToHHMM(computedMin);
      outHtml = `<h3>Resultat (Spor 2)</h3>
                 <p><strong>${mode==="sluttid"?"Forventet sluttidspunkt":"Nødvendigt starttidspunkt"}:</strong> ${hhmm}</p>
                 ${bruttoOutput(tidTimer, energiBrutto, `Varighed ≈ ${tidFmt.text}`)}`;
      resultat.innerHTML = outHtml; return;
    }

    if (spor3Open) {
      const model = socModelEl.value;
      let durMinutes = 0;
      if (model==="varighed") {
        const t = parseInt($("varighed-timer").value)||0;
        const m = parseInt($("varighed-minutter").value)||0;
        durMinutes = t*60 + m;
      } else {
        const smin = parseTimeToMinutes($("soc-starttid").value);
        const emin = parseTimeToMinutes($("soc-sluttid").value);
        if (isNaN(smin)||isNaN(emin)) { resultat.innerHTML=`<p style="color:#c00">Indtast start- og sluttidspunkt.</p>`; return; }
        durMinutes = emin - smin;
        if (durMinutes<0) durMinutes+=24*60;
      }
      if (durMinutes<=0 || durMinutes>24*60) { resultat.innerHTML=`<p style="color:#c00">Tidsrummet skal være mellem 1 minut og 24 timer.</p>`; return; }

      const hoursGiven = durMinutes/60;
      const bruttoDelivered = effekt*hoursGiven;
      const netToBattery = bruttoDelivered*(1-ladetab/100);
      const socIncrease = (netToBattery/batteri)*100;
      const projectedSoC = startSoC + socIncrease;

      if (projectedSoC>100) {
        const neededNet = (100-startSoC)/100*batteri;
        const bruttoNeeded = lossFactor>0 ? neededNet/lossFactor : neededNet;
        const hoursNeeded = bruttoNeeded/effekt;
        outHtml = `<h3>Resultat (Spor 3)</h3>
                   <p>SoC ville overstige 100 %. Vi viser tiden til 100%.</p>
                   ${bruttoOutput(hoursNeeded, bruttoNeeded, `Dette giver præcis 100% SoC.`)}`;
        resultat.innerHTML = outHtml; return;
      } else {
        outHtml = `<h3>Resultat (Spor 3)</h3>
                   <p>Forventet stigning i SoC: <strong>${socIncrease.toFixed(1)}%</strong> (til ~${projectedSoC.toFixed(1)}%).</p>
                   ${bruttoOutput(hoursGiven, bruttoDelivered, `Varighed: ${Math.floor(durMinutes/60)}h ${durMinutes%60}m`)}`;
        resultat.innerHTML = outHtml; return;
      }
    }

    // Standard Spor 1
    outHtml = `<h3>Resultat (Spor 1)</h3>${bruttoOutput(tidTimer, energiBrutto, `Varighed ≈ ${tidFmt.text}`)}`;
    resultat.innerHTML = outHtml;
  }

});

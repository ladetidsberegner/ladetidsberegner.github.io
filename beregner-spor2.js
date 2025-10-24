// beregner-spor2.js — “Beregn start- eller sluttidspunkt”
(function () {
  const $ = (s, r = document) => r.querySelector(s);
  const ce = (t) => document.createElement(t);

  function readNumById(id){
    const el=document.getElementById(id);
    if(!el) return NaN;
    if("valueAsNumber" in el){
      const n=el.valueAsNumber; if(Number.isFinite(n)) return n;
    }
    let v=(el.value??"").toString().trim().replace(/\s+/g,"").replace(",",".");
    if(v==="") return NaN;
    const n=parseFloat(v);
    return Number.isFinite(n)?n:NaN;
  }
  function toNumber(v){ if(v===null||v===undefined||v==="")return NaN; const n=typeof v==="number"?v:parseFloat(String(v).replace(",", ".")); return Number.isFinite(n)?n:NaN; }
  function parseTimeToMinutes(t){ if(!t||typeof t!=="string")return NaN; const p=t.split(":"); if(p.length<2)return NaN; const hh=parseInt(p[0],10), mm=parseInt(p[1],10); if(isNaN(hh)||isNaN(mm)||hh<0||hh>23||mm<0||mm>59)return NaN; return hh*60+mm; }
  function minutesToHHMM(mins){ mins=Math.round(mins)%(1440); if(mins<0) mins+=1440; const hh=String(Math.floor(mins/60)).padStart(2,"0"); const mm=String(mins%60).padStart(2,"0"); return `${hh}:${mm}`; }
  function formatHoursMinutes(h){ const m=Math.round(h*60), H=Math.floor(m/60), M=m%60; return `${H} t ${String(M).padStart(2,"0")} min`; }
  function validateInputs(start,slut,kap,tab,eff){
    if(isNaN(start)||start<0||start>100) throw new Error("Start SoC skal være mellem 0 og 100 %.");
    if(isNaN(slut)||slut<0||slut>100)   throw new Error("Slut SoC skal være mellem 0 og 100 %.");
    if(slut<start) throw new Error("Slut SoC skal være større end eller lig Start SoC.");
    if(isNaN(kap)||kap<=0) throw new Error("Ugyldig batterikapacitet (kWh).");
    if(isNaN(tab)||tab<0)  throw new Error("Ladetab skal være ≥ 0 %.");
    if(isNaN(eff)||eff<=0) throw new Error("Vælg en gyldig ladeeffekt.");
  }
  function calcEnergiOgTid(start,slut,kap,tab,eff){
    const socDiff=slut-start, net=(kap*socDiff)/100, loss=1-tab/100;
    const brutto=loss>0?net/loss:net, tid=brutto/eff;
    return { bruttoEnergi: brutto, tidTimer: tid };
  }
  function ensureOut(id, afterEl){ let o=document.getElementById(id); if(!o){ o=ce("div"); o.id=id; o.className="resultat-output"; afterEl?.insertAdjacentElement("afterend", o); } return o; }
  function clearErrors(ids){ ids.forEach(id=>document.getElementById(id)?.classList.remove("input-error")); }

  document.addEventListener("click",(e)=>{
    const t=e.target;
    if(!(t instanceof HTMLElement) || t.id!=="beregn-tid-btn") return;

    const outInline = document.getElementById("linje-resultat");
    const outBlock  = ensureOut("resultat-tid", t);

    clearErrors(["soc-start-2","soc-slut-2","tidpunkt-input","kapacitet","ladetab","ladevalg"]);
    if(outInline) outInline.textContent=""; outBlock.textContent="";

    const start2 = readNumById("soc-start-2");
    const slut2  = readNumById("soc-slut-2");
    const mode   = $("#beregn-tid-valg")?.value || "skal-vaere-faerdig";
    const tidStr = $("#tidpunkt-input")?.value || "";
    const kap    = readNumById("kapacitet");
    const tab    = readNumById("ladetab");
    const effVal = $("#ladevalg")?.value || "";
    const eff    = effVal ? toNumber(effVal.split("-")[0]) : NaN;

    try{
      validateInputs(start2,slut2,kap,tab,eff);
      if(!tidStr){ $("#tidpunkt-input")?.classList.add("input-error"); throw new Error("Indtast et gyldigt klokkeslæt (hh:mm)."); }
      const inputMin = parseTimeToMinutes(tidStr);
      if(isNaN(inputMin)){ $("#tidpunkt-input")?.classList.add("input-error"); throw new Error("Ugyldigt klokkeslæt."); }

      const { bruttoEnergi, tidTimer } = calcEnergiOgTid(start2,slut2,kap,tab,eff);
      const durMin = Math.round(tidTimer*60);

      let label;
      if(mode==="skal-vaere-faerdig"){
        label = `skal du starte kl <strong>${minutesToHHMM(inputMin - durMin)}</strong>`;
      }else{
        label = `vil den være færdig kl <strong>${minutesToHHMM(inputMin + durMin)}</strong>`;
      }
      if(outInline) outInline.innerHTML = `&nbsp;${label}.`;

      outBlock.innerHTML = `
        <p><strong>Varighed (brutto):</strong> ${formatHoursMinutes(tidTimer)}</p>
        <p><strong>Energi leveret (brutto):</strong> ${bruttoEnergi.toFixed(2)} kWh</p>
      `;
    }catch(err){
      outBlock.textContent = `Fejl: ${err.message||err}`;
      if(isNaN(start2)||start2<0||start2>100) $("#soc-start-2")?.classList.add("input-error");
      if(isNaN(slut2)||slut2<0||slut2>100||(!isNaN(start2)&&slut2<start2)) $("#soc-slut-2")?.classList.add("input-error");
      if(!tidStr) $("#tidpunkt-input")?.classList.add("input-error");
      if(isNaN(kap)||kap<=0) $("#kapacitet")?.classList.add("input-error");
      if(isNaN(tab)||tab<0)  $("#ladetab")?.classList.add("input-error");
      if(isNaN(eff)||eff<=0) $("#ladevalg")?.classList.add("input-error");
    }
  });
})();

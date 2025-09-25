// beregner.js (ren, samlet og tilpasset din HTML)

document.addEventListener("DOMContentLoaded", () => {
  // Form + result element IDs som i din HTML
  const form = document.getElementById("beregn-form");
  const resultEl = document.getElementById("resultat");

  // Bookmark UI IDs fra din HTML
  const prompt = document.getElementById("bookmark-prompt");       // <div id="bookmark-prompt">...
  const closeBtn = document.getElementById("bookmark-close");      // close-knap i prompt
  const actionBtn = document.getElementById("bookmark-action");    // "Ja, tilføj som bogmærke"
  const triggerIcon = document.getElementById("bookmark-trigger"); // lille ikon til at åbne prompt igen

  // LocalStorage keys
  const ATTEMPTS_KEY = "bookmark_attempts";
  const ADDED_KEY = "bookmark_added";

  // sikkerheds-check: elementer
  if (!form) {
    console.warn("beregner.js: Formular med id 'beregn-form' ikke fundet. Script stoppes.");
    return;
  }
  if (!resultEl) {
    console.warn("beregner.js: Resultat-element med id 'resultat' ikke fundet.");
  }

  // Helper: tjek om siden er i standalone (brugeren har tilføjet til homescreen/PWA)
  function isStandaloneMode() {
    return (window.matchMedia && window.matchMedia("(display-mode: standalone)").matches)
      || window.navigator.standalone === true;
  }

  // Helper: tjek om brugeren allerede har markeret at de har gemt/tilføjet siden
  function hasBookmarked() {
    if (localStorage.getItem(ADDED_KEY) === "true") return true;
    if (isStandaloneMode()) {
      // hvis standalone: marker som gemt, så vi ikke spørger mere
      try { localStorage.setItem(ADDED_KEY, "true"); } catch (e) {}
      return true;
    }
    return false;
  }

  // Load attempts (antal gange vi har vist prompt)
  let attempts = parseInt(localStorage.getItem(ATTEMPTS_KEY) || "0", 10);
  if (isNaN(attempts)) attempts = 0;

  function saveAttempts() {
    try { localStorage.setItem(ATTEMPTS_KEY, String(attempts)); } catch (e) {}
  }

  // VIS / SKJUL prompt - vi toggler både 'show' og 'visible' for at være kompatible med forskellig CSS
  function showPrompt() {
    if (!prompt) return;
    if (hasBookmarked()) return;
    if (attempts >= 5) return; // maks 5 gange

    if (!prompt.classList.contains("show") && !prompt.classList.contains("visible")) {
      prompt.classList.add("show");
      prompt.classList.add("visible");
      prompt.setAttribute("aria-hidden", "false");
      // skjul trigger-ikon mens prompt er aktiv (hvis det findes)
      if (triggerIcon) triggerIcon.classList.remove("visible");
      // øg tæller nu (vi tæller visninger)
      attempts++;
      saveAttempts();
    }
  }

  function hidePrompt() {
    if (!prompt) return;
    prompt.classList.remove("show");
    prompt.classList.remove("visible");
    prompt.setAttribute("aria-hidden", "true");
    // vis trigger-ikon hvis brugeren ikke har gemt og har set prompt mindst en gang
    if (triggerIcon && !hasBookmarked() && attempts > 0 && attempts < 5) {
      triggerIcon.classList.add("visible");
    }
  }

  // init trigger visibility (vis kun hvis prompt er tidligere vist og ikke gemt)
  if (triggerIcon) {
    if (!hasBookmarked() && attempts > 0 && attempts < 5) {
      triggerIcon.classList.add("visible");
    } else {
      triggerIcon.classList.remove("visible");
    }
  }

  // Sæt event på action-knap i prompt (brugeren bekræfter at de har gemt)
  if (actionBtn) {
    actionBtn.addEventListener("click", (e) => {
      e.preventDefault();
      try { localStorage.setItem(ADDED_KEY, "true"); } catch (err) {}
      hidePrompt();
    });
  }

  // Luk-knap
  if (closeBtn) {
    closeBtn.addEventListener("click", (e) => {
      e.preventDefault();
      hidePrompt();
    });
  }

  // Trigger-icon: åbn prompt ved click/touch/hover (mobil + desktop)
  if (triggerIcon) {
    ["click", "touchstart", "mouseenter"].forEach(evt => {
      triggerIcon.addEventListener(evt, (e) => {
        // stop dublet default for touchstart
        if (evt === "touchstart") e.preventDefault && e.preventDefault();
        if (!hasBookmarked()) showPrompt();
      }, { passive: false });
    });
  }

  // Hvis brugeren installerer PWA mens siden er åben, markér som gemt
  window.addEventListener("appinstalled", () => {
    try { localStorage.setItem(ADDED_KEY, "true"); } catch (e) {}
    // fjern prompt/ikon
    hidePrompt();
    if (triggerIcon) triggerIcon.classList.remove("visible");
  });

  // ---------- BEREGNINGEN ----------
  form.addEventListener("submit", (e) => {
    e.preventDefault(); // meget vigtigt for at undgå page reload på mobil/desktop

    // Læs værdier fra din faktiske HTML
    const socStartEl = document.getElementById("soc-start");
    const socSlutEl = document.getElementById("soc-slut");
    const kapEl = document.getElementById("kapacitet");
    const ladetabEl = document.getElementById("ladetab");
    const ladevalgEl = document.getElementById("ladevalg");

    // defensive checks
    if (!socStartEl || !socSlutEl || !kapEl || !ladetabEl || !ladevalgEl) {
      console.warn("beregner.js: Et eller flere input-elementer mangler (soc-start, soc-slut, kapacitet, ladetab, ladevalg).");
      if (resultEl) resultEl.textContent = "Der mangler inputfelter på siden. Kontakt udvikler.";
      return;
    }

    const socStart = parseFloat(socStartEl.value);
    const socSlut = parseFloat(socSlutEl.value);
    const kapacitet = parseFloat(kapEl.value);
    const ladetab = parseFloat(ladetabEl.value);
    const ladevalg = ladevalgEl.value; // fx "11-3"

    // validering
    if (isNaN(socStart) || isNaN(socSlut) || isNaN(kapacitet) || isNaN(ladetab) || !ladevalg) {
      if (resultEl) resultEl.innerHTML = `<p style="color:red;">Udfyld alle felter korrekt.</p>`;
      return;
    }

    if (socSlut <= socStart) {
      if (resultEl) resultEl.innerHTML = `<p style="color:red;">Slut SoC skal være større end start SoC.</p>`;
      return;
    }

    // parse ladevalg (fx "11-3")
    const parts = ladevalg.split("-");
    let effekt = parseFloat(parts[0]);
    if (isNaN(effekt) || effekt <= 0) {
      if (resultEl) resultEl.innerHTML = `<p style="color:red;">Vælg en gyldig ladeeffekt.</p>`;
      return;
    }

    // beregning
    const procentAtLade = socSlut - socStart;
    const kWhAtLade = (kapacitet * (procentAtLade / 100)) * (1 + ladetab / 100);
    const tidTimer = kWhAtLade / effekt;

    // formater output
    let tidTekst = "";
    if (tidTimer < 1) {
      const minutter = Math.round(tidTimer * 60);
      tidTekst = `${minutter} minutter`;
    } else {
      const timer = Math.floor(tidTimer);
      const minutter = Math.round((tidTimer - timer) * 60);
      tidTekst = `${timer} timer${minutter > 0 ? ` og ${minutter} minutter` : ""}`;
    }

    if (resultEl) {
      resultEl.innerHTML = `
        <p>Du skal lade <strong>${kWhAtLade.toFixed(1)} kWh</strong>.</p>
        <p>Det vil tage cirka <strong>${tidTekst}</strong>.</p>
      `;
    }

    // --- efter beregning: vis bookmark prompt (førstegang, maks 5 gange) ---
    if (!hasBookmarked() && attempts < 5) {
      showPrompt();
    }
  }); // end form submit
}); // end DOMContentLoaded

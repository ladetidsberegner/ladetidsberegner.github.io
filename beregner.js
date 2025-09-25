// beregner.js

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("beregner-form");
  const resultEl = document.getElementById("beregner-resultat");
  const prompt = document.getElementById("bookmark-prompt");
  const closeBtn = document.getElementById("bookmark-close");
  const triggerIcon = document.getElementById("bookmark-trigger");

  // LocalStorage keys
  const BOOKMARKED_KEY = "site_bookmarked";
  const PROMPT_COUNT_KEY = "bookmark_prompt_count";

  function hasBookmarked() {
    return localStorage.getItem(BOOKMARKED_KEY) === "true";
  }

  function getPromptCount() {
    return parseInt(localStorage.getItem(PROMPT_COUNT_KEY) || "0", 10);
  }

  function incrementPromptCount() {
    let count = getPromptCount() + 1;
    localStorage.setItem(PROMPT_COUNT_KEY, count);
  }

  function markBookmarked() {
    localStorage.setItem(BOOKMARKED_KEY, "true");
  }

  function showPrompt() {
    prompt.classList.add("visible");
    triggerIcon.classList.remove("visible"); // skjul ikon mens prompt er aktiv
  }

  function hidePrompt() {
    prompt.classList.remove("visible");
    triggerIcon.classList.add("visible"); // gør ikon synligt
  }

  // Beregner-funktion (tilpas din logik her)
  function beregn() {
    // Din beregning her
    resultEl.textContent = "Beregningen er udført!";

    // Bookmark logik
    if (!hasBookmarked() && getPromptCount() < 5) {
      incrementPromptCount();
      showPrompt();
    }
  }

  // Event handlers
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    beregn();
  });

  closeBtn.addEventListener("click", () => {
    hidePrompt();
  });

  triggerIcon.addEventListener("mouseenter", () => {
    // Ved hover på ikonet – vis prompt
    if (!hasBookmarked()) {
      showPrompt();
    }
  });

  // Når brugeren klikker på linket i prompten
  document.getElementById("bookmark-action").addEventListener("click", () => {
    markBookmarked();
    hidePrompt();
  });
});
document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("beregner-form");
  const resultatEl = document.getElementById("beregn-resultat");

  // --- Bookmark prompt ---
  const prompt = document.getElementById("bookmark-prompt");
  const triggerIcon = document.getElementById("bookmark-trigger");

  // hvor mange gange vi har spurgt
  let attempts = parseInt(localStorage.getItem("bookmark-attempts") || "0");
  let hasBookmarkedFlag = localStorage.getItem("bookmark-added") === "true";

  function hasBookmarked() {
    return hasBookmarkedFlag;
  }

  function showPrompt() {
    if (hasBookmarked()) return;
    if (attempts >= 5) return;
    prompt.classList.add("show");
  }

  function hidePrompt() {
    prompt.classList.remove("show");
  }

  // når man klikker "gem" i prompten
  document.getElementById("bookmark-confirm").addEventListener("click", () => {
    hasBookmarkedFlag = true;
    localStorage.setItem("bookmark-added", "true");
    hidePrompt();
  });

  // når man lukker prompten uden at bookmarke
  document.getElementById("bookmark-close").addEventListener("click", () => {
    attempts++;
    localStorage.setItem("bookmark-attempts", attempts.toString());
    hidePrompt();
  });

  // gør det muligt at "kalde" prompt frem igen via ikon
  ["mouseenter", "click", "touchstart"].forEach(evt => {
    triggerIcon.addEventListener(evt, () => {
      if (!hasBookmarked()) {
        showPrompt();
      }
    });
  });

  // --- Beregning ---
  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const startSoc = parseFloat(document.getElementById("start-soc").value);
    const slutSoc = parseFloat(document.getElementById("slut-soc").value);
    const kapacitet = parseFloat(document.getElementById("batteri").value);
    const ladeeffekt = parseFloat(document.getElementById("ladeeffekt").value);
    const faser = parseInt(document.getElementById("faser").value);
    const ladetab = parseFloat(document.getElementById("ladetab").value);

    if (isNaN(startSoc) || isNaN(slutSoc) || isNaN(kapacitet) || isNaN(ladeeffekt) || isNaN(faser) || isNaN(ladetab)) {
      resultatEl.textContent = "Udfyld venligst alle felter korrekt.";
      return;
    }

    const socDiff = (slutSoc - startSoc) / 100;
    const energi = kapacitet * socDiff;
    const tab = energi * (ladetab / 100);
    const bruttoEnergi = energi + tab;

    const effekt = ladeeffekt; // kW, valgt direkte
    const tidTimer = bruttoEnergi / effekt;

    const timer = Math.floor(tidTimer);
    const minutter = Math.round((tidTimer - timer) * 60);

    resultatEl.textContent =
      `Opladning fra ${startSoc}% til ${slutSoc}% tager ca. ${timer} timer og ${minutter} minutter. ` +
      `(Brutto forbrug: ${bruttoEnergi.toFixed(1)} kWh)`;

    // første beregning -> vis prompt (hvis relevant)
    if (!hasBookmarked() && attempts < 5) {
      attempts++;
      localStorage.setItem("bookmark-attempts", attempts.toString());
      showPrompt();
    }
  });
});

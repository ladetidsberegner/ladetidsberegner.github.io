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

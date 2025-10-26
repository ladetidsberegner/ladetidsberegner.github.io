document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("beregn-form");
  const resultatDiv = document.getElementById("resultat");

  // --- Toggle info bokse ---
  document.querySelectorAll(".toggle-info").forEach(label => {
    label.style.cursor = "pointer";
    label.addEventListener("click", function () {
      const infoId = this.getAttribute("data-info");
      const infoBox = document.getElementById(infoId);
      if (!infoBox) return;

      if (infoBox.style.height && infoBox.style.height !== "0px") {
        infoBox.style.height = infoBox.scrollHeight + "px";
        requestAnimationFrame(() => {
          infoBox.style.height = "0px";
        });
      } else {
        infoBox.style.height = infoBox.scrollHeight + "px";
        infoBox.addEventListener("transitionend", function handler() {
          if (infoBox.style.height !== "0px") {
            infoBox.style.height = "auto";
          }
          infoBox.removeEventListener("transitionend", handler);
        });
      }
    });
  });

  // --- Load gemte værdier eller default ---
  document.getElementById("soc-start").value = localStorage.getItem("socStart") || 20;
  document.getElementById("soc-slut").value = localStorage.getItem("socSlut") || 80;
  document.getElementById("kapacitet").value = localStorage.getItem("kapacitet") || 57.5;
  document.getElementById("ladetab").value = localStorage.getItem("ladetab") || 12;
  document.getElementById("ladevalg").value = localStorage.getItem("ladevalg") || "11-3";

  // --- Beregn ladetid ---
  form.addEventListener("submit", function (e) {
    e.preventDefault(); // Stop hop til toppen

    const socStart = parseFloat(document.getElementById("soc-start").value);
    const socSlut = parseFloat(document.getElementById("soc-slut").value);
    const kapacitet = parseFloat(document.getElementById("kapacitet").value);
    const ladetab = parseFloat(document.getElementById("ladetab").value);
    let [effekt, faser] = document.getElementById("ladevalg").value.split("-");
    effekt = parseFloat(effekt);

    // Gem værdier i localStorage
    localStorage.setItem("socStart", socStart);
    localStorage.setItem("socSlut", socSlut);
    localStorage.setItem("kapacitet", kapacitet);
    localStorage.setItem("ladetab", ladetab);
    localStorage.setItem("ladevalg", document.getElementById("ladevalg").value);

    if (socSlut <= socStart) {
      resultatDiv.innerHTML = `<p style="color:red;">Slut SoC skal være større end start SoC.</p>`;
      return;
    }

    const procentAtLade = socSlut - socStart;
    const kWhAtLade = (kapacitet * (procentAtLade / 100)) * (1 + ladetab / 100);
    const tidTimer = kWhAtLade / effekt;

    let tidTekst = "";
    if (tidTimer < 1) {
      const minutter = Math.round(tidTimer * 60);
      tidTekst = `${minutter} minutter`;
    } else {
      const timer = Math.floor(tidTimer);
      const minutter = Math.round((tidTimer - timer) * 60);
      tidTekst = `${timer} timer${minutter > 0 ? ` og ${minutter} minutter` : ""}`;
    }

    resultatDiv.innerHTML = `
      <p>Du skal lade <strong>${kWhAtLade.toFixed(1)} kWh</strong>.</p>
      <p>Det vil tage cirka <strong>${tidTekst}</strong>.</p>
    `;
  });

  // --- FAQ fold-ud ---
  document.querySelectorAll(".faq-question").forEach(button => {
    button.style.cursor = "pointer";
    button.addEventListener("click", () => {
      const answer = button.nextElementSibling; 
      if (!answer) return;

      if (answer.style.height && answer.style.height !== "0px") {
        answer.style.height = answer.scrollHeight + "px";
        requestAnimationFrame(() => {
          answer.style.height = "0px";
        });
        answer.classList.remove("open");
      } else {
        answer.style.height = answer.scrollHeight + "px";
        answer.classList.add("open");
        answer.addEventListener("transitionend", function handler() {
          if (answer.classList.contains("open")) {
            answer.style.height = "auto";
          }
          answer.removeEventListener("transitionend", handler);
        });
      }
    });
  });

  // --- Cookie banner ---
  if (!localStorage.getItem("cookiesAccepted")) {
    const cookieBanner = document.createElement("div");
    cookieBanner.classList.add("cookie-banner");
    cookieBanner.innerHTML = `
      <p>Vi bruger cookies til at huske dine indstillinger og forbedre oplevelsen. <a href="/cookiepolitik">Læs mere</a></p>
      <button id="acceptCookies">Accepter</button>
    `;
    document.body.appendChild(cookieBanner);

    document.getElementById("acceptCookies").addEventListener("click", function () {
      localStorage.setItem("cookiesAccepted", "true");
      cookieBanner.remove();
    });
  }
});

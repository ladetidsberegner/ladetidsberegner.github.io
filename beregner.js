// ================================
// Hjælp-funktion: detect mobil
// ================================
function isMobile() {
  return /Mobi|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
}

// ================================
// Beregner funktion + gem sidste input
// ================================
document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("beregn-form");
  const resultat = document.getElementById("resultat");
  const fields = ["soc-start", "soc-slut", "kapacitet", "ladevalg", "ladetab"];

  // --- Fyld felter fra localStorage ---
  fields.forEach(id => {
    const el = document.getElementById(id);
    if (el && localStorage.getItem(id) !== null) {
      el.value = localStorage.getItem(id);
    }
  });

  // --- Gem i localStorage ved ændring ---
  fields.forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener("input", function () {
        localStorage.setItem(id, el.value);
      });
    }
  });

  // --- Beregn ---
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();

      const startSoC = parseFloat(document.getElementById("soc-start").value) || 0;
      const slutSoC = parseFloat(document.getElementById("soc-slut").value) || 100;
      const batteri = parseFloat(document.getElementById("kapacitet").value) || 0;
      const ladeValg = document.getElementById("ladevalg").value;
      const tab = parseFloat(document.getElementById("ladetab").value) || 10;

      let effekt = 0;
      let faser = 1;

      if (ladeValg) {
        const parts = ladeValg.split("-");
        effekt = parseFloat(parts[0]);
        faser = parseInt(parts[1]);
      }

      const socDiff = Math.max(0, slutSoC - startSoC);
      const energi = (batteri * socDiff) / 100; 
      const bruttoEnergi = energi * (1 + tab / 100);
      let tidTimer = effekt > 0 ? bruttoEnergi / effekt : 0;

      // --- Konverter til timer og minutter ---
      let timer = Math.floor(tidTimer);
      let minutter = Math.round((tidTimer - timer) * 60);

      if (minutter === 60) {
        timer += 1;
        minutter = 0;
      }

      let tidTekst = "";
      if (timer > 0 && minutter > 0) {
        tidTekst = `${timer} timer og ${minutter} minutter`;
      } else if (timer > 0) {
        tidTekst = `${timer} timer og 0 minutter`;
      } else {
        tidTekst = `${minutter} minutter`;
      }

      resultat.innerHTML = `
        <p>Ladetid: <strong>${tidTekst}</strong></p>
        <p>Brutto energiforbrug: <strong>${bruttoEnergi.toFixed(1)} kWh</strong></p>
      `;

      showBookmarkPopup();
    });
  }

  showBookmarkButton();
});

// ================================
// Bookmark funktion
// ================================
function showBookmarkButton() {
  let bookmarkBtn = document.getElementById("bookmark-circle");

  if (!bookmarkBtn) {
    bookmarkBtn = document.createElement("div");
    bookmarkBtn.id = "bookmark-circle";
    bookmarkBtn.innerHTML = "★";
    bookmarkBtn.classList.add("bookmark-circle");
    bookmarkBtn.style.position = "fixed";
    bookmarkBtn.style.bottom = "80px";
    bookmarkBtn.style.right = "30px";
    bookmarkBtn.style.background = "#55ca1c";
    bookmarkBtn.style.color = "#fff";
    bookmarkBtn.style.width = "50px";
    bookmarkBtn.style.height = "50px";
    bookmarkBtn.style.borderRadius = "50%";
    bookmarkBtn.style.display = "flex";
    bookmarkBtn.style.alignItems = "center";
    bookmarkBtn.style.justifyContent = "center";
    bookmarkBtn.style.cursor = "pointer";
    bookmarkBtn.style.zIndex = "9999";
    document.body.appendChild(bookmarkBtn);

    bookmarkBtn.addEventListener("click", function () {
      showBookmarkPopup();
    });
  }
}

// ================================
// Bookmark popup
// ================================
function showBookmarkPopup() {
  let popup = document.getElementById("bookmark-popup");

  if (!popup) {
    popup = document.createElement("div");
    popup.id = "bookmark-popup";
    popup.classList.add("bookmark-popup");
    popup.style.position = "fixed";
    popup.style.bottom = "200px";
    popup.style.right = "30px";
    popup.style.background = "#fff";
    popup.style.padding = "20px";
    popup.style.borderRadius = "8px";
    popup.style.boxShadow = "0 4px 12px rgba(0,0,0,0.2)";
    popup.style.zIndex = "9999";

    const isiOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);
    const isAndroid = /Android/i.test(navigator.userAgent);

    let instructions = "Brug browserens bogmærkefunktion for at gemme siden.";
    if (isiOS) {
      instructions =
        "Tryk på 'Del' → 'Føj til hjemmeskærm' for at gemme siden på din iPhone/iPad.";
    } else if (isAndroid) {
      instructions =
        "Tryk på knappen nedenfor for at tilføje siden til din startskærm.";
    }

    popup.innerHTML = `
      <p>${instructions}</p>
      <div id="android-install-btn-container"></div>
      <button id="close-popup" style="margin-top:10px; padding:8px 14px; border-radius:6px; background:#55ca1c; color:#fff; border:none; cursor:pointer;">Luk</button>
    `;

    document.body.appendChild(popup);

    document.getElementById("close-popup").addEventListener("click", function () {
      popup.style.display = "none";
    });
  } else {
    popup.style.display = "block";
  }
}

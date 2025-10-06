// ================================
// Hjælp-funktion: detect mobil
// ================================
function isMobile() {
  return /Mobi|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
}

// ================================
// Beregner funktion
// ================================
document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("beregn-form");
  const resultat = document.getElementById("resultat");

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
      const tid = effekt > 0 ? bruttoEnergi / effekt : 0; 

      resultat.innerHTML = `
        <p>Ladetid: <strong>${tid.toFixed(2)} timer</strong></p>
        <p>Brutto energiforbrug: <strong>${bruttoEnergi.toFixed(2)} kWh</strong></p>
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
      <button id="close-popup">Luk</button>
    `;

    document.body.appendChild(popup);

    const closeBtn = document.getElementById("close-popup");
    closeBtn.addEventListener("click", function () {
      popup.remove();
    });

    let deferredPrompt;
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      deferredPrompt = e;

      if (isAndroid) {
        const container = document.getElementById('android-install-btn-container');
        const installBtn = document.createElement('button');
        installBtn.textContent = "Tilføj til startskærm";
        installBtn.style.marginTop = "10px";
        installBtn.style.padding = "8px 14px";
        installBtn.style.borderRadius = "6px";
        installBtn.style.background = "#55ca1c";
        installBtn.style.color = "#fff";
        installBtn.style.border = "none";
        installBtn.style.cursor = "pointer";
        container.appendChild(installBtn);

        installBtn.addEventListener('click', async () => {
          deferredPrompt.prompt();
          const choiceResult = await deferredPrompt.userChoice;
          deferredPrompt = null;
          installBtn.style.display = 'none';
        });
      }
    });
  } else {
    popup.style.display = 'block';
  }
}

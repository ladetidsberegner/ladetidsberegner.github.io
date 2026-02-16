//debug
console.log("master.js loaded");


document.addEventListener("DOMContentLoaded", () => {
  console.log("master.js loaded");

  /* =======================
     FADE-IN
  ======================= */
  document.querySelectorAll(
    ".fade-section, .fade-left, .fade-right, .fade-up, .fade-in-child"
  ).forEach(el => {
    el.classList.add("visible");
  });

  /* =======================
     ÅRSTAL
  ======================= */
  document.querySelectorAll(".js-year").forEach(el => {
    el.textContent = new Date().getFullYear();
  });
});

/* =====================================================
   BATTERIKAPACITET – PERSISTENS
===================================================== */
(function () {
  document.addEventListener("DOMContentLoaded", () => {
    const kap = document.getElementById("kapacitet");
    if (!kap) return;

    const saved = localStorage.getItem("batteri_kapacitet");
    if (saved !== null) kap.value = saved;

    kap.addEventListener("input", () => {
      localStorage.setItem("batteri_kapacitet", kap.value);
    });
  });
})();

/* =====================================================
   LADETAB – TYPE & PERSISTENS
===================================================== */
(function () {
  document.addEventListener("DOMContentLoaded", () => {
    const input = document.getElementById("ladetab");
    const rB = document.getElementById("ladetab-beregnet");
    const rT = document.getElementById("ladetab-tastet");

    if (!input || !rB || !rT) return;

    const type = localStorage.getItem("ladetab_type");
    const tastet = localStorage.getItem("ladetab_tastet");

    if (type === "tastet") {
      rT.checked = true;
      input.readOnly = false;
      if (tastet !== null) input.value = tastet;
    } else {
      rB.checked = true;
      input.readOnly = true;
    }

    rB.addEventListener("change", () => {
      input.readOnly = true;
      localStorage.setItem("ladetab_type", "beregnet");
    });

    rT.addEventListener("change", () => {
      input.readOnly = false;
      input.focus();
      localStorage.setItem("ladetab_type", "tastet");
    });

    input.addEventListener("input", () => {
      if (rT.checked) {
        localStorage.setItem("ladetab_tastet", input.value);
      }
    });
  });
})();
/* =====================================================
   🔥 AUTO-BEREGNING – SPOR-AWARE (1–4)
===================================================== */
(function () {
  document.addEventListener("DOMContentLoaded", () => {

    const debounce = (fn, delay = 300) => {
      let t;
      return () => {
        clearTimeout(t);
        t = setTimeout(fn, delay);
      };
    };

    const filled = el =>
      el && el.value !== "" && !isNaN(el.value);

    const settingsReady = () =>
      filled(document.getElementById("kapacitet")) &&
      filled(document.getElementById("ladetab")) &&
      document.getElementById("ladevalg")?.value;

    /* ---------- SPOR 1 ---------- */
    const spor1Ready = () =>
      filled(document.getElementById("soc-start")) &&
      filled(document.getElementById("soc-slut"));

    /* ---------- SPOR 2 ---------- */
    const spor2Ready = () => {
      if (
        !filled(document.getElementById("soc-start-2")) ||
        !filled(document.getElementById("soc-slut-2"))
      ) return false;

      const time = document.getElementById("tidpunkt-input");
      return time && time.value !== "";
    };

    /* ---------- SPOR 3 ---------- */
    const spor3Ready = () => {
      if (!filled(document.getElementById("spor3-soc-start"))) return false;

      const model = document.getElementById("soc-model")?.value;

      if (model === "varighed") {
        return (
          filled(document.getElementById("varighed-timer")) ||
          filled(document.getElementById("varighed-minutter"))
        );
      }

      if (model === "tidspunkter") {
        return (
          document.getElementById("soc-starttid")?.value &&
          document.getElementById("soc-sluttid")?.value
        );
      }

      return false;
    };

    /* ---------- SPOR 4 ---------- */
    const spor4Ready = () =>
      filled(document.getElementById("ladetab-soc-start")) &&
      filled(document.getElementById("ladetab-soc-slut")) &&
      filled(document.getElementById("ladetab-energi"));

    const map = [
      { btn: "beregn-soc-btn", check: spor1Ready },
      { btn: "beregn-tid-btn", check: spor2Ready },
      { btn: "beregn-soc-tid-btn", check: spor3Ready },
      { btn: "beregn-ladetab-btn", check: spor4Ready }
    ];

    map.forEach(({ btn, check }) => {
      const button = document.getElementById(btn);
      if (!button) return;

      const form = button.closest("form");
      if (!form) return;

      const trigger = debounce(() => {
        if (!settingsReady()) return;
        if (!check()) return;
        button.click();
      });

      form.querySelectorAll("input, select").forEach(el => {
        el.addEventListener("input", trigger);
        el.addEventListener("change", trigger);
      });
    });

  });
})();
/* =========================
   BOOKMARK POPUP – STABIL & KORREKT POSITIONERING
   ========================= */
function initBookmark() {
  const btn = document.getElementById("bookmark-btn");
  const popup = document.querySelector(".bookmark-popup");
  if (!btn || !popup) return;

  /* ---------- Platform tekst ---------- */
  function getPlatformMessage() {
    const ua = navigator.userAgent;

    if (/iPhone|iPad|iPod/i.test(ua))
      return "Tryk på del-ikonet og vælg 'Tilføj til hjemmeskærm'";

    if (/Android/i.test(ua))
      return "Tryk på menuen og vælg 'Tilføj til startskærm'";

    if (/Mac/i.test(ua))
      return "Tryk Cmd + D for at bogmærke siden";

    if (/Windows/i.test(ua))
      return "Tryk Ctrl + D for at bogmærke siden";

    return "Brug browserens bogmærke-funktion for at gemme siden";
  }

  /* ---------- Positionering ---------- */
  function positionPopup() {
    const rect = btn.getBoundingClientRect();

    const popupWidth = popup.offsetWidth;
    const popupHeight = popup.offsetHeight;

    let top = window.scrollY + rect.top - popupHeight - 8;
    let left =
      window.scrollX +
      rect.left +
      rect.width / 2 -
      popupWidth / 2;

    /* --- Hold popup indenfor viewport --- */
    const minLeft = 8;
    const maxLeft = window.scrollX + window.innerWidth - popupWidth - 8;

    if (left < minLeft) left = minLeft;
    if (left > maxLeft) left = maxLeft;

    popup.style.top = top + "px";
    popup.style.left = left + "px";
  }

  /* ---------- Toggle popup ---------- */
  btn.addEventListener("click", (e) => {
    e.stopPropagation();

    const isOpen = popup.classList.contains("show");

    if (isOpen) {
      popup.classList.remove("show");
      return;
    }

    popup.textContent = getPlatformMessage();
    popup.classList.add("show");

    /* Vent ét frame så korrekt højde beregnes */
    requestAnimationFrame(() => {
      positionPopup();
    });
  });

  /* ---------- Luk ved klik på popup ---------- */
  popup.addEventListener("click", (e) => {
    e.stopPropagation();
    popup.classList.remove("show");
  });

  /* ---------- Luk ved klik udenfor ---------- */
  document.addEventListener("click", (e) => {
    if (!popup.contains(e.target) && !btn.contains(e.target)) {
      popup.classList.remove("show");
    }
  });

  /* ---------- Reposition ved scroll/resize ---------- */
  window.addEventListener("resize", () => {
    if (popup.classList.contains("show")) positionPopup();
  });

  window.addEventListener("scroll", () => {
    if (popup.classList.contains("show")) positionPopup();
  });
}


/* =========================
   Vent på footer-include
   ========================= */
const bookmarkInterval = setInterval(() => {
  if (
    document.getElementById("bookmark-btn") &&
    document.querySelector(".bookmark-popup")
  ) {
    clearInterval(bookmarkInterval);
    initBookmark();
  }
}, 100);


/* =========================
   safeInit (bevares)
   ========================= */
window.safeInit = function (fn) {
  try {
    if (typeof fn === "function") fn();
  } catch (e) {
    console.error("SafeInit error:", e);
  }
};


document.addEventListener("DOMContentLoaded", function () {
  const form = document.querySelector(".beregn-form");
  const resultatEl = document.getElementById("resultat");

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const socStart = parseFloat(document.getElementById("soc-start").value);
    const socSlut = parseFloat(document.getElementById("soc-slut").value);
    const kapacitet = parseFloat(document.getElementById("kapacitet").value);
    const ampere = parseFloat(document.getElementById("ampere").value);
    const volt = parseFloat(document.getElementById("volt").value);
    const faser = parseInt(document.getElementById("faser").value);
    const ladetab = parseFloat(document.getElementById("ladetab").value);

    if (
      isNaN(socStart) || isNaN(socSlut) || isNaN(kapacitet) ||
      isNaN(ampere) || isNaN(volt) || isNaN(faser) || isNaN(ladetab)
    ) {
      resultatEl.textContent = "Udfyld alle felter korrekt.";
      return;
    }

    if (socSlut <= socStart) {
      resultatEl.textContent = "Slut SoC skal være højere end start SoC.";
      return;
    }

    // Energi som batteriet skal bruge (netto)
    const energiNetto = kapacitet * ((socSlut - socStart) / 100);

    // Energi brutto, dvs. hvad laderen skal levere inkl. ladetab
    const energiBrutto = energiNetto / (1 - ladetab / 100);

    // Ladeeffekt brutto (kW)
    const ladeEffektBrutto = (ampere * volt * faser) / 1000;

    // Tid i timer
    const tidTimer = energiBrutto / ladeEffektBrutto;

    if (isFinite(tidTimer) && tidTimer > 0) {
      const timer = Math.floor(tidTimer);
      const minutter = Math.round((tidTimer - timer) * 60);
      resultatEl.textContent = 
        `Ca. ${timer} timer og ${minutter} minutter. ` +
        `Energi der skal trækkes fra laderen (brutto): ${energiBrutto.toFixed(2)} kWh.`;
    } else {
      resultatEl.textContent = "Kan ikke beregne – tjek dine tal.";
    }
  });
});


// Din eksisterende kode her ...

// Nyt smooth scroll med easing:
function smoothScrollTo(targetY, duration = 600) {
  const startY = window.pageYOffset;
  const distanceY = targetY - startY;
  let startTime = null;

  function easeInOutQuad(t) {
    return t < 0.5
      ? 2 * t * t
      : -1 + (4 - 2 * t) * t;
  }

  function animation(currentTime) {
    if (!startTime) startTime = currentTime;
    const timeElapsed = currentTime - startTime;
    const progress = Math.min(timeElapsed / duration, 1);
    const easedProgress = easeInOutQuad(progress);

    window.scrollTo(0, startY + distanceY * easedProgress);

    if (timeElapsed < duration) {
      requestAnimationFrame(animation);
    }
  }

  requestAnimationFrame(animation);
}

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();

    const targetId = this.getAttribute('href').substring(1);
    const targetElement = document.getElementById(targetId);
    if (targetElement) {
      const offset = 70; // juster hvis du har sticky header
      const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - offset;
      smoothScrollTo(targetPosition, 700);
    }
  });
});


//samtykke
document.addEventListener('DOMContentLoaded', function () {
  const banner = document.getElementById('cookie-banner');
  const acceptBtn = document.getElementById('accept-cookies');

  if (!localStorage.getItem('cookiesAccepted')) {
    banner.style.display = 'block';
  }

  acceptBtn.addEventListener('click', function () {
    localStorage.setItem('cookiesAccepted', 'true');
    banner.style.display = 'none';
    loadAnalytics();
  });

  if (localStorage.getItem('cookiesAccepted') === 'true') {
    loadAnalytics();
  }

  function loadAnalytics() {
    const script1 = document.createElement('script');
    script1.setAttribute('async', '');
    script1.src = 'https://www.googletagmanager.com/gtag/js?id=G-XXXXXXX'; // <-- Erstat med dit ID
    document.head.appendChild(script1);

    const script2 = document.createElement('script');
    script2.innerHTML = `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'G-XXXXXXX'); // <-- Erstat med dit ID
    `;
    document.head.appendChild(script2);
  }
});

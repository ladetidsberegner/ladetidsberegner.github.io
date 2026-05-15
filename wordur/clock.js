/* =========================
   DIGITAL CLOCK
========================= */

function updateClock() {

  const now = new Date();

  let hours = now.getHours();
  let minutes = now.getMinutes();

  hours = hours.toString().padStart(2, '0');
  minutes = minutes.toString().padStart(2, '0');

  document.getElementById("digitalClock").innerHTML = `
    ${hours}<span class="blink">:</span>${minutes}
  `;

}

updateClock();

setInterval(updateClock, 1000);
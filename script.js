// Beskyt e-mail mod spambots
document.addEventListener("DOMContentLoaded", () => {
  const kontaktEl = document.getElementById("kontakt-mail");
  if (kontaktEl) {
    const user = "driveon";
    const domain = "outlook.com";
    const mail = `${user}@${domain}`;
    kontaktEl.innerHTML = `<a href="mailto:${mail}">${mail}</a>`;
  }
});



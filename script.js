// Beskyt e-mail mod spambots
document.addEventListener("DOMContentLoaded", () => {
  const kontaktEl = document.getElementById("kontakt-mail");
  if (kontaktEl) {
    const user = "chargeme";
    const domain = "outlook.dk";
    const mail = `${user}@${domain}`;
    kontaktEl.innerHTML = `<a href="mailto:${mail}">${mail}</a>`;
  }
});



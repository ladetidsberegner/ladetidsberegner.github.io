document.addEventListener("DOMContentLoaded", function () {
  document.querySelectorAll(".faq-question").forEach(button => {
    button.style.cursor = "pointer";
    button.addEventListener("click", () => {
      const answer = button.nextElementSibling; 
      if (!answer) return;

      if (answer.style.height && answer.style.height !== "0px") {
        answer.style.height = answer.scrollHeight + "px";
        requestAnimationFrame(() => { answer.style.height = "0px"; });
        answer.classList.remove("open");
      } else {
        answer.style.height = answer.scrollHeight + "px";
        answer.classList.add("open");
        answer.addEventListener("transitionend", function handler() {
          if (answer.classList.contains("open")) answer.style.height = "auto";
          answer.removeEventListener("transitionend", handler);
        });
      }
    });
  });

  // Toggle info bokse (valgfrit, hvis du vil have det samlet her)
  document.querySelectorAll(".toggle-info").forEach(label => {
    label.style.cursor = "pointer";
    label.addEventListener("click", function () {
      const infoId = this.getAttribute("data-info");
      const infoBox = document.getElementById(infoId);
      if (!infoBox) return;

      if (infoBox.style.height && infoBox.style.height !== "0px") {
        infoBox.style.height = infoBox.scrollHeight + "px";
        requestAnimationFrame(() => { infoBox.style.height = "0px"; });
      } else {
        infoBox.style.height = infoBox.scrollHeight + "px";
        infoBox.addEventListener("transitionend", function handler() {
          if (infoBox.style.height !== "0px") infoBox.style.height = "auto";
          infoBox.removeEventListener("transitionend", handler);
        });
      }
    });
  });
});
ß
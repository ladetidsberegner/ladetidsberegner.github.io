// faq.js — styrer FAQ fold-ud og pilrotation
document.addEventListener("DOMContentLoaded", () => {
  const faqItems = document.querySelectorAll(".faq-item");

  faqItems.forEach(item => {
    const question = item.querySelector(".faq-question");
    const answer = item.querySelector(".faq-answer");
    const icon = item.querySelector(".faq-icon");

    question.addEventListener("click", () => {
      const isOpen = item.classList.contains("open");

      // Luk alle andre
      faqItems.forEach(i => {
        i.classList.remove("open");
        i.querySelector(".faq-answer").style.height = "0";
        i.querySelector(".faq-question").setAttribute("aria-expanded", "false");
        i.querySelector(".faq-answer").setAttribute("aria-hidden", "true");
      });

      // Åbn/luk den valgte
      if (!isOpen) {
        item.classList.add("open");
        answer.style.height = answer.scrollHeight + "px";
        question.setAttribute("aria-expanded", "true");
        answer.setAttribute("aria-hidden", "false");
      } else {
        item.classList.remove("open");
        answer.style.height = "0";
        question.setAttribute("aria-expanded", "false");
        answer.setAttribute("aria-hidden", "true");
      }
    });
  });
});

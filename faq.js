// faq.js — styrer FAQ fold-ud og pilrotation (afgrænset til FAQ)
document.addEventListener("DOMContentLoaded", () => {
  const faqContainer = document.querySelector(".faq-container");
  if (!faqContainer) return;

  const faqItems = faqContainer.querySelectorAll(".faq-item");

  faqItems.forEach(item => {
    const question = item.querySelector(".faq-question");
    const answer = item.querySelector(".faq-answer");
    const icon = item.querySelector(".faq-icon");
    if (!question || !answer) return;

    question.addEventListener("click", () => {
      const isOpen = item.classList.contains("open");

      // Luk alle andre i FAQ’en
      faqItems.forEach(i => {
        i.classList.remove("open");
        const a = i.querySelector(".faq-answer");
        const q = i.querySelector(".faq-question");
        if (!a || !q) return;
        q.setAttribute("aria-expanded", "false");
        a.setAttribute("aria-hidden", "true");
        a.style.height = "0px";
      });

      // Åbn / luk den aktuelle
      if (!isOpen) {
        item.classList.add("open");
        question.setAttribute("aria-expanded", "true");
        answer.setAttribute("aria-hidden", "false");
        answer.style.height = answer.scrollHeight + "px";
      } else {
        item.classList.remove("open");
        question.setAttribute("aria-expanded", "false");
        answer.setAttribute("aria-hidden", "true");
        answer.style.height = answer.scrollHeight + "px";
        requestAnimationFrame(() => (answer.style.height = "0px"));
      }
    });

    answer.addEventListener("transitionend", e => {
      if (e.propertyName !== "height") return;
      if (item.classList.contains("open")) {
        answer.style.height = "auto";
      }
    });
  });
});

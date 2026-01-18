fetch("/includes/head-common.html")
  .then(r => r.text())
  .then(h => document.head.insertAdjacentHTML("beforeend", h));

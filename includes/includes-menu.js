fetch("includes/head-common.html")
  .then(r => r.text())
  .then(h => document.head.insertAdjacentHTML("beforeend", h));

console.log("includes-menu.js loaded");

fetch("includes/header.html")
  .then(r => r.text())
  .then(html => {
    const mount = document.getElementById("site-header");
    if (!mount) return;
    mount.innerHTML = html;
    console.log("header inserted");
  });

// sw-cleanup.js — afregistrerer alle service workers og PWA caches
(async () => {
  if ('serviceWorker' in navigator) {
    const regs = await navigator.serviceWorker.getRegistrations();
    for (const reg of regs) {
      console.log('🧹 Fjernet service worker:', reg.scope);
      await reg.unregister();
    }
  }

  if ('caches' in window) {
    const names = await caches.keys();
    for (const name of names) {
      console.log('🗑️ Slettet cache:', name);
      await caches.delete(name);
    }
  }

  // Nulstil PWA-data i localStorage
  localStorage.clear();
  sessionStorage.clear();
  console.log("✅ Rensning fuldført");
})();

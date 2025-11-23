// scroll.js — delegated smooth anchor scroll + fires `anchor:scrolled` efter animation
(function () {
  "use strict";
  console.log("🔥 scroll.js loaded (delegated smooth)"); 

  const DURATION = 650; // ms, juster for langsommere / hurtigere
  const OFFSET = 18; // ekstra top-offset (px)

  function now() { return (performance && performance.now) ? performance.now() : Date.now(); }
  function ease(t) { return t<0.5 ? 4*t*t*t : 1 - Math.pow(-2*t+2,3)/2; }

  function getScrollTop() {
    return window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
  }
  function setScrollTop(y) {
    window.scrollTo(0, Math.round(y));
    try { document.documentElement.scrollTop = Math.round(y); } catch(e){}
    try { document.body.scrollTop = Math.round(y); } catch(e){}
  }

  function computeTargetTop(el) {
    if (!el) return 0;
    const rect = el.getBoundingClientRect();
    const pageTop = rect.top + getScrollTop();
    // read CSS scroll-margin-top if set
    let cssMargin = 0;
    try {
      const s = getComputedStyle(el);
      const m = s.scrollMarginTop || s['scroll-margin-top'];
      if (m) cssMargin = parseInt(m, 10) || 0;
    } catch (e){}
    return Math.max(0, Math.round(pageTop - Math.max(cssMargin, 0) - OFFSET));
  }

  let rafId = null;
  function animateScrollTo(targetY, duration = DURATION, cb) {
    if (rafId) cancelAnimationFrame(rafId);
    const startY = getScrollTop();
    const delta = targetY - startY;
    if (Math.abs(delta) < 2) {
      setScrollTop(targetY);
      if (cb) cb();
      return;
    }
    const startTime = now();
    function step() {
      const t = Math.min(1, (now() - startTime) / duration);
      const eased = ease(t);
      setScrollTop(startY + delta * eased);
      if (t < 1) {
        rafId = requestAnimationFrame(step);
      } else {
        setScrollTop(targetY);
        rafId = null;
        if (cb) cb();
      }
    }
    rafId = requestAnimationFrame(step);
  }

  // Cancel if user interacts
  ['wheel','touchstart','keydown','mousedown'].forEach(ev => {
    window.addEventListener(ev, () => { if (rafId) { cancelAnimationFrame(rafId); rafId = null; } }, { passive:true });
  });

  // Handle anchor click delegation
  document.addEventListener('click', function (e) {
    const a = e.target.closest && e.target.closest('a[href]');
    if (!a) return;

    const href = a.getAttribute('href');
    // only handle same-page hashes or links containing #
    if (!href) return;
    const hashIndex = href.indexOf('#');
    if (hashIndex === -1) return;

    // get hash part
    const hash = href.slice(hashIndex);
    if (!hash || hash === '#') return;

    // find target element by id or selector
    const id = decodeURIComponent(hash.slice(1));
    if (!id) return;

    const target = document.getElementById(id) || document.querySelector(hash);
    if (!target) {
      // no target on page — let default behaviour occur
      return;
    }

    // prevent default hard jump
    e.preventDefault();

    // Slight timeout so any click-handlers (like accordion toggles) can run first if they want
    setTimeout(() => {
      const top = computeTargetTop(target);
      console.log('➡️ Smooth scroll to: –', '#' + id, '–>', top);
      animateScrollTo(top, DURATION, () => {
        // update history without jump
        try { history.pushState ? history.pushState(null, '', '#' + id) : (location.hash = '#' + id); } catch (err) { location.hash = '#' + id; }
        // dispatch event for others (accordion listens)
        window.dispatchEvent(new CustomEvent('anchor:scrolled', { detail: { id } }));
        // focus target for accessibility
        try {
          target.setAttribute('tabindex','-1');
          target.focus({ preventScroll: true });
        } catch(e){}
      });
    }, 30);
  }, true); // capture phase to take control early

  // expose API
  window.__anchorScroll = {
    toId(id) {
      const el = document.getElementById(id) || document.querySelector('#' + id);
      if (!el) return;
      const top = computeTargetTop(el);
      animateScrollTo(top, DURATION, () => {
        try { history.pushState ? history.pushState(null, '', '#' + id) : (location.hash = '#' + id); } catch (e) {}
        window.dispatchEvent(new CustomEvent('anchor:scrolled', { detail: { id } }));
        try { el.setAttribute('tabindex','-1'); el.focus({ preventScroll: true }); } catch(e){}
      });
    }
  };

})();

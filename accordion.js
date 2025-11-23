// accordion.js — accordion behavior matching din HTML
(function () {
  "use strict";
  console.log("accordion.js loaded");

  // small helpers
  function setOpen(container, panel, open) {
    if (!container || !panel) return;
    if (open) {
      container.classList.add('open');
      container.querySelectorAll('button[aria-expanded]').forEach(b => {}); // noop placeholder
      panel.style.height = panel.scrollHeight + 'px';
      const btn = container.querySelector('button');
      if (btn) btn.setAttribute('aria-expanded','true');
      panel.setAttribute('aria-hidden','false');
    } else {
      container.classList.remove('open');
      // smooth close: set current height then to 0
      panel.style.height = panel.scrollHeight + 'px';
      // force reflow
      void panel.offsetHeight;
      panel.style.height = '0px';
      const btn = container.querySelector('button');
      if (btn) btn.setAttribute('aria-expanded','false');
      panel.setAttribute('aria-hidden','true');
    }
  }

  function onTransitionEnd(ev) {
    if (ev.propertyName !== 'height') return;
    const panel = ev.target;
    const container = panel.closest('.calc-section, .advanced-section, .faq-item');
    if (!container) return;
    if (container.classList.contains('open')) {
      panel.style.height = 'auto';
    } else {
      panel.style.height = '0px';
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    // SELECTORS that match your HTML
    const calcSections = Array.from(document.querySelectorAll('.calc-section'));
    const advancedSection = document.querySelector('.advanced-section');
    const faqItems = Array.from(document.querySelectorAll('.faq-item'));

    // ---------- Calc sections: exclusive (only one open), default open: calc-spor1 ----------
    calcSections.forEach(sec => {
      const btn = sec.querySelector('.calc-question');
      const panel = sec.querySelector('.calc-answer');
      if (panel) {
        panel.style.height = sec.classList.contains('open') && panel.scrollHeight ? 'auto' : '0px';
        panel.addEventListener('transitionend', onTransitionEnd);
      }
      if (btn) {
        btn.setAttribute('aria-expanded', sec.classList.contains('open') ? 'true' : 'false');
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          // exclusive: close other calc sections (but NOT advanced)
          calcSections.forEach(other => {
            if (other === sec) return;
            const op = other.querySelector('.calc-answer');
            setOpen(other, op, false);
          });
          // toggle this
          const isOpen = sec.classList.contains('open');
          setOpen(sec, panel, !isOpen);
        });
      }
    });

    // default: open #calc-spor1 if exists (otherwise first)
    const defCalc = document.getElementById('calc-spor1') || calcSections[0];
    if (defCalc) {
      const p = defCalc.querySelector('.calc-answer');
      setOpen(defCalc, p, true);
    }

    // ---------- Advanced (independent) ----------
    if (advancedSection) {
      const advBtn = advancedSection.querySelector('.advanced-question');
      const advPanel = advancedSection.querySelector('.advanced-answer');
      if (advPanel) {
        advPanel.style.height = advancedSection.classList.contains('open') ? 'auto' : '0px';
        advPanel.addEventListener('transitionend', onTransitionEnd);
      }
      // open by default (per your request)
      setOpen(advancedSection, advPanel, true);

      if (advBtn) {
        advBtn.setAttribute('aria-expanded', advancedSection.classList.contains('open') ? 'true' : 'false');
        advBtn.addEventListener('click', (e) => {
          e.preventDefault();
          const nowOpen = !advancedSection.classList.contains('open');
          // Advanced toggles independently (does not affect calc sections)
          setOpen(advancedSection, advPanel, nowOpen);
        });
      }
    }

    // ---------- FAQ: closed by default; single open on click or on anchor:scrolled ----------
    faqItems.forEach(item => {
      const q = item.querySelector('.faq-question');
      const panel = item.querySelector('.faq-answer');
      if (!q || !panel) return;
      panel.style.height = item.classList.contains('open') ? 'auto' : '0px';
      panel.addEventListener('transitionend', onTransitionEnd);
      q.setAttribute('aria-expanded', item.classList.contains('open') ? 'true' : 'false');
      panel.setAttribute('aria-hidden', item.classList.contains('open') ? 'false' : 'true');

      q.addEventListener('click', (e) => {
        e.preventDefault();
        // close others
        faqItems.forEach(other => {
          if (other === item) return;
          const op = other.querySelector('.faq-answer');
          setOpen(other, op, false);
        });
        // toggle this
        const nowOpen = !item.classList.contains('open');
        setOpen(item, panel, nowOpen);
      });
    });

    // Listen for scroll completion events to open FAQ entry
    window.addEventListener('anchor:scrolled', (ev) => {
      const id = ev?.detail?.id;
      if (!id) return;
      // Only handle faq- ids
      if (!id.startsWith('faq')) return;
      const target = document.getElementById(id);
      if (!target) return;
      // close other faq items
      faqItems.forEach(other => {
        if (other === target) return;
        const op = other.querySelector('.faq-answer');
        setOpen(other, op, false);
      });
      const panel = target.querySelector('.faq-answer');
      setOpen(target, panel, true);
      // ensure it's visible (in case compute differences) — small jump correction
      try {
        // Let browser settle then ensure target is within view
        setTimeout(() => {
          const rect = target.getBoundingClientRect();
          if (rect.top < 0 || rect.top > window.innerHeight) {
            // use the exposed scroll API if present
            if (window.__anchorScroll && typeof window.__anchorScroll.toId === 'function') {
              window.__anchorScroll.toId(id);
            }
          }
        }, 60);
      } catch(e){}
    });

    console.log("accordion.js initialized — calc:", calcSections.length, "faq:", faqItems.length, "advanced:", !!advancedSection);
  });
})();

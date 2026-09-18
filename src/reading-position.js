(() => {
  const guideId = document.body.dataset.guideId;
  if (!guideId) return;
  const storageKey = `field-guide:${guideId}:reading:v1`;
  const sections = [...document.querySelectorAll('main > section[id], main > aside[id], main > .hero[id]')];
  const navLinks = [...document.querySelectorAll('.sidebar a[href^="#"], .compact-menu nav a[href^="#"]')];
  const disclosureIds = () => [...document.querySelectorAll('main details[id][open]')].map(d => d.id);
  let current = sections[0], restoring = true, frame = 0, saveTimer;
  const topInset = () => document.querySelector('.top').getBoundingClientRect().height + 24;
  const highlight = section => {
    if (!section) return;
    current = section;
    for (const link of navLinks) {
      if (link.hash === `#${section.id}`) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    }
  };
  function updateCurrent() {
    frame = 0;
    const inset = topInset();
    let active = sections[0], largest = 0;
    for (const section of sections) {
      const rect = section.getBoundingClientRect();
      const visible = Math.max(0, Math.min(innerHeight, rect.bottom) - Math.max(inset, rect.top));
      if (visible > largest) { active = section; largest = visible; }
    }
    if (innerHeight + scrollY >= document.documentElement.scrollHeight - 3) active = sections.at(-1);
    highlight(active);
  }
  function save() {
    if (restoring || !current || document.querySelector('dialog[open]')) return;
    updateCurrent();
    const offset = topInset() - current.getBoundingClientRect().top;
    try {
      localStorage.setItem(storageKey, JSON.stringify({
        section: current.id, offset, entryHash: location.hash, openDetails: disclosureIds()
      }));
    } catch { /* Reading still works when browser storage is unavailable. */ }
  }
  function track() {
    if (!frame) frame = requestAnimationFrame(updateCurrent);
    clearTimeout(saveTimer);
    saveTimer = setTimeout(save, 220);
  }
  function restore() {
    let saved;
    try { saved = JSON.parse(localStorage.getItem(storageKey)); } catch {}
    // A newly supplied different deep link takes precedence over saved progress.
    const mayResume = saved && (!location.hash || location.hash === saved.entryHash);
    if (mayResume && typeof saved.section === 'string') {
      const section = sections.find(s => s.id === saved.section);
      if (section) {
        if (Array.isArray(saved.openDetails)) for (const id of saved.openDetails) {
          const details = document.getElementById(id);
          if (details?.tagName === 'DETAILS' && details.closest('main')) details.open = true;
        }
        const available = Math.max(0, section.getBoundingClientRect().height - 80);
        const offset = Number.isFinite(saved.offset) ? Math.min(Math.max(-innerHeight, saved.offset), available) : 0;
        const top = scrollY + section.getBoundingClientRect().top - topInset() + offset;
        window.scrollTo({top: Math.max(0, top), behavior:'instant'});
      }
    }
    restoring = false;
    updateCurrent();
  }
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
  // Intrinsic image dimensions reserve layout space before lazy images load.
  if (document.readyState === 'complete') restore();
  else window.addEventListener('load', restore, {once:true});
  window.addEventListener('scroll', track, {passive:true});
  window.addEventListener('resize', track, {passive:true});
  document.addEventListener('toggle', event => { if (event.target.closest?.('main')) track(); }, true);
  window.addEventListener('hashchange', () => { requestAnimationFrame(() => {updateCurrent();save();}); });
  window.addEventListener('pagehide', save);
  document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'hidden') save(); });
  window.addEventListener('pageshow', event => { if (event.persisted) {restoring=false;updateCurrent();} });
})();

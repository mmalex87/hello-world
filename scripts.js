(function(){
  const qs = (sel, root=document) => root.querySelector(sel);
  const qsa = (sel, root=document) => Array.from(root.querySelectorAll(sel));

  // Mobile nav toggle
  const navToggle = qs('.nav-toggle');
  const menu = qs('#primary-menu');
  if (navToggle && menu) {
    navToggle.addEventListener('click', () => {
      const expanded = menu.getAttribute('aria-expanded') === 'true';
      menu.setAttribute('aria-expanded', String(!expanded));
      navToggle.setAttribute('aria-expanded', String(!expanded));
    });
  }

  // Dropdown for Blog
  const dropdown = qs('.dropdown');
  if (dropdown) {
    const toggle = qs('.dropdown-toggle', dropdown);
    toggle?.addEventListener('click', (e) => {
      e.preventDefault();
      const expanded = dropdown.getAttribute('aria-expanded') === 'true';
      dropdown.setAttribute('aria-expanded', String(!expanded));
    });
    document.addEventListener('click', (e) => {
      if (!dropdown.contains(e.target)) {
        dropdown.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // Modal logic
  const openButtons = qsa('[data-open]');
  const closeButtons = qsa('[data-close]');
  const modalBackdrop = qs('.modal-backdrop');
  function setModalVisibility(modal, visible){
    if (!modal) return;
    modal.setAttribute('aria-hidden', visible ? 'false' : 'true');
    if (modalBackdrop) {
      if (visible) modalBackdrop.removeAttribute('hidden');
      else modalBackdrop.setAttribute('hidden', '');
    }
    if (visible) {
      const firstFocusable = modal.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
      firstFocusable?.focus();
    }
  }
  openButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-open');
      const modal = qs(`#${targetId}`);
      setModalVisibility(modal, true);
    });
  });
  closeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const modal = btn.closest('.modal');
      setModalVisibility(modal, false);
    });
  });
  modalBackdrop?.addEventListener('click', () => {
    qsa('.modal[aria-hidden="false"]').forEach(m => setModalVisibility(m, false));
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      qsa('.modal[aria-hidden="false"]').forEach(m => setModalVisibility(m, false));
    }
  });

  // Carousel
  qsa('[data-carousel]').forEach(carousel => {
    const slides = qs('.slides', carousel);
    const slideEls = qsa('.slide', slides);
    const prev = qs('[data-prev]', carousel);
    const next = qs('[data-next]', carousel);
    let index = 0;
    function update(){
      const offset = -index * 100;
      slides.style.transform = `translateX(${offset}%)`;
    }
    function go(delta){
      index = (index + delta + slideEls.length) % slideEls.length;
      update();
    }
    prev?.addEventListener('click', () => go(-1));
    next?.addEventListener('click', () => go(1));
    update();
  });

  // Accordion (Spoilers)
  qsa('.accordion').forEach(accordion => {
    qsa('.item', accordion).forEach(item => {
      const btn = qs('button.toggle', item);
      const content = qs('.content', item);
      if (!btn || !content) return;
      btn.setAttribute('aria-expanded', 'false');
      content.setAttribute('hidden', '');
      btn.addEventListener('click', () => {
        const expanded = btn.getAttribute('aria-expanded') === 'true';
        btn.setAttribute('aria-expanded', String(!expanded));
        if (expanded) content.setAttribute('hidden', '');
        else content.removeAttribute('hidden');
      });
    });
  });
})();

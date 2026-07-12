
  const content = document.getElementById('page-content');
  let currentPage = '';
  let pendingFilter = null;

  function navigate(page, filter) {
    if (page === currentPage && !filter) return;
    pendingFilter = filter || null;
    content.classList.add('fade');
    setTimeout(() => loadPage(page), 180);
  }

  function loadPage(page) {
    const tpl = document.getElementById('tpl-' + page);
    if (!tpl) return;
    content.innerHTML = '';
    content.appendChild(tpl.content.cloneNode(true));
    if (page === 'projects') {
      const filter = pendingFilter || 'all';
      pendingFilter = null;
      activateProjectFilter(filter);
      content.querySelectorAll('.proj-tab').forEach(tab => {
        tab.addEventListener('click', () => activateProjectFilter(tab.dataset.filter));
      });
    }
    currentPage = page;
    document.querySelectorAll('.nav-links [data-page]').forEach(el => el.classList.remove('active'));
    document.querySelectorAll(`.nav-links [data-page="${page}"]`).forEach(el => el.classList.add('active'));
    content.classList.remove('fade');
    window.scrollTo(0, 0);
  }

  function activateProjectFilter(filter) {
    document.querySelectorAll('.proj-tab').forEach(t => t.classList.toggle('active', t.dataset.filter === filter));
    document.querySelectorAll('#proj-grid .proj-card').forEach(card => {
      const cats = card.dataset.cat || '';
      card.style.display = (filter === 'all' || cats.includes(filter)) ? '' : 'none';
    });
  }

  document.querySelector('nav').addEventListener('click', e => {
    const el = e.target.closest('[data-page]');
    if (!el) return;
    e.preventDefault();
    navigate(el.dataset.page, el.dataset.filter || null);
  });

  // Hamburger toggle
  const hamburger = document.getElementById('hamburger');
  const mobileNav = document.getElementById('mobile-nav');

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    mobileNav.classList.toggle('open');
  });

  // Mobile nav link clicks
  mobileNav.addEventListener('click', e => {
    const el = e.target.closest('[data-page]');
    if (!el) return;
    e.preventDefault();
    hamburger.classList.remove('open');
    mobileNav.classList.remove('open');
    navigate(el.dataset.page, el.dataset.filter || null);
  });

  // Close mobile nav when clicking outside
  document.addEventListener('click', e => {
    if (!hamburger.contains(e.target) && !mobileNav.contains(e.target)) {
      hamburger.classList.remove('open');
      mobileNav.classList.remove('open');
    }
  });

  loadPage('home');

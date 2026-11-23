const menu = document.querySelector('.menu-toggle');
const nav = document.querySelector('.site-nav');

if (menu && nav) {
  menu.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    menu.setAttribute('aria-expanded', String(open));
  });
  nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => nav.classList.remove('open')));
}

const workList = document.querySelector('#work-entry-list');
if (workList && typeof portfolioProjects !== 'undefined') {
  workList.innerHTML = portfolioProjects.map(project => `
    <a class="work-entry-item" href="${project.id}.html">
      <span>${project.number}</span>
      <img src="${project.image}" alt="${project.alt}" loading="lazy" decoding="async" />
      <strong>${project.title}</strong>
      <small>${project.label}</small>
      <i aria-hidden="true">↗</i>
    </a>
  `).join('');
}

const directory = document.querySelector('#global-directory');
const directoryTrigger = document.querySelector('.directory-trigger');
const directoryClose = directory?.querySelector('.directory-close');
if (directory && directoryTrigger) {
  const closeDirectory = () => {
    directory.hidden = true;
    directoryTrigger.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('directory-open');
  };
  const openDirectory = () => {
    directory.hidden = false;
    directoryTrigger.setAttribute('aria-expanded', 'true');
    document.body.classList.add('directory-open');
    directoryClose?.focus();
  };
  directoryTrigger.addEventListener('click', openDirectory);
  directoryClose?.addEventListener('click', closeDirectory);
  directory.addEventListener('click', event => {
    if (event.target === directory) closeDirectory();
  });
  directory.querySelectorAll('a').forEach(link => link.addEventListener('click', closeDirectory));
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && !directory.hidden) {
      closeDirectory();
      directoryTrigger.focus();
    }
  });
}

const revealItems = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  }), { threshold: 0.08 });
  revealItems.forEach(item => observer.observe(item));
} else {
  revealItems.forEach(item => item.classList.add('visible'));
}

const lightbox = document.querySelector('.lightbox');
if (lightbox) {
  const lightboxImage = lightbox.querySelector('img');
  const closeButton = lightbox.querySelector('.lightbox-close');
  const images = document.querySelectorAll('main img');
  images.forEach(image => image.addEventListener('click', () => {
    lightboxImage.src = image.src;
    lightboxImage.alt = image.alt;
    lightbox.hidden = false;
  }));
  const closeLightbox = () => {
    lightbox.hidden = true;
    lightboxImage.src = '';
  };
  closeButton?.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', event => {
    if (event.target === lightbox) closeLightbox();
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') closeLightbox();
  });
}

const header = document.querySelector('.site-header');
const renderHeaderState = () => {
  header?.classList.toggle('is-scrolled', window.scrollY > 6);
};
renderHeaderState();
window.addEventListener('scroll', renderHeaderState, { passive: true });

const dock = document.querySelector('[data-dock]');
if (dock) {
  const track = dock.querySelector('[data-dock-track]');
  const pill = dock.querySelector('[data-dock-pill]');
  const items = [...dock.querySelectorAll('[data-dock-item]')];
  const count = dock.querySelector('[data-dock-count]');
  const activeIndex = () => Math.max(0, items.findIndex(item => item.classList.contains('is-active')));

  const placeDockPill = () => {
    const active = items.find(item => item.classList.contains('is-active'));
    if (!active || !track || !pill) return;
    const trackRect = track.getBoundingClientRect();
    const activeRect = active.getBoundingClientRect();
    pill.style.setProperty('--dock-x', `${Math.round(activeRect.left - trackRect.left)}px`);
    pill.style.setProperty('--dock-w', `${Math.round(activeRect.width)}px`);
    pill.classList.add('is-ready');
  };

  const moveProject = delta => {
    if (!items.length) return;
    const nextIndex = (activeIndex() + delta + items.length) % items.length;
    const nextItem = items[nextIndex];
    if (nextItem) window.location.href = nextItem.href;
  };

  dock.querySelector('[data-dock-prev]')?.addEventListener('click', () => moveProject(-1));
  dock.querySelector('[data-dock-next]')?.addEventListener('click', () => moveProject(1));
  if (count) count.textContent = `${String(activeIndex() + 1).padStart(2, '0')} / ${String(items.length).padStart(2, '0')}`;
  placeDockPill();
  window.addEventListener('resize', placeDockPill, { passive: true });
  document.fonts?.ready.then(placeDockPill).catch(() => {});
  document.addEventListener('keydown', event => {
    if (event.metaKey || event.ctrlKey || event.altKey) return;
    if (event.key === '[' || event.key === 'ArrowLeft') moveProject(-1);
    if (event.key === ']' || event.key === 'ArrowRight') moveProject(1);
  });
}

const spyLinks = [...document.querySelectorAll('[data-spy]')];
if (spyLinks.length && 'IntersectionObserver' in window) {
  const targets = spyLinks.map(link => document.querySelector(link.getAttribute('href'))).filter(Boolean);
  const setActiveSpy = id => spyLinks.forEach(link => link.classList.toggle('is-active', link.getAttribute('href') === `#${id}`));
  const spyObserver = new IntersectionObserver(entries => {
    const visible = entries.filter(entry => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
    if (visible) setActiveSpy(visible.target.id);
  }, { rootMargin: '-35% 0px -55% 0px', threshold: 0 });
  targets.forEach(target => spyObserver.observe(target));
  if (targets[0]) setActiveSpy(targets[0].id);
}



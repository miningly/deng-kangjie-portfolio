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
  }), { threshold: 0.02, rootMargin: '0px 0px 18% 0px' });
  revealItems.forEach(item => observer.observe(item));
} else {
  revealItems.forEach(item => item.classList.add('visible'));
}

const scrollProgress = document.createElement('div');
scrollProgress.className = 'scroll-progress';
scrollProgress.setAttribute('aria-hidden', 'true');
document.body.appendChild(scrollProgress);

const updateScrollProgress = () => {
  const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = scrollableHeight > 0 ? window.scrollY / scrollableHeight : 0;
  document.documentElement.style.setProperty('--scroll-progress', `${Math.min(progress, 1) * 100}%`);
};

updateScrollProgress();
window.addEventListener('scroll', updateScrollProgress, { passive: true });

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



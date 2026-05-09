const sites = {
  interest_calc:  'https://paudelsubash234-ai.github.io/interest_calc/',
  Tax_calculator: 'https://paudelsubash234-ai.github.io/Tax_calculator/',
  latefee:        'https://paudelsubash234-ai.github.io/latefee/'
};

const frame      = document.getElementById('frame');
const iframeView = document.getElementById('iframe-view');
const homeView   = document.getElementById('home-view');
const bar        = document.getElementById('bar');
const titleEl    = document.getElementById('topbar-title');
const sidebar    = document.getElementById('sidebar');
const mainEl     = document.getElementById('main');
const overlay    = document.getElementById('overlay');
let activeBtn    = document.getElementById('btn-home');
let sidebarOpen  = true;

const labels = {
  interest_calc:  'Interest Calculator',
  Tax_calculator: 'Tax Calculator',
  latefee:        'Late Fee Settlement'
};

function setActive(btn) {
  if (activeBtn) activeBtn.classList.remove('active');
  activeBtn = btn;
  if (btn) btn.classList.add('active');
}

function showHome() {
  iframeView.classList.remove('on');
  setTimeout(() => {
    homeView.classList.remove('off');
    frame.src = '';
    titleEl.textContent = 'Home';
  }, 250);
  setActive(document.getElementById('btn-home'));
  history.pushState({}, '', location.pathname);
}

function loadSite(key, btn) {
  const url = sites[key];
  if (!url) return;

  homeView.classList.add('off');

  // Animate loading bar
  bar.style.transition = 'none';
  bar.style.width = '0%';
  requestAnimationFrame(() => requestAnimationFrame(() => {
    bar.style.transition = 'width 1.2s ease';
    bar.style.width = '75%';
  }));

  setTimeout(() => { frame.src = url; }, 220);

  frame.onload = () => {
    bar.style.transition = 'width .3s ease';
    bar.style.width = '100%';
    setTimeout(() => {
      bar.style.opacity = '0';
      setTimeout(() => {
        bar.style.width = '0%';
        bar.style.opacity = '1';
      }, 400);
    }, 300);
  };

  setTimeout(() => { iframeView.classList.add('on'); }, 260);
  setActive(btn);
  titleEl.textContent = labels[key] || key;
  history.pushState({}, '', '?project=' + key);
}

function toggleSidebar() {
  if (window.innerWidth <= 700) {
    // Mobile: slide in/out with overlay
    const isOpen = sidebar.classList.toggle('open');
    overlay.classList.toggle('show', isOpen);
  } else {
    // Desktop: collapse sidebar and expand main
    sidebarOpen = !sidebarOpen;
    sidebar.classList.toggle('hide', !sidebarOpen);
    mainEl.classList.toggle('full', !sidebarOpen);
  }
}

function toggleTheme() {
  const isLight = document.body.classList.toggle('light');
  document.body.classList.toggle('dark', !isLight);
  document.getElementById('theme-icon').textContent = isLight ? 'dark_mode' : 'light_mode';
  document.getElementById('theme-label').textContent = isLight ? 'Dark Mode' : 'Light Mode';
}

// Browser back/forward
window.addEventListener('popstate', () => {
  const p = new URLSearchParams(location.search).get('project');
  if (p && sites[p]) loadSite(p, document.getElementById('btn-' + p));
  else showHome();
});

// Load from URL on first visit
window.addEventListener('DOMContentLoaded', () => {
  const p = new URLSearchParams(location.search).get('project');
  if (p && sites[p]) loadSite(p, document.getElementById('btn-' + p));
});
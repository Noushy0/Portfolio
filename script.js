const cursor = document.getElementById('cursor');
const appRoot = document.getElementById('app-root');

const modeToggle = localStorage.getItem('mode') || 'eco';
let isEco = modeToggle === 'eco';

function applyMode() {
  const badge = document.getElementById('ecoindex-badge');

  if (!appRoot) return;

  if (isEco) {
    appRoot.classList.add('eco-mode');
    if (cursor) cursor.style.opacity = '0';
    if (badge) badge.removeAttribute('data-theme');
  } else {
    appRoot.classList.remove('eco-mode');
    if (cursor) cursor.style.opacity = '1';
    if (badge) badge.setAttribute('data-theme', 'dark');
  }
}

applyMode();

function toggleEcoMode() {
  isEco = !isEco;
  localStorage.setItem('mode', isEco ? 'eco' : 'normal');
  applyMode();
}

window.toggleEcoMode = toggleEcoMode;

const supportsHover = window.matchMedia('(hover: hover)').matches;

document.addEventListener('mousemove', (e) => {
  if (!isEco && cursor && supportsHover && window.innerWidth > 768) {
    cursor.style.transform = `translate(${e.clientX - 16}px, ${e.clientY - 16}px)`;
    cursor.style.opacity = '1';
  }
});

document.addEventListener('mousedown', () => {
  if (!isEco && cursor) {
    cursor.style.transform += ' scale(0.8)';
  }
});

document.addEventListener('mouseup', () => {
  if (!isEco && cursor) {
    cursor.style.transform = cursor.style.transform.replace(' scale(0.8)', '');
  }
});

window.addEventListener('scroll', () => {
  const header = document.querySelector('header');
  if (!header) return;

  if (window.scrollY > 50) {
    header.classList.add('backdrop-blur-xl');
    header.classList.add(isEco ? 'bg-white/70' : 'bg-black/30');
    header.classList.remove(isEco ? 'bg-black/30' : 'bg-white/70');
  } else {
    header.classList.remove('backdrop-blur-xl', 'bg-black/30', 'bg-white/70');
  }
});

// ── Statistiques de clics (GoatCounter : sans cookie, ~3,5 Ko, ignoré en local) ──
// Compte chaque clic sur un lien ou un bouton, avec la page et le nom du bouton.
const GOATCOUNTER_SITE = 'inesghannouchi';

if (!GOATCOUNTER_SITE.startsWith('__')) {
  const gc = document.createElement('script');
  gc.async = true;
  gc.dataset.goatcounter = `https://${GOATCOUNTER_SITE}.goatcounter.com/count`;
  gc.src = 'https://gc.zgo.at/count.js';
  document.head.appendChild(gc);
}

function trackEvent(name) {
  if (window.goatcounter && window.goatcounter.count) {
    window.goatcounter.count({ path: name, title: name, event: true });
  }
}

window.trackEvent = trackEvent;

document.addEventListener('click', (e) => {
  const el = e.target.closest('a, button');
  if (!el) return;
  const page = location.pathname.split('/').pop().replace('.html', '') || 'accueil';
  const label = el.id === 'eco-toggle'
    ? `Eco mode ${isEco ? 'désactivé' : 'activé'}`
    : el.dataset.track || el.getAttribute('aria-label') || el.textContent.trim().replace(/\s+/g, ' ').slice(0, 60) || el.id || 'sans nom';
  trackEvent(`clic · ${page} · ${label}`);
}, true);

document.getElementById('year').textContent = new Date().getFullYear();

// --- Mobile nav toggle ---
const navToggle = document.getElementById('nav-toggle');
const navLinks = document.getElementById('nav-links');
navToggle.addEventListener('click', () => navLinks.classList.toggle('open'));

// --- Page routing: show one section at a time, like separate pages ---
const pages = document.querySelectorAll('.page');
// OJO: solo los <a> con data-page (los links de navegación), NO las secciones
// .page (que también tienen data-page) — si no, el clic "burbujea" hacia el
// contenedor padre y dispara su propia navegación justo después.
const pageLinks = document.querySelectorAll('a[data-page]');

function showPage(pageName) {
  pages.forEach(p => p.classList.toggle('active', p.dataset.page === pageName));
  // resalta el link activo del menú (solo los del nav, no el logo ni el footer)
  document.querySelectorAll('.nav-links a').forEach(link => {
    link.classList.toggle('active-link', link.dataset.page === pageName);
  });
  window.scrollTo({ top: 0, behavior: 'instant' });
  navLinks.classList.remove('open'); // cierra el menú móvil si estaba abierto
}

pageLinks.forEach(el => {
  el.addEventListener('click', (e) => {
    e.preventDefault();
    showPage(el.dataset.page);
  });
});

// Página inicial
showPage('home');

// --- Contact side panel ---
const contactBtn = document.getElementById('contact-btn');
const contactPanel = document.getElementById('contact-panel');
const contactOverlay = document.getElementById('contact-overlay');
const contactClose = document.getElementById('contact-close');

function openContact() {
  contactPanel.classList.add('open');
  contactOverlay.classList.add('open');
}
function closeContact() {
  contactPanel.classList.remove('open');
  contactOverlay.classList.remove('open');
}
contactBtn.addEventListener('click', openContact);
contactClose.addEventListener('click', closeContact);
contactOverlay.addEventListener('click', closeContact);
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeContact();
});

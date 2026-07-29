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
  if (e.key === 'Escape') { closeContact(); closePhotoModal(); }
  // Flechas del teclado para deslizar el carrusel de fotos cuando está abierto
  if (photoModal.classList.contains('open')) {
    const track = photoModalGallery.querySelector('.photo-slider-track');
    const total = track ? track.children.length : 0;
    if (track && total > 1) {
      if (e.key === 'ArrowLeft') moveSlide(-1, track, total);
      if (e.key === 'ArrowRight') moveSlide(1, track, total);
    }
  }
});

// ============================================================
// --- Galería de fotos por proyecto (carrusel deslizable) ---
// ============================================================
// 👉 PARA AGREGAR TUS FOTOS:
// 1. Sube tus imágenes a la carpeta assets/ (o crea una subcarpeta,
//    por ejemplo assets/proyectos/, para tenerlas más ordenadas).
// 2. Agrega la ruta de cada imagen dentro del arreglo del proyecto
//    correspondiente en "projectPhotos", en el orden en que quieras
//    que aparezcan al deslizar (la primera foto del arreglo es la
//    que se ve primero).
// 3. Puedes poner tantas fotos como quieras por proyecto: el
//    carrusel arma automáticamente las flechas y los puntos según
//    la cantidad de imágenes que pongas aquí.
//
// Ejemplo de cómo se vería ya con fotos:
//   pipelinelab: [
//     'assets/proyectos/pipelinelab-1.jpg',
//     'assets/proyectos/pipelinelab-2.jpg',
//     'assets/proyectos/pipelinelab-3.jpg',
//   ],
// ============================================================
const projectNames = {
  pipelinelab: 'PipelineLab',
  vetcare: 'VetCare',
  mobiledataetl: 'MobileDataETL',
  etldeportes: 'ETL-Deportes',
  limpiezadatabigdata: 'limpiezaData-Bigdata',
  hranalyzer: 'HRAnalyzer',
};

const projectPhotos = {
  pipelinelab: [
    'assets/proyecto/9.png', 
   'assets/proyecto/10.png'
  ],
  vetcare: [
    // 👉 Agrega aquí las rutas de las capturas de VetCare, en orden.
   'assets/proyecto/1.png', 
   'assets/proyecto/2.png', 
   'assets/proyecto/3.png', 
   'assets/proyecto/4.png', 
   'assets/proyecto/5.png', 
   'assets/proyecto/6.png', 
   'assets/proyecto/7.png', 
   'assets/proyecto/8.png'

  ]
};

const photoModal = document.getElementById('photo-modal');
const photoModalOverlay = document.getElementById('photo-modal-overlay');
const photoModalClose = document.getElementById('photo-modal-close');
const photoModalTitle = document.getElementById('photo-modal-title');
const photoModalGallery = document.getElementById('photo-modal-gallery');

let currentSlideIndex = 0; // foto actual dentro del carrusel abierto

function openPhotoModal(projectKey) {
  photoModalTitle.textContent = projectNames[projectKey] || 'Proyecto';
  photoModalGallery.innerHTML = '';
  currentSlideIndex = 0;

  const photos = projectPhotos[projectKey] || [];

  if (photos.length === 0) {
    photoModalGallery.innerHTML =
      '<p class="photo-modal-empty">📷 Aún no has agregado capturas de este proyecto.<br>Sube tus imágenes a la carpeta <code>assets</code> y agrega la ruta en el arreglo <code>projectPhotos</code> dentro de script.js.</p>';
  } else {
    // --- Carrusel: una pista (track) que contiene todas las fotos en fila,
    // y que se desliza paso a paso con las flechas o los puntos ---
    const track = document.createElement('div');
    track.className = 'photo-slider-track';
    photos.forEach(src => {
      const img = document.createElement('img');
      img.src = src;
      img.alt = `Captura de ${projectNames[projectKey] || projectKey}`;
      track.appendChild(img);
    });

    const slider = document.createElement('div');
    slider.className = 'photo-slider';
    slider.appendChild(track);

    // Flechas (solo si hay más de una foto)
    if (photos.length > 1) {
      const prevBtn = document.createElement('button');
      prevBtn.className = 'slider-arrow slider-prev';
      prevBtn.setAttribute('aria-label', 'Foto anterior');
      prevBtn.textContent = '‹';
      prevBtn.addEventListener('click', () => moveSlide(-1, track, photos.length));

      const nextBtn = document.createElement('button');
      nextBtn.className = 'slider-arrow slider-next';
      nextBtn.setAttribute('aria-label', 'Foto siguiente');
      nextBtn.textContent = '›';
      nextBtn.addEventListener('click', () => moveSlide(1, track, photos.length));

      slider.appendChild(prevBtn);
      slider.appendChild(nextBtn);
    }

    photoModalGallery.appendChild(slider);

    // Puntos de navegación + contador "1 / N"
    if (photos.length > 1) {
      const dots = document.createElement('div');
      dots.className = 'slider-dots';
      photos.forEach((_, i) => {
        const dot = document.createElement('button');
        dot.className = 'slider-dot' + (i === 0 ? ' active' : '');
        dot.setAttribute('aria-label', `Ir a la foto ${i + 1}`);
        dot.addEventListener('click', () => goToSlide(i, track, photos.length));
        dots.appendChild(dot);
      });
      photoModalGallery.appendChild(dots);

      const counter = document.createElement('p');
      counter.className = 'slider-counter';
      counter.textContent = `1 / ${photos.length}`;
      photoModalGallery.appendChild(counter);
    }
  }

  photoModal.classList.add('open');
  photoModalOverlay.classList.add('open');
}

// Mueve el carrusel un paso adelante (1) o atrás (-1)
function moveSlide(direction, track, total) {
  currentSlideIndex = (currentSlideIndex + direction + total) % total;
  updateSlidePosition(track, total);
}

// Salta directamente a una foto específica (al hacer clic en un punto)
function goToSlide(index, track, total) {
  currentSlideIndex = index;
  updateSlidePosition(track, total);
}

// Aplica el desplazamiento visual y actualiza puntos + contador
function updateSlidePosition(track, total) {
  track.style.transform = `translateX(-${currentSlideIndex * 100}%)`;
  photoModalGallery.querySelectorAll('.slider-dot').forEach((dot, i) => {
    dot.classList.toggle('active', i === currentSlideIndex);
  });
  const counter = photoModalGallery.querySelector('.slider-counter');
  if (counter) counter.textContent = `${currentSlideIndex + 1} / ${total}`;
}

function closePhotoModal() {
  photoModal.classList.remove('open');
  photoModalOverlay.classList.remove('open');
}

document.querySelectorAll('.btn-photos').forEach(btn => {
  btn.addEventListener('click', () => openPhotoModal(btn.dataset.project));
});
photoModalClose.addEventListener('click', closePhotoModal);
photoModalOverlay.addEventListener('click', closePhotoModal);

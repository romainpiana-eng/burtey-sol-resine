/* ============================================
   BURTEY SOL & RÉSINE — JavaScript
   ============================================ */

// --- Navigation : scrolled state ---
const nav = document.querySelector('.nav');
if (nav) {
  const handleScroll = () => {
    if (window.scrollY > 30) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();
}

// --- Burger menu mobile ---
const burger = document.querySelector('.nav__burger');
const mobileMenu = document.querySelector('.nav__mobile');
if (burger && mobileMenu) {
  burger.addEventListener('click', () => {
    burger.classList.toggle('open');
    mobileMenu.classList.toggle('open');
    document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
  });

  mobileMenu.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      burger.classList.remove('open');
      mobileMenu.classList.remove('open');
      document.body.style.overflow = '';
    });
  });
}

// --- Reveal on scroll ---
const reveals = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window && reveals.length) {
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -60px 0px' }
  );
  reveals.forEach((el) => io.observe(el));
} else {
  reveals.forEach((el) => el.classList.add('in-view'));
}

// --- Filtre galerie ---
const filterBtns = document.querySelectorAll('.gallery-filter button');
const galleryItems = document.querySelectorAll('.gallery__item');
if (filterBtns.length && galleryItems.length) {
  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const filter = btn.dataset.filter;
      filterBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      galleryItems.forEach((item) => {
        if (filter === 'all' || item.dataset.cat === filter) {
          item.style.display = '';
        } else {
          item.style.display = 'none';
        }
      });
    });
  });
}

// --- Lightbox galerie (clic sur photo = vue plein écran) ---
const lightbox = document.getElementById('lightbox');
if (lightbox && galleryItems.length) {
  const lbImg = lightbox.querySelector('.lightbox__img');
  const lbCaption = lightbox.querySelector('.lightbox__caption');
  const lbCounter = lightbox.querySelector('.lightbox__counter');
  const btnPrev = lightbox.querySelector('.lightbox__prev');
  const btnNext = lightbox.querySelector('.lightbox__next');
  const btnClose = lightbox.querySelector('.lightbox__close');

  // Construire la liste des items qui ont une vraie image (pas les SVG)
  const photoItems = Array.from(galleryItems).filter(item => item.querySelector('img'));
  let currentIndex = 0;

  function openLightbox(index) {
    currentIndex = index;
    updateLightbox();
    lightbox.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('is-open');
    document.body.style.overflow = '';
  }

  function updateLightbox() {
    const item = photoItems[currentIndex];
    const img = item.querySelector('img');
    const titleEl = item.querySelector('.gallery__caption h4');
    const subEl = item.querySelector('.gallery__caption p');
    lbImg.src = img.src;
    lbImg.alt = img.alt;
    lbCaption.innerHTML = titleEl ? `<strong>${titleEl.textContent}</strong>` : '';
    if (subEl) lbCaption.innerHTML += `<span>${subEl.textContent}</span>`;
    lbCounter.textContent = `${currentIndex + 1} / ${photoItems.length}`;
  }

  function next() {
    currentIndex = (currentIndex + 1) % photoItems.length;
    updateLightbox();
  }
  function prev() {
    currentIndex = (currentIndex - 1 + photoItems.length) % photoItems.length;
    updateLightbox();
  }

  // Clic sur une image → ouvrir
  photoItems.forEach((item, idx) => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      openLightbox(idx);
    });
  });

  // Boutons
  btnClose.addEventListener('click', closeLightbox);
  btnNext.addEventListener('click', next);
  btnPrev.addEventListener('click', prev);

  // Clic sur le fond (mais pas sur l'image) → fermer
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  // Clavier : Échap, flèches gauche/droite
  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('is-open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') next();
    if (e.key === 'ArrowLeft') prev();
  });

  // Swipe tactile sur mobile
  let touchStartX = 0;
  lightbox.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  });
  lightbox.addEventListener('touchend', (e) => {
    const touchEndX = e.changedTouches[0].screenX;
    const diff = touchEndX - touchStartX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) prev();
      else next();
    }
  });
}

// --- Formulaire contact (validation + envoi réel via Formspree) ---
const form = document.querySelector('form.form') || document.querySelector('.form form');
if (form) {
  const feedback = document.getElementById('formFeedback');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Validation HTML5
    if (!form.checkValidity()) {
      form.reportValidity();
      if (feedback) {
        feedback.textContent = 'Merci de compléter les champs obligatoires.';
        feedback.className = 'form__feedback is-error';
      }
      return;
    }

    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = 'Envoi en cours…';
    submitBtn.disabled = true;
    if (feedback) {
      feedback.textContent = '';
      feedback.className = 'form__feedback';
    }

    try {
      const response = await fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { 'Accept': 'application/json' }
      });

      if (response.ok) {
        // Succès
        submitBtn.innerHTML = '✓ Demande envoyée';
        form.reset();
        if (feedback) {
          feedback.textContent = 'Merci ! Votre demande a bien été envoyée. Romain revient vers vous sous 24h.';
          feedback.className = 'form__feedback is-success';
        }
        setTimeout(() => {
          submitBtn.innerHTML = originalText;
          submitBtn.disabled = false;
        }, 4000);
      } else {
        // Erreur Formspree
        const data = await response.json();
        throw new Error(data?.errors?.map(e => e.message).join(', ') || 'Erreur inconnue');
      }
    } catch (err) {
      // Erreur réseau ou autre
      submitBtn.innerHTML = originalText;
      submitBtn.disabled = false;
      if (feedback) {
        feedback.textContent = 'Une erreur est survenue. Merci de nous contacter directement au 06 09 48 54 18 ou par email.';
        feedback.className = 'form__feedback is-error';
      }
    }
  });
}

// --- Année dynamique footer ---
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

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

// --- Formulaire contact (validation client + simulation envoi) ---
const form = document.querySelector('form.form') || document.querySelector('.form form');
if (form) {
  const feedback = document.getElementById('formFeedback');
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Vérification HTML5
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

    // Simulation : en production, envoyer à un endpoint (ex: Formspree, Netlify Forms, API)
    setTimeout(() => {
      submitBtn.innerHTML = '✓ Demande envoyée';
      form.reset();
      if (feedback) {
        feedback.textContent = 'Merci ! Votre demande a bien été envoyée. Je reviens vers vous sous 24h.';
        feedback.className = 'form__feedback is-success';
      }
      setTimeout(() => {
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
      }, 3000);
    }, 1200);
  });
}

// --- Année dynamique footer ---
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

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

// --- Année dynamique footer ---
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// ============================================
//   UMAMI — mesure d'audience sans cookie
//   ► Colle ici l'identifiant du site (Umami > Settings > Websites >
//     Edit > Tracking code : valeur de data-website-id).
//   ► Vérifie aussi l'adresse du script affichée dans ce même code.
//   Tant que UMAMI_ID est vide, rien n'est chargé.
// ============================================
const UMAMI_ID = '2bea83d0-92a9-4940-83f5-d232e1c66505';
const UMAMI_SRC = 'https://cloud.umami.is/script.js';

(() => {
  if (!UMAMI_ID) return;
  try { if (localStorage.getItem('umami.disabled')) return; } catch (e) {}
  const s = document.createElement('script');
  s.defer = true;
  s.src = UMAMI_SRC;
  s.setAttribute('data-website-id', UMAMI_ID);
  s.setAttribute('data-domains', 'burtey-sol-resine.fr'); // ignore les tests en local
  document.head.appendChild(s);
})();

// ============================================
//   MESURE D'AUDIENCE — conversions
//   Les événements apparaissent dans Umami > Events, sans configuration.
// ============================================
const track = (name) => {
  try {
    if (window.umami && typeof window.umami.track === 'function') window.umami.track(name);
    if (Array.isArray(window._paq)) window._paq.push(['trackEvent', 'Contact', name]);
  } catch (e) {}
};

// --- Clics de contact (tous les liens du site, y compris le bouton flottant) ---
document.addEventListener('click', (e) => {
  const link = e.target.closest('a[href]');
  if (!link) return;
  const href = link.getAttribute('href');
  if (href.startsWith('https://wa.me/')) track('Clic WhatsApp');
  else if (href.startsWith('tel:')) track('Clic téléphone');
  else if (href.startsWith('mailto:')) track('Clic e-mail');
});

// --- Formulaire de devis ---
// Le formulaire quitte la page vers Formspree : on laisse 400 ms à
// l'événement pour partir, puis on envoie — la demande part dans tous les cas.
const devisForm = document.querySelector('form[action*="formspree.io"]');
if (devisForm) {
  devisForm.addEventListener('submit', (e) => {
    if (devisForm.dataset.sending) return;
    e.preventDefault();
    devisForm.dataset.sending = '1';
    track('Devis envoyé');
    setTimeout(() => devisForm.submit(), 400);
  });
}

// ============================================
//   CARTE GOOGLE MAPS — chargée uniquement au clic
//   (aucun échange avec Google avant l'action du visiteur)
// ============================================
document.querySelectorAll('[data-map-src]').forEach((wrap) => {
  const btn = wrap.querySelector('.map-consent button');
  if (!btn) return;
  btn.addEventListener('click', () => {
    const iframe = document.createElement('iframe');
    iframe.src = wrap.dataset.mapSrc;
    iframe.title = wrap.dataset.mapTitle || 'Carte';
    iframe.setAttribute('allowfullscreen', '');
    iframe.setAttribute('referrerpolicy', 'no-referrer-when-downgrade');
    iframe.style.border = '0';
    wrap.querySelector('.map-consent').replaceWith(iframe);
  });
});

// --- Opposition à la mesure d'audience (page Mentions légales) ---
// Umami ne compte plus les visites quand localStorage « umami.disabled » existe.
const optBtn = document.querySelector('[data-analytics-optout]');
const optStatus = document.querySelector('[data-analytics-optout-status]');
if (optBtn) {
  const isOff = () => { try { return !!localStorage.getItem('umami.disabled'); } catch (e) { return false; } };
  const refresh = () => {
    optBtn.textContent = isOff() ? 'Être à nouveau comptabilisé' : 'Ne plus être comptabilisé';
    if (optStatus) optStatus.textContent = isOff()
      ? 'Vos visites ne sont plus mesurées sur cet appareil.'
      : 'Vos visites sont mesurées de façon anonyme.';
  };
  optBtn.addEventListener('click', () => {
    try {
      if (isOff()) localStorage.removeItem('umami.disabled');
      else localStorage.setItem('umami.disabled', '1');
    } catch (e) {}
    refresh();
  });
  refresh();
}

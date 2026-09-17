// CSP uyumlu olay yönetimi.
// HTML'deki inline onclick/onerror/onsubmit yerine data-* öznitelikleri kullanılır,
// böylece Content-Security-Policy'de script-src 'unsafe-inline' gerekmez.
(function () {
  'use strict';

  // --- Görsel yüklenemezse yedek görsele geç (eski: onerror="this.src='...'") ---
  function bindFallbacks(root) {
    (root || document).querySelectorAll('img[data-fallback]').forEach(function (img) {
      if (img.dataset.fallbackBound) return;
      img.dataset.fallbackBound = '1';
      img.addEventListener('error', function handler() {
        var fb = img.getAttribute('data-fallback');
        img.removeEventListener('error', handler);
        if (fb && img.getAttribute('src') !== fb) img.src = fb;
      });
      // Listener eklenmeden önce hata olduysa yakala
      if (img.complete && img.naturalWidth === 0) {
        var fb = img.getAttribute('data-fallback');
        if (fb && img.getAttribute('src') !== fb) img.src = fb;
      }
    });
  }

  // --- Tıklama olayları (delegasyon) ---
  document.addEventListener('click', function (e) {
    var el;

    // Mobil menü butonu: çekmeceyi aç / kapat
    el = e.target.closest('#mobileMenuBtn');
    if (el) {
      e.preventDefault();
      var drawer = document.getElementById('mobileDrawer');
      if (drawer) drawer.classList.toggle('hidden');
      return;
    }

    // Mobil çekmece içindeki linke tıklanınca çekmeceyi kapat
    el = e.target.closest('#mobileDrawer a');
    if (el) {
      var drawer = document.getElementById('mobileDrawer');
      if (drawer) drawer.classList.add('hidden');
    }

    // Mobil çekmece dışına tıklanınca kapat
    var drawer = document.getElementById('mobileDrawer');
    var menuBtn = document.getElementById('mobileMenuBtn');
    if (drawer && !drawer.classList.contains('hidden')) {
      if (!drawer.contains(e.target) && (!menuBtn || !menuBtn.contains(e.target))) {
        drawer.classList.add('hidden');
      }
    }

    // Lightbox modal dışı karanlık alana tıklanınca kapat
    if (e.target && e.target.id === 'lightboxModal' && typeof window.closeLightbox === 'function') {
      window.closeLightbox();
      return;
    }

    // Galeri: lightbox aç
    el = e.target.closest('[data-lb-src]');
    if (el && typeof window.openLightbox === 'function') {
      e.preventDefault();
      window.openLightbox(
        el.getAttribute('data-lb-src'),
        el.getAttribute('data-lb-title') || '',
        el.getAttribute('data-lb-desc') || ''
      );
      return;
    }

    // Lightbox kapat
    el = e.target.closest('[data-lb-close]');
    if (el && typeof window.closeLightbox === 'function') {
      e.preventDefault();
      window.closeLightbox();
      return;
    }

    // Proje filtresi
    el = e.target.closest('[data-filter]');
    if (el && typeof window.filterProjects === 'function') {
      e.preventDefault();
      window.filterProjects(el.getAttribute('data-filter'), el);
      return;
    }

    // Arıza teşhis seçimi
    el = e.target.closest('[data-fault]');
    if (el && typeof window.selectFault === 'function') {
      e.preventDefault();
      window.selectFault(el.getAttribute('data-fault'), el);
      return;
    }

    // Hizmet seçimi (form)
    el = e.target.closest('[data-service]');
    if (el && typeof window.setService === 'function') {
      e.preventDefault();
      window.setService(el.getAttribute('data-service'), el);
      return;
    }
  });

  // --- Form gönderimi ---
  document.addEventListener('submit', function (e) {
    var form = e.target.closest('[data-form-submit]');
    if (form && typeof window.handleFormSubmit === 'function') {
      window.handleFormSubmit(e);
    }
  });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { bindFallbacks(); });
  } else {
    bindFallbacks();
  }
})();

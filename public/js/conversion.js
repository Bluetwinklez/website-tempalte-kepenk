// Google Ads Dönüşüm Takibi: telefon ve WhatsApp tıklamaları (Şablon)
(function () {
  var CONVERSION_ID = 'AW-XXXXXXXXXX/XXXXXXXXXXXX'; // Kendi Google Ads dönüşüm etiketiniz
  var fired = false;

  function sendConversion(type) {
    if (fired || typeof gtag !== 'function' || CONVERSION_ID.indexOf('XXXX') !== -1) return;
    fired = true;
    gtag('event', 'conversion', {
      'send_to': CONVERSION_ID,
      'value': 1.0,
      'currency': 'TRY'
    });
    gtag('event', 'iletisim_tiklama', { 'method': type });
  }

  document.addEventListener('click', function (e) {
    var link = e.target.closest('a[href^="tel:"], a[href*="wa.me"], a[href*="api.whatsapp.com"]');
    if (!link) return;
    sendConversion(link.getAttribute('href').indexOf('tel:') === 0 ? 'telefon' : 'whatsapp');
  }, true);
})();

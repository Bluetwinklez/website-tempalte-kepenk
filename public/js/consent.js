// Çerez onayı + Google Consent Mode v2
// Analitik ve reklam çerezleri, kullanıcı onay verene kadar çalışmaz.
(function () {
  'use strict';

  var KEY = 'ek_cerez_onay';        // 'kabul' | 'red'
  var MAX_AGE = 180;                // gün — bu süre sonunda tekrar sorulur

  function readConsent() {
    try {
      var raw = localStorage.getItem(KEY);
      if (!raw) return null;
      var data = JSON.parse(raw);
      if (!data || !data.durum || !data.tarih) return null;
      var gecenGun = (Date.now() - data.tarih) / 86400000;
      if (gecenGun > MAX_AGE) return null;
      return data.durum;
    } catch (e) {
      return null;
    }
  }

  function writeConsent(durum) {
    try {
      localStorage.setItem(KEY, JSON.stringify({ durum: durum, tarih: Date.now() }));
    } catch (e) { /* localStorage kapalıysa sessizce geç */ }
  }

  function gtagSafe() {
    if (typeof window.gtag === 'function') {
      window.gtag.apply(null, arguments);
    } else {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push(arguments);
    }
  }

  function applyConsent(durum) {
    var izin = durum === 'kabul' ? 'granted' : 'denied';
    gtagSafe('consent', 'update', {
      ad_storage: izin,
      ad_user_data: izin,
      ad_personalization: izin,
      analytics_storage: izin
    });
  }

  // --- Bant arayüzü ---
  function buildBanner() {
    var bar = document.createElement('div');
    bar.id = 'cerezBandi';
    bar.setAttribute('role', 'dialog');
    bar.setAttribute('aria-label', 'Çerez bilgilendirmesi');
    bar.style.cssText = [
      'position:fixed', 'left:12px', 'right:12px', 'bottom:12px', 'z-index:9999',
      'background:#0f172a', 'color:#e2e8f0', 'border:1px solid #1e293b',
      'border-radius:16px', 'padding:16px 18px', 'box-shadow:0 12px 40px rgba(0,0,0,.35)',
      'display:flex', 'flex-wrap:wrap', 'gap:12px', 'align-items:center',
      'justify-content:space-between', 'max-width:900px', 'margin:0 auto',
      'font-family:inherit', 'font-size:13px', 'line-height:1.6'
    ].join(';');

    var text = document.createElement('div');
    text.style.cssText = 'flex:1 1 320px;min-width:240px';
    text.innerHTML =
      'Siteyi geliştirmek ve reklam performansını ölçmek için çerez kullanıyoruz. ' +
      'Zorunlu çerezler dışındakiler yalnızca onayınızla çalışır. ' +
      '<a href="/gizlilik" style="color:#fb923c;font-weight:700;text-decoration:underline">Detaylı bilgi</a>';

    var actions = document.createElement('div');
    actions.style.cssText = 'display:flex;gap:8px;flex:0 0 auto';

    var reject = document.createElement('button');
    reject.type = 'button';
    reject.textContent = 'Reddet';
    reject.style.cssText = 'padding:10px 18px;border-radius:10px;border:1px solid #334155;background:transparent;color:#e2e8f0;font-weight:700;font-family:inherit;font-size:13px;cursor:pointer';

    var accept = document.createElement('button');
    accept.type = 'button';
    accept.textContent = 'Kabul Et';
    accept.style.cssText = 'padding:10px 22px;border-radius:10px;border:0;background:#ea580c;color:#fff;font-weight:700;font-family:inherit;font-size:13px;cursor:pointer';

    reject.addEventListener('click', function () { decide('red'); });
    accept.addEventListener('click', function () { decide('kabul'); });

    actions.appendChild(reject);
    actions.appendChild(accept);
    bar.appendChild(text);
    bar.appendChild(actions);
    return bar;
  }

  function decide(durum) {
    writeConsent(durum);
    applyConsent(durum);
    var bar = document.getElementById('cerezBandi');
    if (bar) bar.remove();
  }

  function showBanner() {
    if (document.getElementById('cerezBandi')) return;
    document.body.appendChild(buildBanner());
  }

  // --- Başlat ---
  // Varsayılan: izin yok (Consent Mode v2). gtag yüklenmeden önce dataLayer'a yazılır.
  window.dataLayer = window.dataLayer || [];
  gtagSafe('consent', 'default', {
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
    analytics_storage: 'denied',
    wait_for_update: 500
  });

  var mevcut = readConsent();
  if (mevcut) {
    applyConsent(mevcut);
  } else if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', showBanner);
  } else {
    showBanner();
  }

  // Gizlilik sayfasındaki "tercihimi sıfırla" düğmesi
  document.addEventListener('click', function (e) {
    var btn = e.target.closest('#resetConsent');
    if (!btn) return;
    try { localStorage.removeItem(KEY); } catch (err) {}
    var info = document.getElementById('consentStatus');
    if (info) info.textContent = 'Tercihiniz sıfırlandı. Çerez bandı yeniden gösteriliyor.';
    showBanner();
  });

  // Gizlilik sayfasında mevcut tercihi göster
  document.addEventListener('DOMContentLoaded', function () {
    var info = document.getElementById('consentStatus');
    if (!info) return;
    var d = readConsent();
    info.textContent = d === 'kabul'
      ? 'Mevcut tercihiniz: analitik ve reklam çerezlerine onay verdiniz.'
      : d === 'red'
        ? 'Mevcut tercihiniz: yalnızca zorunlu çerezler kullanılıyor.'
        : 'Henüz bir tercih kaydedilmemiş.';
  });
})();

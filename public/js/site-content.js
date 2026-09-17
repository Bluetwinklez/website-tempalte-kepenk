// Site içeriğini (telefon, başlık, hizmet kartları) Firestore'dan çekip sayfaya uygular.
// Firestore'a ulaşılamazsa veya alan boşsa, HTML'deki mevcut varsayılan metin aynen kalır.
(function () {
  'use strict';

  var DEFAULT_PHONE_DIGITS = '905536881976';
  var ADMIN_UID = 'MZw1ENzRMre49h9UckT7uIiD9LG2';

  window.SITE_CONTENT = { phoneDigits: DEFAULT_PHONE_DIGITS };

  function escapeHtmlLocal(str) {
    var div = document.createElement('div');
    div.textContent = str || '';
    return div.innerHTML;
  }

  function showMaintenanceOverlay(msg) {
    if (document.getElementById('maintenanceOverlay')) return;
    var ov = document.createElement('div');
    ov.id = 'maintenanceOverlay';
    ov.style.cssText = 'position:fixed;inset:0;z-index:999999;background:#0f172a;color:#fff;' +
      'display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;' +
      'padding:32px;font-family:"Plus Jakarta Sans",system-ui,sans-serif';
    ov.innerHTML =
      '<div style="font-size:40px;margin-bottom:16px">🛠️</div>' +
      '<h1 style="font-family:\'Outfit\',sans-serif;font-size:22px;margin:0 0 10px">Bakımdayız</h1>' +
      '<p style="max-width:420px;color:#cbd5e1;font-size:15px;line-height:1.6;margin:0">' + escapeHtmlLocal(msg) + '</p>';
    document.body.appendChild(ov);
    document.body.style.overflow = 'hidden';
  }

  function hideMaintenanceOverlay() {
    var ov = document.getElementById('maintenanceOverlay');
    if (ov) ov.remove();
    document.body.style.overflow = '';
  }

  function isMaintenanceExpired(data) {
    if (!data.maintenanceUntil) return false;
    var until = new Date(data.maintenanceUntil);
    return !isNaN(until.getTime()) && Date.now() >= until.getTime();
  }

  function handleMaintenanceMode(data) {
    if (!data.maintenanceMode || isMaintenanceExpired(data)) {
      hideMaintenanceOverlay();
      return;
    }
    var msg = data.maintenanceMessage || 'Sitemiz kısa bir bakımda. Kısa süre sonra tekrar hizmetinizdeyiz.';
    showMaintenanceOverlay(msg);
    if (typeof firebase.auth !== 'function') return;
    firebase.auth().onAuthStateChanged(function (user) {
      if (user && user.uid === ADMIN_UID) hideMaintenanceOverlay();
      else showMaintenanceOverlay(msg);
    });
  }

  var DEFAULT_ORANGE = '#EA580C';
  var DEFAULT_AMBER = '#F97316';

  function applyTheme(data) {
    var orange = data.themeColorOrange || DEFAULT_ORANGE;
    var amber = data.themeColorAmber || DEFAULT_AMBER;
    if (orange === DEFAULT_ORANGE && amber === DEFAULT_AMBER) return;

    document.documentElement.style.setProperty('--brand-orange', orange);
    document.documentElement.style.setProperty('--brand-amber', amber);

    var rules = [
      ['.bg-brand-orange', 'background-color:' + orange + ' !important'],
      ['.text-brand-orange', 'color:' + orange + ' !important'],
      ['.text-brand-amber', 'color:' + amber + ' !important'],
      ['.hover\\:bg-brand-orange:hover', 'background-color:' + orange + ' !important'],
      ['.hover\\:text-brand-orange:hover', 'color:' + orange + ' !important'],
      ['.hover\\:border-brand-orange:hover', 'border-color:' + orange + ' !important'],
      ['.focus\\:border-brand-orange:focus', 'border-color:' + orange + ' !important'],
      ['.focus\\:ring-brand-orange:focus', '--tw-ring-color:' + orange + ' !important'],
      ['.group:hover .group-hover\\:bg-brand-orange', 'background-color:' + orange + ' !important'],
      ['.group:hover .group-hover\\:text-brand-orange', 'color:' + orange + ' !important'],
      ['.selection\\:bg-brand-orange::selection', 'background-color:' + orange + ' !important'],
      ['.from-brand-orange', '--tw-gradient-from:' + orange + ' var(--tw-gradient-from-position) !important'],
      ['.via-brand-orange', '--tw-gradient-via:' + orange + ' var(--tw-gradient-via-position) !important'],
      ['.to-brand-amber', '--tw-gradient-to:' + amber + ' var(--tw-gradient-to-position) !important']
    ];
    var style = document.createElement('style');
    style.id = 'theme-color-override';
    style.textContent = rules.map(function (r) { return r[0] + '{' + r[1] + '}'; }).join('\n');
    document.head.appendChild(style);
  }

  function applyTextFields(data) {
    Object.keys(data).forEach(function (key) {
      var val = data[key];
      if (typeof val !== 'string' || !val) return;
      document.querySelectorAll('[data-cms="' + key + '"]').forEach(function (el) {
        el.textContent = val;
      });
    });
  }

  function applyImages(data) {
    Object.keys(data).forEach(function (key) {
      var val = data[key];
      if (typeof val !== 'string' || !val) return;
      document.querySelectorAll('[data-cms-img="' + key + '"]').forEach(function (el) {
        el.src = val;
      });
    });
  }

  function applyPhone(phoneDisplay, phoneDigits) {
    if (!phoneDigits || phoneDigits === DEFAULT_PHONE_DIGITS) return;
    window.SITE_CONTENT.phoneDigits = phoneDigits;

    // Görünen metin: "0553 688 19 76" geçen düz metin düğümlerini değiştir
    if (phoneDisplay) {
      var walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
      var node;
      var targets = [];
      while ((node = walker.nextNode())) {
        if (node.nodeValue.indexOf('0553 688 19 76') !== -1) targets.push(node);
      }
      targets.forEach(function (n) {
        n.nodeValue = n.nodeValue.split('0553 688 19 76').join(phoneDisplay);
      });
    }

    // tel: bağlantıları
    document.querySelectorAll('a[href^="tel:+' + DEFAULT_PHONE_DIGITS + '"]').forEach(function (a) {
      a.setAttribute('href', 'tel:+' + phoneDigits);
    });

    // wa.me bağlantıları (varsa ?text= sorgusunu korur)
    document.querySelectorAll('a[href*="wa.me/' + DEFAULT_PHONE_DIGITS + '"]').forEach(function (a) {
      a.setAttribute('href', a.getAttribute('href').replace(DEFAULT_PHONE_DIGITS, phoneDigits));
    });
  }

  function boot() {
    try {
      if (!firebase.apps.length) firebase.initializeApp(window.firebaseConfig);
      var db = firebase.firestore();
      db.collection('content').doc('site').get().then(function (doc) {
        if (!doc.exists) return;
        var data = doc.data();
        applyTextFields(data);
        applyImages(data);
        applyPhone(data.phoneDisplay, data.phoneDigits);
        applyTheme(data);
        handleMaintenanceMode(data);
      }).catch(function (err) {
        console.warn('Site içeriği yüklenemedi:', err.message);
      });
    } catch (err) {
      console.warn('Site içeriği yüklenemedi:', err.message);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();

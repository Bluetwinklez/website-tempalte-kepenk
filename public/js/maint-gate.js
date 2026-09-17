// Sayfa hiç boyanmadan (paint) önce bakım modunu kontrol eder.
// index.html <head> içinde EN ÜSTTE, engelleyici (blocking) script olarak yüklenir.
// Karşılık gelen <html>{visibility:hidden} kuralı da <head>'de olmalı.
(function () {
  'use strict';

  function reveal() {
    document.documentElement.style.visibility = 'visible';
  }

  function block(msg) {
    reveal();
    var ov = document.createElement('div');
    ov.id = 'maintenanceOverlay';
    ov.style.cssText = 'position:fixed;inset:0;z-index:999999;background:#0f172a;color:#fff;' +
      'display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;' +
      'padding:32px;font-family:"Plus Jakarta Sans",system-ui,sans-serif';
    var icon = document.createElement('div');
    icon.style.cssText = 'font-size:40px;margin-bottom:16px';
    icon.textContent = '🛠️';
    var h1 = document.createElement('h1');
    h1.style.cssText = "font-family:'Outfit',sans-serif;font-size:22px;margin:0 0 10px";
    h1.textContent = 'Bakımdayız';
    var p = document.createElement('p');
    p.style.cssText = 'max-width:420px;color:#cbd5e1;font-size:15px;line-height:1.6;margin:0';
    p.textContent = msg;
    ov.appendChild(icon);
    ov.appendChild(h1);
    ov.appendChild(p);

    function attach() {
      document.body.appendChild(ov);
      document.body.style.overflow = 'hidden';
    }
    if (document.body) attach();
    else document.addEventListener('DOMContentLoaded', attach);
  }

  try {
    if (localStorage.getItem('ek_admin_bypass') === '1') { reveal(); return; }
  } catch (e) { /* localStorage kapalıysa normal akışa devam */ }

  var url = 'https://firestore.googleapis.com/v1/projects/gen-lang-client-0256784982/databases/(default)/documents/content/site?key=AIzaSyD9gRsPfh2EcrBcYQPojvJJ3V8RbgaVeL4';
  var settled = false;
  var timer = setTimeout(function () {
    if (settled) return;
    settled = true;
    reveal(); // Firestore yanıt vermezse siteyi normal göster (fail-open)
  }, 1500);

  fetch(url).then(function (r) { return r.json(); }).then(function (doc) {
    if (settled) return;
    settled = true;
    clearTimeout(timer);
    var fields = (doc && doc.fields) || {};
    var maint = fields.maintenanceMode && fields.maintenanceMode.booleanValue;
    var until = fields.maintenanceUntil && fields.maintenanceUntil.stringValue;
    if (maint && until) {
      var untilDate = new Date(until);
      if (!isNaN(untilDate.getTime()) && Date.now() >= untilDate.getTime()) maint = false;
    }
    if (maint) {
      var msg = (fields.maintenanceMessage && fields.maintenanceMessage.stringValue) ||
        'Sitemiz kısa bir bakımda. Kısa süre sonra tekrar hizmetinizdeyiz.';
      block(msg);
    } else {
      reveal();
    }
  }).catch(function () {
    if (settled) return;
    settled = true;
    clearTimeout(timer);
    reveal();
  });
})();

// Site üzerinde canlı düzenleme: admin girişliyken data-cms etiketli metinlere tıklanınca
// yerinde düzenlenebilir hale gelir, Enter ile Firestore'a kaydedilir.
// Admin girişli değilse hiçbir şey yapmaz — normal ziyaretçi için tamamen görünmezdir.
(function () {
  'use strict';

  var ADMIN_UID = 'MZw1ENzRMre49h9UckT7uIiD9LG2';

  function boot() {
    if (typeof firebase === 'undefined' || !firebase.apps.length) return;
    firebase.auth().onAuthStateChanged(function (user) {
      if (user && user.uid === ADMIN_UID) enableEditMode();
    });
  }

  function enableEditMode() {
    var db = firebase.firestore();

    var badge = document.createElement('div');
    badge.textContent = '✏️ Düzenleme modu: bir metne tıkla, değiştir, Enter\'a bas (İptal: Esc)';
    badge.style.cssText = 'position:fixed;bottom:16px;left:50%;transform:translateX(-50%);z-index:99999;' +
      'background:#0f172a;color:#fff;padding:10px 18px;border-radius:999px;' +
      'font:600 13px "Plus Jakarta Sans",system-ui,sans-serif;box-shadow:0 10px 30px rgba(0,0,0,.3);' +
      'white-space:nowrap';
    document.body.appendChild(badge);

    document.querySelectorAll('[data-cms]').forEach(function (el) {
      el.style.outline = '1px dashed transparent';
      el.style.outlineOffset = '2px';
      el.style.cursor = 'text';
      el.style.transition = 'outline-color .15s, background-color .15s';
      el.title = 'Düzenlemek için tıkla';

      el.addEventListener('mouseenter', function () {
        if (el.isContentEditable) return;
        el.style.outlineColor = '#ea580c';
        el.style.backgroundColor = 'rgba(234,88,12,.08)';
      });
      el.addEventListener('mouseleave', function () {
        if (el.isContentEditable) return;
        el.style.outlineColor = 'transparent';
        el.style.backgroundColor = 'transparent';
      });
      el.addEventListener('click', function (e) {
        if (el.isContentEditable) return;
        e.preventDefault();
        e.stopPropagation();
        startEdit(el);
      });
    });

    function startEdit(el) {
      var key = el.getAttribute('data-cms');
      var original = el.textContent;

      el.setAttribute('contenteditable', 'true');
      el.style.outlineColor = '#16a34a';
      el.style.outlineStyle = 'solid';
      el.style.backgroundColor = '#fff';
      el.focus();
      document.execCommand('selectAll', false, null);

      function cleanup() {
        el.removeAttribute('contenteditable');
        el.style.outlineStyle = 'dashed';
        el.style.outlineColor = 'transparent';
        el.style.backgroundColor = 'transparent';
        el.removeEventListener('keydown', onKeydown);
        el.removeEventListener('blur', onBlur);
      }

      function save() {
        var newVal = el.textContent.trim();
        cleanup();
        if (!newVal || newVal === original) {
          el.textContent = original;
          return;
        }
        var data = {};
        data[key] = newVal;
        el.style.opacity = '.5';
        db.collection('content').doc('site').set(data, { merge: true }).then(function () {
          el.style.opacity = '';
        }).catch(function (err) {
          el.style.opacity = '';
          el.textContent = original;
          alert('Kaydedilemedi: ' + err.message);
        });
      }

      function cancel() {
        cleanup();
        el.textContent = original;
      }

      function onKeydown(e) {
        if (e.key === 'Enter') { e.preventDefault(); save(); }
        if (e.key === 'Escape') { e.preventDefault(); cancel(); }
      }
      function onBlur() { save(); }

      el.addEventListener('keydown', onKeydown);
      el.addEventListener('blur', onBlur);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();

// Form taleplerini Firestore'a kaydeder (WhatsApp yönlendirmesine ek olarak, panelde görüntülenebilsin diye).
// Firestore erişilemezse (engelleyici, ağ sorunu) sessizce geçilir — WhatsApp akışı bundan etkilenmez.
(function () {
  'use strict';

  var app = firebase.initializeApp(window.firebaseConfig);
  var db = firebase.firestore(app);

  window.saveLeadToFirestore = function (lead) {
    try {
      db.collection('leads').add({
        name: lead.name || '',
        phone: lead.phone || '',
        district: lead.district || '',
        service: lead.service || '',
        message: lead.message || '',
        handled: false,
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
      }).catch(function (err) {
        console.warn('Lead kaydedilemedi:', err.message);
      });
    } catch (err) {
      console.warn('Lead kaydedilemedi:', err.message);
    }
  };
})();

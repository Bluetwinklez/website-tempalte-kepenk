// Yönetim paneli: giriş, gelen talepler listesi, sekme geçişleri.
// CSP uyumlu: inline handler yok, tüm olaylar delegasyonla bağlanır.
(function () {
  'use strict';

  // Panele yeni bir düzenlenebilir alan eklemek için:
  // 1) index.html'de ilgili öğeye data-cms="anahtar" ekle
  // 2) Aşağıdaki FIELD_SECTIONS listesine [anahtar, etiket] satırı ekle
  // Form, yükleme ve kaydetme burada otomatik oluşur — başka bir yeri değiştirmeye gerek yok.
  var FIELD_SECTIONS = [
    { title: 'Site Durumu', icon: 'power', fields: [
      ['maintenanceMode', 'Site bakım modunda (işaretlenirse ziyaretçiler "Bakımdayız" ekranı görür, sen görmeye devam edersin)', false, 'checkbox'],
      ['maintenanceMessage', 'Bakım ekranında gösterilecek mesaj', 'Sitemiz kısa bir bakımda. Kısa süre sonra tekrar hizmetinizdeyiz.'],
      ['maintenanceUntil', 'Otomatik açılış zamanı (opsiyonel — boş bırakırsan sen kutucuğu kaldırana kadar kapalı kalır)', '', 'datetime-local']
    ]},
    { title: 'Görünüm / Tema Rengi', icon: 'palette', fields: [
      ['themeColorOrange', 'Ana marka rengi (turuncu)', '#EA580C', 'color'],
      ['themeColorAmber', 'İkincil marka rengi (amber)', '#F97316', 'color']
    ]},
    { title: 'İletişim', icon: 'phone', fields: [
      ['phoneDisplay', 'Telefon (görünen, Örn: 0555 000 00 00)', '0555 000 00 00'],
      ['phoneDigits', 'Telefon (link için, sadece rakam, Örn: 905550000000)', '905550000000']
    ]},
    { title: 'Ana Başlık (Hero)', icon: 'heading', fields: [
      ['heroTitleLine1', 'Başlık 1. satır', 'İşletmeniz ve Garajınız İçin'],
      ['heroTitleHighlight', 'Başlık vurgulu kısım', 'Üstün Güvenlikli'],
      ['heroTitleLine2', 'Başlık 2. satır', 'Kepenk Sistemleri'],
      ['heroSubtitle', 'Alt açıklama', 'Galvaniz çelik dükkan kepenkleri, şık seksiyonel garaj kapıları ve poliüretanlı konut panjurları. Kendi atölyemizde yerli üretim, titiz montaj ve şeffaf fiyat garantisi.']
    ]},
    { title: 'Hizmetlerimiz (5 Kart)', icon: 'layout-grid', fields: [
      ['svc0title', 'Kart 1 — Başlık', 'Otomatik Kepenk'],
      ['svc0desc', 'Kart 1 — Açıklama', 'İş yerleriniz için modern, dayanıklı ve yüksek güvenlikli otomatik kepenk sistemleri kurulumu yapıyoruz.'],
      ['svc1title', 'Kart 2 — Başlık', 'Garaj Kapısı'],
      ['svc1desc', 'Kart 2 — Açıklama', 'Konut ve siteler için estetik, sessiz çalışan ve uzun ömürlü seksiyonel garaj kapısı çözümleri sunuyoruz.'],
      ['svc2title', 'Kart 3 — Başlık', 'Profesyonel Montaj'],
      ['svc2desc', 'Kart 3 — Açıklama', 'Tüm sistemlerimizi uzman ekibimizle, standartlara uygun ve titiz bir işçilikle yerinde kuruyoruz.'],
      ['svc3title', 'Kart 4 — Başlık', 'Acil Tamir & Servis'],
      ['svc3desc', 'Kart 4 — Açıklama', 'Arızalanan kepenk ve kapı sistemleriniz için hızlı teknik servis ve parça değişim desteği sağlıyoruz.'],
      ['svc4title', 'Kart 5 — Başlık', 'Periyodik Bakım'],
      ['svc4desc', 'Kart 5 — Açıklama', 'Sistemlerinizin ömrünü uzatmak ve sürpriz arızaları önlemek için düzenli bakım hizmeti sunuyoruz.']
    ]},
    { title: '"Hangi Hizmetleri Veriyoruz?" Listesi', icon: 'list-checks', fields: [
      ['servicesListTitle', 'Bölüm başlığı', 'Hangi Hizmetleri Veriyoruz?'],
      ['list0', 'Madde 1', 'Otomatik Kepenk Tamiri'],
      ['list1', 'Madde 2', 'Kepenk Motoru Değişimi'],
      ['list2', 'Madde 3', 'Kepenk Motoru Tamiri'],
      ['list3', 'Madde 4', 'Kumanda Programlama'],
      ['list4', 'Madde 5', 'Fotosel Arızaları'],
      ['list5', 'Madde 6', 'Ray Düzeltme & Hizalama'],
      ['list6', 'Madde 7', 'Zincir ve Askı Yayı Değişimi'],
      ['list7', 'Madde 8', 'Elektrik & Alıcı Kart Arızası'],
      ['list8', 'Madde 9', 'Periyodik Kepenk Bakımı'],
      ['list9', 'Madde 10', 'Sıfır Kepenk İmalat & Montaj'],
      ['list10', 'Madde 11', 'Seksiyonel Garaj Kapısı'],
      ['list11', 'Madde 12', 'Mağaza & Vitrin Kepenkleri']
    ]},
    { title: 'Ekstra Metinler', icon: 'type', fields: [
      ['trustBadge', 'Üst rozet yazısı', 'Kepenk Sistemleri • 15+ Yıllık İmalatçı Güvencesi'],
      ['heroCtaText', 'Ana teklif butonu yazısı', 'Hemen Teklif Al'],
      ['statLabel1', 'Sayaç 1 etiketi', 'Montaj & Teslimat'],
      ['statMiddleValue', 'Sayaç 2 değeri', 'Aynı Gün'],
      ['statLabel2', 'Sayaç 2 etiketi', 'Hızlı Servis & Montaj'],
      ['statLabel3', 'Sayaç 3 etiketi', 'Müşteri Memnuniyeti'],
      ['reviewsEyebrow', 'Yorumlar bölümü üst etiket', 'Müşteri Memnuniyeti'],
      ['reviewsRating', 'Yorumlar puanı', '4.8 / 5.0'],
      ['reviewsCount', 'Yorum sayısı yazısı', '240+ Gerçek Müşteri Değerlendirmesi']
    ]},
    { title: 'Müşteri Yorumları (3 Kart)', icon: 'star', fields: [
      ['testi1Quote', 'Yorum 1 — Metin', "\"Gece saat 23:00'da kuyumcu dükkanımızın kepengi yarıda sıkıştı ve kapanmadı. Kepenk servisini aradık, 25 dakikada gelip motor dişlisini değiştirdiler. Harika esnaflık ve dürüst fiyat!\""],
      ['testi1Name', 'Yorum 1 — İsim', 'Murat K.'],
      ['testi1Role', 'Yorum 1 — Ünvan', 'Kuyumcu İşletmecisi'],
      ['testi2Quote', 'Yorum 2 — Metin', '"Yeni açtığımız eczane için poliüretanlı antrasit kepenk yaptırdık. Ölçüyü lazerle aldılar, tam söz verdikleri gün getirip 3 saatte tertemiz taktılar. Motor sesi neredeyse hiç duyulmuyor."'],
      ['testi2Name', 'Yorum 2 — İsim', 'Ecz. Özlem D.'],
      ['testi2Role', 'Yorum 2 — Ünvan', 'Eczane Sahibi'],
      ['testi3Quote', 'Yorum 3 — Metin', '"Fabrikamızın 3 adet sarmal hangar kapısını yenilediler. Fiyat teklifinden montaj sonrası garanti belgesi teslimine kadar kurumsal ve çok profesyonel bir süreçti. Tavsiye ederim."'],
      ['testi3Name', 'Yorum 3 — İsim', 'Serdar T.'],
      ['testi3Role', 'Yorum 3 — Ünvan', 'Fabrika Müdürü']
    ]},
    { title: 'Footer', icon: 'align-left', fields: [
      ['footerDescription', 'Şirket açıklaması', 'İstanbul ve Kocaeli genelinde 15 yılı aşkın tecrübeyle otomatik kepenk, seksiyonel garaj kapısı ve motorlu panjur sistemleri imalatı, garantili montaj ve acil teknik servis hizmeti.']
    ]},
    { title: 'Yasal Bilgiler (KVKK / Gizlilik sayfaları)', icon: 'scale', fields: [
      ['ticaretUnvani', 'Ticaret unvanı (şirket resmi adı, varsa)', ''],
      ['adres', 'Açık adres', '']
    ]}
  ];

  // Panele yeni bir yüklenebilir görsel eklemek için:
  // 1) index.html'de ilgili <img> etiketine data-cms-img="anahtar" ekle
  // 2) Aşağıdaki IMAGE_FIELDS listesine [anahtar, etiket, varsayılan-dosya-yolu] satırı ekle
  var IMAGE_FIELDS = [
    ['logoUrl', 'Logo', 'images/logo-emblem.png'],
    ['galleryImg0', 'Galeri 1 — Sarı Şeritli Garaj Kepengi', 'images/garaj-sari-serit.webp'],
    ['galleryImg1', 'Galeri 2 — Ahşap Desenli Villa Kepengi', 'images/villa-ahsap-mesekepenk.webp'],
    ['galleryImg2', 'Galeri 3 — Cadde Mağazası Kepenkleri', 'images/cadde-magaza-3bolmeli.webp'],
    ['galleryImg3', 'Galeri 4 — Dükkan Çelik Kepengi', 'images/dukkan-celik-guvenlik.webp'],
    ['galleryImg4', 'Galeri 5 — İkili Mağaza Kepengi', 'images/magaza-cift-bolmeli.webp'],
    ['galleryImg5', 'Galeri 6 — Geniş Açıklıklı Kepenk', 'images/genis-cephe-celik.webp'],
    ['galleryImg6', 'Galeri 7 — Bahçe Duvarı Kepengi', 'images/bahce-otopark-giris.webp'],
    ['galleryImg7', 'Galeri 8 — Gümüş Gri Balkon Kepengi', 'images/balkon-gumus-izolasyon.webp'],
    ['galleryImg8', 'Galeri 9 — Çift Renk Garaj Kepengi', 'images/garaj-cift-renk.webp'],
    ['galleryImg9', 'Galeri 10 — Endüstriyel Kepenk', 'images/endustriyel-sarmal-kepenk.webp']
  ];

  var DEFAULTS = {};
  var FIELD_TYPES = {};
  FIELD_SECTIONS.forEach(function (section) {
    section.fields.forEach(function (f) {
      DEFAULTS[f[0]] = f[2];
      FIELD_TYPES[f[0]] = f[3] || 'text';
    });
  });

  var app = firebase.initializeApp(window.firebaseConfig);
  var auth = firebase.auth(app);
  var db = firebase.firestore(app);
  var storage = firebase.storage(app);

  var loginView = document.getElementById('loginView');
  var dashboardView = document.getElementById('dashboardView');
  var logoutBtn = document.getElementById('logoutBtn');
  var loginError = document.getElementById('loginError');
  var leadsTableBody = document.getElementById('leadsTableBody');
  var leadsEmptyHint = document.getElementById('leadsEmptyHint');
  var leadsLoadingHint = document.getElementById('leadsLoadingHint');
  var contentSaveStatus = document.getElementById('contentSaveStatus');
  var cmsFieldsContainer = document.getElementById('cmsFieldsContainer');
  var cmsSectionNav = document.getElementById('cmsSectionNav');

  var unsubscribeLeads = null;

  FIELD_SECTIONS.forEach(function (section, sectionIndex) {
    var navBtn = document.createElement('button');
    navBtn.type = 'button';
    navBtn.className = 'dash-nav-btn';
    navBtn.setAttribute('data-pane', 'content-section-' + sectionIndex);
    navBtn.innerHTML = '<i data-lucide="' + section.icon + '"></i>';
    navBtn.appendChild(document.createTextNode(section.title));
    cmsSectionNav.appendChild(navBtn);

    var sectionEl = document.createElement('div');
    sectionEl.className = 'cms-section';
    sectionEl.id = 'cms-section-' + sectionIndex;
    if (sectionIndex !== 0) sectionEl.hidden = true;

    var h2 = document.createElement('h2');
    h2.innerHTML = '<i data-lucide="' + section.icon + '"></i>';
    h2.appendChild(document.createTextNode(section.title));
    sectionEl.appendChild(h2);

    var grid = document.createElement('div');
    grid.className = 'cms-grid';
    section.fields.forEach(function (f) {
      var key = f[0], label = f[1], type = f[3] || 'text';
      var field = document.createElement('div');
      if (type === 'checkbox') {
        field.className = 'cms-checkbox-field';
        var checkLbl = document.createElement('label');
        var input = document.createElement('input');
        input.type = 'checkbox';
        input.id = 'cf-' + key;
        checkLbl.appendChild(input);
        checkLbl.appendChild(document.createTextNode(' ' + label));
        field.appendChild(checkLbl);
      } else {
        var lbl = document.createElement('label');
        lbl.setAttribute('for', 'cf-' + key);
        lbl.textContent = label;
        var input = document.createElement('input');
        input.type = (type === 'datetime-local' || type === 'color') ? type : 'text';
        input.id = 'cf-' + key;
        field.appendChild(lbl);
        field.appendChild(input);
      }
      grid.appendChild(field);
    });
    sectionEl.appendChild(grid);
    cmsFieldsContainer.appendChild(sectionEl);
  });

  var imageFieldsContainer = document.getElementById('imageFieldsContainer');
  IMAGE_FIELDS.forEach(function (f) {
    var key = f[0], label = f[1], fallback = f[2];
    var card = document.createElement('div');
    card.className = 'image-card';
    card.id = 'img-card-' + key;
    card.innerHTML =
      '<label class="image-thumb-wrap">' +
        '<img id="img-thumb-' + key + '" src="' + fallback + '" alt="">' +
        '<span class="image-thumb-overlay"><i data-lucide="upload"></i> Değiştir</span>' +
        '<input type="file" accept="image/*" data-image-upload="' + key + '">' +
      '</label>' +
      '<div class="image-label">' + label + '</div>' +
      '<div class="image-status" id="img-status-' + key + '"></div>';
    imageFieldsContainer.appendChild(card);
  });

  if (typeof lucide !== 'undefined') lucide.createIcons();

  function showError(msg) {
    loginError.textContent = msg;
    loginError.style.display = 'block';
  }

  auth.onAuthStateChanged(function (user) {
    if (user) {
      try { localStorage.setItem('ek_admin_bypass', '1'); } catch (e) {}
      loginView.hidden = true;
      dashboardView.hidden = false;
      logoutBtn.hidden = false;
      loadLeads();
      loadContent();
    } else {
      try { localStorage.removeItem('ek_admin_bypass'); } catch (e) {}
      loginView.hidden = false;
      dashboardView.hidden = true;
      logoutBtn.hidden = true;
      if (unsubscribeLeads) { unsubscribeLeads(); unsubscribeLeads = null; }
    }
  });

  document.addEventListener('submit', function (e) {
    var loginForm = e.target.closest('[data-login-form]');
    if (loginForm) {
      e.preventDefault();
      loginError.style.display = 'none';
      var email = document.getElementById('loginEmail').value.trim();
      var password = document.getElementById('loginPassword').value;
      auth.signInWithEmailAndPassword(email, password).catch(function (err) {
        showError('Giriş başarısız: e-posta veya şifre hatalı.');
      });
      return;
    }

    var contentForm = e.target.closest('[data-content-form]');
    if (contentForm) {
      e.preventDefault();
      saveContent();
      return;
    }
  });

  document.addEventListener('click', function (e) {
    if (e.target.closest('#logoutBtn')) {
      auth.signOut();
      return;
    }

    if (e.target.closest('#exportLeadsBtn')) {
      exportLeadsCsv();
      return;
    }

    var paneBtn = e.target.closest('[data-pane]');
    if (paneBtn) {
      var pane = paneBtn.getAttribute('data-pane');
      document.querySelectorAll('.dash-nav-btn').forEach(function (b) { b.classList.remove('active'); });
      paneBtn.classList.add('active');

      var isContent = pane.indexOf('content-section-') === 0;
      document.getElementById('pane-leads').hidden = pane !== 'leads';
      document.getElementById('pane-links').hidden = pane !== 'links';
      document.getElementById('pane-images').hidden = pane !== 'images';
      document.getElementById('pane-content').hidden = !isContent;
      if (isContent) {
        var idx = pane.replace('content-section-', '');
        document.querySelectorAll('.cms-section').forEach(function (s) {
          s.hidden = s.id !== 'cms-section-' + idx;
        });
      }
      return;
    }

    var previewBtn = e.target.closest('#togglePreviewBtn');
    if (previewBtn) {
      var wrap = document.getElementById('previewWrap');
      var frame = document.getElementById('previewFrame');
      var showing = !wrap.hidden;
      if (showing) {
        wrap.hidden = true;
        previewBtn.innerHTML = '<i data-lucide="eye"></i> Canlı Önizlemeyi Göster';
      } else {
        if (frame.src === 'about:blank' || !frame.src) frame.src = '/';
        wrap.hidden = false;
        previewBtn.innerHTML = '<i data-lucide="eye-off"></i> Canlı Önizlemeyi Gizle';
      }
      if (typeof lucide !== 'undefined') lucide.createIcons();
      return;
    }

    var sizeBtn = e.target.closest('[data-preview-size]');
    if (sizeBtn) {
      var size = sizeBtn.getAttribute('data-preview-size');
      document.querySelectorAll('.preview-size-btn').forEach(function (b) { b.classList.remove('active'); });
      sizeBtn.classList.add('active');
      var pf = document.getElementById('previewFrame');
      if (size === 'mobile') {
        pf.style.width = '390px';
        pf.style.height = '740px';
      } else {
        pf.style.width = '100%';
        pf.style.height = '70vh';
      }
      return;
    }

    var forgot = e.target.closest('#forgotPasswordLink');
    if (forgot) {
      e.preventDefault();
      var email = document.getElementById('loginEmail').value.trim();
      if (!email) {
        showError('Şifre sıfırlama için önce e-posta adresinizi yazın.');
        return;
      }
      auth.sendPasswordResetEmail(email).then(function () {
        showError('Şifre sıfırlama bağlantısı e-postanıza gönderildi.');
      }).catch(function (err) {
        showError('Gönderilemedi: ' + err.message);
      });
      return;
    }

    var toggle = e.target.closest('[data-lead-toggle]');
    if (toggle) {
      var id = toggle.getAttribute('data-lead-toggle');
      db.collection('leads').doc(id).update({ handled: toggle.checked });
      return;
    }

    var del = e.target.closest('[data-lead-delete]');
    if (del) {
      var delId = del.getAttribute('data-lead-delete');
      if (confirm('Bu talebi kalıcı olarak silmek istediğine emin misin?')) {
        db.collection('leads').doc(delId).delete();
      }
      return;
    }
  });

  function formatDate(ts) {
    if (!ts || !ts.toDate) return '—';
    var d = ts.toDate();
    return d.toLocaleDateString('tr-TR') + ' ' + d.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
  }

  function escapeHtml(str) {
    var div = document.createElement('div');
    div.textContent = str || '';
    return div.innerHTML;
  }

  var allLeads = [];
  var leadsNoMatchHint = document.getElementById('leadsNoMatchHint');
  var leadsSearchInput = document.getElementById('leadsSearch');
  var leadsStatusFilter = 'all';

  function renderLeadsTable(filterText) {
    var q = (filterText || '').trim().toLowerCase();
    var rows = allLeads.filter(function (item) {
      if (leadsStatusFilter === 'new' && item.data.handled) return false;
      if (leadsStatusFilter === 'done' && !item.data.handled) return false;
      if (!q) return true;
      var lead = item.data;
      return [lead.name, lead.phone, lead.district, lead.service, lead.message].some(function (v) {
        return (v || '').toLowerCase().indexOf(q) !== -1;
      });
    });

    leadsTableBody.innerHTML = '';
    leadsNoMatchHint.hidden = rows.length > 0 || allLeads.length === 0;

    rows.forEach(function (item) {
      var lead = item.data;
      var tr = document.createElement('tr');
      if (lead.handled) tr.className = 'handled';
      var waText = encodeURIComponent('Merhaba ' + (lead.name || '') + ', kepenk ve servis talebiniz için size dönüyoruz.');
      var phoneDigits = (lead.phone || '').replace(/\D/g, '');
      tr.innerHTML =
        '<td>' + formatDate(lead.createdAt) + '</td>' +
        '<td>' + escapeHtml(lead.name) + '</td>' +
        '<td>' + escapeHtml(lead.phone) + '</td>' +
        '<td>' + escapeHtml(lead.district) + '</td>' +
        '<td>' + escapeHtml(lead.service) + '</td>' +
        '<td>' + escapeHtml(lead.message) + '</td>' +
        '<td><span class="pill ' + (lead.handled ? 'pill-done' : 'pill-new') + '">' + (lead.handled ? 'İşlendi' : 'Yeni') + '</span></td>' +
        '<td>' +
          (phoneDigits ? '<a class="wa-link" target="_blank" rel="noopener" href="https://wa.me/9' + phoneDigits + '?text=' + waText + '">WhatsApp</a><br>' : '') +
          '<label style="font-weight:400;font-size:12px;margin-top:6px"><input type="checkbox" data-lead-toggle="' + item.id + '" ' + (lead.handled ? 'checked' : '') + '> İşlendi</label><br>' +
          '<button type="button" class="del-lead-btn" data-lead-delete="' + item.id + '" title="Sil">Sil</button>' +
        '</td>';
      leadsTableBody.appendChild(tr);
    });
  }

  function loadLeads() {
    leadsLoadingHint.hidden = false;
    leadsEmptyHint.hidden = true;
    unsubscribeLeads = db.collection('leads').orderBy('createdAt', 'desc').limit(200)
      .onSnapshot(function (snapshot) {
        leadsLoadingHint.hidden = true;

        var handledCount = 0;
        allLeads = [];
        snapshot.forEach(function (doc) {
          allLeads.push({ id: doc.id, data: doc.data() });
          if (doc.data().handled) handledCount++;
        });
        var statTotal = document.getElementById('statTotal');
        var statNew = document.getElementById('statNew');
        var statHandled = document.getElementById('statHandled');
        if (statTotal) statTotal.textContent = snapshot.size;
        if (statNew) statNew.textContent = snapshot.size - handledCount;
        if (statHandled) statHandled.textContent = handledCount;

        leadsEmptyHint.hidden = !snapshot.empty ? true : false;
        renderLeadsTable(leadsSearchInput ? leadsSearchInput.value : '');
      }, function (err) {
        leadsLoadingHint.textContent = 'Yüklenemedi: ' + err.message;
      });
  }

  if (leadsSearchInput) {
    leadsSearchInput.addEventListener('input', function () {
      renderLeadsTable(leadsSearchInput.value);
    });
  }

  document.addEventListener('click', function (e) {
    var filterBtn = e.target.closest('[data-lead-filter]');
    if (!filterBtn) return;
    leadsStatusFilter = filterBtn.getAttribute('data-lead-filter');
    document.querySelectorAll('.stat-card').forEach(function (c) { c.classList.remove('active'); });
    filterBtn.classList.add('active');
    renderLeadsTable(leadsSearchInput ? leadsSearchInput.value : '');
  });

  function csvEscape(val) {
    var s = String(val == null ? '' : val);
    return '"' + s.replace(/"/g, '""') + '"';
  }

  function exportLeadsCsv() {
    var header = ['Tarih', 'Ad Soyad', 'Telefon', 'İlçe', 'Hizmet', 'Not', 'Durum'];
    var lines = [header.map(csvEscape).join(',')];
    allLeads.forEach(function (item) {
      var lead = item.data;
      lines.push([
        formatDate(lead.createdAt),
        lead.name, lead.phone, lead.district, lead.service, lead.message,
        lead.handled ? 'İşlendi' : 'Yeni'
      ].map(csvEscape).join(','));
    });
    var blob = new Blob(['﻿' + lines.join('\r\n')], { type: 'text/csv;charset=utf-8;' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = 'talepler-' + new Date().toISOString().slice(0, 10) + '.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  function fillContentForm(data) {
    Object.keys(DEFAULTS).forEach(function (key) {
      var el = document.getElementById('cf-' + key);
      if (!el) return;
      var val = key in data ? data[key] : DEFAULTS[key];
      if (FIELD_TYPES[key] === 'checkbox') {
        el.checked = !!val;
      } else {
        el.value = val || '';
      }
    });
  }

  function fillImagesForm(data) {
    IMAGE_FIELDS.forEach(function (f) {
      var key = f[0];
      var val = data[key];
      if (!val) return;
      var thumb = document.getElementById('img-thumb-' + key);
      if (thumb) thumb.src = val;
    });
  }

  function setContentStatus(msg, kind) {
    contentSaveStatus.textContent = msg;
    contentSaveStatus.className = msg ? 'visible ' + kind : '';
  }

  function uploadImage(key, file) {
    var card = document.getElementById('img-card-' + key);
    var status = document.getElementById('img-status-' + key);
    var thumb = document.getElementById('img-thumb-' + key);

    if (!/^image\//.test(file.type)) {
      status.textContent = 'Sadece resim dosyası yükleyebilirsin.';
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      status.textContent = 'Dosya çok büyük (maks. 5 MB).';
      return;
    }

    card.classList.add('uploading');
    status.textContent = 'Yükleniyor…';

    var ext = (file.name.split('.').pop() || 'jpg').toLowerCase();
    var path = 'content/' + key + '-' + Date.now() + '.' + ext;
    var ref = storage.ref().child(path);

    ref.put(file).then(function (snap) {
      return snap.ref.getDownloadURL();
    }).then(function (url) {
      var data = {};
      data[key] = url;
      return db.collection('content').doc('site').set(data, { merge: true }).then(function () { return url; });
    }).then(function (url) {
      thumb.src = url;
      card.classList.remove('uploading');
      status.textContent = 'Yüklendi. Sitede birkaç saniye içinde görünür.';
    }).catch(function (err) {
      card.classList.remove('uploading');
      status.textContent = 'Hata: ' + err.message;
    });
  }

  document.addEventListener('change', function (e) {
    var input = e.target.closest('[data-image-upload]');
    if (!input || !input.files || !input.files[0]) return;
    var key = input.getAttribute('data-image-upload');
    uploadImage(key, input.files[0]);
    input.value = '';
  });

  function loadContent() {
    db.collection('content').doc('site').get().then(function (doc) {
      var data = doc.exists ? doc.data() : DEFAULTS;
      fillContentForm(data);
      fillImagesForm(data);
    }).catch(function (err) {
      setContentStatus('Yüklenemedi: ' + err.message, 'err');
    });
  }

  function saveContent() {
    var data = {};
    Object.keys(DEFAULTS).forEach(function (key) {
      var el = document.getElementById('cf-' + key);
      if (!el) return;
      if (FIELD_TYPES[key] === 'checkbox') {
        data[key] = el.checked;
        return;
      }
      var val = el.value.trim();
      data[key] = key === 'phoneDigits' ? val.replace(/\D/g, '') : val;
    });
    setContentStatus('Kaydediliyor…', 'pending');
    db.collection('content').doc('site').set(data, { merge: true }).then(function () {
      setContentStatus('Kaydedildi. Sitede birkaç saniye içinde görünür.', 'ok');
    }).catch(function (err) {
      setContentStatus('Kaydedilemedi: ' + err.message, 'err');
    });
  }
})();

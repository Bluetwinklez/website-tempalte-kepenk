# 🛡️ KepenkPro — Modern Kepenk & Otomasyon Web Sitesi + Firebase Yönetim Paneli Şablonu

Modern, yüksek performanslı ve tam donanımlı kurumsal **Kepenk, Garaj Kapısı ve Otomasyon Sistemleri Web Sitesi ve Yönetim Paneli Şablonu** (Website Template & Admin Panel).

Tailwind CSS ve Vanilla JavaScript ile hafif ve hızlı olarak geliştirilmiş, arka planda Firebase Authentication, Cloud Firestore ve Firebase Storage ile güçlendirilmiştir.

---

## 🌟 Öne Çıkan Özellikler

### 🎯 1. Ziyaretçi Odaklı Modern Web Sitesi (`public/index.html`)
- **Modern & Akıcı Arayüz:** Tailwind CSS, mikro animasyonlar, Lucide ikon seti ve modern tipografi.
- **Hızlı Dönüşüm Öğeleri:**
  - 7/24 Acil Kepenk Arızası ve Servis Talep Modalı.
  - Önceden yapılandırılmış dinamik WhatsApp mesaj butonları (ilçe ve arıza tipine göre).
  - Canlı sayaç istatistikleri ve güven rozetleri.
- **İnteraktif Galeri & Lightbox:** Yapılan işleri filtreleme ve yüksek çözünürlüklü modal ile inceleme.
- **Hizmet & İlçe Rehberleri:** Bölge bazlı arıza ve servis alanları kartları.
- **Müşteri Yorumları & SSS:** Akordeon formatında sıkça sorulan sorular ve doğrulanmış müşteri değerlendirmeleri.
- **Mobil & iOS Odaklı Deneyim:** iOS Safe-Area uyumlu, altta sabit hızlı arama ve WhatsApp iletişim çubuğu.
- **SEO & Performans:** WebP görsel formatları, Schema.org JSON-LD yapısal verisi, Open Graph ve Twitter kartları.

### 🔐 2. Firebase Yönetim Paneli (`public/ek-panel.html`)
- **Güvenli Kimlik Doğrulama:** Firebase Auth (Email/Password) ile korunan yönetici girişi.
- **Gelen Talepler (Leads) Yönetimi:** Sitedeki formlardan gelen fiyat teklifleri ve arıza kayıtlarını listeleme, durum güncelleme ve tek tıkla WhatsApp'tan müşteriye dönüş yapma.
- **Dinamik İçerik Yönetimi (CMS):** Kod değiştirmeden sitedeki başlıkları, alt başlıkları, güven rozetlerini, istatistikleri ve müşteri yorumlarını Firestore üzerinden güncelleme.
- **Görsel Yükleme (Storage):** Galeriye ve siteye yeni fotoğraflar yükleme.
- **Bakım Modu (Maintenance Gate):** Tek tıkla siteyi bakım moduna alma veya yayına açma.

### ✏️ 3. Canlı Yerinde Düzenleme (Inline Editor - `public/js/inline-editor.js`)
- Yönetici paneline giriş yaptıktan sonra ana siteyi ziyaret ettiğinizde, düzenlenebilir alanların üzerinde beliren kalem butonuna tıklayarak metinleri canlı olarak yerinde düzenleyip Firestore'a kaydedebilirsiniz.

---

## 📁 Proje Dizin Yapısı

```bash
├── public/
│   ├── index.html              # Ana web sitesi
│   ├── ek-panel.html           # Firebase tabanlı yönetim paneli
│   ├── 404.html                # Özel 404 hata sayfası
│   ├── kvkk.html               # KVKK aydınlatma metni şablonu
│   ├── gizlilik.html           # Gizlilik ve çerez politikası şablonu
│   ├── robots.txt              # Arama motoru direktifleri
│   ├── sitemap.xml             # Site haritası
│   ├── site.webmanifest        # PWA / mobil web uygulama bildirimi
│   ├── css/
│   │   └── style.css           # Özel animasyonlar ve stil tanımları
│   ├── js/
│   │   ├── firebase-config.js  # Firebase istemci yapılandırması
│   │   ├── site-content.js     # Firestore'dan içerik/tema eşleme
│   │   ├── inline-editor.js    # Canlı yerinde tıkla-düzenle motoru
│   │   ├── maint-gate.js       # Bakım modu kontrolü
│   │   ├── admin.js            # Yönetim paneli mantığı
│   │   ├── main.js             # Slider, modallar, filtreleme, sayaçlar
│   │   ├── handlers.js         # Etkinlik ve form dinleyicileri
│   │   ├── consent.js          # Çerez izin banner'ı
│   │   └── conversion.js       # Dönüşüm ve analitik izleme
│   └── images/                 # Optimize edilmiş WebP ve SVG görseller
├── firestore.rules             # Cloud Firestore yetkilendirme kuralları
├── storage.rules               # Cloud Storage yetkilendirme kuralları
├── firebase.json               # Firebase Hosting & HTTP Güvenlik başlıkları (CSP, HSTS)
└── README.md                   # Proje dokümantasyonu
```

---

## 🚀 Hızlı Başlangıç & Kurulum

### 1. Projeyi Klonlayın
```bash
git clone https://github.com/Bluetwinklez/emir-kepenk-sistemleri.git
cd emir-kepenk-sistemleri
```

### 2. Firebase Projenizi Hazırlayın
1. [Firebase Console](https://console.firebase.google.com/) adresine gidin ve yeni bir proje oluşturun.
2. Sol menüden **Authentication** sekmesine girip **Email/Password** sağlayıcısını aktif edin ve yönetici kullanıcınızı oluşturun.
3. **Cloud Firestore** veritabanı oluşturun.
4. **Cloud Storage** deposu oluşturun.
5. Proje Ayarları (Project Settings) > Genel (General) sekmesinden yeni bir **Web Uygulaması** ekleyin ve verilen konfigürasyon nesnesini kopyalayın.

### 3. Yapılandırma Bilgilerini Güncelleyin
`public/js/firebase-config.js` dosyasını açarak kendi Firebase bilgilerinizi girin:

```javascript
window.firebaseConfig = {
  apiKey: "FIREBASE_API_KEY",
  authDomain: "PROJE_ID.firebaseapp.com",
  projectId: "PROJE_ID",
  storageBucket: "PROJE_ID.firebasestorage.app",
  messagingSenderId: "SENDER_ID",
  appId: "APP_ID"
};
```

### 4. Şablonu Kendi İşletmenize Göre Özelleştirin
- **Marka & Başlıklar:** `public/index.html` ve `public/ek-panel.html` içerisindeki marka adını kendi logonuzla değiştirin.
- **İletişim & WhatsApp Numarası:** `public/index.html` ve `public/js/main.js` içerisindeki telefon ve WhatsApp bağlantılarını güncelleyin.
- **İçerik:** İster doğrudan HTML üzerinden isterseniz yönetim panelinden Firestore CMS ile dilediğiniz gibi güncelleyin.

### 5. Dağıtım (Firebase Hosting)
Firebase CLI yüklü değilse yükleyin:
```bash
npm install -g firebase-tools
firebase login
```

Güvenlik kurallarını ve web sitesini yayınlayın:
```bash
firebase deploy --only firestore:rules,storage,hosting
```

---

## 🔒 Güvenlik

- **Firestore Rules:** Sadece kimliği doğrulanmış yöneticiler içerik ve ayarları güncelleyebilir; ziyaretçiler yalnızca form talebi oluşturabilir.
- **Storage Rules:** Yalnızca giriş yapan yöneticiler görsel yükleyebilir.
- **HTTP Güvenlik Başlıkları:** `firebase.json` içerisinde önceden tanımlanmış Content-Security-Policy (CSP), Strict-Transport-Security (HSTS), X-Frame-Options ve X-Content-Type-Options başlıkları yer alır.

---

## 📄 Lisans
Bu proje [MIT Lisansı](LICENSE) kapsamında açık kaynak ve serbest kullanıma uygundur. Dilediğiniz gibi geliştirebilir, kişisel veya ticari projelerinizde kullanabilirsiniz.

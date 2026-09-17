# Emir Kepenk Sistemleri

Emir Kepenk Sistemleri için kurumsal tanıtım sitesi ve Firebase tabanlı yönetim paneli.

- **Canlı site:** https://emirkepenksistemleri.com
- **Yönetim paneli:** https://emirkepenksistemleri.com/ek-panel

## Yapı

- `public/index.html` — ana site (Tailwind + vanilla JS)
- `public/ek-panel.html` — yönetim paneli arayüzü
- `public/js/admin.js` — panel mantığı (giriş, içerik düzenleme, talepler, görsel yükleme)
- `public/js/site-content.js` — Firestore'dan içerik/tema/görsel uygulama
- `public/js/inline-editor.js` — sitede yerinde (tıkla-düzenle) içerik editörü
- `public/js/maint-gate.js` — bakım modu kontrolü (sayfa boyanmadan önce)
- `firestore.rules` / `storage.rules` — Firebase güvenlik kuralları
- `firebase.json` — Hosting yapılandırması, güvenlik başlıkları (CSP, HSTS vb.)

## Dağıtım (Deploy)

```bash
firebase deploy --only hosting --project gen-lang-client-0256784982
```

Firestore ve Storage kuralları Firebase Console üzerinden yönetilir.

## Not

`generate.js`, `script.js`, `style.css` ve `templates/` klasörü, sitenin şu anki
Firestore tabanlı içerik yönetimine geçmeden önceki bir statik-üretim denemesinden
kalan dosyalardır; canlı sitede kullanılmıyor.

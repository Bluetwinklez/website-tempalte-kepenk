// Kepenk & Otomasyon Sistemleri - Ana JavaScript & Geçiş Animasyonları

// Dönüşüm takibi js/conversion.js dosyasına taşındı
// (telefon + WhatsApp tıklamaları tek dönüşüm işlemi altında toplanıyor)

function getPhoneDigits() {
    return (window.SITE_CONTENT && window.SITE_CONTENT.phoneDigits) || '905536881976';
}

document.addEventListener('DOMContentLoaded', () => {
    // 1. Lucide İkonlarını Başlat
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
    
    // 2. Scroll Reveal Geçiş Animasyonlarını Başlat
    initScrollReveal();

    // 3. Sayaç Animasyonlarını Başlat
    initCounters();

    // 4. Navbar Scroll Efekti
    initNavbarScroll();

    // 5. ✨ 4️⃣ 3D Manyetik Tilt Kart Efektlerini Başlat
    init3DTiltCards();

    // 7. ✨ Sadece Ana Sayfada Özel İmleç Noktası
    initAmbientGlowCursor();

    // 8. 📱 Form Telefon Numarası Otomatik Maskeleme (Input Mask)
    initPhoneMask();

    // 9. 🔝 Akıllı "Yukarı Çık" (Back to Top) Butonu & Dairesel İlerleme
    initBackToTop();

});

// 🌟 SCROLL REVEAL (KAYDIRMA İLE GELME GEÇİŞLERİ)
function initScrollReveal() {
    const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');
    
    if (!('IntersectionObserver' in window)) {
        // Eski tarayıcı desteği
        revealElements.forEach(el => el.classList.add('active'));
        return;
    }

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target); // Bir kez çalıştır
            }
        });
    }, {
        root: null,
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));
}

// 🌟 NAVBAR SCROLL GÖLGE EFEKTİ
function initNavbarScroll() {
    const header = document.querySelector('header');
    if (!header) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 20) {
            header.classList.add('shadow-md', 'bg-white/95');
            header.classList.remove('clean-glass');
        } else {
            header.classList.remove('shadow-md', 'bg-white/95');
            header.classList.add('clean-glass');
        }
    }, { passive: true });
}

// 🌟 CANLI ARIZA TEŞHİS & MOBİL SERVİS ASİSTANI
const faultData = {
    sikisma: {
        title: "Kepenk Sıkıştı / Yarıda Kaldı",
        reason: "Askı yayı kırılması, ray içi kirlilik/deformasyon veya emniyet freninin devreye girmesi.",
        waText: "Merhaba, kepengim yarıda sıkıştı ve hareket etmiyor. Acil servis için konum göndermek istiyorum."
    },
    motor: {
        title: "Motor Ses Yapıyor / Sarmıyor",
        reason: "Motor termik sigortası atması, redüktör dişli aşınması veya kondansatör/fren bobini yanması.",
        waText: "Merhaba, kepenk motorundan ses geliyor ama sarmıyor. Acil motor servisi talep ediyorum."
    },
    kumanda: {
        title: "Kumanda / Alıcı Kart Arızası",
        reason: "Alıcı kart trafo yanması, elektrik dalgalanması veya kumanda rolling-code frekans kaybı.",
        waText: "Merhaba, kepenk kumandam basmıyor ve elektrik gelmiyor. Arıza servisi rica ediyorum."
    },
    yay: {
        title: "Yay Koptu / Palet Raydan Çıktı",
        reason: "Mekanik aşırı yük, paslanma, fırtına darbesi veya yay ömrünün tükenmesi.",
        waText: "Merhaba, kepenk yayım koptu ve paletler raydan çıktı. Acil tamir ustası yönlendirir misiniz?"
    }
};

function selectFault(key, btnEl) {
    const data = faultData[key];
    if (!data) return;

    // Buton aktiflik sınıflarını güncelle
    document.querySelectorAll('.fault-select-btn').forEach(btn => {
        btn.className = 'fault-select-btn p-3 rounded-2xl border border-slate-800 bg-slate-950/70 hover:border-slate-700 text-left transition-all duration-300 group';
    });
    if (btnEl) {
        btnEl.className = 'fault-select-btn active p-3 rounded-2xl border border-orange-500/80 bg-orange-500/10 text-left transition-all duration-300 group shadow-lg shadow-orange-500/10 scale-[1.02]';
    }

    // Teşhis alanını animasyonla güncelle
    const diagBox = document.getElementById('diagnosisBox');
    if (diagBox) {
        diagBox.style.transition = 'opacity 0.2s ease, transform 0.2s ease';
        diagBox.style.opacity = '0.2';
        diagBox.style.transform = 'translateY(4px)';
        
        setTimeout(() => {
            const titleEl = document.getElementById('diagTitle');
            const reasonEl = document.getElementById('diagReason');
            const waBtn = document.getElementById('faultWhatsAppBtn');

            if (titleEl) titleEl.textContent = data.title;
            if (reasonEl) reasonEl.textContent = data.reason;
            
            if (waBtn) {
                waBtn.href = `https://wa.me/${getPhoneDigits()}?text=${encodeURIComponent(data.waText)}`;
            }

            diagBox.style.opacity = '1';
            diagBox.style.transform = 'translateY(0)';
        }, 150);
    }
}

// 🌟 LIGHTBOX MODAL (BÜYÜK RESİM GÖRÜNTÜLEYİCİ)
function openLightbox(imgSrc, title, desc) {
    const modal = document.getElementById('lightboxModal');
    const modalBox = modal ? modal.querySelector('.modal-box') : null;
    if (!modal) return;

    document.getElementById('lightboxImg').src = imgSrc;
    document.getElementById('lightboxTitle').textContent = title;
    document.getElementById('lightboxDesc').textContent = desc;
    document.getElementById('lightboxWhatsAppBtn').href = `https://wa.me/${getPhoneDigits()}?text=${encodeURIComponent('Merhaba, sitenizdeki ' + title + ' modeli için fiyat ve detaylı bilgi almak istiyorum.')}`;

    modal.classList.remove('hidden');
    if (modalBox) {
        modalBox.classList.add('modal-animate');
    }
    document.body.style.overflow = 'hidden';
    if (typeof lucide !== 'undefined') lucide.createIcons();
}

function closeLightbox() {
    const modal = document.getElementById('lightboxModal');
    if (modal) {
        modal.classList.add('hidden');
        document.body.style.overflow = 'auto';
    }
}

// ESC tuşuna basınca lightbox'ı kapat
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeLightbox();
});

// 🌟 PROJE GALERİ FİLTRESİ
function filterProjects(cat, el) {
    document.querySelectorAll('#galleryFilterButtons button').forEach(btn => {
        btn.className = 'px-4 py-2 rounded-xl text-xs font-bold bg-white text-slate-600 hover:text-slate-900 border border-slate-300 transition-all duration-300 shadow-sm';
    });
    el.className = 'px-4 py-2 rounded-xl text-xs font-bold bg-brand-orange text-white transition-all duration-300 shadow-md shadow-orange-500/20 scale-105';

    document.querySelectorAll('.project-card').forEach(card => {
        if (cat === 'all' || card.classList.contains(cat)) {
            card.style.display = 'flex';
            card.style.opacity = '0';
            card.style.transform = 'scale(0.95)';
            setTimeout(() => {
                card.style.transition = 'all 0.35s ease';
                card.style.opacity = '1';
                card.style.transform = 'scale(1)';
            }, 50);
        } else {
            card.style.display = 'none';
        }
    });
}

// 🌟 BLOG & MAHALLE FİLTRESİ
function filterBlog(cat, el) {
    document.querySelectorAll('#blogFilterButtons button').forEach(btn => {
        btn.className = 'px-4 py-2 rounded-xl text-xs font-bold bg-white text-slate-600 hover:text-slate-900 border border-slate-300 transition-all duration-300 shadow-sm';
    });
    el.className = 'px-4 py-2 rounded-xl text-xs font-bold bg-brand-orange text-white transition-all duration-300 shadow-md shadow-orange-500/20 scale-105';

    document.querySelectorAll('.blog-card').forEach(card => {
        if (cat === 'all' || card.classList.contains(cat)) {
            card.style.display = 'flex';
            card.style.opacity = '0';
            card.style.transform = 'scale(0.95)';
            setTimeout(() => {
                card.style.transition = 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)';
                card.style.opacity = '1';
                card.style.transform = 'scale(1)';
            }, 50);
        } else {
            card.style.display = 'none';
        }
    });
}

// 🌟 SAYAÇ ANİMASYONU
function initCounters() {
    const countElements = document.querySelectorAll('.count-up, .counter-val');
    if (!countElements.length) return;

    function animateCount(el) {
        const target = parseInt(el.getAttribute('data-target'), 10) || 0;
        if (!target) return;
        const duration = 1400;
        const steps = 35;
        const increment = target / steps;
        let current = 0;

        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                el.textContent = target.toLocaleString('tr-TR');
                clearInterval(timer);
            } else {
                el.textContent = Math.round(current).toLocaleString('tr-TR');
            }
        }, duration / steps);
    }

    if (!('IntersectionObserver' in window)) {
        countElements.forEach(animateCount);
        return;
    }

    const countObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCount(entry.target);
                countObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    countElements.forEach(el => countObserver.observe(el));
}

// 🌟 HIZLI HİZMET SEÇİM FONKSİYONU (1-TIK DOLDURMA + AKTİF ROZET GERİ BİLDİRİMİ)
function setService(val, btnEl) {
    const input = document.getElementById('formService');
    if (!input) return;

    // 1. Değeri input kutusuna aktar
    input.value = val;
    input.dispatchEvent(new Event('input', { bubbles: true }));
    input.dispatchEvent(new Event('change', { bubbles: true }));

    // 2. Tıklanan butonu tespit et
    if (!btnEl && typeof event !== 'undefined' && event && event.target) {
        btnEl = event.target.closest('[data-service]');
    }

    // 3. Tüm hazır etiketleri sıfırla
    document.querySelectorAll('.service-chip').forEach(btn => {
        btn.classList.remove('active');
        const icon = btn.querySelector('.chip-icon');
        if (icon) icon.textContent = '+';
    });

    // 4. Tıklanan butona aktif durum ekle
    if (btnEl) {
        btnEl.classList.add('active');
        const icon = btnEl.querySelector('.chip-icon');
        if (icon) icon.textContent = '✓';
    }

    // 5. Input kutusuna dikkat çekici hafif turuncu parlama ver
    input.classList.add('service-input-highlight');
    setTimeout(() => {
        input.classList.remove('service-input-highlight');
    }, 800);
}
window.setService = setService;

// 🌟 TEKLİF & SERVİS FORMU (KONFETİ + WHATSAPP YÖNLENDİRME)
function handleFormSubmit(e) {
    e.preventDefault();
    const name = document.getElementById('formName').value.trim();
    const phoneInput = document.getElementById('formPhone');
    const phone = phoneInput ? phoneInput.value.trim() : '';
    const district = document.getElementById('formDistrict').value.trim();
    const serviceInput = document.getElementById('formService');
    const service = (serviceInput ? serviceInput.value.trim() : '') || 'Genel Bilgi & Fiyat Talebi';
    const msg = document.getElementById('formMessage').value.trim();
    const errorHint = document.getElementById('phoneErrorHint');

    if (!name) {
        alert('Lütfen adınızı ve soyadınızı giriniz.');
        document.getElementById('formName').focus();
        return;
    }

    const cleanDigits = phone.replace(/\D/g, '');
    if (!cleanDigits || cleanDigits.length !== 11 || !cleanDigits.startsWith('05')) {
        if (errorHint) errorHint.classList.remove('hidden');
        if (phoneInput) {
            phoneInput.classList.remove('border-slate-300', 'border-emerald-500');
            phoneInput.classList.add('border-red-500', 'ring-1', 'ring-red-500/30');
            phoneInput.focus();
        }
        alert('Lütfen 11 haneli geçerli bir cep telefonu numarası giriniz (Örn: 05XX XXX XX XX).');
        return;
    }

    // Kutlama konfetisi
    if (typeof confetti === 'function') {
        confetti({
            particleCount: 120,
            spread: 80,
            origin: { y: 0.6 }
        });
    }

    // Admin panelinde görüntülenebilmesi için talebi Firestore'a kaydet
    if (typeof window.saveLeadToFirestore === 'function') {
        window.saveLeadToFirestore({ name, phone, district, service, message: msg });
    }

    const waMsg = encodeURIComponent(
        `*Kepenk Sistemleri - Yeni Fiyat & Servis Talebi:*\n` +
        `👤 *Ad Soyad / Firma:* ${name}\n` +
        `📞 *Telefon:* ${phone}\n` +
        `📍 *İlçe / Mahalle:* ${district || 'Belirtilmedi'}\n` +
        `🛠️ *Hizmet:* ${service}\n` +
        `📝 *Not:* ${msg || 'Belirtilmedi'}`
    );

    const waUrl = `https://wa.me/${getPhoneDigits()}?text=${waMsg}`;
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

    setTimeout(() => {
        if (isMobile) {
            window.location.href = waUrl;
        } else {
            window.open(waUrl, '_blank', 'noopener,noreferrer');
        }
    }, 350);
}

// 🌟 MOBİL MENÜ ÇEKMECESİ
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const mobileDrawer = document.getElementById('mobileDrawer');
if (mobileMenuBtn && mobileDrawer) {
    mobileMenuBtn.addEventListener('click', () => {
        mobileDrawer.classList.toggle('hidden');
    });
    document.querySelectorAll('.mobile-link').forEach(link => {
        link.addEventListener('click', () => {
            mobileDrawer.classList.add('hidden');
        });
    });
}

// ==========================================
// 🌟 4️⃣ 3D MANYETİK TİLT KART EFEKTİ (HOVER)
// ==========================================
function init3DTiltCards() {
    // Sadece masaüstü fare kullanıcılarında çalıştır
    if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
        const tiltCards = document.querySelectorAll('.clean-card, .project-card, .fault-select-btn');
        
        tiltCards.forEach(card => {
            card.classList.add('tilt-card');
            
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                const rotateX = ((y - centerY) / centerY) * -6; // max -6 to +6 deg
                const rotateY = ((x - centerX) / centerX) * 6;
                
                card.style.transform = `perspective(800px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-4px)`;
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) translateY(0px)';
            });
        });
    }
}
// ==========================================
// 🌟 8️⃣ SADECE ÖZEL ANİMASYONLU İMLEÇ NOKTASI (SADECE ANA SAYFA)
// ==========================================
function initAmbientGlowCursor() {
    if (!document.body.classList.contains('has-custom-cursor')) return;
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

    let dotEl = document.getElementById('customCursorDot');
    if (!dotEl) {
        dotEl = document.createElement('div');
        dotEl.id = 'customCursorDot';
        document.body.appendChild(dotEl);
    }

    let isMoving = false;

    window.addEventListener('mousemove', (e) => {
        dotEl.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0) translate(-50%, -50%)`;

        if (!isMoving) {
            dotEl.classList.add('active');
            isMoving = true;
        }
    }, { passive: true });

    document.addEventListener('mouseleave', () => {
        dotEl.classList.remove('active');
    });

    document.addEventListener('mouseenter', () => {
        dotEl.classList.add('active');
    });

    document.addEventListener('mousedown', () => {
        dotEl.classList.add('clicking');
    });

    document.addEventListener('mouseup', () => {
        dotEl.classList.remove('clicking');
    });

    const interactiveElements = document.querySelectorAll('a, button, [role="button"], .clean-card, .project-card, .fault-select-btn, .service-chip');
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => dotEl.classList.add('hover-link'));
        el.addEventListener('mouseleave', () => dotEl.classList.remove('hover-link'));
    });
}
// ==========================================
// 🌟 📱 FORM TELEFON NUMARASI OTOMATİK FORMATLAMA (INPUT MASK)
// ==========================================
function initPhoneMask() {
    const phoneInput = document.getElementById('formPhone');
    const validIcon = document.getElementById('phoneValidIcon');
    const errorHint = document.getElementById('phoneErrorHint');
    if (!phoneInput) return;

    function formatPhoneNumber(val) {
        let digits = val.replace(/\D/g, '');

        // +90 veya 90 ile yapıştırılan numaraları temizle
        if (digits.startsWith('90') && digits.length > 2) {
            digits = digits.slice(2);
        }

        // Eğer kullanıcı 5 ile başladıysa veya 0 ile başlamadıysa başına 0 ekle
        if (digits.length > 0 && !digits.startsWith('0')) {
            digits = '0' + digits;
        }

        // Maksimum 11 hane (05XX XXX XX XX)
        digits = digits.slice(0, 11);

        let formatted = '';
        if (digits.length > 0) {
            formatted = digits.substring(0, 1); // 0
        }
        if (digits.length > 1) {
            formatted += ' (' + digits.substring(1, Math.min(4, digits.length));
        }
        if (digits.length >= 4) {
            formatted += ') ';
        }
        if (digits.length > 4) {
            formatted += digits.substring(4, Math.min(7, digits.length));
        }
        if (digits.length > 7) {
            formatted += ' ' + digits.substring(7, Math.min(9, digits.length));
        }
        if (digits.length > 9) {
            formatted += ' ' + digits.substring(9, 11);
        }

        return { formatted, digits };
    }

    function updateValidationState(digits) {
        const isValid = digits.length === 11 && digits.startsWith('05');
        if (validIcon) {
            if (isValid) {
                validIcon.classList.remove('hidden');
                phoneInput.classList.add('is-valid');
                phoneInput.classList.remove('is-invalid');
            } else {
                validIcon.classList.add('hidden');
                phoneInput.classList.remove('is-valid');
            }
        }
        if (errorHint && isValid) {
            errorHint.classList.add('hidden');
        }
        return isValid;
    }

    phoneInput.addEventListener('input', () => {
        const { formatted, digits } = formatPhoneNumber(phoneInput.value);
        phoneInput.value = formatted;
        updateValidationState(digits);
    });

    // Backspace tuşunda parantez veya boşluklara takılmayı önleme
    phoneInput.addEventListener('keydown', (e) => {
        if (e.key === 'Backspace') {
            const selStart = phoneInput.selectionStart;
            const selEnd = phoneInput.selectionEnd;
            if (selStart === selEnd && selStart > 0) {
                const charBefore = phoneInput.value[selStart - 1];
                if (/\D/.test(charBefore)) {
                    e.preventDefault();
                    let raw = phoneInput.value.replace(/\D/g, '');
                    let digitsBefore = phoneInput.value.substring(0, selStart).replace(/\D/g, '').length;
                    if (digitsBefore > 0) {
                        raw = raw.substring(0, digitsBefore - 1) + raw.substring(digitsBefore);
                        const { formatted, digits } = formatPhoneNumber(raw);
                        phoneInput.value = formatted;
                        updateValidationState(digits);
                    } else {
                        phoneInput.value = '';
                        updateValidationState('');
                    }
                }
            }
        }
    });

    phoneInput.addEventListener('blur', () => {
        const digits = phoneInput.value.replace(/\D/g, '');
        if (digits.length > 0 && (digits.length < 11 || !digits.startsWith('05'))) {
            if (errorHint) errorHint.classList.remove('hidden');
            phoneInput.classList.add('is-invalid');
            phoneInput.classList.remove('is-valid');
        } else {
            if (errorHint) errorHint.classList.add('hidden');
            phoneInput.classList.remove('is-invalid');
        }
    });

    phoneInput.addEventListener('focus', () => {
        if (errorHint) errorHint.classList.add('hidden');
        phoneInput.classList.remove('is-invalid');
    });

    // Sayfa açıldığında başlangıç değeri varsa formatla
    if (phoneInput.value) {
        const { formatted, digits } = formatPhoneNumber(phoneInput.value);
        phoneInput.value = formatted;
        updateValidationState(digits);
    }
}

// ==========================================
// 🌟 🔝 AKILLI "YUKARI ÇIK" (BACK TO TOP) BUTONU & DAİRESEL İLERLEME
// ==========================================
function initBackToTop() {
    const btn = document.getElementById('backToTopBtn');
    const progressCircle = document.getElementById('backToTopProgress');
    if (!btn || !progressCircle) return;

    const totalCircumference = 125.66; // 2 * PI * 20
    let isTicking = false;

    function handleScroll() {
        const scrollY = window.scrollY || document.documentElement.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;

        // 280px kaydırıldığında butonu göster
        if (scrollY > 280) {
            btn.classList.add('visible');
        } else {
            btn.classList.remove('visible');
        }

        // SVG ilerleme çemberini güncelle (0% - 100%)
        if (scrollHeight > 0) {
            const scrollFraction = Math.min(Math.max(scrollY / scrollHeight, 0), 1);
            const offset = totalCircumference - (scrollFraction * totalCircumference);
            progressCircle.style.strokeDashoffset = offset.toFixed(2);
        }

        isTicking = false;
    }

    window.addEventListener('scroll', () => {
        if (!isTicking) {
            window.requestAnimationFrame(handleScroll);
            isTicking = true;
        }
    }, { passive: true });

    btn.addEventListener('click', (e) => {
        e.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // İlk yüklemede konumu kontrol et
    handleScroll();
}


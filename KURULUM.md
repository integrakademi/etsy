# 🚀 Dijital Ürün Roketi — Canlı Yayın Kılavuzu

Bu klasörü Vercel'e yükleyince, jürinin tıklayıp gerçekten AI üretimi deneyebileceği
canlı bir link elde edeceksin. Kod yazman gerekmiyor — sadece yükle ve anahtarını gir.

---

## ADIM 1 — Gemini API anahtarını al (2 dakika, ücretsiz)

1. https://aistudio.google.com/apikey adresine git (Google hesabınla gir)
2. **"Create API key"** butonuna tıkla
3. Bir projede oluştur, çıkan anahtarı kopyala (AIza... ile başlar)
4. Bu anahtarı bir kenara not et. KİMSEYLE PAYLAŞMA.

---

## ADIM 2 — Vercel hesabı aç (ücretsiz)

1. https://vercel.com adresine git
2. **"Sign Up"** → Google ile giriş yap (en kolayı)

---

## ADIM 3 — Projeyi yükle

### Kolay yol (sürükle-bırak):
1. Bu `roket` klasörünü bilgisayarında bul
2. Vercel panelinde **"Add New..." → "Project"**
3. Açılan ekranda projeyi yüklemek için klasörü seç veya
   "deploy" alanına klasörü sürükle

### Alternatif (GitHub ile — daha kalıcı):
1. Klasörü GitHub'a yükle (yeni repo)
2. Vercel'de "Import Git Repository" → repoyu seç

---

## ADIM 4 — Gizli anahtarı gir (EN ÖNEMLİ ADIM)

Yüklerken veya yükledikten sonra:

1. Vercel'de projenin **Settings → Environment Variables** bölümüne git
2. Yeni değişken ekle:
   - **Name (Ad):** `GEMINI_API_KEY`
   - **Value (Değer):** ADIM 1'de kopyaladığın anahtar
3. Kaydet
4. **Deployments** sekmesinden son dağıtımı **"Redeploy"** et
   (anahtarın aktif olması için bu şart)

> ⚠️ Anahtar burada gizli kalır, tarayıcıda asla görünmez. Güvenlidir.

---

## ADIM 5 — Linki al ve forma yapıştır

1. Vercel sana şöyle bir link verir: `https://dijital-urun-roketi.vercel.app`
2. Linke tıkla, kendin bir niş + dil seçip "Paketi üret"e bas — çalışıyor mu kontrol et
3. Çalışıyorsa, bu linki Google Form'daki "proje linki" alanına yapıştır ✅

---

## Sorun mu çıktı?

- **"Üretim yapılamadı" hatası:** Anahtarı doğru girdin mi? Redeploy ettin mi?
- **Anahtar adı tam olarak** `GEMINI_API_KEY` olmalı (büyük harf, alt çizgi).
- Gemini ücretsiz kotası bir demo için fazlasıyla yeter; endişelenme.

Kolay gelsin! 🌿

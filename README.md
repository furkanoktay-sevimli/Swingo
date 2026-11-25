# Swingo — Tek Dokunuş Sarkaç Oyunu

Mobil uyumlu, sıfır bağımlılıklı HTML5 Canvas sarkaç arcade oyunu.

## Özellikler
- **Tek Dokunuş Fizik & Ritim:** 35°–65° sapan penceresi, hafifletilmiş çıkış yerçekimi ve 4 farklı kanca türü (Standart, Altın, Kırılgan, Mor İtici).
- **Mobil Öncelikli Tasarım:** Dikey (portrait) telefon ekranlarında kamerayı otomatik ölçekler, `100dvh` ve `safe-area-inset` destekler.
- **Sosyal Paylaşım:** Oyun sonu ekranında tek dokunuşla skor paylaşımı (`navigator.share` + pano yedeği) ve **Günün Parkuru (Daily Seed)** modu.

## GitHub'a Yükleme ve Vercel'de Yayınlama

1. GitHub'da `github.com/furkanoktay-sevimli` altında `swingo` adında yeni bir repo oluştur.
2. Bu klasörde terminali açıp aşağıdaki komutları çalıştır:

```bash
git init
git add .
git commit -m "Initial commit: Swingo mobile game"
git branch -M main
git remote add origin https://github.com/furkanoktay-sevimli/swingo.git
git push -u origin main
```

3. [Vercel](https://vercel.com/new) üzerinden `furkanoktay-sevimli/swingo` reposunu seç ve **Deploy** butonuna bas (herhangi bir build komutu gerekmez, doğrudan statik olarak yayınlanır).

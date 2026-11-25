# Swingo — Global Liderlik Tablosu ile Vercel Yayını

## Global Liderlik Tablosunu 3 Adımda Aktif Etme (Ücretsiz)

Bu paket sıfır bağımlılıklı `/api/leaderboard.js` serverless fonksiyonu ile gelir.

1. Bu klasördeki dosyaları `github.com/furkanoktay-sevimli/swingo` reposuna gönder (`git add . && git commit -m "Add global leaderboard" && git push`).
2. Vercel panelinde **Swingo** projeni aç → üst menüden **Storage** sekmesine gir → **Create Database** → **Upstash Redis** (ücretsiz plan) seçip projene bağla.
3. Vercel otomatik olarak `KV_REST_API_URL` ve `KV_REST_API_TOKEN` (veya `UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN`) ortam değişkenlerini ekleyecektir. Son olarak **Deployments → Redeploy** yap; **Tüm Zamanlar** ve **Günün Parkuru** global liderlik tabloları anında canlıya geçer.

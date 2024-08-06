const request = require("supertest"); // SuperTest modülünü projeye dahil ediyoruz.
const express = require("express"); // Express modülünü projeye dahil ediyoruz.
const session = require("express-session"); // Express Session modülünü projeye dahil ediyoruz.
const authRoutes = require("../routes/auth"); // Kimlik doğrulama rotalarını projeye dahil ediyoruz.

const app = express(); // Yeni bir Express uygulaması oluşturuyoruz.

// Express uygulamasının yapılandırılması
app.use(express.urlencoded({ extended: false }));
app.use(
  session({ secret: "secret-key", resave: false, saveUninitialized: true })
);
app.set("view engine", "pug");
app.use("/auth", authRoutes); // Kimlik doğrulama rotalarını '/auth' rotası altına ekliyoruz.

describe("Kimlik Doğrulama Rotaları", () => {
  it("Giriş sayfasını göstermeli", async () => {
    const res = await request(app).get("/auth/login"); // /auth/login rotasına GET isteği gönderiyoruz.
    expect(res.statusCode).toEqual(200); // Durum kodunun 200 olduğunu doğruluyoruz.
    expect(res.text).toContain("Giriş Yap"); // Yanıtın içinde 'Giriş Yap' kelimesini içerdiğini doğruluyoruz.
  });

  it("Yanlış kimlik bilgileri ile giriş yapmamalı", async () => {
    const res = await request(app)
      .post("/auth/login") // /auth/login rotasına POST isteği gönderiyoruz.
      .send({ username: "mertcanturker", password: "yanlis" }); // Yanlış kimlik bilgilerini gönderiyoruz.
    expect(res.statusCode).toEqual(200); // Durum kodunun 200 olduğunu doğruluyoruz.
    expect(res.text).toContain("Geçersiz kullanıcı adı veya şifre"); // Yanıtın içinde hata mesajını içerdiğini doğruluyoruz.
  });

  it("Çıkış yapmalı", async () => {
    const agent = request.agent(app); // Oturum açmak için bir SuperTest ajanı oluşturuyoruz.
    await agent
      .post("/auth/login") // /auth/login rotasına POST isteği gönderiyoruz.
      .send({ username: "mertcanturker", password: "1234" }); // Doğru kimlik bilgilerini gönderiyoruz.

    const res = await agent.get("/auth/logout"); // Oturum açmış kullanıcı olarak /auth/logout rotasına GET isteği gönderiyoruz.
    expect(res.statusCode).toEqual(302); // Durum kodunun 302 olduğunu (yönlendirme) doğruluyoruz.
    expect(res.headers.location).toBe("/auth/login"); // Yönlendirme adresinin /auth/login olduğunu doğruluyoruz.
  });
});

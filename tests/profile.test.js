const request = require("supertest"); // SuperTest modülünü projeye dahil ediyoruz.
const express = require("express"); // Express modülünü projeye dahil ediyoruz.
const session = require("express-session"); // Express Session modülünü projeye dahil ediyoruz.
const bodyParser = require("body-parser"); // Body parser modülünü projeye dahil ediyoruz.
const authRoutes = require("../routes/auth"); // Kimlik doğrulama rotalarını projeye dahil ediyoruz.
const profileRoutes = require("../routes/profile"); // Profil yönetimi rotalarını projeye dahil ediyoruz.

const app = express(); // Yeni bir Express uygulaması oluşturuyoruz.

// Express uygulamasının yapılandırılması
app.use(bodyParser.urlencoded({ extended: false }));
app.use(
  session({ secret: "secret-key", resave: false, saveUninitialized: true })
);
app.set("view engine", "pug");

// Oturum açma ve profil yönetimi rotalarını dahil etme
app.use("/auth", authRoutes);
app.use("/profile", profileRoutes);

describe("Profil Rotaları", () => {
  let agent;

  beforeEach(async () => {
    agent = request.agent(app);
    await agent
      .post("/auth/login") // /auth/login rotasına POST isteği gönderiyoruz.
      .send({ username: "mertcanturker", password: "1234" }); // Doğru kimlik bilgilerini gönderiyoruz.
  });

  it("Yanlış eski şifre ile profil bilgilerini güncelleyememeli", async () => {
    const res = await agent
      .post("/profile/update") // /profile/update rotasına POST isteği gönderiyoruz.
      .send({
        username: "mertcanturker",
        oldPassword: "wrong_password",
        newPassword: "5678",
      }); // Yanlış eski şifreyi gönderiyoruz.
    expect(res.statusCode).toEqual(200); // Durum kodunun 200 olduğunu doğruluyoruz.
    expect(res.text).toContain("Eski şifre yanlış."); // Yanıtın içinde hata mesajını içerdiğini doğruluyoruz.
  });
});

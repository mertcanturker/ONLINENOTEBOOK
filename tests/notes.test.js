const request = require("supertest"); // SuperTest modülünü projeye dahil ediyoruz.
const express = require("express"); // Express modülünü projeye dahil ediyoruz.
const bodyParser = require("body-parser"); // Body parser modülünü projeye dahil ediyoruz.
const notesRoutes = require("../routes/notes"); // Not yönetimi rotalarını projeye dahil ediyoruz.

const app = express(); // Yeni bir Express uygulaması oluşturuyoruz.
app.use(bodyParser.urlencoded({ extended: false })); // Body parser middleware'i kullanarak URL-encoded veriyi işliyoruz.
app.set("view engine", "pug"); // View engine olarak Pug kullanıyoruz.
app.use("/notes", notesRoutes); // Not yönetimi rotalarını '/notes' rotası altına ekliyoruz.

describe("Notlar Rotaları", () => {
  it("Tüm notları listelemeli", async () => {
    const res = await request(app).get("/notes"); // /notes rotasına GET isteği gönderiyoruz.
    expect(res.statusCode).toEqual(200); // Durum kodunun 200 olduğunu doğruluyoruz.
    expect(res.text).toContain("Notlar"); // Yanıtın içinde 'Notlar' kelimesini içerdiğini doğruluyoruz.
  });

  it("Not ekleme formunu göstermeli", async () => {
    const res = await request(app).get("/notes/add"); // /notes/add rotasına GET isteği gönderiyoruz.
    expect(res.statusCode).toEqual(200); // Durum kodunun 200 olduğunu doğruluyoruz.
    expect(res.text).toContain("Yeni Not Ekle"); // Yanıtın içinde 'Yeni Not Ekle' kelimesini içerdiğini doğruluyoruz.
  });

  it("Mevcut olmayan bir notu düzenleme sayfasına yönlendirmemeli", async () => {
    const res = await request(app).get("/notes/edit/999"); // /notes/edit/999 rotasına GET isteği gönderiyoruz.
    expect(res.statusCode).toEqual(302); // Durum kodunun 302 olduğunu (yönlendirme) doğruluyoruz.
    expect(res.headers.location).toBe("/notes"); // Yönlendirme adresinin /notes olduğunu doğruluyoruz.
  });
});

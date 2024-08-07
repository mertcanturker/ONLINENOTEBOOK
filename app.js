const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const session = require("express-session");
// const mongoose = require('mongoose');

const app = express();

/* Veritabanı bağlantısı için fonksiyon
async function connectToDatabase() {
  try {
    // MongoDB bağlantı URL'si
    const dbURI = "mongodb://localhost:27017";

    // MongoDB'ye bağlanma işlemi
    await mongoose.connect(dbURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("MongoDB veritabanına başarıyla bağlandı");
  } catch (error) {
    console.error("MongoDB bağlantısı başarısız:", error.message);
    // Uygulamayı durdurma (opsiyonel)
    process.exit(1);
  }
}

// Veritabanı bağlantısını başlatma
connectToDatabase();

// Middleware'lerin kullanılması
app.use(bodyParser.json());

// Ana route
app.get("/", (req, res) => {
  res.send("Merhaba, MongoDB ile Node.js uygulamasına hoş geldiniz!");
}); 

*/

const SECRET_KEY = "your_secret_key"; // Gizli anahtarınızı belirleyin

// Body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));

// Pug template engine ayarları
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

// Kullanıcı bilgileri
const USERNAME = "mertcanturker";
const PASSWORD = "1234";

// JWT oluşturma fonksiyonu
function generateToken(user) {
  return jwt.sign(user, SECRET_KEY, { expiresIn: "1h" });
}

// Login route
app.get("/login", (req, res) => {
  res.render("login", { message: "" });
});

app.post("/login", (req, res) => {
  const { username, password } = req.body;
  if (username === USERNAME && password === PASSWORD) {
    const token = generateToken({ username });
    res.json({ token });
  } else {
    res.render("login", { message: "Kullanıcı adı veya şifre yanlış!" });
  }
});

// Token doğrulama middleware
function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return res.sendStatus(401);

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

// Dashboard route
app.get("/index", authenticateToken, (req, res) => {
  res.render("index", { user: req.user.username });
});

// Statik dosyalar
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({ extended: false }));

// Session ayarları
app.use(
  session({
    secret: "your-secret-key",
    resave: false,
    saveUninitialized: true,
  })
);

const notesRouter = require("./routes/notes");
const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");

app.use("/notes", notesRouter);
app.use("/auth", authRouter);
app.use("/profile", profileRouter);

app.get("/", (req, res) => {
  if (req.session.loggedIn) {
    res.render("index", { title: "Çevrimiçi Not Defteri" });
  } else {
    res.redirect("/auth/login");
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Sunucu ${PORT} portunda çalışıyor`);
});

module.exports = app;

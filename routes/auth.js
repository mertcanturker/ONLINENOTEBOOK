const express = require("express");
const router = express.Router();

// Sabit kullanıcı bilgileri
const user = {
  username: "mertcanturker",
  password: "1234",
};

router.get("/login", (req, res) => {
  res.render("login", { title: "Giriş Yap", error: null });
});

router.post("/login", (req, res) => {
  const { username, password } = req.body;
  if (username === user.username && password === user.password) {
    req.session.loggedIn = true;
    res.redirect("/");
  } else {
    res.render("login", {
      title: "Giriş Yap",
      error: "Geçersiz kullanıcı adı veya şifre",
    });
  }
});

router.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.redirect("/");
    }
    res.redirect("/auth/login");
  });
});

module.exports = router;

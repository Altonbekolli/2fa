const express = require("express");
const nodemailer = require("nodemailer");
const fs = require("fs");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

let generatedCodes = {}; // 2FA-Codes temporär speichern

// Benutzer aus Datei laden
let users = [];
try {
  users = JSON.parse(fs.readFileSync("users.json"));
} catch (err) {
  console.error("users.json nicht gefunden oder leer.");
}

// TEST-MAIL ENDPOINT
app.get("/test-mail", (req, res) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.web.de",
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: `"2FA System" <${process.env.EMAIL_USER}>`,
    to: process.env.EMAIL_USER, // an mich
    subject: "Testmail vom Server",
    text: "Wenn du das hier liest, funktioniert Web.de SMTP korrekt. ",
  };

  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.error(" Mailversand fehlgeschlagen:", err);
      return res.status(500).send("Fehler beim Mailversand");
    }
    console.log(" Mail gesendet:", info.response);
    res.send("Testmail erfolgreich gesendet!");
  });
});

//  Registrierung
app.post("/register", (req, res) => {
  const { username, password, email } = req.body;

  if (!username || !password || !email) {
    return res.status(400).json({ message: "Alle Felder ausfüllen!" });
  }

  const userExists = users.find((u) => u.username === username);
  if (userExists) {
    return res.status(409).json({ message: "Benutzername existiert bereits" });
  }

  const newUser = { username, password, email };
  users.push(newUser);
  fs.writeFileSync("users.json", JSON.stringify(users, null, 2));

  res.json({ message: "Benutzer erfolgreich registriert" });
});

//  Login + 2FA-Code senden
app.post("/login", (req, res) => {
  const { username, password } = req.body;
  const user = users.find(
    (u) => u.username === username && u.password === password
  );

  if (!user) {
    return res.status(401).json({ message: "Login fehlgeschlagen" });
  }

  const code = Math.floor(100000 + Math.random() * 900000).toString();
  generatedCodes[username] = code;

  const transporter = nodemailer.createTransport({
    host: "smtp.web.de",
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: `"2FA System" <${process.env.EMAIL_USER}>`,
    to: user.email,
    subject: "🔐 Dein 2FA-Code",
    text: `Hallo ${username},\n\nDein Einmalcode lautet: ${code}\nEr ist 5 Minuten gültig.`,
  };

  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.error("Fehler beim Mailversand:", err);
      return res.status(500).json({ message: "E-Mail konnte nicht gesendet werden" });
    }
    res.json({ message: "Login ok – Code per Mail gesendet" });
  });
});

//  2FA-Code verifizieren
app.post("/verify", (req, res) => {
  const { username, code } = req.body;
  if (generatedCodes[username] === code) {
    delete generatedCodes[username];
    return res.json({ message: "Code korrekt – Zugriff gewährt" });
  } else {
    return res.status(403).json({ message: "Falscher Code" });
  }
});

//  Server starten
app.listen(PORT, () => {
  console.log(`Server läuft auf http://localhost:${PORT}`);
});

// Login OHNE 2FA (neu)
app.post("/login-simple", (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username && u.password === password);
  if (!user) return res.status(401).json({ message: "Login fehlgeschlagen" });
  return res.json({ message: "Login erfolgreich" });
});


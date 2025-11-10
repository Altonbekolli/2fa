#  Simple Login Page mit 2FA (und ohne 2FA)

Dieses Projekt ist eine kleine **Login-Webanwendung** mit **zwei Varianten**:  
1. **Mit Zwei-Faktor-Authentifizierung (2FA)**  
2. **Ohne Zwei-Faktor-Authentifizierung (Standard-Login)**  

Ich habe das Projekt **zusammen mit einem Freund** entwickelt, da er Hilfe beim Thema Node.js und 2FA gebraucht hat.  
Ziel war es, eine einfache, verständliche Lösung nur mit **HTML, CSS, JavaScript** und einem kleinen **Express-Backend** zu bauen.

---

##  Technologien

**Frontend:**
- HTML  
- CSS  
- JavaScript (fetch + JSON)

**Backend:**
- Node.js  
- Express  
- Nodemailer (für 2FA-E-Mail-Code)
- CORS  
- dotenv  
- fs (Dateispeicherung der Benutzer)

---

##  Installation & Start

### 1. Repository klonen
```bash
git clone https://github.com/<username>/<repo-name>.git
cd <repo-name>/2FABackend

### **2. Abhängigkeiten installieren**
npm install


### **3. .env Datei erstellen**
Erstelle im Ordner 2FABackend eine Datei mit dem Namen .env und füge deine SMTP-Zugangsdaten hinzu.
Beispiel:
EMAIL_USER=deine-email@web.de
EMAIL_PASS=dein-passwort

Diese Zugangsdaten werden benötigt, damit Nodemailer E-Mails mit dem 2FA-Code versenden kann.
Zum Testen kann ein Web.de oder Gmail-Konto verwendet werden.

### **4. Server Starten**
node server.js

## API-Endpunkte

### 1. Registrierung
**POST** `/register`  
Registriert einen neuen Benutzer.

**Request-Body (JSON):**
```json
{
  "username": "testuser",
  "password": "123456",
  "email": "test@mail.de"
}

### 2.Login mit Zwei-Faktor-Authentifizierung (2FA)
POST /login
Überprüft Benutzername und Passwort.
Wenn gültig, wird ein sechsstelliger Einmalcode per E-Mail an den Benutzer gesendet.

### 3. 2FA-Code verifizieren
POST /verify
Prüft, ob der eingegebene Code korrekt ist.


### 4. Login ohne Zwei-Faktor-Authentifizierung
POST /login-simple
Ermöglicht einen normalen Login ohne Code.


### 5. Test-Mail (SMTP-Test)
GET /test-mail
Sendet eine Test-E-Mail an die im .env-File hinterlegte Adresse, um zu prüfen, ob der Mailversand funktioniert.

**Hinweis:**
Das Projekt wurde als Lernprojekt erstellt, um zu verstehen, wie eine einfache Login-Seite mit und ohne Zwei-Faktor-Authentifizierung funktioniert.
Es ist nicht für den produktiven Einsatz gedacht, sondern dient zu Lern und Demonstrationszwecken.

Autoren
Alton Bekolli
Usameh06-tech

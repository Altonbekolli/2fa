const API = location.hostname.includes('localhost')
  ? 'http://localhost:3000'
  : 'https://twofa-5ek9.onrender.com';

function toggleRegister(showRegister) {
  document.getElementById("code-container").classList.add("hidden");
  document.getElementById("success-container").classList.add("hidden");

  const ids = ["username", "password", "code"];
  ids.forEach(id => { const el = document.getElementById(id); if (el) el.value = ""; });

  document.getElementById("login-container").classList.toggle("hidden", showRegister);
  document.getElementById("register-container").classList.toggle("hidden", !showRegister);
}


//  Registrierung
async function register() {
  const username = document.getElementById("reg-username").value;
  const password = document.getElementById("reg-password").value;
  const email = document.getElementById("reg-email").value;

  const response = await fetch(`${API}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password, email }),
  });

  const data = await response.json();

  if (response.ok) {
    alert("Benutzer erfolgreich registriert!");
    toggleRegister(false); // zurück zum Login
  } else {
    alert(" Registrierung fehlgeschlagen: " + data.message);
  }
}

// Login
async function checkLogin() {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  const response = await fetch(`${API}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });

  const data = await response.json();

  if (response.ok) {
    document.getElementById("login-container").classList.add("hidden");
    document.getElementById("code-container").classList.remove("hidden");
    alert("2FA-Code wurde an deine E-Mail gesendet.");
  } else {
    alert("Failed" + data.message);
  }
}

// 2FA-Code eingeben
async function verifyCode() {
  const username = document.getElementById("username").value;
  const code = document.getElementById("code").value;

  const response = await fetch(`${API}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, code }),
  });

  const data = await response.json();

  if (response.ok) {
    document.getElementById("code-container").classList.add("hidden");
    document.getElementById("success-container").classList.remove("hidden");
  } else {
    alert("Failed " + data.message);
  }
}

// logout 
function logout() {
  document.getElementById("success-container").classList.add("hidden");
  document.getElementById("code-container").classList.add("hidden"); 
  document.getElementById("register-container").classList.add("hidden"); 
  document.getElementById("login-container").classList.remove("hidden");

  document.getElementById("username").value = "";
  document.getElementById("password").value = "";
  const codeEl = document.getElementById("code"); 
  if (codeEl){
    codeEl.value = "";
  } 
}

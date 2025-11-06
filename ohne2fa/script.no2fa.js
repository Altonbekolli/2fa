const host = location.hostname;
const isLocal =
  host === 'localhost' || host === '127.0.0.1' || host.endsWith('.local');

const API = isLocal ? 'http://localhost:3000' : 'https://twofa-5ek9.onrender.com';

function toggleRegister(showRegister) {
  document.getElementById("success-container").classList.add("hidden");
  ["username","password","code"].forEach(id => { const el=document.getElementById(id); if (el) el.value=""; });
  document.getElementById("login-container").classList.toggle("hidden", showRegister);
  document.getElementById("register-container").classList.toggle("hidden", !showRegister);
}

// Registrierung (gleich)
async function register() {
  const username = document.getElementById("reg-username").value;
  const password = document.getElementById("reg-password").value;
  const email    = document.getElementById("reg-email").value;

  const res  = await fetch(`${API}/register`, {
    method:"POST", headers:{ "Content-Type":"application/json" },
    body: JSON.stringify({ username, password, email })
  });
  const data = await res.json();
  if (res.ok) { alert("Benutzer erfolgreich registriert!"); toggleRegister(false); }
  else { alert("Registrierung fehlgeschlagen: " + (data.message||"")); }
}

// Login OHNE 2FA: ruft /login-simple
async function checkLogin() {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  const res  = await fetch(`${API}/login-simple`, {
    method:"POST", headers:{ "Content-Type":"application/json" },
    body: JSON.stringify({ username, password })
  });
  const data = await res.json();

  if (res.ok) {
    document.getElementById("login-container").classList.add("hidden");
    const codeC = document.getElementById("code-container"); // falls noch im DOM
    if (codeC) codeC.classList.add("hidden");
    document.getElementById("success-container").classList.remove("hidden");
  } else {
    alert("Login fehlgeschlagen: " + (data.message||""));
  }
}

function logout() {
  document.getElementById("success-container").classList.add("hidden");
  document.getElementById("register-container").classList.add("hidden");
  document.getElementById("login-container").classList.remove("hidden");
  const ids = ["username","password","code"];
  ids.forEach(id => { const el=document.getElementById(id); if (el) el.value=""; });
}

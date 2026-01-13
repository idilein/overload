// Verbindung zum WebSocket-Server aufbauen
const socket = io();

// DOM-Elemente holen
const statusEl = document.getElementById("status");
const textInput = document.getElementById("textInput");
const sendBtn = document.getElementById("sendBtn");

document.addEventListener("DOMContentLoaded", () => {
  textInput.focus();
});

/* Verbindungsstatus anzeigen
socket.on("connect", () => {
  statusEl.textContent = "verbunden ✅";
});

socket.on("disconnect", () => {
  statusEl.textContent = "getrennt ❌";
});
*/

// Wenn auf "Senden" geklickt wird → Text an den Server schicken
sendBtn.addEventListener("click", () => {
  const text = textInput.value.trim();

  if (!text) {
    alert("Bitte zuerst Text eingeben.");
    return;
  }

  // Event "submit_text" an den Server senden
  socket.emit("submit_text", { text });

  // Textfeld leeren
  textInput.value = "";
  textInput.focus(); //cursor aktiv
});

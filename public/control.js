const socket = io();

const statusEl = document.getElementById("status");
const buttons = document.querySelectorAll("button[data-action]");

socket.on("connect", () => {
  statusEl.textContent = `Status: verbunden (Socket ID: ${socket.id})`;
});

socket.on("disconnect", () => {
  statusEl.textContent = "Status: getrennt";
});

// Buttons → audio_control-Event
buttons.forEach((btn) => {
  btn.addEventListener("click", () => {
    const action = btn.dataset.action;
    socket.emit("audio_control", { action });
    statusEl.textContent = `Sende Aktion: ${action} ...`;
  });
});

// Rückmeldung vom Server
socket.on("audio_ack", (payload) => {
  if (payload.ok) {
    statusEl.textContent = `Audio OK: ${payload.action}`;
  } else {
    statusEl.textContent = `Audio ERROR: ${payload.error || "unbekannter Fehler"}`;
  }
});

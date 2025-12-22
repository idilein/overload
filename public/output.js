// WebSocket-Verbindung aufbauen
const socket = io();

const statusEl = document.getElementById("status");
const lastUpdateEl = document.getElementById("lastUpdate");
const projectionTextEl = document.getElementById("projectionText");

// nur zum Testen: schauen, ob output.js überhaupt geladen wird
console.log("output.js wurde geladen");

// Status anzeigen
socket.on("connect", () => {
  console.log("Output: WebSocket verbunden");
  statusEl.textContent = "WebSocket: verbunden ✅";
});

socket.on("disconnect", () => {
  console.log("Output: WebSocket getrennt");
  statusEl.textContent = "WebSocket: getrennt ❌";
});

// Wenn vom Server ein neuer Text kommt
socket.on("new_text", (data) => {
  console.log("Output: new_text empfangen:", data);

  const text = (data && data.text) || "";

  let transformed = text;

  // Sicher checken, ob die Funktion existiert
  if (typeof simulateDyslexia === "function") {
    try {
      transformed = simulateDyslexia(text);
    } catch (err) {
      console.error("Fehler in simulateDyslexia:", err);
      transformed = text; // Fallback: normalen Text anzeigen
    }
  } else {
    console.warn(
      "simulateDyslexia ist nicht definiert – zeige Text ohne Transformation an."
    );
  }

  projectionTextEl.textContent = transformed;

  const now = new Date().toLocaleTimeString();
  lastUpdateEl.textContent = `Letztes Update: ${now}`;
});

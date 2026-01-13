const socket = io();

const statusEl = document.getElementById("status");
const lastUpdateEl = document.getElementById("lastUpdate");

const blocks = {
  center: document.getElementById("center"),
  topLeft: document.getElementById("topLeft"),
  topRight: document.getElementById("topRight"),
  bottomCenter: document.getElementById("bottomCenter"),
};

// Cache: socketId -> { raw, transformed }
const transformCache = {};

socket.on("connect", () => {
  statusEl.textContent = "WebSocket: verbunden ✅";
});

socket.on("disconnect", () => {
  statusEl.textContent = "WebSocket: getrennt ❌";
});

function transformOnce(socketId, rawText) {
  // Wenn Text identisch wie letztes Mal: gleiche Transformation zurückgeben
  if (transformCache[socketId]?.raw === rawText) {
    return transformCache[socketId].transformed;
  }

  // Sonst neu berechnen (einmal)
  let transformed = rawText;

  if (typeof simulateDyslexia === "function") {
    try {
      transformed = simulateDyslexia(rawText);
    } catch (e) {
      console.error("simulateDyslexia error:", e);
      transformed = rawText;
    }
  }

  transformCache[socketId] = { raw: rawText, transformed };
  return transformed;
}

socket.on("projection_update", (state) => {
  // Wenn Reset: alles leeren + Cache leeren
  if (!state || Object.keys(state).length === 0) {
    Object.values(blocks).forEach((el) => {
      el.textContent = "";
      el.classList.remove("active");
    });

    // optional: Cache leeren, damit neue Session frisch startet
    for (const k of Object.keys(transformCache)) delete transformCache[k];

    lastUpdateEl.textContent = "";
    return;
  }

  // Optional: Slots nicht leeren, damit Texte "stehen bleiben"
  // Wir setzen aber aktive Slots, die wir gerade updaten
  for (const el of Object.values(blocks)) {
    el.classList.remove("active");
  }

  // state ist: { socketId: { slot, text } }
  for (const [socketId, entry] of Object.entries(state)) {
    const slot = entry.slot;
    const raw = entry.text || "";
    const el = blocks[slot];
    if (!el) continue;

    const stableTransformed = transformOnce(socketId, raw);

    el.textContent = stableTransformed;
    el.classList.add("active");
  }

  const now = new Date().toLocaleTimeString();
  lastUpdateEl.textContent = `Letztes Update: ${now}`;
});

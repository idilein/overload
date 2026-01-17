// output.js (ES Module)
import { jumpifyText } from "./jumpify.js";

const socket = io();

const statusEl = document.getElementById("status");
const lastUpdateEl = document.getElementById("lastUpdate");

// ----------------------
// Slot-Elemente
// ----------------------
const blocks = {
  topLeft: document.getElementById("topLeft"),
  center: document.getElementById("center"),
  bottomRight: document.getElementById("bottomRight"),
};

// ----------------------
// Caches
// ----------------------

// socketId -> { raw, transformed }
const transformCache = {};

// slotName -> stable transformed text
const slotBaseText = {
  topLeft: "",
  center: "",
  bottomRight: "",
};

// ----------------------
// Jumping Letters Config
// ----------------------
const JUMP_TICK_MS = 150;      // wie oft "springen" (100–200ms gut)
const JUMP_WORD_PROB = 0.08;   // Anteil betroffener Wörter (0.05–0.1 realistisch)

// ----------------------
// Helper: stabile Dyslexia-Transformation
// ----------------------
function transformOnce(socketId, rawText) {
  if (transformCache[socketId]?.raw === rawText) {
    return transformCache[socketId].transformed;
  }

  let transformed = rawText;

  if (typeof simulateDyslexia === "function") {
    try {
      transformed = simulateDyslexia(rawText);
    } catch (err) {
      console.error("simulateDyslexia error:", err);
      transformed = rawText;
    }
  }

  transformCache[socketId] = { raw: rawText, transformed };
  return transformed;
}

// ----------------------
// WebSocket Events
// ----------------------
socket.on("projection_update", (state) => {
  // RESET-FALL
  if (!state || Object.keys(state).length === 0) {
    Object.values(blocks).forEach((el) => {
      el.textContent = "";
      el.classList.remove("active");
    });

    for (const k of Object.keys(transformCache)) delete transformCache[k];
    for (const k of Object.keys(slotBaseText)) slotBaseText[k] = "";

    lastUpdateEl.textContent = "";
    return;
  }

  // aktive Slots zurücksetzen (aber Inhalt nicht löschen)
  Object.values(blocks).forEach((el) => el.classList.remove("active"));

  // state: { socketId: { slot, text } }
  for (const [socketId, entry] of Object.entries(state)) {
    const slot = entry.slot;
    const raw = entry.text || "";
    const el = blocks[slot];
    if (!el) continue;

    // 1) stabile Dyslexia-Transformation
    const stableText = transformOnce(socketId, raw);

    // 2) als BaseText pro Slot speichern
    slotBaseText[slot] = stableText;

    el.classList.add("active");
  }

  lastUpdateEl.textContent =
    "Last update: " + new Date().toLocaleTimeString();
});

// ----------------------
// Render Loop: Jumping Letters (nur Darstellung)
// ----------------------
setInterval(() => {
  for (const [slot, el] of Object.entries(blocks)) {
    if (!el.classList.contains("active")) continue;

    const base = slotBaseText[slot];
    if (!base) continue;

    const jumped = jumpifyText(base, {
      wordProb: JUMP_WORD_PROB,
    });

    el.textContent = jumped;
  }
}, JUMP_TICK_MS);

// server.js  (ESM-Version)

// ----------------------
// Imports
// ----------------------
import path from "path";
import express from "express";
import http from "http";
import { Server } from "socket.io";
import { fileURLToPath } from "url";
import { Client } from "node-osc";

// ----------------------
// __dirname nachbauen (ESM hat das nicht)
// ----------------------
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ----------------------
// Basis Setup
// ----------------------
const app = express();
const server = http.createServer(app);
const io = new Server(server);

const PORT = process.env.PORT || 3000;

// ----------------------
// Static Files
// ----------------------
app.use(express.static(path.join(__dirname, "public")));

app.get("/input", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "input.html"));
});

app.get("/output", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "output.html"));
});

app.get("/control", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "control.html"));
});


// ----------------------
// OSC
// ----------------------
const OSC_HOST = "10.2.2.70"; // IP des Mac mini
const OSC_PORT = 3000;

const oscClient = new Client(OSC_HOST, OSC_PORT);

function sendOsc(address, args = []) {
  const payload = Array.isArray(args) ? args : [args];
  return new Promise((resolve, reject) => {
    oscClient.send(address, ...payload, (err) => {
      if (err) {
        console.error("OSC error:", err);
        return reject(err);
      }
      console.log("OSC sent:", address, payload);
      resolve();
    });
  });
}

// ----------------------
// Audio Mapping
// ----------------------
const AUDIO_MAP = {
  scene_low: () => sendOsc("start_scene", 0),
  scene_mid: () => sendOsc("start_scene", 1),
  scene_high: () => sendOsc("start_scene", 2),

  clip_test: () => sendOsc("start_clip", [1, 0]),

  stop_all: () => sendOsc("stop_all", 0),
};

// ----------------------
// Projection Slot State (max 3 inputs)
// ----------------------
const SLOT_ORDER = ["center", "topLeft", "topRight", "bottomCenter"];

// socket.id -> { slot, text }
const projectionState = {};

// Reihenfolge der Teilnehmer (max 3)
const inputOrder = [];

// ----------------------
// WebSocket Handling
// ----------------------
io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  socket.on("submit_text", (data) => {
  const text = data?.text || "";
  console.log("Text received:", text);

  // Falls neues Gerät und noch Platz: Slot zuweisen
  if (!projectionState[socket.id] && inputOrder.length < 3) {
    inputOrder.push(socket.id);
    projectionState[socket.id] = {
      slot: SLOT_ORDER[inputOrder.length - 1],
      text: "",
    };
  }

  // Nur wenn dieser Client einen Slot hat, Text speichern
  if (projectionState[socket.id]) {
    projectionState[socket.id].text = text;
  }

  // An Output schicken: kompletter Zustand
  io.emit("projection_update", projectionState);
  });


  socket.on("audio_control", async (payload) => {
    const action = payload?.action;

    if (!action || !AUDIO_MAP[action]) {
      return socket.emit("audio_ack", { ok: false, error: "unknown_action" });
    }

    try {
      await AUDIO_MAP[action]();
      socket.emit("audio_ack", { ok: true, action });
    } catch (e) {
      socket.emit("audio_ack", { ok: false, error: e.message });
    }
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
    //Text bleibt bis Reset sichtbar
  });

  socket.on("reset_projection", () => {
  // Kann man als Operator über control UI auslösen
  inputOrder.length = 0;
  for (const key of Object.keys(projectionState)) delete projectionState[key];

  io.emit("projection_update", projectionState);
  });

});

// ----------------------
// Server Start + OSC Test
// ----------------------
server.listen(PORT, async () => {
  console.log(`Server läuft auf http://localhost:${PORT}`);
  console.log(`OSC target: ${OSC_HOST}:${OSC_PORT}`);

  try {
    await AUDIO_MAP.stop_all(); // Test beim Start
  } catch (e) {
    console.error("Initial OSC test failed:", e.message);
  }
});

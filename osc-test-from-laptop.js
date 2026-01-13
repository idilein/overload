// osc-test-from-laptop.js
// Minimaler OSC-Test von deinem Linux-Laptop zum Mac mini

import { Client } from 'node-osc';

// TODO: ANPASSEN: IP des Mac mini und OSC-Port aus Max/Ableton
const OSC_HOST = "10.2.2.70"; // <-- IP des Mac mini hier eintragen
const OSC_PORT = 3000;           // <-- Port aus eurem Ableton/Max-Setup

const oscClient = new Client(OSC_HOST, OSC_PORT);

function sendOscMessage(address, args = []) {
  const payload = Array.isArray(args) ? args : [args];

  oscClient.send(address, ...payload, (error) => {
    if (error) {
      console.error(
        `OSC SEND ERROR to ${OSC_HOST}:${OSC_PORT} (${address} ${JSON.stringify(
          payload
        )}):`,
        error
      );
    } else {
      console.log(
        `OSC sent to ${OSC_HOST}:${OSC_PORT} -> ${address} ${JSON.stringify(
          payload
        )}`
      );
    }
    oscClient.close();
  });
}

// Beispiele – exakt passend zu deinem osc-control.js:

// Szene starten (Index im Ableton-Set, 0-basiert)
function testStartScene() {
  sendOscMessage("start_scene", 0);
}

// Clip starten: trackIndex, clipIndex (0-basiert)
function testStartClip() {
  sendOscMessage("start_clip", [1, 0]); // Track 1, Clip 0
}

// Alle Clips stoppen
function testStopAll() {
  sendOscMessage("stop_all", 0);
}

// HIER auswählen, was du testen willst:
testStartClip();
// testStartScene();
//testStopAll();

# overload

This project is an interactive media installation that explores the experience of reading difficulty (dyslexia-like distortions) and attentional overload (ADHD-like distraction).

Participants type text on an input device (e.g. iPad or laptop). The text is transmitted to a server, transformed, and displayed via a projection interface. In addition, a multi-channel audio environment is controlled via OSC to simulate distraction.

The system consists of:

* a Node.js web server
* multiple input clients
* a projection output client
* an operator control interface
* OSC communication to Ableton Live

Real-time communication between clients and server is implemented using WebSockets.

---

## Features

* real-time text transfer from input device to projection
* dyslexia-style text distortion
* multi-device input support
* dedicated projection interface for beamer output
* operator control UI for distraction audio
* OSC routing to Ableton Live
* cross-platform (Linux / macOS / Windows)

---

## Requirements

* Node.js 16+
* npm
* Git
* (optional) Ableton Live with Max for Live for OSC processing

---

## Installation and Setup

Clone the repository:

```bash
git clone https://github.com/idilein/overload.git
cd overload
```

Install dependencies:

```bash
npm install
```

Start the server:

```bash
node server.js
```

The server will be available at:

```
http://localhost:3000
```

---

## Interfaces

### Input interface (for users)

```
http://localhost:3000/input
```

---

### Projection output (beamer)

```
http://localhost:3000/output
```

Displays transformed text for projection.

---

### Audio control interface (operator only)

```
http://localhost:3000/control
```

Triggers OSC-based control of the distraction audio environment.

---

## OSC Integration

The server sends OSC messages to Ableton Live running on a Mac mini.

OSC configuration is defined in `server.js`:

```js
const OSC_HOST = "10.2.2.70";
const OSC_PORT = 3000;
```

The server machine and the Mac mini must be on the same network.
If not, the web application will still work, but audio control will not.

---

## Audio Command Mapping

Example mapping:

```js
const AUDIO_MAP = {
  scene_low: () => sendOsc("start_scene", 0),
  scene_mid: () => sendOsc("start_scene", 1),
  scene_high: () => sendOsc("start_scene", 2),
  clip_test: () => sendOsc("start_clip", [1, 0]),
  stop_all: () => sendOsc("stop_all", 0),
};
```

Commands are triggered via WebSocket messages from the control interface.

---

## Notes

* This project simulates perceptual effects and does not make clinical claims

---

## Credits

Developed as part of the university course:

“Cognition and Perception of Interactive Media”


const path = require("path");
const express = require("express");
const http = require ("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Static Files (HTML, CSS, JS)
app.use(express.static(path.join(__dirname, "public")));

// Optionale „schöne“ Routen /input und /output
app.get("/input", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "input.html"));
});

app.get("/output", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "output.html"));
});

// WebSocket-Handling falls mit SENDEN BUTTON
io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  socket.on("submit_text", (data) => {
    console.log("Text received:", data.text);

    // An alle Output-Clients senden
    io.emit("new_text", { text: data.text });
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server läuft auf http://localhost:${PORT}`);
});
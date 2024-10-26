// server.js (Next.js custom server with Express)
const express = require("express");
const next = require("next");
const { OAuth2Client } = require("google-auth-library");
const WebSocket = require("ws");
const { v4: uuidv4 } = require("uuid");

const dev = process.env.NEXT_PUBLIC_NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();
  server.use(express.json());
  const PORT = process.env.NEXT_PUBLIC_PORT || 3000;
  const CLIENT_ID = process.env.NEXT_PUBLIC_CLIENT_ID; // Get this from Google console

  const oAuth2Client = new OAuth2Client(CLIENT_ID);
  // Start HTTP server
  const httpServer = server.listen(PORT, () => {
    console.log(`> Next.js server running on http://localhost:${PORT}`);
  });

  // Initialize WebSocket server
  const wss = new WebSocket.Server({ server: httpServer, path: "/ws" });
  const sockets = {}; // Store WebSocket connections

  wss.on("connection", (ws) => {
    const sessionId = uuidv4();
    sockets[sessionId] = ws;
    console.log(
      `WebSocket connection established with sessionId: ${sessionId}`
    );

    // Send the sessionId to the client
    ws.send(JSON.stringify({ sessionId }));

    ws.on("close", () => {
      console.log(`WebSocket connection closed for sessionId: ${sessionId}`);
      delete sockets[sessionId];
    });
  });

  // API Route to authenticate from mobile
  server.post("/api/authenticate", async (req, res) => {
    const { sessionId, idToken } = req.body;
    try {
      // Verify the ID token with Google
      const ticket = await oAuth2Client.verifyIdToken({
        idToken,
        audience: CLIENT_ID, // Specify the CLIENT_ID of the app that accesses the backend
      });

      const payload = ticket.getPayload();

      // Proceed with your logic (e.g., find or create user in your DB)

      if (sockets[sessionId]) {
        sockets[sessionId].send(JSON.stringify({ success: true, payload }));
        res.json({ success: true });
      } else {
        res.json({ success: false, message: "Invalid session ID" });
      }
    } catch (error) {
      console.error("Error verifying Google ID token:", error);
      res.status(401).json({ success: false, message: "Invalid Google token" });
    }
  });

  // Default catch-all handler to allow Next.js to handle all other routes
  server.all("*", (req, res) => {
    return handle(req, res);
  });
});

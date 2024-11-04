// server.js (Next.js custom server with Express)
const express = require("express");
const next = require("next");
const { OAuth2Client } = require("google-auth-library");
const WebSocket = require("ws");
const { v4: uuidv4 } = require("uuid");
const admin = require("firebase-admin");
const serviceAccount = require("./src/utils/googleAnalytics.json");

const dev = process.env.NEXT_PUBLIC_NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

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
    let sessionId = uuidv4(); // Initial session ID
    sockets[sessionId] = ws;

    console.log(
      `WebSocket connection established with sessionId: ${sessionId}`
    );

    // Send the initial session ID to the client
    ws.send(JSON.stringify({ sessionId }));

    // Function to generate a new session ID and update the client
    const generateNewSessionId = () => {
      // Remove the old session ID from the sockets store
      delete sockets[sessionId];

      // Generate a new session ID and store it
      sessionId = uuidv4();
      sockets[sessionId] = ws;

      console.log(`New sessionId generated: ${sessionId}`);

      // Send the new session ID to the client
      ws.send(JSON.stringify({ sessionId }));
    };

    // Generate a new session ID every 1 minute
    const intervalId = setInterval(generateNewSessionId, 15000); // 60 seconds

    // Handle WebSocket close event
    ws.on("close", () => {
      console.log(`WebSocket connection closed for sessionId: ${sessionId}`);

      // Cleanup: Remove session and clear interval
      delete sockets[sessionId];
      clearInterval(intervalId);
    });
  });

  server.get("/test", async (req, res) => {
    res.json({ success: true, message: "Working" });
  });

  // API Route to authenticate from mobile
  server.post("/api/authenticate", async (req, res) => {
    const { sessionId, token } = req.body;

    try {
      const decodedToken = await admin.auth().verifyIdToken(token);
      // Verify the ID token with Google
      // const ticket = await oAuth2Client.verifyIdToken({
      //   idToken,
      //   audience: CLIENT_ID, // Specify the CLIENT_ID of the app that accesses the backend
      // });

      // const payload = ticket.getPayload();

      if (sockets[sessionId]) {
        sockets[sessionId].send(
          JSON.stringify({ success: true, payload: decodedToken, token })
        );
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

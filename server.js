// server.js (Next.js custom server with Express)
const express = require("express");
const next = require("next");
const { OAuth2Client } = require("google-auth-library");
const WebSocket = require("ws");
const { v4: uuidv4 } = require("uuid");
const admin = require("firebase-admin");
// const serviceAccount = require("./.firebase/googleAnalytics.json");

const dev = process.env.NEXT_PUBLIC_NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();
  server.use(express.json());
  const PORT = process.env.NEXT_PUBLIC_PORT || 3000;
  const CLIENT_ID = process.env.NEXT_PUBLIC_CLIENT_ID; // Get this from Google console
  const firebaseCred = {
    type: process.env.NEXT_PUBLIC_TYPE,
    project_id: process.env.NEXT_PUBLIC_project_id,
    private_key_id: process.env.NEXT_PUBLIC_private_key_id,
    private_key: process.env.NEXT_PUBLIC_private_key,
    client_email: process.env.NEXT_PUBLIC_client_email,
    client_id: process.env.NEXT_PUBLIC_client_id,
    auth_uri: process.env.NEXT_PUBLIC_auth_uri,
    token_uri: process.env.NEXT_PUBLIC_token_uri,
    auth_provider_x509_cert_url:
      process.env.NEXT_PUBLIC_auth_provider_x509_cert_url,
    client_x509_cert_url: process.env.NEXT_PUBLIC_client_x509_cert_url,
    universe_domain: process.env.NEXT_PUBLIC_universe_domain,
  };

  const serviceAccount = firebaseCred;
  console.log({ serviceAccount });

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });

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
    console.log({ token });
    try {
      const decodedToken = await admin.auth().verifyIdToken(token);
      console.log({ decodedToken });
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

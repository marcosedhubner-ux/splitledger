import { createServer } from "node:http";
import { Server } from "socket.io";
import { createApp } from "./app.js";
import { env } from "./config/env.js";
import { registerRealtimeServer } from "./realtime/socket.js";

const app = createApp();
const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: { origin: env.WEB_ORIGIN, credentials: true },
});

registerRealtimeServer(io);

httpServer.listen(env.PORT, () => {
  console.log(`SplitLedger API listening on port ${env.PORT}`);
});

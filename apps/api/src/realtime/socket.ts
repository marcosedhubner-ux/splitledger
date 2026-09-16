import type { Server, Socket } from "socket.io";
import { verifyToken } from "../modules/auth/auth.service.js";
import { prisma } from "../db/client.js";

let ioInstance: Server | null = null;

function parseCookie(cookieHeader: string | undefined, name: string): string | undefined {
  if (!cookieHeader) return undefined;
  const match = cookieHeader.split("; ").find((entry) => entry.startsWith(`${name}=`));
  return match?.slice(name.length + 1);
}

export function registerRealtimeServer(io: Server): void {
  ioInstance = io;

  io.use((socket: Socket, next) => {
    const token = parseCookie(socket.handshake.headers.cookie, "splitledger_token");
    if (!token) {
      next(new Error("Unauthorized"));
      return;
    }

    try {
      socket.data.userId = verifyToken(token).userId;
      next();
    } catch {
      next(new Error("Unauthorized"));
    }
  });

  io.on("connection", (socket: Socket) => {
    void joinUserGroups(socket);
  });
}

async function joinUserGroups(socket: Socket): Promise<void> {
  const memberships = await prisma.groupMember.findMany({
    where: { userId: socket.data.userId },
    select: { groupId: true },
  });

  for (const membership of memberships) {
    socket.join(`group:${membership.groupId}`);
  }
}

export function broadcastToGroup(groupId: string, event: string, payload: unknown): void {
  if (!ioInstance) return;
  ioInstance.to(`group:${groupId}`).emit(event, payload);
}

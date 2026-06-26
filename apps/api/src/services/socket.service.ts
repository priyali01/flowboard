import { Server, Socket } from 'socket.io';
import { Server as HttpServer } from 'http';
import jwt from 'jsonwebtoken';

class SocketService {
  public io: Server | null = null;
  private userSockets: Map<string, string[]> = new Map();

  init(server: HttpServer) {
    this.io = new Server(server, {
      cors: {
        origin: '*', 
        methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'],
      },
    });

    this.io.use((socket, next) => {
      const token = socket.handshake.auth.token;
      if (!token) {
        return next(new Error('Authentication error: Token missing'));
      }

      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret') as { userId: string };
        (socket as any).userId = decoded.userId;
        next();
      } catch (err) {
        return next(new Error('Authentication error: Invalid token'));
      }
    });

    this.io.on('connection', (socket: Socket) => {
      const userId = (socket as any).userId;
      
      const sockets = this.userSockets.get(userId) || [];
      sockets.push(socket.id);
      this.userSockets.set(userId, sockets);

      socket.on('disconnect', () => {
        const userSocks = this.userSockets.get(userId) || [];
        this.userSockets.set(userId, userSocks.filter(id => id !== socket.id));
      });
    });
  }

  emitToUser(userId: string, event: string, data: any) {
    if (!this.io) return;
    const socketIds = this.userSockets.get(userId);
    if (socketIds && socketIds.length > 0) {
      socketIds.forEach(id => {
        this.io!.to(id).emit(event, data);
      });
    }
  }
}

export const socketService = new SocketService();
